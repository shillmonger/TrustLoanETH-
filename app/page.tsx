"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useAccount, useConnect } from 'wagmi';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Nav from "@/components/ui/landing-nav";
import Footer from "@/components/ui/landing-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { toast } from 'sonner';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// helper function for counting animation
function useCountUp(target: number, duration = 5000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const stepTime = 16; // ~60fps
    const steps = Math.ceil(duration / stepTime);
    const increment = target / steps;

    const counter = setInterval(() => {
      start += increment;
      if (start >= target) {
        clearInterval(counter);
        setCount(target);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(counter);
  }, [target, duration]);

  return Math.floor(count);
}

export default function Home() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { connect, connectors } = useConnect();
  const liquidity = useCountUp(12482310);
  const vaults = useCountUp(19);
  const success = useCountUp(99.4);

  // Handle wallet connection and user save
  useEffect(() => {
    const saveUser = async () => {
      if (!isConnected || !address) return;
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/save-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address }),
        });

        const data = await response.json();
        
        if (response.ok) {
          // Show success message and redirect to dashboard
          toast.success('Wallet connected successfully!');
          router.push('/user-dashboard/dashboard');
        } else {
          throw new Error(data.error || 'Failed to save user');
        }
      } catch (error) {
        console.error('Error saving user to MongoDB:', error);
        toast.error('Failed to connect wallet. Please try again.');
        // Disconnect wallet on error to allow retry
        if (isConnected) {
          const { disconnect } = await import('wagmi/actions');
          disconnect();
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected && address) {
      saveUser();
    }
  }, [address, isConnected, router]);

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#F8FAFC] to-white">
      <Nav />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto flex-grow flex flex-col items-center justify-center text-center px-6 py-12 sm:py-16 md:py-24 mt-30 sm:mt-16 md:mt-20">
        <h1 className="text-5xl mt-20 sm:text-5xl md:text-7xl font-bold text-[#1E2A78] mb-4 leading-tight">
          Borrow Instantly, Backed by Trust Wallet.
        </h1>
        <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-10 max-w-2xl">
          The decentralized credit layer for verified on-chain users.
        </p>

        <div className="flex justify-center mt-6">
          <div className="hero-connect relative">
            <ConnectButton
              accountStatus="address"
              chainStatus="icon"
              showBalance={false}
              label={isLoading ? 'Connecting...' : 'Connect Wallet'}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
                <Loader2 className="w-6 h-6 animate-spin text-[#1E2A78]" />
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 border-y border-gray-200 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full text-center">
            <div>
              <h3 className="text-4xl sm:text-5xl font-bold text-[#1E2A78]">
                {vaults}
              </h3>
              <p className="text-gray-500 uppercase tracking-wide text-base sm:text-lg mt-1">
                Active Vaults
              </p>
            </div>

            <div>
              <h3 className="text-4xl sm:text-5xl font-bold text-[#1E2A78]">
                {success.toFixed(1)}%
              </h3>
              <p className="text-gray-500 uppercase tracking-wide text-base sm:text-lg mt-1">
                Repayment Success
              </p>
            </div>

            <div>
              <h3 className="text-4xl sm:text-5xl font-bold text-[#1E2A78]">
                ${liquidity.toLocaleString()}
              </h3>
              <p className="text-gray-500 uppercase tracking-wide text-base sm:text-lg mt-1">
                Total Liquidity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="max-w-7xl mx-auto px-6 py-10 sm:py-16 md:py-20 text-center w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E2A78] mb-6 sm:mb-12">
          3 Steps to Instant Liquidity
        </h2>

        {/* Responsive Carousel/Grid */}
        <div className="w-full">
          {/* Larger screens: show normal grid */}
          {/* Small screens: show carousel */}
          <div className="block sm:hidden w-full">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full max-w-md mx-auto relative"
            >
              <CarouselContent>
                {[
                  {
                    step: "01",
                    title: "Connect Your Wallet",
                    desc: "Secure link through Trust Wallet Connect.",
                  },
                  {
                    step: "02",
                    title: "Choose Loan Vault",
                    desc: "Select your preferred vault and collateral type.",
                  },
                  {
                    step: "03",
                    title: "Receive Instant Credit",
                    desc: "Loan executed on-chain. Tokens land directly in your wallet.",
                  },
                ].map((item, i) => (
                  <CarouselItem
                    key={i}
                    className="basis-[90%] sm:basis-full flex justify-center"
                  >
                    <Card className="w-full shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-4xl font-bold text-gray-300">
                          {item.step}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-2xl font-bold text-[#1E2A78] mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-lg">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Carousel navigation */}
              <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border shadow-md p-5 sm:p-4 rounded-full" />
              <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border shadow-md p-5 sm:p-4 rounded-full" />
            </Carousel>
          </div>

          {/* Larger screens: show normal grid */}
          <div className="hidden sm:grid sm:grid-cols-3 gap-6 w-full items-stretch">
            {[
              {
                step: "01",
                title: "Connect Your Wallet",
                desc: "Secure link through Trust Wallet Connect.",
              },
              {
                step: "02",
                title: "Choose Loan Vault",
                desc: "Select your preferred vault and collateral type.",
              },
              {
                step: "03",
                title: "Receive Instant Credit",
                desc: "Loan executed on-chain. Tokens land directly in your wallet.",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-gray-300">
                    {item.step}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-2xl font-bold text-[#1E2A78] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-lg">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers Section */}
      <section className="max-w-7xl mx-auto px-6 py-10 sm:py-16 md:py-20 text-center w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E2A78] mb-4 sm:mb-12">
          Earn Status. Unlock Higher Credit Limits.
        </h2>

        <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Build your on-chain reputation and access exclusive benefits.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full items-stretch">
          {/* Tier 1 */}
          <div className="w-full h-full">
            <Card className="!p-0 h-full bg-blue-50 shadow-lg rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow border-2 border-blue-500/10">
              <CardContent className="h-full text-left p-6 space-y-4 text-gray-700">
                <div className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-blue-500 text-white">
                  Tier I
                </div>
                <h3 className="text-3xl font-bold text-gray-800">
                  Verified Borrower
                </h3>
                <div className="space-y-3 pt-2">
                  <p className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-500" />{" "}
                    <span className="text-lg">Base access</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-500" />{" "}
                    <span className="text-lg">Standard rates</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-500" />{" "}
                    <span className="text-lg">Community support</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tier 2 */}
          <div className="w-full h-full">
            <Card className="!p-0 h-full bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow border-2 border-gray-300/50">
              <CardContent className="h-full text-left p-6 space-y-4 text-gray-700">
                <div className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-gray-500 text-white">
                  Tier II
                </div>
                <h3 className="text-3xl font-bold text-gray-800">
                  Vault Trusted
                </h3>
                <div className="space-y-3 pt-2">
                  <p className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-gray-500" />{" "}
                    <span className="text-lg">Higher limits</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-gray-500" />{" "}
                    <span className="text-lg">Faster approvals</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-gray-500" />{" "}
                    <span className="text-lg">Priority support</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tier 3 */}
          <div className="w-full h-full">
            <Card className="!p-0 h-full bg-yellow-50 shadow-lg rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow border-2 border-yellow-500/10">
              <CardContent className="h-full text-left p-6 space-y-4 text-gray-700">
                <div className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-yellow-500 text-white">
                  Tier III
                </div>
                <h3 className="text-3xl font-bold text-gray-800">
                  Institutional
                </h3>
                <div className="space-y-3 pt-2">
                  <p className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-yellow-500" />{" "}
                    <span className="text-lg">Priority liquidity</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-yellow-500" />{" "}
                    <span className="text-lg">Exclusive pools</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-yellow-500" />{" "}
                    <span className="text-lg">Dedicated manager</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="italic text-gray-400 mt-8">
          Trust isn’t given. It’s earned — on-chain.
        </p>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="scroll-mt-24 max-w-7xl mx-auto px-6 py-16 text-left w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Side — Title and Description */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E2A78] mb-6">
              Frequently asked <span className="text-[#3375BB]">questions</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-md">
              Learn more about how Trust Loan App helps you borrow funds
              securely using your crypto assets as collateral — fast,
              transparent, and decentralized.
            </p>
          </div>

          {/* Right Side — Accordion */}
          <div className="space-y-4">
            {[
              {
                q: "What is Trust Loan App?",
                a: "Trust Loan App is a decentralized lending platform that allows users to borrow crypto instantly using their existing digital assets as collateral. It’s powered by Trust Wallet integration for secure transactions.",
              },
              {
                q: "How does Trust Loan App work?",
                a: "Simply connect your Wallet, choose a loan vault, and lock your crypto as collateral. You’ll receive instant stablecoin liquidity while keeping ownership of your assets.",
              },
              {
                q: "Is Trust Loan App secure?",
                a: "Yes, security is our top priority. Trust Loan App uses blockchain-level encryption, smart contract verification, and Trust Wallet authentication to keep your funds and data safe at all times.",
              },
              {
                q: "Which crypto assets can I use as collateral?",
                a: "We support major cryptocurrencies like ETH, BTC, BNB, and stablecoins. More tokens will be added as the platform expands.",
              },
              {
                q: "Are there any hidden fees?",
                a: "No hidden fees. All interest rates and collateral requirements are displayed upfront before you confirm your loan transaction.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
              >
                <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-[#1E2A78]">
                  {item.q}
                  <ChevronDown className="ml-2 w-5 h-5 text-[#3375BB] transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-gray-600 text-base leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
