'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export function FloatingWhatsAppButton() {
  const pathname = usePathname() || '';

  // Avoid overlaying portals where custom layout is handled (admin, vendor, agent, customer)
  const isPortal =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/vendor') ||
    pathname.startsWith('/agent') ||
    pathname.startsWith('/customer');

  if (isPortal) return null;

  return (
    <aside aria-label="WhatsApp Assistance" className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 group">
      <a
        href="https://wa.me/919167991679"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-400/40 backdrop-blur-md"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
        <span className="tracking-wide">WhatsApp</span>
      </a>

      {/* Floating Hover Card */}
      <div className="absolute bottom-full right-0 mb-2 pointer-events-none transition-all duration-200 opacity-0 invisible -translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
        <div className="w-56 p-2.5 rounded-xl bg-neutral-900/95 text-white text-[11px] shadow-xl border border-neutral-700/80 backdrop-blur-md">
          <p className="font-semibold text-emerald-400">Direct Advisory on WhatsApp</p>
          <p className="text-neutral-300 text-[10px] mt-0.5 leading-snug">
            Instant connection with verified property advisors. Zero spam.
          </p>
        </div>
      </div>
    </aside>
  );
}
