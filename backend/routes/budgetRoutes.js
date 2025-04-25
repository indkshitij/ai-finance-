import express from "express";
import cron from "node-cron";
import {
  getBudget,
  createOrUpdateBudget,
  resetBudgetForNewMonth,
} from "../controller/budgetController.js";
import authUser from "../middlewares/authUser.js";

const budgetRouter = express.Router();

budgetRouter.post("/setup", authUser, createOrUpdateBudget);
budgetRouter.get("/get", authUser, getBudget);

// Runs at 00:00 on the 1st day of every month
cron.schedule("0 0 1 * *", async () => {
  console.log("🔄 Cron Job: Resetting budget for new month...");
  await resetBudgetForNewMonth();
});

export default budgetRouter;
