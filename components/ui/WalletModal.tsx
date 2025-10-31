"use client";

import React from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/navigation';

type Props = {
  open: boolean;
  onClose: () => void;
  onConnected?: (address: string) => void;
};

export default function WalletModal({ open, onClose, onConnected }: Props) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  React.useEffect(() => {
    if (isConnected && address) {
      onConnected?.(address);
      onClose();
      // Navigate to dashboard when connected
      router.push('/dashboard');
      // Refresh the page to update the UI
      router.refresh();
    }
  }, [isConnected, address, onClose, onConnected, router]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60" onClick={onClose}>
      <div className="bg-[#0B0E11] text-white max-w-md w-full rounded-lg p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Connect Wallet</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          {isConnected ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Connected with</p>
                <p className="font-mono text-sm break-all mt-1">{address}</p>
              </div>
              <button
                onClick={() => {
                  disconnect();
                  onClose();
                }}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Connect Wallet</span>
                  </button>
                )}
              </ConnectButton.Custom>
              <p className="text-center text-sm text-gray-400">
                By connecting a wallet, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
