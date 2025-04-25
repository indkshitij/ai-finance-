import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    name: { type: String},
    type: { type: String, enum: ["CURRENT","SAVINGS"] },
    balance: { type: Number, default: 0 },
    isDefault: { type: Boolean },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const accountModel =
  mongoose.models.account || mongoose.model("account", accountSchema);

export default accountModel;
