'use client';

import React from 'react';
import Link from 'next/link';
import { X, MessageCircle, Mail } from 'lucide-react';
import { brandConfig } from '@/src/config/brand';
import { useBrandSettings } from '@/lib/data/useBrandSettings';

interface RightMenuDrawerProps {
  onClose: () => void;
  onOpenPostProperty: () => void;
  onOpenRequirement?: () => void;
  onOpenMatcher?: () => void;
  onOpenServices: (serviceType?: 'interiors' | 'movers' | 'loan' | 'legal') => void;
  onOpenSoftwareServices?: () => void;
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
  onOpenSoftwareServices,
  onOpenReferEarn,
  onOpenCareers,
  onOpenCorporateEnquiry,
  onOpenBlog,
  onOpenSupport,
  onOpenContact,
  onCopyEmail,
}: RightMenuDrawerProps) {
  const brandSettings = useBrandSettings();

  // Helper to ensure 1-click execution: run target action immediately, then close menu drawer
  const handleDirectAction = (action?: () => void) => {
    if (action) {
      action();
    }
    onClose();
  };

  // Simple, clean, un-colorful item style
  const itemStyle =
    'flex items-center justify-between w-full py-2.5 px-5 text-[13px] text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50/90 transition-colors text-left cursor-pointer border-b border-neutral-100 last:border-b-0';

  const sectionHeaderStyle =
    'px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 bg-neutral-50/80 border-b border-neutral-100 sticky top-0 z-10';

  // Plain subtitle/tag style: subtle muted gray text, strictly no colorful badges
  const simpleTagStyle = 'text-[11px] text-neutral-400 font-normal';

  return (
    <>
      {/* Dimmed Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-xs cursor-pointer animate-in fade-in duration-200"
        aria-label="Close menu backdrop"
      />

      {/* Right-Hand Vertical Menu Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Site Navigation Menu"
        className="fixed top-0 right-0 z-[9999] w-72 sm:w-[320px] h-full bg-white flex flex-col shadow-xl border-l border-neutral-200 overflow-y-auto animate-in slide-in-from-right duration-200 select-none"
      >
        {/* Top Header - Simple & Clean */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 bg-white shrink-0">
          <div>
            <span className="text-xs font-semibold text-neutral-800 tracking-wide">
              Services & Menu
            </span>
            <span className="block text-[10px] text-neutral-400">All Platform Features</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Items: Simple, Clean, Non-Colorful List */}
        <nav aria-label="Menu Links" className="flex flex-col">
          {/* SECTION 1: PROPERTIES & EXPLORE */}
          <div className={sectionHeaderStyle}>Properties & Explore</div>

          {/* 1. Buy Homes */}
          <Link
            href="/properties?type=BUY"
            onClick={onClose}
            className={itemStyle}
          >
            <span>Buy Homes</span>
            <span className={simpleTagStyle}>0% Brokerage</span>
          </Link>

          {/* 2. New Launches */}
          <Link
            href="/properties?possession=NEW_LAUNCH"
            onClick={onClose}
            className={itemStyle}
          >
            <span>New Launches</span>
            <span className={simpleTagStyle}>Pre-Launch</span>
          </Link>

          {/* 3. Verified Projects */}
          <Link
            href="/projects"
            onClick={onClose}
            className={itemStyle}
          >
            <span>Verified Projects</span>
            <span className={simpleTagStyle}>RERA Approved</span>
          </Link>

          {/* 4. Commercial Properties */}
          <Link
            href="/properties?type=COMMERCIAL"
            onClick={onClose}
            className={itemStyle}
          >
            <span>Commercial Properties</span>
            <span className={simpleTagStyle}>Office & Retail</span>
          </Link>

          {/* 5. Micro-Markets */}
          <Link
            href="/micro-markets"
            onClick={onClose}
            className={itemStyle}
          >
            <span>Micro-Markets</span>
            <span className={simpleTagStyle}>Maharashtra Metros</span>
          </Link>

          {/* 6. AI Smart Match */}
          {onOpenMatcher && (
            <button
              type="button"
              onClick={() => handleDirectAction(onOpenMatcher)}
              className={itemStyle}
            >
              <span>Smart Match</span>
              <span className={simpleTagStyle}>Instant AI</span>
            </button>
          )}

          {/* 7. Luxury Villas & Estates */}
          <Link
            href="/properties?type=BUY"
            onClick={onClose}
            className={itemStyle}
          >
            <span>Luxury Villas & Estates</span>
            <span className={simpleTagStyle}>Exclusive</span>
          </Link>

          {/* 8. Developers */}
          <Link
            href="/developers"
            onClick={onClose}
            className={itemStyle}
          >
            <span>Developers</span>
            <span className={simpleTagStyle}>Top Builders</span>
          </Link>

          {/* 9. Property Comparison */}
          <Link
            href="/compare"
            onClick={onClose}
            className={itemStyle}
          >
            <span>Compare Properties</span>
            <span className={simpleTagStyle}>Side by Side</span>
          </Link>

          {/* 10. Affiliate Program */}
          <Link
            href="/affiliate?tab=dashboard"
            onClick={onClose}
            className={itemStyle}
          >
            <span>Affiliate Partner Program</span>
            <span className={simpleTagStyle}>Earn 3%</span>
          </Link>

          {/* SECTION 2: ADVISORY & LISTING */}
          <div className={sectionHeaderStyle}>Advisory & Listing</div>

          {/* Post Your Property */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenPostProperty)}
            className={itemStyle}
          >
            <span>Post Your Property</span>
            <span className={simpleTagStyle}>Free Listing</span>
          </button>

          {/* Submit Requirement */}
          {onOpenRequirement && (
            <button
              type="button"
              onClick={() => handleDirectAction(onOpenRequirement)}
              className={itemStyle}
            >
              <span>Submit Property Requirement</span>
              <span className={simpleTagStyle}>Buyer Desk</span>
            </button>
          )}

          {/* Software Development Services */}
          {onOpenSoftwareServices && (
            <button
              type="button"
              onClick={() => handleDirectAction(onOpenSoftwareServices)}
              className={itemStyle}
            >
              <div className="flex items-center gap-2">
                <span>Software Development Services</span>
              </div>
              <span className={simpleTagStyle}>PropTech & Apps</span>
            </button>
          )}

          {/* SECTION 3: HOME SERVICES */}
          <div className={sectionHeaderStyle}>Home Services</div>

          {/* Painting & Cleaning */}
          <button
            type="button"
            onClick={() => handleDirectAction(() => onOpenServices('interiors'))}
            className={itemStyle}
          >
            <span>Painting & Cleaning</span>
            <span className={simpleTagStyle}>Interiors</span>
          </button>

          {/* Packers and Movers */}
          <button
            type="button"
            onClick={() => handleDirectAction(() => onOpenServices('movers'))}
            className={itemStyle}
          >
            <span>Packers & Movers</span>
            <span className={simpleTagStyle}>Logistics</span>
          </button>

          {/* Home Loan Assistance */}
          <button
            type="button"
            onClick={() => handleDirectAction(() => onOpenServices('loan'))}
            className={itemStyle}
          >
            <span>Home Loan Assistance</span>
            <span className={simpleTagStyle}>From 8.35%</span>
          </button>

          {/* Legal & RERA Check */}
          <button
            type="button"
            onClick={() => handleDirectAction(() => onOpenServices('legal'))}
            className={itemStyle}
          >
            <span>Legal & Title Verification</span>
            <span className={simpleTagStyle}>RERA Audit</span>
          </button>

          {/* Refer & Earn */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenReferEarn)}
            className={itemStyle}
          >
            <span>Refer & Earn</span>
            <span className={simpleTagStyle}>₹1,000 Credit</span>
          </button>

          {/* SECTION 4: COMPANY & SUPPORT */}
          <div className={sectionHeaderStyle}>Company & Support</div>

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
            <span>Careers</span>
          </button>

          {/* Blog */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenBlog)}
            className={itemStyle}
          >
            <span>Blog & Insights</span>
          </button>

          {/* Support */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenSupport)}
            className={itemStyle}
          >
            <span>Customer Support</span>
          </button>

          {/* Contact */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenContact)}
            className={itemStyle}
          >
            <span>Contact Us</span>
          </button>
        </nav>

        {/* Bottom Fast Action Footer - Simple & Elegant */}
        <div className="mt-auto p-4 border-t border-neutral-100 bg-neutral-50/80 flex flex-col gap-2 shrink-0">
          <div className="text-[10px] text-neutral-500 flex items-center justify-between pb-1 border-b border-neutral-200/60">
            <span className="font-semibold text-neutral-700">{brandConfig.companyLegalName}</span>
            <span className="text-emerald-700 font-bold">RERA: {brandConfig.reraNumber}</span>
          </div>
          <a
            href="https://wa.me/919167991679"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-2 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => {
              onCopyEmail();
              onClose();
            }}
            className="w-full py-1.5 px-3 text-[11px] text-neutral-500 hover:text-neutral-800 transition-colors text-center font-normal flex items-center justify-center gap-1.5"
          >
            <Mail className="w-3 h-3 text-neutral-400" />
            <span>{brandSettings.supportEmail || brandSettings.contactEmail || 'hello4home@gmail.com'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
