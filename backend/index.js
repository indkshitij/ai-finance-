import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import userRouter from "./routes/userRoutes.js";
import accountRouter from "./routes/accountRoutes.js";
import transactionRouter from "./routes/transactionRoutes.js";
import budgetRouter from "./routes/budgetRoutes.js";
import { inngest,functions } from "./config/inngest.js";
import { serve } from "inngest/express";

const app = express();
dotenv.config();
connectDB();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/account", accountRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/budget", budgetRouter);

app.use("/api/inngest", serve({ client: inngest, functions }));

// server invoke
const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`🚀 Serever is Running on port ${port}`);
});
