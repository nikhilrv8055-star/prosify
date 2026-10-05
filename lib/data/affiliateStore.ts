import {
  AffiliateUser,
  AffiliateConversion,
  AffiliatePayoutRecord,
  AffiliateSettings,
  AffiliateCreative,
} from '@/lib/types';

export const INITIAL_AFFILIATE_SETTINGS: AffiliateSettings = {
  defaultCommissionPercent: 2.0,
  cookieDurationDays: 60,
  minimumPayoutAmount: 5000,
  autoApproveAffiliates: true,
  allowCustomSlugs: true,
  leadBonusAmount: 250,
  siteVisitBonusAmount: 1500,
  payoutCycle: 'WEEKLY',
  reraComplianceMandatory: false,
  termsAndConditions:
    'Affiliates earn up to 3.0% commission on registered property bookings and ₹1,500 on verified buyer site visits. Commissions are credited upon developer token verification or deed registration under MahaRERA guidelines. Payouts processed every Tuesday via UPI or NEFT.',
};

export const INITIAL_AFFILIATE_MEMBERS: AffiliateUser[] = [];

export const INITIAL_AFFILIATE_CONVERSIONS: AffiliateConversion[] = [];

export const INITIAL_AFFILIATE_PAYOUTS: AffiliatePayoutRecord[] = [];

export const INITIAL_AFFILIATE_CREATIVES: AffiliateCreative[] = [
  {
    id: 'crt-1',
    title: 'Pan-India High Yield Residential Investment Banner (9 Metros)',
    type: 'BANNER',
    aspectRatio: '16:9',
    dimensions: '1200x630 (Social Banner)',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
    headline: 'Buy 100% RERA Verified 2 & 3 BHK Homes with Direct Developer Pricing',
    copyText:
      'Looking for your dream home or high-yield investment across Mumbai, Pune, Bangalore, Hyderabad, Chennai, Delhi NCR, or Ahmedabad? Explore 100% RERA-certified projects with exclusive festive payment schemes (Pay 10% Now, Rest on Possession). Visit via my verified link: {LINK}',
    targetCategory: 'Luxury & High-Rise Apartments',
  },
  {
    id: 'crt-2',
    title: 'Instant WhatsApp Buyer Lead Broadcast (Pan-India)',
    type: 'WHATSAPP_TEMPLATE',
    headline: 'Direct Developer Inventory Access Alert across 9 Metros',
    copyText:
      'Namaste! Are you planning to buy a 2 BHK, 3 BHK, or luxury villa in Mumbai, Pune, Bangalore, Hyderabad, Chennai, Delhi, Noida, Gurugram, or Ahmedabad? 🏡✨\n\nCheck out the curated list of verified pre-launch and ready-to-move projects with direct developer discounts through Prosify Real Estate:\n\n👉 Browse verified homes: {LINK}\n\n✓ Zero brokerage on new launches\n✓ Certified RERA compliance reports\n✓ Instant free site visit cab booking across all 9 cities',
    targetCategory: 'WhatsApp Family & Investor Groups',
  },
  {
    id: 'crt-3',
    title: 'Bangalore & Hyderabad Tech Corridor High-Yield Portfolio',
    type: 'SOCIAL_POST',
    headline: 'Why Tech Corridors (ORR, Whitefield, HITEC City) are Yielding 14% Annual Returns',
    copyText:
      'Real estate in India’s leading IT hubs—Bangalore, Hyderabad, and Pune—continues to outperform equities in stability and appreciation. For tech professionals and high-net-worth investors looking to deploy capital in top developers like Sobha, My Home, Godrej, and Prestige — verify the units directly on Prosify.\n\nExplore curated investment inventory: {LINK}\n\n#RealEstateIndia #BangaloreHomes #HyderabadProperties #PropertyInvestment #Prosify',
    targetCategory: 'Professional & Tech Investors',
  },
  {
    id: 'crt-4',
    title: 'Delhi NCR, Gurugram & Noida Express Luxury Property Broadcast',
    type: 'SOCIAL_POST',
    headline: 'Ultra-Luxury Living & Golf Course Residences in Gurugram and Noida',
    copyText:
      'Explore handpicked luxury residences, sky mansions, and expressway townships in Gurugram Golf Course Road, Dwarka Expressway, and Noida Sector 150. Direct developer pricing with zero brokerage.\n\nCheck live inventory: {LINK}\n\n#GurugramRealEstate #NoidaHomes #DelhiNCR #Prosify',
    targetCategory: 'Luxury Home Buyers',
  },
  {
    id: 'crt-5',
    title: 'Email Newsletter Swipe for Property Buyers (Pan-India)',
    type: 'EMAIL_SWIPE',
    headline: 'Exclusive Weekend Site Visit Invites: Top 9 Metro Projects',
    copyText:
      'Subject: Exclusive Preview: Top 9 Metro High-Yield Properties (Direct Developer Rate)\n\nHi {First_Name},\n\nIf you have been waiting for the right moment to lock in a new apartment in Mumbai, Pune, Bangalore, Hyderabad, Chennai, Delhi, Noida, Gurugram, or Ahmedabad, this special unlocks verified units with zero price inflation.\n\nTake a look at available units and schedule a free VIP site visit:\n{LINK}\n\nBest regards,\n{Affiliate_Name}',
    targetCategory: 'Email Subscribers',
  },
];
