// Core TypeScript Domain Types for Prosify AI Realty Operating System

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'SALES_MANAGER'
  | 'SALES_AGENT'
  | 'SALES_EXECUTIVE' // backward compatibility alias
  | 'DEVELOPER'
  | 'CHANNEL_PARTNER'
  | 'FRANCHISE'
  | 'VERIFICATION_OFFICER'
  | 'MARKETING_MANAGER'
  | 'FINANCE'
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

export type ListingType = 'BUY' | 'COMMERCIAL' | 'PROJECT';

export type PossessionStatus =
  | 'READY_TO_MOVE'
  | 'UNDER_CONSTRUCTION'
  | 'NEW_LAUNCH';

export type UnitStatus = 'AVAILABLE' | 'HOLD' | 'BOOKED' | 'SOLD' | 'BLOCKED';

export type PartnerStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';

// ProLead Qualification Lifecycle
export type LeadQualification = 'COLD' | 'WARM' | 'QUALIFIED' | 'HOT';

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
  | 'BUY_REQUIREMENT'
  | 'PROPERTY_REQUIREMENT'
  | 'PROMATCH'
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
  | 'LOCALITY_GUIDE'
  | 'LOCAL_SEO'
  | 'OTHER';

export type SiteVisitStatus =
  | 'REQUESTED'
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'RESCHEDULED'
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

// ProVerify™ Lifecycle Status
export type ProVerifyStatus =
  | 'DRAFT'
  | 'DATA_RECEIVED'
  | 'VALIDATION'
  | 'RERA_CHECK'
  | 'DOCUMENT_CHECK'
  | 'HUMAN_VERIFICATION'
  | 'PROVERIFY_PASSED'
  | 'PUBLISHED'
  | 'AVAILABLE'
  | 'LOW_INVENTORY'
  | 'SOLD_OUT'
  | 'ARCHIVED';

// Developer Profile
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

// Inventory Unit (Hierarchy: Developer -> Project -> Tower -> Floor -> Unit)
export interface Unit {
  id: string;
  projectId: string;
  projectName?: string;
  developerId?: string;
  tower: string;
  floor: number;
  unitNumber: string;
  bhk: string;
  configuration?: string; // "2 BHK", "3 BHK", etc.
  carpetArea: number; // in sq ft
  builtUpArea?: number;
  balconyArea?: number;
  price: number; // In INR
  basePrice?: number;
  agreementValue?: number; // In INR
  totalPrice?: number;
  parking?: string;
  facing?: string;
  status: UnitStatus;
  availabilityStatus?: UnitStatus;
  possession?: string;
  possessionDate?: string;
  images?: string[];
  image?: string;
  floorPlanUrl?: string;
  createdAt?: string;
}

export type InventoryUnit = Unit;

// Project with ProVerify™ Integration
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
  images?: string[];
  image?: string;
  bannerImage?: string;
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

  // ProVerify™ Attributes
  verificationStatus?: ProVerifyStatus;
  isProVerifyCertified?: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationNotes?: string;
  reraValidationSummary?: {
    hasMismatches: boolean;
    mismatchesCount: number;
    issues: string[];
    registeredName?: string;
    sanctionedFsi?: number;
    completionDate?: string;
  };
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  listingType: ListingType;
  propertyType: PropertyType;
  type?: string;
  price: number; // in INR
  pricePerSqft: number;
  pricePerSqFt?: number;
  bhk: string;
  carpetArea: number;
  areaSqFt?: number;
  builtUpArea: number;
  floorNumber?: number;
  totalFloors?: number;
  tower?: string;
  unitNumber?: string;
  agreementValue?: number;
  facing?: string;
  furnishingStatus?: 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FULLY_FURNISHED';
  possessionStatus: PossessionStatus;
  possessionDate?: string;
  isVerified: boolean;
  isProVerifyCertified?: boolean;
  verificationStatus?: ProVerifyStatus;
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
  city?: string;
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
  totalBookings?: number;
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

// ProLead™ Enhanced Lead Model
export interface Lead {
  id: string;
  name: string;
  fullName?: string;
  phone: string;
  email: string;
  source: LeadSourceType;
  propertyId?: string;
  propertyTitle?: string;
  projectId?: string;
  projectName?: string;
  developerName?: string;
  city?: string;
  referralCode?: string;
  affiliateId?: string;
  partnerId?: string;
  partnerCode?: string;
  partnerName?: string;
  budget?: string;
  budgetNum?: number;
  bhk?: string;
  propertyType?: string;
  purpose?: string;
  requirement?: string;
  location?: string;
  preferredLocations?: string[];
  status: LeadStatus;
  leadStage?: string;
  notes?: string;
  assignedTo?: string;
  assignedAgent?: string;
  followUpStatus?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;

  // ProLead™ Qualification & Scoring
  leadScore?: number; // 0 - 100
  qualification?: LeadQualification; // COLD, WARM, QUALIFIED, HOT
  scoringBreakdown?: {
    basicForm: number;
    preferences: number;
    brochureDownload: number;
    whatsappEngagement: number;
    siteVisitRequest: number;
    highBudgetInstant: number;
  };
  lastScoringReasons?: string[];
  isHotAlertSent?: boolean;

  // Realatic CRM Synchronization
  realaticLeadId?: string;
  crmSyncStatus?: 'PENDING' | 'SYNCED' | 'FAILED';
  crmLastSyncedAt?: string;

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
  assignedAgent?: string;
  visitDate: string;
  visitTime: string;
  status: SiteVisitStatus;
  pickupRequired?: boolean;
  pickupAddress?: string;
  notes?: string;
  auditTrail?: Array<{ action: string; timestamp: string; by: string; notes?: string }>;
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

// ProVerify™ RERA Records Table
export interface ReraRecord {
  id: string;
  projectId: string;
  projectName: string;
  reraNumber: string;
  registeredName: string;
  promoterName: string;
  projectType?: string;
  totalLandAreaSqMtr?: number;
  validUntil: string;
  status: 'VERIFIED' | 'UNDER_REVIEW' | 'EXPIRED' | 'MISMATCH' | 'REVOKED';
  extractedData: {
    completionDate?: string;
    totalBuildings?: number;
    authorizedSignatory?: string;
    sanctionedFsi?: number;
    litigationsDisclosed?: number;
    quarterlyAuditUpToDate?: boolean;
  };
  mismatches: string[];
  rawResponse?: string;
  lastCheckedAt: string;
}

// Buyer Requirements Model (ProMatch™ saved requirements)
export interface BuyerRequirement {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  email?: string;
  locations: string[];
  budgetMin: number;
  budgetMax: number;
  configuration: string; // "1 BHK", "2 BHK", "3 BHK", "4+ BHK", "Villa"
  purpose: 'END_USE' | 'INVESTMENT' | 'RENTAL';
  possessionPreference: 'IMMEDIATE' | 'UNDER_1_YR' | 'UNDER_2_YRS' | 'ANY';
  status: 'ACTIVE' | 'MATCHED' | 'CONTACTED' | 'ARCHIVED';
  matchedPropertyCount?: number;
  createdAt: string;
}

// Realatic CRM Sync Logs
export interface CrmSyncLog {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  crmProvider: 'REALATIC' | 'OTHER';
  requestPayload: any;
  responsePayload: any;
  statusCode: number;
  errorMessage?: string;
  syncTimestamp: string;
  syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
  idempotencyKey: string;
}

// AI Governance Action Log (ProMatch, ProLead, ProVerify)
export interface AiAgentAction {
  id: string;
  agentName: 'ProMatch' | 'ProLead' | 'ProVerify';
  inputContext: any;
  modelUsed: string;
  outputGenerated: any;
  confidenceScore: number; // 0 - 100
  approvalRequired: boolean;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  actionTaken?: string;
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
  provider: 'META' | 'GOOGLE' | '99ACRES' | 'MAGICBRICKS' | 'HOUSING' | 'CRM' | 'WHATSAPP' | 'DEVELOPER_API';
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

// Grade-A Developer Authenticated Push & Pull API Integration Types
export type GradeADeveloperTier = 'GRADE_A_PLUS' | 'GRADE_A' | 'GRADE_B';

export interface DeveloperApiCredential {
  id: string;
  developerId: string;
  developerName: string;
  tier: GradeADeveloperTier;
  apiKey: string;
  apiSecret: string;
  webhookSecret?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  permissions: {
    canPushProjects: boolean;
    canPushInventoryStatus: boolean;
    canUpdatePricing: boolean;
    canSyncBhkLayouts: boolean;
  };
  outboundApiConfig?: {
    enabled: boolean;
    endpointUrl: string;
    authHeaderKey?: string;
    authHeaderValue?: string;
    format: 'JSON_REST' | 'XML_FEED' | 'SOAP_REST';
    syncFrequency: 'REALTIME' | 'HOURLY' | 'DAILY';
    lastFetchedAt?: string;
    autoRegisterNewProjects: boolean;
  };
  inboundPushEndpoint: string;
  ipWhitelist?: string[];
  rateLimitPerMin: number;
  totalProjectsSynced: number;
  totalUnitsSynced: number;
  lastPushAt?: string;
  lastPushStatus?: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  lastPushMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeveloperPushPayload {
  developerId?: string;
  action: 'SYNC_PROJECT' | 'UPDATE_INVENTORY' | 'FULL_SYNC';
  project?: {
    id?: string;
    name: string;
    reraNumber: string;
    city: string;
    location: string;
    description?: string;
    priceMin?: number;
    priceMax?: number;
    bhkTypes?: string[];
    totalUnits?: number;
    towers?: string[];
    completionDate?: string;
    status?: 'UNDER_CONSTRUCTION' | 'READY_TO_MOVE' | 'NEW_LAUNCH';
    amenities?: string[];
    images?: string[];
    slug?: string;
  };
  projectId?: string;
  projectReraNumber?: string;
  units?: Array<{
    unitNumber: string;
    tower?: string;
    floor?: number;
    bhk?: string;
    area?: number;
    price?: number;
    status: 'AVAILABLE' | 'BLOCKED' | 'BOOKED' | 'SOLD';
    facing?: string;
    furnishing?: string;
    bookingReference?: string;
    customerNotes?: string;
  }>;
}

export interface DeveloperPushResult {
  success: boolean;
  message: string;
  developerName: string;
  action: string;
  synced: {
    projectsCreated: number;
    projectsUpdated: number;
    unitsCreated: number;
    unitsUpdated: number;
    timestamp: string;
  };
  auditLogId?: string;
  projectSummary?: {
    id: string;
    name: string;
    status: string;
  };
  affectedUnits?: Array<{
    unitNumber: string;
    status: string;
    updatedAt: string;
  }>;
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

// ProMatch™ 100% Weighting Engine
export interface MatchingWeights {
  budget: number;                 // Default = 25%
  location: number;               // Default = 20%
  configuration: number;          // Default = 15%
  possession: number;             // Default = 10%
  connectivityAndAmenities: number; // Default = 15%
  proVerifyCertification: number; // Default = 15%
  propertyType?: number;          // optional backward compatibility
  bhk?: number;                   // optional backward compatibility
  area?: number;                  // optional backward compatibility
}

export interface PropertyMatch {
  property: Property;
  project?: Project;
  score: number;
  matchScore: number;
  matchType: 'Perfect Match' | 'Good Match' | 'Potential Match';
  matchingReasons: string[];
  reasons?: string[]; // backward compatibility
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
  category: 'DEAL' | 'COMPLIANCE' | 'LEAD' | 'PAYOUT' | 'SYSTEM' | 'PROVERIFY' | 'CRM' | 'ALERT';
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

// Developer API Integration Types
export type DeveloperApiType = 'REST_PULL' | 'WEBHOOK_PUSH' | 'XML_FEED' | 'JSON_REST';

export interface DeveloperApiConnection {
  id: string;
  developerId?: string;
  developerName: string;
  tier?: GradeADeveloperTier;
  apiType: DeveloperApiType | string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DISCONNECTED' | string;
  endpointUrl?: string;
  authToken?: string;
  inboundApiKey?: string;
  inboundWebhookUrl?: string;
  ipWhitelist?: string[];
  syncFrequency?: 'REALTIME' | 'HOURLY' | 'DAILY';
  autoApproveInventory?: boolean;
  totalProjectsSynced: number;
  totalUnitsSynced: number;
  lastSyncedAt?: string;
  lastSyncStatus?: 'SUCCESS' | 'FAILED' | 'PARTIAL' | 'PENDING' | string;
  lastSyncMessage?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface DeveloperProjectSyncItem {
  id?: string;
  name: string;
  city: string;
  location?: string;
  developerName?: string;
  reraNumber?: string;
  priceMin?: number;
  priceMax?: number;
  bhkTypes?: string[];
  totalUnits?: number;
  status?: string;
  units?: any[];
  [key: string]: any;
}

// ==========================================
// AFFILIATE PROGRAM MODELS
// ==========================================

export type AffiliateTier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';

export interface AffiliateUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  affiliateCode?: string;
  agencyName?: string;
  city?: string;
  customSlug?: string;
  tier: AffiliateTier;
  commissionRatePercent: number;
  fixedBonusPerVisit?: number;
  totalClicks: number;
  totalLeads: number;
  totalSiteVisits: number;
  totalBookings?: number;
  totalEarned: number;
  totalEarnings?: number;
  unpaidEarnings?: number;
  totalDealsClosed?: number;
  payableBalance: number;
  paidAmount: number;
  status: 'active' | 'pending' | 'suspended' | 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  joinedAt: string;
  payoutDetails: {
    payoutType?: 'UPI' | 'BANK_TRANSFER' | string;
    upiId?: string;
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
  };
  upiId?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  panCard?: string;
  reraNumber?: string;
  websiteOrSocial?: string;
  [key: string]: any;
}

export type ConversionStage =
  | 'LEAD_REGISTERED'
  | 'SITE_VISIT'
  | 'TOKEN_BOOKED'
  | 'DEED_REGISTRATION'
  | 'COMMISSION_APPROVED'
  | 'SITE_VISIT_DONE'
  | 'LEAD_CAPTURED';

export interface AffiliateConversion {
  id: string;
  affiliateId: string;
  affiliateName: string;
  referralCode: string;
  affiliateCode?: string;
  buyerName: string;
  buyerPhone?: string;
  propertyTitle: string;
  projectTitle?: string;
  city?: string;
  dealValue: number;
  commissionPercent?: number;
  commissionAmount: number;
  stage: ConversionStage;
  status?: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED' | 'COMMISSION_APPROVED' | string;
  createdAt: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface AffiliatePayoutRecord {
  id: string;
  affiliateId: string;
  affiliateName: string;
  affiliateCode?: string;
  amount: number;
  tdsAmount?: number;
  netAmount?: number;
  payoutMethod: 'UPI' | 'NEFT_RTGS' | 'CHEQUE' | string;
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'APPROVED';
  recipientDetails?: string;
  payoutDetails?: string;
  transactionRef?: string;
  utrRef?: string;
  requestedAt?: string;
  requestDate?: string;
  processedAt?: string;
  processedDate?: string;
  notes?: string;
  [key: string]: any;
}

export type AffiliatePayoutRequest = AffiliatePayoutRecord;

export interface AffiliateSettings {
  defaultCommissionPercent?: number;
  defaultCommissionRate?: number;
  isEnabled?: boolean;
  leadRewardAmount?: number;
  minimumPayoutThreshold?: number;
  cookieDurationDays?: number;
  minimumPayoutAmount?: number;
  autoApproveAffiliates?: boolean;
  allowCustomSlugs?: boolean;
  leadBonusAmount?: number;
  siteVisitBonusAmount?: number;
  payoutCycle?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | string;
  reraComplianceMandatory?: boolean;
  termsAndConditions?: string;
  termsMarkdown?: string;
  tdsDeductionPercent?: number;
  [key: string]: any;
}

export type AffiliateProgramSettings = AffiliateSettings;

export interface AffiliateCreative {
  id: string;
  title: string;
  type: 'BANNER' | 'WHATSAPP_TEMPLATE' | 'EMAIL_SWIPE' | 'SOCIAL_POST' | string;
  aspectRatio?: string;
  dimensions?: string;
  size?: string;
  imageUrl?: string;
  suggestedCopy?: string;
  copyText?: string;
  headline?: string;
  category?: string;
  targetCategory?: string;
  [key: string]: any;
}

