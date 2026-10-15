'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
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
            <div className="pt-2 flex items-center gap-3 text-xs text-neutral-400">
              <span className="flex items-center gap-1 text-[#F4C430]">
                <ShieldCheck className="w-4 h-4" /> {brandConfig.reraRegistration}
              </span>
              <span>•</span>
              <span>Direct Developer Pricing</span>
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
                  <span>★ Affiliate & Partner Program (Up to 3%)</span>
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
              <li className="pt-1">
                <span className="text-xs text-neutral-400 block font-medium">
                  Support: {brandSettings.supportEmail || brandSettings.contactEmail || 'hello4home@gmail.com'}
                </span>
                <span className="text-xs text-neutral-400 block font-medium">
                  Helpline: {brandSettings.phone || brandSettings.whatsappNumber || '+91 91679 91679'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-xs text-neutral-500 space-y-3">
          <p className="leading-relaxed">
            <strong>RERA Compliance Disclaimer:</strong> {brandConfig.name} operates as a verified digital real-estate platform and marketing distribution network registered under {brandConfig.reraRegistration}. All project specifications, carpet areas, plans, and possession dates are aligned directly with certified developer filings. Property prices are subject to developer revision without prior notice.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p>© {new Date().getFullYear()} {brandConfig.name}. All rights reserved.</p>
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
