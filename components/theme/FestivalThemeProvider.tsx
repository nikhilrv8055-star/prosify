'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  AmbientEffectType,
  FestivalThemeConfig,
  FestivalThemeDefinition,
  FestivalThemeId,
  HolidayScheduleItem,
} from '@/lib/theme/festivalThemeTypes';
import {
  DEFAULT_FESTIVAL_CONFIG,
  FESTIVAL_THEMES,
  INDIAN_HOLIDAY_SCHEDULE,
  THEME_BROADCAST_CHANNEL,
  getAutoScheduledThemeId,
  getFestivalThemeDefinition,
  loadFestivalThemeConfig,
  saveFestivalThemeConfig,
} from '@/lib/theme/festivalThemeStore';
import { FestivalAnnouncementBar } from './FestivalAnnouncementBar';
import { FestivalGreetingModal } from './FestivalGreetingModal';

interface FestivalThemeContextType {
  config: FestivalThemeConfig;
  currentTheme: FestivalThemeDefinition;
  activeAccentColor: string;
  activeBannerImage: string;
  activeOverlay: AmbientEffectType;
  activeGreeting: string;
  activeSubtext: string;
  activeCtaText: string;
  activeBadgeText: string;
  activeThemeId: FestivalThemeId;
  updateConfig: (newConfig: Partial<FestivalThemeConfig>) => void;
  previewTheme: (themeId: FestivalThemeId) => void;
  previewThemeId: FestivalThemeId | null;
  clearPreview: () => void;
  activeHolidayScheduleItem?: HolidayScheduleItem | null;
}

const defaultContextValue: FestivalThemeContextType = {
  config: DEFAULT_FESTIVAL_CONFIG,
  currentTheme: FESTIVAL_THEMES.diwali,
  activeAccentColor: '#F59E0B',
  activeBannerImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=2000&q=80',
  activeOverlay: 'diya_sparkles',
  activeGreeting: '🪔 Shubh Deepawali! Festive Real Estate Dhamaka Live',
  activeSubtext: '0% Brokerage + Spot Gold Coin on Token + Up to ₹5 Lakhs Builder Discounts!',
  activeCtaText: 'View Diwali Deals',
  activeBadgeText: '🪔 Diwali Shubh Labh',
  activeThemeId: 'diwali',
  updateConfig: () => {},
  previewTheme: () => {},
  previewThemeId: null,
  clearPreview: () => {},
  activeHolidayScheduleItem: null,
};

const FestivalThemeContext = createContext<FestivalThemeContextType>(defaultContextValue);

export function useFestivalTheme() {
  return useContext(FestivalThemeContext);
}

export function FestivalThemeProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<FestivalThemeConfig>(DEFAULT_FESTIVAL_CONFIG);
  const [previewThemeId, setPreviewThemeId] = useState<FestivalThemeId | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load initial config from localStorage
    const saved = loadFestivalThemeConfig();
    setConfig(saved);

    // Fetch latest from API endpoint
    fetch('/api/festival-theme')
      .then((res) => res.json())
      .then((data) => {
        if (data?.config) {
          setConfig((prev) => ({
            ...prev,
            ...data.config,
            holidayCustomizations: {
              ...prev.holidayCustomizations,
              ...(data.config.holidayCustomizations || {}),
            },
          }));
        }
      })
      .catch(() => {});

    // Listen to cross-tab broadcast updates
    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel(THEME_BROADCAST_CHANNEL);
        bc.onmessage = (event) => {
          if (event.data?.type === 'FESTIVAL_THEME_CHANGED' && event.data?.config) {
            setConfig(event.data.config);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel error', err);
      }
    }

    // Local custom event listener
    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<FestivalThemeConfig>;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
      }
    };
    window.addEventListener('prosify_theme_update', handleLocalUpdate);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('prosify_theme_update', handleLocalUpdate);
    };
  }, []);

  const updateConfig = (newPartial: Partial<FestivalThemeConfig>) => {
    const updated: FestivalThemeConfig = {
      ...config,
      ...newPartial,
      holidayCustomizations: {
        ...config.holidayCustomizations,
        ...(newPartial.holidayCustomizations || {}),
      },
      updatedAt: new Date().toISOString(),
    };
    setConfig(updated);
    saveFestivalThemeConfig(updated);

    // Also sync to server API
    fetch('/api/festival-theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
  };

  const previewTheme = (themeId: FestivalThemeId) => {
    setPreviewThemeId(themeId);
  };

  const clearPreview = () => {
    setPreviewThemeId(null);
  };

  // Determine active theme based on preview or auto schedule vs manual activeThemeId
  const activeHolidayId = useMemo(() => {
    if (previewThemeId) return previewThemeId;
    if (config.autoScheduleEnabled) {
      return getAutoScheduledThemeId();
    }
    return config.activeThemeId;
  }, [previewThemeId, config.autoScheduleEnabled, config.activeThemeId]);

  const currentTheme = getFestivalThemeDefinition(activeHolidayId);

  // Active Holiday Schedule Item
  const activeHolidayScheduleItem = useMemo(() => {
    return INDIAN_HOLIDAY_SCHEDULE.find((item) => item.themeId === activeHolidayId) || null;
  }, [activeHolidayId]);

  // Per-holiday customization overrides
  const holidayCustom = config.holidayCustomizations?.[activeHolidayId];

  // Dynamically computed overrides
  const activeAccentColor =
    holidayCustom?.accentColor ||
    (config.activeThemeId === activeHolidayId && config.accentColorOverride ? config.accentColorOverride : currentTheme.primaryColor);

  const activeBannerImage =
    holidayCustom?.bannerImageUrl ||
    (config.activeThemeId === activeHolidayId && config.customBannerImage ? config.customBannerImage : currentTheme.defaultBannerImage || '');

  const activeOverlay: AmbientEffectType =
    holidayCustom?.festiveOverlay ||
    (config.activeThemeId === activeHolidayId && config.festiveOverlayOverride ? config.festiveOverlayOverride : currentTheme.ambientEffectType);

  const activeGreeting =
    holidayCustom?.customGreeting ||
    config.customBannerGreeting ||
    currentTheme.defaultBannerGreeting;

  const activeSubtext =
    holidayCustom?.customSubtext ||
    config.customBannerSubtext ||
    currentTheme.defaultBannerSubtext;

  const activeCtaText =
    holidayCustom?.customCtaText ||
    config.customCtaText ||
    currentTheme.defaultCtaText;

  const activeBadgeText =
    holidayCustom?.customBadgeText ||
    config.customBadgeText ||
    currentTheme.defaultBadgeText;

  // Sync CSS variables to document for instant dynamic reactive styling
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--festival-accent', activeAccentColor);
      document.documentElement.style.setProperty('--festival-glow', `${activeAccentColor}40`);
      document.documentElement.style.setProperty('--festival-border', `${activeAccentColor}66`);
    }
  }, [activeAccentColor]);

  return (
    <FestivalThemeContext.Provider
      value={{
        config,
        currentTheme,
        activeAccentColor,
        activeBannerImage,
        activeOverlay,
        activeGreeting,
        activeSubtext,
        activeCtaText,
        activeBadgeText,
        activeThemeId: activeHolidayId,
        updateConfig,
        previewTheme,
        previewThemeId,
        clearPreview,
        activeHolidayScheduleItem,
      }}
    >
      {/* Top Festival Announcement Bar (when enabled) */}
      {config.isEnabled && (
        <FestivalAnnouncementBar
          theme={currentTheme}
          config={config}
          accentColor={activeAccentColor}
          bannerImage={activeBannerImage}
          greeting={activeGreeting}
          subtext={activeSubtext}
          ctaText={activeCtaText}
        />
      )}

      {/* Festive Greeting Modal (when enabled in admin) */}
      {config.isEnabled && (
        <FestivalGreetingModal theme={currentTheme} config={config} />
      )}

      {children}
    </FestivalThemeContext.Provider>
  );
}
