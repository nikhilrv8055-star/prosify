'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Star,
  ShieldCheck,
  Building,
  Phone,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Calendar,
  Users,
} from 'lucide-react';
import { MICRO_MARKETS } from '@/lib/data/microMarketsData';
import { LocalConsultantInquiryModal, MicroMarketInfo } from './LocalConsultantInquiryModal';

interface LocalSeoConsultantsSectionProps {
  showAll?: boolean;
  limit?: number;
}

export function LocalSeoConsultantsSection({ showAll = false, limit = 6 }: LocalSeoConsultantsSectionProps) {
  const [selectedMarketForModal, setSelectedMarketForModal] = useState<MicroMarketInfo | null>(null);

  const displayedMarkets = showAll ? MICRO_MARKETS : MICRO_MARKETS.slice(0, limit);

  // Generate LocalBusiness Schema.org JSON-LD for rich Google ranking
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Prosify Local Real Estate Micro-Market Consultants',
    url: 'https://prosify.in/micro-markets',
    telephone: '+919326303244',
    priceRange: '₹₹₹₹',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '2549',
    },
    areaServed: MICRO_MARKETS.map((m) => ({
      '@type': 'AdministrativeArea',
      name: m.name,
    })),
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Inject Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/30 text-xs font-bold tracking-wide uppercase">
            <MapPin className="w-3.5 h-3.5" />
            <span>Local Micro-Market Consultants & Google Business Verified</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Micro-Market Project Consultants & <span className="text-[#10B981]">Local Advisory Desks</span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Connect directly with verified local real estate project advisors dominating key micro-markets. Zero middleman fees, verified RERA legal compliance, and complimentary private site inspections.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <Link
            href="/micro-markets"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <span>All Micro-Market Branches</span>
            <ArrowRight className="w-4 h-4 text-[#0EA5E9]" />
          </Link>

          <a
            href="https://wa.me/919326303244"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#0da674] text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Grid of Micro-Markets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedMarkets.map((market) => (
          <div
            key={market.id}
            className="group rounded-3xl bg-[#1E293B]/65 backdrop-blur-xl border border-slate-700/60 hover:border-[#0EA5E9]/70 p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ring-1 ring-white/5"
          >
            <div className="space-y-4">
              {/* Top Badge: Google Review & Status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{market.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({market.reviewsCount} Google Reviews)</span>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Branch
                </span>
              </div>

              {/* Micro-market Title */}
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-[#0EA5E9] transition-colors leading-snug">
                  {market.name}
                </h3>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0EA5E9] shrink-0" />
                  <span className="truncate">{market.city}</span>
                </span>
              </div>

              {/* Consultant Spotlight */}
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                  {market.consultantName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white truncate">{market.consultantName}</span>
                  </div>
                  <p className="text-[11px] text-[#0EA5E9] font-medium truncate">{market.consultantTitle}</p>
                </div>
              </div>

              {/* Focus Speciality */}
              <div className="space-y-1 text-xs">
                <span className="text-[11px] text-slate-400 font-medium block">Key Micro-Market Focus:</span>
                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                  {market.speciality}
                </p>
              </div>

              {/* Active Projects Count */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 py-1.5 px-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
                <span>Direct Developer Projects:</span>
                <span className="text-white font-bold">{market.activeProjects} RERA Projects</span>
              </div>
            </div>

            {/* Inbound Action CTA */}
            <div className="pt-4 border-t border-slate-800 mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedMarketForModal(market)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Site Inspection</span>
              </button>

              <a
                href="https://wa.me/919326303244"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3.5 rounded-xl bg-[#10B981] hover:bg-[#0da674] text-slate-950 font-black text-xs flex items-center justify-center gap-1 shadow-md transition-all active:scale-95"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Local Consultant Modal */}
      <LocalConsultantInquiryModal
        market={selectedMarketForModal}
        isOpen={!!selectedMarketForModal}
        onClose={() => setSelectedMarketForModal(null)}
      />
    </section>
  );
}
