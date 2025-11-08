"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

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

  // Mock states
  const [selectedAsset, setSelectedAsset] = useState("ETH");
  const [loanAmount, setLoanAmount] = useState(0);
  const [creditLimit] = useState(0.00);
  const [activeLoans] = useState(0.00);
  const [nextRepayment] = useState(0.00);
  const [collateralRatio] = useState(0.00);

  const collateralRequired = (loanAmount * collateralRatio) / 100;

  // State for loading to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);

  // Mock live activities with dynamic updates - ensure unique IDs
  const [liveActivities, setLiveActivities] = useState([
    { id: "0xA4B1", description: "deposited 2.5 ETH collateral" },
    { id: "0xSC92", description: "repaid 1.2 ETH loan" },
    { id: "0xA4B3", description: "deposited 1.5 ETH collateral" },
  ]);

  // Possible descriptions for random generation
  const possibleDescriptions = [
    "deposited {amount} ETH collateral",
    "repaid {amount} {asset} loan",
    "borrowed {amount} {asset}",
    "withdrew {amount} {asset} collateral",
    "liquidated {amount} {asset} position",
    "adjusted collateral ratio to {ratio}%",
  ];

  const possibleAssets = ["ETH", "USDT"];

  // Generate random activity
  const generateRandomActivity = () => {
    const randomId = `0x${Math.random().toString(16).substr(2, 3).toUpperCase()}${Math.floor(Math.random() * 10)}`;
    const randomDesc = possibleDescriptions[Math.floor(Math.random() * possibleDescriptions.length)];
    const randomAmount = (Math.random() * 5 + 0.5).toFixed(1); // 0.5 to 5.5
    const randomAsset = possibleAssets[Math.floor(Math.random() * possibleAssets.length)];
    const randomRatio = Math.floor(Math.random() * 20 + 100); // 100-120%

    let description = randomDesc
      .replace("{amount}", randomAmount)
      .replace("{asset}", randomAsset)
      .replace("{ratio}", randomRatio.toString());

    return { id: randomId, description };
  };

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update live activities every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivities((prev) => {
        const newActivity = generateRandomActivity();
        const updated = [newActivity, ...prev].slice(0, 3); // Keep last 3 activities
        return updated;
      });
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Amount options for buttons
  const amountOptions = [500, 1000, 2500, 5000, 10000, 15000, 20000, 25000];

  // Show loading state during SSR/SSG to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
          <div className="flex items-center space-x-4">
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
            {/* Card 1 */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
              <CardContent className="py-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Active Loans</p>
                <p className="text-2xl font-bold text-gray-900">{activeLoans}</p>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
              <CardContent className="py-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Collateral Ratio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {collateralRatio}%
                </p>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
              <CardContent className="py-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Next Repayment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {nextRepayment}
                </p>
              </CardContent>
            </Card>

            {/* Card 4 */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
              <CardContent className="py-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Credit Limit</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${creditLimit.toLocaleString()}
                </p>
              </CardContent>
            </Card>
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
              {/* Choose Asset */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Choose Asset
                </p>
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger className="w-28 border-gray-300 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Select Amount */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Select Amount (USD)
                </p>
                <Slider
                  value={[loanAmount]}
                  onValueChange={(value) => setLoanAmount(value[0])}
                  max={creditLimit}
                  step={500}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>$500</span>
                  <span>${loanAmount.toLocaleString()}</span>
                  <span>${creditLimit.toLocaleString()}</span>
                </div>

                {/* Amount Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                  {amountOptions.map((amount) => (
                    <Button
                      key={amount}
                      variant={loanAmount === amount ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                      onClick={() => setLoanAmount(amount)}
                    >
                      ${amount.toLocaleString()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Collateral Alert */}
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-sm text-yellow-800">
                  Collateral Required: You must hold at least {collateralRatio}%
                  of the loan amount (${collateralRequired.toFixed(0)}). These
                  funds will be locked until repayment.
                </AlertDescription>
              </Alert>

              {/* Authorize Button */}
              <Button
                disabled={loanAmount <= 0}
                className={`w-full shadow-md text-white transition-all ${
                  loanAmount > 0
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Authorize in Wallet
              </Button>
            </CardContent>
          </Card>

          {/* Live Activity + Active Loans */}
          <div className="space-y-6">
            {/* Live Activity */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-sm border-gray-200/50 relative">
              <div className="absolute top-4 right-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <CardHeader className="pb-4 pt-8">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Live Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {liveActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between text-sm py-1"
                  >
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {activity.id}
                    </Badge>
                    <span className="text-gray-600">
                      {activity.description}
                    </span>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <Badge variant="outline" className="text-xs border-gray-300">
                    Vault liquidity increased by ${Math.floor(Math.random() * 5000 + 1000).toLocaleString()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Active Loans */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-sm border-gray-200/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Active Loans
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg font-medium">No active loans</p>
                  <p className="text-sm">Borrow assets to see your vault</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled
                >
                  View All On-Chain
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}