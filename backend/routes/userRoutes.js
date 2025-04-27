import express from "express";
import { findOrCreateUser, logoutUser } from "../controller/userController.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post("/user-sync", findOrCreateUser);
userRouter.post("/logout", logoutUser);

export default userRouter;
