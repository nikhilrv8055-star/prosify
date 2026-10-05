'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  Building2,
  Home,
  FileCheck2,
  Briefcase,
  Users,
  BookOpen,
  PhoneCall,
  Crown,
  Paintbrush,
  Truck,
  Gift,
  ShieldCheck,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { brandConfig } from '@/src/config/brand';

interface RightMenuDrawerProps {
  onClose: () => void;
  onOpenPostProperty: () => void;
  onOpenRequirement?: () => void;
  onOpenServices: (serviceType?: 'interiors' | 'movers' | 'loan' | 'legal') => void;
  onOpenReferEarn: () => void;
  onOpenPlan: (type: 'owner' | 'buyer' | 'seller' | 'commercial') => void;
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
  onOpenPlan,
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
        className="fixed top-0 right-0 z-[9999] w-72 sm:w-[290px] h-full bg-white flex flex-col shadow-2xl border-l border-neutral-200 overflow-y-auto animate-in slide-in-from-right duration-200 select-none"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 bg-neutral-50/70 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-neutral-500">Navigation</span>
            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">1-Click Direct</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors cursor-pointer"
            aria-label="Close Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Items - every item triggers direct display on screen */}
        <div className="flex flex-col divide-y divide-neutral-100">
          {/* Core Marketplace Direct Page Routes */}
          <div className="bg-neutral-50/80 p-3 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 block">
              Marketplace Direct
            </span>
            <Link
              href="/properties?type=BUY"
              onClick={onClose}
              className="w-full text-left py-2 px-3 text-xs font-semibold text-neutral-800 hover:text-[#0EA5E9] hover:bg-neutral-100 rounded-lg transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Home className="w-3.5 h-3.5 text-[#0EA5E9]" />
                <span>Buy Properties</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">9 Metros</span>
            </Link>
            <Link
              href="/projects"
              onClick={onClose}
              className="w-full text-left py-2 px-3 text-xs font-semibold text-neutral-800 hover:text-[#0EA5E9] hover:bg-neutral-100 rounded-lg transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Projects & Townships</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600">RERA Verified</span>
            </Link>
            <Link
              href="/guides"
              onClick={onClose}
              className="w-full text-left py-2 px-3 text-xs font-bold text-[#0EA5E9] hover:text-[#0284c7] hover:bg-cyan-50/70 rounded-lg transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-[#0EA5E9]" />
                <span>Locality Guides & E-Books</span>
              </div>
              <span className="text-[9px] bg-[#0EA5E9] text-white px-1.5 py-0.5 rounded font-black">
                NEW
              </span>
            </Link>
            <Link
              href="/micro-markets"
              onClick={onClose}
              className="w-full text-left py-2 px-3 text-xs font-bold text-[#10B981] hover:text-[#0da674] hover:bg-emerald-50/70 rounded-lg transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Micro-Market Consultants</span>
              </div>
              <span className="text-[9px] bg-[#10B981] text-slate-950 px-1.5 py-0.5 rounded font-black">
                4.9★
              </span>
            </Link>
          </div>

          {/* 1. Post Your Property */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenPostProperty)}
            className="w-full text-left py-3 px-5 text-[13px] font-semibold text-neutral-800 hover:text-[#10B981] hover:bg-emerald-50/40 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Post Your Property</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Free Listing
            </span>
          </button>

          {/* 1b. Tell Us Your Property Requirement */}
          {onOpenRequirement && (
            <button
              type="button"
              onClick={() => handleDirectAction(onOpenRequirement)}
              className="w-full text-left py-3 px-5 text-[13px] font-bold text-amber-800 hover:text-amber-900 bg-amber-50/50 hover:bg-amber-100/60 transition-colors cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-[#D4A017] group-hover:scale-110 transition-transform" />
                <span>Submit Property Requirement</span>
              </div>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                Buy Only
              </span>
            </button>
          )}

          {/* 2. Painting & Cleaning */}
          <button
            type="button"
            onClick={() => handleDirectAction(() => onOpenServices('interiors'))}
            className="w-full text-left py-3 px-5 text-[13px] font-medium text-neutral-700 hover:text-rose-600 hover:bg-neutral-50/70 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Paintbrush className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
              <span>Painting & Cleaning</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-rose-600 transition-colors" />
          </button>

          {/* 3. Packers and Movers */}
          <button
            type="button"
            onClick={() => handleDirectAction(() => onOpenServices('movers'))}
            className="w-full text-left py-3 px-5 text-[13px] font-medium text-neutral-700 hover:text-sky-600 hover:bg-neutral-50/70 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
              <span>Packers and Movers</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-sky-600 transition-colors" />
          </button>

          {/* 4. Refer & Earn */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenReferEarn)}
            className="w-full text-left py-3 px-5 text-[13px] font-medium text-neutral-700 hover:text-amber-600 hover:bg-neutral-50/70 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Gift className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
              <span>Refer & Earn</span>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              ₹1,000 Cash
            </span>
          </button>

          {/* 5. Owner Plans */}
          <button
            type="button"
            onClick={() => handleDirectAction(() => onOpenPlan('owner'))}
            className="w-full text-left py-3 px-5 text-[13px] font-medium text-neutral-700 hover:text-[#D4A017] hover:bg-neutral-50/70 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Crown className="w-4 h-4 text-[#D4A017] group-hover:scale-110 transition-transform" />
              <span>Owner Plans</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D4A017] transition-colors" />
          </button>

          {/* 6. Buyer Plans */}
          <button
            type="button"
            onClick={() => handleDirectAction(() => onOpenPlan('buyer'))}
            className="w-full text-left py-3 px-5 text-[13px] font-medium text-neutral-700 hover:text-[#D4A017] hover:bg-neutral-50/70 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Crown className="w-4 h-4 text-[#D4A017] group-hover:scale-110 transition-transform" />
              <span>Buyer Plans</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D4A017] transition-colors" />
          </button>

          {/* 7. Seller Plans */}
          <button
            type="button"
            onClick={() => handleDirectAction(() => onOpenPlan('seller'))}
            className="w-full text-left py-3 px-5 text-[13px] font-medium text-neutral-700 hover:text-[#D4A017] hover:bg-neutral-50/70 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Crown className="w-4 h-4 text-[#D4A017] group-hover:scale-110 transition-transform" />
              <span>Seller Plans</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D4A017] transition-colors" />
          </button>

          {/* 8. Commercial Plans - DIRECT 1-CLICK DISPLAY */}
          <button
            type="button"
            onClick={() => handleDirectAction(() => onOpenPlan('commercial'))}
            className="w-full text-left py-3 px-5 text-[13px] font-medium text-neutral-700 hover:text-emerald-700 hover:bg-emerald-50/40 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Commercial Plans</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Acquisition
            </span>
          </button>

          {/* 9. Careers */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenCareers)}
            className="w-full text-left py-3 px-5 text-[13px] font-medium text-neutral-700 hover:text-emerald-600 hover:bg-neutral-50/70 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-neutral-500 group-hover:text-emerald-600 group-hover:scale-110 transition-all" />
              <span>Careers</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-600 transition-colors" />
          </button>

          {/* 10. Corporate Enquiry */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenCorporateEnquiry)}
            className="w-full text-left py-3 px-5 text-[13px] font-medium text-neutral-700 hover:text-[#D4A017] hover:bg-neutral-50/70 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-neutral-500 group-hover:text-[#D4A017] group-hover:scale-110 transition-all" />
              <span>Corporate Enquiry</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D4A017] transition-colors" />
          </button>

          {/* 11. Blog */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenBlog)}
            className="w-full text-left py-3 px-5 text-[13px] font-medium text-neutral-700 hover:text-violet-600 hover:bg-neutral-50/70 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-neutral-500 group-hover:text-violet-600 group-hover:scale-110 transition-all" />
              <span>Blog & Intelligence</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-violet-600 transition-colors" />
          </button>

          {/* 12. Support */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenSupport)}
            className="w-full text-left py-3 px-5 text-[13px] font-medium text-neutral-700 hover:text-[#D4A017] hover:bg-neutral-50/70 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-neutral-500 group-hover:text-[#D4A017] group-hover:scale-110 transition-all" />
              <span>Prosify Support</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#D4A017] transition-colors" />
          </button>

          {/* 13. Contact Us - DIRECT 1-CLICK DISPLAY */}
          <button
            type="button"
            onClick={() => handleDirectAction(onOpenContact)}
            className="w-full text-left py-3 px-5 text-[13px] font-medium text-neutral-700 hover:text-emerald-600 hover:bg-emerald-50/40 transition-colors cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Contact Us</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-600 transition-colors" />
          </button>
        </div>

        {/* Bottom Fast Action Footer with WhatsApp Direct */}
        <div className="mt-auto p-4 border-t border-neutral-100 bg-neutral-50/90 flex flex-col gap-2 shrink-0">
          {/* Direct WhatsApp Redirection Button (Text strictly "WhatsApp" as required) */}
          <a
            href="https://wa.me/919326303244"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
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
            className="w-full py-2 px-3 text-[11px] text-neutral-500 hover:text-neutral-800 transition-colors text-center"
          >
            {brandConfig.contact.supportEmail}
          </button>
        </div>
      </aside>
    </>
  );
}
