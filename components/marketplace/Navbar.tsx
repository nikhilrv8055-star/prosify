'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Building2,
  Menu,
  X,
  Scale,
  Sparkles,
  Home,
  KeyRound,
  Rocket,
  HardHat,
  Briefcase,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { PortalSwitcher } from './PortalSwitcher';
import { useAuth } from '@/lib/auth/authContext';
import { ProsifyLogo } from '@/components/brand/ProsifyLogo';
import { SmartMatcherModal } from '@/components/marketplace/SmartMatcherModal';
import { MobileBurgerMenu } from './MobileBurgerMenu';

interface NavbarProps {
  onOpenEnquiry?: () => void;
  onOpenMatcher?: () => void;
}

function PartnerTrackerBanner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const partnerQuery = searchParams.get('partner');
  const partnerAttribution = partnerQuery ? partnerQuery.toUpperCase() : null;

  useEffect(() => {
    if (partnerQuery) {
      fetch('/api/tracking/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerCode: partnerQuery,
          targetPath: pathname,
          eventType: 'LANDING_PAGE_VIEW',
          utmSource: searchParams.get('utm_source'),
          utmMedium: searchParams.get('utm_medium'),
          utmCampaign: searchParams.get('utm_campaign'),
        }),
      }).catch(() => {});
    }
  }, [partnerQuery, searchParams, pathname]);

  if (!partnerAttribution) return null;

  return (
    <div className="bg-[#D4A017] text-neutral-950 px-4 py-1.5 text-xs font-medium text-center flex items-center justify-center gap-2">
      <span>
        Verified Channel Partner Referral Active: <strong>{partnerAttribution}</strong>
      </span>
      <span className="text-[11px] opacity-80 hidden sm:inline">
        • Exclusive booking benefits and direct developer pricing applied
      </span>
    </div>
  );
}

export function Navbar({ onOpenMatcher }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalMatcherOpen, setInternalMatcherOpen] = useState(false);
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

  // Primary navigation links for Desktop
  const navLinks = [
    { label: 'Buy', href: '/properties?type=BUY', icon: Home, highlight: false },
    { label: 'Rent', href: '/properties?type=RENT', icon: KeyRound, highlight: false },
    { label: 'Projects', href: '/projects', icon: Building2, highlight: false },
    { label: 'New Launches', href: '/properties?possession=NEW_LAUNCH', icon: Rocket, highlight: true, badge: 'HOT' },
    { label: 'Developers', href: '/developers', icon: HardHat, highlight: false },
    { label: 'Commercial', href: '/properties?type=COMMERCIAL', icon: Briefcase, highlight: false },
    { label: 'Locations', href: '/properties?view=locations', icon: MapPin, highlight: false },
  ];

  return (
    <>
      <PortalSwitcher currentPortal="public" />

      <React.Suspense fallback={null}>
        <PartnerTrackerBanner />
      </React.Suspense>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 lg:h-20">
            {/* Brand Logo */}
            <div className="flex items-center shrink-0">
              <ProsifyLogo variant="dark" size="md" href="/" showTagline={false} />
            </div>

            {/* Desktop Navigation Links (Clean, Centered & Professional) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href.includes('?') && pathname === link.href.split('?')[0]);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative px-3 py-2 rounded-xl text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'text-neutral-950 bg-amber-500/10 font-bold border border-amber-500/20'
                        : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/80'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-extrabold tracking-wide uppercase shadow-xs">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right Actions: Smart Match & Compare (NO Profile, NO Post Property) */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Smart Match Button */}
              <button
                type="button"
                onClick={handleOpenMatcher}
                className="group px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 text-amber-900 border border-amber-300 hover:border-amber-400 hover:shadow-xs active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                title="AI Smart Property Matcher"
              >
                <div className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center text-[#D4A017] group-hover:scale-110 transition-transform">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <span>Smart Match</span>
              </button>

              {/* Compare Button */}
              <Link
                href="/compare"
                className="group relative px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
                title="Property Comparison"
              >
                <Scale className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Compare</span>
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#D4A017] text-neutral-950 font-extrabold text-[11px] flex items-center justify-center shadow-xs">
                  {compareCount}
                </span>
              </Link>

              {/* Desktop Hamburger Menu Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`group px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-2xs ${
                  mobileMenuOpen
                    ? 'bg-neutral-950 text-white border-neutral-900 ring-2 ring-[#D4A017]/30'
                    : 'bg-white hover:bg-neutral-100 hover:border-neutral-300 text-neutral-800 border-neutral-200'
                }`}
                aria-label={mobileMenuOpen ? "Close Menu" : "Open Hamburger Menu"}
                title="Hamburger Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4 text-amber-400" />
                ) : (
                  <Menu className="w-4 h-4 text-neutral-700 group-hover:text-[#D4A017] transition-colors" />
                )}
                <span>{mobileMenuOpen ? 'Close Menu' : 'Menu'}</span>
              </button>
            </div>

            {/* Mobile / Android Top Bar Actions */}
            <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
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

      {/* Full-Screen Front Overlay Burger Menu with all 16 requested options */}
      <MobileBurgerMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* ============================================================== */}
      {/* MOBILE BOTTOM NAVIGATION DOCK (Original Core Options)         */}
      {/* Buttons: Home, Buy, Rent, Projects                             */}
      {/* ============================================================== */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-3 inset-x-3 sm:inset-x-8 z-40 max-w-md mx-auto"
      >
        <div className="relative rounded-3xl bg-neutral-950/85 backdrop-blur-2xl border border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.65)] p-1.5 overflow-hidden">
          {/* Top gloss specular highlight line */}
          <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          {/* 4 Buttons Grid */}
          <div className="grid grid-cols-4 items-center gap-1 relative z-10">
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
                <Building2 className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${pathname === '/properties' && (!currentType || currentType === 'BUY') ? 'scale-110 text-[#F4C430]' : 'text-neutral-300'}`} />
                {pathname === '/properties' && (!currentType || currentType === 'BUY') && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F4C430] shadow-[0_0_6px_#F4C430]" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight ${pathname === '/properties' && (!currentType || currentType === 'BUY') ? 'font-black text-[#F4C430]' : 'font-medium'}`}>
                Buy
              </span>
            </Link>

            {/* 3. RENT BUTTON */}
            <Link
              href="/properties?type=RENT"
              className={`relative py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
                pathname === '/properties' && currentType === 'RENT'
                  ? 'bg-gradient-to-b from-amber-400/25 to-amber-500/10 text-[#F4C430] border border-amber-400/35 shadow-[0_0_16px_rgba(244,196,48,0.25)]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="relative">
                <KeyRound className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${pathname === '/properties' && currentType === 'RENT' ? 'scale-110 text-[#F4C430]' : 'text-neutral-300'}`} />
                {pathname === '/properties' && currentType === 'RENT' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#F4C430] shadow-[0_0_6px_#F4C430]" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight ${pathname === '/properties' && currentType === 'RENT' ? 'font-black text-[#F4C430]' : 'font-medium'}`}>
                Rent
              </span>
            </Link>

            {/* 4. PROJECTS BUTTON */}
            <Link
              href="/projects"
              className={`relative py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
                pathname.startsWith('/projects')
                  ? 'bg-gradient-to-b from-amber-400/25 to-amber-500/10 text-[#F4C430] border border-amber-400/35 shadow-[0_0_16px_rgba(244,196,48,0.25)]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="relative">
                <Rocket className={`w-5 h-5 mb-0.5 transition-transform duration-200 ${pathname.startsWith('/projects') ? 'scale-110 text-[#F4C430]' : 'text-neutral-300'}`} />
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
