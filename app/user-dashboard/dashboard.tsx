"use client";

import React from "react";
import { useAccount } from "wagmi";

export default function Dashboard() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Not connected</h1>
          <p className="text-gray-400">Please connect your wallet to see your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-4">User Dashboard</h1>
      <div className="bg-[#0B0E11] p-6 rounded-lg text-white">
        <p><strong>Address:</strong> <span className="font-mono">{address}</span></p>
        {/* add more user data fetched from your DB */}
      </div>
    </div>
  );
}
