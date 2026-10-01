'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, LayoutGrid, Heart, User } from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';
import { MobileServicesDrawer } from './MobileServicesDrawer';
import { MobileSavedDrawer } from './MobileSavedDrawer';
import { SiteVisitModal } from './SiteVisitModal';
import { EnquiryModal } from './EnquiryModal';
import { MobileValuationModal } from './MobileValuationModal';
import { EMICalculator } from './EMICalculator';

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, openAuthModal, savedPropertyIds } = useAuth();

  const [servicesOpen, setServicesOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [valuationOpen, setValuationOpen] = useState(false);
  const [loanCalcOpen, setLoanCalcOpen] = useState(false);

  // Hide bottom nav on all 4 portals (admin, vendor, agent, customer)
  const isPortal =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/vendor') ||
    pathname.startsWith('/agent') ||
    pathname.startsWith('/customer');

  if (isPortal) {
    return null;
  }

  const isHome = pathname === '/';
  const isSearch = pathname.startsWith('/properties') || pathname.startsWith('/projects');
  const savedCount = savedPropertyIds.length;

  const handleSearchClick = () => {
    if (pathname === '/properties') {
      // Scroll to top on properties page to access search input
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/properties');
    }
  };

  const handleProfileClick = () => {
    openAuthModal();
  };

  return (
    <>
      {/* Modals triggered from Mobile Drawers */}
      <MobileServicesDrawer
        isOpen={servicesOpen}
        onClose={() => setServicesOpen(false)}
        onOpenEnquiry={() => setEnquiryOpen(true)}
        onOpenSiteVisit={() => setVisitOpen(true)}
        onOpenValuation={() => setValuationOpen(true)}
        onOpenLoanCalc={() => setLoanCalcOpen(true)}
      />

      <MobileSavedDrawer
        isOpen={savedOpen}
        onClose={() => setSavedOpen(false)}
      />

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
      />

      <SiteVisitModal
        isOpen={visitOpen}
        onClose={() => setVisitOpen(false)}
      />

      <MobileValuationModal
        isOpen={valuationOpen}
        onClose={() => setValuationOpen(false)}
      />

      {loanCalcOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="font-bold text-sm text-neutral-900">Prosify Home Loan EMI Calculator</h3>
              <button
                onClick={() => setLoanCalcOpen(false)}
                className="text-xs font-bold text-neutral-500 hover:text-neutral-900"
              >
                Close
              </button>
            </div>
            <EMICalculator propertyPrice={12500000} />
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Navigation Bar: Visible ONLY on mobile/tablet (hidden on md and above) */}
      <nav
        id="prosify-mobile-bottom-nav"
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 block md:hidden bg-white/98 backdrop-blur-md border-t border-neutral-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe"
      >
        <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center px-1">
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center h-full min-h-[44px] touch-manipulation transition-all ${
              isHome && !servicesOpen && !savedOpen
                ? 'text-[#D4A017]'
                : 'text-neutral-600 hover:text-neutral-950 active:scale-95'
            }`}
            aria-label="Prosify Home"
          >
            <div className="relative">
              <Home className={`w-5 h-5 ${isHome && !servicesOpen && !savedOpen ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {isHome && !servicesOpen && !savedOpen && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D4A017]" />
              )}
            </div>
            <span className={`text-[10px] mt-1 font-medium tracking-tight ${isHome && !servicesOpen && !savedOpen ? 'font-bold text-neutral-950' : ''}`}>
              Home
            </span>
          </Link>

          {/* 2. Search */}
          <button
            type="button"
            onClick={handleSearchClick}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] touch-manipulation transition-all cursor-pointer ${
              isSearch && !servicesOpen && !savedOpen
                ? 'text-[#D4A017]'
                : 'text-neutral-600 hover:text-neutral-950 active:scale-95'
            }`}
            aria-label="Search Properties"
          >
            <div className="relative">
              <Search className={`w-5 h-5 ${isSearch && !servicesOpen && !savedOpen ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              {isSearch && !servicesOpen && !savedOpen && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D4A017]" />
              )}
            </div>
            <span className={`text-[10px] mt-1 font-medium tracking-tight ${isSearch && !servicesOpen && !savedOpen ? 'font-bold text-neutral-950' : ''}`}>
              Search
            </span>
          </button>

          {/* 3. Services */}
          <button
            type="button"
            onClick={() => setServicesOpen(true)}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] touch-manipulation transition-all cursor-pointer ${
              servicesOpen
                ? 'text-[#D4A017]'
                : 'text-neutral-600 hover:text-neutral-950 active:scale-95'
            }`}
            aria-label="Prosify Services"
          >
            <div className="relative">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                servicesOpen ? 'bg-[#D4A017] text-neutral-950 shadow-xs' : 'bg-neutral-100 text-neutral-700'
              }`}>
                <LayoutGrid className="w-4 h-4" />
              </div>
            </div>
            <span className={`text-[10px] mt-0.5 font-medium tracking-tight ${servicesOpen ? 'font-bold text-neutral-950' : ''}`}>
              Services
            </span>
          </button>

          {/* 4. Saved */}
          <button
            type="button"
            onClick={() => setSavedOpen(true)}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] touch-manipulation transition-all cursor-pointer relative ${
              savedOpen
                ? 'text-[#D4A017]'
                : 'text-neutral-600 hover:text-neutral-950 active:scale-95'
            }`}
            aria-label="Saved Properties"
          >
            <div className="relative">
              <Heart className={`w-5 h-5 ${savedOpen ? 'stroke-[2.5] fill-[#D4A017]' : 'stroke-[1.8]'}`} />
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1 min-w-[15px] h-[15px] rounded-full bg-[#D4A017] text-neutral-950 text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {savedCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-1 font-medium tracking-tight ${savedOpen ? 'font-bold text-neutral-950' : ''}`}>
              Saved
            </span>
          </button>

          {/* 5. Profile */}
          <button
            type="button"
            onClick={handleProfileClick}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] touch-manipulation transition-all cursor-pointer ${
              user
                ? 'text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-950 active:scale-95'
            }`}
            aria-label="Profile or Sign In"
          >
            <div className="relative">
              {user ? (
                <div className="w-5 h-5 rounded-full bg-neutral-950 text-[#D4A017] font-bold text-[10px] flex items-center justify-center ring-1 ring-[#D4A017]">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
              ) : (
                <User className="w-5 h-5 stroke-[1.8]" />
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium tracking-tight truncate max-w-[60px]">
              {user ? user.name.split(' ')[0] : 'Profile'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
