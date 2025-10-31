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
      <div className="max-w-7xl mx-auto py-1 flex justify-between items-center">
        {/* Logo now links to homepage */}
        <Link
          href="/"
          className="text-2xl sm:text-3xl font-bold focus:outline-none hover:text-[#61A9FF] transition-colors"
        >
          TrustLoanETH
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <button
            onClick={() => scrollToSection("how")}
            className="hover:text-[#61A9FF] transition-colors"
          >
            How it Works
          </button>

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

          {/* Only Connect Wallet looks like a button */}
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
        className={`md:hidden bg-[#0B0E11] overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-4 px-4 sm:px-6 py-6 border-t border-gray-700">
          <button
            onClick={() => scrollToSection("how", () => setIsOpen(false))}
            className="hover:text-[#61A9FF] transition-colors text-left"
          >
            How it Works
          </button>

          <Link
            href="/landing-page/loan-offers"
            onClick={() => setIsOpen(false)}
            className="hover:text-[#61A9FF] transition-colors text-left"
          >
            Loan Offers
          </Link>

          <button
            onClick={() => scrollToSection("faq", () => setIsOpen(false))}
            className="hover:text-[#61A9FF] transition-colors text-left"
          >
            FAQ
          </button>

          {/* Connect Wallet stays button-style */}
          <div className="w-full mt-2">
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