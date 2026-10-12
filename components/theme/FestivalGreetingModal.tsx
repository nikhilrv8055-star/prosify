'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import { FestivalThemeConfig, FestivalThemeDefinition } from '@/lib/theme/festivalThemeTypes';

interface FestivalGreetingModalProps {
  theme: FestivalThemeDefinition;
  config: FestivalThemeConfig;
}

export function FestivalGreetingModal({ theme, config }: FestivalGreetingModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!config.isEnabled || !config.festiveModalGreetingEnabled) return;

    // Check if user already saw this festival modal in this session
    const seenKey = `prosify_festive_modal_${theme.id}_seen`;
    const hasSeen = sessionStorage.getItem(seenKey);
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem(seenKey, 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [theme.id, config.isEnabled, config.festiveModalGreetingEnabled]);

  if (!isOpen) return null;

  const greeting = config.customBannerGreeting || theme.defaultBannerGreeting;
  const subtext = config.customBannerSubtext || theme.defaultBannerSubtext;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden border shadow-2xl p-6 sm:p-8 text-white"
        style={{
          background: `radial-gradient(circle at top, ${theme.primaryColor}22, #0B0F19 80%)`,
          borderColor: `${theme.primaryColor}55`,
          boxShadow: `0 20px 60px ${theme.accentGlow}`,
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{theme.iconEmoji}</span>
          <span
            className="px-3 py-1 rounded-full text-xs font-bold border"
            style={{
              backgroundColor: `${theme.primaryColor}25`,
              color: theme.primaryColor,
              borderColor: `${theme.primaryColor}55`,
            }}
          >
            {theme.name} • {theme.hindiName}
          </span>
        </div>

        {/* Headline */}
        <h3 className="text-xl sm:text-2xl font-black text-white leading-snug mb-2">
          {greeting}
        </h3>

        {/* Subtext */}
        <p className="text-sm text-neutral-300 leading-relaxed mb-6">
          {subtext}
        </p>

        {/* Value Highlights */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
            <Gift className="w-5 h-5 flex-shrink-0" style={{ color: theme.primaryColor }} />
            <div>
              <p className="text-xs font-bold text-white">Festive Offers</p>
              <p className="text-[10px] text-neutral-400">Exclusive Spot Savings</p>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <div>
              <p className="text-xs font-bold text-white">0% Brokerage</p>
              <p className="text-[10px] text-neutral-400">Verified Direct RERA</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/properties"
            onClick={() => setIsOpen(false)}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-neutral-950 text-center transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <span>Explore Festive Inventories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-3 rounded-xl font-bold text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
