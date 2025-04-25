import express from "express";
import {
  getTransactionsByAccount,
  transactionDelete,
  addTransaction,
} from "../controller/transactionController.js";
import authUser from "../middlewares/authUser.js";

const transactionRouter = express.Router();

transactionRouter.get("/:accountId", authUser, getTransactionsByAccount);
transactionRouter.delete("/delete", authUser, transactionDelete);
transactionRouter.post("/add", authUser, addTransaction);

export default transactionRouter;
