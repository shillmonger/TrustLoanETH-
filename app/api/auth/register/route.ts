import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User, { WALLET_PROVIDERS, WalletProvider } from '@/models/User';
import { ethers } from 'ethers';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const { address, walletProvider, email } = await request.json();
    
    // Validate input
    if (!address || !ethers.isAddress(address)) {
      return NextResponse.json(
        { success: false, message: 'Invalid Ethereum address' },
        { status: 400 }
      );
    }

    if (!walletProvider || !(WALLET_PROVIDERS as readonly string[]).includes(walletProvider.toLowerCase())) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid wallet provider. Must be one of: ${WALLET_PROVIDERS.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { address: address.toLowerCase() },
        ...(email ? [{ email: email.toLowerCase() }] : [])
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: existingUser.address === address.toLowerCase() 
            ? 'Wallet address already registered' 
            : 'Email already registered' 
        },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      address: address.toLowerCase(),
      walletProvider: walletProvider.toLowerCase(),
      ...(email && { email: email.toLowerCase() }),
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        address: user.address,
        walletProvider: user.walletProvider,
        email: user.email,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
