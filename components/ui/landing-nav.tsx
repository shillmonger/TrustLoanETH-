"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function LandingNav() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string, closeMenu?: () => void) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
    if (closeMenu) closeMenu();
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0B0E11] text-white shadow-lg z-50 px-4 py-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-1">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl sm:text-3xl font-extrabold focus:outline-none hover:text-[#61A9FF] transition-colors"
        >
          TrustLoanETH
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            href="/landing-page/loan-offers"
            className="hover:text-[#61A9FF] transition-colors"
          >
            Loan Offers
          </Link>
          <button
            onClick={() => scrollToSection("faq")}
            className="hover:text-[#61A9FF] transition-colors"
          >
            FAQ
          </button>
          <ConnectButton
            accountStatus="address"
            chainStatus="icon"
            showBalance={false}
            label="Connect Wallet"
          />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-x-0 bg-[#0B0E11] backdrop-blur-lg rounded-b-2xl shadow-xl transition-all duration-300 ease-in-out transform origin-top ${
          isOpen ? "scale-y-100 opacity-100 max-h-[500px]" : "scale-y-0 opacity-0 max-h-0"
        }`}
      >
        <div className="flex flex-col space-y-6 px-6 py-6">
          <Link
            href="/landing-page/loan-offers"  
            onClick={() => setIsOpen(false)}
            className="hover:text-[#61A9FF] transition-colors text-lg"
          >
            Loan Offers
          </Link>
          <button
            onClick={() => scrollToSection("faq", () => setIsOpen(false))}
            className="hover:text-[#61A9FF] transition-colors text-left text-lg"
          >
            FAQ
          </button>

          <div className="mt-4 w-full">
            <ConnectButton
              accountStatus="address"
              chainStatus="icon"
              showBalance={false}
              label="Connect Wallet"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
