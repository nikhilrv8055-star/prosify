import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { LocalityGuidesSection } from '@/components/leadgen/LocalityGuidesSection';
import { BookOpen, ShieldCheck, Download, Sparkles, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Locality Guides & Real Estate E-Books 2026 | Prosify',
  description:
    'Download comprehensive micro-market area infrastructure blueprints, pricing trajectories, and certified legal due diligence e-books for Mumbai, Thane, Navi Mumbai, Bengaluru, and Hyderabad.',
};

export default function LocalityGuidesPage() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Prosify Digital Research Library</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Comprehensive <span className="text-[#0EA5E9]">Locality Guides</span> & Real Estate Research E-Books
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Gain unfair market advantage. Access granular infrastructure timelines, metro expansion routes, pricing indices, and certified MahaRERA legal frameworks before making property commitments.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <a
              href="https://wa.me/919326303244"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#0da674] text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </section>

        {/* Guides Directory Section */}
        <LocalityGuidesSection showAll={true} />
      </main>

      <Footer />
    </div>
  );
}
