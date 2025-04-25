import mongoose from "mongoose";

const transcationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    transactionType: { type: String, enum: ["INCOME", "EXPENSE"] },
    amount: { type: Number },
    description: { type: String },
    date: { type: Date },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: "account" },
    category: { type: String },
    receiptUrl: { type: String },
    isRecurring: { type: Boolean, default: false },
    recurringInterval: {
      type: String,
      enum: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
    },
    nextRecurringDate: { type: Date },
    lastProcessed: { type: Date },
    status: {
      type: String,
      default: "COMPLETED",
      enum: ["PENDING", "COMPLETED", "FAILED"],
    },
  },
  { timestamps: true }
);

const transcationModel =
  mongoose.models.transcation ||
  mongoose.model("transcation", transcationSchema);

export default transcationModel;
