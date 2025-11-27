import Link from "next/link";
import { 
  WalletMetamask, 
  WalletCoinbase, 
  WalletWalletConnect, 
  WalletSafe,    // correct name for TrustWallet
  WalletRainbow 
} from '@web3icons/react';


export default function Footer() {
const supportedWallets = [
  { name: "MetaMask", icon: <WalletMetamask size={32} variant="branded" /> },
  { name: "Coinbase Wallet", icon: <WalletCoinbase size={32} variant="branded" /> },
  { name: "WalletConnect", icon: <WalletWalletConnect size={32} variant="branded" /> },
  { name: "WalletSafe", icon: <WalletSafe size={32} variant="branded" /> },
  { name: "Rainbow", icon: <WalletRainbow size={32} variant="branded" /> },
];


  return (
    <footer className="bg-[#0B0E11] backdrop-blur-md text-gray-300 py-16 px-6 md:px-16 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 md:gap-8 lg:gap-24">
        {/* Logo + Description */}
        <div className="flex flex-col space-y-4 md:col-span-4 lg:col-span-2">
          <div>
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-extrabold focus:outline-none hover:text-[#61A9FF] transition-colors"
            >
              TrustLoanETH
            </Link>
            <p className="mt-5 leading-relaxed text-[16px] sm:text-1xl">
              Empowering decentralized access to instant loans. No paperwork. No
              delay. Unlock the power of your crypto assets and get instant
              liquidity, backed by secure, trustless smart contracts.
            </p>
          </div>

          {/* Supported Wallets */}
          <div className="mt-4">
            <h3 className="text-white font-semibold mb-2">Supported Wallets</h3>
            <div className="flex space-x-4 mt-1">
              {supportedWallets.map((wallet) => (
                <div
                  key={wallet.name}
                  className="p-2 bg-[#1A1D23] rounded-lg hover:scale-110 transition-transform cursor-pointer shadow-md"
                  title={wallet.name}
                >
                  {wallet.icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wallets */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold text-white">Wallets</h3>
          <ul className="space-y-2">
            <li><Link href="#rainbow" className="hover:text-[#61A9FF] transition-colors">Rainbow</Link></li>
            <li><Link href="#trustwallet" className="hover:text-[#61A9FF] transition-colors">TrustWallet</Link></li>
            <li><Link href="#metamask" className="hover:text-[#61A9FF] transition-colors">MetaMask</Link></li>
            <li><Link href="#walletconnect" className="hover:text-[#61A9FF] transition-colors">WalletConnect</Link></li>
            <li><Link href="#coinbase" className="hover:text-[#61A9FF] transition-colors">Coinbase Wallet</Link></li>
          </ul>
        </div>

        {/* Navigate */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold text-white">Navigate</h3>
          <ul className="space-y-2">
            <li><Link href="#faq" className="hover:text-[#61A9FF] transition-colors">FAQ</Link></li>
            <li><Link href="#offers" className="hover:text-[#61A9FF] transition-colors">Loan Offers</Link></li>
            <li><Link href="#how" className="hover:text-[#61A9FF] transition-colors">How it Works</Link></li>
          </ul>
        </div>

        {/* Connect */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold text-white">Connect</h3>
          <ul className="space-y-2">
            <li><Link href="https://twitter.com/" className="hover:text-[#61A9FF] transition-colors">Twitter</Link></li>
            <li><Link href="https://t.me/" className="hover:text-[#61A9FF] transition-colors">Telegram</Link></li>
            <li><Link href="#contact" className="hover:text-[#61A9FF] transition-colors">Contact Support</Link></li>
          </ul>
        </div>
      </div>

      {/* Divider + Copyright */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Trust-Loan-ETH — All rights reserved.
      </div>
    </footer>
  );
}
