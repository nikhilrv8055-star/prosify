'use client';

import React from 'react';
import Link from 'next/link';
import { brandConfig } from '@/src/config/brand';

interface ProsifyLogoProps {
  variant?: 'light' | 'dark' | 'header' | 'admin' | 'partner' | 'developer';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  showTagline?: boolean;
  badge?: string;
  className?: string;
}

export const ProsifyLogo: React.FC<ProsifyLogoProps> = ({
  variant = 'dark',
  size = 'md',
  href,
  showTagline = false,
  badge,
  className = '',
}) => {
  // Dimension definitions
  const sizeMap = {
    sm: {
      box: 'w-7 h-7 rounded-lg text-sm',
      text: 'text-base',
      tagline: 'text-[9px]',
      badge: 'text-[9px] px-1.5 py-0.5',
    },
    md: {
      box: 'w-9 h-9 rounded-xl text-lg',
      text: 'text-xl',
      tagline: 'text-[10px]',
      badge: 'text-[10px] px-2 py-0.5',
    },
    lg: {
      box: 'w-11 h-11 rounded-xl text-xl',
      text: 'text-2xl',
      tagline: 'text-[11px]',
      badge: 'text-[11px] px-2.5 py-0.5',
    },
    xl: {
      box: 'w-14 h-14 rounded-2xl text-2xl',
      text: 'text-3xl',
      tagline: 'text-xs',
      badge: 'text-xs px-3 py-1',
    },
  };

  const dims = sizeMap[size];

  // Theme variant styling
  const isDarkCanvas = ['light', 'admin', 'partner', 'developer'].includes(variant);

  const emblemClasses =
    'relative flex items-center justify-center font-serif font-black tracking-tight bg-gradient-to-tr from-[#B38711] via-[#D4A017] to-[#F4C430] text-neutral-950 shadow-sm transition-transform group-hover:scale-105';

  const titleClasses = isDarkCanvas
    ? 'text-white font-serif font-bold tracking-tight'
    : 'text-[#171717] font-serif font-bold tracking-tight';

  const taglineClasses = isDarkCanvas ? 'text-[#D4A017]' : 'text-neutral-500';

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Prosify Geometric / Monogram Emblem (Replaceable with <Image> or SVG) */}
      <div className={`${dims.box} ${emblemClasses}`}>
        {/* Subtle inner bevel */}
        <span className="relative z-10 leading-none drop-shadow-sm">P</span>
        <div className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/30" />
      </div>

      {/* Prosify Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`${dims.text} ${titleClasses}`}>
            {brandConfig.name}
          </span>
          {badge && (
            <span
              className={`rounded-md font-mono font-semibold uppercase tracking-wider bg-[#D4A017]/15 text-[#D4A017] border border-[#D4A017]/30 ${dims.badge}`}
            >
              {badge}
            </span>
          )}
        </div>
        {showTagline && (
          <span className={`${dims.tagline} font-mono tracking-wider uppercase ${taglineClasses}`}>
            {brandConfig.tagline}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017] rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};
