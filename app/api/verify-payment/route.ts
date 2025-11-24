import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { MongoClient } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { txHash, expectedAmount } = await request.json();
    
    if (!txHash || !expectedAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize provider
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
    
    // Get transaction details
    const [tx, receipt] = await Promise.all([
      provider.getTransaction(txHash),
      provider.getTransactionReceipt(txHash)
    ]);

    if (!tx || !receipt) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Verify transaction
    const isSuccessful = receipt.status === 1;
    const isToCompanyWallet = tx.to?.toLowerCase() === process.env.NEXT_PUBLIC_COMPANY_WALLET?.toLowerCase();
    const isAmountCorrect = tx.value.toString() === expectedAmount;

    if (!isSuccessful || !isToCompanyWallet || !isAmountCorrect) {
      return NextResponse.json(
        { 
          verified: false,
          details: {
            isSuccessful,
            isToCompanyWallet,
            isAmountCorrect,
            expected: expectedAmount,
            actual: tx.value.toString()
          }
        },
        { status: 400 }
      );
    }

    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    await db.collection('payments').insertOne({
      txHash,
      from: tx.from,
      to: tx.to,
      value: tx.value.toString(),
      blockNumber: receipt.blockNumber,
      timestamp: new Date(),
      verified: true
    });

    return NextResponse.json({
      verified: true,
      txHash,
      blockNumber: receipt.blockNumber,
      from: tx.from,
      to: tx.to,
      value: tx.value.toString()
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
