'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Check,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Search,
  Building2,
  MapPin,
  ArrowRight,
  SlidersHorizontal,
  Home,
  CheckCircle2,
} from 'lucide-react';
import {
  FestivalThemeDefinition,
  FestivalThemeConfig,
  AmbientEffectType,
  HolidayCustomization,
} from '@/lib/theme/festivalThemeTypes';

interface ThemeHomepagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: FestivalThemeDefinition;
  config: FestivalThemeConfig;
  customization?: HolidayCustomization;
  onApplyGlobally: () => void;
}

export function ThemeHomepagePreviewModal({
  isOpen,
  onClose,
  theme,
  config,
  customization,
  onApplyGlobally,
}: ThemeHomepagePreviewModalProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [searchTab, setSearchTab] = useState<'BUY' | 'PROJECTS' | 'COMMERCIAL'>('BUY');

  if (!isOpen) return null;

  // Compute effective preview properties
  const effectiveAccent = customization?.accentColor || config.accentColorOverride || theme.primaryColor;
  const effectiveBannerImage =
    customization?.bannerImageUrl ||
    config.customBannerImage ||
    theme.defaultBannerImage ||
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80';
  const effectiveOverlay: AmbientEffectType =
    customization?.festiveOverlay || config.festiveOverlayOverride || theme.ambientEffectType;
  const effectiveGreeting =
    customization?.customGreeting || config.customBannerGreeting || theme.defaultBannerGreeting;
  const effectiveSubtext =
    customization?.customSubtext || config.customBannerSubtext || theme.defaultBannerSubtext;
  const effectiveCtaText =
    customization?.customCtaText || config.customCtaText || theme.defaultCtaText;
  const effectiveBadgeText =
    customization?.customBadgeText || config.customBadgeText || theme.defaultBadgeText;

  // Mock featured properties for homepage preview
  const sampleProperties = [
    {
      id: 'p1',
      title: 'Oberoi Sky City Grand Luxury Tower',
      location: 'Borivali East, Western Suburbs, Mumbai',
      price: '₹ 3.85 Cr',
      bhk: '3 BHK Ultra Luxury',
      area: '1,450 sq.ft',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'p2',
      title: 'Godrej Woods Green Serenity Estate',
      location: 'Sector 43, Expressway Corridor, Noida',
      price: '₹ 2.45 Cr',
      bhk: '4 BHK Forest Residences',
      area: '2,200 sq.ft',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'p3',
      title: 'Prestige Kingfisher Ultra Towers',
      location: 'UB City Corridor, Lavelle Road, Bangalore',
      price: '₹ 8.50 Cr',
      bhk: '4 BHK Presidential Suite',
      area: '4,100 sq.ft',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const getContainerWidth = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[420px]';
      case 'tablet':
        return 'max-w-[820px]';
      default:
        return 'w-full max-w-[1240px]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full h-[94vh] max-w-7xl flex flex-col shadow-2xl overflow-hidden relative">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800/90 bg-neutral-900/95 flex-shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-white/10"
              style={{ backgroundColor: `${effectiveAccent}25` }}
            >
              {theme.iconEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold text-white">
                  Live Homepage Theme Preview
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-neutral-950"
                  style={{ backgroundColor: effectiveAccent }}
                >
                  {theme.name}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Simulated public visitor experience before global deployment
              </p>
            </div>
          </div>

          {/* DEVICE RESPONSIVENESS TOGGLES */}
          <div className="hidden sm:flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                device === 'desktop'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                device === 'tablet'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                device === 'mobile'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Back to Edit
            </button>
            <button
              onClick={() => {
                onApplyGlobally();
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-neutral-950 shadow-lg transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
              style={{ backgroundColor: effectiveAccent }}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Apply Globally Now</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PREVIEW CONTAINER BODY */}
        <div className="flex-1 overflow-y-auto bg-neutral-900/60 p-4 sm:p-6 flex justify-center items-start">
          <div
            className={`transition-all duration-300 mx-auto bg-white text-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-neutral-300/40 relative flex flex-col ${getContainerWidth()}`}
          >
            {/* 1. FESTIVE TOP ANNOUNCEMENT BAR */}
            <div
              className={`w-full bg-gradient-to-r ${theme.bannerGradient} py-2.5 px-4 text-white flex items-center justify-between gap-3 text-xs relative z-40 border-b border-white/10`}
              style={{
                boxShadow: `0 3px 15px ${effectiveAccent}35`,
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base animate-bounce">{theme.iconEmoji}</span>
                <span className="font-extrabold truncate">{effectiveGreeting}</span>
                {effectiveSubtext && (
                  <span className="hidden md:inline text-white/80 font-normal truncate">
                    • {effectiveSubtext}
                  </span>
                )}
              </div>
              <div
                className="px-3 py-1 rounded-full text-[11px] font-bold text-neutral-950 flex-shrink-0 shadow"
                style={{ backgroundColor: effectiveAccent }}
              >
                {effectiveCtaText}
              </div>
            </div>

            {/* 2. MOCK PUBLIC NAVBAR */}
            <header className="bg-white/95 backdrop-blur-md border-b border-neutral-100 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 font-black text-lg text-neutral-900 tracking-tight">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm"
                    style={{ backgroundColor: effectiveAccent }}
                  >
                    P
                  </div>
                  <span>PROSIFY</span>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                  style={{
                    backgroundColor: `${effectiveAccent}15`,
                    color: effectiveAccent,
                    borderColor: `${effectiveAccent}40`,
                  }}
                >
                  {theme.hindiName}
                </span>
              </div>

              <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-neutral-600">
                <span className="text-neutral-950 font-bold border-b-2 pb-0.5" style={{ borderColor: effectiveAccent }}>
                  Buy Properties
                </span>
                <span className="hover:text-neutral-950 cursor-pointer">New Projects</span>
                <span className="hover:text-neutral-950 cursor-pointer">Commercial Hubs</span>
                <span className="hover:text-neutral-950 cursor-pointer">Top Developers</span>
                <span className="hover:text-neutral-950 cursor-pointer">Festive Deals</span>
              </nav>

              <div className="flex items-center gap-2">
                <span
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-950 cursor-pointer shadow-xs"
                  style={{ backgroundColor: effectiveAccent }}
                >
                  Book Site Visit
                </span>
              </div>
            </header>

            {/* 3. HERO SECTION WITH CUSTOM BANNER IMAGE & FESTIVE OVERLAY */}
            <section className="relative bg-neutral-950 text-white overflow-hidden py-12 sm:py-16 px-4 sm:px-8">
              {/* Background Image: Custom Uploaded or Festival Banner */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={effectiveBannerImage}
                  alt={`${theme.name} Hero Banner`}
                  fill
                  className="object-cover opacity-35"
                  priority
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
              </div>

              {/* Specular Ambient Glow */}
              <div
                className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ backgroundColor: effectiveAccent }}
              />

              <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md mx-auto"
                  style={{
                    backgroundColor: `${effectiveAccent}20`,
                    color: effectiveAccent,
                    borderColor: `${effectiveAccent}50`,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{theme.name} Festive Special Celebration</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Auspicious Home Ownership Across India
                </h1>

                <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto">
                  Experience direct builder transparent bookings, 0% brokerage, and exclusive {theme.name} festival benefits with instant token confirmations.
                </p>

                {/* SEARCH BAR HIGHLIGHTED WITH THEME ACCENT */}
                <div className="bg-white rounded-2xl p-3 sm:p-4 text-neutral-900 shadow-2xl max-w-3xl mx-auto border border-neutral-200 mt-6 text-left">
                  <div className="flex items-center gap-2 border-b border-neutral-100 pb-2 mb-3">
                    <button
                      onClick={() => setSearchTab('BUY')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        searchTab === 'BUY'
                          ? 'text-neutral-950 shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                      style={searchTab === 'BUY' ? { backgroundColor: effectiveAccent } : {}}
                    >
                      Buy Homes
                    </button>
                    <button
                      onClick={() => setSearchTab('PROJECTS')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        searchTab === 'PROJECTS'
                          ? 'text-neutral-950 shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                      style={searchTab === 'PROJECTS' ? { backgroundColor: effectiveAccent } : {}}
                    >
                      New Projects
                    </button>
                    <button
                      onClick={() => setSearchTab('COMMERCIAL')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        searchTab === 'COMMERCIAL'
                          ? 'text-neutral-950 shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                      style={searchTab === 'COMMERCIAL' ? { backgroundColor: effectiveAccent } : {}}
                    >
                      Commercial Hubs
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                    <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                      <span className="text-[10px] text-neutral-400 block font-semibold">City</span>
                      <strong className="text-neutral-800">Mumbai MMR</strong>
                    </div>
                    <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                      <span className="text-[10px] text-neutral-400 block font-semibold">Configuration</span>
                      <strong className="text-neutral-800">2 & 3 BHK</strong>
                    </div>
                    <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                      <span className="text-[10px] text-neutral-400 block font-semibold">Budget Range</span>
                      <strong className="text-neutral-800">₹ 1.5 - 3.5 Cr</strong>
                    </div>
                    <button
                      className="w-full py-3 rounded-xl font-black text-xs text-neutral-950 flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
                      style={{ backgroundColor: effectiveAccent }}
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Search Homes</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. FESTIVE CELEBRATION DHAMAKA CALLOUT STRIP */}
            <div
              className={`p-4 bg-gradient-to-r ${theme.bannerGradient} text-white border-y flex flex-col sm:flex-row items-center justify-between gap-3 text-xs`}
              style={{ borderColor: `${effectiveAccent}40` }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{theme.iconEmoji}</span>
                <div>
                  <h4 className="font-extrabold text-sm flex items-center gap-2">
                    <span>{theme.name} Festive Buyer Privileges</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/20 font-mono">
                      LIMITED TIME
                    </span>
                  </h4>
                  <p className="text-white/80 text-[11px] mt-0.5">
                    {effectiveSubtext || 'Direct builder spot token discount + Free 10g Gold Coin with registration'}
                  </p>
                </div>
              </div>
              <div
                className="px-4 py-2 rounded-xl text-neutral-950 font-black text-xs shadow-md whitespace-nowrap"
                style={{ backgroundColor: effectiveAccent }}
              >
                Claim Festive Voucher
              </div>
            </div>

            {/* 5. FEATURED PROPERTY SHOWCASE WITH FESTIVE BADGES */}
            <div className="p-6 bg-neutral-50/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-neutral-900">
                      Handpicked Festive Luxury Homes
                    </h3>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border"
                      style={{
                        backgroundColor: `${effectiveAccent}20`,
                        color: effectiveAccent,
                        borderColor: `${effectiveAccent}50`,
                      }}
                    >
                      {effectiveBadgeText}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Verified RERA inventories with zero brokerage & spot festival discounts
                  </p>
                </div>
                <span className="text-xs font-bold text-neutral-700 hover:underline flex items-center gap-1 cursor-pointer">
                  <span>View All 420+</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* PROPERTY CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sampleProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-white rounded-2xl overflow-hidden border transition-all shadow-sm hover:shadow-md flex flex-col justify-between group"
                    style={{
                      borderColor: `${effectiveAccent}35`,
                    }}
                  >
                    <div>
                      <div className="relative h-44 w-full">
                        <Image
                          src={prop.image}
                          alt={prop.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                          <span
                            className="px-2.5 py-1 rounded-lg text-[10px] font-black shadow-md text-neutral-950"
                            style={{ backgroundColor: effectiveAccent }}
                          >
                            {effectiveBadgeText}
                          </span>
                        </div>
                        <div className="absolute bottom-2.5 right-2.5 bg-neutral-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                          {prop.bhk}
                        </div>
                      </div>

                      <div className="p-3.5 space-y-1.5">
                        <h4 className="text-xs font-extrabold text-neutral-900 line-clamp-1">
                          {prop.title}
                        </h4>
                        <p className="text-[11px] text-neutral-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                          <span className="truncate">{prop.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 pt-0 border-t border-neutral-100 flex items-center justify-between mt-2">
                      <div>
                        <span className="text-[10px] text-neutral-400 block">Offer Price</span>
                        <span className="text-sm font-black text-neutral-950">{prop.price}</span>
                      </div>
                      <button
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-950 shadow-xs cursor-pointer"
                        style={{ backgroundColor: effectiveAccent }}
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MOCK PUBLIC FOOTER */}
            <footer className="bg-neutral-900 text-white p-6 border-t border-neutral-800 text-center text-xs space-y-2">
              <div className="flex items-center justify-center gap-2 font-black text-sm">
                <span>PROSIFY REAL ESTATE MARKETPLACE</span>
                <span className="text-amber-400">✨</span>
              </div>
              <p className="text-neutral-400 text-[11px]">
                Showing live public homepage rendering for theme <strong>{theme.name}</strong>.
              </p>
            </footer>
          </div>
        </div>

        {/* MODAL FOOTER STATUS BAR */}
        <div className="px-6 py-3.5 bg-neutral-900 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs flex-shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <span className="text-neutral-500">Accent:</span>
              <span
                className="w-3.5 h-3.5 rounded-full inline-block border border-white/20"
                style={{ backgroundColor: effectiveAccent }}
              />
              <code className="text-neutral-400 font-mono text-[11px]">{effectiveAccent}</code>
            </div>

            <div className="flex items-center gap-1.5 text-neutral-300">
              <span className="text-neutral-500">Overlay:</span>
              <span className="font-semibold text-white capitalize">
                {effectiveOverlay.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-neutral-300">
              <span className="text-neutral-500">Banner Image:</span>
              <span className="text-white font-semibold truncate max-w-[150px]">
                {customization?.bannerImageUrl || config.customBannerImage ? 'Custom Uploaded' : 'Default Preset'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-amber-400/90 font-medium hidden md:inline">
              ⚡ This preview does not alter the live site until you click 'Apply Globally Now'.
            </span>
            <button
              onClick={() => {
                onApplyGlobally();
                onClose();
              }}
              className="px-5 py-2 rounded-xl text-xs font-black text-neutral-950 flex items-center gap-1.5 shadow-xl cursor-pointer hover:opacity-95"
              style={{ backgroundColor: effectiveAccent }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Globally Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
