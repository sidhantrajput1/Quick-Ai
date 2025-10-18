import sql from "../configs/db.js";

// ✅ Get user creations
export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth(); 
    const creations =
      await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;

    res.json({
      success: true,
      creations,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get published creations
export const getPublishedCreations = async (req, res) => {
  try {
    const creations =
      await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;

    res.json({
      success: true,
      creations,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Toggle like functionality
export const toggleLikeCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    // Find creation
    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;
    if (!creation) {
      return res.json({
        success: false,
        message: "Creation not found",
      });
    }

    // Parse current likes safely
    let currentLikes = creation.likes || [];
    if (typeof currentLikes === "string") {
      currentLikes = currentLikes.replace(/[{}]/g, "").split(",").filter(Boolean);
    }

    const userIdStr = userId.toString();
    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((u) => u !== userIdStr);
      message = "Creation unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation liked";
    }

    // Update database
    await sql`
      UPDATE creations
      SET likes = ${sql.array(updatedLikes, 'text')}
      WHERE id = ${id}
    `;

    // Fetch updated creations for the frontend
    const creations =
      await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;

    res.json({
      success: true,
      message,
      creations, // ✅ send updated list
    });
  } catch (error) {
    console.error("Error in toggleLikeCreations:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
