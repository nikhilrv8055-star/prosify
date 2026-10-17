import {
  INITIAL_AFFILIATES,
  INITIAL_AFFILIATE_PAYOUTS,
  INITIAL_AFFILIATE_SETTINGS,
  INITIAL_AFFILIATE_CREATIVES as MOCK_CREATIVES,
} from './mockData';

export { INITIAL_AFFILIATE_PAYOUTS, INITIAL_AFFILIATE_SETTINGS };
export const INITIAL_AFFILIATE_MEMBERS = INITIAL_AFFILIATES;
export const INITIAL_AFFILIATES_LIST = INITIAL_AFFILIATES;

export interface AffiliateMarketingAsset {
  id: string;
  title: string;
  type: 'BANNER' | 'WHATSAPP_TEMPLATE' | 'SOCIAL_POST' | 'EMAIL_SWIPE';
  aspectRatio?: string;
  dimensions?: string;
  imageUrl?: string;
  headline: string;
  copyText: string;
  targetCategory: string;
}

export const AFFILIATE_CREATIVES: AffiliateMarketingAsset[] = [
  {
    id: 'crt-1',
    title: 'Maharashtra Metro Cities High Yield Residential Investment Banner',
    type: 'BANNER',
    aspectRatio: '16:9',
    dimensions: '1200x630 (Social Banner)',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
    headline: 'Buy 100% MahaRERA Verified 2 & 3 BHK Homes with Direct Developer Pricing',
    copyText:
      'Looking for your dream home or high-yield investment across Mumbai, Pune, Nagpur, Nashik, Thane, Navi Mumbai, or Chhatrapati Sambhajinagar? Explore 100% MahaRERA-certified projects with exclusive festive payment schemes (Pay 10% Now, Rest on Possession). Visit via my verified link: {LINK}',
    targetCategory: 'Luxury & High-Rise Apartments',
  },
  {
    id: 'crt-2',
    title: 'Instant WhatsApp Buyer Lead Broadcast (Maharashtra Metros)',
    type: 'WHATSAPP_TEMPLATE',
    headline: 'Direct Developer Inventory Access Alert across Maharashtra Metro Cities',
    copyText:
      'Namaste! Are you planning to buy a 2 BHK, 3 BHK, or luxury villa in Mumbai, Pune, Nagpur, Nashik, Thane, Navi Mumbai, or Chhatrapati Sambhajinagar? 🏡✨\n\nCheck out the curated list of verified pre-launch and ready-to-move projects with direct developer discounts through Prosify Real Estate:\n\n👉 Browse verified homes: {LINK}\n\n✓ Zero brokerage on new launches\n✓ Certified MahaRERA compliance reports\n✓ Instant free site visit cab booking across Maharashtra metro hubs',
    targetCategory: 'WhatsApp Family & Investor Groups',
  },
  {
    id: 'crt-3',
    title: 'Pune & Mumbai MMR Tech Corridor High-Yield Portfolio',
    type: 'SOCIAL_POST',
    headline: 'Why Maharashtra IT & Coastal Corridors (Hinjawadi, Kharadi, BKC, Seawoods) are Yielding Peak Returns',
    copyText:
      'Real estate in Maharashtra’s economic powerhouses—Mumbai MMR, Pune, and Nagpur—continues to outperform equities in stability and appreciation. For corporate leaders and high-net-worth investors looking to deploy capital in top developers like Godrej, Lodha, Raymond, and Kolte-Patil — verify the units directly on Prosify.\n\nExplore curated Maharashtra investment inventory: {LINK}\n\n#MaharashtraRealEstate #MumbaiHomes #PuneProperties #MahaRERA #Prosify',
    targetCategory: 'Professional & Tech Investors',
  },
  {
    id: 'crt-4',
    title: 'Nagpur & Nashik Expressway Luxury Corridor Broadcast',
    type: 'SOCIAL_POST',
    headline: 'Ultra-Luxury Living & Samruddhi Mahamarg Residences in Nagpur and Nashik',
    copyText:
      'Explore handpicked luxury residences, sky mansions, and expressway townships in Nagpur MIHAN, Wardha Road, and Nashik Gangapur Road. Direct developer pricing with zero brokerage and 100% MahaRERA verification.\n\nCheck live inventory: {LINK}\n\n#NagpurRealEstate #NashikHomes #SamruddhiMahamarg #Prosify',
    targetCategory: 'Luxury Home Buyers',
  },
  {
    id: 'crt-5',
    title: 'Email Newsletter Swipe for Property Buyers (Maharashtra Metros)',
    type: 'EMAIL_SWIPE',
    headline: 'Exclusive Weekend Site Visit Invites: Maharashtra Metro Projects',
    copyText:
      'Subject: Exclusive Preview: Maharashtra Top Metro High-Yield Properties (Direct Developer Rate)\n\nHi {First_Name},\n\nIf you have been waiting for the right moment to lock in a new apartment in Mumbai, Pune, Nagpur, Nashik, Thane, Navi Mumbai, or Chhatrapati Sambhajinagar, this special unlocks verified units with zero price inflation.\n\nTake a look at available units and schedule a free VIP site visit:\n{LINK}\n\nBest regards,\n{Affiliate_Name}',
    targetCategory: 'Email Subscribers',
  },
];

export const INITIAL_AFFILIATE_CREATIVES = MOCK_CREATIVES;
