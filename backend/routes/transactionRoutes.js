import express from "express";
import {
  getTransactionsByAccount,
  transactionDelete,
  addTransaction,
  scanTransaction,
  updateTransaction,
  getTransactionById,
  getDashBoardTransaction,
} from "../controller/transactionController.js";
import authUser from "../middlewares/authUser.js";
import { upload } from "../middlewares/multer.js";
const transactionRouter = express.Router();

transactionRouter.get("/id/:transactionId", authUser, getTransactionById);
transactionRouter.get("/:accountId", authUser, getTransactionsByAccount);
transactionRouter.get(
  "/dashboard/:accountId",
  authUser,
  getDashBoardTransaction
);
transactionRouter.delete("/delete", authUser, transactionDelete);
transactionRouter.post("/add", authUser, addTransaction);
transactionRouter.put("/update/:transactionId", authUser, updateTransaction);
transactionRouter.post(
  "/scan",
  authUser,
  upload.single("image"),
  scanTransaction
);

export default transactionRouter;
