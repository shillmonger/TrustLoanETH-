"use client";

import { useEffect, useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { toast } from "react-hot-toast";
import { FaShieldAlt } from "react-icons/fa";

export default function LoanDetailsModal({
  loanAmount,
  onClose,
}: {
  loanAmount: number;
  onClose: () => void;
}) {
  const { address } = useAccount();
  const sendTx = useSendTransaction();

  const adminWallet = process.env.NEXT_PUBLIC_COMPANY_WALLET! as `0x${string}`;

  const [ethPrice, setEthPrice] = useState<number | null>(null);

  // Load live ETH price
  useEffect(() => {
    async function loadPrice() {
      try {
        const res = await fetch("/api/eth-price");
        const data = await res.json();
        setEthPrice(data.price);
      } catch {
        toast.error("Failed to load ETH price");
      }
    }
    loadPrice();
  }, []);

  if (!ethPrice) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg">
          <p>Loading live ETH rate...</p>
        </div>
      </div>
    );
  }

  const depositUSD = loanAmount * 0.1;
  const depositETH = depositUSD / ethPrice;

  const handleConfirm = () => {
    if (!address) {
      toast.error("Wallet not connected");
      return;
    }

    sendTx.sendTransaction(
      {
        to: adminWallet,
        value: parseEther(depositETH.toString()),
        account: address,
        gas: BigInt(21000),
      },
      {
        onSuccess: () => {
          toast.success("Payment confirmed. Loan processing will start shortly.");
          onClose();
        },
        onError: (err: any) => {
          toast.error("Transaction failed: " + err.message);
        },
      }
    );
  };

  return (
    <div className="fixed  p-3 inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">

        {/* Top Blue Header */}
        <div className="bg-blue-600 text-white px-6 py-5">
          <h2 className="text-xl font-bold">Loan Request Confirmation</h2>
          <p className="text-sm text-blue-100">
            Review details before proceeding
          </p>
        </div>

        <div className="p-6 space-y-6">

          {/* Loan Amount Box */}
          <div className="border rounded-xl p-4 bg-gray-50">
            <p className="text-gray-500 text-sm">Loan Amount</p>
            <h3 className="text-3xl font-bold mt-1">${loanAmount}</h3>
            <p className="text-gray-400 mt-1 text-sm">Asset: <strong>**ETH**</strong></p>
          </div>

          {/* Collateral Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaShieldAlt className="text-yellow-600 text-lg" />
              <h3 className="text-gray-800 font-semibold">Collateral Required</h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Collateral (10% of loan)</span>
                <span className="font-semibold">${depositUSD.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Current ETH Price</span>
                <span>${ethPrice.toLocaleString()}/ETH</span>
              </div>

              <div className="flex justify-between pt-2 border-t font-semibold">
                <span>Total Collateral Required</span>
                <span className="text-blue-600">
                  {depositETH.toFixed(6)} ETH
                </span>
              </div>
            </div>
          </div>

          {/* Warning Box */}
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl text-sm leading-relaxed">
            This transaction will be processed on-chain.
            Please ensure you have sufficient ETH for gas fees.
            (If authorization doesn’t work, run the site in your wallet browser
            for faster processing.)
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="w-1/2 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition font-medium cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              disabled={sendTx.isPending}
              className="w-1/2 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-blue-300 cursor-pointer"
            >
              {sendTx.isPending ? "Waiting for Wallet…" : "Confirm in Wallet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
