import {
  AmbientEffectType,
  FestivalThemeConfig,
  FestivalThemeDefinition,
  FestivalThemeId,
  HolidayCustomization,
  HolidayScheduleItem,
} from './festivalThemeTypes';

// Re-export types for convenient usage across the codebase
export type {
  AmbientEffectType,
  FestivalThemeConfig,
  FestivalThemeDefinition,
  FestivalThemeId,
  HolidayCustomization,
  HolidayScheduleItem,
};

export const FESTIVAL_THEMES: Record<FestivalThemeId, FestivalThemeDefinition> = {
  default: {
    id: 'default',
    name: 'Prosify Classic Luxury',
    hindiName: 'रेगुलर लग्जरी थीम',
    tagline: 'Standard Royal Gold & Obsidian Real Estate Theme',
    dates: 'All Year',
    season: 'Standard',
    iconEmoji: '✨',
    bannerGradient: 'from-neutral-950 via-neutral-900 to-neutral-950',
    bannerBorderColor: 'border-amber-500/25',
    bannerTextColor: 'text-amber-300',
    badgeBg: 'bg-gradient-to-r from-amber-500/20 to-amber-600/20',
    badgeTextColor: 'text-amber-400',
    badgeBorder: 'border-amber-500/40',
    accentGlow: 'rgba(212, 160, 23, 0.25)',
    ambientEffectType: 'none',
    primaryColor: '#D4A017',
    secondaryColor: '#0F172A',
    defaultBannerGreeting: 'Verified Developer Inventories & Direct Pre-Launch Bookings',
    defaultBannerSubtext: 'Save up to 2% on direct builder bookings with 0 brokerage',
    defaultCtaText: 'Explore Homes',
    defaultBadgeText: 'Prosify Verified',
    culturalNote: 'Standard premium real estate theme for everyday browsing.',
    defaultBannerImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80',
  },
  diwali: {
    id: 'diwali',
    name: 'Diwali Mahotsav - Festival of Lights',
    hindiName: 'दीपावली महोत्सव',
    tagline: 'Radiant golden diyas, auspicious sparks & Lakshmi Puja prosperity',
    dates: 'October - November',
    season: 'Autumn / Kartik',
    iconEmoji: '🪔',
    bannerGradient: 'from-[#451A03] via-[#78350F] to-[#291305]',
    bannerBorderColor: 'border-amber-400/50',
    bannerTextColor: 'text-amber-200',
    badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-500',
    badgeTextColor: 'text-neutral-950',
    badgeBorder: 'border-amber-300',
    accentGlow: 'rgba(245, 158, 11, 0.45)',
    ambientEffectType: 'diya_sparkles',
    primaryColor: '#F59E0B',
    secondaryColor: '#EA580C',
    defaultBannerGreeting: '🪔 Shubh Deepawali! Festive Real Estate Dhamaka Live',
    defaultBannerSubtext: '0% Brokerage + Spot Gold Coin on Token + Up to ₹5 Lakhs Builder Discounts!',
    defaultCtaText: 'View Diwali Deals',
    defaultBadgeText: '🪔 Diwali Shubh Labh',
    culturalNote: 'Most auspicious season for buying property and Griha Pravesh across India.',
    defaultBannerImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=2000&q=80',
  },
  new_year: {
    id: 'new_year',
    name: 'New Year Mega Celebration 2026',
    hindiName: 'नव वर्ष 2026 उत्सव',
    tagline: 'Midnight champagne glow, starry fireworks & new beginnings',
    dates: 'Dec 25 - Jan 15',
    season: 'Winter',
    iconEmoji: '🎉',
    bannerGradient: 'from-[#0B0F19] via-[#1E1B4B] to-[#020617]',
    bannerBorderColor: 'border-indigo-400/50',
    bannerTextColor: 'text-indigo-200',
    badgeBg: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    badgeTextColor: 'text-white',
    badgeBorder: 'border-indigo-300',
    accentGlow: 'rgba(99, 102, 241, 0.45)',
    ambientEffectType: 'confetti_stars',
    primaryColor: '#818CF8',
    secondaryColor: '#C084FC',
    defaultBannerGreeting: '🎉 Welcome 2026! New Year Property Launch Bonanza Live',
    defaultBannerSubtext: 'Exclusive 0% Stamp Duty + Assured 1-Year Rental Guarantee on Bookings!',
    defaultCtaText: 'Explore New Year Offers',
    defaultBadgeText: '🎉 NY 2026 Offer',
    culturalNote: 'Celebrates fresh starts, new resolutions, and home ownership dreams for the new year.',
    defaultBannerImage: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=2000&q=80',
  },
  christmas: {
    id: 'christmas',
    name: 'Christmas & Winter Holiday Gala',
    hindiName: 'क्रिसमस पर्व',
    tagline: 'Festive red & winter snow crystals, holiday home hampers & joy',
    dates: 'December 15 - 28',
    season: 'Winter',
    iconEmoji: '🎄',
    bannerGradient: 'from-[#14532D] via-[#7F1D1D] to-[#14532D]',
    bannerBorderColor: 'border-rose-400/50',
    bannerTextColor: 'text-rose-100',
    badgeBg: 'bg-gradient-to-r from-red-600 to-emerald-600',
    badgeTextColor: 'text-white',
    badgeBorder: 'border-red-300',
    accentGlow: 'rgba(239, 68, 68, 0.45)',
    ambientEffectType: 'snow_crystals',
    primaryColor: '#EF4444',
    secondaryColor: '#10B981',
    defaultBannerGreeting: '🎄 Merry Christmas & Season Greetings! Holiday Real Estate Gifts',
    defaultBannerSubtext: 'Santa Gift Box: Free modular kitchen + Home automation vouchers with every booking!',
    defaultCtaText: 'Discover Holiday Deals',
    defaultBadgeText: '🎄 Christmas Special',
    culturalNote: 'End of year holiday season with warm gifts and winter holiday discounts.',
    defaultBannerImage: 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=2000&q=80',
  },
  republic_day: {
    id: 'republic_day',
    name: 'Republic Day - 26th January',
    hindiName: 'गणतंत्र दिवस गौरव',
    tagline: 'Saffron, White & Emerald Green tricolor pride with constitutional sovereign dignity',
    dates: 'January 20 - 30',
    season: 'Winter',
    iconEmoji: '🇮🇳',
    bannerGradient: 'from-[#7C2D12] via-[#0F172A] to-[#064E3B]',
    bannerBorderColor: 'border-orange-400/60',
    bannerTextColor: 'text-orange-200',
    badgeBg: 'bg-gradient-to-r from-orange-500 via-amber-100 to-emerald-600',
    badgeTextColor: 'text-neutral-950 font-black',
    badgeBorder: 'border-orange-300',
    accentGlow: 'rgba(249, 115, 22, 0.4)',
    ambientEffectType: 'tricolor_ribbons',
    primaryColor: '#FF671F',
    secondaryColor: '#046A38',
    defaultBannerGreeting: '🇮🇳 77th Republic Day Mega Housing Fair! Celebrate Independence of Living',
    defaultBannerSubtext: 'Celebrate Freedom with Zero EMI for 12 Months on RERA Approved Residences!',
    defaultCtaText: 'View Republic Offers',
    defaultBadgeText: '🇮🇳 Tricolor Pride',
    culturalNote: 'National festival celebrating the Indian Constitution and nation building.',
    defaultBannerImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=2000&q=80',
  },
  holi: {
    id: 'holi',
    name: 'Holi Rangotsav - Festival of Colors',
    hindiName: 'होली रंगोत्सव',
    tagline: 'Splashes of gulal, vibrant magenta, joyful celebrations & spring energy',
    dates: 'March',
    season: 'Spring / Phalguna',
    iconEmoji: '🎨',
    bannerGradient: 'from-[#831843] via-[#701A75] to-[#1E1B4B]',
    bannerBorderColor: 'border-pink-400/50',
    bannerTextColor: 'text-pink-200',
    badgeBg: 'bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400',
    badgeTextColor: 'text-white font-bold',
    badgeBorder: 'border-pink-300',
    accentGlow: 'rgba(236, 72, 153, 0.45)',
    ambientEffectType: 'holi_colors',
    primaryColor: '#EC4899',
    secondaryColor: '#A855F7',
    defaultBannerGreeting: '🎨 Rang Barse! Auspicious Holi Property Carnival Live',
    defaultBannerSubtext: 'Add vibrant colors to life with Spot ₹3 Lakhs Cash Cashback on Select Bookings!',
    defaultCtaText: 'Explore Holi Carnival',
    defaultBadgeText: '🎨 Holi Dhamaka',
    culturalNote: 'Festival celebrating the arrival of spring, victory of goodness and vivid celebration.',
    defaultBannerImage: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=2000&q=80',
  },
  gudi_padwa: {
    id: 'gudi_padwa',
    name: 'Gudi Padwa & Ugadi - Auspicious New Year',
    hindiName: 'गुढीपाडवा व युगादी',
    tagline: 'Gudi flags, marigold garlands, neem-jaggery sweetness & Griha Pravesh muhurat',
    dates: 'March - April',
    season: 'Spring / Chaitra',
    iconEmoji: '🚩',
    bannerGradient: 'from-[#7C2D12] via-[#B45309] to-[#451A03]',
    bannerBorderColor: 'border-amber-400/50',
    bannerTextColor: 'text-amber-200',
    badgeBg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500',
    badgeTextColor: 'text-neutral-950 font-bold',
    badgeBorder: 'border-amber-300',
    accentGlow: 'rgba(249, 115, 22, 0.45)',
    ambientEffectType: 'marigold_petals',
    primaryColor: '#F97316',
    secondaryColor: '#EAB308',
    defaultBannerGreeting: '🚩 Shubh Gudi Padwa & Ugadi! Auspicious Griha Pravesh Muhurat',
    defaultBannerSubtext: 'Most Auspicious New Year Muhurat: Gold Coin + 0 Stamp Duty & Registration!',
    defaultCtaText: 'Unlock Padwa Deals',
    defaultBadgeText: '🚩 Gudi Padwa Muhurat',
    culturalNote: 'Traditional New Year in Maharashtra, Karnataka, and Andhra Pradesh — top season for new homes.',
    defaultBannerImage: 'https://images.unsplash.com/photo-1609137144822-263626786c75?auto=format&fit=crop&w=2000&q=80',
  },
  independence_day: {
    id: 'independence_day',
    name: 'Independence Day - 15th August',
    hindiName: 'स्वतंत्रता दिवस (15 अगस्त)',
    tagline: 'Tricolor patriotic spirit, national pride & freedom of home ownership',
    dates: 'August 10 - 20',
    season: 'Monsoon',
    iconEmoji: '🇮🇳',
    bannerGradient: 'from-[#7C2D12] via-[#0F172A] to-[#064E3B]',
    bannerBorderColor: 'border-orange-500/50',
    bannerTextColor: 'text-orange-200',
    badgeBg: 'bg-gradient-to-r from-orange-500 via-white to-emerald-600',
    badgeTextColor: 'text-neutral-950 font-black',
    badgeBorder: 'border-orange-400',
    accentGlow: 'rgba(255, 103, 31, 0.45)',
    ambientEffectType: 'tricolor_ribbons',
    primaryColor: '#FF671F',
    secondaryColor: '#046A38',
    defaultBannerGreeting: '🇮🇳 Independence Day Freedom From Rent Festival! Live Your Sovereign Life',
    defaultBannerSubtext: 'Own your own home with only 10% down payment + 0 processing fee on home loans!',
    defaultCtaText: 'Claim Freedom Offer',
    defaultBadgeText: '🇮🇳 Azadi Housing Fest',
    culturalNote: 'Indian Independence Day celebrating self-reliance and the dream of owning a home.',
    defaultBannerImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=2000&q=80',
  },
  raksha_bandhan: {
    id: 'raksha_bandhan',
    name: 'Raksha Bandhan Mahotsav',
    hindiName: 'रक्षाबंधन पर्व',
    tagline: 'Sacred protection thread, peacock feather blues & family security',
    dates: 'August',
    season: 'Monsoon / Shravan',
    iconEmoji: '🪢',
    bannerGradient: 'from-[#0C4A6E] via-[#0369A1] to-[#1E1B4B]',
    bannerBorderColor: 'border-yellow-400/50',
    bannerTextColor: 'text-sky-100',
    badgeBg: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    badgeTextColor: 'text-neutral-950 font-black',
    badgeBorder: 'border-yellow-300',
    accentGlow: 'rgba(14, 165, 233, 0.4)',
    ambientEffectType: 'confetti_stars',
    primaryColor: '#0EA5E9',
    secondaryColor: '#EAB308',
    defaultBannerGreeting: '🪢 Shubh Raksha Bandhan! Gift A Permanent Home & Security To Your Loved Ones',
    defaultBannerSubtext: 'Family Security Special: Complimentary home insurance on all confirmed bookings this month!',
    defaultCtaText: 'Explore Family Homes',
    defaultBadgeText: '🪢 Rakhi Shubh Special',
    culturalNote: 'Auspicious festival celebrating family bonds, security, and gifting a lifelong home.',
    defaultBannerImage: 'https://images.unsplash.com/photo-1601055283742-8b27e81b5553?auto=format&fit=crop&w=2000&q=80',
  },
  navratri_dussehra: {
    id: 'navratri_dussehra',
    name: 'Navratri & Shubh Vijayadashami',
    hindiName: 'नवरात्रि व विजयादशमी महोत्सव',
    tagline: '9 divine nights, Dandiya celebration, victory of good & Griha Pravesh',
    dates: 'September - October',
    season: 'Autumn / Ashwin',
    iconEmoji: '✨',
    bannerGradient: 'from-[#881337] via-[#9F1239] to-[#4C0519]',
    bannerBorderColor: 'border-amber-400/50',
    bannerTextColor: 'text-rose-100',
    badgeBg: 'bg-gradient-to-r from-rose-500 to-amber-500',
    badgeTextColor: 'text-white font-black',
    badgeBorder: 'border-amber-300',
    accentGlow: 'rgba(244, 63, 94, 0.45)',
    ambientEffectType: 'diya_sparkles',
    primaryColor: '#F43F5E',
    secondaryColor: '#F59E0B',
    defaultBannerGreeting: '✨ Shubh Navratri & Dussehra! Auspicious Griha Pravesh Allotments Open',
    defaultBannerSubtext: 'Vijayadashami Vijay Muhurat: Free car parking allotment on select towers + 0 brokerage!',
    defaultCtaText: 'Unlock Navratri Deals',
    defaultBadgeText: '✨ Navratri Vijay Offer',
    culturalNote: 'Nine nights of divine celebration leading to Dussehra — prime property booking season.',
    defaultBannerImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
  },
};

export const INDIAN_HOLIDAY_SCHEDULE: HolidayScheduleItem[] = [
  {
    themeId: 'new_year',
    name: 'New Year Mega Celebration',
    hindiName: 'नव वर्ष 2026 उत्सव',
    emoji: '🎉',
    startMonth: 0,
    startDay: 1,
    endMonth: 0,
    endDay: 15,
    dateRangeLabel: 'Jan 01 - Jan 15',
  },
  {
    themeId: 'republic_day',
    name: 'Republic Day (Gantantra Diwas)',
    hindiName: 'गणतंत्र दिवस',
    emoji: '🇮🇳',
    startMonth: 0,
    startDay: 16,
    endMonth: 0,
    endDay: 31,
    dateRangeLabel: 'Jan 16 - Jan 31',
  },
  {
    themeId: 'holi',
    name: 'Holi Rangotsav',
    hindiName: 'होली रंगोत्सव',
    emoji: '🎨',
    startMonth: 2,
    startDay: 1,
    endMonth: 2,
    endDay: 20,
    dateRangeLabel: 'Mar 01 - Mar 20',
  },
  {
    themeId: 'gudi_padwa',
    name: 'Gudi Padwa & Ugadi',
    hindiName: 'गुढीपाडवा व युगादी',
    emoji: '🚩',
    startMonth: 2,
    startDay: 21,
    endMonth: 3,
    endDay: 15,
    dateRangeLabel: 'Mar 21 - Apr 15',
  },
  {
    themeId: 'independence_day',
    name: 'Independence Day (Swatantrata Diwas)',
    hindiName: 'स्वतंत्रता दिवस (15 अगस्त)',
    emoji: '🇮🇳',
    startMonth: 7,
    startDay: 1,
    endMonth: 7,
    endDay: 18,
    dateRangeLabel: 'Aug 01 - Aug 18',
  },
  {
    themeId: 'raksha_bandhan',
    name: 'Raksha Bandhan Mahotsav',
    hindiName: 'रक्षाबंधन पर्व',
    emoji: '🪢',
    startMonth: 7,
    startDay: 19,
    endMonth: 7,
    endDay: 31,
    dateRangeLabel: 'Aug 19 - Aug 31',
  },
  {
    themeId: 'navratri_dussehra',
    name: 'Navratri & Vijayadashami',
    hindiName: 'नवरात्रि व विजयादशमी',
    emoji: '✨',
    startMonth: 8,
    startDay: 15,
    endMonth: 9,
    endDay: 15,
    dateRangeLabel: 'Sep 15 - Oct 15',
  },
  {
    themeId: 'diwali',
    name: 'Diwali Mahotsav - Festival of Lights',
    hindiName: 'दीपावली महोत्सव',
    emoji: '🪔',
    startMonth: 9,
    startDay: 16,
    endMonth: 10,
    endDay: 30,
    dateRangeLabel: 'Oct 16 - Nov 30',
  },
  {
    themeId: 'christmas',
    name: 'Christmas & Winter Holiday Gala',
    hindiName: 'क्रिसमस पर्व',
    emoji: '🎄',
    startMonth: 11,
    startDay: 15,
    endMonth: 11,
    endDay: 31,
    dateRangeLabel: 'Dec 15 - Dec 31',
  },
];

export const DEFAULT_FESTIVAL_CONFIG: FestivalThemeConfig = {
  isEnabled: true,
  activeThemeId: 'diwali', // Default active theme showcasing rich Indian celebration
  bannerEnabled: true,
  customBannerGreeting: '',
  customBannerSubtext: '',
  customCtaText: '',
  customCtaLink: '/properties',
  ambientEffectsEnabled: false,
  effectIntensity: 'moderate',
  festiveBadgesEnabled: true,
  customBadgeText: '',
  festiveModalGreetingEnabled: false,
  autoScheduleEnabled: false,
  customBannerImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=2000&q=80',
  accentColorOverride: '#F59E0B',
  festiveOverlayOverride: 'diya_sparkles',
  holidayCustomizations: {
    diwali: {
      bannerImageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=2000&q=80',
      accentColor: '#F59E0B',
      festiveOverlay: 'diya_sparkles',
      customGreeting: '🪔 Shubh Deepawali! Festive Real Estate Dhamaka Live',
      customSubtext: '0% Brokerage + Spot Gold Coin on Token + Up to ₹5 Lakhs Builder Discounts!',
      customCtaText: 'View Diwali Deals',
      customBadgeText: '🪔 Diwali Shubh Labh',
    },
    new_year: {
      bannerImageUrl: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=2000&q=80',
      accentColor: '#818CF8',
      festiveOverlay: 'confetti_stars',
      customGreeting: '🎉 Welcome 2026! New Year Property Launch Bonanza Live',
      customSubtext: 'Exclusive 0% Stamp Duty + Assured 1-Year Rental Guarantee on Bookings!',
      customCtaText: 'Explore New Year Offers',
      customBadgeText: '🎉 NY 2026 Offer',
    },
    christmas: {
      bannerImageUrl: 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=2000&q=80',
      accentColor: '#EF4444',
      festiveOverlay: 'snow_crystals',
      customGreeting: '🎄 Merry Christmas & Season Greetings! Holiday Real Estate Gifts',
      customSubtext: 'Santa Gift Box: Free modular kitchen + Home automation vouchers with every booking!',
      customCtaText: 'Discover Holiday Deals',
      customBadgeText: '🎄 Christmas Special',
    },
    republic_day: {
      bannerImageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=2000&q=80',
      accentColor: '#FF671F',
      festiveOverlay: 'tricolor_ribbons',
      customGreeting: '🇮🇳 77th Republic Day Mega Housing Fair! Celebrate Independence of Living',
      customSubtext: 'Celebrate Freedom with Zero EMI for 12 Months on RERA Approved Residences!',
      customCtaText: 'View Republic Offers',
      customBadgeText: '🇮🇳 Tricolor Pride',
    },
    holi: {
      bannerImageUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=2000&q=80',
      accentColor: '#EC4899',
      festiveOverlay: 'holi_colors',
      customGreeting: '🎨 Rang Barse! Auspicious Holi Property Carnival Live',
      customSubtext: 'Add vibrant colors to life with Spot ₹3 Lakhs Cash Cashback on Select Bookings!',
      customCtaText: 'Explore Holi Carnival',
      customBadgeText: '🎨 Holi Dhamaka',
    },
    gudi_padwa: {
      bannerImageUrl: 'https://images.unsplash.com/photo-1609137144822-263626786c75?auto=format&fit=crop&w=2000&q=80',
      accentColor: '#F97316',
      festiveOverlay: 'marigold_petals',
      customGreeting: '🚩 Shubh Gudi Padwa & Ugadi! Auspicious Griha Pravesh Muhurat',
      customSubtext: 'Most Auspicious New Year Muhurat: Gold Coin + 0 Stamp Duty & Registration!',
      customCtaText: 'Unlock Padwa Deals',
      customBadgeText: '🚩 Gudi Padwa Muhurat',
    },
    independence_day: {
      bannerImageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=2000&q=80',
      accentColor: '#FF671F',
      festiveOverlay: 'tricolor_ribbons',
      customGreeting: '🇮🇳 Independence Day Freedom From Rent Festival',
      customSubtext: 'Own your own home with only 10% down payment + 0 processing fee on home loans!',
      customCtaText: 'Claim Freedom Offer',
      customBadgeText: '🇮🇳 Azadi Housing Fest',
    },
    raksha_bandhan: {
      bannerImageUrl: 'https://images.unsplash.com/photo-1601055283742-8b27e81b5553?auto=format&fit=crop&w=2000&q=80',
      accentColor: '#0EA5E9',
      festiveOverlay: 'confetti_stars',
      customGreeting: '🪢 Shubh Raksha Bandhan! Gift A Permanent Home & Security To Your Loved Ones',
      customSubtext: 'Family Security Special: Complimentary home insurance on all confirmed bookings this month!',
      customCtaText: 'Explore Family Homes',
      customBadgeText: '🪢 Rakhi Shubh Special',
    },
    navratri_dussehra: {
      bannerImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
      accentColor: '#F43F5E',
      festiveOverlay: 'diya_sparkles',
      customGreeting: '✨ Shubh Navratri & Dussehra! Auspicious Griha Pravesh Allotments Open',
      customSubtext: 'Vijayadashami Vijay Muhurat: Free car parking allotment on select towers + 0 brokerage!',
      customCtaText: 'Unlock Navratri Deals',
      customBadgeText: '✨ Navratri Vijay Offer',
    },
  },
  updatedAt: new Date().toISOString(),
  updatedBy: 'Admin (Master)',
};

const THEME_STORAGE_KEY = 'prosify_festival_theme_config';
export const THEME_BROADCAST_CHANNEL = 'prosify_festival_theme_channel';

export function getFestivalThemeDefinition(themeId: FestivalThemeId): FestivalThemeDefinition {
  return FESTIVAL_THEMES[themeId] || FESTIVAL_THEMES.default;
}

/**
 * Calculates current festival based on month/date if autoSchedule is enabled
 */
export function getAutoScheduledThemeId(date = new Date()): FestivalThemeId {
  const month = date.getMonth(); // 0-11
  const day = date.getDate();

  for (const item of INDIAN_HOLIDAY_SCHEDULE) {
    if (item.startMonth === item.endMonth) {
      if (month === item.startMonth && day >= item.startDay && day <= item.endDay) {
        return item.themeId;
      }
    } else {
      // Cross-month range
      if (
        (month === item.startMonth && day >= item.startDay) ||
        (month === item.endMonth && day <= item.endDay)
      ) {
        return item.themeId;
      }
    }
  }

  // Fallback to diwali during festival season or default
  if (month >= 8 && month <= 10) {
    return 'diwali';
  }

  return 'diwali';
}

export function loadFestivalThemeConfig(): FestivalThemeConfig {
  if (typeof window === 'undefined') {
    return DEFAULT_FESTIVAL_CONFIG;
  }

  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_FESTIVAL_CONFIG,
        ...parsed,
        holidayCustomizations: {
          ...DEFAULT_FESTIVAL_CONFIG.holidayCustomizations,
          ...(parsed.holidayCustomizations || {}),
        },
      };
    }
  } catch (e) {
    console.error('Error loading festival theme config from localStorage', e);
  }

  return DEFAULT_FESTIVAL_CONFIG;
}

export function saveFestivalThemeConfig(config: FestivalThemeConfig): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));

    // Broadcast change across tabs and windows
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(THEME_BROADCAST_CHANNEL);
      bc.postMessage({ type: 'FESTIVAL_THEME_CHANGED', config });
      bc.close();
    }

    // Trigger local custom event
    window.dispatchEvent(new CustomEvent('prosify_theme_update', { detail: config }));
  } catch (e) {
    console.error('Error saving festival theme config', e);
  }
}
