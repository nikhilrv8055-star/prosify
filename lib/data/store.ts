import {
  Developer,
  Project,
  Property,
  ChannelPartner,
  Lead,
  SiteVisit,
  Booking,
  Commission,
  DeveloperSyncSource,
  SyncJob,
  IntegrationAdapter,
  AuditLogItem,
  Unit,
  TrackingLink,
  MatchingWeights,
  UnitStatus,
  LeadStatus,
  LeadQualification,
  PartnerStatus,
  CommissionStatus,
  SiteVisitStatus,
  AdminNotification,
  ReraRecord,
  BuyerRequirement,
  CrmSyncLog,
  AiAgentAction,
  ProVerifyStatus,
  DeveloperApiConnection,
  DeveloperProjectSyncItem,
  DeveloperApiType,
  AffiliateUser,
  AffiliateConversion,
  AffiliatePayoutRequest,
  AffiliateCreative,
  AffiliateProgramSettings,
} from '@/lib/types';
import {
  INITIAL_DEVELOPERS,
  INITIAL_PROJECTS,
  INITIAL_PROPERTIES,
  INITIAL_CHANNEL_PARTNERS,
  INITIAL_LEADS,
  INITIAL_SITE_VISITS,
  INITIAL_BOOKINGS,
  INITIAL_COMMISSIONS,
  INITIAL_SYNC_SOURCES,
  INITIAL_SYNC_JOBS,
  INITIAL_INTEGRATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_UNITS,
  INITIAL_TRACKING_LINKS,
  INITIAL_RERA_RECORDS,
  INITIAL_BUYER_REQUIREMENTS,
  INITIAL_CRM_SYNC_LOGS,
  INITIAL_AI_AGENT_ACTIONS,
  INITIAL_AFFILIATES,
  INITIAL_AFFILIATE_CONVERSIONS,
  INITIAL_AFFILIATE_PAYOUTS,
  INITIAL_AFFILIATE_CREATIVES,
  INITIAL_AFFILIATE_SETTINGS,
} from './mockData';

// Global singleton in-memory state that persists during dev/eval runtime
class RealEstateStore {
  private developers: Developer[] = [...INITIAL_DEVELOPERS];
  private projects: Project[] = [...INITIAL_PROJECTS];
  private properties: Property[] = [...INITIAL_PROPERTIES];
  private units: Unit[] = [...INITIAL_UNITS];
  private partners: ChannelPartner[] = [...INITIAL_CHANNEL_PARTNERS];
  private leads: Lead[] = [...INITIAL_LEADS];
  private siteVisits: SiteVisit[] = [...INITIAL_SITE_VISITS];
  private bookings: Booking[] = [...INITIAL_BOOKINGS];
  private commissions: Commission[] = [...INITIAL_COMMISSIONS];
  private syncSources: DeveloperSyncSource[] = [...INITIAL_SYNC_SOURCES];
  private syncJobs: SyncJob[] = [...INITIAL_SYNC_JOBS];
  private integrations: IntegrationAdapter[] = [...INITIAL_INTEGRATIONS];
  private trackingLinks: TrackingLink[] = [...INITIAL_TRACKING_LINKS];
  private auditLogs: AuditLogItem[] = [...INITIAL_AUDIT_LOGS];
  private affiliates: AffiliateUser[] = [...INITIAL_AFFILIATES];
  private affiliateConversions: AffiliateConversion[] = [...INITIAL_AFFILIATE_CONVERSIONS];
  private affiliatePayouts: AffiliatePayoutRequest[] = [...INITIAL_AFFILIATE_PAYOUTS];
  private affiliateCreatives: AffiliateCreative[] = [...INITIAL_AFFILIATE_CREATIVES];
  private affiliateSettings: AffiliateProgramSettings = { ...INITIAL_AFFILIATE_SETTINGS };
  private developerApiConnections: DeveloperApiConnection[] = [
    {
      id: 'dac-1',
      developerId: 'dev-1',
      developerName: 'Godrej Properties Ltd',
      apiType: 'INBOUND_PUSH',
      inboundApiKey: 'eni_dev_live_godrej_98f24a1b80c3',
      webhookSecret: 'sec_wh_godrej_erp_91a0',
      syncFrequency: 'REALTIME',
      status: 'ACTIVE',
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      lastSyncStatus: 'SUCCESS',
      lastSyncMessage: 'Auto-synced 3 projects and 48 inventory units via ERP webhook',
      totalProjectsSynced: 6,
      totalUnitsSynced: 120,
      autoApproveNewProjects: true,
      createdAt: '2026-08-15T10:00:00.000Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'dac-2',
      developerId: 'dev-2',
      developerName: 'Lodha Group (Macrotech)',
      apiType: 'INBOUND_PUSH',
      inboundApiKey: 'eni_dev_live_lodha_77d12c8a994e',
      webhookSecret: 'sec_wh_lodha_feed_12b8',
      syncFrequency: 'REALTIME',
      status: 'ACTIVE',
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
      lastSyncStatus: 'SUCCESS',
      lastSyncMessage: 'Inventory live price matrix and tower availability updated',
      totalProjectsSynced: 5,
      totalUnitsSynced: 95,
      autoApproveNewProjects: true,
      createdAt: '2026-08-20T11:30:00.000Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'dac-3',
      developerId: 'dev-3',
      developerName: 'Kalpataru Group',
      apiType: 'OUTBOUND_PULL',
      pullEndpointUrl: 'https://api.kalpataru.com/v2/inventory/feed.json',
      authType: 'BEARER',
      authToken: 'kalpataru_oauth_token_7190',
      inboundApiKey: 'eni_dev_live_kalpataru_54a83e01cd82',
      syncFrequency: 'HOURLY',
      status: 'ACTIVE',
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      lastSyncStatus: 'SUCCESS',
      lastSyncMessage: 'Hourly inventory poll completed: 4 projects synced',
      totalProjectsSynced: 4,
      totalUnitsSynced: 84,
      autoApproveNewProjects: false,
      createdAt: '2026-09-01T08:00:00.000Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'dac-4',
      developerId: 'dev-4',
      developerName: 'Hiranandani Communities',
      apiType: 'OUTBOUND_PULL',
      pullEndpointUrl: 'https://erp.hiranandani.com/api/projects/export.json',
      authType: 'API_KEY',
      authToken: 'hir_api_key_44321',
      inboundApiKey: 'eni_dev_live_hiranandani_12b99d45ef33',
      syncFrequency: 'DAILY',
      status: 'ACTIVE',
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      lastSyncStatus: 'SUCCESS',
      lastSyncMessage: 'Daily catalogue sync executed successfully',
      totalProjectsSynced: 3,
      totalUnitsSynced: 62,
      autoApproveNewProjects: false,
      createdAt: '2026-09-10T14:15:00.000Z',
      updatedAt: new Date().toISOString(),
    },
  ];
  private reraRecords: ReraRecord[] = [...INITIAL_RERA_RECORDS];
  private buyerRequirements: BuyerRequirement[] = [...INITIAL_BUYER_REQUIREMENTS];
  private crmSyncLogs: CrmSyncLog[] = [...INITIAL_CRM_SYNC_LOGS];
  private aiAgentActions: AiAgentAction[] = [...INITIAL_AI_AGENT_ACTIONS];
  private notifications: AdminNotification[] = [
    {
      id: 'notif-1',
      title: '🔥 High-Priority Lead Ingested',
      message: 'Sneha Chawla registered for Piramal Vaikunth (Budget: ₹1.5 - 2.0 Cr) - Score: 85 (HOT). Immediate callback recommended.',
      category: 'LEAD',
      severity: 'CRITICAL',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      isRead: false,
      actionUrl: '/admin?tab=crm',
    },
    {
      id: 'notif-p1',
      title: '🛡️ ProVerify™ Review Needed',
      message: 'Piramal Vaikunth MahaRERA record flagged for human verification by ProVerify Agent.',
      category: 'PROVERIFY',
      severity: 'WARNING',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      isRead: false,
      actionUrl: '/admin?tab=verification',
    },
    {
      id: 'notif-2',
      title: 'Booking Token Received',
      message: 'Booking confirmed for Unit A-1402 (Godrej Riviera). Agreement Value: ₹1.45 Cr. Token Advance: ₹10,00,000.',
      category: 'DEAL',
      severity: 'SUCCESS',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      isRead: false,
      actionUrl: '/admin?tab=inventory',
    },
    {
      id: 'notif-3',
      title: 'Channel Partner Payout Approved',
      message: 'Commission payout of ₹3,42,000 ready for RTGS disbursement to Square Yards Ltd (CP101).',
      category: 'PAYOUT',
      severity: 'WARNING',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      isRead: false,
      actionUrl: '/admin?tab=commissions',
    },
    {
      id: 'notif-4',
      title: 'MahaRERA Quarterly Audit Due',
      message: 'Q3 Escrow 70:30 compliance certificate upload deadline approaching for Piramal Vaikunth.',
      category: 'COMPLIANCE',
      severity: 'WARNING',
      timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      isRead: true,
      actionUrl: '/admin?tab=verification',
    },
  ];

  // Default matching weights (Exact 100% total according to Section 6 of specification)
  private matchingWeights: MatchingWeights = {
    budget: 25,
    location: 20,
    configuration: 15,
    possession: 10,
    connectivityAndAmenities: 15,
    proVerifyCertification: 15,
  };

  // High-performance In-Memory Database Indexes (O(1) Map Hash Indexes)
  private propertyByIdIndex = new Map<string, Property>();
  private propertyBySlugIndex = new Map<string, Property>();
  private projectByIdIndex = new Map<string, Project>();
  private projectBySlugIndex = new Map<string, Project>();
  private developerByIdIndex = new Map<string, Developer>();
  private developerBySlugIndex = new Map<string, Developer>();
  private unitByIdIndex = new Map<string, Unit>();
  private leadByIdIndex = new Map<string, Lead>();
  private partnerByIdIndex = new Map<string, ChannelPartner>();
  private partnerByCodeIndex = new Map<string, ChannelPartner>();

  constructor() {
    this.rebuildAllIndexes();
    this.initializeProVerifyAndProLeadDefaults();
  }

  private initializeProVerifyAndProLeadDefaults(): void {
    // Enrich initial projects with ProVerify certification data
    for (const proj of this.projects) {
      if (!proj.verificationStatus) {
        if (proj.id === 'proj-3') {
          proj.verificationStatus = 'HUMAN_VERIFICATION';
          proj.isProVerifyCertified = false;
          proj.reraValidationSummary = {
            hasMismatches: true,
            mismatchesCount: 2,
            issues: [
              'Q2 Escrow 70:30 account certificate upload verification pending from auditor',
              'Tower Vidit sanction plan revision under review with MahaRERA authority',
            ],
          };
        } else {
          proj.verificationStatus = 'PROVERIFY_PASSED';
          proj.isProVerifyCertified = true;
          proj.verifiedAt = '2026-09-01T10:00:00.000Z';
          proj.verifiedBy = 'Adv. Aniket Vartak (ProVerify™ Officer)';
        }
      }
    }

    // Enrich properties with ProVerify flags
    for (const prop of this.properties) {
      const proj = this.projects.find((p) => p.id === prop.projectId);
      prop.isProVerifyCertified = proj ? !!proj.isProVerifyCertified : true;
      prop.verificationStatus = proj ? proj.verificationStatus : 'PROVERIFY_PASSED';
    }

    // Enrich leads with ProLead qualification scores and Realatic CRM status
    for (const lead of this.leads) {
      if (lead.leadScore === undefined) {
        if (lead.status === 'BOOKED' || lead.status === 'SITE_VISIT') {
          lead.leadScore = 85;
          lead.qualification = 'HOT';
        } else if (lead.status === 'QUALIFIED' || lead.status === 'SITE_VISIT_SCHEDULED') {
          lead.leadScore = 65;
          lead.qualification = 'QUALIFIED';
        } else if (lead.status === 'CONTACTED') {
          lead.leadScore = 45;
          lead.qualification = 'WARM';
        } else {
          lead.leadScore = 20;
          lead.qualification = 'COLD';
        }
        lead.crmSyncStatus = lead.id === 'lead-1' ? 'SYNCED' : 'PENDING';
        if (lead.id === 'lead-1') lead.realaticLeadId = 'RLTC-88902';
      }
    }
  }

  public rebuildAllIndexes(): void {
    this.propertyByIdIndex.clear();
    this.propertyBySlugIndex.clear();
    for (const p of this.properties) {
      this.propertyByIdIndex.set(p.id, p);
      if (p.slug) this.propertyBySlugIndex.set(p.slug, p);
    }

    this.projectByIdIndex.clear();
    this.projectBySlugIndex.clear();
    for (const p of this.projects) {
      this.projectByIdIndex.set(p.id, p);
      if (p.slug) this.projectBySlugIndex.set(p.slug, p);
    }

    this.developerByIdIndex.clear();
    this.developerBySlugIndex.clear();
    for (const d of this.developers) {
      this.developerByIdIndex.set(d.id, d);
      if (d.slug) this.developerBySlugIndex.set(d.slug, d);
    }

    this.unitByIdIndex.clear();
    for (const u of this.units) {
      this.unitByIdIndex.set(u.id, u);
    }

    this.leadByIdIndex.clear();
    for (const l of this.leads) {
      this.leadByIdIndex.set(l.id, l);
    }

    this.partnerByIdIndex.clear();
    this.partnerByCodeIndex.clear();
    for (const cp of this.partners) {
      this.partnerByIdIndex.set(cp.id, cp);
      if (cp.code) this.partnerByCodeIndex.set(cp.code.toUpperCase(), cp);
    }
  }

  // AUDIT LOGGING
  public addAuditLog(
    actionOrData: string | { action: string; entity: string; metadata?: string; details?: any; entityId?: string; user?: string; ip?: string },
    entity = 'System',
    metadata = '',
    entityId?: string,
    user = 'admin@prosify.local',
    ip = '103.21.14.82'
  ) {
    if (typeof actionOrData === 'object') {
      const detailsStr = actionOrData.details ? (typeof actionOrData.details === 'string' ? actionOrData.details : JSON.stringify(actionOrData.details)) : undefined;
      const log: AuditLogItem = {
        id: `al-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        user: actionOrData.user || user,
        action: actionOrData.action,
        entity: actionOrData.entity,
        entityId: actionOrData.entityId,
        ip: actionOrData.ip || ip,
        timestamp: new Date().toISOString(),
        metadata: actionOrData.metadata || detailsStr || '',
        details: detailsStr,
      };
      this.auditLogs.unshift(log);
      return;
    }

    const log: AuditLogItem = {
      id: `al-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user,
      action: actionOrData,
      entity,
      entityId,
      ip,
      timestamp: new Date().toISOString(),
      metadata,
    };
    this.auditLogs.unshift(log);
  }

  public getAuditLogs(): AuditLogItem[] {
    return [...this.auditLogs];
  }

  // PROPERTIES
  public getProperties(filters?: {
    city?: string;
    locality?: string;
    propertyType?: string;
    bhk?: string | string[];
    listingType?: string;
    minPrice?: number;
    maxPrice?: number;
    possessionStatus?: string | string[];
    verifiedOnly?: boolean;
    searchQuery?: string;
    sort?: string;
  }): Property[] {
    let result = [...this.properties].filter((p) => p.isPublished);

    if (filters?.city && filters.city !== 'All') {
      result = result.filter((p) => p.city.toLowerCase() === filters.city!.toLowerCase());
    }
    if (filters?.locality && filters.locality !== 'All') {
      result = result.filter((p) => p.locality.toLowerCase().includes(filters.locality!.toLowerCase()));
    }
    if (filters?.propertyType && filters.propertyType !== 'ALL') {
      result = result.filter((p) => p.propertyType === filters.propertyType);
    }
    if (filters?.listingType && filters.listingType !== 'ALL') {
      result = result.filter((p) => p.listingType === filters.listingType);
    }
    if (filters?.bhk && filters.bhk !== 'ALL') {
      if (Array.isArray(filters.bhk)) {
        if (filters.bhk.length > 0 && !filters.bhk.includes('ALL')) {
          result = result.filter((p) =>
            (filters.bhk as string[]).some((b) => p.bhk.toLowerCase().includes(b.toLowerCase()))
          );
        }
      } else {
        result = result.filter((p) => p.bhk.toLowerCase().includes((filters.bhk as string).toLowerCase()));
      }
    }
    if (filters?.minPrice !== undefined && filters.minPrice > 0) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined && filters.maxPrice > 0) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters?.possessionStatus && filters.possessionStatus !== 'ALL') {
      if (Array.isArray(filters.possessionStatus)) {
        if (filters.possessionStatus.length > 0 && !filters.possessionStatus.includes('ALL')) {
          result = result.filter((p) => (filters.possessionStatus as string[]).includes(p.possessionStatus));
        }
      } else {
        result = result.filter((p) => p.possessionStatus === filters.possessionStatus);
      }
    }
    if (filters?.verifiedOnly) {
      result = result.filter((p) => p.isVerified);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          (p.developerName && p.developerName.toLowerCase().includes(q)) ||
          (p.projectName && p.projectName.toLowerCase().includes(q))
      );
    }

    if (filters?.sort) {
      switch (filters.sort) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'area_asc':
          result.sort((a, b) => a.carpetArea - b.carpetArea);
          break;
        case 'area_desc':
          result.sort((a, b) => b.carpetArea - a.carpetArea);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        default:
          // relevance / featured first
          result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      }
    }

    return result;
  }

  public getAllPropertiesForAdmin(): Property[] {
    return [...this.properties];
  }

  public getPropertyBySlug(slug: string): Property | undefined {
    return this.propertyBySlugIndex.get(slug) || this.properties.find((p) => p.slug === slug);
  }

  public getPropertyById(id: string): Property | undefined {
    return this.propertyByIdIndex.get(id) || this.properties.find((p) => p.id === id);
  }

  public createProperty(data: Omit<Property, 'id' | 'createdAt'>): Property {
    const newProp: Property = {
      ...data,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.properties.unshift(newProp);
    this.propertyByIdIndex.set(newProp.id, newProp);
    if (newProp.slug) this.propertyBySlugIndex.set(newProp.slug, newProp);
    this.addAuditLog('PROPERTY_CREATE', 'Property', `Created property "${newProp.title}" in ${newProp.city}`, newProp.id);
    return newProp;
  }

  public updateProperty(id: string, updates: Partial<Property>): Property | undefined {
    const idx = this.properties.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.properties[idx] = { ...this.properties[idx], ...updates };
    const updated = this.properties[idx];
    this.propertyByIdIndex.set(id, updated);
    if (updated.slug) this.propertyBySlugIndex.set(updated.slug, updated);
    this.addAuditLog('PROPERTY_UPDATE', 'Property', `Updated property ${updated.title}`, id);
    return updated;
  }

  public deleteProperty(id: string): boolean {
    const prop = this.properties.find((p) => p.id === id);
    if (!prop) return false;
    this.properties = this.properties.filter((p) => p.id !== id);
    this.propertyByIdIndex.delete(id);
    if (prop.slug) this.propertyBySlugIndex.delete(prop.slug);
    this.addAuditLog('PROPERTY_DELETE', 'Property', `Deleted property ${prop.title}`, id);
    return true;
  }

  public bulkUpdateProperties(ids: string[], action: 'publish' | 'unpublish' | 'delete' | 'verify'): number {
    let affected = 0;
    if (action === 'delete') {
      const initialLen = this.properties.length;
      this.properties = this.properties.filter((p) => !ids.includes(p.id));
      affected = initialLen - this.properties.length;
    } else {
      this.properties = this.properties.map((p) => {
        if (ids.includes(p.id)) {
          affected++;
          if (action === 'publish') return { ...p, isPublished: true };
          if (action === 'unpublish') return { ...p, isPublished: false };
          if (action === 'verify') return { ...p, isVerified: true };
        }
        return p;
      });
    }
    this.addAuditLog('PROPERTY_BULK_ACTION', 'Property', `Bulk action ${action} executed on ${affected} properties`);
    return affected;
  }

  // PROJECTS
  public getProjects(filters?: { city?: string; search?: string; status?: string }): Project[] {
    let list = [...this.projects].filter((p) => p.isPublished !== false);
    if (filters?.city && filters.city !== 'All') {
      list = list.filter((p) => p.city.toLowerCase() === filters.city!.toLowerCase());
    }
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter((p) => p.constructionStatus === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.developerName.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getAllProjectsForAdmin(): Project[] {
    return [...this.projects];
  }

  public getProjectBySlug(slug: string): Project | undefined {
    return this.projectBySlugIndex.get(slug) || this.projects.find((p) => p.slug === slug);
  }

  public getProjectById(id: string): Project | undefined {
    return this.projectByIdIndex.get(id) || this.projects.find((p) => p.id === id);
  }

  public createProject(data: Omit<Project, 'id'>): Project {
    const newProj: Project = {
      ...data,
      id: `proj-${Date.now()}`,
    };
    this.projects.unshift(newProj);
    this.projectByIdIndex.set(newProj.id, newProj);
    if (newProj.slug) this.projectBySlugIndex.set(newProj.slug, newProj);
    this.addAuditLog('PROJECT_CREATE', 'Project', `Created project "${newProj.name}" by ${newProj.developerName}`, newProj.id);
    return newProj;
  }

  public updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.projects[idx] = { ...this.projects[idx], ...updates };
    const updated = this.projects[idx];
    this.projectByIdIndex.set(id, updated);
    if (updated.slug) this.projectBySlugIndex.set(updated.slug, updated);
    this.addAuditLog('PROJECT_UPDATE', 'Project', `Updated project ${updated.name}`, id);
    return updated;
  }

  // DEVELOPERS
  public getDevelopers(): Developer[] {
    return [...this.developers];
  }

  public getDeveloperBySlug(slug: string): Developer | undefined {
    return this.developerBySlugIndex.get(slug) || this.developers.find((d) => d.slug === slug);
  }

  public getDeveloperById(id: string): Developer | undefined {
    return this.developerByIdIndex.get(id) || this.developers.find((d) => d.id === id);
  }

  public createDeveloper(data: Omit<Developer, 'id'>): Developer {
    const newDev: Developer = {
      ...data,
      id: `dev-${Date.now()}`,
    };
    this.developers.unshift(newDev);
    this.developerByIdIndex.set(newDev.id, newDev);
    if (newDev.slug) this.developerBySlugIndex.set(newDev.slug, newDev);
    this.addAuditLog('DEVELOPER_CREATE', 'Developer', `Added developer ${newDev.name}`, newDev.id);
    return newDev;
  }

  public updateDeveloper(id: string, updates: Partial<Developer>): Developer | undefined {
    const idx = this.developers.findIndex((d) => d.id === id);
    if (idx === -1) return undefined;
    this.developers[idx] = { ...this.developers[idx], ...updates };
    const updated = this.developers[idx];
    this.developerByIdIndex.set(id, updated);
    if (updated.slug) this.developerBySlugIndex.set(updated.slug, updated);
    this.addAuditLog('DEVELOPER_UPDATE', 'Developer', `Updated developer ${updated.name}`, id);
    return updated;
  }

  // BUILDER & DEVELOPER API AUTO-SYNC ENGINE
  public getDeveloperApiConnections(): DeveloperApiConnection[] {
    return [...this.developerApiConnections];
  }

  public getDeveloperApiConnectionById(id: string): DeveloperApiConnection | undefined {
    return this.developerApiConnections.find((c) => c.id === id);
  }

  public getDeveloperApiConnectionByApiKey(key: string): DeveloperApiConnection | undefined {
    const cleanKey = key.trim();
    return this.developerApiConnections.find(
      (c) => c.inboundApiKey === cleanKey || (c.authToken && c.authToken === cleanKey)
    );
  }

  public createDeveloperApiConnection(
    data: Partial<DeveloperApiConnection> & { developerName?: string; apiType?: string; status?: string }
  ): DeveloperApiConnection {
    const newConn: DeveloperApiConnection = {
      developerName: 'Builder Partner',
      apiType: 'JSON_REST',
      status: 'ACTIVE',
      ...data,
      id: `dac-${Date.now()}`,
      totalProjectsSynced: 0,
      totalUnitsSynced: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.developerApiConnections.unshift(newConn);
    this.addAuditLog(
      'DEVELOPER_API_CONNECT',
      'Integration',
      `Configured ${newConn.apiType} API for Builder "${newConn.developerName}"`,
      newConn.id
    );
    return newConn;
  }

  public updateDeveloperApiConnection(
    id: string,
    updates: Partial<DeveloperApiConnection>
  ): DeveloperApiConnection | undefined {
    const idx = this.developerApiConnections.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    this.developerApiConnections[idx] = {
      ...this.developerApiConnections[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.developerApiConnections[idx];
  }

  public deleteDeveloperApiConnection(id: string): boolean {
    const initialLen = this.developerApiConnections.length;
    this.developerApiConnections = this.developerApiConnections.filter((c) => c.id !== id);
    return this.developerApiConnections.length < initialLen;
  }

  // Developer API Credential Compatibility Methods
  public getDeveloperApiCredentials(): any[] {
    return this.developerApiConnections.map((c) => ({
      ...c,
      apiKey: c.inboundApiKey || c.authToken || `pk_live_${c.id}`,
      apiSecret: `sk_live_${c.id}_sec`,
      tier: c.tier || 'GRADE_A',
      permissions: c.permissions || {
        canPushProjects: true,
        canPushInventoryStatus: true,
        canUpdatePricing: true,
        canSyncBhkLayouts: true,
      },
      outboundApiConfig: c.outboundApiConfig || {
        enabled: Boolean(c.endpointUrl),
        endpointUrl: c.endpointUrl || '',
        authHeaderKey: 'Authorization',
        authHeaderValue: c.authToken || '',
        format: 'JSON_REST',
        syncFrequency: c.syncFrequency || 'REALTIME',
        autoRegisterNewProjects: true,
      },
      inboundPushEndpoint: '/api/developer-api/push',
      rateLimitPerMin: 120,
    }));
  }

  public getDeveloperApiCredentialById(id: string): any {
    const conn = this.getDeveloperApiConnectionById(id);
    if (!conn) return undefined;
    return {
      ...conn,
      apiKey: conn.inboundApiKey || conn.authToken || `pk_live_${conn.id}`,
      apiSecret: `sk_live_${conn.id}_sec`,
      tier: conn.tier || 'GRADE_A',
      permissions: conn.permissions || {
        canPushProjects: true,
        canPushInventoryStatus: true,
        canUpdatePricing: true,
        canSyncBhkLayouts: true,
      },
      outboundApiConfig: conn.outboundApiConfig || {
        enabled: Boolean(conn.endpointUrl),
        endpointUrl: conn.endpointUrl || '',
        authHeaderKey: 'Authorization',
        authHeaderValue: conn.authToken || '',
        format: 'JSON_REST',
        syncFrequency: conn.syncFrequency || 'REALTIME',
        autoRegisterNewProjects: true,
      },
      inboundPushEndpoint: '/api/developer-api/push',
      rateLimitPerMin: 120,
    };
  }

  public createDeveloperApiCredential(data: any): any {
    const conn = this.createDeveloperApiConnection({
      developerId: data.developerId || `dev-${Date.now()}`,
      developerName: data.developerName || 'Builder Partner',
      tier: data.tier || 'GRADE_A',
      apiType: 'JSON_REST',
      status: data.status || 'ACTIVE',
      endpointUrl: data.outboundApiConfig?.endpointUrl,
      authToken: data.apiKey,
      inboundApiKey: data.apiKey || `pk_live_${Date.now()}`,
      syncFrequency: data.outboundApiConfig?.syncFrequency || 'REALTIME',
      autoApproveInventory: true,
      ...data,
    });
    return this.getDeveloperApiCredentialById(conn.id);
  }

  public updateDeveloperApiCredential(id: string, updates: any): any {
    const conn = this.updateDeveloperApiConnection(id, {
      ...updates,
      inboundApiKey: updates.apiKey || updates.inboundApiKey,
      authToken: updates.apiKey || updates.authToken,
    });
    return conn ? this.getDeveloperApiCredentialById(id) : undefined;
  }

  public rotateDeveloperApiKey(id: string): { success: boolean; newApiKey: string; newApiSecret: string; error?: string } {
    const newApiKey = `pk_live_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    const newApiSecret = `sk_live_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`;
    const updated = this.updateDeveloperApiConnection(id, {
      inboundApiKey: newApiKey,
      authToken: newApiKey,
    });
    if (!updated) {
      return { success: false, newApiKey: '', newApiSecret: '', error: 'Credential not found' };
    }
    return { success: true, newApiKey, newApiSecret };
  }

  public triggerDeveloperOutboundPull(id: string): { projectsCount: number; unitsCount: number } {
    const conn = this.getDeveloperApiConnectionById(id);
    if (conn) {
      conn.lastSyncedAt = new Date().toISOString();
      conn.lastSyncStatus = 'SUCCESS';
    }
    return { projectsCount: 2, unitsCount: 24 };
  }

  public processDeveloperInboundPush(apiKey: string, payload: any): any {
    const conn = this.getDeveloperApiConnectionByApiKey(apiKey);
    return {
      success: true,
      message: 'Developer payload successfully processed',
      developerName: conn?.developerName || 'Verified Developer',
      action: payload.action || 'SYNC_PROJECT',
      synced: {
        projectsCreated: payload.project ? 1 : 0,
        projectsUpdated: 0,
        unitsCreated: payload.units ? payload.units.length : 0,
        unitsUpdated: 0,
        timestamp: new Date().toISOString(),
      },
    };
  }

  public syncDeveloperProjects(
    connectionIdOrApiKey: string,
    items: DeveloperProjectSyncItem[],
    sourceInfo?: string
  ): {
    success: boolean;
    connection?: DeveloperApiConnection;
    createdCount: number;
    updatedCount: number;
    totalProcessed: number;
    syncedProjects: Project[];
    errors: string[];
  } {
    const conn =
      this.getDeveloperApiConnectionById(connectionIdOrApiKey) ||
      this.getDeveloperApiConnectionByApiKey(connectionIdOrApiKey);

    let developerId = conn?.developerId || 'dev-external';
    let developerName = conn?.developerName || 'Verified Builder Partner';

    let createdCount = 0;
    let updatedCount = 0;
    const syncedProjects: Project[] = [];
    const errors: string[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.name || !item.city) {
        errors.push(`Item #${i + 1} skipped: missing project name or city`);
        continue;
      }

      if (item.developerName) {
        developerName = item.developerName;
      }

      // Check if developer exists in registry, else auto-register developer
      let dev = this.developers.find(
        (d) => d.name.toLowerCase() === developerName.toLowerCase() || d.id === developerId
      );
      if (!dev) {
        dev = this.createDeveloper({
          name: developerName,
          slug: developerName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          logoUrl: 'https://picsum.photos/seed/builder/200/200',
          about: `${developerName} is an officially integrated real estate developer with automated inventory API sync.`,
          establishedYr: 2012,
          website: `https://www.${developerName.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
          contactEmail: `sales@${developerName.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
          contactPhone: '+91 98200 00000',
          isVerified: true,
          totalProjects: 1,
          completedProjects: 0,
          ongoingProjects: 1,
          upcomingProjects: 0,
          headquarters: `${item.city}, Maharashtra`,
        });
        developerId = dev.id;
      }

      // Match existing project by RERA number or Name + City
      const existing = this.projects.find(
        (p) =>
          (item.reraNumber && p.reraNumber && p.reraNumber.toLowerCase() === item.reraNumber.toLowerCase()) ||
          (p.name.toLowerCase() === item.name.toLowerCase() && p.city.toLowerCase() === item.city.toLowerCase())
      );

      if (existing) {
        // Update existing project with latest developer API attributes
        const updates: Partial<Project> = {
          startingPrice: item.minPrice || existing.startingPrice,
          priceRange: item.priceStartingFrom ? String(item.priceStartingFrom) : existing.priceRange,
          minPrice: item.minPrice || existing.minPrice,
          maxPrice: item.maxPrice || existing.maxPrice,
          availableUnits: item.availableUnits !== undefined ? item.availableUnits : existing.availableUnits,
          totalUnits: item.totalUnits !== undefined ? item.totalUnits : existing.totalUnits,
          constructionStatus: item.constructionStatus || existing.constructionStatus,
          possessionDate: item.possessionDate || existing.possessionDate,
          coverImage: item.coverImage || existing.coverImage,
          images: item.images && item.images.length > 0 ? item.images : existing.images,
          amenities: item.amenities && item.amenities.length > 0
            ? Array.from(new Set([...(existing.amenities || []), ...item.amenities]))
            : existing.amenities,
        };

        const updated = this.updateProject(existing.id, updates);
        if (updated) {
          syncedProjects.push(updated);
          updatedCount++;
        }
      } else {
        // Auto-Register new project from Developer API
        const baseSlug = `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${item.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        const slugExists = this.projects.some((p) => p.slug === baseSlug);
        const finalSlug = slugExists ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

        const newProj: Project = {
          id: `proj-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: item.name,
          slug: finalSlug,
          developerId: dev.id,
          developerName: dev.name,
          reraNumber: item.reraNumber || `PRM/KA/RERA/${Date.now().toString().slice(-6)}`,
          city: item.city,
          locality: item.locality || item.city,
          address: item.address || `${item.locality || item.city}, Maharashtra`,
          startingPrice: item.minPrice || 7500000,
          priceRange: item.priceStartingFrom ? String(item.priceStartingFrom) : '₹75 Lakhs',
          minPrice: item.minPrice || 7500000,
          maxPrice: item.maxPrice || 22000000,
          constructionStatus: item.constructionStatus || 'UNDER_CONSTRUCTION',
          possessionDate: item.possessionDate || 'Dec 2027',
          totalUnits: item.totalUnits || 150,
          availableUnits: item.availableUnits || 60,
          description:
            item.description ||
            `${item.name} is a state-of-the-art residential project by ${dev.name}, synced live via Builder API.`,
          coverImage: item.coverImage || 'https://picsum.photos/seed/realestate/1200/800',
          images:
            item.images && item.images.length > 0
              ? item.images
              : [
                  'https://picsum.photos/seed/realestate1/1200/800',
                  'https://picsum.photos/seed/realestate2/1200/800',
                ],
          amenities:
            item.amenities && item.amenities.length > 0
              ? item.amenities
              : ['Clubhouse', 'Swimming Pool', 'Gymnasium', 'Landscaped Gardens', '24x7 Security'],
          bhkTypes: item.bhkTypes || ['2 BHK', '3 BHK'],
          towers: item.towers || ['Tower 1', 'Tower 2'],
          verificationStatus: conn?.autoApproveNewProjects ? 'PROVERIFY_PASSED' : 'DATA_RECEIVED',
          isProVerifyCertified: Boolean(conn?.autoApproveNewProjects),
          isPublished: true,
          isFeatured: false,
        };

        this.projects.unshift(newProj);
        this.projectByIdIndex.set(newProj.id, newProj);
        if (newProj.slug) this.projectBySlugIndex.set(newProj.slug, newProj);
        syncedProjects.push(newProj);
        createdCount++;
      }
    }

    // Update connection stats
    if (conn) {
      conn.totalProjectsSynced += createdCount;
      conn.lastSyncAt = new Date().toISOString();
      conn.lastSyncStatus = errors.length > 0 ? (createdCount + updatedCount > 0 ? 'PARTIAL' : 'FAILED') : 'SUCCESS';
      conn.lastSyncMessage = `Live API sync completed: ${createdCount} new registered, ${updatedCount} updated.`;
    }

    // Push Admin Notification
    this.addNotification({
      title: `⚡ Builder API Sync: ${developerName}`,
      message: `Processed ${createdCount + updatedCount} projects (${createdCount} newly auto-registered, ${updatedCount} inventory updated) via ${sourceInfo || 'Live Developer API Push'}.`,
      category: 'SYSTEM',
      severity: 'SUCCESS',
      actionUrl: '/admin?tab=developer-api',
    });

    this.addAuditLog(
      'BUILDER_API_SYNC',
      'Integration',
      `Auto-synced projects for ${developerName} (${createdCount} created, ${updatedCount} updated)`,
      conn?.id
    );

    return {
      success: createdCount + updatedCount > 0 || errors.length === 0,
      connection: conn,
      createdCount,
      updatedCount,
      totalProcessed: items.length,
      syncedProjects,
      errors,
    };
  }

  // UNITS & INVENTORY ENGINE
  public getUnits(projectId?: string, tower?: string): Unit[] {
    let result = [...this.units];
    if (projectId) {
      result = result.filter((u) => u.projectId === projectId);
    }
    if (tower) {
      result = result.filter((u) => u.tower === tower);
    }
    return result;
  }

  public getUnitById(id: string): Unit | undefined {
    return this.unitByIdIndex.get(id) || this.units.find((u) => u.id === id);
  }

  public updateUnitStatus(unitId: string, status: UnitStatus): Unit | undefined {
    const idx = this.units.findIndex((u) => u.id === unitId);
    if (idx === -1) return undefined;
    const oldStatus = this.units[idx].status;
    this.units[idx] = { ...this.units[idx], status };
    this.unitByIdIndex.set(unitId, this.units[idx]);
    this.addAuditLog(
      'UNIT_STATUS_CHANGE',
      'Unit',
      `Unit ${this.units[idx].unitNumber} status changed from ${oldStatus} to ${status}`,
      unitId
    );
    return this.units[idx];
  }

  public bulkImportUnits(newUnits: Unit[]): { created: number; duplicates: number } {
    const result = this.bulkImportUnitsWithStrategy(newUnits, 'SKIP');
    return { created: result.created, duplicates: result.duplicates };
  }

  public bulkImportUnitsWithStrategy(
    newUnits: Unit[],
    strategy: 'SKIP' | 'OVERWRITE'
  ): { created: number; updated: number; duplicates: number; total: number } {
    let created = 0;
    let updated = 0;
    let duplicates = 0;

    for (const u of newUnits) {
      const existingIdx = this.units.findIndex(
        (existingU) =>
          existingU.projectId === u.projectId &&
          existingU.tower.toLowerCase() === u.tower.toLowerCase() &&
          existingU.unitNumber.toLowerCase() === u.unitNumber.toLowerCase()
      );

      if (existingIdx !== -1) {
        duplicates++;
        if (strategy === 'OVERWRITE') {
          this.units[existingIdx] = {
            ...this.units[existingIdx],
            price: u.price || this.units[existingIdx].price,
            carpetArea: u.carpetArea || this.units[existingIdx].carpetArea,
            builtUpArea: u.builtUpArea || this.units[existingIdx].builtUpArea,
            status: u.status || this.units[existingIdx].status,
            floor: u.floor || this.units[existingIdx].floor,
            bhk: u.bhk || this.units[existingIdx].bhk,
            facing: u.facing || this.units[existingIdx].facing,
          };
          updated++;
        }
      } else {
        this.units.push(u);
        created++;
      }
    }

    this.addAuditLog(
      'CSV_UNIT_IMPORT',
      'Unit',
      `Bulk imported ${newUnits.length} rows (${created} created, ${updated} updated, ${duplicates} duplicates handled with ${strategy} strategy)`
    );

    return { created, updated, duplicates, total: newUnits.length };
  }

  // CHANNEL PARTNERS
  public getChannelPartners(): ChannelPartner[] {
    return [...this.partners];
  }

  public getPartners(): ChannelPartner[] {
    return [...this.partners];
  }

  public getPartnerByCode(code: string): ChannelPartner | undefined {
    return this.partnerByCodeIndex.get(code.toUpperCase()) || this.partners.find((p) => p.code.toUpperCase() === code.toUpperCase());
  }

  public getPartnerById(id: string): ChannelPartner | undefined {
    return this.partnerByIdIndex.get(id) || this.partners.find((p) => p.id === id);
  }

  public createChannelPartner(data: {
    companyName: string;
    partnerName: string;
    email: string;
    phone: string;
    address: string;
    panNumber: string;
    gstNumber?: string;
    reraNumber?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
  }): ChannelPartner {
    const nextCodeNum = 100 + this.partners.length + 1;
    const newPartner: ChannelPartner = {
      id: `cp-${Date.now()}`,
      code: `CP${nextCodeNum}`,
      ...data,
      status: 'PENDING',
      clicksCount: 0,
      leadsCount: 0,
      siteVisitsCount: 0,
      bookingsCount: 0,
      totalCommissionEarned: 0,
      totalCommissionPaid: 0,
      pendingCommission: 0,
      createdAt: new Date().toISOString(),
    };
    this.partners.unshift(newPartner);
    this.partnerByIdIndex.set(newPartner.id, newPartner);
    this.partnerByCodeIndex.set(newPartner.code.toUpperCase(), newPartner);
    this.addAuditLog(
      'PARTNER_REGISTRATION',
      'ChannelPartner',
      `New partner registered: ${newPartner.companyName} (${newPartner.code})`,
      newPartner.id
    );
    return newPartner;
  }

  public updatePartnerStatus(id: string, status: PartnerStatus): ChannelPartner | undefined {
    const idx = this.partners.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.partners[idx] = { ...this.partners[idx], status };
    const updated = this.partners[idx];
    this.partnerByIdIndex.set(id, updated);
    this.partnerByCodeIndex.set(updated.code.toUpperCase(), updated);
    this.addAuditLog('PARTNER_STATUS_UPDATE', 'ChannelPartner', `Partner ${this.partners[idx].code} marked ${status}`, id);
    return updated;
  }

  public updateChannelPartner(id: string, updates: Partial<ChannelPartner>): ChannelPartner | undefined {
    const idx = this.partners.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.partners[idx] = { ...this.partners[idx], ...updates };
    const updated = this.partners[idx];
    this.partnerByIdIndex.set(id, updated);
    this.partnerByCodeIndex.set(updated.code.toUpperCase(), updated);
    this.addAuditLog('PARTNER_UPDATE', 'ChannelPartner', `Updated partner ${this.partners[idx].code}`, id);
    return updated;
  }

  // TRACKING LINKS & ATTRIBUTION PIPELINE
  public getTrackingLinks(partnerId?: string): TrackingLink[] {
    if (partnerId) {
      return this.trackingLinks.filter((tl) => tl.partnerId === partnerId);
    }
    return [...this.trackingLinks];
  }

  public createTrackingLink(data: {
    partnerId: string;
    targetUrl: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }): TrackingLink {
    const partner = this.partners.find((p) => p.id === data.partnerId);
    const code = `${partner ? partner.code : 'CP'}-${Date.now().toString().slice(-4)}`;
    const newLink: TrackingLink = {
      id: `tl-${Date.now()}`,
      partnerId: data.partnerId,
      partnerCode: partner ? partner.code : 'UNKNOWN',
      code,
      targetUrl: data.targetUrl,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };
    this.trackingLinks.unshift(newLink);
    return newLink;
  }

  public recordTrackingEvent(
    partnerCode: string,
    targetPath: string,
    eventType = 'CLICK',
    linkCode?: string
  ): { partner?: ChannelPartner; link?: TrackingLink } {
    let partner = this.partners.find(
      (p) => p.code.toUpperCase() === partnerCode.toUpperCase() || p.id === partnerCode
    );
    let link: TrackingLink | undefined;

    if (linkCode) {
      link = this.trackingLinks.find(
        (tl) => tl.code.toUpperCase() === linkCode.toUpperCase() || tl.id === linkCode
      );
      if (link) {
        link.clicks++;
        if (!partner && link.partnerId) {
          partner = this.partners.find((p) => p.id === link!.partnerId);
        }
      }
    }

    if (partner) {
      partner.clicksCount++;
    }

    this.addAuditLog(
      'TRACKING_EVENT',
      'TrackingEvent',
      `Click recorded for partner ${partner?.code || partnerCode} on ${targetPath}`
    );

    return { partner, link };
  }

  // CRM & LEADS
  public getLeads(filters?: {
    partnerId?: string;
    status?: LeadStatus;
    search?: string;
    source?: string;
  }): Lead[] {
    let list = [...this.leads];
    if (filters?.partnerId) {
      list = list.filter((l) => l.partnerId === filters.partnerId);
    }
    if (filters?.status) {
      list = list.filter((l) => l.status === filters.status);
    }
    if (filters?.source && filters.source !== 'ALL') {
      list = list.filter((l) => l.source === filters.source);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          (l.projectName && l.projectName.toLowerCase().includes(q)) ||
          (l.propertyTitle && l.propertyTitle.toLowerCase().includes(q))
      );
    }
    return list;
  }

  public getLeadById(id: string): Lead | undefined {
    return this.leadByIdIndex.get(id) || this.leads.find((l) => l.id === id);
  }

  // Normalize phone number to standard 10 digits for deduplication
  private normalizePhoneNumber(phone: string): string {
    const cleaned = phone.replace(/[^0-9]/g, '');
    return cleaned.length > 10 ? cleaned.slice(-10) : cleaned;
  }

  // ProLead™ Lead Scoring Engine
  public calculateProLeadScore(options: {
    hasBasicForm?: boolean;
    hasBudgetAndLocation?: boolean;
    hasBrochureDownload?: boolean;
    hasWhatsappEngagement?: boolean;
    hasSiteVisitRequest?: boolean;
    hasHighBudgetInstant?: boolean;
    currentScore?: number;
  }): { score: number; qualification: LeadQualification; breakdown: NonNullable<Lead['scoringBreakdown']>; reasons: string[] } {
    let score = options.currentScore || 0;
    const breakdown = {
      basicForm: 10,
      preferences: 0,
      brochureDownload: 0,
      whatsappEngagement: 0,
      siteVisitRequest: 0,
      highBudgetInstant: 0,
    };
    const reasons: string[] = [];

    if (options.hasBasicForm !== false) {
      if (!options.currentScore) score += 10;
      reasons.push('Basic website inquiry form (+10)');
    }

    if (options.hasBudgetAndLocation) {
      score += 20;
      breakdown.preferences = 20;
      reasons.push('Budget + location preferences provided (+20)');
    }

    if (options.hasBrochureDownload) {
      score += 15;
      breakdown.brochureDownload = 15;
      reasons.push('Brochure/price sheet download (+15)');
    }

    if (options.hasWhatsappEngagement) {
      score += 20;
      breakdown.whatsappEngagement = 20;
      reasons.push('WhatsApp AI engagement (+20)');
    }

    if (options.hasSiteVisitRequest) {
      score += 25;
      breakdown.siteVisitRequest = 25;
      reasons.push('Site visit request (+25)');
    }

    if (options.hasHighBudgetInstant) {
      score += 30;
      breakdown.highBudgetInstant = 30;
      reasons.push('High budget + instant visit request (+30)');
    }

    // Score cap at 100
    score = Math.min(100, Math.max(0, score));

    // Qualification mappings:
    // 0–30 = COLD, 31–60 = WARM, 61–80 = QUALIFIED, 81–100 = HOT
    let qualification: LeadQualification = 'COLD';
    if (score >= 81) qualification = 'HOT';
    else if (score >= 61) qualification = 'QUALIFIED';
    else if (score >= 31) qualification = 'WARM';
    else qualification = 'COLD';

    return { score, qualification, breakdown, reasons };
  }

  public createLead(
    data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'leadScore' | 'qualification'> & {
      status?: LeadStatus;
      leadScore?: number;
      qualification?: LeadQualification;
      hasBrochureDownload?: boolean;
      hasWhatsappEngagement?: boolean;
      hasSiteVisitRequest?: boolean;
    }
  ): Lead {
    const normPhone = this.normalizePhoneNumber(data.phone);

    // Intelligent Deduplication: check if customer already exists
    const existingLead = this.leads.find((l) => {
      if (normPhone && this.normalizePhoneNumber(l.phone) === normPhone) return true;
      if (data.email && l.email && l.email.toLowerCase() === data.email.toLowerCase()) return true;
      return false;
    });

    if (existingLead) {
      // Intelligently merge/upgrade existing lead instead of creating duplicate
      const extraPoints = data.hasSiteVisitRequest
        ? 25
        : data.hasBrochureDownload
        ? 15
        : data.hasWhatsappEngagement
        ? 20
        : 10;
      const newScore = Math.min(100, (existingLead.leadScore || 50) + extraPoints);

      let newQual: LeadQualification = 'COLD';
      if (newScore >= 81) newQual = 'HOT';
      else if (newScore >= 61) newQual = 'QUALIFIED';
      else if (newScore >= 31) newQual = 'WARM';

      existingLead.leadScore = newScore;
      existingLead.qualification = newQual;
      existingLead.updatedAt = new Date().toISOString();

      if (data.budget && data.budget !== existingLead.budget) {
        existingLead.budget = data.budget;
      }
      if (data.requirement) {
        existingLead.notes = `${existingLead.notes ? existingLead.notes + ' | ' : ''}Additional Inquiry: ${data.requirement}`;
      }

      // Check for HOT alert trigger
      if (newQual === 'HOT' && !existingLead.isHotAlertSent) {
        existingLead.isHotAlertSent = true;
        this.addNotification({
          title: `🔥 HOT Lead Alert: ${existingLead.name}`,
          message: `${existingLead.name} (${existingLead.phone}) engaged again! Lead score increased to ${newScore} (HOT). Requires immediate callback.`,
          category: 'LEAD',
          severity: 'CRITICAL',
          actionUrl: `/admin?tab=crm`,
        });
      }

      this.addAuditLog(
        'LEAD_MERGE_UPDATE',
        'Lead',
        `Lead "${existingLead.name}" merged additional inquiry via ${data.source}. Score updated to ${newScore} (${newQual})`,
        existingLead.id
      );

      return existingLead;
    }

    // Calculate initial lead score and qualification
    const hasPreferences = !!(data.budget || data.preferredLocations?.length || data.location);
    const hasHighBudgetInstant = !!(
      (data.budget?.includes('Cr') || data.budgetNum && data.budgetNum >= 15000000) &&
      data.hasSiteVisitRequest
    );

    const { score, qualification, breakdown, reasons } = this.calculateProLeadScore({
      hasBasicForm: true,
      hasBudgetAndLocation: hasPreferences,
      hasBrochureDownload: data.hasBrochureDownload,
      hasWhatsappEngagement: data.hasWhatsappEngagement,
      hasSiteVisitRequest: data.hasSiteVisitRequest,
      hasHighBudgetInstant,
    });

    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}`,
      status: data.status || 'NEW',
      leadScore: score,
      qualification,
      scoringBreakdown: breakdown,
      lastScoringReasons: reasons,
      crmSyncStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If partner attributed, increment partner lead count
    if (newLead.partnerId) {
      const partner = this.partners.find((p) => p.id === newLead.partnerId);
      if (partner) partner.leadsCount++;
    }

    this.leads.unshift(newLead);
    this.leadByIdIndex.set(newLead.id, newLead);

    // High Priority Alert for HOT leads
    if (qualification === 'HOT') {
      newLead.isHotAlertSent = true;
      this.addNotification({
        title: `🔥 High Priority HOT Lead: ${newLead.name}`,
        message: `${newLead.name} registered via ${newLead.source} with score ${score} (HOT). Priority sales agent assignment recommended.`,
        category: 'LEAD',
        severity: 'CRITICAL',
        actionUrl: `/admin?tab=crm`,
      });
    }

    // Log AI Agent Action for ProLead qualification
    this.logAiAgentAction({
      agentName: 'ProLead',
      inputContext: {
        leadName: newLead.name,
        phone: newLead.phone,
        source: newLead.source,
        budget: newLead.budget,
      },
      modelUsed: 'ProLead-Scoring-v2.1',
      outputGenerated: {
        score,
        qualification,
        scoringReasons: reasons,
      },
      confidenceScore: 98,
      approvalRequired: false,
      isApproved: true,
      actionTaken: `Scored and qualified lead as ${qualification} (${score}/100)`,
    });

    this.addAuditLog('LEAD_CREATE', 'Lead', `New lead "${newLead.name}" via ${newLead.source} [Score: ${score}, ${qualification}]`, newLead.id);
    return newLead;
  }

  public updateLeadStatus(id: string, status: LeadStatus, notes?: string): Lead | undefined {
    const idx = this.leads.findIndex((l) => l.id === id);
    if (idx === -1) return undefined;
    this.leads[idx] = {
      ...this.leads[idx],
      status,
      notes: notes || this.leads[idx].notes,
      updatedAt: new Date().toISOString(),
    };
    const updated = this.leads[idx];
    this.leadByIdIndex.set(id, updated);
    this.addAuditLog('LEAD_STATUS_UPDATE', 'Lead', `Lead ${updated.name} updated to ${status}`, id);
    return updated;
  }

  public assignLead(id: string, salesExecName: string): Lead | undefined {
    const idx = this.leads.findIndex((l) => l.id === id);
    if (idx === -1) return undefined;
    this.leads[idx] = {
      ...this.leads[idx],
      assignedTo: salesExecName,
      updatedAt: new Date().toISOString(),
    };
    const updated = this.leads[idx];
    this.leadByIdIndex.set(id, updated);
    this.addAuditLog('LEAD_ASSIGNMENT', 'Lead', `Lead ${updated.name} assigned to ${salesExecName}`, id);
    return updated;
  }

  // SITE VISITS
  public getSiteVisits(partnerId?: string): SiteVisit[] {
    if (partnerId) {
      return this.siteVisits.filter((sv) => sv.partnerId === partnerId);
    }
    return [...this.siteVisits];
  }

  public createSiteVisit(data: Omit<SiteVisit, 'id' | 'createdAt' | 'status'>): SiteVisit {
    const newVisit: SiteVisit = {
      ...data,
      id: `sv-${Date.now()}`,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
    };
    if (newVisit.partnerId) {
      const partner = this.partners.find((p) => p.id === newVisit.partnerId);
      if (partner) partner.siteVisitsCount++;
    }

    // Update lead status to SITE_VISIT_SCHEDULED
    if (newVisit.leadId) {
      const lead = this.leads.find((l) => l.id === newVisit.leadId);
      if (lead && (lead.status === 'NEW' || lead.status === 'CONTACTED')) {
        lead.status = 'SITE_VISIT_SCHEDULED';
        lead.updatedAt = new Date().toISOString();
      }
    }

    this.siteVisits.unshift(newVisit);
    this.addAuditLog(
      'SITE_VISIT_SCHEDULE',
      'SiteVisit',
      `Scheduled visit for ${newVisit.leadName} on ${newVisit.visitDate}`,
      newVisit.id
    );
    return newVisit;
  }

  public updateSiteVisitStatus(id: string, status: SiteVisitStatus, notes?: string): SiteVisit | undefined {
    const idx = this.siteVisits.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;
    this.siteVisits[idx] = {
      ...this.siteVisits[idx],
      status,
      notes: notes || this.siteVisits[idx].notes,
    };

    // If marked completed, update related lead to VISITED
    if (status === 'COMPLETED' && this.siteVisits[idx].leadId) {
      const lead = this.leads.find((l) => l.id === this.siteVisits[idx].leadId);
      if (lead && lead.status !== 'BOOKED') {
        lead.status = 'VISITED';
        lead.updatedAt = new Date().toISOString();
      }
    }

    this.addAuditLog('SITE_VISIT_UPDATE', 'SiteVisit', `Site visit ${id} marked ${status}`);
    return this.siteVisits[idx];
  }

  // BOOKINGS & COMMISSIONS
  public getBookings(partnerId?: string): Booking[] {
    if (partnerId) {
      return this.bookings.filter((b) => b.partnerId === partnerId);
    }
    return [...this.bookings];
  }

  public createBooking(data: Omit<Booking, 'id' | 'commissionStatus' | 'commissionAmt'> & { ratePercent?: number }): Booking {
    const rate = data.ratePercent || 2.0;
    const commissionAmt = Math.round((data.totalAgreementValue * rate) / 100);

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      ...data,
      commissionAmt,
      commissionStatus: 'PENDING',
    };

    this.bookings.unshift(newBooking);

    // Sync lead status to BOOKED
    if (newBooking.leadId) {
      const lead = this.leads.find((l) => l.id === newBooking.leadId);
      if (lead) {
        lead.status = 'BOOKED';
        lead.updatedAt = new Date().toISOString();
      }
    }

    // If unit booked, change unit status to BOOKED
    if (newBooking.unitNumber) {
      const unit = this.units.find(
        (u) =>
          u.unitNumber.toLowerCase() === newBooking.unitNumber.toLowerCase() &&
          (!newBooking.projectId || u.projectId === newBooking.projectId)
      );
      if (unit) {
        unit.status = 'BOOKED';
      }
    }

    // If channel partner exists, create commission ledger item & increment partner stats
    if (newBooking.partnerId) {
      const partner = this.partners.find((p) => p.id === newBooking.partnerId);
      if (partner) {
        partner.bookingsCount++;
        partner.totalCommissionEarned += commissionAmt;
        partner.pendingCommission += commissionAmt;

        const newComm: Commission = {
          id: `comm-${Date.now()}`,
          partnerId: partner.id,
          partnerCode: partner.code,
          partnerName: partner.companyName,
          bookingId: newBooking.id,
          projectName: newBooking.projectName || 'Residential Project',
          unitNumber: newBooking.unitNumber,
          amount: commissionAmt,
          ratePercent: rate,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          notes: `Commission for booking ${newBooking.unitNumber}`,
        };
        this.commissions.unshift(newComm);
      }
    }

    this.addAuditLog(
      'BOOKING_CREATE',
      'Booking',
      `Booking created for ${newBooking.customerName} - Unit ${newBooking.unitNumber} (₹${newBooking.totalAgreementValue.toLocaleString('en-IN')})`,
      newBooking.id
    );

    return newBooking;
  }

  public getCommissions(partnerId?: string): Commission[] {
    if (partnerId) {
      return this.commissions.filter((c) => c.partnerId === partnerId);
    }
    return [...this.commissions];
  }

  public updateCommissionStatus(id: string, status: CommissionStatus, utrNumber?: string): Commission | undefined {
    const idx = this.commissions.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    const comm = this.commissions[idx];
    const partner = this.partners.find((p) => p.id === comm.partnerId);

    if (status === 'PAID' && comm.status !== 'PAID') {
      comm.paidAt = new Date().toISOString();
      if (partner) {
        partner.pendingCommission = Math.max(0, partner.pendingCommission - comm.amount);
        partner.totalCommissionPaid += comm.amount;
      }
    } else if (status === 'APPROVED' && comm.status === 'PENDING') {
      comm.approvedAt = new Date().toISOString();
    }

    comm.status = status;
    if (utrNumber) {
      comm.notes = `${comm.notes || ''} | Payout UTR: ${utrNumber}`.trim();
    }

    this.addAuditLog(
      'COMMISSION_STATUS_UPDATE',
      'Commission',
      `Commission ${id} (${comm.partnerCode}) marked ${status}`,
      id
    );

    return comm;
  }

  // DEVELOPER AUTO SYNC & LOGS
  public getSyncSources(): DeveloperSyncSource[] {
    return [...this.syncSources];
  }

  public getSyncJobs(): SyncJob[] {
    return [...this.syncJobs];
  }

  public createSyncSource(data: Omit<DeveloperSyncSource, 'id'>): DeveloperSyncSource {
    const newSource: DeveloperSyncSource = {
      ...data,
      id: `sync-${Date.now()}`,
      status: 'IDLE',
      lastSyncAt: undefined,
      retryPolicy: data.retryPolicy || { maxRetries: 3, backoffSeconds: 30 },
    };
    this.syncSources.push(newSource);
    this.addAuditLog('SYNC_SOURCE_CREATE', 'DeveloperSyncSource', `Configured new developer feed for ${newSource.developerName} (${newSource.feedFormat || newSource.sourceType})`);
    return newSource;
  }

  public updateSyncSource(id: string, updates: Partial<DeveloperSyncSource>): DeveloperSyncSource | undefined {
    const idx = this.syncSources.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;
    this.syncSources[idx] = { ...this.syncSources[idx], ...updates };
    this.addAuditLog('SYNC_SOURCE_UPDATE', 'DeveloperSyncSource', `Updated developer feed configuration for ${this.syncSources[idx].developerName}`);
    return this.syncSources[idx];
  }

  public deleteSyncSource(id: string): boolean {
    const idx = this.syncSources.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    const name = this.syncSources[idx].developerName;
    this.syncSources.splice(idx, 1);
    this.addAuditLog('SYNC_SOURCE_DELETE', 'DeveloperSyncSource', `Removed developer feed for ${name}`);
    return true;
  }

  public runSyncJob(sourceId: string, simulateError: boolean = false): SyncJob {
    const source = this.syncSources.find((s) => s.id === sourceId);
    const duration = Math.floor(Math.random() * 1500) + 700;
    const recs = Math.floor(Math.random() * 250) + 120;
    const created = Math.floor(Math.random() * 8) + 2;
    const updated = Math.floor(Math.random() * 35) + 8;

    if (simulateError) {
      const failedJob: SyncJob = {
        id: `job-${Date.now()}`,
        sourceId,
        developerName: source ? source.developerName : 'Developer Feed',
        sourceType: source?.sourceType || 'API',
        recordsReceived: 0,
        recordsCreated: 0,
        recordsUpdated: 0,
        recordsFailed: recs,
        recordsSkipped: 0,
        status: 'FAILED',
        statusCode: 504,
        errorMessage: 'HTTP 504 Gateway Timeout: Developer inventory ERP gateway unresponsive after 15,000ms',
        durationMs: 15200,
        timestamp: new Date().toISOString(),
        retryCount: 0,
        maxRetries: source?.retryPolicy?.maxRetries || 3,
        retryStatus: 'PENDING',
        nextRetryAt: 'In 30 seconds (Attempt 1/3)',
        logPayload: JSON.stringify({
          endpoint: source?.apiUrl || 'https://api.developer.com/inventory/feed',
          method: 'GET',
          error: { code: 'ETIMEDOUT', connect: true, responseTime: 15204 },
        }, null, 2),
      };

      if (source) {
        source.lastSyncAt = new Date().toISOString();
        source.status = 'FAILED';
        source.lastErrorMessage = failedJob.errorMessage;
      }

      this.syncJobs.unshift(failedJob);
      this.addAuditLog('DEVELOPER_SYNC_FAILED', 'DeveloperSyncSource', `Sync run for ${failedJob.developerName} failed with 504 Gateway Timeout`);
      return failedJob;
    }

    const job: SyncJob = {
      id: `job-${Date.now()}`,
      sourceId,
      developerName: source ? source.developerName : 'Developer Feed',
      sourceType: source?.sourceType || 'API',
      recordsReceived: recs,
      recordsCreated: created,
      recordsUpdated: updated,
      recordsFailed: 0,
      recordsSkipped: 0,
      status: 'SUCCESS',
      statusCode: 200,
      durationMs: duration,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      maxRetries: source?.retryPolicy?.maxRetries || 3,
      retryStatus: 'NONE',
      logPayload: JSON.stringify({
        endpoint: source?.apiUrl || 'https://api.developer.com/inventory/feed',
        format: source?.feedFormat || 'JSON_REST',
        auth: source?.authType || 'BEARER_TOKEN',
        recordsReconciled: recs,
        unitsCreated: created,
        unitsPriceUpdated: updated,
        checksum: `sha256:${Math.random().toString(36).substring(2, 12)}`,
      }, null, 2),
    };

    if (source) {
      source.lastSyncAt = new Date().toISOString();
      source.status = 'SUCCESS';
      source.lastErrorMessage = undefined;
      if (source.unitsMappedCount) {
        source.unitsMappedCount += created;
      } else {
        source.unitsMappedCount = recs;
      }
    }

    this.syncJobs.unshift(job);
    this.addAuditLog('DEVELOPER_SYNC_RUN', 'DeveloperSyncSource', `Sync run for ${job.developerName} succeeded (${recs} records received, ${created} created, ${updated} updated)`);
    return job;
  }

  public retrySyncJob(jobId: string): { success: boolean; job?: SyncJob; error?: string } {
    const jobIdx = this.syncJobs.findIndex((j) => j.id === jobId);
    if (jobIdx === -1) {
      return { success: false, error: 'Job not found' };
    }

    const currentJob = this.syncJobs[jobIdx];
    const currentRetries = currentJob.retryCount || 0;
    const maxRetries = currentJob.maxRetries || 3;

    if (currentRetries >= maxRetries) {
      currentJob.retryStatus = 'EXHAUSTED';
      currentJob.nextRetryAt = undefined;
      return { success: false, error: `Maximum retry limit (${maxRetries}) reached for this job` };
    }

    // Perform retry execution
    const newRetryCount = currentRetries + 1;
    const duration = Math.floor(Math.random() * 1200) + 600;
    const recs = Math.floor(Math.random() * 200) + 80;

    currentJob.retryCount = newRetryCount;
    currentJob.status = 'SUCCESS';
    currentJob.statusCode = 200;
    currentJob.errorMessage = undefined;
    currentJob.recordsReceived = recs;
    currentJob.recordsUpdated = Math.floor(Math.random() * 20) + 5;
    currentJob.recordsFailed = 0;
    currentJob.durationMs = duration;
    currentJob.timestamp = new Date().toISOString();
    currentJob.retryStatus = 'RETRIED';
    currentJob.nextRetryAt = undefined;
    currentJob.logPayload = JSON.stringify({
      retryAttempt: newRetryCount,
      reconnectedAt: new Date().toISOString(),
      handshake: 'HTTP 200 OK - Upstream endpoint recovered',
      reconciledUnits: recs,
    }, null, 2);

    // Update corresponding source if linked
    const source = this.syncSources.find((s) => s.id === currentJob.sourceId);
    if (source) {
      source.status = 'SUCCESS';
      source.lastSyncAt = new Date().toISOString();
      source.lastErrorMessage = undefined;
    }

    this.addAuditLog(
      'SYNC_JOB_RETRY',
      'SyncJob',
      `Manual retry successful for ${currentJob.developerName} (Job ${currentJob.id}, Attempt ${newRetryCount} of ${maxRetries})`
    );

    return { success: true, job: currentJob };
  }

  public clearSyncLogs(): void {
    this.syncJobs = [];
    this.addAuditLog('SYNC_LOGS_CLEAR', 'SyncJob', 'Admin cleared live synchronization log trail');
  }

  // INTEGRATIONS CENTER
  public getIntegrations(): IntegrationAdapter[] {
    return [...this.integrations];
  }

  public updateIntegration(id: string, updates: Partial<IntegrationAdapter>): IntegrationAdapter | undefined {
    const idx = this.integrations.findIndex((i) => i.id === id);
    if (idx === -1) return undefined;
    this.integrations[idx] = { ...this.integrations[idx], ...updates };
    this.addAuditLog('INTEGRATION_UPDATE', 'Integration', `Updated adapter ${this.integrations[idx].displayName}`);
    return this.integrations[idx];
  }

  public simulateInboundLead(provider: string, rawLead: Partial<Lead>): Lead {
    const adapter = this.integrations.find(
      (i) => i.provider.toUpperCase() === provider.toUpperCase() || i.id === provider
    );

    const lead: Lead = {
      id: `lead-inbound-${Date.now()}`,
      name: rawLead.name || 'Verified Ad Inquirer',
      phone: rawLead.phone || '+91 98200 11223',
      email: rawLead.email || 'lead@verifiedbuyer.in',
      source: rawLead.source || (provider.toUpperCase() as any) || 'META_ADS',
      status: 'NEW',
      budget: rawLead.budget || '₹1.5 Cr - ₹3 Cr',
      location: rawLead.location || 'Thane / Mulund',
      bhk: rawLead.bhk || '2 BHK',
      propertyTitle: rawLead.propertyTitle || 'Godrej Ascend Luxury',
      assignedTo: 'Neha Sharma (Senior Relationship Mgr)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: rawLead.notes || `Directly ingested via official ${adapter?.displayName || provider} webhook adapter.`,
    };

    this.leads.unshift(lead);

    if (adapter) {
      adapter.leadsReceived = (adapter.leadsReceived || 0) + 1;
      adapter.lastSyncAt = new Date().toISOString();
    }

    this.addNotification({
      category: 'LEAD',
      severity: 'SUCCESS',
      title: `⚡ New Inbound Lead via ${adapter?.displayName || provider}`,
      message: `${lead.name} (${lead.phone}) inquired for ${lead.propertyTitle} with budget ${lead.budget}.`,
      actionUrl: `/admin?tab=leads&leadId=${lead.id}`,
    });

    this.addAuditLog(
      'INBOUND_LEAD_INGEST',
      'Lead',
      `Ingested real-time lead ${lead.name} via ${adapter?.displayName || provider}`
    );

    return lead;
  }

  // SMART PROPERTY MATCHING ENGINE (Configurable weights)
  public getMatchingWeights(): MatchingWeights {
    return { ...this.matchingWeights };
  }

  public updateMatchingWeights(weights: Partial<MatchingWeights>): MatchingWeights {
    this.matchingWeights = { ...this.matchingWeights, ...weights };
    this.addAuditLog('MATCHING_WEIGHTS_UPDATE', 'Algorithm', `Updated matching engine weights`);
    return this.matchingWeights;
  }

  public calculateMatches(criteria: {
    budget?: number; // max budget in INR
    location?: string;
    microMarket?: string;
    propertyType?: string;
    bhk?: string;
    configuration?: string;
    minArea?: number;
    possessionStatus?: string;
    possessionPreference?: string;
    purpose?: string;
  }): Array<{
    property: Property;
    project?: Project;
    score: number;
    matchScore: number;
    matchType: 'Perfect Match' | 'Good Match' | 'Potential Match';
    matchingReasons: string[];
    reasons: string[];
  }> {
    const w = this.matchingWeights;
    const totalWeight =
      (w.budget || 25) +
      (w.location || 20) +
      (w.configuration || 15) +
      (w.possession || 10) +
      (w.connectivityAndAmenities || 15) +
      (w.proVerifyCertification || 15);

    const targetBhk = criteria.configuration || criteria.bhk;
    const targetLoc = (criteria.microMarket || criteria.location || '').toLowerCase();

    const results = this.properties.map((prop) => {
      const proj = this.projects.find((p) => p.id === prop.projectId);
      let earnedPoints = 0;
      const matchingReasons: string[] = [];

      // 1. Budget Match (25%)
      const budgetWeight = w.budget || 25;
      if (criteria.budget && criteria.budget > 0) {
        if (prop.price <= criteria.budget) {
          earnedPoints += budgetWeight;
          matchingReasons.push(`Within your budget (₹${(prop.price / 100000).toFixed(1)}L vs max ₹${(criteria.budget / 100000).toFixed(1)}L)`);
        } else if (prop.price <= criteria.budget * 1.12) {
          earnedPoints += budgetWeight * 0.7;
          matchingReasons.push(`Within 12% flexible budget ceiling`);
        } else {
          earnedPoints += budgetWeight * 0.2;
        }
      } else {
        earnedPoints += budgetWeight; // Neutral if budget not specified
        matchingReasons.push('Pricing available on request with custom payment plans');
      }

      // 2. Location / Micro-market Match (20%)
      const locWeight = w.location || 20;
      if (targetLoc && targetLoc !== 'all') {
        const propLoc = `${prop.locality} ${prop.city} ${proj?.district || ''}`.toLowerCase();
        if (propLoc.includes(targetLoc)) {
          earnedPoints += locWeight;
          matchingReasons.push(`Preferred micro-market location in ${prop.locality}, ${prop.city}`);
        } else if (prop.city.toLowerCase().includes(targetLoc)) {
          earnedPoints += locWeight * 0.8;
          matchingReasons.push(`Located in preferred city: ${prop.city}`);
        } else {
          earnedPoints += locWeight * 0.2;
        }
      } else {
        earnedPoints += locWeight;
        matchingReasons.push(`Prime Maharashtra residential hub (${prop.city})`);
      }

      // 3. Configuration Match (15%)
      const configWeight = w.configuration || 15;
      if (targetBhk && targetBhk !== 'ALL') {
        if (prop.bhk.toLowerCase().includes(targetBhk.toLowerCase())) {
          earnedPoints += configWeight;
          matchingReasons.push(`${prop.bhk} layout configuration available (${prop.carpetArea} sq.ft.)`);
        } else {
          earnedPoints += configWeight * 0.3;
        }
      } else {
        earnedPoints += configWeight;
        matchingReasons.push(`Optimized ${prop.bhk} floor plan layout`);
      }

      // 4. Possession Timeline Match (10%)
      const possWeight = w.possession || 10;
      if (criteria.possessionPreference || criteria.possessionStatus) {
        const pref = (criteria.possessionPreference || criteria.possessionStatus || '').toUpperCase();
        if (pref === 'IMMEDIATE' || pref === 'READY_TO_MOVE') {
          if (prop.possessionStatus === 'READY_TO_MOVE') {
            earnedPoints += possWeight;
            matchingReasons.push('Ready-to-move possession immediately available');
          } else {
            earnedPoints += possWeight * 0.4;
          }
        } else {
          earnedPoints += possWeight;
          matchingReasons.push(`Possession timeline aligned (${prop.possessionDate || 'Scheduled on-time delivery'})`);
        }
      } else {
        earnedPoints += possWeight;
        matchingReasons.push(`Possession: ${prop.possessionStatus === 'READY_TO_MOVE' ? 'Ready to move' : 'Under active construction'}`);
      }

      // 5. Connectivity & Amenities (15%)
      const amenWeight = w.connectivityAndAmenities || 15;
      const amenitiesCount = (prop.amenities?.length || 0) + (proj?.amenities?.length || 0);
      if (amenitiesCount >= 6) {
        earnedPoints += amenWeight;
        matchingReasons.push(`Top-tier lifestyle amenities & rapid road/transit connectivity`);
      } else if (amenitiesCount >= 3) {
        earnedPoints += amenWeight * 0.8;
        matchingReasons.push(`Essential modern amenities and gated security included`);
      } else {
        earnedPoints += amenWeight * 0.5;
      }

      // 6. ProVerify™ Certification (15%)
      const verifyWeight = w.proVerifyCertification || 15;
      const isCertified = !!(prop.isProVerifyCertified || (proj && proj.isProVerifyCertified));
      if (isCertified) {
        earnedPoints += verifyWeight;
        matchingReasons.push(`ProVerify™ Certified (MahaRERA verified legal title & escrow compliance)`);
      } else {
        earnedPoints += verifyWeight * 0.4;
      }

      const score = Math.min(100, Math.max(10, Math.round((earnedPoints / totalWeight) * 100)));
      let matchType: 'Perfect Match' | 'Good Match' | 'Potential Match' = 'Potential Match';
      if (score >= 85) matchType = 'Perfect Match';
      else if (score >= 65) matchType = 'Good Match';

      return {
        property: prop,
        project: proj,
        score,
        matchScore: score,
        matchType,
        matchingReasons,
        reasons: matchingReasons,
      };
    });

    return results.sort((a, b) => b.score - a.score);
  }

  // NOTIFICATIONS
  public getNotifications(): AdminNotification[] {
    return [...this.notifications];
  }

  public markNotificationRead(id: string): void {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
    }
  }

  public markNotificationAsRead(id: string): void {
    this.markNotificationRead(id);
  }

  public markAllNotificationsRead(): void {
    this.notifications.forEach((n) => {
      n.isRead = true;
    });
  }

  public markAllNotificationsAsRead(): void {
    this.markAllNotificationsRead();
  }

  public addNotification(data: Omit<AdminNotification, 'id' | 'timestamp' | 'isRead'>): AdminNotification {
    const newNotif: AdminNotification = {
      ...data,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }

  // DELETE & UPDATE HELPERS
  public deleteProject(id: string): boolean {
    const proj = this.projects.find((p) => p.id === id);
    if (!proj) return false;
    this.projects = this.projects.filter((p) => p.id !== id);
    this.addAuditLog('PROJECT_DELETE', 'Project', `Deleted project "${proj.name}"`, id);
    return true;
  }

  public deleteDeveloper(id: string): boolean {
    const dev = this.developers.find((d) => d.id === id);
    if (!dev) return false;
    this.developers = this.developers.filter((d) => d.id !== id);
    this.addAuditLog('DEVELOPER_DELETE', 'Developer', `Deleted developer "${dev.name}"`, id);
    return true;
  }

  public createUnit(data: Omit<Unit, 'id'>): Unit {
    const newUnit: Unit = {
      ...data,
      id: `unit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    this.units.unshift(newUnit);
    this.addAuditLog('UNIT_CREATE', 'Unit', `Added Unit ${newUnit.unitNumber} (${newUnit.tower})`, newUnit.id);
    return newUnit;
  }

  public updateUnit(id: string, updates: Partial<Unit>): Unit | undefined {
    const idx = this.units.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.units[idx] = { ...this.units[idx], ...updates };
    this.addAuditLog('UNIT_UPDATE', 'Unit', `Updated Unit ${this.units[idx].unitNumber}`, id);
    return this.units[idx];
  }

  public deleteUnit(id: string): boolean {
    const unit = this.units.find((u) => u.id === id);
    if (!unit) return false;
    this.units = this.units.filter((u) => u.id !== id);
    this.addAuditLog('UNIT_DELETE', 'Unit', `Deleted Unit ${unit.unitNumber}`, id);
    return true;
  }

  public updateLead(id: string, updates: Partial<Lead>): Lead | undefined {
    const idx = this.leads.findIndex((l) => l.id === id);
    if (idx === -1) return undefined;
    this.leads[idx] = { ...this.leads[idx], ...updates, updatedAt: new Date().toISOString() };
    this.addAuditLog('LEAD_UPDATE', 'Lead', `Updated lead profile for ${this.leads[idx].name}`, id);
    return this.leads[idx];
  }

  // ==========================================
  // 5. PROVERIFY™ VERIFICATION WORKFLOW
  // ==========================================

  public getReraRecords(): ReraRecord[] {
    return [...this.reraRecords];
  }

  public getReraRecordByProjectId(projectId: string): ReraRecord | undefined {
    return this.reraRecords.find((r) => r.projectId === projectId);
  }

  public getVerificationQueue(): Project[] {
    return this.projects.filter(
      (p) =>
        p.verificationStatus === 'DATA_RECEIVED' ||
        p.verificationStatus === 'VALIDATION' ||
        p.verificationStatus === 'RERA_CHECK' ||
        p.verificationStatus === 'DOCUMENT_CHECK' ||
        p.verificationStatus === 'HUMAN_VERIFICATION' ||
        p.isProVerifyCertified === false
    );
  }

  public submitProjectForVerification(projectId: string, reraNumber: string): Project | undefined {
    const proj = this.projects.find((p) => p.id === projectId);
    if (!proj) return undefined;

    proj.reraNumber = reraNumber;
    proj.verificationStatus = 'DATA_RECEIVED';
    proj.isProVerifyCertified = false;

    // Simulate automated preliminary validation & RERA lookup
    setTimeout(() => {
      if (proj.verificationStatus === 'DATA_RECEIVED') {
        proj.verificationStatus = 'HUMAN_VERIFICATION';
      }
    }, 100);

    this.addNotification({
      title: `🛡️ New Project Verification Submitted: ${proj.name}`,
      message: `Developer submitted ${proj.name} (RERA: ${reraNumber}) for ProVerify™ Certification. Verification Officer review queued.`,
      category: 'PROVERIFY',
      severity: 'INFO',
      actionUrl: '/admin?tab=verification',
    });

    this.addAuditLog(
      'PROVERIFY_SUBMIT',
      'Project',
      `Submitted project "${proj.name}" (RERA ${reraNumber}) for verification`,
      proj.id
    );

    return proj;
  }

  // ProVerify™ Human Verification Action (Certification requires explicit human officer approval)
  public reviewProjectVerification(
    projectId: string,
    decision: 'APPROVE' | 'REJECT' | 'REQUEST_CORRECTION',
    officerName: string,
    notes?: string
  ): Project | undefined {
    const proj = this.projects.find((p) => p.id === projectId);
    if (!proj) return undefined;

    const previousStatus = proj.verificationStatus;

    if (decision === 'APPROVE') {
      proj.isProVerifyCertified = true;
      proj.verificationStatus = 'PROVERIFY_PASSED';
      proj.verifiedAt = new Date().toISOString();
      proj.verifiedBy = officerName;
      proj.verificationNotes = notes || 'All MahaRERA certificates, title clearances, and escrow accounts validated.';

      // Propagate certification to all associated properties in marketplace
      for (const prop of this.properties) {
        if (prop.projectId === projectId) {
          prop.isProVerifyCertified = true;
          prop.verificationStatus = 'PROVERIFY_PASSED';
          prop.isVerified = true;
        }
      }

      this.addNotification({
        title: `✅ ProVerify™ Certified: ${proj.name}`,
        message: `Project ${proj.name} successfully certified by ${officerName}. Certified badge published on marketplace.`,
        category: 'PROVERIFY',
        severity: 'SUCCESS',
        actionUrl: `/projects/${proj.slug}`,
      });

      // Log AI Agent action for ProVerify audit trail
      this.logAiAgentAction({
        agentName: 'ProVerify',
        inputContext: { projectId, projectName: proj.name, reraNumber: proj.reraNumber },
        modelUsed: 'ProVerify-Audit-Agent-v3',
        outputGenerated: { status: 'CERTIFIED', approvedBy: officerName },
        confidenceScore: 99,
        approvalRequired: true,
        isApproved: true,
        approvedBy: officerName,
        actionTaken: `ProVerify™ Certified by human verification officer (${officerName})`,
      });
    } else if (decision === 'REJECT') {
      proj.isProVerifyCertified = false;
      proj.verificationStatus = 'DRAFT';
      proj.verificationNotes = notes || 'MahaRERA discrepancies found. Verification rejected.';

      for (const prop of this.properties) {
        if (prop.projectId === projectId) {
          prop.isProVerifyCertified = false;
        }
      }

      this.addNotification({
        title: `❌ ProVerify™ Rejected: ${proj.name}`,
        message: `Verification rejected by ${officerName}. Reason: ${notes || 'Compliance issues'}.`,
        category: 'PROVERIFY',
        severity: 'WARNING',
        actionUrl: `/admin?tab=verification`,
      });
    } else if (decision === 'REQUEST_CORRECTION') {
      proj.isProVerifyCertified = false;
      proj.verificationStatus = 'DOCUMENT_CHECK';
      proj.verificationNotes = notes || 'Additional documents or escrow audit clarifications requested from developer.';
    }

    this.addAuditLog(
      'PROVERIFY_DECISION',
      'Project',
      `Officer ${officerName} reviewed "${proj.name}": Decision ${decision} (from ${previousStatus}). Notes: ${notes || 'None'}`,
      proj.id
    );

    return proj;
  }

  // ==========================================
  // 6. PROMATCH™ BUYER REQUIREMENTS
  // ==========================================

  public getBuyerRequirements(): BuyerRequirement[] {
    return [...this.buyerRequirements];
  }

  public saveBuyerRequirement(
    req: Omit<BuyerRequirement, 'id' | 'createdAt' | 'status'> & { status?: BuyerRequirement['status'] }
  ): BuyerRequirement {
    const newReq: BuyerRequirement = {
      ...req,
      id: `req-${Date.now()}`,
      status: req.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    this.buyerRequirements.unshift(newReq);

    // Also automatically create/update a Lead for the customer so sales agents can assist
    this.createLead({
      name: newReq.fullName,
      phone: newReq.phone,
      email: newReq.email || `${newReq.fullName.toLowerCase().replace(/\s+/g, '.')}@buyer.prosify.in`,
      source: 'PROMATCH',
      budget: `₹${(newReq.budgetMin / 100000).toFixed(0)}L - ₹${(newReq.budgetMax / 100000).toFixed(0)}L`,
      budgetNum: newReq.budgetMax,
      bhk: newReq.configuration,
      location: newReq.locations.join(', '),
      preferredLocations: newReq.locations,
      purpose: newReq.purpose,
      requirement: `ProMatch preference: ${newReq.configuration} in ${newReq.locations.join(', ')}. Possession: ${newReq.possessionPreference}`,
      status: 'NEW',
    });

    this.addAuditLog(
      'BUYER_REQUIREMENT_SAVE',
      'BuyerRequirement',
      `Saved ProMatch requirement for ${newReq.fullName} (${newReq.configuration} in ${newReq.locations.join(', ')})`,
      newReq.id
    );

    return newReq;
  }

  // ==========================================
  // 8. REALATIC CRM INTEGRATION ADAPTER & LOGS
  // ==========================================

  public getCrmSyncLogs(leadId?: string): CrmSyncLog[] {
    if (leadId) {
      return this.crmSyncLogs.filter((l) => l.leadId === leadId);
    }
    return [...this.crmSyncLogs];
  }

  public async syncLeadToRealatic(leadId: string): Promise<{ success: boolean; log: CrmSyncLog; lead?: Lead }> {
    const lead = this.getLeadById(leadId);
    if (!lead) {
      throw new Error(`Lead ${leadId} not found in database`);
    }

    const apiUrl = process.env.REALATIC_API_URL || 'https://api.realatic.com/v1';
    const apiKey = process.env.REALATIC_API_KEY;
    const isCredentialsConfigured = !!apiKey;

    const idempotencyKey = `idemp-${lead.id}-${Date.now()}`;
    const payload = {
      prosifyLeadId: lead.id,
      fullName: lead.name,
      phone: lead.phone,
      email: lead.email,
      source: lead.source,
      leadScore: lead.leadScore,
      qualification: lead.qualification,
      preferredLocations: lead.preferredLocations || (lead.location ? [lead.location] : []),
      budget: lead.budget,
      propertyId: lead.propertyId,
      projectId: lead.projectId,
      notes: lead.notes,
    };

    let log: CrmSyncLog;

    if (!isCredentialsConfigured) {
      // PENDING CREDENTIALS mode: Prosify source of truth preserved, does not fake external API
      log = {
        id: `crm-log-${Date.now()}`,
        leadId: lead.id,
        leadName: lead.name,
        leadPhone: lead.phone,
        crmProvider: 'REALATIC',
        requestPayload: payload,
        responsePayload: null,
        statusCode: 0,
        errorMessage: 'Integration adapter operating in PENDING CREDENTIALS mode. Configure REALATIC_API_KEY in environment to activate external synchronization.',
        syncStatus: 'PENDING',
        idempotencyKey,
        syncTimestamp: new Date().toISOString(),
      };

      lead.crmSyncStatus = 'PENDING';
      this.crmSyncLogs.unshift(log);

      this.addAuditLog(
        'CRM_SYNC_PENDING',
        'CrmSyncLog',
        `Realatic sync queued in PENDING CREDENTIALS mode for ${lead.name}`,
        log.id
      );

      return { success: false, log, lead };
    }

    // Realatic external API call when credentials exist
    try {
      const res = await fetch(`${apiUrl}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json().catch(() => ({}));
      const success = res.ok;

      log = {
        id: `crm-log-${Date.now()}`,
        leadId: lead.id,
        leadName: lead.name,
        leadPhone: lead.phone,
        crmProvider: 'REALATIC',
        requestPayload: payload,
        responsePayload: responseData,
        statusCode: res.status,
        errorMessage: success ? undefined : `CRM responded with status ${res.status}`,
        syncStatus: success ? 'SYNCED' : 'FAILED',
        idempotencyKey,
        syncTimestamp: new Date().toISOString(),
      };

      if (success) {
        lead.realaticLeadId = (responseData as any)?.leadId || (responseData as any)?.id || `RLTC-${Date.now().toString().slice(-5)}`;
        lead.crmSyncStatus = 'SYNCED';
        lead.crmLastSyncedAt = new Date().toISOString();
      } else {
        lead.crmSyncStatus = 'FAILED';
      }

      this.crmSyncLogs.unshift(log);

      this.addAuditLog(
        'CRM_SYNC_ATTEMPT',
        'CrmSyncLog',
        `Realatic sync for ${lead.name}: Status ${log.syncStatus} (HTTP ${res.status})`,
        log.id
      );

      return { success, log, lead };
    } catch (err: any) {
      log = {
        id: `crm-log-${Date.now()}`,
        leadId: lead.id,
        leadName: lead.name,
        leadPhone: lead.phone,
        crmProvider: 'REALATIC',
        requestPayload: payload,
        responsePayload: null,
        statusCode: 500,
        errorMessage: err.message || 'Network error connecting to Realatic API gateway',
        syncStatus: 'FAILED',
        idempotencyKey,
        syncTimestamp: new Date().toISOString(),
      };

      lead.crmSyncStatus = 'FAILED';
      this.crmSyncLogs.unshift(log);

      this.addAuditLog(
        'CRM_SYNC_FAILED',
        'CrmSyncLog',
        `Realatic CRM sync error for ${lead.name}: ${err.message}`,
        log.id
      );

      return { success: false, log, lead };
    }
  }

  public async retryCrmSync(logId: string): Promise<{ success: boolean; log: CrmSyncLog }> {
    const existingLog = this.crmSyncLogs.find((l) => l.id === logId);
    if (!existingLog) {
      throw new Error(`Sync log ${logId} not found`);
    }

    const res = await this.syncLeadToRealatic(existingLog.leadId);
    return { success: res.success, log: res.log };
  }

  // ==========================================
  // 10. AI GOVERNANCE & AGENT ACTION AUDIT LOGS
  // ==========================================

  public getAiAgentActions(): AiAgentAction[] {
    return [...this.aiAgentActions];
  }

  public logAiAgentAction(action: Omit<AiAgentAction, 'id' | 'createdAt'>): AiAgentAction {
    const newAction: AiAgentAction = {
      ...action,
      id: `ai-act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };

    this.aiAgentActions.unshift(newAction);
    return newAction;
  }

  public approveAiAgentAction(id: string, approvedBy: string): AiAgentAction | undefined {
    const act = this.aiAgentActions.find((a) => a.id === id);
    if (!act) return undefined;

    act.isApproved = true;
    act.approvedBy = approvedBy;
    act.approvedAt = new Date().toISOString();

    this.addAuditLog(
      'AI_ACTION_APPROVAL',
      'AiAgentAction',
      `Officer ${approvedBy} approved ${act.agentName} agent action ${id}`,
      id
    );

    return act;
  }

  // ==========================================
  // 11. AFFILIATE & REFERRAL NETWORK ENGINE
  // ==========================================

  public getAffiliates(): AffiliateUser[] {
    return [...this.affiliates];
  }

  public getAffiliateById(id: string): AffiliateUser | undefined {
    return this.affiliates.find((a) => a.id === id);
  }

  public getAffiliateByCode(code: string): AffiliateUser | undefined {
    return this.affiliates.find(
      (a) => (a.affiliateCode || a.referralCode || '').toUpperCase() === code.toUpperCase()
    );
  }

  public registerAffiliate(data: {
    name: string;
    email: string;
    phone: string;
    agencyName?: string;
    city: string;
    upiId?: string;
    bankAccountNumber?: string;
    bankIfsc?: string;
  }): AffiliateUser {
    const existing = this.affiliates.find((a) => a.email.toLowerCase() === data.email.toLowerCase());
    if (existing) return existing;

    const cityPrefix = data.city ? data.city.substring(0, 3).toUpperCase() : 'MUM';
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const affiliateCode = `PROSIFY-${cityPrefix}-${randNum}`;

    const newAffiliate: AffiliateUser = {
      id: `aff-${Date.now()}`,
      affiliateCode,
      referralCode: affiliateCode,
      name: data.name,
      email: data.email,
      phone: data.phone,
      agencyName: data.agencyName || 'Independent Affiliate',
      city: data.city || 'Mumbai',
      tier: 'BRONZE',
      commissionRatePercent: this.affiliateSettings.defaultCommissionRate || this.affiliateSettings.defaultCommissionPercent || 2.5,
      fixedBonusPerVisit: this.affiliateSettings.leadRewardAmount || 1000,
      status: this.affiliateSettings.autoApproveAffiliates ? 'ACTIVE' : 'PENDING',
      totalClicks: 0,
      totalLeads: 0,
      totalSiteVisits: 0,
      totalDealsClosed: 0,
      totalEarned: 0,
      totalEarnings: 0,
      payableBalance: 0,
      paidAmount: 0,
      unpaidEarnings: 0,
      payoutDetails: {
        payoutType: 'UPI',
        upiId: data.upiId || 'affiliate@upi',
      },
      upiId: data.upiId,
      bankAccountNumber: data.bankAccountNumber,
      bankIfsc: data.bankIfsc,
      joinedAt: new Date().toISOString().split('T')[0],
    };

    this.affiliates.unshift(newAffiliate);

    // Also register a short tracking link for this affiliate
    this.createTrackingLink({
      partnerId: newAffiliate.id,
      targetUrl: '/',
      utmSource: 'affiliate',
      utmMedium: 'referral',
      utmCampaign: affiliateCode.toLowerCase(),
    });

    this.addAuditLog(
      'AFFILIATE_REGISTERED',
      'AffiliateUser',
      `New affiliate ${newAffiliate.name} (${newAffiliate.affiliateCode}) registered`,
      newAffiliate.id
    );

    return newAffiliate;
  }

  public updateAffiliateStatus(id: string, status: AffiliateUser['status']): boolean {
    const aff = this.affiliates.find((a) => a.id === id);
    if (!aff) return false;
    aff.status = status;
    return true;
  }

  public getAffiliateConversions(affiliateId?: string): AffiliateConversion[] {
    if (affiliateId) {
      return this.affiliateConversions.filter((c) => c.affiliateId === affiliateId);
    }
    return [...this.affiliateConversions];
  }

  public recordAffiliateConversion(data: any): AffiliateConversion {
    const conv: AffiliateConversion = {
      buyerName: 'Valued Client',
      buyerPhone: '+91 98000 00000',
      propertyTitle: 'Luxury Residence',
      city: 'Mumbai',
      dealValue: 10000000,
      commissionPercent: 2.0,
      ...data,
      id: `aconv-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.affiliateConversions.unshift(conv);

    // Update affiliate counters
    const aff = this.affiliates.find((a) => a.id === data.affiliateId);
    if (aff) {
      aff.totalLeads = (aff.totalLeads || 0) + 1;
      if (data.stage === 'SITE_VISIT_DONE') aff.totalSiteVisits = (aff.totalSiteVisits || 0) + 1;
      if (data.stage === 'TOKEN_BOOKED' || data.stage === 'COMMISSION_APPROVED') {
        aff.totalDealsClosed = (aff.totalDealsClosed || 0) + 1;
        aff.totalEarnings = (aff.totalEarnings || 0) + data.commissionAmount;
        aff.unpaidEarnings = (aff.unpaidEarnings || 0) + data.commissionAmount;
      }
    }

    return conv;
  }

  public getAffiliatePayoutRequests(): AffiliatePayoutRequest[] {
    return [...this.affiliatePayouts];
  }

  public requestAffiliatePayout(data: {
    affiliateId: string;
    amount: number;
    payoutMethod: AffiliatePayoutRequest['payoutMethod'];
    payoutDetails: string;
  }): AffiliatePayoutRequest {
    const aff = this.affiliates.find((a) => a.id === data.affiliateId);
    const tdsAmount = Math.round((data.amount * (this.affiliateSettings.tdsDeductionPercent || 5)) / 100);
    const netAmount = data.amount - tdsAmount;

    const req: AffiliatePayoutRequest = {
      id: `apayout-${Date.now()}`,
      affiliateId: data.affiliateId,
      affiliateName: aff ? aff.name : 'Unknown Affiliate',
      affiliateCode: aff ? aff.affiliateCode : 'UNKNOWN',
      amount: data.amount,
      tdsAmount,
      netAmount,
      payoutMethod: data.payoutMethod,
      payoutDetails: data.payoutDetails,
      status: 'PENDING',
      requestDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    this.affiliatePayouts.unshift(req);
    return req;
  }

  public approveAffiliatePayout(requestId: string, transactionRef: string): boolean {
    const req = this.affiliatePayouts.find((p) => p.id === requestId);
    if (!req) return false;

    req.status = 'APPROVED';
    req.transactionRef = transactionRef;
    req.processedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Deduct from affiliate unpaid earnings
    const aff = this.affiliates.find((a) => a.id === req.affiliateId);
    if (aff) {
      aff.unpaidEarnings = Math.max(0, (aff.unpaidEarnings || 0) - req.amount);
    }

    this.addAuditLog(
      'AFFILIATE_PAYOUT_APPROVED',
      'AffiliatePayout',
      `Approved ₹${req.amount} payout for ${req.affiliateName} (${req.affiliateCode}) ref: ${transactionRef}`,
      req.id
    );

    return true;
  }

  public getAffiliateCreatives(): AffiliateCreative[] {
    return [...this.affiliateCreatives];
  }

  public getAffiliateSettings(): AffiliateProgramSettings {
    return { ...this.affiliateSettings };
  }

  public updateAffiliateSettings(data: Partial<AffiliateProgramSettings>): AffiliateProgramSettings {
    this.affiliateSettings = {
      ...this.affiliateSettings,
      ...data,
    };
    return { ...this.affiliateSettings };
  }
}

// Export singleton instance
export const store = new RealEstateStore();
