import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"

const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing auth_token cookie",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedToken.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user ID found in token",
      });
    }

    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please create an account.",
      });
    }

    req.user = existingUser;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to verify user",
      error: error.message,
    });
  }
};

export default authUser;
