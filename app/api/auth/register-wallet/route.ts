import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress)
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );

    await connectDB();

    // Check if wallet exists
    let user = await User.findOne({ walletAddress });

    if (!user) {
      user = await User.create({ walletAddress });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
