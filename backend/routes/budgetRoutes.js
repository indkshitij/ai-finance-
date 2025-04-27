import express from "express";
import {
  getBudget,
  createOrUpdateBudget,
} from "../controller/budgetController.js";
import authUser from "../middlewares/authUser.js";

const budgetRouter = express.Router();

budgetRouter.post("/setup", authUser, createOrUpdateBudget);
budgetRouter.get("/get", authUser, getBudget);


export default budgetRouter;
