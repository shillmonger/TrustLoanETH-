"use client";

import Nav from "@/components/ui/landing-nav";
import Footer from "@/components/ui/landing-footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Toaster, toast } from "sonner";

export default function LoanOfferPage() {
  const loanOffers = [
    { amount: 500, duration: "30 Days", roi: "10%" },
    { amount: 1000, duration: "30 Days", roi: "10%" },
    { amount: 2500, duration: "30 Days", roi: "10%" },
    { amount: 5000, duration: "30 Days", roi: "10%" },
    { amount: 10000, duration: "30 Days", roi: "10%" },
    { amount: 15000, duration: "30 Days", roi: "10%" },
    { amount: 20000, duration: "30 Days", roi: "10%" },
    { amount: 25000, duration: "30 Days", roi: "10%" },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#F8FAFC] to-white">
      <Nav />

      {/* Toast at the top-center */}
      <Toaster position="top-center" richColors />

      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center mt-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1E2A78] mb-4">
          Loan Offers
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
          Choose the perfect loan amount that fits your needs. Get instant funds
          directly into your wallet — fast, transparent, and secure.
        </p>
      </section>

      {/* Loan Offers Grid */}
      <section className="w-[100%] sm:w-[100%] lg:w-[100%] mx-auto px-2 sm:px-2 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loanOffers.map((offer, i) => (
          <Card
            key={i}
            className="flex flex-col justify-between shadow-md border border-gray-200 bg-white rounded-2xl hover:shadow-lg transition-shadow px-5 lg:px-0"
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#1E2A78] text-center">
                ${offer.amount.toLocaleString()}
              </CardTitle>
            </CardHeader>

            <CardContent className="text-gray-700 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">ROI</span>
                <span className="font-semibold text-[#1E2A78]">{offer.roi}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Duration</span>
                <span className="font-semibold text-[#1E2A78]">
                  {offer.duration}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500 font-semibold mb-2">
                  Loan Benefits:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="text-[#1E2A78] w-4 h-4" /> Instant on-chain
                    disbursement
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-[#1E2A78] w-4 h-4" /> Transparent
                    repayment terms
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-[#1E2A78] w-4 h-4" /> No hidden fees
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-[#1E2A78] w-4 h-4" /> Withdraw anytime
                    after 30 days
                  </li>
                </ul>
              </div>
            </CardContent>

            <div className="p-6 pt-0 px-5 lg:px-6 lg:p-6 lg:pt-0">
              <button
                className="w-full bg-[#1E2A78] hover:bg-[#2F45C0] text-white font-semibold py-3 rounded-xl transition-all cursor-pointer"
                onClick={() => toast("Connect your wallet")}
              >
                Select ${offer.amount} Loan
              </button>
            </div>
          </Card>
        ))}
      </section>

      <Footer />
    </main>
  );
}
