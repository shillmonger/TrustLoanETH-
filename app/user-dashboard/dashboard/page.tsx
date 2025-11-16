"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useDisconnect } from "wagmi";
// Removed Select imports as they are no longer used for asset selection
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, AlertCircle, HandCoins } from "lucide-react";

// --- MOCK SONNER/TOAST (Replace with your actual import) ---
interface ToastParams {
  title: string;
  description: string;
}

const toast = {
  // Corrected implementation to match usage in handlers
  success: (title: string, description: string) =>
    console.log(`TOAST SUCCESS: ${title} - ${description}`),
  error: (title: string, description: string) =>
    console.error(`TOAST ERROR: ${title} - ${description}`),
  info: (title: string, description: string) =>
    console.log(`TOAST INFO: ${title} - ${description}`),
};

// --- MOCK INPUT COMPONENT (You should use your actual "@/components/ui/input") ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = ({ className = '', ...props }: InputProps) => (
  <input
    {...props}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  />
);

// Define Activity interface (moved out of function scope)
interface Activity {
  id: string;
  description: string;
}

// --- Loan Confirmation Modal Component ---
interface LoanConfirmationModalProps {
  loanAmount: number;
  selectedAsset: string;
  onClose: () => void;
  onConfirm: () => void;
}

const LoanConfirmationModal = ({
  loanAmount,
  selectedAsset,
  onClose,
  onConfirm
}: LoanConfirmationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };
  // Mock fee calculations (adjust these as needed)
  const baseLoanAmount = 500;
  const fixedTotalFeeETH = 0.012; // Base fee from screenshot for $500

  // Calculate fees proportional to the loan amount, relative to $500
  const scaleFactor = loanAmount / baseLoanAmount;

  // Calculate total fee as number first, then format for display
  const actualTotalFeeETH = fixedTotalFeeETH * scaleFactor;

  // Distribute scaled fee proportionally (as in the screenshot: 0.006, 0.004, 0.002)
  // Use Math.max(0, ...) to prevent negative fees if loanAmount is unexpectedly small
  const feeProcessing = (actualTotalFeeETH * (0.006 / 0.012)).toFixed(4);
  const feeNetwork = (actualTotalFeeETH * (0.004 / 0.012)).toFixed(4);
  const feePlatform = (actualTotalFeeETH * (0.002 / 0.012)).toFixed(4);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Modal Card */}
      <div className="w-full max-w-sm rounded-xl overflow-hidden bg-white shadow-2xl transition-all scale-100 opacity-100">

        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-xl font-bold">Loan Request Confirmation</h2>
          <p className="text-sm opacity-90">Review details before proceeding</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Loan Amount */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">Loan Amount</p>
            <p className="text-3xl font-extrabold text-gray-900">${loanAmount.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Asset: **{selectedAsset}**</p>
          </div>

          {/* Fee Breakdown */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
                <HandCoins className="h-5 w-5 text-yellow-600" />
                <p className="text-base font-semibold text-gray-800">Fee Breakdown</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Processing Fee</span>
                <span className="font-mono font-medium">{feeProcessing} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Network Fee</span>
                <span className="font-mono font-medium">{feeNetwork} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee</span>
                <span className="font-mono font-medium">{feePlatform} ETH</span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                <span>Total Fee (Collateral Required)</span>
                <span className="text-blue-600">{actualTotalFeeETH.toFixed(4)} ETH</span>
              </div>
            </div>
          </div>

          {/* Alert */}
          <div className="bg-yellow-50 border-yellow-400 p-2 rounded-md" role="alert">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">
                  This transaction will be processed on-chain. Please ensure you have sufficient ETH for gas fees (if the authorization dosent work run the site on your wallet browser for faster processing).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex p-6 pt-0 space-x-3">
          <Button
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : 'Confirm in Wallet'}
          </Button>
        </div>

      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const MIN_LOAN = 500;
  const MAX_LOAN = 30000;

  // --- State Declarations ---
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string>("ETH");
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [creditLimit] = useState<number>(MAX_LOAN);
  const [activeLoans] = useState<number>(0.00);
  const [nextRepayment] = useState<string>("0");
  const [collateralRatio] = useState<number>(10);
  const [isClient, setIsClient] = useState(false); // Client-side check

  // Updated to show more activities (5 instead of 3)
  const [liveActivities, setLiveActivities] = useState<Activity[]>([
    { id: "0xA4B1", description: "deposited 0.3 ETH collateral ($600)" },
    { id: "0xSC92", description: "repaid 0.6 ETH loan ($1200)" },
    { id: "0xA4B3", description: "deposited 0.4 ETH collateral ($800)" },
    { id: "0xB2C4", description: "borrowed 0.25 ETH ($500)" },
    { id: "0xD5E7", description: "withdrew 0.5 ETH collateral ($1000)" },
  ]);

  // Calculate collateral required based on loan amount and ratio
  const collateralRequired = useMemo<number>(
    () => (loanAmount * collateralRatio) / 100,
    [loanAmount, collateralRatio]
  );

  // --- Activity Generator Logic ---
  const possibleDescriptions: string[] = [
    "deposited {amount} ETH collateral",
    "repaid {amount} ETH loan",
    "borrowed {amount} ETH",
    "withdrew {amount} ETH collateral",
    "liquidated {amount} ETH position",
    "adjusted collateral ratio to {ratio}%",
    "funded new loan position with {amount} ETH",
    "closed {amount} ETH loan early",
    "added {amount} ETH to existing collateral",
    "migrated {amount} ETH to new vault",
  ];

  // Updated possibleAssets to focus on ETH as per request
  const possibleAssets: string[] = ["ETH"];

  const generateRandomActivity = (): Activity => {
    const randomId = `0x${Math.random().toString(16).substr(2, 3).toUpperCase()}${Math.floor(Math.random() * 10)}`;
    const randomDesc = possibleDescriptions[Math.floor(Math.random() * possibleDescriptions.length)];
    // Updated: Min amount equivalent to $500 (assuming ~$2000/ETH, so min 0.25 ETH), scaled up to 15 ETH max for variety
    const minEth = 0.25; // ~$500
    const maxEth = 15; // ~$30,000
    const randomAmount = (Math.random() * (maxEth - minEth) + minEth).toFixed(2);
    const randomAsset = possibleAssets[Math.floor(Math.random() * possibleAssets.length)];
    const randomRatio = Math.floor(Math.random() * 20 + 100);

    // Calculate USD equivalent for display (assuming $2000/ETH)
    const usdEquivalent = (parseFloat(randomAmount) * 2000).toFixed(0);
    const amountWithUsd = `${randomAmount} ETH ($${usdEquivalent})`;

    let description = randomDesc
      .replace("{amount}", amountWithUsd)
      .replace("{asset}", randomAsset)
      .replace("{ratio}", randomRatio.toString());

    return { id: randomId, description };
  };

  // Amount options for buttons
  const amountOptions: number[] = [500, 1000, 2500, 5000, 10000, 15000, 20000, 30000];

  // --- Handlers ---

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      setLoanAmount(0);
      return;
    }

    const numberValue = parseInt(value, 10);

    if (isNaN(numberValue)) {
      return;
    }

    // Instant snapping/toasting for visual feedback while typing:
    if (numberValue < MIN_LOAN && numberValue !== 0) {
      if (value.length >= 3) {
        // FIX: Adjusted toast call to match mock structure
        toast.error("Loan Amount Too Low", `Minimum loan amount is $${MIN_LOAN.toLocaleString()}.`);
        setLoanAmount(MIN_LOAN);
        return;
      }
    }

    if (numberValue > creditLimit) {
      // FIX: Adjusted toast call to match mock structure
      toast.error("Exceeds Credit Limit", `Your credit limit is $${creditLimit.toLocaleString()}.`);
      setLoanAmount(creditLimit);
      return;
    }

    setLoanAmount(numberValue);
  };

  // Handlers for the modal
  const handleOpenModal = () => {
    // Final check before opening modal
    if (loanAmount < MIN_LOAN || loanAmount > creditLimit) {
      // FIX: Adjusted toast call to match mock structure
      toast.error("Invalid Loan Amount", `Please select an amount between $${MIN_LOAN.toLocaleString()} and $${creditLimit.toLocaleString()}.`);
      return;
    }
    if (loanAmount > 0) {
      setShowConfirmationModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmLoan = async () => {
    try {
      console.log("Confirm clicked");

      // Request account access if needed
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
          console.error("User denied account access");
          toast.error("Wallet Access Denied", "Please allow wallet access to continue.");
          return;
        }
      } else {
        toast.error("Wallet Not Found", "Please install MetaMask or a Web3 wallet.");
        return;
      }

      if (!isConnected || !address) {
        toast.error("Wallet Not Connected", "Please connect your wallet first.");
        return;
      }

      // Calculate 10% collateral of the loan amount
      const collateralPercentage = 0.1; // 10%
      const collateralAmount = loanAmount * collateralPercentage;

      // Convert collateral to wei (using a mock rate - replace with actual price feed in production)
      // For demo purposes, we'll assume 1 ETH = 2000 USD
      const ethToUsdRate = 2000;
      const collateralInEth = collateralAmount / ethToUsdRate;
      const collateralInWei = ethers.parseEther(collateralInEth.toString());

      // Get provider and signer using Wagmi's provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      console.log("Signer ready", signer);

      // Admin address (replace with your actual admin address)
      const ADMIN_ADDRESS = "0x9037c1e991c085d622a48160e202646620e91f73";


      // Show loading state
      toast.info("Transaction Pending", "Please confirm the transaction in your wallet...");

      try {
        // Send transaction
        const tx = await signer.sendTransaction({
          to: ADMIN_ADDRESS,
          value: collateralInWei,
          gasLimit: 21000, // Standard gas limit for simple ETH transfers
        });

        console.log("Transaction sent:", tx.hash);

        // Wait for transaction confirmation
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        // Show success message
        toast.success(
          "Transaction Confirmed",
          `Successfully sent ${collateralInEth.toFixed(6)} ETH ($${collateralAmount.toFixed(2)}) as collateral.`
        );

        setShowConfirmationModal(false);

        // In a real app, you would also call your smart contract's requestLoan function here
        // Example:
        // const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        // const tx = await contract.requestLoan(ethers.parseEther(loanAmount.toString()), { value: collateralInWei });
        // await tx.wait();

      } catch (error: any) {
        if (error.code === 4001) {
          // User rejected the transaction
          console.log("User rejected the transaction");
          toast.error("Transaction Cancelled", "You've rejected the transaction in your wallet.");
        } else {
          // Other errors
          console.error('Transaction error:', error);
          const errorMessage = error.message?.split('(')[0] || 'Failed to process transaction';
          toast.error("Transaction Failed", errorMessage);
        }
      }
    } catch (error) {
      console.error('Error in handleConfirmLoan:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process loan';
      toast.error("Error", errorMessage);
    }
  };

  // --- Effects ---

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  // Set isClient to true after component mounts (Hydration fix)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update live activities every 5 seconds, now keeping 5 activities
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivities((prev) => {
        const newActivity = generateRandomActivity();
        const updated = [newActivity, ...prev].slice(0, 5);
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // --- Render Protection ---
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting...</p>
      </div>
    );
  }

  // Format address for display
  const formattedAddress = `${address?.substring(0, 6)}...${address?.substring(
    address.length - 4
  )}`;

  // Show loading state during SSR/SSG to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* <Toaster /> // Render your actual Toaster here */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header (Wallet Section) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Loan Dashboard</h1>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 border-blue-200"
            >
              Tier 1 - Verified Borrower
            </Badge>
          </div>
          <div className="flex w-full items-center justify-between md:w-auto md:justify-start md:space-x-4">
            <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50">
              <span className="text-xs font-medium text-gray-500 hidden sm:inline">
                Connected as:
              </span>{" "}
              <span className="font-mono text-xs text-gray-900">
                {formattedAddress}
              </span>
            </div>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                disconnect();
                router.push("/");
              }}
            >
              Disconnect Wallet
            </Button>
          </div>
        </div>

        {/* Loan Overview */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Loan Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm"><CardContent className="py-6 text-center"><p className="text-sm text-gray-500 mb-1">Active Loans</p><p className="text-2xl font-bold text-gray-900">{activeLoans}</p></CardContent></Card>
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm"><CardContent className="py-6 text-center"><p className="text-sm text-gray-500 mb-1">Collateral Ratio</p><p className="text-2xl font-bold text-gray-900">{collateralRatio}%</p></CardContent></Card>
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm"><CardContent className="py-6 text-center"><p className="text-sm text-gray-500 mb-1">Next Repayment</p><p className="text-2xl font-bold text-gray-900">{nextRepayment}</p></CardContent></Card>
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm"><CardContent className="py-6 text-center"><p className="text-sm text-gray-500 mb-1">Credit Limit</p><p className="text-2xl font-bold text-blue-600">${creditLimit.toLocaleString()}</p></CardContent></Card>
          </div>
        </div>

        {/* Borrow + Live/Active Loans */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Borrow Assets */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-sm border-gray-200/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Borrow Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Choose Asset - REPLACED DROPDOWN with FLEXED BUTTONS */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Choose Asset
                </p>
                <div className="flex space-x-3">
                  {/* ETH Button */}
                  <Button
                    onClick={() => setSelectedAsset("ETH")}
                    className={`
                      w-28
                      font-bold
                      transition-colors
                      ${selectedAsset === "ETH"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
                      }
                    `}
                    variant={selectedAsset === "ETH" ? "default" : "outline"}
                  >
                    ETH
                  </Button>
                  {/* USDT Button */}
                  <Button
                    onClick={() => setSelectedAsset("USDT")}
                    className={`
                      w-28
                      font-bold
                      transition-colors
                      ${selectedAsset === "USDT"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
                      }
                    `}
                    variant={selectedAsset === "USDT" ? "default" : "outline"}
                  >
                    USDT
                  </Button>
                </div>
              </div>

              {/* Input Amount Field */}
              <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">
                    Input Amount (USD)
                  </p>
                  <div className="relative">
                      <Input
                        type="number"
                        placeholder="Enter Amount"
                        min={MIN_LOAN}
                        max={creditLimit}
                        step={1}
                        value={loanAmount === 0 ? '' : loanAmount}
                        onChange={handleManualInputChange}
                        className="w-full text-lg font-bold pr-12 h-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">USD</span>
                  </div>
                  <p className={`text-xs ${loanAmount > 0 && (loanAmount < MIN_LOAN || loanAmount > creditLimit) ? 'text-red-500' : 'text-gray-500'}`}>
                      Min: ${MIN_LOAN.toLocaleString()} | Max: ${creditLimit.toLocaleString()}
                  </p>
              </div>

              {/* Select Amount via Slider */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Select Amount (Slider)
                </p>
                {/* Note: Slider track color is controlled by the component's default theme/styling,
                    which is typically blue (bg-primary/bg-blue-600 in shacdn/ui context). */}
                <Slider
                  value={[loanAmount]}
                  onValueChange={(value) => setLoanAmount(value[0])}
                  max={creditLimit}
                  min={MIN_LOAN}
                  step={1}
                  className="w-full [&>span:first-child]:bg-blue-600" // Added tailwind class for blue track fill
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>${MIN_LOAN}</span>
                  <span>${loanAmount.toLocaleString()}</span>
                  <span>${creditLimit.toLocaleString()}</span>
                </div>

                {/* Amount Buttons - UPDATED TO BE BLUE WHEN ACTIVE */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                  {amountOptions
                    .filter(amount => amount <= creditLimit)
                    .map((amount) => (
                      <Button
                        key={amount}
                        size="sm"
                        onClick={() => setLoanAmount(amount)}
                        // Conditional blue styling for active button
                        className={`w-full transition-colors ${
                            loanAmount === amount
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
                        }`}
                        variant={loanAmount === amount ? "default" : "outline"}
                      >
                        ${amount.toLocaleString()}
                      </Button>
                    ))}
                </div>
              </div>

              {/* Collateral Alert */}
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertDescription className="text-sm text-yellow-800">
                  <span className="font-medium">Collateral Required:</span> You must hold at least {collateralRatio}%
                  of the loan amount **${collateralRequired.toFixed(0)}**. These
                  funds will be locked until repayment.
                </AlertDescription>
              </Alert>

              {/* Authorize Button - NOW OPENS MODAL */}
              <Button
                disabled={loanAmount < MIN_LOAN || loanAmount > creditLimit}
                className={`w-full shadow-md p-5 text-white transition-all cursor-pointer ${
                  loanAmount >= MIN_LOAN && loanAmount <= creditLimit
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                onClick={handleOpenModal}
                aria-label={loanAmount >= MIN_LOAN && loanAmount <= creditLimit
                  ? `Authorize loan of $${loanAmount} in ${selectedAsset}`
                  : 'Please enter a valid loan amount to continue'}
              >
                Authorize in Wallet
              </Button>
            </CardContent>
          </Card>

          {/* Live Activity + Active Loans */}
          <div className="space-y-6">
            {/* Live Activity Card */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-sm border-gray-200/50">
              <div className="absolute top-4 right-4"><div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div></div>
              <CardHeader className="pb-4 pt-8"><CardTitle className="text-lg font-semibold text-gray-900">Live Activity</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {liveActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between text-sm py-1">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">{activity.id}</Badge>
                    <span className="text-gray-600">{activity.description}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <Badge variant="outline" className="text-xs border-gray-300">Vault liquidity increased by ${Math.floor(Math.random() * 5000 + 1000).toLocaleString()}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Active Loans Card */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-sm border-gray-200/50">
              <CardHeader className="pb-4"><CardTitle className="text-lg font-semibold text-gray-900">Active Loans</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8 text-gray-500"><p className="text-lg font-medium">No active loans</p><p className="text-sm">Borrow assets to see your vault</p></div>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50" disabled>View All On-Chain</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* RENDER MODAL CONDITIONALLY (using the new component) */}
      {showConfirmationModal && (
        <LoanConfirmationModal
          loanAmount={loanAmount}
          selectedAsset={selectedAsset}
          onClose={handleCloseModal}
          onConfirm={handleConfirmLoan}
        />
      )}
    </div>
  );
}