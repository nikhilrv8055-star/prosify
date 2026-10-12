export type FestivalThemeId =
  | 'default'
  | 'diwali'
  | 'new_year'
  | 'christmas'
  | 'republic_day'
  | 'holi'
  | 'gudi_padwa'
  | 'independence_day'
  | 'raksha_bandhan'
  | 'navratri_dussehra';

export type AmbientEffectType =
  | 'none'
  | 'diya_sparkles'
  | 'confetti_stars'
  | 'snow_crystals'
  | 'tricolor_ribbons'
  | 'holi_colors'
  | 'marigold_petals';

export interface FestivalThemeDefinition {
  id: FestivalThemeId;
  name: string;
  hindiName: string;
  tagline: string;
  dates: string;
  season: string;
  iconEmoji: string;
  bannerGradient: string;
  bannerBorderColor: string;
  bannerTextColor: string;
  badgeBg: string;
  badgeTextColor: string;
  badgeBorder: string;
  accentGlow: string;
  ambientEffectType: AmbientEffectType;
  primaryColor: string;
  secondaryColor: string;
  defaultBannerGreeting: string;
  defaultBannerSubtext: string;
  defaultCtaText: string;
  defaultBadgeText: string;
  culturalNote: string;
  defaultBannerImage?: string;
}

export interface HolidayCustomization {
  bannerImageUrl?: string;
  accentColor?: string;
  festiveOverlay?: AmbientEffectType;
  customGreeting?: string;
  customSubtext?: string;
  customCtaText?: string;
  customBadgeText?: string;
}

export interface HolidayScheduleItem {
  themeId: FestivalThemeId;
  name: string;
  hindiName: string;
  emoji: string;
  startMonth: number; // 0-11
  startDay: number;   // 1-31
  endMonth: number;   // 0-11
  endDay: number;     // 1-31
  dateRangeLabel: string;
}

export interface FestivalThemeConfig {
  isEnabled: boolean;
  activeThemeId: FestivalThemeId;
  bannerEnabled: boolean;
  customBannerGreeting?: string;
  customBannerSubtext?: string;
  customCtaText?: string;
  customCtaLink?: string;
  ambientEffectsEnabled: boolean;
  effectIntensity: 'subtle' | 'moderate' | 'festive';
  festiveBadgesEnabled: boolean;
  customBadgeText?: string;
  festiveModalGreetingEnabled: boolean;
  autoScheduleEnabled: boolean;
  // Custom Banner Images, Accent Color Overrides, and Festive Overlays
  customBannerImage?: string;
  accentColorOverride?: string;
  festiveOverlayOverride?: AmbientEffectType;
  holidayCustomizations?: Partial<Record<FestivalThemeId, HolidayCustomization>>;
  updatedAt: string;
  updatedBy: string;
}
