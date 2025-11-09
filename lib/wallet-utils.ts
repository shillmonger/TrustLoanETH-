import { WALLET_PROVIDERS, WalletProvider } from '@/models/User';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isTrust?: boolean;
      isOkxWallet?: boolean;
      providers?: any[];
      request: (request: { method: string; params?: any }) => Promise<any>;
    };
  }
}

export function detectWalletProvider(): WalletProvider | null {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }

  // Handle multiple injected providers
  const providers = window.ethereum.providers || [window.ethereum];
  
  for (const provider of providers) {
    if (provider.isMetaMask) return 'metamask';
    if (provider.isTrust) return 'trustwallet';
    if (provider.isOkxWallet) return 'okxwallet';
    
    // Fallback for MetaMask mobile injected providers
    if (provider.request && typeof provider.request === 'function') {
      // This is a generic check for injected providers that might not have the flags set
      return 'metamask';
    }
  }
  
  return null;
}

export async function getWalletAddress(provider: any): Promise<string | null> {
  try {
    if (!provider || !provider.request) return null;
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    return accounts[0]?.toLowerCase() || null;
  } catch (error) {
    console.error('Failed to get wallet address:', error);
    return null;
  }
}

export function validateWalletProvider(provider: string): provider is WalletProvider {
  return (WALLET_PROVIDERS as readonly string[]).includes(provider.toLowerCase());
}
