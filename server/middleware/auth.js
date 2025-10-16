import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();
    const hasPremiumPlan = await has({ plan: "premium" });

    const user = await clerkClient.users.getUser(userId);

    // Ensure privateMetadata always exists
    const freeUsage = user.privateMetadata?.free_usage ?? 0;

    if (!hasPremiumPlan) {
      req.free_usage = freeUsage;
    } else {
      req.free_usage = 0;
    }

    req.plan = hasPremiumPlan ? "premium" : "free";

    next();
  } catch (error) {
    console.log("Auth Middleware Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
