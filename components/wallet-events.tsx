'use client';

import { useEffect, useRef } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { toast } from 'sonner';

export function WalletEvents() {
  const { address, isConnected, isReconnecting } = useAccount();
  const { chain } = useNetwork();
const prevAddressRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Skip initial render and reconnection attempts
    if (isReconnecting) return;

    // Handle wallet connection
    if (isConnected && address) {
      // Only show toast if this is a new connection
      if (prevAddressRef.current !== address) {
        toast.success('Wallet connected', {
          description: `Connected to ${chain?.name || 'network'} with ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      }
    } 
    // Handle wallet disconnection
    else if (prevAddressRef.current) {
      toast.info('Wallet disconnected');
    }

    // Update previous address reference
    prevAddressRef.current = address;
  }, [isConnected, address, isReconnecting, chain]);

  return null;
}
