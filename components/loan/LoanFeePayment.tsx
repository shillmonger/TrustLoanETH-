"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, erc20ABI } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

// USDT contract addresses for different networks
const USDT_CONTRACTS = {
  ethereum: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Mainnet
  sepolia: "0x1f1f7d66cdb85edc6ffb919c51aa280445dfb653", // Sepolia testnet
  goerli: "0x509Ee0d083DdF8AC028f2a56731412edD63223B9", // Goerli testnet
} as const;

// Admin wallet address (should be set in environment variables)
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET || "0x96bebc6C5F7547a8A1ADDC0a0aA80744D9c99065";

// Fee percentage (10%)
const FEE_PERCENTAGE = 10;

interface LoanFeePaymentProps {
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

export function LoanFeePayment({ onSuccess, onError }: LoanFeePaymentProps) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  // USDT uses 6 decimals
  const USDT_DECIMALS = 6;
  
  // Calculate fee amount (10% of loan amount)
  const feeAmount = useMemo(() => {
    if (!loanAmount) return "0";
    const amount = parseFloat(loanAmount);
    if (isNaN(amount) || amount <= 0) return "0";
    return (amount * (FEE_PERCENTAGE / 100)).toFixed(6);
  }, [loanAmount]);

  // Get USDT contract address based on current chain
  const usdtContract = chain?.id ? USDT_CONTRACTS[chain.network as keyof typeof USDT_CONTRACTS] : null;
  
  // Prepare the approval transaction
  const { config, error: prepareError } = usePrepareContractWrite({
    address: usdtContract as `0x${string}`,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [
      ADMIN_WALLET as `0x${string}`,
      parseUnits(feeAmount, USDT_DECIMALS)
    ],
    enabled: Boolean(usdtContract && parseFloat(feeAmount) > 0 && address),
  });

  // Execute the approval
  const { data, write: transferTokens, isLoading: isTransferring } = useContractWrite(config);
  
  // Wait for the transaction to be mined
  const { isLoading: isWaiting, isSuccess, error: transferError } = useWaitForTransaction({
    hash: data?.hash,
  });

  // Handle transaction success/error
  useEffect(() => {
    if (isSuccess && data?.hash) {
      onSuccess?.(data.hash);
      setShowConfirmation(false);
      setLoanAmount("");
    }
  }, [isSuccess, data?.hash, onSuccess]);

  useEffect(() => {
    if (transferError) {
      onError?.(transferError);
    }
  }, [transferError, onError]);

  // Handle component mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setShowConfirmation(true);
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (transferTokens) {
      transferTokens();
    }
  };

  // Handle network switch if needed
  const handleSwitchNetwork = () => {
    if (switchNetwork) {
      // Default to Sepolia testnet (or any other supported network)
      switchNetwork(11155111); // Sepolia chain ID
    }
  };

  // Check if the current network is supported
  const isUnsupportedNetwork = chain?.unsupported === true;
  const isNetworkSupported = chain?.id && usdtContract;

  if (!isMounted) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Request Loan</CardTitle>
      </CardHeader>
      <CardContent>
        {!address ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Wallet Not Connected</AlertTitle>
            <AlertDescription>
              Please connect your wallet to request a loan.
            </AlertDescription>
          </Alert>
        ) : isUnsupportedNetwork ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unsupported Network</AlertTitle>
            <AlertDescription>
              Please switch to a supported network to continue.
              <Button 
                variant="outline" 
                className="mt-2 w-full"
                onClick={handleSwitchNetwork}
              >
                Switch to Sepolia Testnet
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="loanAmount" className="block text-sm font-medium">
                Loan Amount (USDT)
              </label>
              <Input
                id="loanAmount"
                type="number"
                min="1"
                step="0.01"
                placeholder="Enter amount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full"
                required
              />
            </div>

            {parseFloat(loanAmount) > 0 && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Service Fee ({FEE_PERCENTAGE}%):</span>
                  <span className="font-medium">{feeAmount} USDT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">You'll receive:</span>
                  <span className="font-medium">
                    {Math.max(0, parseFloat(loanAmount) - parseFloat(feeAmount)).toFixed(6)} USDT
                  </span>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={!loanAmount || parseFloat(loanAmount) <= 0 || !isNetworkSupported}
            >
              {isTransferring || isWaiting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Request Loan"
              )}
            </Button>

            {prepareError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {prepareError.message.includes("insufficient") 
                    ? "Insufficient USDT balance" 
                    : "Error preparing transaction"}
                </AlertDescription>
              </Alert>
            )}
          </form>
        )}

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Confirm Loan Request</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loan Amount:</span>
                  <span>{loanAmount} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee ({FEE_PERCENTAGE}%):</span>
                  <span className="font-medium">{feeAmount} USDT</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>You'll receive:</span>
                    <span>{Math.max(0, parseFloat(loanAmount) - parseFloat(feeAmount)).toFixed(6)} USDT</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={handleConfirm}
                  disabled={isTransferring || isWaiting}
                  className="w-full"
                >
                  {isTransferring || isWaiting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm & Pay Fee"
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfirmation(false)}
                  disabled={isTransferring || isWaiting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
