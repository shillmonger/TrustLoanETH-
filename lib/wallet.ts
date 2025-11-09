import { ethers } from "ethers";

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

// Helper: detect all available injected providers
function getInjectedProviders() {
  if (typeof window === 'undefined' || !window.ethereum) return [];
  if (window.ethereum.providers) return window.ethereum.providers;
  return [window.ethereum];
}

// Helper: map wallet name to provider property
function matchProviderByName(provider: any, walletName: string): boolean {
  if (!provider) return false;
  
  const name = walletName.toLowerCase();
  
  // Check if the provider has the expected property
  if (name === 'metamask' && provider.isMetaMask) return true;
  if (name === 'trustwallet' && provider.isTrust) return true;
  if (name === 'okxwallet' && provider.isOkxWallet) return true;
  
  // For MetaMask mobile injected providers
  if (name === 'metamask' && provider.isMetaMask === undefined && 
      provider.request && typeof provider.request === 'function') {
    return true;
  }
  
  return false;
}

// Main connection function
export async function connectWalletFromDB() {
  if (typeof window === 'undefined') {
    console.error("This function can only be called in the browser");
    return null;
  }

  try {
    // 1️⃣ Fetch user's registered wallet info from backend
    const response = await fetch("/api/user/wallet", {
      credentials: 'include', // Include cookies for session
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Failed to fetch user wallet info:", response.status, errorData);
      
      if (response.status === 401) {
        // Redirect to sign-in or show login modal
        window.location.href = "/signin";
      } else if (response.status === 404) {
        // No wallet registered, redirect to wallet setup
        window.location.href = "/settings/wallet";
      }
      
      return null;
    }

    const userWallet = await response.json();
    const registeredWallet = userWallet?.providerName?.toLowerCase(); // e.g., "metamask", "trustwallet", "okxwallet"
    const registeredAddress = userWallet?.walletAddress?.toLowerCase();

    if (!registeredWallet || !registeredAddress) {
      console.error("❌ No registered wallet found for this user");
      window.location.href = "/settings/wallet";
      return null;
    }

    // 2️⃣ Detect available providers in browser
    const providers = getInjectedProviders();
    if (providers.length === 0) {
      alert("No Web3 wallet detected. Please install a supported wallet like MetaMask, Trust Wallet, or OKX Wallet.");
      return null;
    }

    // 3️⃣ Try to match the registered provider
    let selectedProvider = providers.find(p => matchProviderByName(p, registeredWallet));

    // 4️⃣ If not found, prompt user to install/enable wallet
    if (!selectedProvider) {
      const walletName = registeredWallet.charAt(0).toUpperCase() + registeredWallet.slice(1);
      alert(
        `Your registered wallet (${walletName}) isn't detected in your browser. ` +
        `Please install or enable the ${walletName} extension.`
      );
      return null;
    }

    // 5️⃣ Connect using ethers.js
    const provider = new ethers.BrowserProvider(selectedProvider);
    
    try {
      // Request account access if needed
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      // Verify the connected address matches the registered address
      if (address.toLowerCase() !== registeredAddress) {
        alert("Connected wallet address does not match your registered wallet address.");
        return null;
      }

      console.log("✅ Connected wallet:", address);
      return { provider, signer, address };
      
    } catch (error) {
      console.error("❌ Wallet connection failed:", error);
      alert(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
    
  } catch (error) {
    console.error("❌ Error in connectWalletFromDB:", error);
    alert(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

// Helper function to format wallet address
export function formatAddress(address: string, start = 6, end = 4): string {
  if (!address) return '';
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

// Helper to check if an address is valid
export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address);
}
