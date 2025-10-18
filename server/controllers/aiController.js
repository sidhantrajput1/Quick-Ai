import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse-fixed";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;

    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 50) {
      return res.json({
        success: false,
        message: "Limit reached. upgrade to continue",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;
    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES(${userId}, ${prompt}, ${content}, 'article')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;

    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 50) {
      return res.json({
        success: false,
        message: "Limit reached. upgrade to continue",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        // { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices[0].message.content;
    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES(${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;

    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 50) {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    // ✅ Prepare form-data properly
    const formData = new FormData();
    formData.append("prompt", prompt);

    // ✅ Send to ClipDrop API
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    // ✅ Convert to base64 and upload to Cloudinary
    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;
    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    // ✅ Save to DB
    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    // ✅ Increment usage if not premium
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("Image Generation Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;

    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 50) {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background ",
        },
      ],
    });

    await sql`
  INSERT INTO creations (user_id, prompt, content, type, publish)
  VALUES (${userId}, ${"Remove background from image"}, ${secure_url}, 'image', false)
`;

    // if (plan !== "premium") {
    //   await clerkClient.users.updateUserMetadata(userId, {
    //     privateMetadata: {
    //       free_usage: free_usage + 1,
    //     },
    //   });
    // }

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("Image Generation Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;


    const plan = req.plan;
    const free_usage = req.free_usage;

    // this is for testing
    if (plan !== "premium" && free_usage >= 50) {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    // this is for premium member , enable before deploy
    // if (plan !== "premium") {
    //   return res.json({
    //     success: false,
    //     message: "This feature is only available for premium subscriptions",
    //   });
    // }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [
        {
          effect: `gen_remove:${object}`,
        },
      ],
      resource_type: "image",
    });

    await sql`
    INSERT INTO creations (user_id, prompt, content, type, publish)
    VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image', false)
  `;

    // if (plan !== "premium") {
    //   await clerkClient.users.updateUserMetadata(userId, {
    //     privateMetadata: {
    //       free_usage: free_usage + 1,
    //     },
    //   });
    // }

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.error("Image Generation Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;
    const free_usage = req.free_usage;

    //  Free plan limit check (for testing)
    if (plan !== "premium" && free_usage >= 220) {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    //  Resume size validation
    if (resume.size > 6 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file size exceeds allowed size (6 MB).",
      });
    }

    //  Read PDF file and extract text
    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);
    const textContent = pdfData.text.trim();

    //  AI prompt
    const prompt = `
    Review the following resume and provide detailed, constructive feedback.
    Include:
    - Strengths
    - Weaknesses
    - Areas of improvement
    - Suggestions for formatting or wording

    Resume Content:
    ----------------------
    ${textContent}
    `;

    // 🤖 Call Gemini API (via OpenAI SDK)
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    // 💾 Store result in your DB
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'Review Resume')
    `;

    // 🔁 Update free usage count for non-premium users
    // Uncomment this block before deploy
    /*
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    */

    // ✅ Send response
    res.json({ success: true, content });
  } catch (error) {
    console.error("Resume Review Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
