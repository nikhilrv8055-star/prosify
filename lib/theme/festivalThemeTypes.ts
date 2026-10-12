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
  | 'navratri_dussehra'
  | 'makar_sankranti'
  | 'maha_shivratri'
  | 'ram_navami'
  | 'hanuman_jayanti'
  | 'eid_ul_fitr'
  | 'akshaya_tritiya'
  | 'buddha_purnima'
  | 'rath_yatra'
  | 'guru_purnima'
  | 'onam'
  | 'ganesh_chaturthi'
  | 'durga_puja'
  | 'karwa_chauth'
  | 'bhai_dooj'
  | 'chath_puja'
  | 'guru_nanak_jayanti';

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
  customBannerImage?: string;
  accentColorOverride?: string;
  festiveOverlayOverride?: AmbientEffectType;
  holidayCustomizations?: Partial<Record<FestivalThemeId, HolidayCustomization>>;
  updatedAt: string;
  updatedBy: string;
}
