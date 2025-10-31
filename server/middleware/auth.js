import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    console.log("Im here : ", req.auth());
    const { userId } = req.auth();
    console.log("userId: ", userId);

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Missing userId" });
    }

    const user = await clerkClient.users.getUser(userId);

    if (user.privateMetadata.role !== "admin") {
      return res.json({ success: false, message: "Not Authorized" });
    }

    next();
  } catch (error) {
    console.error("protectAdmin error:", error.message);
    return res.json({
      success: false,
      message: "Not Authorized, please check your login again",
    });
  }
};
