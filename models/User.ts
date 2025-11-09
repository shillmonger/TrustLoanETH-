import mongoose, { Document } from 'mongoose';

interface IUser {
  address: string;
  walletProvider: WalletProvider;
  email?: string | null;
  createdAt: Date;
  lastLogin: Date;
}

interface IUserDocument extends IUser, Document {}

interface IUserJSON extends Omit<IUser, '_id' | '__v'> {
  id: string;
}

// Supported wallet providers
export const WALLET_PROVIDERS = ['metamask', 'trustwallet', 'okxwallet'] as const;
export type WalletProvider = typeof WALLET_PROVIDERS[number];

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^0x[a-fA-F0-9]{40}$/, 'Please use a valid Ethereum address'],
    },
    walletProvider: {
      type: String,
      enum: WALLET_PROVIDERS,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please use a valid email address'],
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (doc: IUserDocument, ret: IUser & { _id: any }): IUserJSON => {
        return {
          id: ret._id.toString(),
          address: ret.address,
          walletProvider: ret.walletProvider,
          email: ret.email,
          createdAt: ret.createdAt,
          lastLogin: ret.lastLogin
        };
      },
    },
  }
);

// Check if the model has already been compiled
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
