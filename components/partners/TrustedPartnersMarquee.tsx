'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export interface DeveloperPartner {
  id: string;
  name: string;
  logo: string;
}

export const TRUSTED_DEVELOPER_PARTNERS: DeveloperPartner[] = [
  {
    id: 'lodha',
    name: 'Lodha',
    logo: 'https://pub-1be3e2f8312946fa89ceb6d684478ef8.r2.dev/Lodha_logo.png',
  },
  {
    id: 'adani',
    name: 'Adani Realty',
    logo: 'https://pub-1be3e2f8312946fa89ceb6d684478ef8.r2.dev/adanis.png',
  },
  {
    id: 'piramal',
    name: 'Piramal',
    logo: 'https://pub-1be3e2f8312946fa89ceb6d684478ef8.r2.dev/piramal-realty.png',
  },
  {
    id: 'godrej',
    name: 'Godrej Properties',
    logo: 'https://pub-1be3e2f8312946fa89ceb6d684478ef8.r2.dev/Godrej%20Properties%20Ltd.jpeg',
  },
  {
    id: 'raymond',
    name: 'Raymond',
    logo: 'https://pub-1be3e2f8312946fa89ceb6d684478ef8.r2.dev/raymond-logo.png',
  },
  {
    id: 'chandak',
    name: 'Chandak',
    logo: 'https://pub-1be3e2f8312946fa89ceb6d684478ef8.r2.dev/chandak.png',
  },
  {
    id: 'shapoorji',
    name: 'Shapoorji Pallonji',
    logo: 'https://pub-1be3e2f8312946fa89ceb6d684478ef8.r2.dev/sapoorji%20pallonji.png',
  },
  {
    id: 'lt-realty',
    name: 'L&T Realty',
    logo: 'https://pub-1be3e2f8312946fa89ceb6d684478ef8.r2.dev/l%20%26%20T.jpg',
  },
  {
    id: 'ansal-api',
    name: 'Ansal API',
    logo: 'https://pub-1be3e2f8312946fa89ceb6d684478ef8.r2.dev/ansal-api.jpg',
  },
  {
    id: 'dlf',
    name: 'DLF',
    logo: 'https://pub-1be3e2f8312946fa89ceb6d684478ef8.r2.dev/dlf-logo-png_seeklogo-42359.png',
  },
  {
    id: 'suraj',
    name: 'Suraj',
    logo: 'https://pub-1be3e2f8312946fa89ceb6d684478ef8.r2.dev/suraj.png',
  },
  {
    id: 'prestige',
    name: 'Prestige',
    logo: 'https://pub-1be3e2f8312946fa89ceb6d684478ef8.r2.dev/prestige.jpg',
  },
  {
    id: 'unitech',
    name: 'Unitech',
    logo: 'https://pub-1be3e2f8312946fa89ceb6d684478ef8.r2.dev/unitech.png',
  },
  {
    id: 'sunteck',
    name: 'Sunteck',
    logo: 'https://pub-1be3e2f8312946fa89ceb6d684478ef8.r2.dev/sunteck.png',
  },
  {
    id: 'signature-global',
    name: 'Signature Global',
    logo: 'https://pub-1be3e2f8312946fa89ceb6d684478ef8.r2.dev/signature_global%20logo.jpg',
  },
  {
    id: 'omaxe',
    name: 'Omaxe',
    logo: 'https://pub-1be3e2f8312946fa89ceb6d684478ef8.r2.dev/omaxe.jpg',
  },
];

interface TrustedPartnersMarqueeProps {
  className?: string;
  showHeading?: boolean;
}

export function TrustedPartnersMarquee({
  className = '',
  showHeading = true,
}: TrustedPartnersMarqueeProps) {
  // Seamless continuous loop: duplicate array so it scrolls indefinitely without stutter or blank gaps
  const duplicatedPartners = [
    ...TRUSTED_DEVELOPER_PARTNERS,
    ...TRUSTED_DEVELOPER_PARTNERS,
  ];

  return (
    <section
      aria-label="Our Trusted Real Estate Partners"
      className={`relative w-full bg-linear-to-b from-[#0A0D14] via-[#0F172A] to-[#0A0D14] text-white py-12 sm:py-16 overflow-hidden border-y border-[#D4AF37]/20 select-none ${className}`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-[#D4AF37]/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Header & Section Title */}
      {showHeading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Grade-A Institutional Developer Network</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Our Trusted Real Estate Partners
          </h2>
        </div>
      )}

      {/* Ticker / Marquee Viewport with Left/Right Edge Gradient Fade Masks */}
      <div className="relative w-full overflow-hidden marquee-container group">
        {/* Left Gradient Fade Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 lg:w-44 bg-linear-to-r from-[#0A0D14] via-[#0A0D14]/80 to-transparent z-20 pointer-events-none" />

        {/* Right Gradient Fade Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 lg:w-44 bg-linear-to-l from-[#0A0D14] via-[#0A0D14]/80 to-transparent z-20 pointer-events-none" />

        {/* Continuous Horizontal Ticker Track - Strictly Logos Only, No Redirects, No Text */}
        <div className="animate-marquee-continuous flex items-center gap-4 sm:gap-6 py-3 pl-4 will-change-transform group-hover:[animation-play-state:paused]">
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="relative shrink-0 w-44 sm:w-56 h-20 sm:h-24 px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 backdrop-blur-md flex items-center justify-center shadow-xs transition-all duration-300 hover:shadow-[0_8px_24px_rgba(212,175,55,0.18)] hover:bg-slate-800/90"
            >
              {/* Partner Logo - Pure Image, No Extra Information, No Links */}
              <div className="relative w-full h-full flex items-center justify-center p-1">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} Logo`}
                  width={200}
                  height={70}
                  className="max-h-12 sm:max-h-14 w-auto max-w-[140px] sm:max-w-[180px] object-contain drop-shadow-xs transition-transform duration-300 hover:scale-105"
                  priority={index < 8}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustedPartnersMarquee;
