'use client';

import React from 'react';
import Link from 'next/link';
import { X, MessageCircle } from 'lucide-react';
import { brandConfig } from '@/src/config/brand';

interface RightMenuDrawerProps {
  onClose: () => void;
  onOpenPostProperty: () => void;
  onOpenRequirement?: () => void;
  onOpenMatcher?: () => void;
  onOpenServices: (serviceType?: 'interiors' | 'movers' | 'loan' | 'legal') => void;
  onOpenReferEarn: () => void;
  onOpenCareers: () => void;
  onOpenCorporateEnquiry: () => void;
  onOpenBlog: () => void;
  onOpenSupport: () => void;
  onOpenContact: () => void;
  onCopyEmail: () => void;
}

export function RightMenuDrawer({
  onClose,
  onOpenPostProperty,
  onOpenRequirement,
  onOpenMatcher,
  onOpenServices,
  onOpenReferEarn,
  onOpenCareers,
  onOpenCorporateEnquiry,
  onOpenBlog,
  onOpenSupport,
  onOpenContact,
  onCopyEmail,
}: RightMenuDrawerProps) {
  // Helper to ensure 1-click execution: run target action immediately, then close menu drawer
  const handleDirectAction = (action?: () => void) => {
    if (action) {
      action();
    }
    onClose();
  };

  // Uniform plain-text menu item styling across all options
  const itemStyle =
    'flex items-center justify-between w-full py-2.5 px-5 text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-amber-50/70 transition-colors text-left cursor-pointer border-b border-slate-100 last:border-b-0';

  const sectionHeaderStyle =
    'px-5 pt-3.5 pb-1.5 text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50/60 border-b border-amber-100/80 sticky top-0 z-10 backdrop-blur-xs';

  return (
    <>
      {/* Dimmed Backdrop covering background */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[0.5px] cursor-pointer animate-in fade-in duration-200"
        aria-label="Close menu backdrop"
      />

      {/* Right-Hand Vertical Dropdown Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Site Navigation Menu"
        className="fixed top-0 right-0 z-[9999] w-72 sm:w-[310px] h-full bg-white flex flex-col shadow-2xl border-l border-slate-200 overflow-y-auto animate-in slide-in-from-right duration-200 select-none"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/90 shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Platform Menu & Services
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Items: All Platform Options & Services */}
        <nav aria-label="Menu Links" className="flex flex-col">
          {/* SECTION 1: PLATFORM OPTIONS & SERVICES */}
          <div className={sectionHeaderStyle}>Platform Options & Services</div>

          {/* 1. Buy Verified Homes */}
          <Link
            href="/properties?type=BUY"
            onClick={onClose}
            className={itemStyle}
          >
            <span>Buy Verified Homes</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              0% Brokerage
            </span>
          </Link>

          {/* 2. New Launch Projects */}
          <Link
            href="/properties?possession=NEW_LAUNCH"
            onClick={onClose}
            className={itemStyle}
          >
            <span>New Launch Projects</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
              Hot Launch
            </span>
          </Link>

          {/* 3. Verified RERA Projects */}
          <Link
            href="/projects"
            onClick={onClose}
            className={itemStyle}
          >
            <span>Verified RERA Projects</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              RERA Clear
            </span>
          </Link>

          {/* 4. Commercial & Retail */}
          <Link
            href="/properties?type=COMMERCIAL"
            onClick={onClose}
            className={itemStyle}
          >
            <span>Commercial & Retail</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
              High Yield
            </span>
          </Link>

          {/* 5. Pan-India Metros */}
          <Link
            href="/micro-markets"
            onClick={onClose}
            className={itemStyle}
          >
            <span>Pan-India Metros</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
              9 Cities
            </span>
          </Link>

          {/* 6. AI Smart Property Match */}
          {onOpenMatcher && (
            <button
              type="button"
              onClick={() => handleDirectAction(onOpenMatcher)}
              className={itemStyle}
            >
              <span>AI Smart Property Match</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Instant AI
              </span>
            </button>
          )}

          {/* 7. Luxury Villas & Estates */}
          <Link
            href="/properties?type=BUY"
            onClick={onClose}
            className={itemStyle}
          >
            <span>Luxury Villas & Estates</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
              Elite
            </span>
          </Link>

          {/* 8. Top Tier Developers */}
          <Link
            href="/developers"
            onClick={onClose}
            className={itemStyle}
          >
            <span>Top Tier Developers</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-800">
              Builders
            </span>
          </Link>

          {/* 9. Property Comparison */}
          <Link
            href="/compare"
            onClick={onClose}
            className={itemStyle}
          >
            <span>Property Comparison Tool</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Compare
            </span>
          </Link>

          {/* 10. Affiliate Program */}
          <Link
            href="/affiliate?tab=dashboard"
            onClick={onClose}
            className={itemStyle}
          >
            <span>Affiliate Partner Program</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Earn 3%
            </span>
          </Link>

          {/* SECTION 2: ADVISORY & LISTING ACTIONS */}
          <div className={sectionHeaderStyle}>Advisory & Listing</div>

          {/* Post Your Property */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenPostProperty)}
            className={itemStyle}
          >
            <span>Post Your Property</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
              Free Listing
            </span>
          </button>

          {/* Submit Property Requirement */}
          {onOpenRequirement && (
            <button
              type="button"
              onClick={() => handleDirectAction(onOpenRequirement)}
              className={itemStyle}
            >
              <span>Submit Property Requirement</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-900 text-amber-300">
                Buyer Desk
              </span>
            </button>
          )}

          {/* SECTION 3: HOME & VALUE-ADDED SERVICES */}
          <div className={sectionHeaderStyle}>Home & Relocation Services</div>

          {/* Painting & Cleaning */}
          <button
            type="button"
            onClick={() => handleDirectAction(() => onOpenServices('interiors'))}
            className={itemStyle}
          >
            <span>Painting & Cleaning</span>
            <span className="text-[10px] text-slate-400">Interiors</span>
          </button>

          {/* Packers and Movers */}
          <button
            type="button"
            onClick={() => handleDirectAction(() => onOpenServices('movers'))}
            className={itemStyle}
          >
            <span>Packers and Movers</span>
            <span className="text-[10px] text-slate-400">Logistics</span>
          </button>

          {/* Refer & Earn */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenReferEarn)}
            className={itemStyle}
          >
            <span>Refer & Earn Rewards</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
              ₹1,000 Credit
            </span>
          </button>

          {/* SECTION 4: CORPORATE & SUPPORT */}
          <div className={sectionHeaderStyle}>Corporate & Help</div>

          {/* Corporate Enquiry */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenCorporateEnquiry)}
            className={itemStyle}
          >
            <span>Corporate Enquiry</span>
          </button>

          {/* Careers */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenCareers)}
            className={itemStyle}
          >
            <span>Careers & Jobs</span>
          </button>

          {/* Blog & Intelligence */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenBlog)}
            className={itemStyle}
          >
            <span>Blog & Market Intelligence</span>
          </button>

          {/* Prosify Support */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenSupport)}
            className={itemStyle}
          >
            <span>Prosify Support</span>
          </button>

          {/* Contact Us */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenContact)}
            className={itemStyle}
          >
            <span>Contact Us</span>
          </button>
        </nav>

        {/* Bottom Fast Action Footer with WhatsApp Direct */}
        <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50/90 flex flex-col gap-2 shrink-0">
          <a
            href="https://wa.me/919326303244"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => {
              onCopyEmail();
              onClose();
            }}
            className="w-full py-2 px-3 text-[11px] text-slate-500 hover:text-slate-800 transition-colors text-center"
          >
            {brandConfig.contact.supportEmail}
          </button>
        </div>
      </aside>
    </>
  );
}
