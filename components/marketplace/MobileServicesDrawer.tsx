'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  Search,
  Home,
  Key,
  Building2,
  Building,
  PlusCircle,
  Landmark,
  CalendarCheck,
  Calculator,
  Users,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface MobileServicesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEnquiry?: () => void;
  onOpenSiteVisit?: () => void;
  onOpenValuation?: () => void;
  onOpenLoanCalc?: () => void;
}

export function MobileServicesDrawer({
  isOpen,
  onClose,
  onOpenEnquiry,
  onOpenSiteVisit,
  onOpenValuation,
  onOpenLoanCalc,
}: MobileServicesDrawerProps) {
  if (!isOpen) return null;

  const services = [
    {
      id: 'search',
      title: 'Property Search',
      desc: 'Instant search across 100% verified Maharashtra properties',
      icon: Search,
      href: '/properties',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'buy',
      title: 'Buy Property',
      desc: 'Apartments, penthouses & luxury villas with zero brokerage',
      icon: Home,
      href: '/properties?type=BUY',
      color: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'rent',
      title: 'Rent Property',
      desc: 'Verified rental homes with digital lease documentation',
      icon: Key,
      href: '/properties?type=RENT',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'projects',
      title: 'New Projects',
      desc: 'Townships & Grade-A developer launches with RERA certificates',
      icon: Building2,
      href: '/projects',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      id: 'commercial',
      title: 'Commercial Property',
      desc: 'Grade-A office suites, retail shops & warehousing',
      icon: Building,
      href: '/properties?type=COMMERCIAL',
      color: 'bg-slate-100 text-slate-800',
    },
    {
      id: 'post',
      title: 'Post Property',
      desc: 'List your property for sale or rent to 50k+ verified buyers',
      icon: PlusCircle,
      action: () => {
        onClose();
        if (onOpenEnquiry) onOpenEnquiry();
      },
      badge: 'Free',
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'loan',
      title: 'Home Loan Assistance',
      desc: 'Compare loan interest rates starting 8.35% from SBI & HDFC',
      icon: Landmark,
      action: () => {
        onClose();
        if (onOpenLoanCalc) onOpenLoanCalc();
      },
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 'visit',
      title: 'Schedule Site Visit',
      desc: 'Free private cab pickup & accompanied project inspection',
      icon: CalendarCheck,
      action: () => {
        onClose();
        if (onOpenSiteVisit) onOpenSiteVisit();
      },
      color: 'bg-amber-50 text-amber-600',
    },
    {
      id: 'valuation',
      title: 'Property Valuation',
      desc: 'Accurate MahaRERA index-backed price estimator',
      icon: Calculator,
      action: () => {
        onClose();
        if (onOpenValuation) onOpenValuation();
      },
      badge: 'Instant',
      color: 'bg-rose-50 text-rose-600',
    },
    {
      id: 'partner',
      title: 'Channel Partner Network',
      desc: 'Unified referral dashboard with 30-day attribution tracking',
      icon: Users,
      href: '/partner',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'developer',
      title: 'Developer Services',
      desc: 'Digital inventory console, unit matrices & buyer analytics',
      icon: Briefcase,
      href: '/developer',
      color: 'bg-neutral-100 text-neutral-800',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-[#171717] text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#D4A017]/20 border border-[#D4A017]/40 flex items-center justify-center text-[#D4A017]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Explore Prosify Services</h3>
              <p className="text-[11px] text-neutral-400">Complete Indian Real Estate Ecosystem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Services List */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-neutral-100">
          {services.map((srv) => {
            const IconComponent = srv.icon;
            const content = (
              <div className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors w-full text-left">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${srv.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-neutral-900 truncate">{srv.title}</h4>
                    {srv.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#D4A017] text-neutral-950">
                        {srv.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">{srv.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
              </div>
            );

            if (srv.href) {
              return (
                <Link key={srv.id} href={srv.href} onClick={onClose} className="block">
                  {content}
                </Link>
              );
            }

            return (
              <button key={srv.id} onClick={srv.action} className="w-full block">
                {content}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D4A017]" />
            <span>100% MahaRERA Verified Platform</span>
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 font-bold text-neutral-900 hover:text-[#D4A017]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
