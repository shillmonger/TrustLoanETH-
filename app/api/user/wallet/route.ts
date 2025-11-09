import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import User, { WalletProvider } from '@/models/User';
import dbConnect from '@/lib/db';
import { FlattenMaps } from 'mongoose';

// Define the user document type based on the schema
interface IUserDocument {
  _id: any;
  email?: string;
  address: string;
  walletProvider: WalletProvider;
  createdAt: Date;
  __v?: number;
}

type UserDocument = FlattenMaps<IUserDocument> & {
  _id: any;
  __v: number;
};

// Helper to get user by email or ID
async function getUser(identifier: { email?: string; id?: string }): Promise<UserDocument | null> {
  await dbConnect();
  
  if (identifier.email) {
    return await User.findOne({ email: identifier.email })
      .select('_id email address walletProvider createdAt')
      .lean() as UserDocument | null;
  }
  
  if (identifier.id) {
    return await User.findById(identifier.id)
      .select('_id email address walletProvider createdAt')
      .lean() as UserDocument | null;
  }
  
  return null;
}

// GET: Get user's wallet info
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await getUser({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.address) {
      return NextResponse.json(
        { success: false, message: 'No wallet registered' },
        { status: 404 }
      );
    }

    // For backward compatibility, default to 'metamask' if walletProvider is not set
    const walletProvider = user.walletProvider || 'metamask';

    return NextResponse.json({
      success: true,
      data: {
        userId: user._id,
        walletAddress: user.address,
        walletProvider,
      },
    });
  } catch (error) {
    console.error('Error fetching wallet info:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Update user's wallet info
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { walletAddress, walletProvider } = await request.json();

    // Basic validation
    if (!walletAddress) {
      return NextResponse.json(
        { success: false, message: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Validate wallet provider if provided
    if (walletProvider && !['metamask', 'trustwallet', 'okxwallet'].includes(walletProvider.toLowerCase())) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid wallet provider. Must be one of: metamask, trustwallet, okxwallet' 
        },
        { status: 400 }
      );
    }

    // Update user's wallet info
    await dbConnect();
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        address: walletAddress.toLowerCase(),
        ...(walletProvider && { walletProvider: walletProvider.toLowerCase() })
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: updatedUser._id,
        walletAddress: updatedUser.address,
        walletProvider: updatedUser.walletProvider || 'metamask',
      },
    });
  } catch (error) {
    console.error('Error updating wallet info:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
