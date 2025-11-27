import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    walletAddress: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", UserSchema);
export default User;
