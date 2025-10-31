import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';

// Import the Wagmi provider wrapper
import WagmiProviderWrapper from "@/components/ui/wagmi-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrustLoanETH",
  description:
    "Instant crypto loans backed by your Trust Wallet reputation. No collateral, no hassle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/*Wrap entire app inside WagmiProviderWrapper */}
        <WagmiProviderWrapper>{children}</WagmiProviderWrapper>

        {/* Keep your existing Tawk.to Live Chat Integration */}
        <Script id="tawk-to" strategy="afterInteractive">
          {`
            var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
            (function(){
              var s1 = document.createElement("script"),
              s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = 'https://embed.tawk.to/6903e48acc82b2194f5dbe7c/1j8rj9fg5';
              s1.charset = 'UTF-8';
              s1.setAttribute('crossorigin', '*');
              s0.parentNode.insertBefore(s1, s0);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
