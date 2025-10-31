import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create a compound index for faster lookups
userSchema.index({ address: 1 }, { unique: true });

// Check if the model has already been compiled
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
