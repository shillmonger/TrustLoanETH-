// Dashboard updated to match the UI layout shown in screenshot

"use client";

import { useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import LoanModal from "@/components/LoanModal";
import { FiFolder } from "react-icons/fi";


export default function DashboardPage() {
  const loanAmounts = [500, 1000, 2500, 5000, 10000, 15000, 20000, 30000];
  const [selectedLoan, setSelectedLoan] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [liquidityIncrease, setLiquidityIncrease] = useState(0);

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  // LIVE EVENTS
  const [liveEvents, setLiveEvents] = useState([
    { shortAddr: "0x1648", action: "repaid 1.67 ETH ($3,340) loan" },
    { shortAddr: "0x1BE4", action: "closed 14.08 ETH ($28,160) loan early" },
    { shortAddr: "0x0E43", action: "adjusted collateral ratio to 114%" },
    { shortAddr: "0xAAD7", action: "added 8.51 ETH ($17,020) to collateral" },
    { shortAddr: "0x58E6", action: "borrowed 2.84 ETH ($5,680)" },
  ]);

  useEffect(() => {
    setMounted(true);
    setLiquidityIncrease(Math.floor(3000 + Math.random() * 5000));
  }, []);

  // Live events simulation with random delays between 5-7 seconds
  useEffect(() => {
    const generateRandomEvent = () => {
      const actions = [
        `added ${randomEth(1, 20)} ETH ($${randomUsd(2000, 40000)}) to collateral`,
        `borrowed ${randomEth(0.5, 10)} ETH ($${randomUsd(1000, 20000)})`,
        `deposited ${randomEth(0.1, 5)} ETH ($${randomUsd(200, 10000)})`,
        `repaid ${randomEth(1, 8)} ETH ($${randomUsd(2000, 16000)}) loan`,
        "closed loan early",
        "adjusted collateral ratio to 125%",
      ];

      const newEvent = {
        shortAddr: "0x" + Math.random().toString(16).slice(2, 6).toUpperCase(),
        action: actions[Math.floor(Math.random() * actions.length)],
      };

      setLiveEvents((prev) => [newEvent, ...prev.slice(0, 4)]);
    };

    // Initial call
    const timeoutId = setTimeout(() => {
      generateRandomEvent();
      // Set up interval with random delay between 5-7 seconds
      const intervalId = setInterval(generateRandomEvent, 5000 + Math.random() * 2000);
      return () => clearInterval(intervalId);
    }, 5000 + Math.random() * 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Helper functions for realistic values
  function randomEth(min: number, max: number) {
    return (Math.random() * (max - min) + min).toFixed(2);
  }
  
  function randomUsd(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min).toLocaleString();
  }

  const shorten = (addr: string) => addr.slice(0, 6) + "..." + addr.slice(-4);

  return (
    <div className="min-h-screen w-full bg-[#f6f8fc] text-black p-5 lg:px-30">
    {/* // <div className="min-h-screen w-full bg-[#f6f8fc] text-black p-4 sm:p-6 lg: py-8 px-30"> */}
      {/* HEADER */}
      <header className="w-full bg-white shadow-sm border rounded-2xl px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="text-2xl font-extrabold font-bold">Loan Dashboard</h1>
          <span className="px-4 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-full border border-blue-200 font-medium">
            Tier 1 - Verified Borrower
          </span>
        </div>

        {mounted && isConnected && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-sm text-gray-600">
              Connected as: {shorten(address!)}
            </span>
            <button
              onClick={() => {
                disconnect();
                router.push("/");
              }}
              className="px-5 py-2.5 rounded-xl bg-gray-100 border hover:bg-gray-200 text-sm font-medium transition cursor-pointer"
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </header>

      {/* OVERVIEW CARDS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { title: "Active Loans", value: "0" },
          { title: "Collateral Ratio", value: "0%" },
          { title: "Next Repayment", value: "0" },
          { title: "Credit Limit", value: "$30K", highlight: true },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm border p-6 text-center"
          >
            <p className="text-gray-500 text-sm font-medium">{item.title}</p>
            <h2
              className={`text-3xl mt-3 font-bold ${
                item.highlight ? "text-blue-600" : ""
              }`}
            >
              {item.value}
            </h2>
          </div>
        ))}
      </section>


      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* BORROW ASSETS */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-xl font-extrabold mb-6">Borrow Assets</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {loanAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedLoan(amount)}
                className="border-2 border-blue-600 text-blue-600 rounded-xl py-4 font-bold text-lg hover:bg-blue-600 hover:text-white transition-all duration-200 cursor-pointer"
              >
                ${amount.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Collateral Notice */}
<div className="mt-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
  <p className="font-semibold text-yellow-700">Collateral Required:</p>
  <p className="text-yellow-800 mt-1 text-sm">
    You must hold at least 10% of the loan amount. 
    These funds will be locked until repayment.
  </p>
</div>

          
        </div>



        {/* LIVE ACTIVITY — Now 100% matches your screenshot */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-extrabold">Live Activity</h3>
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            </div>
          </div>

          <div className="space-y-4">
            {liveEvents.map((event, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-gray-700 text-sm leading-relaxed animate-fadeIn"
              >
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-mono text-xs font-semibold tracking-wider">
                  {event.shortAddr}
                </span>
                <span>{event.action}</span>
              {/* </span> */}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-5 border-t">
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700">
              <span className="text-green-600">↑</span>
              Vault liquidity increased by ${liquidityIncrease}
            </div>
          </div>
        </div>
      </div>

     {/* ACTIVE LOANS */}
<section className="bg-white rounded-2xl shadow-sm border p-8">
  <h3 className="text-xl font-extrabold mb-6">Active Loans</h3>

  <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
    <FiFolder className="text-gray-300" size={48} />
    <p className="text-gray-400 text-lg">No active loans</p>
  </div>

  <button className="w-full py-4 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
    View All On-Chain
  </button>
</section>

      {/* Loan Modal */}
      {selectedLoan && (
        <LoanModal
          loanAmount={selectedLoan}
          onClose={() => setSelectedLoan(null)}
        />
      )}
    </div>
  );
}