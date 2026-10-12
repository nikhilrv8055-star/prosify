'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { FestivalThemeConfig, FestivalThemeDefinition } from '@/lib/theme/festivalThemeTypes';

interface FestivalAnnouncementBarProps {
  theme: FestivalThemeDefinition;
  config: FestivalThemeConfig;
  accentColor?: string;
  bannerImage?: string;
  greeting?: string;
  subtext?: string;
  ctaText?: string;
}

export function FestivalAnnouncementBar({
  theme,
  config,
  accentColor,
  bannerImage,
  greeting: propGreeting,
  subtext: propSubtext,
  ctaText: propCtaText,
}: FestivalAnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !config.bannerEnabled || !config.isEnabled) {
    return null;
  }

  const effectiveAccent = accentColor || theme.primaryColor;
  const greeting = propGreeting || config.customBannerGreeting || theme.defaultBannerGreeting;
  const subtext = propSubtext || config.customBannerSubtext || theme.defaultBannerSubtext;
  const ctaText = propCtaText || config.customCtaText || theme.defaultCtaText;
  const ctaLink = config.customCtaLink || '/properties';

  return (
    <aside
      aria-label="Festive Celebration Announcement"
      className="relative z-50 overflow-hidden border-b transition-all duration-300"
      style={{
        boxShadow: `0 4px 20px ${effectiveAccent}33`,
        borderColor: `${effectiveAccent}40`,
      }}
    >
      {/* Background Gradient & optional banner image overlay */}
      <div
        className={`w-full bg-gradient-to-r ${theme.bannerGradient} py-2.5 px-3 sm:px-6 flex items-center justify-between gap-3 text-white relative overflow-hidden`}
      >
        {bannerImage && (
          <div
            className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: `url(${bannerImage})` }}
          />
        )}

        {/* Decorative Top Specular Line */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* Left / Center: Festive Message */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0 justify-center sm:justify-start relative z-10">
          {/* Festive Icon Badge */}
          <span className="flex-shrink-0 text-base sm:text-lg animate-bounce select-none">
            {theme.iconEmoji}
          </span>

          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2.5 min-w-0 text-center sm:text-left">
            <span className="text-xs sm:text-sm font-extrabold tracking-tight truncate flex items-center gap-1.5 justify-center sm:justify-start">
              <span>{greeting}</span>
              <span className="hidden md:inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/15 text-white border border-white/20">
                {theme.hindiName}
              </span>
            </span>

            {subtext && (
              <span className="hidden lg:inline text-xs text-white/80 font-medium truncate">
                • {subtext}
              </span>
            )}
          </div>
        </div>

        {/* Right: CTA & Dismiss */}
        <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
          <Link
            href={ctaLink}
            className="inline-flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold transition-all transform hover:scale-105 active:scale-95 shadow-md text-neutral-950"
            style={{
              backgroundColor: effectiveAccent,
            }}
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss festive announcement"
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
