import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const findOrCreateUser = async (req, res) => {
  try {
    const { clerkUser } = req.body;
    if (!clerkUser) {
      return res.status(400).json({
        success: false,
        message: "Clerk user info missing in request body",
      });
    }

    let user = await userModel.findOne({ clerkUserId: clerkUser.id });

    const name = `${clerkUser.firstName} ${clerkUser.lastName}`;
    const imageUrl = clerkUser.imageUrl;
    const email = clerkUser.emailAddresses[0].emailAddress;

    if (!user) {
      user = await userModel.create({
        clerkUserId: clerkUser.id,
        name,
        imageUrl,
        email,
      });
    } else {
      const hasChanges =
        user.name !== name ||
        user.imageUrl !== imageUrl ||
        user.email !== email;

      if (hasChanges) {
        user = await userModel.findByIdAndUpdate(user._id, {
          name,
          imageUrl,
          email,
        });
      }
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User synced successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in user sync:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create or sync user",
      error: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong during logout",
      error: error.message,
    });
  }
};

