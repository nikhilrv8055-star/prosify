'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { brandConfig } from '@/src/config/brand';
import { ProsifyLogo } from '@/components/brand/ProsifyLogo';
import { useBrandSettings } from '@/lib/data/useBrandSettings';

export function Footer() {
  const brandSettings = useBrandSettings();
  return (
    <footer className="bg-[#171717] text-neutral-300 border-t border-neutral-800">
      {/* Upper Footer: Core Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <ProsifyLogo variant="light" size="lg" showTagline={true} />
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              &ldquo;{brandConfig.tagline}&rdquo; Connecting home buyers, channel partners, and leading developers across Maharashtra with complete RERA transparency.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-1.5 text-[#F4C430] font-semibold bg-[#F4C430]/10 px-2.5 py-1 rounded-lg border border-[#F4C430]/20">
                <ShieldCheck className="w-3.5 h-3.5" /> {brandConfig.reraRegistration}
              </span>
              <span>•</span>
              <span className="text-neutral-300 font-semibold">{brandConfig.companyLegalName}</span>
            </div>
          </div>

          {/* Column 2: Properties & Projects */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Marketplace</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/post-requirement" className="text-[#F4C430] font-semibold hover:underline flex items-center gap-1 transition-colors">
                  <span>★ Post Requirement</span>
                </Link>
              </li>
              <li>
                <Link href="/properties?type=BUY" className="hover:text-[#D4A017] transition-colors">
                  Properties for Sale (Buy)
                </Link>
              </li>
              <li>
                <Link href="/developers" className="hover:text-[#D4A017] transition-colors">
                  Top Developers & Builders
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#D4A017] transition-colors">
                  Projects & Townships
                </Link>
              </li>
              <li>
                <Link href="/properties?possession=NEW_LAUNCH" className="hover:text-[#D4A017] transition-colors">
                  New Launches
                </Link>
              </li>
              <li>
                <Link href="/properties?type=COMMERCIAL" className="hover:text-[#D4A017] transition-colors">
                  Commercial Offices & Retail
                </Link>
              </li>
              <li>
                <Link href="/micro-markets" className="text-[#10B981] font-semibold hover:underline flex items-center gap-1 transition-colors">
                  <span>★ Local Micro-Market Consultants</span>
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[#D4A017] transition-colors">
                  Property Comparison Tool
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Locations */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Locations</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/properties?city=Mumbai" className="hover:text-[#D4A017] transition-colors">
                  Mumbai MMR
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Thane" className="hover:text-[#D4A017] transition-colors">
                  Thane & Ghodbunder
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Dombivli" className="hover:text-[#D4A017] transition-colors">
                  Dombivli & Palava City
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Kalyan" className="hover:text-[#D4A017] transition-colors">
                  Kalyan & Dombivli Corridor
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Pune" className="hover:text-[#D4A017] transition-colors">
                  Pune (Baner & Hinjawadi)
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Nagpur" className="hover:text-[#D4A017] transition-colors">
                  Nagpur Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Compliance */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Company & Trust</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/about" className="hover:text-[#D4A017] transition-colors">
                  About {brandConfig.name}
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="text-[#F4C430] font-semibold hover:underline flex items-center gap-1 transition-colors">
                  <span>★ Prosify Affiliate & Growth Partner Program</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D4A017] transition-colors">
                  Contact Advisory Desk
                </Link>
              </li>
              <li>
                <Link href="/developers" className="hover:text-[#D4A017] transition-colors">
                  Verified Builder Network
                </Link>
              </li>
              <li className="pt-2">
                <a
                  href={brandSettings.whatsappLink || "https://wa.me/919167991679"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Dedicated Legal & Compliance Section */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="bg-neutral-900/90 rounded-2xl p-5 sm:p-6 border border-neutral-800/80 shadow-inner backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#F4C430] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="text-sm sm:text-base font-bold text-white tracking-wide">
                      Legal &amp; Compliance
                    </h5>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      RERA Verified
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Official Regulatory Verification &amp; Licensing Details
                  </p>
                </div>
              </div>

              {/* RERA Registration & Company Details Tag */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="px-3.5 py-1.5 rounded-xl bg-neutral-800/90 border border-neutral-700/80 text-xs font-semibold text-neutral-200 flex items-center gap-2">
                  <span className="text-neutral-400 font-normal">Official Entity:</span>
                  <span className="text-white font-bold">{brandConfig.companyLegalName}</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-xs font-bold text-[#F4C430] flex items-center gap-1.5 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F4C430]" />
                  <span>{brandConfig.reraRegistration}</span>
                </div>
              </div>
            </div>

            {/* Standard Compliance Disclaimer */}
            <div className="pt-4 text-xs text-neutral-400 space-y-2 leading-relaxed">
              <p className="text-neutral-200 font-medium">
                &ldquo;{brandConfig.reraDisclaimer}&rdquo;
              </p>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                {brandConfig.name} operates under authorized legal entity <strong>{brandConfig.companyLegalName}</strong> ({brandConfig.officialCompanyName}) holding registration number <strong>{brandConfig.reraRegistration}</strong>. All project details, carpet areas, structural floor plans, brochure materials, and possession timelines published across this platform strictly adhere to Real Estate Regulatory Authority standards and direct developer filings.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-8 pt-6 border-t border-neutral-800/60 text-xs text-neutral-500 space-y-3">
          <p className="leading-relaxed">
            <strong>RERA Compliance Disclaimer:</strong> {brandConfig.name} operates as a verified digital real-estate platform and marketing distribution network registered under {brandConfig.reraRegistration} (Entity: {brandConfig.companyLegalName}). {brandConfig.reraDisclaimer} Property prices and unit availability are subject to developer revision without prior notice.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p suppressHydrationWarning>© {new Date().getFullYear()} {brandConfig.name} • {brandConfig.companyLegalName}. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <Link href="/about" className="hover:text-white">About {brandConfig.name}</Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-white">Contact</Link>
              <span>•</span>
              <Link href="/compare" className="hover:text-white">Compare Properties</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
