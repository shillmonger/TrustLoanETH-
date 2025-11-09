"use client";

import React from "react";
import type { ReactNode } from 'react';
import { WalletEvents } from "@/components/wallet-events";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { 
  RainbowKitProvider, 
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { 
  metaMaskWallet,
  trustWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet,
  braveWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { alchemyProvider } from 'wagmi/providers/alchemy';

interface WagmiProviderWrapperProps {
  children: ReactNode;
}

// Configure chains with better WebSocket handling
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [
    alchemyProvider({ 
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'your-alchemy-key'
    }),
    publicProvider(),
  ],
  {
    batch: { multicall: true },
    pollingInterval: 10_000,
    stallTimeout: 5_000,
    retryCount: 3,
  }
);

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

// Configure wallet connectors
const { wallets } = getDefaultWallets({
  appName: 'TrustLoanETH',
  projectId,
  chains,
});

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      coinbaseWallet({ appName: 'TrustLoanETH', chains }),
      rainbowWallet({ projectId, chains }),
      braveWallet({ chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

// Set up the wagmi config with better WebSocket handling
const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  // Disable WebSocket in development to prevent connection issues
  webSocketPublicClient: process.env.NODE_ENV === 'production' && typeof window !== 'undefined' 
    ? webSocketPublicClient 
    : undefined,
  // Batch configuration is handled automatically in wagmi v2
});

// Create a React Query client
const queryClient = new QueryClient();

// Error boundary component with retry functionality
class ErrorBoundary extends React.Component<{children: ReactNode}, {hasError: boolean, error?: Error}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Wallet connection error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-700 font-medium mb-2">Connection Error</div>
          <p className="text-sm text-red-600 mb-4">
            {this.state.error?.message || 'Failed to connect to wallet service'}
          </p>
          <button
            onClick={this.handleRetry}
            className="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
          >
            Retry Connection
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Main provider component
export default function WagmiProviderWrapper({ children }: WagmiProviderWrapperProps) {
  const [mounted, setMounted] = React.useState(false);
  
  // Ensure we're in the browser before rendering
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <RainbowKitProvider 
            chains={chains}
            modalSize="compact"
            appInfo={{
              appName: 'TrustLoanETH',
            }}
            coolMode
          >
            <WalletEvents />
            {children}
          </RainbowKitProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
