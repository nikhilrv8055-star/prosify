export type ListingType = 'BUY' | 'COMMERCIAL';

export type PropertyType =
  | 'APARTMENT'
  | 'VILLA'
  | 'PENTHOUSE'
  | 'PLOT'
  | 'COMMERCIAL_OFFICE'
  | 'RETAIL_SHOP';

export type PossessionStatus =
  | 'READY_TO_MOVE'
  | 'UNDER_CONSTRUCTION'
  | 'NEW_LAUNCH';

export type LeadSourceType =
  | 'WEBSITE_FORM'
  | 'WHATSAPP'
  | 'DIRECT_CALL'
  | 'WALK_IN'
  | 'CHANNEL_PARTNER'
  | 'SITE_VISIT'
  | 'BUY_REQUIREMENT';

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'SITE_VISIT_SCHEDULED'
  | 'OFFER_MADE'
  | 'BOOKED'
  | 'LOST';

export interface Lead {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  propertyId?: string;
  propertyTitle?: string;
  budget?: string | number;
  location?: string;
  requirement?: string;
  propertyType?: string;
  bhk?: string;
  purpose?: string;
  source: LeadSourceType;
  partnerId?: string;
  partnerName?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
}

export interface SiteVisit {
  id: string;
  propertyId: string;
  propertyTitle: string;
  leadName: string;
  leadMobile: string;
  leadEmail?: string;
  date: string;
  timeSlot: string;
  cabRequired: boolean;
  pickupAddress?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  developerId: string;
  developerName: string;
  listingType: ListingType;
  propertyType: PropertyType;
  possessionStatus: PossessionStatus;
  possessionDate: string;
  price: number;
  priceUnit: 'CR' | 'LAKH';
  priceDisplay: string;
  carpetAreaSqFt: number;
  bhk: string;
  bathrooms: number;
  balconies: number;
  floor: number;
  totalFloors: number;
  facing: string;
  address: string;
  locality: string;
  city: 'Mumbai' | 'Thane' | 'Navi Mumbai' | 'Pune';
  pinCode: string;
  reraNumber: string;
  featured: boolean;
  verified: boolean;
  images: string[];
  amenities: string[];
  description: string;
  directDeveloperDiscountPct?: number;
  pricePerSqFt: number;
  maintenanceMonthly?: number;
}

export interface Developer {
  id: string;
  name: string;
  slug: string;
  logo: string;
  establishedYear: number;
  totalProjects: number;
  completedSqFtMillion: number;
  cities: string[];
  description: string;
  reraRegistrationNumber: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  developerId: string;
  developerName: string;
  city: string;
  locality: string;
  reraNumber: string;
  priceRange: string;
  possessionYear: string;
  totalUnits: number;
  images: string[];
  highlights: string[];
  status: 'NEW_LAUNCH' | 'UNDER_CONSTRUCTION' | 'READY_TO_MOVE';
}

export interface ChannelPartner {
  id: string;
  name: string;
  agencyName: string;
  reraNumber: string;
  mobile: string;
  email: string;
  commissionSlab: string;
  totalLeads: number;
  totalBookings: number;
  active: boolean;
}
