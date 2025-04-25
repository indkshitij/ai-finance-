import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, unique: true },
    email: { type: String, unique: true },
    name: { type: String },
    imageUrl: { type: String },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: "account" }, 
  },
  { timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
