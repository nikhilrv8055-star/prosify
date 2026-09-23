import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, PhoneCall, Mail, MapPin, Sparkles } from 'lucide-react';
import { brandConfig } from '@/src/config/brand';

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-white border-t border-neutral-800 pb-16 sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
                <Building2 className="w-4 h-4 text-[#D4A017]" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                PROSIFY<span className="text-[#D4A017]">.</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              India’s premier direct-developer real estate marketplace. Exclusively focused on verified property purchase, investment-grade commercial assets, and RERA transparency across Maharashtra.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D4A017] font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>MahaRERA: {brandConfig.reraNumber}</span>
            </div>
          </div>

          {/* Quick Links (Buy Focus) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Buy Properties
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link href="/properties?city=Mumbai" className="hover:text-white transition-colors">
                  Properties for Sale in Mumbai
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Thane" className="hover:text-white transition-colors">
                  Flats for Sale in Thane
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Navi Mumbai" className="hover:text-white transition-colors">
                  Apartments in Navi Mumbai
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Pune" className="hover:text-white transition-colors">
                  Homes for Sale in Pune
                </Link>
              </li>
              <li>
                <Link href="/properties?type=COMMERCIAL" className="hover:text-white transition-colors">
                  Commercial Offices & Retail
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Developers & Projects */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Developers & Projects
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  New Launch Masterplanned Projects
                </Link>
              </li>
              <li>
                <Link href="/developers" className="hover:text-white transition-colors">
                  Lodha Group (Macrotech)
                </Link>
              </li>
              <li>
                <Link href="/developers" className="hover:text-white transition-colors">
                  Godrej Properties
                </Link>
              </li>
              <li>
                <Link href="/developers" className="hover:text-white transition-colors">
                  Oberoi Realty
                </Link>
              </li>
              <li>
                <Link href="/developers" className="hover:text-white transition-colors">
                  Hiranandani Communities
                </Link>
              </li>
            </ul>
          </div>

          {/* Corporate & Advisory Desk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Direct Advisory Desk
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                <span>Prosify Chambers, Lower Parel, Mumbai 400013</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#D4A017] shrink-0" />
                <a href="tel:+912269824000" className="hover:text-white">
                  +91 22 6982 4000
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4A017] shrink-0" />
                <a href="mailto:advisory@prosify.in" className="hover:text-white">
                  advisory@prosify.in
                </a>
              </div>
              <div className="pt-2">
                <Link
                  href="/partner"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] font-bold text-[#D4A017] hover:bg-neutral-800"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Channel Partner Ingestion</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} {brandConfig.companyLegalName}. All rights reserved. Exclusively for Property Purchase & Sourcing.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/properties" className="hover:text-neutral-400">
              Buy
            </Link>
            <Link href="/projects" className="hover:text-neutral-400">
              Projects
            </Link>
            <Link href="/partner" className="hover:text-neutral-400">
              Partner Portal
            </Link>
            <Link href="/admin" className="hover:text-neutral-400">
              Admin CRM
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
