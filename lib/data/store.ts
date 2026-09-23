import {
  Property,
  Developer,
  Project,
  Lead,
  SiteVisit,
  ChannelPartner,
  ListingType,
  PropertyType,
  PossessionStatus,
  LeadStatus,
} from '../types';
import {
  INITIAL_PROPERTIES,
  INITIAL_DEVELOPERS,
  INITIAL_PROJECTS,
  INITIAL_LEADS,
  INITIAL_PARTNERS,
} from './mockData';

class ProsifyDataStore {
  private properties: Property[] = [...INITIAL_PROPERTIES];
  private developers: Developer[] = [...INITIAL_DEVELOPERS];
  private projects: Project[] = [...INITIAL_PROJECTS];
  private leads: Lead[] = [...INITIAL_LEADS];
  private siteVisits: SiteVisit[] = [];
  private partners: ChannelPartner[] = [...INITIAL_PARTNERS];

  // Properties
  getProperties(filter?: {
    city?: string;
    listingType?: ListingType | 'ALL';
    propertyType?: PropertyType | 'ALL';
    possessionStatuses?: string[];
    bhks?: string[];
    minPrice?: number;
    maxPrice?: number;
    query?: string;
    verifiedOnly?: boolean;
  }): Property[] {
    return this.properties.filter((prop) => {
      if (filter?.city && filter.city !== 'ALL' && prop.city !== filter.city) return false;
      if (filter?.listingType && filter.listingType !== 'ALL' && prop.listingType !== filter.listingType) return false;
      if (filter?.propertyType && filter.propertyType !== 'ALL' && prop.propertyType !== filter.propertyType) return false;
      if (filter?.possessionStatuses && filter.possessionStatuses.length > 0) {
        if (!filter.possessionStatuses.includes(prop.possessionStatus)) return false;
      }
      if (filter?.bhks && filter.bhks.length > 0) {
        if (!filter.bhks.some((b) => prop.bhk.includes(b))) return false;
      }
      if (filter?.minPrice && prop.price < filter.minPrice) return false;
      if (filter?.maxPrice && filter.maxPrice > 0 && prop.price > filter.maxPrice) return false;
      if (filter?.verifiedOnly && !prop.verified) return false;
      if (filter?.query) {
        const q = filter.query.toLowerCase();
        const matches =
          prop.title.toLowerCase().includes(q) ||
          prop.locality.toLowerCase().includes(q) ||
          prop.city.toLowerCase().includes(q) ||
          prop.developerName.toLowerCase().includes(q) ||
          prop.address.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }

  getPropertyById(id: string): Property | undefined {
    return this.properties.find((p) => p.id === id);
  }

  getPropertyBySlug(slug: string): Property | undefined {
    return this.properties.find((p) => p.slug === slug);
  }

  getFeaturedProperties(): Property[] {
    return this.properties.filter((p) => p.featured);
  }

  // Developers
  getDevelopers(): Developer[] {
    return [...this.developers];
  }

  getDeveloperById(id: string): Developer | undefined {
    return this.developers.find((d) => d.id === id);
  }

  getDeveloperBySlug(slug: string): Developer | undefined {
    return this.developers.find((d) => d.slug === slug);
  }

  // Projects
  getProjects(city?: string): Project[] {
    if (!city || city === 'ALL') return [...this.projects];
    return this.projects.filter((p) => p.city === city);
  }

  // Leads
  getLeads(): Lead[] {
    return [...this.leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createLead(data: Omit<Lead, 'id' | 'createdAt' | 'status'> & { status?: LeadStatus }): Lead {
    const newLead: Lead = {
      id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: data.status || 'NEW',
      ...data,
    };
    this.leads.unshift(newLead);
    return newLead;
  }

  updateLeadStatus(id: string, status: LeadStatus): Lead | undefined {
    const lead = this.leads.find((l) => l.id === id);
    if (lead) {
      lead.status = status;
    }
    return lead;
  }

  // Site Visits
  getSiteVisits(): SiteVisit[] {
    return [...this.siteVisits].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createSiteVisit(data: Omit<SiteVisit, 'id' | 'createdAt' | 'status'>): SiteVisit {
    const visit: SiteVisit = {
      id: `visit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED',
      ...data,
    };
    this.siteVisits.unshift(visit);

    // Also auto-record a corresponding lead in CRM
    this.createLead({
      name: data.leadName,
      mobile: data.leadMobile,
      email: data.leadEmail,
      propertyId: data.propertyId,
      propertyTitle: data.propertyTitle,
      requirement: `Scheduled site visit for ${data.date} (${data.timeSlot}). ${data.cabRequired ? 'Cab pickup requested from: ' + (data.pickupAddress || 'Provided location') : 'Self conveyance'}.`,
      source: 'SITE_VISIT',
      status: 'SITE_VISIT_SCHEDULED',
    });

    return visit;
  }

  // Channel Partners
  getPartners(): ChannelPartner[] {
    return [...this.partners];
  }

  createPartner(data: Omit<ChannelPartner, 'id' | 'totalLeads' | 'totalBookings' | 'active'>): ChannelPartner {
    const partner: ChannelPartner = {
      id: `cp-${Date.now()}`,
      totalLeads: 0,
      totalBookings: 0,
      active: true,
      ...data,
    };
    this.partners.unshift(partner);
    return partner;
  }
}

export const store = new ProsifyDataStore();
