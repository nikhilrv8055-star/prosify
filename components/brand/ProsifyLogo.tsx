'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { brandConfig } from '@/src/config/brand';
import { useBrandSettings } from '@/lib/data/useBrandSettings';

const DEFAULT_OFFICIAL_LOGO =
  'https://pub-7905aa2d4dfa43d69cee6dd8ca78c0e5.r2.dev/Photos/prosify-logo-CcMCTuhS.png';

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
  const { logoUrl } = useBrandSettings();

  // Active logo source with Cloudflare R2 logo as primary default
  const activeLogo = logoUrl && logoUrl.trim().length > 0 ? logoUrl : DEFAULT_OFFICIAL_LOGO;

  // Prominent, big-size responsive dimensions for clear visual branding
  const sizeClasses = {
    sm: 'h-8 sm:h-9 max-w-[150px]',
    md: 'h-11 sm:h-12 md:h-14 max-w-[240px]',
    lg: 'h-14 sm:h-16 md:h-18 max-w-[300px]',
    xl: 'h-18 sm:h-22 md:h-24 max-w-[380px]',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Official Prosify Logo Image in prominent big size */}
      <div className="relative flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-102">
        <Image
          src={activeLogo}
          alt={brandConfig.name}
          width={340}
          height={96}
          priority
          referrerPolicy="no-referrer"
          className={`${currentSizeClass} w-auto object-contain drop-shadow-sm`}
        />
      </div>

      {/* Optional Badge (e.g. Admin / Partner portal tag) without repeating Prosify text */}
      {badge && (
        <span className="rounded-md font-mono text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/30 px-2 py-0.5 shadow-xs">
          {badge}
        </span>
      )}

      {/* Optional Tagline (only if explicitly enabled, e.g. footer) */}
      {showTagline && (
        <span className="hidden sm:inline-block font-mono text-[10px] tracking-wider uppercase text-neutral-400">
          {brandConfig.tagline}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl transition-opacity hover:opacity-95"
      >
        {content}
      </Link>
    );
  }

  return content;
};
