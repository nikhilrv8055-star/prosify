'use client';

import React, { useState } from 'react';
import {
  Layout,
  CheckCircle2,
  Eye,
  EyeOff,
  Save,
  Sparkles,
  Type,
  Sliders,
} from 'lucide-react';

interface CmsSectionConfig {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  isEnabled: boolean;
}

export function HomePageCmsView() {
  const [sections, setSections] = useState<CmsSectionConfig[]>([
    { id: 'sec-hero', name: 'Hero Banner Section', title: 'Find Your Next Grade-A Dream Home in Mumbai MMR', subtitle: 'Direct developer pricing, 100% verified MahaRERA certifications, zero brokerage.', isEnabled: true },
    { id: 'sec-about', name: 'About Section', title: 'AI-Powered Real Estate Ecosystem', subtitle: 'Bridging enterprise developers, channel partners, and verified buyers.', isEnabled: true },
    { id: 'sec-why-us', name: 'Why Choose Us Section', title: 'Why Discerning Buyers Choose Us', subtitle: 'Zero AI slop, strict RERA audit compliance, guaranteed escrow transactions.', isEnabled: true },
    { id: 'sec-brand', name: 'Top Developers Brand Section', title: 'Grade-A Builder Partners', subtitle: 'Showcasing India’s premier conglomerates (Godrej, Lodha, Oberoi, Prestige).', isEnabled: true },
    { id: 'sec-prop', name: 'Property Section', title: 'Latest Available Residential & Commercial Units', subtitle: 'Real-time inventory syndicated directly via developer API.', isEnabled: true },
    { id: 'sec-featured', name: 'Featured Property Section', title: 'Handpicked Landmark Developments', subtitle: 'Curated luxury towers with exclusive developer payment holidays.', isEnabled: true },
    { id: 'sec-counter', name: 'Counter / Metrics Section', title: 'Platform Trust Metrics', subtitle: '₹1,250+ Cr properties listed, 12,000+ satisfied homeowners.', isEnabled: true },
    { id: 'sec-city', name: 'City / Micro-Market Showcase', title: 'Explore Prime Neighborhoods', subtitle: 'BKC, Powai, Thane, Worli, Whitefield & Pune prime zones.', isEnabled: true },
    { id: 'sec-testimonial', name: 'Testimonials Section', title: 'What Verified Homebuyers Say', subtitle: 'Direct homeowner experiences and verified video reviews.', isEnabled: true },
    { id: 'sec-vendor', name: 'Vendor & Builder Section', title: 'Are You a Developer or Vendor?', subtitle: 'Syndicate your project and materials catalogue in 24 hours.', isEnabled: true },
    { id: 'sec-subscribe', name: 'Newsletter & Alert Subscription', title: 'Stay Ahead of High-Yield New Launches', subtitle: 'Exclusive invitations to pre-launch rounds and price alerts.', isEnabled: true },
  ]);

  const [toast, setToast] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
  };

  const handleSave = () => {
    setToast('Homepage CMS sections and visibility preferences saved live!');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-400" />
            <span>Home Page CMS & Section Customizer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Customize copy, headlines, and toggle visibility for all 11 homepage sections.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes Live</span>
        </button>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Sections Table / Cards */}
      <div className="space-y-3">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className="p-4 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center justify-center font-bold">
                {idx + 1}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{sec.name}</h3>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                      sec.isEnabled
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    {sec.isEnabled ? 'VISIBLE' : 'HIDDEN'}
                  </span>
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Headline: <strong className="text-white">{sec.title}</strong>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{sec.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-auto md:ml-0">
              <button
                onClick={() => handleToggle(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border cursor-pointer transition-colors ${
                  sec.isEnabled
                    ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                    : 'bg-rose-950/60 border-rose-800 text-rose-300'
                }`}
              >
                {sec.isEnabled ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                <span>{sec.isEnabled ? 'Hide Section' : 'Show Section'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
