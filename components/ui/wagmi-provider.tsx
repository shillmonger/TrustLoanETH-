"use client";

import React, { ReactNode } from "react";
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
  children: React.ReactNode;
}

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '' }),
    publicProvider(),
  ]
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

// Set up the wagmi config
const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

// Create a React Query client
const queryClient = new QueryClient();

// Fix for ReactNode type mismatch
export default function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          chains={chains}
          modalSize="compact"
          appInfo={{
            appName: 'TrustLoanETH',
          }}
        >
          <WalletEvents />
          {children as any}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
