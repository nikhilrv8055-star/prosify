// Core TypeScript Domain Types for Prosify Real Estate Marketplace

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'SALES_MANAGER'
  | 'SALES_EXECUTIVE'
  | 'DEVELOPER'
  | 'CHANNEL_PARTNER'
  | 'CUSTOMER';

export type PropertyType =
  | 'APARTMENT'
  | 'VILLA'
  | 'PLOT'
  | 'PENTHOUSE'
  | 'OFFICE'
  | 'SHOP'
  | 'COMMERCIAL'
  | 'WAREHOUSE';

export type ListingType = 'BUY' | 'RENT' | 'COMMERCIAL' | 'PROJECT';

export type PossessionStatus =
  | 'READY_TO_MOVE'
  | 'UNDER_CONSTRUCTION'
  | 'NEW_LAUNCH';

export type UnitStatus = 'AVAILABLE' | 'HOLD' | 'BOOKED' | 'SOLD' | 'BLOCKED';

export type PartnerStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'SITE_VISIT'
  | 'SITE_VISIT_SCHEDULED'
  | 'VISITED'
  | 'NEGOTIATION'
  | 'BOOKED'
  | 'LOST'
  | 'CLOSED';

export type LeadSourceType =
  | 'WEBSITE'
  | 'DIRECT_WEBSITE'
  | 'CHANNEL_PARTNER'
  | 'FACEBOOK'
  | 'META_ADS'
  | 'GOOGLE'
  | 'GOOGLE_ADS'
  | 'NINETY_NINE_ACRES'
  | 'MAGICBRICKS'
  | 'HOUSING'
  | 'PROPERTY_PORTAL'
  | 'SYNDICATION'
  | 'WALK_IN'
  | 'REFERRAL'
  | 'API'
  | 'MANUAL'
  | 'WHATSAPP'
  | 'OTHER';

export type SiteVisitStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type CommissionStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'PROCESSING'
  | 'PAID'
  | 'CANCELLED';

export type SyncSourceType = 'API' | 'CSV_UPLOAD' | 'EXCEL' | 'WEBHOOK' | 'XML_FEED' | 'SFTP' | 'MANUAL';
export type SyncStatus = 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'RUNNING' | 'IDLE' | 'RETRYING';

export interface Developer {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  about: string;
  description?: string;
  establishedYr: number;
  experienceYears?: number;
  website: string;
  contactEmail: string;
  contactPhone: string;
  isVerified: boolean;
  totalProjects: number;
  completedProjects: number;
  totalProjectsDelivered?: number;
  ongoingProjects: number;
  upcomingProjects: number;
  headquarters: string;
}

export interface FloorPlan {
  id: string;
  projectId: string;
  title: string;
  bhk: string;
  type?: string;
  carpetArea: number; // sq ft
  price: number; // in INR
  startingPrice?: string | number;
  imageUrl: string;
  image?: string;
}

export interface Unit {
  id: string;
  projectId: string;
  tower: string;
  floor: number;
  unitNumber: string;
  bhk: string;
  configuration?: string;
  carpetArea: number;
  builtUpArea?: number;
  balconyArea?: number;
  price: number; // In INR
  basePrice?: number;
  totalPrice?: number;
  parking?: string;
  facing?: string;
  status: UnitStatus;
  possession?: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  developerId: string;
  developerName: string;
  developerLogo?: string;
  city: string;
  district?: string;
  locality: string;
  address?: string;
  startingPrice?: number; // In INR
  priceRange?: string;
  configurations?: string; // "1, 2 & 3 BHK"
  totalUnits: number;
  availableUnits?: number;
  possessionDate: string;
  constructionStatus: PossessionStatus;
  status?: PossessionStatus;
  reraNumber: string;
  description: string;
  coverImage?: string;
  gallery?: string[];
  galleryImages?: string[];
  amenities: string[];
  locationHighlights?: string[];
  floorPlans?: FloorPlan[];
  towers?: string[];
  bhkTypes?: string[];
  totalLandAreaAcres?: number;
  masterBrochureUrl?: string;
  totalTowers?: number;
  launchYear?: number;
  minPrice?: number;
  maxPrice?: number;
  featuredImage?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number; // in INR (e.g. 12500000 = 1.25 Cr)
  pricePerSqft: number;
  bhk: string;
  carpetArea: number;
  builtUpArea: number;
  floorNumber?: number;
  totalFloors?: number;
  facing?: string;
  furnishingStatus?: 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FULLY_FURNISHED';
  possessionStatus: PossessionStatus;
  possessionDate?: string;
  isVerified: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  reraNumber?: string;
  city: string;
  locality: string;
  address: string;
  developerId?: string;
  developerName?: string;
  projectId?: string;
  projectName?: string;
  coverImage: string;
  images: string[];
  amenities: string[];
  description: string;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  parkingSpaces?: number;
  pincode?: string;
  createdAt: string;
}

export interface ChannelPartner {
  id: string;
  code: string; // e.g. "CP102"
  companyName: string;
  partnerName: string;
  name?: string;
  email: string;
  phone: string;
  address: string;
  gstNumber?: string;
  panNumber: string;
  reraNumber?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  partnerCode?: string;
  reraRegistrationNumber?: string;
  tier?: string;
  commissionRate?: number;
  successfulBookings?: number;
  totalLeadsSubmitted?: number;
  status: PartnerStatus;
  clicksCount: number;
  clicks?: number;
  leadsCount: number;
  leadsGenerated?: number;
  siteVisitsCount: number;
  bookingsCount: number;
  totalCommissionEarned: number;
  commissionEarned?: number;
  totalCommissionPaid: number;
  commissionPaid?: number;
  pendingCommission: number;
  commissionPending?: number;
  commissionTier?: string;
  createdAt: string;
}

export interface TrackingLink {
  id: string;
  partnerId: string;
  partnerCode: string;
  code: string;
  targetUrl: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  clicks: number;
  leads?: number;
  leadsCount?: number;
  conversions?: number;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSourceType;
  propertyId?: string;
  propertyTitle?: string;
  projectId?: string;
  projectName?: string;
  developerName?: string;
  partnerId?: string;
  partnerCode?: string;
  partnerName?: string;
  budget: string;
  bhk?: string;
  requirement?: string;
  location?: string;
  status: LeadStatus;
  notes?: string;
  assignedTo?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteVisit {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  propertyId?: string;
  propertyTitle?: string;
  projectId?: string;
  projectName?: string;
  partnerId?: string;
  partnerCode?: string;
  salesExecutive: string;
  visitDate: string;
  visitTime: string;
  status: SiteVisitStatus;
  pickupRequired?: boolean;
  pickupAddress?: string;
  notes?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  leadId: string;
  customerName: string;
  customerPhone: string;
  projectId?: string;
  projectName?: string;
  propertyId?: string;
  propertyTitle?: string;
  unitNumber: string;
  partnerId?: string;
  partnerCode?: string;
  partnerName?: string;
  bookingDate: string;
  bookingAmount: number;
  totalAgreementValue: number;
  commissionAmt: number;
  commissionStatus: CommissionStatus;
  status: 'CONFIRMED' | 'HOLD' | 'CANCELLED';
}

export interface Commission {
  id: string;
  partnerId: string;
  partnerCode: string;
  partnerName: string;
  bookingId: string;
  projectName?: string;
  propertyTitle?: string;
  unitNumber?: string;
  agreementValue?: number;
  amount: number;
  ratePercent: number;
  tdsDeducted?: number;
  netPayable?: number;
  status: CommissionStatus;
  utrNumber?: string;
  approvedAt?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
}

export interface DeveloperSyncSource {
  id: string;
  developerId: string;
  developerName: string;
  sourceType: SyncSourceType;
  apiUrl?: string;
  authType?: 'API_KEY' | 'BEARER_TOKEN' | 'BASIC_AUTH' | 'OAUTH2' | 'MUTUAL_TLS' | 'NONE';
  feedFormat?: 'JSON_REST' | 'XML_FEED' | 'CSV_REMOTE' | 'SFTP';
  apiKeyMasked?: string;
  authTokenMasked?: string;
  webhookSecret?: string;
  autoSyncEnabled?: boolean;
  syncFrequency: 'REALTIME' | 'HOURLY' | 'DAILY' | 'MANUAL';
  lastSyncAt?: string;
  status: SyncStatus;
  retryPolicy?: {
    maxRetries: number;
    backoffSeconds: number;
  };
  unitsMappedCount?: number;
  lastErrorMessage?: string;
}

export interface SyncJob {
  id: string;
  sourceId: string;
  developerName: string;
  sourceType?: SyncSourceType;
  recordsReceived: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsFailed: number;
  recordsSkipped?: number;
  status: SyncStatus;
  durationMs: number;
  timestamp: string;
  errorLog?: string;
  errorMessage?: string;
  statusCode?: number;
  retryCount?: number;
  maxRetries?: number;
  retryStatus?: 'PENDING' | 'RETRIED' | 'EXHAUSTED' | 'NONE';
  nextRetryAt?: string;
  logPayload?: string;
}

export interface IntegrationAdapter {
  id: string;
  provider: 'META' | 'GOOGLE' | '99ACRES' | 'MAGICBRICKS' | 'HOUSING' | 'CRM' | 'WHATSAPP';
  displayName: string;
  description: string;
  isConnected: boolean;
  statusText: string;
  webhookUrl?: string;
  lastSyncAt?: string;
  leadsReceived: number;
  requiresOfficialCredentials: boolean;
  officialDocsUrl?: string;
  authFields?: Array<{
    key: string;
    label: string;
    placeholder: string;
    isSecret: boolean;
    helpText?: string;
  }>;
  officialCredentials?: Record<string, string>;
  rateLimitPerMin?: number;
  lastTestStatus?: 'SUCCESS' | 'FAILED' | 'PENDING';
  lastTestLatencyMs?: number;
  lastTestMessage?: string;
}

export interface ImportFieldMapping {
  sourceColumn: string;
  targetField: string;
  confidence: number;
  isRequired?: boolean;
}

export interface ImportValidationIssue {
  row: number;
  unitNumber?: string;
  type: 'ERROR' | 'WARNING' | 'DUPLICATE';
  field?: string;
  message: string;
  existingData?: any;
  incomingData?: any;
}

export interface ImportValidationError {
  row: number;
  field: string;
  error: string;
  rawValue?: string;
}

export interface ImportDuplicateRow {
  unitNumber: string;
  tower: string;
  existingPrice: number;
  newPrice: number;
  existingStatus: string;
  newStatus: string;
}

export interface ImportValidationReport {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicatesFound: number;
  detectedMappings: ImportFieldMapping[];
  errors: ImportValidationError[];
  duplicateRows: ImportDuplicateRow[];
  previewRows: any[];
  duplicatesCount?: number;
  errorsCount?: number;
  warningsCount?: number;
  issues?: ImportValidationIssue[];
  sampleParsedRows?: any[];
}

export interface MatchingWeights {
  budget: number;      // e.g. 35
  location: number;    // e.g. 25
  propertyType: number;// e.g. 15
  bhk: number;         // e.g. 10
  area: number;        // e.g. 10
  possession: number;  // e.g. 5
}

export interface PropertyMatch {
  property: Property;
  score: number;
  matchScore?: number;
  matchType: 'Perfect Match' | 'Good Match' | 'Potential Match';
  reasons?: string[];
}

export interface AuditLogItem {
  id: string;
  user: string;
  action: string;
  entity: string;
  entityId?: string;
  source?: string;
  status?: string;
  details?: string;
  ip: string;
  timestamp: string;
  metadata?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  category: 'DEAL' | 'COMPLIANCE' | 'LEAD' | 'PAYOUT' | 'SYSTEM';
  severity: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, any> | string;
  ip?: string;
  timestamp: string;
}

