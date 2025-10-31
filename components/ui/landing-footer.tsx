import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0B0E11] text-gray-300 py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
        {/* Logo + Description */}
        <div className="flex flex-col space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold">TrustLoanETH</h2>
          <p className="text-gray-400 leading-relaxed">
            Empowering decentralized access to instant loans. <br />
            No paperwork. No delay.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-semibold text-white">Navigate</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="#how"
                className="hover:text-[#61A9FF] transition-colors"
              >
                How it Works
              </Link>
            </li>
            <li>
              <Link
                href="#offers"
                className="hover:text-[#61A9FF] transition-colors"
              >
                Loan Offers
              </Link>
            </li>
            <li>
              <Link
                href="#faq"
                className="hover:text-[#61A9FF] transition-colors"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-semibold text-white">Connect</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="https://t.me/"
                className="hover:text-[#61A9FF] transition-colors"
              >
                Telegram
              </Link>
            </li>
            <li>
              <Link
                href="https://twitter.com/"
                className="hover:text-[#61A9FF] transition-colors"
              >
                Twitter
              </Link>
            </li>
            <li>
              <Link
                href="#contact"
                className="hover:text-[#61A9FF] transition-colors"
              >
                Contact Support
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider + Copyright */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Xylon — All rights reserved.
      </div>
    </footer>
  );
}
