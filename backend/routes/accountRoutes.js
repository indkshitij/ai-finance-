import express from "express";
import {
  createAccount,
  getUserAccount,
  changeDefaultSetting,
  getSingleAccountById,
  deleteAccount,
} from "../controller/accountController.js";
import authUser from "../middlewares/authUser.js";

const accountRouter = express.Router();

accountRouter.post("/create", authUser, createAccount);
accountRouter.get("/fetch", authUser, getUserAccount);
accountRouter.get("/:accountId", authUser, getSingleAccountById);
accountRouter.post("/change-default", authUser, changeDefaultSetting);
accountRouter.delete("/delete/:accountId", authUser, deleteAccount);

export default accountRouter;