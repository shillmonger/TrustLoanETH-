import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

interface RequestBody {
  address?: string;
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body: RequestBody = await request.json();
    const address = body?.address?.toLowerCase();

    // Validate the address
    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Find or create the user
    const user = await User.findOneAndUpdate(
      { address },
      {
        $set: { address },
        $setOnInsert: { createdAt: new Date() },
        $currentDate: { lastLogin: true },
      },
      { upsert: true, new: true }
    );

    // Return the user data (excluding sensitive fields if any)
    const userData = {
      address: user.address,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };

    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    console.error('Error in save-user API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add TypeScript type for the request handler
export type { RequestBody as SaveUserRequestBody };
