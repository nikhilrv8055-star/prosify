'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shield, Building2, Briefcase } from 'lucide-react';
import { useBrandSettings } from '@/lib/data/useBrandSettings';

interface ProsifyAnimatedLogoProps {
  panelType?: 'admin' | 'vendor' | 'agent';
  welcomeTitle?: string; // e.g. "Welcome to Prosify Admin"
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProsifyAnimatedLogo({
  panelType = 'agent',
  welcomeTitle,
  subtitle,
  size = 'lg',
}: ProsifyAnimatedLogoProps) {
  const { logoUrl } = useBrandSettings();

  // If size is 'sm', render compact header branding
  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2.5 select-none">
        {logoUrl ? (
          <div className="h-8 w-auto min-w-8 max-w-[120px] rounded-lg overflow-hidden flex items-center justify-center p-0.5 bg-neutral-900 border border-amber-500/30">
            <img src={logoUrl} alt="Prosify Logo" className="h-full w-auto object-contain" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#B38711] via-[#D4A017] to-[#F4C430] flex items-center justify-center text-neutral-950 font-serif font-black text-sm shadow-xs">
            P
          </div>
        )}
        <div className="flex items-center gap-1 font-serif font-bold text-base text-white tracking-tight">
          <span>prosify</span>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1 py-0.2 rounded border border-amber-400/30">
            .in
          </span>
        </div>
      </div>
    );
  }

  // Theme color accents per panel
  const panelThemes = {
    admin: {
      accentGrad: 'from-amber-400 via-[#D4A017] to-amber-600',
      glow: 'rgba(212, 160, 23, 0.28)',
      badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
      dotColor: 'bg-amber-400',
      icon: Shield,
      label: 'Admin Workspace',
    },
    vendor: {
      accentGrad: 'from-sky-400 via-[#0EA5E9] to-blue-600',
      glow: 'rgba(14, 165, 233, 0.28)',
      badgeBg: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
      dotColor: 'bg-sky-400',
      icon: Building2,
      label: 'Vendor Workspace',
    },
    agent: {
      accentGrad: 'from-amber-400 via-[#D4A017] to-emerald-500',
      glow: 'rgba(212, 160, 23, 0.28)',
      badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
      dotColor: 'bg-emerald-400',
      icon: Briefcase,
      label: 'Agent Workspace',
    },
  };

  const safeType = panelType && panelThemes[panelType] ? panelType : 'agent';
  const currentTheme = panelThemes[safeType];
  const IconComponent = currentTheme.icon;

  return (
    <div className="flex flex-col items-center text-center select-none">
      {/* Animated Emblem Container */}
      <div className="relative mb-4 flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <motion.div
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.35, 0.75, 0.35],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -inset-3 rounded-3xl blur-xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${currentTheme.glow} 0%, transparent 70%)` }}
        />

        {/* Orbiting particles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute w-24 h-24 rounded-full pointer-events-none"
        >
          <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${currentTheme.dotColor} shadow-[0_0_8px_currentColor]`} />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/60" />
        </motion.div>

        {/* Central Monogram Emblem */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          whileHover={{ scale: 1.05 }}
          className={`relative z-10 ${
            size === 'lg' ? 'w-18 h-18 text-3xl' : 'w-14 h-14 text-2xl'
          } rounded-2xl bg-gradient-to-tr ${currentTheme.accentGrad} p-[1.5px] shadow-2xl flex items-center justify-center`}
        >
          {/* Inner dark core */}
          <div className="w-full h-full rounded-[14px] bg-neutral-950 flex items-center justify-center relative overflow-hidden">
            {/* Shimmer sweep */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', repeatDelay: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
            />
            {/* Custom Logo or Letter 'P' for Prosify */}
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Brand Logo"
                className="relative z-10 w-3/4 h-3/4 object-contain"
              />
            ) : (
              <span className="relative z-10 font-serif font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-amber-200 to-amber-500 drop-shadow">
                P
              </span>
            )}
            <div className="absolute bottom-1 right-1 opacity-70">
              <IconComponent className="w-3.5 h-3.5 text-amber-300/80" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* prosify.in animated domain wordmark */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="flex items-center gap-1.5 mb-2"
      >
        <span className="font-serif text-lg font-black tracking-wider text-white">
          prosify
        </span>
        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
          .in
        </span>
      </motion.div>

      {/* Main Welcome Headline (if provided) */}
      {welcomeTitle && (
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-xl sm:text-2xl font-black tracking-tight text-white capitalize flex items-center justify-center gap-2"
        >
          <span>{welcomeTitle}</span>
        </motion.h1>
      )}

      {/* Subtitle / tag line */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-xs text-neutral-400 mt-1 max-w-sm leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Minimalist secure portal badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-[11px] font-mono text-neutral-300 shadow"
      >
        <span className={`w-2 h-2 rounded-full ${currentTheme.dotColor} animate-pulse`} />
        <span className="text-neutral-400">prosify.in</span>
        <span className="text-neutral-600">•</span>
        <span className="font-semibold text-neutral-200">{currentTheme.label}</span>
      </motion.div>
    </div>
  );
}
