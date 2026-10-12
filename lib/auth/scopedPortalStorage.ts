'use client';

import {
  VendorPropertyItem,
  VendorProjectItem,
  PropertyMessageItem,
  VendorAgentItem,
  SupportTicketItem,
  PaymentLogItem,
} from '@/components/vendor/types';
import {
  INITIAL_VENDOR_PROPERTIES,
  INITIAL_VENDOR_PROJECTS,
  INITIAL_PROPERTY_MESSAGES,
  INITIAL_VENDOR_AGENTS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_PAYMENT_LOGS,
} from '@/components/vendor/mockVendorData';
import { PortalUser, getPortalUsers } from './portalUsers';

// ==========================================
// VENDOR SCOPED DATA ARCHITECTURE
// ==========================================

export interface VendorProfileData {
  id: string;
  name: string;
  companyName: string;
  username: string;
  phone: string;
  email: string;
  assignedCode: string;
  category: string;
  grade: string;
  gstin: string;
  pan: string;
  address: string;
  plan: string;
  status: 'ACTIVE' | 'SUSPENDED';
  joinedDate: string;
}

export interface ScopedVendorData {
  profile: VendorProfileData;
  properties: VendorPropertyItem[];
  projects: VendorProjectItem[];
  messages: PropertyMessageItem[];
  agents: VendorAgentItem[];
  tickets: SupportTicketItem[];
  payments: PaymentLogItem[];
}

const VENDOR_STORAGE_PREFIX = 'prosify_vendor_scoped_v2_';

function getDefaultVendor1Profile(): VendorProfileData {
  return {
    id: 'user-vendor-1',
    name: 'BuildTech Smart Materials & Engineering',
    companyName: 'BuildTech Materials Ltd',
    username: 'vendor@eni.com',
    phone: '+91 98201 55678',
    email: 'vendor@eni.com',
    assignedCode: 'VND-402',
    category: 'DEVELOPER',
    grade: 'GRADE_A',
    gstin: '27AABCB1234F1Z5',
    pan: 'AABCB1234F',
    address: 'Bandra-Kurla Complex (BKC), Mumbai, Maharashtra 400051',
    plan: 'ENTERPRISE',
    status: 'ACTIVE',
    joinedDate: '2026-02-15',
  };
}

export function createInitialVendorData(user: PortalUser): ScopedVendorData {
  const isDefaultSeed = user.id === 'user-vendor-1' || user.username.toLowerCase() === 'vendor@eni.com';

  if (isDefaultSeed) {
    return {
      profile: getDefaultVendor1Profile(),
      properties: [...INITIAL_VENDOR_PROPERTIES],
      projects: [...INITIAL_VENDOR_PROJECTS],
      messages: [...INITIAL_PROPERTY_MESSAGES],
      agents: [...INITIAL_VENDOR_AGENTS],
      tickets: [...INITIAL_SUPPORT_TICKETS],
      payments: [...INITIAL_PAYMENT_LOGS],
    };
  }

  // Dedicated fresh isolated workspace for any Admin-created Vendor
  const company = user.companyOrProject || user.name || 'Vendor Enterprise';
  const assignedCode = user.assignedCode || `VND-${Math.floor(100 + Math.random() * 900)}`;

  const profile: VendorProfileData = {
    id: user.id,
    name: user.name,
    companyName: company,
    username: user.username,
    phone: user.phone || '+91 98201 00000',
    email: user.username.includes('@') ? user.username : `${user.username}@prosify.in`,
    assignedCode,
    category: 'DEVELOPER',
    grade: 'PREMIUM',
    gstin: `27AAAC${Math.floor(1000 + Math.random() * 9000)}F1Z${Math.floor(1 + Math.random() * 9)}`,
    pan: `AAAC${Math.floor(1000 + Math.random() * 9000)}F`,
    address: 'Corporate Park, Level 4, Business Bay',
    plan: 'GROWTH',
    status: user.status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE',
    joinedDate: user.createdAt ? user.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
  };

  // Starter sample property tailored to this vendor so they see an active dashboard
  const starterProperties: VendorPropertyItem[] = [
    {
      id: `vp-${user.id}-1`,
      title: `${company} Signature Heights`,
      type: 'Apartment',
      city: 'Mumbai',
      location: 'BKC Annex',
      price: 24500000,
      carpetArea: 1650,
      bhk: '3 BHK',
      status: 'AVAILABLE',
      reraId: `P518000${Math.floor(10000 + Math.random() * 90000)}`,
      views: 120,
      inquiries: 5,
      createdAt: new Date().toISOString().split('T')[0],
    },
  ];

  const starterMessages: PropertyMessageItem[] = [
    {
      id: `msg-${user.id}-1`,
      senderName: 'Rohit Khandelwal',
      senderPhone: '+91 98204 11229',
      senderEmail: 'rohit.khandelwal@gmail.com',
      propertyTitle: `${company} Signature Heights`,
      message: 'Interested in booking a 3BHK unit. Please share floor plans and festive pricing.',
      timestamp: 'Today, 11:20 AM',
      status: 'NEW',
    },
  ];

  return {
    profile,
    properties: starterProperties,
    projects: [],
    messages: starterMessages,
    agents: [],
    tickets: [],
    payments: [
      {
        id: `pay-${user.id}-1`,
        txnNumber: `TXN-${assignedCode}-001`,
        description: 'Vendor Portal Activation & RERA Syndication Deposit',
        amount: 25000,
        paymentMethod: 'UPI',
        date: new Date().toISOString().split('T')[0],
        status: 'SUCCESS',
        invoiceUrl: '#',
      },
    ],
  };
}

export function getScopedVendorData(vendorId: string, fallbackUser?: PortalUser): ScopedVendorData {
  if (typeof window === 'undefined') {
    return createInitialVendorData(fallbackUser || {
      id: vendorId,
      name: 'Vendor',
      username: 'vendor@eni.com',
      role: 'VENDOR',
      password: 'password123',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      portalUrl: '/vendor',
    });
  }

  const storageKey = `${VENDOR_STORAGE_PREFIX}${vendorId}`;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.profile && Array.isArray(parsed.properties)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`Error reading scoped vendor data for ${vendorId}:`, err);
  }

  // Initialize fresh isolated data
  let targetUser = fallbackUser;
  if (!targetUser) {
    const allUsers = getPortalUsers();
    targetUser = allUsers.find((u) => u.id === vendorId || u.username === vendorId || u.assignedCode === vendorId);
  }

  const initial = createInitialVendorData(targetUser || {
    id: vendorId,
    name: 'Vendor Account',
    username: `${vendorId}@prosify.in`,
    role: 'VENDOR',
    password: 'password123',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    portalUrl: '/vendor',
  });

  saveScopedVendorData(vendorId, initial);
  return initial;
}

export function saveScopedVendorData(vendorId: string, data: ScopedVendorData): void {
  if (typeof window === 'undefined') return;
  try {
    const storageKey = `${VENDOR_STORAGE_PREFIX}${vendorId}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('eni_vendor_data_updated', { detail: { vendorId } }));
  } catch (err) {
    console.error(`Error saving scoped vendor data for ${vendorId}:`, err);
  }
}

// ==========================================
// AGENT SCOPED DATA ARCHITECTURE
// ==========================================

export interface AgentProperty {
  id: string;
  title: string;
  developerName: string;
  projectName: string;
  city: string;
  locality: string;
  price: number;
  carpetArea: number;
  bhk: string;
  propertyType: string;
  possessionStatus: string;
  possessionDate: string;
  reraNumber: string;
  isFeatured: boolean;
  status: 'ACTIVE' | 'SOLD' | 'PENDING';
  coverImage: string;
  images?: string[];
  inquiriesCount: number;
  inquiries?: number;
  views?: number;
  createdAt: string;
}

export interface AgentProject {
  id: string;
  name: string;
  developerName: string;
  city: string;
  locality: string;
  reraNumber: string;
  totalTowers: number;
  totalUnits: number;
  minPrice: number;
  maxPrice: number;
  launchYear: number;
  possessionDate: string;
  constructionStatus: string;
  featuredImage: string;
  brochureUrl?: string;
}

export interface PropertyMessage {
  id: string;
  propertyId?: string;
  propertyTitle: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  message: string;
  preferredTime?: string;
  submittedAt?: string;
  status: 'NEW' | 'CONTACTED' | 'SITE_VISIT_BOOKED' | 'RESOLVED' | string;
  createdAt?: string;
}

export interface AgentProfileData {
  id?: string;
  name: string;
  agencyName: string;
  phone: string;
  email: string;
  whatsapp: string;
  reraNumber: string;
  experienceYears: number;
  operatingCities: string[];
  specialization: string;
  bio: string;
  officeAddress?: string;
  avatarUrl?: string;
  rating?: number;
  totalDealsClosed?: number;
  totalVolumeCrores?: number;
  assignedCode?: string;
  tier?: string;
  commissionRate?: string;
  status?: 'ACTIVE' | 'SUSPENDED';
}

export interface ScopedAgentData {
  profile: AgentProfileData;
  properties: AgentProperty[];
  projects: AgentProject[];
  messages: PropertyMessage[];
  stats: {
    rating: number;
    totalDealsClosed: number;
    totalVolumeCrores: number;
  };
}

const AGENT_STORAGE_PREFIX = 'prosify_agent_scoped_v2_';

function getDefaultAgent1Seed(): ScopedAgentData {
  return {
    profile: {
      id: 'user-agent-1',
      name: 'Suresh Patil',
      agencyName: 'Patil Realty Advisory & Channel Partners',
      phone: '+91 97654 32109',
      email: 'agent@eni.com',
      whatsapp: '+91 97654 32109',
      reraNumber: 'A51900018742',
      experienceYears: 12,
      operatingCities: ['Mumbai', 'Thane', 'Dombivli', 'Kalyan', 'Pune'],
      specialization: 'Luxury Residential & High-Rise Townships',
      bio: 'Certified Senior Channel Partner with 12+ years of experience across Mumbai MMR and Pune. Trusted advisor for over 350+ happy families with 100% verified RERA documentation and direct developer pricing access.',
      officeAddress: 'Suite 402, Platinum Techno Park, Sector 30A, Vashi / Bandra West, Mumbai',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      rating: 4.9,
      totalDealsClosed: 142,
      totalVolumeCrores: 68.5,
      assignedCode: 'AGT-882',
      tier: 'PLATINUM',
      commissionRate: '2.5%',
      status: 'ACTIVE',
    },
    properties: [
      {
        id: 'ag-prop-1',
        title: 'Lodha Crown Grand 3BHK Residence',
        developerName: 'Lodha Group',
        projectName: 'Lodha Crown',
        city: 'Thane',
        locality: 'Majiwada Junction',
        price: 18500000,
        carpetArea: 1045,
        bhk: '3 BHK',
        propertyType: 'Apartment',
        possessionStatus: 'READY_TO_MOVE',
        possessionDate: 'Ready',
        reraNumber: 'P51700020088',
        isFeatured: true,
        status: 'ACTIVE',
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
        inquiriesCount: 28,
        views: 640,
        createdAt: '2026-09-01',
      },
      {
        id: 'ag-prop-2',
        title: 'Godrej Bayview Ultra Sea-Facing Suite',
        developerName: 'Godrej Properties',
        projectName: 'Godrej Bayview',
        city: 'Mumbai',
        locality: 'Worli',
        price: 49000000,
        carpetArea: 2400,
        bhk: '4 BHK',
        propertyType: 'Penthouse',
        possessionStatus: 'UNDER_CONSTRUCTION',
        possessionDate: 'Dec 2026',
        reraNumber: 'P51900001234',
        isFeatured: true,
        status: 'ACTIVE',
        coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
        inquiriesCount: 42,
        views: 1120,
        createdAt: '2026-09-10',
      },
      {
        id: 'ag-prop-3',
        title: 'Hiranandani Estate Rodas Enclave Villa',
        developerName: 'Hiranandani Group',
        projectName: 'Rodas Enclave',
        city: 'Thane',
        locality: 'Ghopbunder Road',
        price: 36000000,
        carpetArea: 2900,
        bhk: '4 BHK',
        propertyType: 'Villa',
        possessionStatus: 'READY_TO_MOVE',
        possessionDate: 'Ready',
        reraNumber: 'P51700005678',
        isFeatured: false,
        status: 'ACTIVE',
        coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
        inquiriesCount: 16,
        views: 390,
        createdAt: '2026-09-14',
      },
    ],
    projects: [
      {
        id: 'ag-proj-1',
        name: 'Godrej Riviera Waterfront Towers',
        developerName: 'Godrej Properties',
        city: 'Kalyan - Mumbai MMR',
        locality: 'Ambivli West',
        reraNumber: 'P51700032519',
        totalTowers: 6,
        totalUnits: 720,
        minPrice: 5500000,
        maxPrice: 14500000,
        launchYear: 2024,
        possessionDate: 'Dec 2026',
        constructionStatus: 'UNDER_CONSTRUCTION',
        featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
      },
    ],
    messages: [
      {
        id: 'ag-msg-1',
        propertyTitle: 'Lodha Crown Grand 3BHK Residence',
        buyerName: 'Dr. Amitav Banerjee',
        buyerPhone: '+91 98203 44551',
        buyerEmail: 'banerjee.ortho@gmail.com',
        message: 'Looking for high floor with east sunlight. Available for site inspection this Saturday.',
        preferredTime: 'Saturday, 11:30 AM',
        status: 'NEW',
        createdAt: '2026-09-25T10:14:00.000Z',
      },
      {
        id: 'ag-msg-2',
        propertyTitle: 'Godrej Bayview Ultra Sea-Facing Suite',
        buyerName: 'Meera & Rajesh Nambiar',
        buyerPhone: '+91 99301 22889',
        buyerEmail: 'rajesh.nambiar@techsol.com',
        message: 'Requesting RERA allotment contract draft and spot payment schedule.',
        preferredTime: 'Sunday, 3:00 PM',
        status: 'CONTACTED',
        createdAt: '2026-09-24T16:45:00.000Z',
      },
    ],
    stats: {
      rating: 4.9,
      totalDealsClosed: 142,
      totalVolumeCrores: 68.5,
    },
  };
}

export function createInitialAgentData(user: PortalUser): ScopedAgentData {
  const isDefaultSeed = user.id === 'user-agent-1' || user.username.toLowerCase() === 'agent@eni.com';
  if (isDefaultSeed) {
    return getDefaultAgent1Seed();
  }

  // Dedicated fresh isolated workspace for any Admin-created Agent
  const assignedCode = user.assignedCode || `AGT-${Math.floor(1000 + Math.random() * 9000)}`;
  const cleanAgency = user.companyOrProject || `${user.name} Realty Consultants`;

  const profile: AgentProfileData = {
    id: user.id,
    name: user.name,
    agencyName: cleanAgency,
    phone: user.phone || '+91 97654 00000',
    email: user.username.includes('@') ? user.username : `${user.username}@prosify.in`,
    whatsapp: user.phone || '+91 97654 00000',
    reraNumber: `A519000${Math.floor(10000 + Math.random() * 90000)}`,
    experienceYears: 6,
    operatingCities: ['Mumbai MMR', 'Pune'],
    specialization: 'RERA Verified Residences & Investor Portfolios',
    bio: `Licensed RERA Channel Partner (${assignedCode}) representing verified premium developments. Committed to client satisfaction, seamless documentation, and optimal pricing.`,
    officeAddress: 'Suite 204, Executive Chambers, Central Avenue, Mumbai MMR',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    rating: 4.8,
    totalDealsClosed: 12,
    totalVolumeCrores: 9.2,
    assignedCode,
    tier: 'GOLD',
    commissionRate: '2.5%',
    status: user.status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE',
  };

  // Starter portfolio specific to this agent
  const starterProperties: AgentProperty[] = [
    {
      id: `ag-prop-${user.id}-1`,
      title: `${cleanAgency} Premium Allotment Residence`,
      developerName: 'Godrej Properties',
      projectName: 'Godrej Horizon',
      city: 'Mumbai',
      locality: 'Wadala Central',
      price: 26500000,
      carpetArea: 1350,
      bhk: '3 BHK',
      propertyType: 'Apartment',
      possessionStatus: 'UNDER_CONSTRUCTION',
      possessionDate: 'Dec 2026',
      reraNumber: `P519000${Math.floor(10000 + Math.random() * 90000)}`,
      isFeatured: true,
      status: 'ACTIVE',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
      inquiriesCount: 4,
      views: 85,
      createdAt: new Date().toISOString().split('T')[0],
    },
  ];

  const starterMessages: PropertyMessage[] = [
    {
      id: `ag-msg-${user.id}-1`,
      propertyTitle: `${cleanAgency} Premium Allotment Residence`,
      buyerName: 'Pooja Venkatesh',
      buyerPhone: '+91 98205 77661',
      buyerEmail: 'pooja.venkatesh@gmail.com',
      message: `Hello ${user.name}, I found your RERA listing on the portal. Can we schedule a virtual walkthrough or visit this weekend?`,
      preferredTime: 'Sunday, 4:00 PM',
      status: 'NEW',
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    profile,
    properties: starterProperties,
    projects: [],
    messages: starterMessages,
    stats: {
      rating: 4.8,
      totalDealsClosed: 12,
      totalVolumeCrores: 9.2,
    },
  };
}

export function getScopedAgentData(agentId: string, fallbackUser?: PortalUser): ScopedAgentData {
  if (typeof window === 'undefined') {
    return createInitialAgentData(fallbackUser || {
      id: agentId,
      name: 'Agent',
      username: 'agent@eni.com',
      role: 'AGENT',
      password: 'password123',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      portalUrl: '/agent',
    });
  }

  const storageKey = `${AGENT_STORAGE_PREFIX}${agentId}`;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.profile && Array.isArray(parsed.properties)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`Error reading scoped agent data for ${agentId}:`, err);
  }

  // Initialize fresh isolated data
  let targetUser = fallbackUser;
  if (!targetUser) {
    const allUsers = getPortalUsers();
    targetUser = allUsers.find((u) => u.id === agentId || u.username === agentId || u.assignedCode === agentId);
  }

  const initial = createInitialAgentData(targetUser || {
    id: agentId,
    name: 'Agent Account',
    username: `${agentId}@prosify.in`,
    role: 'AGENT',
    password: 'password123',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    portalUrl: '/agent',
  });

  saveScopedAgentData(agentId, initial);
  return initial;
}

export function saveScopedAgentData(agentId: string, data: ScopedAgentData): void {
  if (typeof window === 'undefined') return;
  try {
    const storageKey = `${AGENT_STORAGE_PREFIX}${agentId}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('eni_agent_data_updated', { detail: { agentId } }));
  } catch (err) {
    console.error(`Error saving scoped agent data for ${agentId}:`, err);
  }
}
