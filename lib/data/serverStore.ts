import fs from 'fs';
import path from 'path';
import { Property, Project, Developer, Lead, SiteVisit, PropertyType, ListingType, PossessionStatus } from '@/lib/types';
import { INITIAL_DEVELOPERS, INITIAL_PROJECTS, INITIAL_PROPERTIES } from './mockData';
import { PAN_INDIA_PROJECTS, PAN_INDIA_PROPERTIES } from './panIndiaData';

export interface CmsSectionConfig {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  isEnabled: boolean;
  ctaText?: string;
  ctaLink?: string;
}

const DEFAULT_HOMEPAGE_CMS: CmsSectionConfig[] = [
  {
    id: 'sec-hero',
    name: 'Hero Search & Banner Section',
    title: 'Find Your Next Grade-A Dream Home in Mumbai MMR',
    subtitle: 'Direct developer pricing, 100% verified MahaRERA certifications, zero brokerage.',
    isEnabled: true,
  },
  {
    id: 'sec-about',
    name: 'About Section',
    title: 'AI-Powered Real Estate Ecosystem',
    subtitle: 'Bridging enterprise developers, channel partners, and verified buyers.',
    isEnabled: true,
  },
  {
    id: 'sec-why-us',
    name: 'Why Choose Us Section',
    title: 'Why Discerning Buyers Choose Us',
    subtitle: 'Zero AI slop, strict RERA audit compliance, guaranteed escrow transactions.',
    isEnabled: true,
  },
  {
    id: 'sec-brand',
    name: 'Top Developers Brand Marquee',
    title: 'Our Trusted Developer Partners',
    subtitle: 'Showcasing India’s premier conglomerates (Lodha, Godrej, Oberoi, Piramal, L&T Realty).',
    isEnabled: true,
  },
  {
    id: 'sec-prop',
    name: 'Property Inventory Section',
    title: 'Latest Available Residential & Commercial Units',
    subtitle: 'Real-time inventory syndicated directly via developer API.',
    isEnabled: true,
  },
  {
    id: 'sec-featured',
    name: 'Featured Property Showcase',
    title: 'Handpicked Landmark Developments',
    subtitle: 'Curated luxury towers with exclusive developer payment holidays.',
    isEnabled: true,
  },
  {
    id: 'sec-counter',
    name: 'Trust & Impact Metrics',
    title: 'Platform Trust Metrics',
    subtitle: '₹1,250+ Cr properties listed, 12,000+ satisfied homeowners.',
    isEnabled: true,
  },
  {
    id: 'sec-city',
    name: 'City / Micro-Market Showcase',
    title: 'Explore Prime Neighborhoods',
    subtitle: 'BKC, Powai, Thane, Worli, Whitefield & Pune prime zones.',
    isEnabled: true,
  },
  {
    id: 'sec-testimonial',
    name: 'Testimonials Section',
    title: 'What Verified Homebuyers Say',
    subtitle: 'Direct homeowner experiences and verified video reviews.',
    isEnabled: true,
  },
  {
    id: 'sec-vendor',
    name: 'Developer & Vendor Partner Section',
    title: 'Are You a Developer or Vendor?',
    subtitle: 'Syndicate your project and materials catalogue in 24 hours.',
    isEnabled: true,
  },
  {
    id: 'sec-subscribe',
    name: 'Newsletter & Alert Subscription',
    title: 'Stay Ahead of High-Yield New Launches',
    subtitle: 'Exclusive invitations to pre-launch rounds and price alerts.',
    isEnabled: true,
  },
];

const DATA_DIR = path.join(process.cwd(), 'data');
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const DEVELOPERS_FILE = path.join(DATA_DIR, 'developers.json');
const CMS_FILE = path.join(DATA_DIR, 'homepage_cms.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const SITE_VISITS_FILE = path.join(DATA_DIR, 'site_visits.json');

// Memory caches
let memoryProperties: Property[] | null = null;
let memoryProjects: Project[] | null = null;
let memoryDevelopers: Developer[] | null = null;
let memoryCms: CmsSectionConfig[] | null = null;
let memoryLeads: Lead[] | null = null;
let memorySiteVisits: SiteVisit[] | null = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function safeReadJson<T>(filePath: string, fallback: T): T {
  try {
    ensureDataDir();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn(`[ServerStore] Failed reading ${filePath}:`, err);
  }
  return fallback;
}

function safeWriteJson<T>(filePath: string, data: T) {
  try {
    ensureDataDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[ServerStore] Failed writing ${filePath}:`, err);
  }
}

// ----------------------------------------------------
// PROPERTIES
// ----------------------------------------------------
export function getServerProperties(): Property[] {
  if (!memoryProperties) {
    const initial = [...INITIAL_PROPERTIES, ...PAN_INDIA_PROPERTIES];
    memoryProperties = safeReadJson<Property[]>(PROPERTIES_FILE, initial);
    if (!fs.existsSync(PROPERTIES_FILE)) {
      safeWriteJson(PROPERTIES_FILE, memoryProperties);
    }
  }
  return memoryProperties;
}

export function saveServerProperties(properties: Property[]) {
  memoryProperties = [...properties];
  safeWriteJson(PROPERTIES_FILE, memoryProperties);
}

export function createServerProperty(data: Partial<Property>): Property {
  const current = getServerProperties();
  const id = data.id || `prop-${Date.now()}`;
  const slug = data.slug || (data.title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const now = new Date().toISOString();

  const newProp: Property = {
    id,
    title: data.title || 'Untitled Luxury Property',
    slug,
    listingType: data.listingType || 'BUY',
    propertyType: data.propertyType || 'APARTMENT',
    price: data.price || 10000000,
    pricePerSqft: data.pricePerSqft || Math.round((data.price || 10000000) / (data.carpetArea || 1000)),
    bhk: data.bhk || '2 BHK',
    carpetArea: data.carpetArea || 1000,
    builtUpArea: data.builtUpArea || Math.round((data.carpetArea || 1000) * 1.25),
    floorNumber: data.floorNumber || 10,
    totalFloors: data.totalFloors || 25,
    facing: data.facing || 'East',
    furnishingStatus: data.furnishingStatus || 'UNFURNISHED',
    possessionStatus: data.possessionStatus || 'READY_TO_MOVE',
    possessionDate: data.possessionDate || 'Immediate',
    isVerified: data.isVerified !== undefined ? data.isVerified : true,
    isFeatured: data.isFeatured !== undefined ? data.isFeatured : true,
    isPublished: data.isPublished !== undefined ? data.isPublished : true,
    reraNumber: data.reraNumber || 'P51800030000',
    city: data.city || 'Mumbai',
    locality: data.locality || 'Bandra West',
    address: data.address || `${data.locality || 'Bandra West'}, ${data.city || 'Mumbai'}`,
    developerId: data.developerId,
    developerName: data.developerName || 'Godrej Properties',
    projectId: data.projectId,
    projectName: data.projectName,
    coverImage: data.coverImage || data.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    images: data.images && data.images.length > 0 ? data.images : [data.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'],
    amenities: data.amenities || ['Clubhouse', 'Swimming Pool', 'Gymnasium', 'Landscaped Garden', 'Power Backup'],
    description: data.description || 'Verified grade-A luxury residence with world-class amenities.',
    createdAt: now,
    isProVerifyCertified: true,
    verificationStatus: 'PROVERIFY_PASSED',
  };

  current.unshift(newProp);
  saveServerProperties(current);
  return newProp;
}

export function updateServerProperty(id: string, data: Partial<Property>): Property | null {
  const current = getServerProperties();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated: Property = {
    ...current[index],
    ...data,
    coverImage: data.coverImage || (data.images && data.images[0]) || current[index].coverImage,
    images: data.images && data.images.length > 0 ? data.images : current[index].images,
  };

  current[index] = updated;
  saveServerProperties(current);
  return updated;
}

export function deleteServerProperty(id: string): boolean {
  const current = getServerProperties();
  const filtered = current.filter((p) => p.id !== id);
  if (filtered.length !== current.length) {
    saveServerProperties(filtered);
    return true;
  }
  return false;
}

// ----------------------------------------------------
// PROJECTS
// ----------------------------------------------------
export function getServerProjects(): Project[] {
  if (!memoryProjects) {
    const initial = [...INITIAL_PROJECTS, ...PAN_INDIA_PROJECTS];
    memoryProjects = safeReadJson<Project[]>(PROJECTS_FILE, initial);
    if (!fs.existsSync(PROJECTS_FILE)) {
      safeWriteJson(PROJECTS_FILE, memoryProjects);
    }
  }
  return memoryProjects;
}

export function saveServerProjects(projects: Project[]) {
  memoryProjects = [...projects];
  safeWriteJson(PROJECTS_FILE, memoryProjects);
}

export function createServerProject(data: Partial<Project>): Project {
  const current = getServerProjects();
  const id = data.id || `proj-${Date.now()}`;
  const slug = data.slug || (data.name || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const now = new Date().toISOString();

  const newProj: Project = {
    id,
    name: data.name || 'Untitled Signature Project',
    slug,
    developerId: data.developerId || 'dev-1',
    developerName: data.developerName || 'Godrej Properties',
    city: data.city || 'Mumbai',
    locality: data.locality || 'Worli',
    address: data.address || `${data.locality || 'Worli'}, ${data.city || 'Mumbai'}`,
    reraNumber: data.reraNumber || 'P51900018900',
    possessionDate: data.possessionDate || 'Dec 2026',
    status: data.status || 'UNDER_CONSTRUCTION',
    projectType: data.projectType || 'RESIDENTIAL',
    priceStartingFrom: data.priceStartingFrom || 15000000,
    coverImage: data.coverImage || data.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    images: data.images && data.images.length > 0 ? data.images : [data.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'],
    description: data.description || 'Prestige residential community with curated high-life amenities.',
    totalUnits: data.totalUnits || 320,
    availableUnits: data.availableUnits || 45,
    isFeatured: data.isFeatured !== undefined ? data.isFeatured : true,
    isPublished: data.isPublished !== undefined ? data.isPublished : true,
    amenities: data.amenities || ['Sky Lounge', 'Olympic Pool', 'Private Theater', 'Tennis Court'],
    configurations: data.configurations || ['2 BHK', '3 BHK', '4 BHK'],
    createdAt: now,
  };

  current.unshift(newProj);
  saveServerProjects(current);
  return newProj;
}

export function updateServerProject(id: string, data: Partial<Project>): Project | null {
  const current = getServerProjects();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated: Project = {
    ...current[index],
    ...data,
  };

  current[index] = updated;
  saveServerProjects(current);
  return updated;
}

export function deleteServerProject(id: string): boolean {
  const current = getServerProjects();
  const filtered = current.filter((p) => p.id !== id);
  if (filtered.length !== current.length) {
    saveServerProjects(filtered);
    return true;
  }
  return false;
}

// ----------------------------------------------------
// DEVELOPERS
// ----------------------------------------------------
export function getServerDevelopers(): Developer[] {
  if (!memoryDevelopers) {
    memoryDevelopers = safeReadJson<Developer[]>(DEVELOPERS_FILE, INITIAL_DEVELOPERS);
    if (!fs.existsSync(DEVELOPERS_FILE)) {
      safeWriteJson(DEVELOPERS_FILE, memoryDevelopers);
    }
  }
  return memoryDevelopers;
}

export function saveServerDevelopers(developers: Developer[]) {
  memoryDevelopers = [...developers];
  safeWriteJson(DEVELOPERS_FILE, memoryDevelopers);
}

export function createServerDeveloper(data: Partial<Developer>): Developer {
  const current = getServerDevelopers();
  const id = data.id || `dev-${Date.now()}`;
  const slug = data.slug || (data.name || 'developer').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const newDev: Developer = {
    id,
    name: data.name || 'Premier Builder Partner',
    slug,
    logoUrl: data.logoUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&auto=format&fit=crop&q=80',
    about: data.about || 'Pioneering real estate enterprise committed to architectural excellence.',
    establishedYr: data.establishedYr || 1995,
    website: data.website || 'https://prosify.in',
    contactEmail: data.contactEmail || 'sales@developer.in',
    contactPhone: data.contactPhone || '+91 22 6100 0000',
    isVerified: data.isVerified !== undefined ? data.isVerified : true,
    totalProjects: data.totalProjects || 25,
    completedProjects: data.completedProjects || 18,
    ongoingProjects: data.ongoingProjects || 5,
    upcomingProjects: data.upcomingProjects || 2,
    headquarters: data.headquarters || 'Mumbai, Maharashtra',
  };

  current.push(newDev);
  saveServerDevelopers(current);
  return newDev;
}

export function updateServerDeveloper(id: string, data: Partial<Developer>): Developer | null {
  const current = getServerDevelopers();
  const index = current.findIndex((d) => d.id === id);
  if (index === -1) return null;

  const updated: Developer = {
    ...current[index],
    ...data,
  };

  current[index] = updated;
  saveServerDevelopers(current);
  return updated;
}

export function deleteServerDeveloper(id: string): boolean {
  const current = getServerDevelopers();
  const filtered = current.filter((d) => d.id !== id);
  if (filtered.length !== current.length) {
    saveServerDevelopers(filtered);
    return true;
  }
  return false;
}

// ----------------------------------------------------
// HOMEPAGE CMS
// ----------------------------------------------------
export function getServerHomepageCms(): CmsSectionConfig[] {
  if (!memoryCms) {
    memoryCms = safeReadJson<CmsSectionConfig[]>(CMS_FILE, DEFAULT_HOMEPAGE_CMS);
    if (!fs.existsSync(CMS_FILE)) {
      safeWriteJson(CMS_FILE, memoryCms);
    }
  }
  return memoryCms;
}

export function saveServerHomepageCms(sections: CmsSectionConfig[]) {
  memoryCms = [...sections];
  safeWriteJson(CMS_FILE, memoryCms);
}

// ----------------------------------------------------
// LEADS & INQUIRIES
// ----------------------------------------------------
export function getServerLeads(): Lead[] {
  if (!memoryLeads) {
    memoryLeads = safeReadJson<Lead[]>(LEADS_FILE, []);
    if (!fs.existsSync(LEADS_FILE)) {
      safeWriteJson(LEADS_FILE, memoryLeads);
    }
  }
  return memoryLeads;
}

export function createServerLead(data: Partial<Lead>): Lead {
  const current = getServerLeads();
  const newLead: Lead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: data.name || 'Inquiring Buyer',
    email: data.email || '',
    phone: data.phone || '',
    budget: data.budget || '₹1 Cr - ₹2 Cr',
    preferredCity: data.preferredCity || 'Mumbai',
    preferredLocality: data.preferredLocality,
    preferredPropertyType: data.preferredPropertyType || 'APARTMENT',
    preferredBhk: data.preferredBhk || '2 BHK',
    status: data.status || 'NEW',
    qualification: data.qualification || 'HOT',
    leadScore: data.leadScore || 85,
    source: data.source || 'WEBSITE_ENQUIRY',
    createdAt: new Date().toISOString(),
    assignedAgentName: 'Senior Property Advisor',
    notes: data.notes || '',
    propertyId: data.propertyId,
    projectId: data.projectId,
  };

  current.unshift(newLead);
  safeWriteJson(LEADS_FILE, current);
  memoryLeads = current;
  return newLead;
}

export function updateServerLead(id: string, data: Partial<Lead>): Lead | null {
  const current = getServerLeads();
  const index = current.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const updated: Lead = {
    ...current[index],
    ...data,
  };

  current[index] = updated;
  safeWriteJson(LEADS_FILE, current);
  memoryLeads = current;
  return updated;
}

// ----------------------------------------------------
// SITE VISITS
// ----------------------------------------------------
export function getServerSiteVisits(): SiteVisit[] {
  if (!memorySiteVisits) {
    memorySiteVisits = safeReadJson<SiteVisit[]>(SITE_VISITS_FILE, []);
    if (!fs.existsSync(SITE_VISITS_FILE)) {
      safeWriteJson(SITE_VISITS_FILE, memorySiteVisits);
    }
  }
  return memorySiteVisits;
}

export function createServerSiteVisit(data: Partial<SiteVisit>): SiteVisit {
  const current = getServerSiteVisits();
  const newVisit: SiteVisit = {
    id: `sv-${Date.now()}`,
    leadId: data.leadId || '',
    leadName: data.leadName || 'Visitor',
    leadPhone: data.leadPhone || '',
    projectId: data.projectId || '',
    projectName: data.projectName || 'Luxury Residence',
    propertyId: data.propertyId,
    scheduledAt: data.scheduledAt || new Date(Date.now() + 86400000).toISOString(),
    status: data.status || 'SCHEDULED',
    feedback: data.feedback || '',
    rating: data.rating,
  };

  current.unshift(newVisit);
  safeWriteJson(SITE_VISITS_FILE, current);
  memorySiteVisits = current;
  return newVisit;
}

// ----------------------------------------------------
// RESET TO CURATED DEFAULTS
// ----------------------------------------------------
export function resetServerDataToDefaults() {
  const defaultProps = [...INITIAL_PROPERTIES, ...PAN_INDIA_PROPERTIES];
  const defaultProjs = [...INITIAL_PROJECTS, ...PAN_INDIA_PROJECTS];
  const defaultDevs = [...INITIAL_DEVELOPERS];
  const defaultCms = [...DEFAULT_HOMEPAGE_CMS];

  saveServerProperties(defaultProps);
  saveServerProjects(defaultProjs);
  saveServerDevelopers(defaultDevs);
  saveServerHomepageCms(defaultCms);

  return {
    propertiesCount: defaultProps.length,
    projectsCount: defaultProjs.length,
    developersCount: defaultDevs.length,
    cmsSectionsCount: defaultCms.length,
  };
}
