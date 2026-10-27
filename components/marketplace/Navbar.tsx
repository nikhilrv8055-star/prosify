'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
  Building2,
  Menu,
  X,
  Scale,
  Sparkles,
  Rocket,
  Layers,
  Home,
  KeyRound,
  HardHat,
  Briefcase,
  MapPin,
  ChevronRight,
  ChevronDown,
  ClipboardEdit,
  Share2,
  Shield,
  UserCheck,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';
import { ProsifyLogo } from '@/components/brand/ProsifyLogo';
import { SmartMatcherModal } from '@/components/marketplace/SmartMatcherModal';
import { MobileBurgerMenu } from './MobileBurgerMenu';
import { PropertyRequirementModal } from './PropertyRequirementModal';
import { brandConfig } from '@/src/config/brand';

interface NavbarProps {
  onOpenEnquiry?: () => void;
  onOpenMatcher?: () => void;
}

function PartnerTrackerBanner() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname() || '';
  const partnerQuery = searchParams?.get('partner') || searchParams?.get('ref') || searchParams?.get('cp');
  const partnerAttribution = partnerQuery ? partnerQuery.toUpperCase() : null;

  useEffect(() => {
    setMounted(true);
    if (partnerQuery) {
      fetch('/api/tracking/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerCode: partnerQuery,
          targetPath: pathname,
          eventType: 'LANDING_PAGE_VIEW',
          utmSource: searchParams?.get('utm_source'),
          utmMedium: searchParams?.get('utm_medium'),
          utmCampaign: searchParams?.get('utm_campaign'),
        }),
      }).catch(() => {});
    }
  }, [partnerQuery, searchParams, pathname]);

  if (!mounted || !partnerAttribution) return null;

  return (
    <div className="bg-[#D4A017] text-neutral-950 px-4 py-1.5 text-xs font-medium text-center flex items-center justify-center gap-2">
      <span>
        Verified Referral / Partner Active: <strong>{partnerAttribution}</strong>
      </span>
      <span className="text-[11px] opacity-80 hidden sm:inline">
        • Direct developer pricing and verified booking guarantee active across Maharashtra Metro Cities
      </span>
    </div>
  );
}

export function Navbar({ onOpenMatcher }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalMatcherOpen, setInternalMatcherOpen] = useState(false);
  const [requirementModalOpen, setRequirementModalOpen] = useState(false);
  const currentType = useSyncExternalStore(
    (callback) => {
      window.addEventListener('popstate', callback);
      return () => window.removeEventListener('popstate', callback);
    },
    () => (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('type') : null),
    () => null
  );

  const { comparedPropertyIds } = useAuth();

  // Active compare count
  const compareCount = comparedPropertyIds && comparedPropertyIds.length > 0 ? comparedPropertyIds.length : 2;

  const handleOpenMatcher = () => {
    if (onOpenMatcher) {
      onOpenMatcher();
    } else {
      setInternalMatcherOpen(true);
    }
  };

  // Primary navigation links for Desktop with rich hover popup descriptions
  const navLinks = [
    {
      label: 'Buy Homes',
      href: '/properties?type=BUY',
      icon: Home,
      highlight: false,
      popupTitle: 'Buy Verified Homes',
      popupDesc: 'Explore 100% RERA verified flats, luxury villas & penthouses with direct builder pricing.',
      popupHighlight: '0% Brokerage • Verified Docs',
    },
    {
      label: 'Projects',
      href: '/projects',
      icon: Layers,
      highlight: false,
      popupTitle: 'Townships & High-Rises',
      popupDesc: 'Master-planned residential communities, society amenities & verified floor plans.',
      popupHighlight: 'Pre-Launch & Ready To Move',
    },
    {
      label: 'New Launches',
      href: '/properties?possession=NEW_LAUNCH',
      icon: Rocket,
      highlight: true,
      badge: 'HOT',
      popupTitle: 'Hot New Launches',
      popupDesc: 'Early-bird bookings with exclusive pre-launch discount pricing and priority unit allocation.',
      popupHighlight: 'Inaugural Pricing • High ROI',
    },
    {
      label: 'Micro-Markets',
      href: '/micro-markets',
      icon: MapPin,
      highlight: false,
      popupTitle: 'Maharashtra Metro Markets',
      popupDesc: 'Analyze top investment hotspots and price trends across Maharashtra’s premier metropolitan regions.',
      popupHighlight: 'Mumbai, Pune, Nagpur, Nashik & more',
    },
    {
      label: 'Developers',
      href: '/developers',
      icon: HardHat,
      highlight: false,
      popupTitle: 'Top Tier Developers',
      popupDesc: 'Connect directly with trusted grade-A builders with proven on-time delivery track records.',
      popupHighlight: 'Godrej, Lodha, Prestige, DLF & more',
    },
    {
      label: 'Commercial',
      href: '/properties?type=COMMERCIAL',
      icon: Briefcase,
      highlight: false,
      popupTitle: 'Commercial & Retail Spaces',
      popupDesc: 'Invest in high-rental-yield grade-A office spaces, SCO plots & retail shopping centers.',
      popupHighlight: '7% to 9% Yield • Pre-Leased',
    },
  ];

  return (
    <>
      <React.Suspense fallback={null}>
        <PartnerTrackerBanner />
      </React.Suspense>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-neutral-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 lg:h-20">
            {/* Brand Logo */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <ProsifyLogo variant="dark" size="md" href="/" showTagline={false} />
            </div>

            {/* Desktop Navigation Links: Transparent Glass Buttons with Mouse Cursor Hover Popup Effect */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href.includes('?') && pathname === link.href.split('?')[0]);
                const Icon = link.icon;

                return (
                  <div key={link.label} className="relative group">
                    <Link
                      href={link.href}
                      className={`relative px-3.5 py-2 rounded-xl text-[13px] font-semibold backdrop-blur-md transition-all duration-200 ease-out flex items-center gap-1.5 hover:scale-105 hover:-translate-y-0.5 active:scale-95 cursor-pointer ${
                        isActive
                          ? 'bg-amber-500/15 border border-amber-400/50 text-neutral-950 font-bold shadow-[0_2px_12px_rgba(212,160,23,0.18)]'
                          : 'bg-white/50 hover:bg-white/80 border border-white/70 hover:border-amber-400/50 text-neutral-700 hover:text-neutral-950 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(212,160,23,0.15)]'
                      }`}
                    >
                      {/* Top Specular Glass Highlight */}
                      <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none rounded-t-xl" />

                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[9px] font-black tracking-wider uppercase shadow-xs">
                          {link.badge}
                        </span>
                      )}
                    </Link>

                    {/* Mouse Hover Popup Effect */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 pt-1 pointer-events-none z-50 transition-all duration-200 ease-out opacity-0 invisible -translate-y-1 scale-95 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100">
                      <div className="relative w-64 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-[0_16px_36px_rgba(0,0,0,0.15)] text-left">
                        {/* Triangle arrow pointer */}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-white border-l border-t border-neutral-200/70" />
                        <div className="relative z-10 space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 text-[#D4A017] shrink-0" />
                            <span className="text-xs font-bold text-neutral-900 leading-tight">
                              {link.popupTitle}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-600 leading-snug">
                            {link.popupDesc}
                          </p>
                          <div className="pt-1.5 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                            <span className="font-semibold text-[#D4A017] tracking-tight">
                              {link.popupHighlight}
                            </span>
                            <span className="text-neutral-400 flex items-center gap-0.5">
                              Explore <ChevronRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Desktop Right Actions: Transparent Glass Buttons with Mouse Cursor Hover Popup Effect */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Smart Match Button in Transparent Glass */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={handleOpenMatcher}
                  className="relative px-3.5 py-2 rounded-xl text-xs font-bold backdrop-blur-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-300/70 hover:border-amber-400 text-amber-950 shadow-[0_2px_10px_rgba(212,160,23,0.1)] hover:shadow-[0_8px_20px_rgba(212,160,23,0.2)] transition-all duration-200 ease-out flex items-center gap-1.5 hover:scale-105 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                  title="AI Smart Property Matcher"
                >
                  <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none rounded-t-xl" />
                  <div className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center text-[#D4A017] group-hover:scale-110 transition-transform">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  </div>
                  <span>Smart Match</span>
                </button>

                {/* Smart Match Hover Popup */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 pt-1 pointer-events-none z-50 transition-all duration-200 ease-out opacity-0 invisible -translate-y-1 scale-95 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100">
                  <div className="relative w-64 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-[0_16px_36px_rgba(0,0,0,0.15)] text-left">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-white border-l border-t border-neutral-200/70" />
                    <div className="relative z-10 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4A017] shrink-0" />
                        <span className="text-xs font-bold text-neutral-900 leading-tight">
                          AI Smart Property Matcher
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-snug">
                        Answer 3 quick preferences and let our AI curate the best matching verified homes instantly.
                      </p>
                      <div className="pt-1.5 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-[#D4A017] tracking-tight">
                          30-Sec Quiz • Instant AI Match
                        </span>
                        <span className="text-neutral-400 flex items-center gap-0.5">
                          Start <ChevronRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compare Button in Transparent Glass with '2' badge */}
              <div className="relative group">
                <Link
                  href="/compare"
                  className="relative px-3.5 py-2 rounded-xl text-xs font-bold backdrop-blur-md bg-neutral-900/10 hover:bg-neutral-900/20 border border-neutral-300/80 hover:border-neutral-400 text-neutral-900 shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-200 ease-out flex items-center gap-1.5 hover:scale-105 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                  title="Property Comparison"
                >
                  <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none rounded-t-xl" />
                  <Scale className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition-transform" />
                  <span>Compare</span>
                  <span className="min-w-4.5 h-4.5 px-1 rounded-full bg-[#D4A017] text-neutral-950 font-black text-[10px] flex items-center justify-center shadow-xs">
                    {compareCount}
                  </span>
                </Link>

                {/* Compare Hover Popup */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 pt-1 pointer-events-none z-50 transition-all duration-200 ease-out opacity-0 invisible -translate-y-1 scale-95 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100">
                  <div className="relative w-64 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-[0_16px_36px_rgba(0,0,0,0.15)] text-left">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-white border-l border-t border-neutral-200/70" />
                    <div className="relative z-10 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-[#D4A017] shrink-0" />
                        <span className="text-xs font-bold text-neutral-900 leading-tight">
                          Property Comparison Tool
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-snug">
                        Compare prices, carpet area, developer reputation & RERA approvals side by side.
                      </p>
                      <div className="pt-1.5 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-[#D4A017] tracking-tight">
                          {compareCount} Properties in Compare List
                        </span>
                        <span className="text-neutral-400 flex items-center gap-0.5">
                          View <ChevronRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/919326303244"
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-3.5 py-2 rounded-xl text-xs font-bold backdrop-blur-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-300/80 hover:border-emerald-400 text-emerald-950 shadow-[0_2px_10px_rgba(16,185,129,0.1)] hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)] transition-all duration-200 ease-out flex items-center gap-1.5 hover:scale-105 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                title="WhatsApp"
              >
                <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none rounded-t-xl" />
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 transition-transform" />
                <span>WhatsApp</span>
              </a>

              {/* Desktop Hamburger Menu Trigger in Transparent Glass */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-bold backdrop-blur-md transition-all duration-200 ease-out flex items-center gap-1.5 hover:scale-105 hover:-translate-y-0.5 active:scale-95 cursor-pointer ${
                    mobileMenuOpen
                      ? 'bg-neutral-950 text-white border border-neutral-900 ring-2 ring-[#D4A017]/30 shadow-md'
                      : 'bg-white/50 hover:bg-white/80 border border-white/70 hover:border-neutral-300 text-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]'
                  }`}
                  aria-label={mobileMenuOpen ? "Close Menu" : "Open Hamburger Menu"}
                  title="Hamburger Menu"
                >
                  <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none rounded-t-xl" />
                  {mobileMenuOpen ? (
                    <X className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Menu className="w-3.5 h-3.5 text-neutral-700 group-hover:text-[#D4A017] transition-colors" />
                  )}
                  <span>{mobileMenuOpen ? 'Close' : 'All Services'}</span>
                </button>

                {/* Hamburger Menu Trigger Hover Popup */}
                {!mobileMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 pt-1 pointer-events-none z-50 transition-all duration-200 ease-out opacity-0 invisible -translate-y-1 scale-95 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100">
                    <div className="relative w-64 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-[0_16px_36px_rgba(0,0,0,0.15)] text-left">
                      <div className="absolute -top-1 right-6 w-2.5 h-2.5 rotate-45 bg-white border-l border-t border-neutral-200/70" />
                      <div className="relative z-10 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <Menu className="w-3.5 h-3.5 text-[#D4A017] shrink-0" />
                          <span className="text-xs font-bold text-neutral-900 leading-tight">
                            Platform Services & Tools
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-600 leading-snug">
                          Explore painting, packers & movers, home loans, legal checks, careers & contact options.
                        </p>
                        <div className="pt-1.5 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-[#D4A017] tracking-tight">
                            Simplified Menu • 1-Click Access
                          </span>
                          <span className="text-neutral-400 flex items-center gap-0.5">
                            Open <ChevronRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile / Android Top Bar Actions */}
            <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
              {/* Quick WhatsApp for Mobile */}
              <a
                href="https://wa.me/919167991679"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1 text-xs font-bold active:scale-95 transition-all"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] hidden xs:inline">WhatsApp</span>
              </a>

              {/* Quick Smart Match for Mobile */}
              <button
                type="button"
                onClick={handleOpenMatcher}
                className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center gap-1 text-xs font-bold active:scale-95 transition-all"
                aria-label="Smart Match"
              >
                <Sparkles className="w-4 h-4 text-[#D4A017]" />
                <span className="text-[11px] hidden xs:inline">Match</span>
              </button>

              {/* Quick Compare for Mobile */}
              <Link
                href="/compare"
                className="relative p-2 rounded-xl bg-neutral-900 text-white flex items-center justify-center active:scale-95 transition-all shadow-xs"
                aria-label="Compare Properties"
              >
                <Scale className="w-4 h-4 text-amber-400" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#D4A017] text-neutral-950 font-black text-[10px] flex items-center justify-center border-2 border-white shadow-xs">
                  {compareCount}
                </span>
              </Link>

              {/* Mobile Drawer Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
                  mobileMenuOpen
                    ? 'bg-neutral-950 text-white border-neutral-900 ring-2 ring-[#D4A017]/30'
                    : 'border-neutral-200 text-neutral-800 hover:bg-neutral-100'
                }`}
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Front Overlay Burger Menu with all platform options & services */}
      <MobileBurgerMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenMatcher={handleOpenMatcher}
      />

      {/* Tell Us Your Property Requirement Modal */}
      <PropertyRequirementModal
        isOpen={requirementModalOpen}
        onClose={() => setRequirementModalOpen(false)}
      />

      {/* ============================================================== */}
      {/* MOBILE BOTTOM NAVIGATION DOCK                                */}
      {/* Buttons: Home, Buy, New Launches, Projects                   */}
      {/* ============================================================== */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-3 inset-x-3 sm:inset-x-8 z-40 max-w-md mx-auto"
      >
        <div className="relative rounded-3xl bg-neutral-950/85 backdrop-blur-2xl border border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.65)] p-1.5 overflow-hidden">
          {/* Top gloss specular highlight line */}
          <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          {/* 3 Buttons Grid */}
          <div className="grid grid-cols-3 items-center gap-1 relative z-10">
            {/* 1. HOME BUTTON */}
            <Link
              href="/"
              className={`relative py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
                pathname === '/'
                  ? 'bg-gradient-to-b from-amber-400/25 to-amber-500/10 text-[#F4C430] border border-amber-400/35 shadow-[0_0_16px_rgba(244,196,48,0.25)]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="relative">
                <Home className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${pathname === '/' ? 'scale-110 text-[#F4C430]' : 'text-neutral-300'}`} />
                {pathname === '/' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F4C430] shadow-[0_0_6px_#F4C430]" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight ${pathname === '/' ? 'font-black text-[#F4C430]' : 'font-medium'}`}>
                Home
              </span>
            </Link>

            {/* 2. BUY BUTTON */}
            <Link
              href="/properties?type=BUY"
              className={`relative py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
                pathname === '/properties' && (!currentType || currentType === 'BUY')
                  ? 'bg-gradient-to-b from-amber-400/25 to-amber-500/10 text-[#F4C430] border border-amber-400/35 shadow-[0_0_16px_rgba(244,196,48,0.25)]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="relative">
                <KeyRound className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${pathname === '/properties' && (!currentType || currentType === 'BUY') ? 'scale-110 text-[#F4C430]' : 'text-neutral-300'}`} />
                {pathname === '/properties' && (!currentType || currentType === 'BUY') && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F4C430] shadow-[0_0_6px_#F4C430]" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight ${pathname === '/properties' && (!currentType || currentType === 'BUY') ? 'font-black text-[#F4C430]' : 'font-medium'}`}>
                Buy
              </span>
            </Link>

            {/* 3. PROJECTS BUTTON */}
            <Link
              href="/projects"
              className={`relative py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
                pathname.startsWith('/projects')
                  ? 'bg-gradient-to-b from-amber-400/25 to-amber-500/10 text-[#F4C430] border border-amber-400/35 shadow-[0_0_16px_rgba(244,196,48,0.25)]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="relative">
                <Layers className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${pathname.startsWith('/projects') ? 'scale-110 text-[#F4C430]' : 'text-neutral-300'}`} />
                {pathname.startsWith('/projects') && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F4C430] shadow-[0_0_6px_#F4C430]" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight ${pathname.startsWith('/projects') ? 'font-black text-[#F4C430]' : 'font-medium'}`}>
                Projects
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Internal Smart Matcher Modal if triggered without parent wrapper */}
      <SmartMatcherModal
        isOpen={internalMatcherOpen}
        onClose={() => setInternalMatcherOpen(false)}
      />
    </>
  );
}
