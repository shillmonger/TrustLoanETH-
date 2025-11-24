import { useState, useEffect } from 'react';
import { useSendTransaction, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'sonner';

export function useFeePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const { data: sendData, sendTransactionAsync } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransaction({
    hash: txHash!,
  });

  useEffect(() => {
    if (txHash) {
      toast.success('Transaction sent', {
        description: `Transaction hash: ${txHash}`,
        action: {
          label: 'View on Etherscan',
          onClick: () => window.open(`https://etherscan.io/tx/${txHash}`, '_blank'),
        },
      });
    }
  }, [txHash]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Transaction confirmed!');
      verifyPayment();
    }
  }, [isConfirmed]);

  const verifyPayment = async () => {
    if (!txHash) return;

    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash }),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      toast.error('Payment verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const payFee = async (amountInEth: string) => {
    if (!process.env.NEXT_PUBLIC_COMPANY_WALLET) {
      throw new Error('Company wallet address not configured');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await sendTransactionAsync({
        to: process.env.NEXT_PUBLIC_COMPANY_WALLET as `0x${string}`,
        value: parseEther(amountInEth),
      });
      
      setTxHash(tx.hash);
      return tx.hash;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Transaction failed', { description: error.message });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    payFee,
    isLoading,
    isConfirming,
    isConfirmed,
    txHash,
    error,
  };
}
