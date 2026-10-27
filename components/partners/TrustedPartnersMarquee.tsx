'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Award, Sparkles, Building2, ExternalLink } from 'lucide-react';

export interface DeveloperPartner {
  name: string;
  slug: string;
  logo: string;
  tagline: string;
  category: string;
  established?: number;
  highlight: string;
}

export const TRUSTED_DEVELOPER_PARTNERS: DeveloperPartner[] = [
  {
    name: 'Lodha',
    slug: 'lodha',
    logo: '/assets/developers/lodha.svg',
    tagline: 'Building a Better Life',
    category: 'Ultra-Luxury & Integrated Cities',
    established: 1980,
    highlight: 'World Towers, Palava & Trump Tower',
  },
  {
    name: 'Adani Realty',
    slug: 'adani',
    logo: '/assets/developers/adani.svg',
    tagline: 'Growth with Goodness',
    category: 'Gated Luxury Habitats',
    established: 2010,
    highlight: 'Monte South & Ten BKC',
  },
  {
    name: 'Piramal Realty',
    slug: 'piramal',
    logo: '/assets/developers/piramal.svg',
    tagline: 'Knowledge • Action • Care',
    category: 'Iconic Skyline Living',
    established: 2012,
    highlight: 'Piramal Mahalaxmi & Aranya',
  },
  {
    name: 'Godrej Properties',
    slug: 'godrej',
    logo: '/assets/developers/godrej.svg',
    tagline: 'Sustainable Innovation',
    category: 'Grade-A Sustainable Townships',
    established: 1990,
    highlight: 'Godrej Riviera & Horizon',
  },
  {
    name: 'Raymond Realty',
    slug: 'raymond',
    logo: '/assets/developers/raymond.svg',
    tagline: 'Go Beyond',
    category: 'Lifestyle Biophilic Communities',
    established: 2019,
    highlight: 'Ten X Habitat & The Address by GS',
  },
  {
    name: 'Chandak Group',
    slug: 'chandak',
    logo: '/assets/developers/chandak.svg',
    tagline: 'Promises Made. Promises Kept.',
    category: 'Western Suburbs Highrises',
    established: 1986,
    highlight: 'Cornerstone & 34 Park Estate',
  },
  {
    name: 'Shapoorji Pallonji',
    slug: 'shapoorji',
    logo: '/assets/developers/shapoorji.svg',
    tagline: 'Real Estate Since 1865',
    category: '150+ Years Engineering Heritage',
    established: 1865,
    highlight: 'Vicinia & Northern Lights',
  },
  {
    name: 'L&T Realty',
    slug: 'lt-realty',
    logo: '/assets/developers/lt-realty.svg',
    tagline: 'Larsen & Toubro Trust',
    category: 'Transit-Oriented Landmark Enclaves',
    established: 2011,
    highlight: 'Seawoods Residences & Crescent Bay',
  },
  {
    name: 'Ansal API',
    slug: 'ansal-api',
    logo: '/assets/developers/ansal-api.svg',
    tagline: 'Building Lifestyles',
    category: 'Township Pioneers',
    established: 1967,
    highlight: 'Sushant City & Landmark Towers',
  },
  {
    name: 'DLF',
    slug: 'dlf',
    logo: '/assets/developers/dlf.svg',
    tagline: 'Building India',
    category: 'India’s Foremost Luxury Leader',
    established: 1946,
    highlight: 'The Camellias & One Midtown',
  },
  {
    name: 'Suraj Estate Developers',
    slug: 'suraj',
    logo: '/assets/developers/suraj.svg',
    tagline: 'South Central Mumbai Landmarks',
    category: 'Bespoke Sea-View Highrises',
    established: 1986,
    highlight: 'Ocean Star & The Palette Dadar',
  },
  {
    name: 'Prestige Group',
    slug: 'prestige',
    logo: '/assets/developers/prestige.svg',
    tagline: 'Add Prestige to Your Life',
    category: 'National Real Estate Sovereign',
    established: 1986,
    highlight: 'Jasdan Classic & Prestige City',
  },
  {
    name: 'Unitech',
    slug: 'unitech',
    logo: '/assets/developers/unitech.svg',
    tagline: 'Dream • Believe • Create',
    category: 'Master-Planned Communities',
    established: 1971,
    highlight: 'Uniworld City & Express Habitats',
  },
  {
    name: 'Sunteck Realty',
    slug: 'sunteck',
    logo: '/assets/developers/sunteck.svg',
    tagline: 'Signature Living',
    category: 'Ultra-Luxury City Center Suites',
    established: 2000,
    highlight: 'Signature Island BKC & Sunteck City',
  },
  {
    name: 'Signature Global',
    slug: 'signature-global',
    logo: '/assets/developers/signature-global.svg',
    tagline: 'India’s Trusted Homes',
    category: 'Modern Green Highrise Townships',
    established: 2014,
    highlight: 'Signature Global City & Park 4',
  },
  {
    name: 'Omaxe',
    slug: 'omaxe',
    logo: '/assets/developers/omaxe.svg',
    tagline: 'Turning Dreams into Reality',
    category: 'Multi-City Gated Megaprojects',
    established: 1987,
    highlight: 'Omaxe Heights & The Forest',
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
  // Seamless continuous loop: duplicate array so it scrolls from 0% to -50% indefinitely
  const duplicatedPartners = [...TRUSTED_DEVELOPER_PARTNERS, ...TRUSTED_DEVELOPER_PARTNERS];

  return (
    <section
      aria-label="Our Trusted Developer Partners"
      className={`relative w-full bg-linear-to-b from-[#0A0D14] via-[#0F172A] to-[#0A0D14] text-white py-14 sm:py-16 overflow-hidden border-y border-[#D4AF37]/20 ${className}`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-[#D4AF37]/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Header & Section Context */}
      {showHeading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Grade-A Institutional Developer Network</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Our Trusted Real Estate Partners
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Direct developer allocations across Mumbai, Pune, Thane, Nagpur, and Nashik. 100% MahaRERA certified inventory with pre-negotiated buyer privileges and zero brokerage.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-5 text-[11px] sm:text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5 text-amber-300">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>100% Pre-Vetted Legal Clearances</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-300">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>Direct Developer Rate Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-300">
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Timely Possession Assurance</span>
            </div>
          </div>
        </div>
      )}

      {/* Ticker / Marquee Viewport with Left/Right Edge Gradient Fade Masks */}
      <div className="relative w-full overflow-hidden marquee-container group">
        {/* Left Gradient Fade Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-36 lg:w-48 bg-linear-to-r from-[#0A0D14] via-[#0A0D14]/80 to-transparent z-20 pointer-events-none" />

        {/* Right Gradient Fade Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-36 lg:w-48 bg-linear-to-l from-[#0A0D14] via-[#0A0D14]/80 to-transparent z-20 pointer-events-none" />

        {/* Continuous Horizontal Ticker Track */}
        <div className="animate-marquee-continuous flex items-center gap-4 sm:gap-6 py-4 pl-4 will-change-transform group-hover:[animation-play-state:paused]">
          {duplicatedPartners.map((partner, index) => (
            <Link
              key={`${partner.slug}-${index}`}
              href={`/developers/${partner.slug}`}
              className="glass-partner-card relative shrink-0 w-64 sm:w-72 p-4 rounded-2xl flex flex-col justify-between gap-3 text-left group/card cursor-pointer border border-[#D4AF37]/20 hover:border-[#D4AF37]/70 hover:shadow-[0_12px_36px_rgba(212,175,55,0.22)] transition-all duration-300"
            >
              {/* Partner Logo Area with Grayscale to Full Color + Gold Glow Effect */}
              <div className="w-full h-14 sm:h-16 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-center p-2.5 relative overflow-hidden transition-all duration-300 group-hover/card:bg-slate-900 group-hover/card:border-[#D4AF37]/40">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} Developer Logo`}
                  width={180}
                  height={50}
                  className="w-auto h-9 sm:h-10 object-contain filter grayscale contrast-125 opacity-70 transition-all duration-300 group-hover/card:grayscale-0 group-hover/card:opacity-100 group-hover/card:scale-105"
                  priority={index < 8}
                />
              </div>

              {/* Card Meta & Highlight */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white group-hover/card:text-[#D4AF37] transition-colors truncate">
                    {partner.name}
                  </span>
                  <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 shrink-0">
                    Grade-A
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 line-clamp-1">
                  {partner.category}
                </div>

                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span className="text-amber-300/80 truncate">
                    ⭐ {partner.highlight}
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover/card:text-[#D4AF37] shrink-0 ml-1 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Subtle Indicator */}
      <div className="text-center mt-6">
        <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>Hover over any developer partner to pause ticker & view verified projects</span>
        </span>
      </div>
    </section>
  );
}
