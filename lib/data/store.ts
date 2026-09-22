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
  PartnerStatus,
  CommissionStatus,
  SiteVisitStatus,
  AdminNotification,
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
  private notifications: AdminNotification[] = [
    {
      id: 'notif-1',
      title: 'High-Ticket Lead Ingested',
      message: 'Ultra-luxury lead Sameer Joshi registered for Bandra Origins (Budget: ₹4.5 Cr) via Meta Ads Webhook.',
      category: 'LEAD',
      severity: 'CRITICAL',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      isRead: false,
      actionUrl: '/admin?tab=crm',
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
      actionUrl: '/admin?tab=reports',
    },
    {
      id: 'notif-5',
      title: 'Sync Center Alert: Syndication XML',
      message: 'Automated catalog sync completed successfully: 240 units synchronized, 0 schema errors.',
      category: 'SYSTEM',
      severity: 'INFO',
      timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
      isRead: true,
      actionUrl: '/admin?tab=sync',
    },
  ];

  // Default matching weights (Admin-configurable)
  private matchingWeights: MatchingWeights = {
    budget: 35,
    location: 25,
    propertyType: 15,
    bhk: 10,
    area: 10,
    possession: 5,
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

  public createLead(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: LeadStatus }): Lead {
    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}`,
      status: data.status || 'NEW',
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
    this.addAuditLog('LEAD_CREATE', 'Lead', `New lead "${newLead.name}" via ${newLead.source}`, newLead.id);
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
    propertyType?: string;
    bhk?: string;
    minArea?: number;
    possessionStatus?: string;
  }): Array<{ property: Property; score: number; matchType: 'Perfect Match' | 'Good Match' | 'Potential Match' }> {
    const w = this.matchingWeights;
    const totalWeight = w.budget + w.location + w.propertyType + w.bhk + w.area + w.possession;

    const results = this.properties.map((prop) => {
      let earnedPoints = 0;

      // 1. Budget Match
      if (criteria.budget && criteria.budget > 0) {
        if (prop.price <= criteria.budget) {
          earnedPoints += w.budget;
        } else if (prop.price <= criteria.budget * 1.15) {
          earnedPoints += w.budget * 0.6;
        }
      } else {
        earnedPoints += w.budget; // Neutral if no budget specified
      }

      // 2. Location Match
      if (criteria.location && criteria.location !== 'All') {
        const loc = criteria.location.toLowerCase();
        if (prop.city.toLowerCase() === loc || prop.locality.toLowerCase().includes(loc)) {
          earnedPoints += w.location;
        } else {
          earnedPoints += w.location * 0.2;
        }
      } else {
        earnedPoints += w.location;
      }

      // 3. Property Type Match
      if (criteria.propertyType && criteria.propertyType !== 'ALL') {
        if (prop.propertyType === criteria.propertyType) {
          earnedPoints += w.propertyType;
        }
      } else {
        earnedPoints += w.propertyType;
      }

      // 4. BHK Match
      if (criteria.bhk && criteria.bhk !== 'ALL') {
        if (prop.bhk.toLowerCase().includes(criteria.bhk.toLowerCase())) {
          earnedPoints += w.bhk;
        }
      } else {
        earnedPoints += w.bhk;
      }

      // 5. Carpet Area Match
      if (criteria.minArea && criteria.minArea > 0) {
        if (prop.carpetArea >= criteria.minArea) {
          earnedPoints += w.area;
        } else if (prop.carpetArea >= criteria.minArea * 0.85) {
          earnedPoints += w.area * 0.6;
        }
      } else {
        earnedPoints += w.area;
      }

      // 6. Possession Match
      if (criteria.possessionStatus && criteria.possessionStatus !== 'ALL') {
        if (prop.possessionStatus === criteria.possessionStatus) {
          earnedPoints += w.possession;
        }
      } else {
        earnedPoints += w.possession;
      }

      const score = Math.round((earnedPoints / totalWeight) * 100);
      let matchType: 'Perfect Match' | 'Good Match' | 'Potential Match' = 'Potential Match';
      if (score >= 85) matchType = 'Perfect Match';
      else if (score >= 65) matchType = 'Good Match';

      return { property: prop, score, matchType };
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
}

// Export singleton instance
export const store = new RealEstateStore();
