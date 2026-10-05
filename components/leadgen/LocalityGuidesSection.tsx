'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Download,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  FileText,
  Layers,
} from 'lucide-react';
import { LOCALITY_GUIDES } from '@/lib/data/localityGuidesData';
import { GatedEbookDownloadModal, LocalityGuideItem } from './GatedEbookDownloadModal';

interface LocalityGuidesSectionProps {
  showAll?: boolean;
  limit?: number;
}

export function LocalityGuidesSection({ showAll = false, limit = 6 }: LocalityGuidesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeGuideForModal, setActiveGuideForModal] = useState<LocalityGuideItem | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Guides & E-Books' },
    { id: 'INFRASTRUCTURE', label: 'Mega Infrastructure' },
    { id: 'PRICE_TRENDS', label: 'Micro-Market Price Trends' },
    { id: 'INVESTMENT_REPORT', label: 'Investment & Yield Reports' },
    { id: 'LEGAL_CHECKLIST', label: 'MahaRERA Legal Checklists' },
  ];

  const filteredGuides = LOCALITY_GUIDES.filter((g) => {
    if (selectedCategory === 'ALL') return true;
    return g.category === selectedCategory;
  }).slice(0, showAll ? undefined : limit);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-bold tracking-wide uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Locality Guides & Gated E-Books</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            High-Value Digital Intelligence & <span className="text-[#0EA5E9]">Area Infrastructure Reports</span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Download comprehensive area infrastructure blueprints, micro-market pricing trends, and certified legal due-diligence e-books published by licensed research analysts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <Link
            href="/guides"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <span>View All Guides Repository</span>
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

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === c.id
                ? 'bg-[#0EA5E9] text-white border-[#0EA5E9] shadow-md shadow-[#0EA5E9]/20'
                : 'bg-[#1E293B]/70 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            className="group rounded-3xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700/80 hover:border-[#10B981]/60 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Cover Image & Metadata Badges */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                <Image
                  src={guide.coverImage}
                  alt={guide.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-950/80 backdrop-blur-md text-[#0EA5E9] border border-[#0EA5E9]/40">
                    {guide.region}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-400/40">
                    {guide.category.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{guide.pageCount} Pages • {guide.fileSize}</span>
                  </span>
                  <span className="text-[#10B981] font-bold">2026 Edition</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white group-hover:text-[#10B981] transition-colors leading-snug">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {guide.subtitle}
                </p>
              </div>

              {/* Research Insights Capsule */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-[11px] text-slate-300">Targeted Appreciation</span>
                  <span className="text-[11px] font-mono font-bold text-[#10B981]">
                    {guide.sampleContent.projectedYield}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA5E9] shrink-0" />
                  <span className="line-clamp-1">{guide.keyTakeaways[0]}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#10B981]" />
                <span>Instant Gated Unlock</span>
              </span>

              <button
                type="button"
                onClick={() => setActiveGuideForModal(guide)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#10B981] to-[#0EA5E9] hover:opacity-90 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Free Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Gated Download Modal */}
      <GatedEbookDownloadModal
        guide={activeGuideForModal}
        isOpen={!!activeGuideForModal}
        onClose={() => setActiveGuideForModal(null)}
      />
    </section>
  );
}
