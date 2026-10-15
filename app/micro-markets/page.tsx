import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { LocalSeoConsultantsSection } from '@/components/leadgen/LocalSeoConsultantsSection';
import { MapPin, ShieldCheck, Phone, MessageSquare, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Micro-Market Real Estate Consultants & Local Advisory Desks | Prosify',
  description:
    'Connect with verified local real estate project consultants in Thane West, Kharghar Navi Mumbai, Bandra BKC, Whitefield Bengaluru, Hitec City Hyderabad, and Gurugram. Direct developer pricing and zero brokerage.',
};

export default function MicroMarketsPage() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/30 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Local Micro-Market Advisory Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Dominating <span className="text-[#10B981]">Local Micro-Markets</span> with Verified Project Advisors
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Local knowledge makes all the difference. Our micro-market consultants provide neighborhood price benchmarks, upcoming infrastructure roadmaps, and direct developer allocations across 8 prime metros.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <a
              href="https://wa.me/919167991679"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#0da674] text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </section>

        {/* Micro-Markets Directory */}
        <LocalSeoConsultantsSection showAll={true} />
      </main>

      <Footer />
    </div>
  );
}
