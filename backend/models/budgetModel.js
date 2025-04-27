import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },
    month: { type: Number }, // 0 = Jan, 11 = Dec
    monthName: { type: String },
    year: { type: Number },
    amount: { type: Number, required: true },
    lastAlertSent: { type: Date, default: null },
    alertThreshold: { type: Number, default: 80 },
    isRecurring: { type: Boolean, default: false },
    recurrence: {
      type: String,
      enum: ["MONTHLY", "YEARLY", "NONE"],
      default: "MONTHLY",
    },
  },
  { timestamps: true }
);

const budgetModel =
  mongoose.models.budget || mongoose.model("budget", budgetSchema);

export default budgetModel;
