"use client";
import Nav from "@/components/ui/landing-nav"; 
import Footer from "@/components/ui/landing-footer"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; 
import { Check } from "lucide-react"; 
import { Toaster, toast } from "sonner"; 
import TawkChat from "@/components/ui/TawkChat";

export default function LoanOfferPage() { 
    const loanOffers = [ 
        { amount: 500, duration: "Instantly ", roi: "10%" }, 
        { amount: 1000, duration: "Instantly ", roi: "10%" }, 
        { amount: 2500, duration: "Instantly ", roi: "10%" }, 
        { amount: 5000, duration: "Instantly ", roi: "10%" }, 
        { amount: 10000, duration: "Instantly ", roi: "10%" }, 
        { amount: 15000, duration: "Instantly ", roi: "10%" }, 
        { amount: 20000, duration: "Instantly ", roi: "10%" }, 
        { amount: 25000, duration: "Instantly ", roi: "10%" }, 
        { amount: 30000, duration: "Instantly ", roi: "10%" }, 
    ];

    // Function to handle loan selection
    const handleSelectLoan = (amount: number) => {
        toast.info(`Attempting to connect wallet for $${amount.toLocaleString()} loan...`);
    };

    return ( 
        // Changed background to a more dynamic, modern gradient
        <main className="min-h-screen flex flex-col bg-gradient-to-br from-white via-slate-50 to-[#F0F5FF]"> 
            <Nav />

            {/* Toast at the top-center */} 
            <Toaster position="top-center" richColors /> 

            {/* Page Header - Added max-width and responsive padding */} 
            <section className="max-w-7xl mx-auto px-6 lg:px-10 xl:px-20 py-16 text-center mt-12 md:mt-20"> 
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#1E2A78] mb-4 tracking-tighter"> 
                    Instant <span className="text-[#61A9FF]">Loan Offers</span>
                </h1> 
                <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed"> 
                    Choose the perfect loan amount that fits your needs. Get instant funds directly into your wallet - fast, transparent, and secure via trustless smart contracts.
                </p> 
            </section> 

            {/* Loan Offers Grid - Implemented requested padding: px-6 (default), lg:px-10, xl:px-20 */} 
            <section className="max-w-7xl mx-auto px-5 lg:px-10 xl:px-10 pb-20 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loanOffers.map((offer, i) => ( 
                        <Card 
                            key={i} 
                            // Enhanced styling for hover and shadow
                            className="flex flex-col justify-between shadow-xl border border-blue-100 bg-white rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
                            onClick={() => handleSelectLoan(offer.amount)}> 
                            <CardHeader className="p-6"> 
                                {/* Larger, more prominent loan amount */}
                                <CardTitle className="text-4xl font-extrabold text-[#1E2A78] text-center tracking-tight"> 
                                    ${offer.amount.toLocaleString()}
                                </CardTitle> 
                                <p className="text-sm text-gray-500 text-center mt-1">Available to borrow</p>
                            </CardHeader> 
                            
                            <CardContent className="text-gray-700 space-y-5 p-6 border-t border-gray-100"> 
                                {/* Key Details */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg"> 
                                        <span className="font-medium text-gray-600">Interest Rate (ROI)</span> 
                                        <span className="text-lg font-bold text-[#1E2A78]">{offer.roi}</span> 
                                    </div> 
                                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg"> 
                                        <span className="font-medium text-gray-600">Disbursement Time</span> 
                                        <span className="text-lg font-bold text-[#1E2A78]">{offer.duration}</span> 
                                    </div> 
                                </div>

                                <div className="border-t border-gray-200 pt-5"> 
                                    <p className="text-sm text-gray-600 font-semibold mb-3 flex items-center gap-2"> 
                                        <Check className="w-4 h-4 text-[#1E2A78]" /> Core Loan Benefits:
                                    </p> 
                                    <ul className="space-y-2 text-sm text-gray-700"> 
                                        <li className="flex items-center gap-2"> 
                                            <Check className="text-[#61A9FF] w-4 h-4" /> Instant on-chain disbursement
                                        </li> 
                                        <li className="flex items-center gap-2"> 
                                            <Check className="text-[#61A9FF] w-4 h-4" /> Transparent repayment terms
                                        </li> 
                                        <li className="flex items-center gap-2"> 
                                            <Check className="text-[#61A9FF] w-4 h-4" /> No hidden fees or commissions
                                        </li> 
                                        <li className="flex items-center gap-2"> 
                                            <Check className="text-[#61A9FF] w-4 h-4" /> Collateral is secured by smart contract
                                        </li> 
                                    </ul> 
                                </div> 
                            </CardContent> 

                            {/* Button with enhanced hover effect */}
                            <div className="p-6 pt-0"> 
                                <button 
                                    className="w-full bg-[#1E2A78] hover:bg-[#152060] active:scale-[0.98] cursor-pointer text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#1E2A78]/50" 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent card click event from firing twice
                                        handleSelectLoan(offer.amount);
                                    }}
                                > 
                                    Select ${offer.amount.toLocaleString()} Loan
                                </button> 
                            </div> 
                        </Card> 
                    ))} 
                </div>
            </section>
            
            {/* Tawk.to chat */} 
            <TawkChat />
            
            <Footer /> 
        </main> 
    ); 
}