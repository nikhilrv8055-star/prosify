'use client';

import React from 'react';
import Link from 'next/link';
import { X, MessageCircle } from 'lucide-react';
import { brandConfig } from '@/src/config/brand';

interface RightMenuDrawerProps {
  onClose: () => void;
  onOpenPostProperty: () => void;
  onOpenRequirement?: () => void;
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

  // Uniform plain-text menu item styling across all remaining options
  const itemStyle =
    'block w-full py-3 px-5 text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-colors text-left cursor-pointer border-b border-slate-100 last:border-b-0';

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
        className="fixed top-0 right-0 z-[9999] w-72 sm:w-[290px] h-full bg-white flex flex-col shadow-2xl border-l border-slate-200 overflow-y-auto animate-in slide-in-from-right duration-200 select-none"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Menu
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

        {/* Menu Items: Plain Text Only, Uniform Size, Color, Hover & Padding */}
        <nav aria-label="Menu Links" className="flex flex-col py-1">
          {/* 1. Buy Properties */}
          <Link
            href="/properties?type=BUY"
            onClick={onClose}
            className={itemStyle}
          >
            Buy Properties
          </Link>

          {/* 2. New Launches */}
          <Link
            href="/properties?possession=NEW_LAUNCH"
            onClick={onClose}
            className={itemStyle}
          >
            New Launches
          </Link>

          {/* 3. Projects & Townships */}
          <Link
            href="/projects"
            onClick={onClose}
            className={itemStyle}
          >
            Projects & Townships
          </Link>

          {/* 4. Micro-Markets */}
          <Link
            href="/micro-markets"
            onClick={onClose}
            className={itemStyle}
          >
            Micro-Markets
          </Link>

          {/* 5. Post Your Property */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenPostProperty)}
            className={itemStyle}
          >
            Post Your Property
          </button>

          {/* 6. Submit Property Requirement */}
          {onOpenRequirement && (
            <button
              type="button"
              onClick={() => handleDirectAction(onOpenRequirement)}
              className={itemStyle}
            >
              Submit Property Requirement
            </button>
          )}

          {/* 7. Painting & Cleaning */}
          <button
            type="button"
            onClick={() => handleDirectAction(() => onOpenServices('interiors'))}
            className={itemStyle}
          >
            Painting & Cleaning
          </button>

          {/* 8. Packers and Movers */}
          <button
            type="button"
            onClick={() => handleDirectAction(() => onOpenServices('movers'))}
            className={itemStyle}
          >
            Packers and Movers
          </button>

          {/* 9. Refer & Earn */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenReferEarn)}
            className={itemStyle}
          >
            Refer & Earn
          </button>

          {/* 10. Careers */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenCareers)}
            className={itemStyle}
          >
            Careers
          </button>

          {/* 11. Corporate Enquiry */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenCorporateEnquiry)}
            className={itemStyle}
          >
            Corporate Enquiry
          </button>

          {/* 12. Blog & Intelligence */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenBlog)}
            className={itemStyle}
          >
            Blog & Intelligence
          </button>

          {/* 13. Prosify Support */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenSupport)}
            className={itemStyle}
          >
            Prosify Support
          </button>

          {/* 14. Contact Us */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenContact)}
            className={itemStyle}
          >
            Contact Us
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
