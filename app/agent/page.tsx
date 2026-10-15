'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  Building2,
  Layers,
  MessageSquare,
  User,
  Edit3,
  KeyRound,
  LogOut,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  Smartphone,
  Eye,
  EyeOff,
  X,
  Filter,
  AlertCircle,
  IndianRupee,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Menu,
  Upload,
  Star,
  Image as ImageIcon,
  Link as LinkIcon,
  Camera,
  FolderPlus,
  ArrowRight,
} from 'lucide-react';
import { ProsifyAnimatedLogo } from '@/components/brand/ProsifyAnimatedLogo';
import { useToast } from '@/components/ui/toast';
import { formatIndianPrice } from '@/lib/utils';
import { store } from '@/lib/data/store';
import { PAN_INDIA_CITIES } from '@/lib/data/panIndiaData';
import {
  PortalUser,
  authenticatePortalUser,
  authenticatePortalUserWithCloud,
  getPortalSession,
  setPortalSession,
  clearPortalSession,
  getPortalUsers,
  updatePortalUser,
  updatePortalUserPassword,
} from '@/lib/auth/portalUsers';
import {
  getScopedAgentData,
  saveScopedAgentData,
  ScopedAgentData,
} from '@/lib/auth/scopedPortalStorage';

// Curated High-Definition Architectural Photos for Agent Properties
const PRESET_AGENT_PROPERTY_PHOTOS = [
  {
    name: 'Modern High-Rise Façade',
    tag: 'Tower Exterior',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Luxury Living Room & Deck',
    tag: 'Living Area',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Master Suite with Skyline View',
    tag: 'Master Bedroom',
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Designer Italian Modular Kitchen',
    tag: 'Kitchen',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Infinity Pool & Club Resort',
    tag: 'Amenities',
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Panoramic Sunset Balcony View',
    tag: 'Balcony / View',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Contemporary Grand Villa Entrance',
    tag: 'Villa Architecture',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Opulent Marble Spa Bathroom',
    tag: 'Bathroom',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&auto=format&fit=crop&q=80',
  },
];

// Types for Agent Portal
interface AgentProperty {
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

interface AgentProject {
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

interface PropertyMessage {
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

interface AgentProfileData {
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

// Initial Sample Data for Agent
const INITIAL_AGENT_PROPERTIES: AgentProperty[] = [
  {
    id: 'ap-1',
    title: 'Godrej Riviera 2 BHK Luxury Deck Residence',
    developerName: 'Godrej Properties',
    projectName: 'Godrej Riviera',
    city: 'Mumbai',
    locality: 'Kalyan West',
    price: 8800000,
    carpetArea: 820,
    bhk: '2 BHK',
    propertyType: 'APARTMENT',
    possessionStatus: 'UNDER_CONSTRUCTION',
    possessionDate: 'Dec 2026',
    reraNumber: 'P51700032441',
    isFeatured: true,
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    inquiriesCount: 14,
    createdAt: '2026-02-10',
  },
  {
    id: 'ap-2',
    title: 'Lodha Palava Lakeshore Greens 3 BHK Park View',
    developerName: 'Lodha Group',
    projectName: 'Lodha Palava City',
    city: 'Dombivli',
    locality: 'Kalyan-Shil Road',
    price: 9800000,
    carpetArea: 1050,
    bhk: '3 BHK',
    propertyType: 'APARTMENT',
    possessionStatus: 'READY_TO_MOVE',
    possessionDate: 'Ready',
    reraNumber: 'P51700000125',
    isFeatured: true,
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    inquiriesCount: 22,
    createdAt: '2026-01-18',
  },
  {
    id: 'ap-3',
    title: 'Kalpataru Paramount 2 BHK Smart Modern Tower',
    developerName: 'Kalpataru Limited',
    projectName: 'Kalpataru Paramount',
    city: 'Thane',
    locality: 'Kapurbawdi, Thane West',
    price: 12500000,
    carpetArea: 760,
    bhk: '2 BHK',
    propertyType: 'APARTMENT',
    possessionStatus: 'UNDER_CONSTRUCTION',
    possessionDate: 'Jun 2027',
    reraNumber: 'P51700021488',
    isFeatured: false,
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=80',
    inquiriesCount: 9,
    createdAt: '2026-03-01',
  },
  {
    id: 'ap-4',
    title: 'Rustomjee Crown 4 BHK Ultra Luxury Sky Mansion',
    developerName: 'Rustomjee Builders',
    projectName: 'Rustomjee Crown',
    city: 'Mumbai',
    locality: 'Prabhadevi, South Mumbai',
    price: 65000000,
    carpetArea: 2450,
    bhk: '4 BHK',
    propertyType: 'PENTHOUSE',
    possessionStatus: 'UNDER_CONSTRUCTION',
    possessionDate: 'Dec 2026',
    reraNumber: 'P51900003268',
    isFeatured: true,
    status: 'SOLD',
    coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80',
    inquiriesCount: 31,
    createdAt: '2025-11-20',
  },
];

const INITIAL_AGENT_PROJECTS: AgentProject[] = [
  {
    id: 'aprj-1',
    name: 'Godrej Riviera Waterfront Enclave',
    developerName: 'Godrej Properties',
    city: 'Mumbai',
    locality: 'Kalyan West',
    reraNumber: 'P51700032441',
    totalTowers: 4,
    totalUnits: 480,
    minPrice: 6500000,
    maxPrice: 18500000,
    launchYear: 2024,
    possessionDate: 'Dec 2026',
    constructionStatus: 'UNDER_CONSTRUCTION',
    featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    brochureUrl: '#brochure-godrej',
  },
  {
    id: 'aprj-2',
    name: 'Lodha Palava Smart Integrated City',
    developerName: 'Lodha Group',
    city: 'Dombivli',
    locality: 'Palava City Hub',
    reraNumber: 'P51700000125',
    totalTowers: 16,
    totalUnits: 2400,
    minPrice: 4200000,
    maxPrice: 14500000,
    launchYear: 2023,
    possessionDate: 'Ready & Phased',
    constructionStatus: 'READY_TO_MOVE',
    featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    brochureUrl: '#brochure-lodha',
  },
  {
    id: 'aprj-3',
    name: 'Kalpataru Paramount High Street',
    developerName: 'Kalpataru Limited',
    city: 'Thane',
    locality: 'Kapurbawdi Junction',
    reraNumber: 'P51700021488',
    totalTowers: 5,
    totalUnits: 650,
    minPrice: 11000000,
    maxPrice: 28000000,
    launchYear: 2024,
    possessionDate: 'Jun 2027',
    constructionStatus: 'UNDER_CONSTRUCTION',
    featuredImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=80',
    brochureUrl: '#brochure-kalpataru',
  },
];

const INITIAL_PROPERTY_MESSAGES: PropertyMessage[] = [
  {
    id: 'pm-101',
    propertyId: 'ap-1',
    propertyTitle: 'Godrej Riviera 2 BHK Luxury Deck Residence',
    buyerName: 'Vikram & Sunita Mehra',
    buyerPhone: '+91 98201 44556',
    buyerEmail: 'vikram.mehra@gmail.com',
    message: 'Hello! We are looking for an east-facing 2 BHK on a higher floor (above 15th). Can we schedule a site visit this Saturday morning at 11:30 AM?',
    preferredTime: 'Saturday 11:30 AM',
    status: 'NEW',
    createdAt: '2026-09-30 14:20',
  },
  {
    id: 'pm-102',
    propertyId: 'ap-2',
    propertyTitle: 'Lodha Palava Lakeshore Greens 3 BHK Park View',
    buyerName: 'Dr. Sameer Kulkarni',
    buyerPhone: '+91 98190 23456',
    buyerEmail: 'sameer.kulkarni@apollo.org',
    message: 'Interested in the ready-to-move 3 BHK. Please share all-inclusive cost sheet with stamp duty and registration breakdown.',
    preferredTime: 'Any weekday evening',
    status: 'CONTACTED',
    createdAt: '2026-09-29 11:05',
  },
  {
    id: 'pm-103',
    propertyId: 'ap-3',
    propertyTitle: 'Kalpataru Paramount 2 BHK Smart Modern Tower',
    buyerName: 'Ananya Singhal',
    buyerPhone: '+91 99870 12345',
    buyerEmail: 'ananya.singhal@tcs.com',
    message: 'We liked the Thane location. Is developer subvention (10:90 scheme) still available on this unit?',
    preferredTime: 'Sunday 3:00 PM',
    status: 'SITE_VISIT_BOOKED',
    createdAt: '2026-09-28 17:40',
  },
];

const INITIAL_AGENT_PROFILE: AgentProfileData = {
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
};

export default function AgentAdminPage() {
  const { toast } = useToast();

  // Session & Auth (Empty by default - no prefilled credentials)
  const [session, setSession] = useState<PortalUser | null>(() => getPortalSession('AGENT'));
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Menu / Navigation Key matching user requirement:
  // - Dashboard
  // - Property Management: Add Property, Manage Properties, Property Messages
  // - Project Management: Add Project, Manage Projects
  // - Edit Profile
  // - Change Password
  // - Logout
  // - Agent Profile
  type AgentMenuKey =
    | 'dashboard'
    | 'prop-add'
    | 'prop-manage'
    | 'prop-messages'
    | 'proj-add'
    | 'proj-manage'
    | 'profile'
    | 'edit-profile'
    | 'change-password';

  const [activeMenu, setActiveMenu] = useState<AgentMenuKey>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Accordion Expand/Collapse state
  const [propAccordionOpen, setPropAccordionOpen] = useState(true);
  const [projAccordionOpen, setProjAccordionOpen] = useState(true);

  // Track all registered Agent Accounts from Admin
  const [allAgentAccounts, setAllAgentAccounts] = useState<PortalUser[]>([]);

  useEffect(() => {
    const loadAccounts = () => {
      const users = getPortalUsers();
      setAllAgentAccounts(users.filter((u) => u.role === 'AGENT'));
    };
    loadAccounts();
    window.addEventListener('eni_portal_users_updated', loadAccounts);
    return () => window.removeEventListener('eni_portal_users_updated', loadAccounts);
  }, []);

  // Scoped Data State for this specific Agent ID
  const [scopedData, setScopedData] = useState<ScopedAgentData | null>(null);

  // Data Collections (strictly isolated to logged-in Agent ID)
  const [properties, setProperties] = useState<AgentProperty[]>([]);
  const [projects, setProjects] = useState<AgentProject[]>([]);
  const [messages, setMessages] = useState<PropertyMessage[]>([]);
  const [profile, setProfile] = useState<AgentProfileData>(INITIAL_AGENT_PROFILE);

  // Sync isolated agent data whenever session changes
  useEffect(() => {
    if (session?.id) {
      const data = getScopedAgentData(session.id, session);
      setScopedData(data);
      setProperties(data.properties);
      setProjects(data.projects);
      setMessages(data.messages);
      setProfile(data.profile);
      setEditProfileForm(data.profile);
    } else {
      setScopedData(null);
      setProperties([]);
      setProjects([]);
      setMessages([]);
      setProfile(INITIAL_AGENT_PROFILE);
      setEditProfileForm(INITIAL_AGENT_PROFILE);
    }
  }, [session?.id]);

  const persistScopedAgentPatch = (patch: Partial<ScopedAgentData>) => {
    if (!session?.id) return;
    const current = scopedData || getScopedAgentData(session.id, session);
    const updated: ScopedAgentData = {
      ...current,
      ...patch,
    };
    setScopedData(updated);
    saveScopedAgentData(session.id, updated);
  };

  const handleQuickLoginAs = (agentUser: PortalUser) => {
    setUsernameInput(agentUser.username);
    setPasswordInput(agentUser.password);
    setPortalSession('AGENT', agentUser);
    setSession(agentUser);
    toast({
      title: 'Switched Agent Account',
      description: `Logged in as ${agentUser.name} (${agentUser.assignedCode || 'AGT'})`,
      type: 'success',
    });
  };

  // Search & Filter state
  const [propSearch, setPropSearch] = useState('');
  const [propCityFilter, setPropCityFilter] = useState('ALL');
  const [propStatusFilter, setPropStatusFilter] = useState('ALL');

  const [projSearch, setProjSearch] = useState('');
  const [projCityFilter, setProjCityFilter] = useState('ALL');

  const [messageSearch, setMessageSearch] = useState('');

  // Forms State
  const [newPropForm, setNewPropForm] = useState({
    title: '',
    developerName: 'Godrej Properties',
    projectName: '',
    city: 'Mumbai',
    locality: '',
    price: 8500000,
    carpetArea: 800,
    bhk: '2 BHK',
    propertyType: 'APARTMENT',
    possessionStatus: 'UNDER_CONSTRUCTION',
    possessionDate: 'Dec 2026',
    reraNumber: 'P51700032441',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    ] as string[],
    isFeatured: true,
  });

  // Media Tab and Image Upload State for Property
  const [activeMediaTab, setActiveMediaTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isReadingFiles, setIsReadingFiles] = useState(false);
  const propertyFileInputRef = useRef<HTMLInputElement | null>(null);

  // Edit property modal state
  const [editingProperty, setEditingProperty] = useState<AgentProperty | null>(null);
  const [editMediaTab, setEditMediaTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [editCustomImageUrl, setEditCustomImageUrl] = useState('');
  const [isEditDragging, setIsEditDragging] = useState(false);
  const editPropertyFileInputRef = useRef<HTMLInputElement | null>(null);

  const [newProjForm, setNewProjForm] = useState({
    name: '',
    developerName: 'Godrej Properties',
    city: 'Mumbai',
    locality: '',
    reraNumber: 'P51700032441',
    totalTowers: 4,
    totalUnits: 380,
    minPrice: 7500000,
    maxPrice: 22000000,
    launchYear: 2024,
    possessionDate: 'Dec 2026',
    constructionStatus: 'UNDER_CONSTRUCTION',
    featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
  });

  const [editProfileForm, setEditProfileForm] = useState<AgentProfileData>(INITIAL_AGENT_PROFILE);

  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // --- Image Upload & Management Handlers for Add Property ---
  const processAgentPropertyFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsReadingFiles(true);
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (valid.length === 0) {
      toast({
        title: 'Unsupported File Format',
        description: 'Please upload JPG, PNG, or WebP images.',
        type: 'error',
      });
      setIsReadingFiles(false);
      return;
    }

    let loaded = 0;
    const addedUrls: string[] = [];
    valid.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const res = e.target?.result as string;
        if (res) addedUrls.push(res);
        loaded++;
        if (loaded === valid.length) {
          setNewPropForm((prev) => {
            const merged = [...prev.images, ...addedUrls];
            return {
              ...prev,
              images: merged,
              coverImage: prev.coverImage || merged[0],
            };
          });
          setIsReadingFiles(false);
          toast({
            title: `${addedUrls.length} Photo${addedUrls.length > 1 ? 's' : ''} Uploaded`,
            description: 'Images successfully attached to your property gallery.',
            type: 'success',
          });
        }
      };
      reader.onerror = () => {
        loaded++;
        if (loaded === valid.length) setIsReadingFiles(false);
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePropFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processAgentPropertyFiles(e.target.files);
    }
  };

  const handlePropDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processAgentPropertyFiles(e.dataTransfer.files);
    }
  };

  const handleAddPropImageUrl = () => {
    if (!customImageUrl.trim() || (!customImageUrl.startsWith('http://') && !customImageUrl.startsWith('https://') && !customImageUrl.startsWith('data:image'))) {
      toast({
        title: 'Invalid Image Link',
        description: 'Please enter a valid web image URL (starting with http:// or https://).',
        type: 'error',
      });
      return;
    }
    const cleanUrl = customImageUrl.trim();
    setNewPropForm((prev) => {
      const nextImages = prev.images.includes(cleanUrl) ? prev.images : [...prev.images, cleanUrl];
      return {
        ...prev,
        images: nextImages,
        coverImage: prev.coverImage || cleanUrl,
      };
    });
    setCustomImageUrl('');
    toast({
      title: 'Photo Added',
      description: 'Image link attached to listing gallery.',
      type: 'success',
    });
  };

  const handleAddPresetPhoto = (url: string, name: string) => {
    setNewPropForm((prev) => {
      if (prev.images.includes(url)) {
        toast({
          title: 'Already Selected',
          description: `${name} is already attached to this listing.`,
          type: 'info',
        });
        return prev;
      }
      toast({
        title: 'Architectural Photo Added',
        description: `${name} attached to gallery.`,
        type: 'success',
      });
      return {
        ...prev,
        images: [...prev.images, url],
        coverImage: prev.coverImage || url,
      };
    });
  };

  const handleSetPropCover = (url: string) => {
    setNewPropForm((prev) => ({ ...prev, coverImage: url }));
    toast({
      title: 'Cover Photo Set',
      description: 'This image is now the primary card cover.',
      type: 'success',
    });
  };

  const handleRemovePropImage = (indexToRemove: number) => {
    setNewPropForm((prev) => {
      const filtered = prev.images.filter((_, idx) => idx !== indexToRemove);
      let newCover = prev.coverImage;
      if (prev.coverImage === prev.images[indexToRemove]) {
        newCover = filtered[0] || '';
      }
      return {
        ...prev,
        images: filtered,
        coverImage: newCover,
      };
    });
    toast({
      title: 'Photo Removed',
      description: 'Image removed from listing gallery.',
      type: 'info',
    });
  };

  // --- Handlers for Editing Existing Property ---
  const handleOpenEditProperty = (prop: AgentProperty) => {
    const existingImages = prop.images && prop.images.length > 0 ? prop.images : [prop.coverImage];
    setEditingProperty({
      ...prop,
      images: existingImages,
      coverImage: prop.coverImage || existingImages[0] || '',
    });
    setEditCustomImageUrl('');
  };

  const handleSaveEditedProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    const nextProps = properties.map((p) => (p.id === editingProperty.id ? editingProperty : p));
    setProperties(nextProps);
    persistScopedAgentPatch({ properties: nextProps });

    // Also update global store
    try {
      store.updateProperty(editingProperty.id, {
        title: editingProperty.title,
        price: editingProperty.price,
        carpetArea: editingProperty.carpetArea,
        bhk: editingProperty.bhk,
        city: editingProperty.city,
        locality: editingProperty.locality,
        coverImage: editingProperty.coverImage,
        images: editingProperty.images || [editingProperty.coverImage],
        reraNumber: editingProperty.reraNumber,
      });
    } catch {
      // ignore
    }

    toast({
      title: 'Property Listing Updated',
      description: `${editingProperty.title} updated with latest details and photos.`,
      type: 'success',
    });
    setEditingProperty(null);
  };

  const handleProcessEditPropertyFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0 || !editingProperty) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (valid.length === 0) {
      toast({
        title: 'Unsupported Format',
        description: 'Please upload JPG, PNG, or WebP images.',
        type: 'error',
      });
      return;
    }

    let loaded = 0;
    const addedUrls: string[] = [];
    valid.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const res = e.target?.result as string;
        if (res) addedUrls.push(res);
        loaded++;
        if (loaded === valid.length) {
          setEditingProperty((prev) => {
            if (!prev) return null;
            const currentImages = prev.images || [];
            const merged = [...currentImages, ...addedUrls];
            return {
              ...prev,
              images: merged,
              coverImage: prev.coverImage || merged[0],
            };
          });
          toast({
            title: `${addedUrls.length} Photo${addedUrls.length > 1 ? 's' : ''} Added`,
            description: 'New images attached.',
            type: 'success',
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddEditImageUrl = () => {
    if (!editCustomImageUrl.trim() || !editingProperty) return;
    const clean = editCustomImageUrl.trim();
    setEditingProperty((prev) => {
      if (!prev) return null;
      const current = prev.images || [];
      const updated = current.includes(clean) ? current : [...current, clean];
      return {
        ...prev,
        images: updated,
        coverImage: prev.coverImage || clean,
      };
    });
    setEditCustomImageUrl('');
    toast({
      title: 'Image URL Attached',
      description: 'Photo added to property.',
      type: 'success',
    });
  };

  const handleAddEditPreset = (url: string, name: string) => {
    if (!editingProperty) return;
    setEditingProperty((prev) => {
      if (!prev) return null;
      const current = prev.images || [];
      if (current.includes(url)) {
        toast({ title: 'Already Added', description: `${name} is in gallery.`, type: 'info' });
        return prev;
      }
      return {
        ...prev,
        images: [...current, url],
        coverImage: prev.coverImage || url,
      };
    });
    toast({ title: 'Preset Photo Attached', description: `${name} added.`, type: 'success' });
  };

  // Authentication Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    const result = await authenticatePortalUserWithCloud(usernameInput, passwordInput, 'AGENT');
    if (result.success && result.user) {
      setPortalSession('AGENT', result.user);
      setSession(result.user);
      toast({
        title: 'Welcome Back, Agent Partner!',
        description: `Logged in as ${result.user.name}`,
        type: 'success',
      });
    } else {
      setLoginError(result.error || 'Authentication failed. Please verify credentials.');
    }
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    clearPortalSession('AGENT');
    setSession(null);
    toast({
      title: 'Logged Out Successfully',
      description: 'Your agent session has been closed.',
      type: 'info',
    });
  };

  // Add Property Handler
  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropForm.title || !newPropForm.locality) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please specify Property Title and Locality.',
        type: 'error',
      });
      return;
    }

    const finalCover = newPropForm.coverImage || (newPropForm.images && newPropForm.images[0]) || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
    const finalImages = newPropForm.images && newPropForm.images.length > 0 ? newPropForm.images : [finalCover];

    const created: AgentProperty = {
      id: `ap-${Date.now().toString().slice(-4)}`,
      title: newPropForm.title,
      developerName: newPropForm.developerName,
      projectName: newPropForm.projectName || newPropForm.title,
      city: newPropForm.city,
      locality: newPropForm.locality,
      price: Number(newPropForm.price) || 5000000,
      carpetArea: Number(newPropForm.carpetArea) || 650,
      bhk: newPropForm.bhk,
      propertyType: newPropForm.propertyType,
      possessionStatus: newPropForm.possessionStatus,
      possessionDate: newPropForm.possessionDate,
      reraNumber: newPropForm.reraNumber,
      isFeatured: newPropForm.isFeatured,
      status: 'ACTIVE',
      coverImage: finalCover,
      images: finalImages,
      inquiriesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const nextProps = [created, ...properties];
    setProperties(nextProps);
    persistScopedAgentPatch({ properties: nextProps });

    // Also register into global marketplace store
    try {
      store.createProperty({
        title: created.title,
        slug: created.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        listingType: 'BUY',
        propertyType: (created.propertyType as any) || 'APARTMENT',
        price: created.price,
        pricePerSqft: Math.round(created.price / created.carpetArea),
        bhk: created.bhk,
        carpetArea: created.carpetArea,
        builtUpArea: Math.round(created.carpetArea * 1.3),
        possessionStatus: (created.possessionStatus as any) || 'UNDER_CONSTRUCTION',
        possessionDate: created.possessionDate,
        isVerified: true,
        isFeatured: Boolean(created.isFeatured),
        isPublished: true,
        reraNumber: created.reraNumber,
        city: created.city,
        locality: created.locality,
        address: `${created.locality}, ${created.city}`,
        developerName: created.developerName,
        projectName: created.projectName,
        coverImage: created.coverImage,
        images: finalImages,
        amenities: ['Clubhouse', 'Swimming Pool', '24x7 Security', 'Power Backup', 'Gymnasium', 'Landscaped Garden'],
        description: `${created.title} by ${created.developerName}. Premium ${created.bhk} residence with carpet area of ${created.carpetArea} sq.ft. MahaRERA: ${created.reraNumber}. Listed directly by verified Channel Partner.`,
      });
    } catch {
      // ignore
    }

    setActiveMenu('prop-manage');
    toast({
      title: 'Property Listed Successfully!',
      description: `${created.title} is now active with ${finalImages.length} attached photos.`,
      type: 'success',
    });

    // Reset Form
    setNewPropForm({
      title: '',
      developerName: 'Godrej Properties',
      projectName: '',
      city: 'Mumbai',
      locality: '',
      price: 8500000,
      carpetArea: 800,
      bhk: '2 BHK',
      propertyType: 'APARTMENT',
      possessionStatus: 'UNDER_CONSTRUCTION',
      possessionDate: 'Dec 2026',
      reraNumber: 'P51700032441',
      coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
      ],
      isFeatured: true,
    });
  };

  // Add Project Handler
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjForm.name || !newProjForm.locality) {
      toast({
        title: 'Missing Fields',
        description: 'Please provide Project Name and Locality.',
        type: 'error',
      });
      return;
    }

    const created: AgentProject = {
      id: `aprj-${Date.now().toString().slice(-4)}`,
      name: newProjForm.name,
      developerName: newProjForm.developerName,
      city: newProjForm.city,
      locality: newProjForm.locality,
      reraNumber: newProjForm.reraNumber,
      totalTowers: Number(newProjForm.totalTowers) || 4,
      totalUnits: Number(newProjForm.totalUnits) || 200,
      minPrice: Number(newProjForm.minPrice) || 5000000,
      maxPrice: Number(newProjForm.maxPrice) || 15000000,
      launchYear: Number(newProjForm.launchYear) || 2024,
      possessionDate: newProjForm.possessionDate,
      constructionStatus: newProjForm.constructionStatus,
      featuredImage: newProjForm.featuredImage,
    };

    const nextProjects = [created, ...projects];
    setProjects(nextProjects);
    persistScopedAgentPatch({ projects: nextProjects });

    // Register into global store so it reflects on public website & admin panel
    try {
      store.createProject({
        name: created.name,
        slug: created.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        developerId: 'dev-1',
        developerName: created.developerName,
        city: created.city,
        locality: created.locality,
        address: `${created.locality}, ${created.city}`,
        startingPrice: created.minPrice,
        priceRange: `₹${(created.minPrice / 100000).toFixed(0)} Lakh - ₹${(created.maxPrice / 10000000).toFixed(1)} Cr`,
        configurations: '1 BHK, 2 BHK & 3 BHK',
        totalUnits: created.totalUnits,
        availableUnits: Math.round(created.totalUnits * 0.4),
        possessionDate: created.possessionDate,
        constructionStatus: (created.constructionStatus as any) || 'UNDER_CONSTRUCTION',
        reraNumber: created.reraNumber,
        description: `${created.name} in ${created.locality}, ${created.city}. Masterplanned community with certified lifestyle amenities.`,
        coverImage: created.featuredImage,
        gallery: [created.featuredImage],
        amenities: ['Clubhouse', 'Swimming Pool', 'Gym', '24/7 Security'],
        towers: ['Tower 1', 'Tower 2', 'Tower 3'],
        floorPlans: [],
        isFeatured: true,
      });
    } catch (err) {
      console.warn('Agent project store sync', err);
    }

    setActiveMenu('proj-manage');
    toast({
      title: 'Project Registered Successfully!',
      description: `${created.name} is now available in your agency inventory.`,
      type: 'success',
    });

    setNewProjForm({
      name: '',
      developerName: 'Godrej Properties',
      city: 'Mumbai',
      locality: '',
      reraNumber: 'P51700032441',
      totalTowers: 4,
      totalUnits: 380,
      minPrice: 7500000,
      maxPrice: 22000000,
      launchYear: 2024,
      possessionDate: 'Dec 2026',
      constructionStatus: 'UNDER_CONSTRUCTION',
      featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    });
  };

  // Delete Property Handler
  const handleDeleteProperty = (id: string) => {
    const nextProps = properties.filter((p) => p.id !== id);
    setProperties(nextProps);
    persistScopedAgentPatch({ properties: nextProps });
    toast({
      title: 'Property Removed',
      description: 'Listing has been deleted from your agent dashboard.',
      type: 'info',
    });
  };

  // Toggle Property Status
  const handleTogglePropertyStatus = (id: string) => {
    const nextProps: AgentProperty[] = properties.map((p) => {
      if (p.id === id) {
        const nextStatus: 'ACTIVE' | 'SOLD' = p.status === 'ACTIVE' ? 'SOLD' : 'ACTIVE';
        toast({
          title: `Property Status: ${nextStatus}`,
          description: `${p.title} is now marked as ${nextStatus}.`,
          type: 'info',
        });
        return { ...p, status: nextStatus };
      }
      return p;
    });
    setProperties(nextProps);
    persistScopedAgentPatch({ properties: nextProps });
  };

  // Update Message Status
  const handleUpdateMessageStatus = (id: string, status: 'CONTACTED' | 'SITE_VISIT_BOOKED') => {
    const nextMessages = messages.map((m) => (m.id === id ? { ...m, status } : m));
    setMessages(nextMessages);
    persistScopedAgentPatch({ messages: nextMessages });
    toast({
      title: `Lead Status: ${status.replace('_', ' ')}`,
      description: 'Message updated.',
      type: 'success',
    });
  };

  // Save Profile Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const nextProfile: AgentProfileData = { ...profile, ...editProfileForm };
    setProfile(nextProfile);
    persistScopedAgentPatch({ profile: nextProfile });
    if (session?.id) {
      updatePortalUser(session.id, {
        name: editProfileForm.name,
        phone: editProfileForm.phone,
        companyOrProject: editProfileForm.agencyName,
      });
    }
    setActiveMenu('profile');
    toast({
      title: 'Agent Profile Updated',
      description: 'Your public channel partner details are now up to date.',
      type: 'success',
    });
  };

  // Change Password Handler
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirm password must match.',
        type: 'error',
      });
      return;
    }
    if (changePasswordForm.newPassword.length < 6) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 6 characters.',
        type: 'error',
      });
      return;
    }

    if (session?.id) {
      updatePortalUserPassword(session.id, changePasswordForm.newPassword);
    }
    setChangePasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast({
      title: 'Password Changed Successfully',
      description: 'Your agent account credentials have been updated securely.',
      type: 'success',
    });
  };

  // Filtered Properties
  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(propSearch.toLowerCase()) ||
      p.locality.toLowerCase().includes(propSearch.toLowerCase()) ||
      p.developerName.toLowerCase().includes(propSearch.toLowerCase());
    const matchesCity = propCityFilter === 'ALL' || p.city.toLowerCase() === propCityFilter.toLowerCase();
    const matchesStatus = propStatusFilter === 'ALL' || p.status === propStatusFilter;
    return matchesSearch && matchesCity && matchesStatus;
  });

  // Filtered Projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(projSearch.toLowerCase()) ||
      p.developerName.toLowerCase().includes(projSearch.toLowerCase()) ||
      p.locality.toLowerCase().includes(projSearch.toLowerCase());
    const matchesCity = projCityFilter === 'ALL' || p.city.toLowerCase() === projCityFilter.toLowerCase();
    return matchesSearch && matchesCity;
  });

  // Listen for scoped agent updates across tabs
  useEffect(() => {
    const handleScopedSync = (e: any) => {
      if (session?.id && (!e?.detail?.agentId || e.detail.agentId === session.id)) {
        const fresh = getScopedAgentData(session.id, session);
        setScopedData(fresh);
        setProperties(fresh.properties);
        setProjects(fresh.projects);
        setMessages(fresh.messages);
        setProfile(fresh.profile);
      }
    };
    window.addEventListener('eni_agent_data_updated', handleScopedSync);
    return () => {
      window.removeEventListener('eni_agent_data_updated', handleScopedSync);
    };
  }, [session?.id]);

  // Filtered Messages (strictly isolated to this logged in agent)
  const allMessages = useMemo(() => {
    return messages;
  }, [messages]);

  const filteredMessages = allMessages.filter((m) => {
    return (
      m.buyerName.toLowerCase().includes(messageSearch.toLowerCase()) ||
      m.propertyTitle.toLowerCase().includes(messageSearch.toLowerCase()) ||
      m.buyerPhone.includes(messageSearch)
    );
  });

  // =========================================================================
  // 1. LOGIN SCREEN (IF NOT LOGGED IN)
  // =========================================================================
  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#d4a017_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
          <ProsifyAnimatedLogo
            panelType="agent"
            welcomeTitle="welcome to prosify agent"
            subtitle="Certified Channel Partner Management, Properties & Projects Hub"
          />
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4 relative z-10">
          <div className="bg-neutral-900/90 backdrop-blur-md py-7 px-6 shadow-2xl rounded-3xl border border-neutral-800 space-y-5">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Agent ID or Registered Email
                </label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter agent ID or registered email"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-neutral-300">
                    Password
                  </label>
                  <span className="text-[10px] text-neutral-400">Secure Access</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Authenticating...' : 'Sign In To Agent Panel'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="pt-2 text-center text-xs text-neutral-400 flex items-center justify-between border-t border-neutral-800 mt-4">
              <Link href="/" className="text-neutral-400 hover:text-white flex items-center gap-1">
                ← Back to Marketplace
              </Link>
              <Link href="/vendor" className="text-sky-400 hover:underline">
                Vendor Workspace →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. LOGGED IN AGENT ADMIN WORKSPACE
  // =========================================================================
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-neutral-800 text-neutral-300 md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/agent" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-sm text-white tracking-wide">PROSIFY AGENT ADMIN</span>
              <span className="text-[10px] text-amber-400 font-bold block -mt-0.5">
                RERA: {profile.reraNumber}
              </span>
            </div>
          </Link>
        </div>

        {/* Right Top Header Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
          >
            <span>Public Marketplace</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
          >
            <span>Root Admin</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          {/* Agent Profile Summary Capsule */}
          <div className="flex items-center gap-2">
            <div
              onClick={() => setActiveMenu('profile')}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-xl bg-neutral-800/80 border border-neutral-700/60 cursor-pointer hover:border-amber-500/50 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg overflow-hidden relative bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  profile.name.charAt(0)
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white block leading-tight">{profile.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {profile.assignedCode || 'AGT'}
                  </span>
                </div>
                <span className="text-[9px] text-emerald-400 font-semibold block leading-tight">
                  Isolated Account Active
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Logout / Switch Account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Left Sidebar + Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR NAVIGATION ("ek ke niche ek") */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col pt-16 md:pt-0 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          {/* Agent Header in Sidebar */}
          <div className="p-4 border-b border-neutral-800 bg-neutral-950/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-white text-xs truncate">{profile.name}</div>
                <div className="text-[10px] text-neutral-400 truncate">{profile.agencyName}</div>
                <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold">
                  {profile.reraNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links Accordion */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs">
            {/* 1. Dashboard */}
            <button
              type="button"
              onClick={() => {
                setActiveMenu('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeMenu === 'dashboard'
                  ? 'bg-amber-500 text-neutral-950 shadow-md font-black'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {/* 2. Property Management Group */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setPropAccordionOpen(!propAccordionOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-400 hover:text-white font-bold text-[11px] uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Property Management</span>
                </div>
                {propAccordionOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {propAccordionOpen && (
                <div className="pl-4 mt-1 space-y-1 border-l border-neutral-800 ml-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenu('prop-add');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'prop-add'
                        ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Property</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenu('prop-manage');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'prop-manage'
                        ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                    }`}
                  >
                    <span>Manage Properties</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-neutral-800 text-[9px] font-bold text-neutral-300">
                      {properties.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenu('prop-messages');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'prop-messages'
                        ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Property Messages</span>
                    </div>
                    {messages.filter((m) => m.status === 'NEW').length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black">
                        {messages.filter((m) => m.status === 'NEW').length}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* 3. Project Management Group */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setProjAccordionOpen(!projAccordionOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-400 hover:text-white font-bold text-[11px] uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Project Management</span>
                </div>
                {projAccordionOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {projAccordionOpen && (
                <div className="pl-4 mt-1 space-y-1 border-l border-neutral-800 ml-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenu('proj-add');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'proj-add'
                        ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenu('proj-manage');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer ${
                      activeMenu === 'proj-manage'
                        ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                    }`}
                  >
                    <span>Manage Projects</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-neutral-800 text-[9px] font-bold text-neutral-300">
                      {projects.length}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. Profile Management & Actions */}
            <div className="pt-3 border-t border-neutral-800/80 space-y-1">
              <span className="px-3 text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                Agent Account
              </span>

              <button
                type="button"
                onClick={() => {
                  setActiveMenu('profile');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  activeMenu === 'profile'
                    ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                }`}
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>Agent Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditProfileForm(profile);
                  setActiveMenu('edit-profile');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  activeMenu === 'edit-profile'
                    ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                }`}
              >
                <Edit3 className="w-4 h-4 text-blue-400" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMenu('change-password');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  activeMenu === 'change-password'
                    ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                }`}
              >
                <KeyRound className="w-4 h-4 text-purple-400" />
                <span>Change Password</span>
              </button>
            </div>
          </div>

          {/* Bottom Logout Button */}
          <div className="p-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Agent Session</span>
            </button>
          </div>
        </aside>

        {/* MAIN DISPLAY VIEW */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* =================================================================== */}
          {/* VIEW 1: DASHBOARD                                                   */}
          {/* =================================================================== */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-white">
                        Welcome, {profile.name} 👋
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active Channel Partner
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      {profile.agencyName} • MahaRERA: <strong className="text-white font-mono">{profile.reraNumber}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveMenu('prop-add')}
                      className="px-4 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Property</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveMenu('proj-add')}
                      className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-neutral-700 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Project</span>
                    </button>
                  </div>
                </div>

                {/* 4 Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-neutral-800/80">
                  <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                    <span className="text-[11px] text-neutral-400 block font-medium">My Listed Properties</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-black text-white">{properties.length}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        {properties.filter((p) => p.status === 'ACTIVE').length} Active
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                    <span className="text-[11px] text-neutral-400 block font-medium">Township Projects Represented</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-black text-cyan-400">{projects.length}</span>
                      <span className="text-[10px] text-neutral-400 font-bold">Master Projects</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                    <span className="text-[11px] text-neutral-400 block font-medium">Buyer Inquiries</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-black text-amber-400">{messages.length}</span>
                      <span className="text-[10px] text-rose-400 font-bold">
                        {messages.filter((m) => m.status === 'NEW').length} New
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                    <span className="text-[11px] text-neutral-400 block font-medium">Total Career Volume</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-emerald-400">
                        ₹{profile.totalVolumeCrores} Cr
                      </span>
                      <span className="text-[10px] text-neutral-400">({profile.totalDealsClosed} units)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Messages */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Recent Property Inquiries */}
                <div className="lg:col-span-2 bg-neutral-900 rounded-3xl border border-neutral-800 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Recent Buyer Messages & Inquiries</h3>
                      <span className="text-xs text-neutral-400">Latest messages submitted on your listed units</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveMenu('prop-messages')}
                      className="text-xs text-amber-400 font-bold hover:underline"
                    >
                      View All Messages →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {messages.slice(0, 3).map((msg) => (
                      <div
                        key={msg.id}
                        className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 hover:border-neutral-700 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{msg.buyerName}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              msg.status === 'NEW'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {msg.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-amber-400 font-semibold">{msg.propertyTitle}</div>
                        <p className="text-xs text-neutral-300 leading-relaxed">&ldquo;{msg.message}&rdquo;</p>
                        <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-800/80">
                          <span>Phone: {msg.buyerPhone}</span>
                          <span>{msg.createdAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Col: Quick Channel Partner Link */}
                <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Your Agent Referral Link</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Share your direct channel partner link. Buyers who browse or book through this link are automatically tagged to your partner code.
                    </p>

                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-neutral-300 break-all select-all">
                      https://prosify.in/?partner=AGT-882
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.clipboard) {
                          navigator.clipboard.writeText('https://prosify.in/?partner=AGT-882');
                        }
                        toast({
                          title: 'Link Copied to Clipboard',
                          description: 'https://prosify.in/?partner=AGT-882',
                          type: 'success',
                        });
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Partner Link</span>
                    </button>

                    <a
                      href="https://wa.me/?text=Namaste!%20Check%20out%20my%20verified%20properties%20with%20direct%20developer%20pricing:%20https://prosify.in/?partner=AGT-882"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Share on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW 2: PROPERTY MANAGEMENT - ADD PROPERTY (`prop-add`)              */}
          {/* =================================================================== */}
          {activeMenu === 'prop-add' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-amber-400" />
                    <span>Add New Property Listing</span>
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Publish an apartment, villa, or commercial unit to your channel inventory.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMenu('prop-manage')}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  View All Properties
                </button>
              </div>

              <form onSubmit={handleAddProperty} className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-5 text-xs shadow-2xl">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Property Title *</label>
                  <input
                    type="text"
                    required
                    value={newPropForm.title}
                    onChange={(e) => setNewPropForm({ ...newPropForm, title: e.target.value })}
                    placeholder="E.g. Godrej Horizon 2 BHK Luxury Sea View Deck"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Developer / Builder</label>
                    <select
                      value={newPropForm.developerName}
                      onChange={(e) => setNewPropForm({ ...newPropForm, developerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold focus:outline-none focus:border-amber-500"
                    >
                      <option>Godrej Properties</option>
                      <option>Lodha Group</option>
                      <option>Kalpataru Limited</option>
                      <option>Rustomjee Builders</option>
                      <option>Runwal Group</option>
                      <option>Hiranandani Communities</option>
                      <option>Independent Owner / Resale</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">City *</label>
                    <select
                      value={newPropForm.city}
                      onChange={(e) => setNewPropForm({ ...newPropForm, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold focus:outline-none focus:border-amber-500"
                    >
                      {PAN_INDIA_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Locality / Sector *</label>
                    <input
                      type="text"
                      required
                      value={newPropForm.locality}
                      onChange={(e) => setNewPropForm({ ...newPropForm, locality: e.target.value })}
                      placeholder="E.g. Baner / Bandra West"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Price (₹ INR) *</label>
                    <input
                      type="number"
                      required
                      step="50000"
                      value={newPropForm.price}
                      onChange={(e) => setNewPropForm({ ...newPropForm, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-amber-400 mt-0.5 block font-mono">
                      {formatIndianPrice(newPropForm.price)}
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Carpet Area (sq.ft)</label>
                    <input
                      type="number"
                      value={newPropForm.carpetArea}
                      onChange={(e) => setNewPropForm({ ...newPropForm, carpetArea: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Configuration (BHK)</label>
                    <select
                      value={newPropForm.bhk}
                      onChange={(e) => setNewPropForm({ ...newPropForm, bhk: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold focus:outline-none focus:border-amber-500"
                    >
                      <option>1 BHK</option>
                      <option>2 BHK</option>
                      <option>3 BHK</option>
                      <option>4 BHK</option>
                      <option>5+ BHK / Penthouse</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Possession Status</label>
                    <select
                      value={newPropForm.possessionStatus}
                      onChange={(e) => setNewPropForm({ ...newPropForm, possessionStatus: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold focus:outline-none focus:border-amber-500"
                    >
                      <option value="READY_TO_MOVE">Ready to Move</option>
                      <option value="UNDER_CONSTRUCTION">Under Construction</option>
                      <option value="NEW_LAUNCH">New Launch</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">MahaRERA Registration Number</label>
                  <input
                    type="text"
                    value={newPropForm.reraNumber}
                    onChange={(e) => setNewPropForm({ ...newPropForm, reraNumber: e.target.value.toUpperCase() })}
                    placeholder="P51700032441"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-amber-300 font-mono font-bold"
                  />
                </div>

                {/* =================================================================== */}
                {/* PROPERTY IMAGES & GALLERY UPLOADER SECTION                          */}
                {/* =================================================================== */}
                <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-amber-400" />
                        <h3 className="font-bold text-white text-xs sm:text-sm">Property Photographs & Media Gallery</h3>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                          {newPropForm.images.length} Photos Attached
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Upload photos from your computer/mobile, enter image URLs, or choose curated architectural presets.
                      </p>
                    </div>

                    {/* Mode Selector Tabs */}
                    <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveMediaTab('upload')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeMediaTab === 'upload'
                            ? 'bg-[#D4A017] text-neutral-950 shadow-xs'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload File</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveMediaTab('url')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeMediaTab === 'url'
                            ? 'bg-[#D4A017] text-neutral-950 shadow-xs'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span>Image URL</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveMediaTab('presets')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeMediaTab === 'presets'
                            ? 'bg-[#D4A017] text-neutral-950 shadow-xs'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Presets</span>
                      </button>
                    </div>
                  </div>

                  {/* TAB 1: Device File Upload (Drag & Drop + File Browser) */}
                  {activeMediaTab === 'upload' && (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingOver(true);
                      }}
                      onDragLeave={() => setIsDraggingOver(false)}
                      onDrop={handlePropDrop}
                      onClick={() => propertyFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                        isDraggingOver
                          ? 'border-amber-400 bg-amber-500/10'
                          : 'border-neutral-700 bg-neutral-900/60 hover:bg-neutral-900 hover:border-amber-500/60'
                      }`}
                    >
                      <input
                        ref={propertyFileInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handlePropFileChange}
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
                        <Upload className={`w-6 h-6 ${isReadingFiles ? 'animate-bounce' : ''}`} />
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs block">
                          {isReadingFiles ? 'Reading and processing photos...' : 'Click to upload property photos or drag & drop files here'}
                        </span>
                        <span className="text-[11px] text-neutral-400 mt-0.5 block">
                          Supports JPG, PNG, and WebP. You can select multiple images at once from your gallery or camera.
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className="px-3 py-1 rounded-xl bg-neutral-800 border border-neutral-700 text-amber-400 font-semibold text-[11px] inline-flex items-center gap-1.5 shadow-xs">
                          <Plus className="w-3.5 h-3.5" />
                          Browse Files from Device
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Image URL Input */}
                  {activeMediaTab === 'url' && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddPropImageUrl();
                            }
                          }}
                          placeholder="Paste web photo link (e.g. https://images.unsplash.com/...)"
                          className="flex-1 px-3.5 py-2.5 bg-neutral-900 rounded-xl border border-neutral-700 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddPropImageUrl}
                          className="px-4 py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Photo</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        Paste high-resolution images from Unsplash, developer links, Google Drive, or any image URL.
                      </p>
                    </div>
                  )}

                  {/* TAB 3: Curated Architectural Presets */}
                  {activeMediaTab === 'presets' && (
                    <div className="space-y-2">
                      <p className="text-[11px] text-neutral-400">
                        Click any verified photograph below to instantly attach it to this listing:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {PRESET_AGENT_PROPERTY_PHOTOS.map((preset, idx) => {
                          const isAlreadyAdded = newPropForm.images.includes(preset.url);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleAddPresetPhoto(preset.url, preset.name)}
                              className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                                isAlreadyAdded
                                  ? 'border-amber-500 bg-amber-500/15 text-white'
                                  : 'border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white'
                              }`}
                            >
                              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-neutral-700 relative">
                                <img
                                  src={preset.url}
                                  alt={preset.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="truncate min-w-0 flex-1">
                                <div className="font-bold text-[11px] truncate">{preset.name}</div>
                                <div className="text-[9px] text-neutral-400 truncate">{preset.tag}</div>
                              </div>
                              {isAlreadyAdded && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Attached Photos Preview & Management Grid */}
                  {newPropForm.images.length > 0 && (
                    <div className="pt-3 border-t border-neutral-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                          <span>Attached Gallery Photos</span>
                          <span className="text-amber-400 font-mono">({newPropForm.images.length})</span>
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          Click ⭐ to set as primary cover photo
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                        {newPropForm.images.map((imgUrl, index) => {
                          const isCover =
                            newPropForm.coverImage === imgUrl || (!newPropForm.coverImage && index === 0);

                          return (
                            <div
                              key={index}
                              className={`relative rounded-xl overflow-hidden border-2 group bg-neutral-900 transition-all ${
                                isCover
                                  ? 'border-[#D4A017] shadow-lg shadow-amber-500/20'
                                  : 'border-neutral-800 hover:border-neutral-600'
                              }`}
                            >
                              <div className="aspect-[4/3] w-full relative overflow-hidden bg-neutral-950">
                                <img
                                  src={imgUrl}
                                  alt={`Property Photo ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />

                                {/* Cover Badge */}
                                {isCover && (
                                  <div className="absolute top-1.5 left-1.5 bg-[#D4A017] text-neutral-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 z-10">
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    <span>Cover</span>
                                  </div>
                                )}

                                {/* Photo Index */}
                                {!isCover && (
                                  <span className="absolute top-1.5 left-1.5 bg-black/70 text-white font-mono text-[9px] px-1.5 py-0.2 rounded z-10">
                                    #{index + 1}
                                  </span>
                                )}

                                {/* Top Right Delete Button */}
                                <div className="absolute top-1.5 right-1.5 flex items-center gap-1 z-10">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemovePropImage(index);
                                    }}
                                    className="p-1 rounded-md bg-black/70 hover:bg-rose-600 text-white transition-colors cursor-pointer shadow-xs"
                                    title="Delete photo"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Bottom Make Cover Button */}
                                {!isCover && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPropCover(imgUrl)}
                                    className="absolute inset-x-0 bottom-0 py-1 bg-black/85 hover:bg-[#D4A017] hover:text-neutral-950 text-white text-[9px] font-bold text-center transition-colors cursor-pointer flex items-center justify-center gap-1 opacity-90 group-hover:opacity-100 z-10"
                                  >
                                    <Star className="w-2.5 h-2.5" />
                                    <span>Set as Cover</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveMenu('prop-manage')}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    Publish Property Listing
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW 3: PROPERTY MANAGEMENT - MANAGE PROPERTIES (`prop-manage`)       */}
          {/* =================================================================== */}
          {activeMenu === 'prop-manage' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
                <div>
                  <h2 className="text-base font-bold text-white">Manage My Properties</h2>
                  <span className="text-xs text-neutral-400">
                    Total {properties.length} listings in your active agency inventory
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMenu('prop-add')}
                  className="px-4 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Property</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={propSearch}
                    onChange={(e) => setPropSearch(e.target.value)}
                    placeholder="Search properties by title, developer, or locality..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={propCityFilter}
                    onChange={(e) => setPropCityFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-semibold cursor-pointer"
                  >
                    <option value="ALL">All 9 Metros</option>
                    {PAN_INDIA_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={propStatusFilter}
                    onChange={(e) => setPropStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-semibold cursor-pointer"
                  >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="SOLD">Sold</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px] font-bold">
                      <tr>
                        <th className="py-3.5 px-4">Property</th>
                        <th className="py-3.5 px-4">Location</th>
                        <th className="py-3.5 px-4">Price & Area</th>
                        <th className="py-3.5 px-4">RERA ID</th>
                        <th className="py-3.5 px-4 text-center">Inquiries</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {filteredProperties.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-800/30 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-11 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800">
                                <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs">{p.title}</div>
                                <span className="text-[10px] text-neutral-400">
                                  {p.developerName} • <strong className="text-amber-400">{p.bhk}</strong>
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-neutral-300">
                            <div>{p.locality}</div>
                            <span className="text-[10px] text-neutral-500">{p.city}</span>
                          </td>

                          <td className="py-4 px-4">
                            <div className="font-bold text-emerald-400 font-mono text-sm">
                              {formatIndianPrice(p.price)}
                            </div>
                            <span className="text-[10px] text-neutral-400">{p.carpetArea} sq.ft. carpet</span>
                          </td>

                          <td className="py-4 px-4 font-mono text-[10px] text-amber-300 font-bold">
                            {p.reraNumber || 'Applied'}
                          </td>

                          <td className="py-4 px-4 text-center font-bold text-white">
                            <span className="px-2 py-0.5 rounded-full bg-neutral-950 border border-neutral-800 text-amber-400 font-mono">
                              {p.inquiriesCount} leads
                            </span>
                          </td>

                          <td className="py-4 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                p.status === 'ACTIVE'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-neutral-800 text-neutral-400'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditProperty(p)}
                                className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white cursor-pointer"
                                title="Edit Listing & Photos"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleTogglePropertyStatus(p.id)}
                                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                  p.status === 'ACTIVE'
                                    ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                                    : 'bg-emerald-500 hover:bg-emerald-600 text-neutral-950'
                                }`}
                              >
                                {p.status === 'ACTIVE' ? 'Mark Sold' : 'Activate'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteProperty(p.id)}
                                className="p-1 rounded bg-neutral-800 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 cursor-pointer"
                                title="Delete Listing"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredProperties.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-neutral-500">
                            No properties found. Click &ldquo;Add Property&rdquo; above to list your first unit!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Edit Property & Photo Gallery Modal */}
              {editingProperty && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
                  <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-neutral-900 border border-neutral-800 p-6 space-y-5 shadow-2xl text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-amber-400" />
                          <span>Edit Property & Manage Photos</span>
                        </h3>
                        <p className="text-[11px] text-neutral-400">
                          Update listing details, pricing, and upload/rearrange property photos.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingProperty(null)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveEditedProperty} className="space-y-4">
                      <div>
                        <label className="block font-semibold text-neutral-300 mb-1">Property Title *</label>
                        <input
                          type="text"
                          required
                          value={editingProperty.title}
                          onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-semibold text-neutral-300 mb-1">Price (₹ INR)</label>
                          <input
                            type="number"
                            value={editingProperty.price}
                            onChange={(e) => setEditingProperty({ ...editingProperty, price: Number(e.target.value) })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-neutral-300 mb-1">Carpet Area (sq.ft)</label>
                          <input
                            type="number"
                            value={editingProperty.carpetArea}
                            onChange={(e) => setEditingProperty({ ...editingProperty, carpetArea: Number(e.target.value) })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-neutral-300 mb-1">Status</label>
                          <select
                            value={editingProperty.status}
                            onChange={(e) => setEditingProperty({ ...editingProperty, status: e.target.value as any })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="SOLD">SOLD</option>
                            <option value="PENDING">PENDING</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-neutral-300 mb-1">City</label>
                          <select
                            value={editingProperty.city}
                            onChange={(e) => setEditingProperty({ ...editingProperty, city: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                          >
                            {PAN_INDIA_CITIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-neutral-300 mb-1">Locality</label>
                          <input
                            type="text"
                            value={editingProperty.locality}
                            onChange={(e) => setEditingProperty({ ...editingProperty, locality: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                          />
                        </div>
                      </div>

                      {/* Photo Management in Edit Modal */}
                      <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <Camera className="w-4 h-4 text-amber-400" />
                            <span>Attached Listing Photos ({(editingProperty.images || []).length})</span>
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditMediaTab('upload')}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                editMediaTab === 'upload' ? 'bg-[#D4A017] text-neutral-950' : 'text-neutral-400'
                              }`}
                            >
                              Upload File
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditMediaTab('url')}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                editMediaTab === 'url' ? 'bg-[#D4A017] text-neutral-950' : 'text-neutral-400'
                              }`}
                            >
                              Image URL
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditMediaTab('presets')}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                editMediaTab === 'presets' ? 'bg-[#D4A017] text-neutral-950' : 'text-neutral-400'
                              }`}
                            >
                              Presets
                            </button>
                          </div>
                        </div>

                        {editMediaTab === 'upload' && (
                          <div
                            onClick={() => editPropertyFileInputRef.current?.click()}
                            className="border-2 border-dashed border-neutral-700 hover:border-amber-400 rounded-xl p-4 text-center cursor-pointer bg-neutral-900/60"
                          >
                            <input
                              ref={editPropertyFileInputRef}
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => e.target.files && handleProcessEditPropertyFiles(e.target.files)}
                              className="hidden"
                            />
                            <Upload className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                            <span className="font-bold text-white text-[11px] block">Click to upload new photos from your device</span>
                            <span className="text-[10px] text-neutral-400">Supports JPG, PNG, WebP</span>
                          </div>
                        )}

                        {editMediaTab === 'url' && (
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={editCustomImageUrl}
                              onChange={(e) => setEditCustomImageUrl(e.target.value)}
                              placeholder="Paste photo web link..."
                              className="flex-1 px-3 py-2 bg-neutral-900 rounded-xl border border-neutral-700 text-white text-xs"
                            />
                            <button
                              type="button"
                              onClick={handleAddEditImageUrl}
                              className="px-3 py-2 bg-[#D4A017] text-neutral-950 font-bold rounded-xl"
                            >
                              Attach
                            </button>
                          </div>
                        )}

                        {editMediaTab === 'presets' && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {PRESET_AGENT_PROPERTY_PHOTOS.map((p, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => handleAddEditPreset(p.url, p.name)}
                                className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-amber-500 flex items-center gap-2 text-left"
                              >
                                <img src={p.url} alt={p.name} className="w-8 h-8 rounded object-cover" />
                                <span className="text-[10px] truncate font-medium text-neutral-300">{p.name}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Thumbnails */}
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2 border-t border-neutral-800">
                          {(editingProperty.images || []).map((img, idx) => {
                            const isCover = editingProperty.coverImage === img || idx === 0;
                            return (
                              <div key={idx} className={`relative rounded-lg overflow-hidden border-2 aspect-[4/3] bg-neutral-900 ${isCover ? 'border-amber-400' : 'border-neutral-800'}`}>
                                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                                {isCover && (
                                  <span className="absolute top-1 left-1 bg-amber-400 text-neutral-950 text-[8px] font-black px-1 rounded">Cover</span>
                                )}
                                <div className="absolute top-1 right-1 flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = (editingProperty.images || []).filter((_, i) => i !== idx);
                                      setEditingProperty({
                                        ...editingProperty,
                                        images: next,
                                        coverImage: isCover ? next[0] || '' : editingProperty.coverImage,
                                      });
                                    }}
                                    className="p-0.5 rounded bg-black/80 hover:bg-rose-600 text-white"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                                {!isCover && (
                                  <button
                                    type="button"
                                    onClick={() => setEditingProperty({ ...editingProperty, coverImage: img })}
                                    className="absolute inset-x-0 bottom-0 bg-black/80 hover:bg-amber-400 hover:text-neutral-950 text-white text-[8px] font-bold py-0.5 text-center"
                                  >
                                    Set Cover
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingProperty(null)}
                          className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW 4: PROPERTY MANAGEMENT - PROPERTY MESSAGES (`prop-messages`)    */}
          {/* =================================================================== */}
          {activeMenu === 'prop-messages' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <span>Property Messages & Buyer Inquiries</span>
                  </h2>
                  <span className="text-xs text-neutral-400">
                    Inquiries received directly from prospective home buyers
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={messageSearch}
                    onChange={(e) => setMessageSearch(e.target.value)}
                    placeholder="Search by buyer or property..."
                    className="pl-9 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 hover:border-neutral-700 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{msg.buyerName}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              msg.status === 'NEW'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : msg.status === 'SITE_VISIT_BOOKED'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {msg.status.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-[11px] text-amber-400 font-semibold block mt-0.5">
                          Inquiry regarding: {msg.propertyTitle}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${msg.buyerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${msg.buyerName}, thank you for your inquiry on ${msg.propertyTitle}. I am ${profile.name} (RERA: ${profile.reraNumber}). Let me share the floor plans and cost sheet with you.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>WhatsApp Reply</span>
                        </a>

                        <a
                          href={`tel:${msg.buyerPhone.replace(/\s+/g, '')}`}
                          className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Buyer</span>
                        </a>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-200 leading-relaxed font-sans">
                      &ldquo;{msg.message}&rdquo;
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80">
                      <div className="flex items-center gap-4">
                        <span>Phone: <strong className="text-white">{msg.buyerPhone}</strong></span>
                        {msg.buyerEmail && <span>Email: <strong className="text-white">{msg.buyerEmail}</strong></span>}
                        {msg.preferredTime && <span>Preferred Visit: <strong className="text-amber-300">{msg.preferredTime}</strong></span>}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {msg.status === 'NEW' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateMessageStatus(msg.id, 'CONTACTED')}
                            className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-[10px] cursor-pointer"
                          >
                            Mark Contacted
                          </button>
                        )}
                        {msg.status !== 'SITE_VISIT_BOOKED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateMessageStatus(msg.id, 'SITE_VISIT_BOOKED')}
                            className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-600 text-neutral-950 font-black text-[10px] cursor-pointer"
                          >
                            Book Site Visit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW 5: PROJECT MANAGEMENT - ADD PROJECT (`proj-add`)                */}
          {/* =================================================================== */}
          {activeMenu === 'proj-add' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" />
                    <span>Register New Builder Project</span>
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Add a master-planned township or developer tower to your representation portfolio.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMenu('proj-manage')}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  View All Projects
                </button>
              </div>

              <form onSubmit={handleAddProject} className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-5 text-xs shadow-2xl">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={newProjForm.name}
                    onChange={(e) => setNewProjForm({ ...newProjForm, name: e.target.value })}
                    placeholder="E.g. Lodha Belmondo Golf Living / Godrej Horizon"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Developer / Builder</label>
                    <input
                      type="text"
                      required
                      value={newProjForm.developerName}
                      onChange={(e) => setNewProjForm({ ...newProjForm, developerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">City</label>
                    <select
                      value={newProjForm.city}
                      onChange={(e) => setNewProjForm({ ...newProjForm, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold focus:outline-none focus:border-cyan-500"
                    >
                      {PAN_INDIA_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Locality *</label>
                    <input
                      type="text"
                      required
                      value={newProjForm.locality}
                      onChange={(e) => setNewProjForm({ ...newProjForm, locality: e.target.value })}
                      placeholder="E.g. Baner, Pune / Majiwada, Thane"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Min Price (₹)</label>
                    <input
                      type="number"
                      value={newProjForm.minPrice}
                      onChange={(e) => setNewProjForm({ ...newProjForm, minPrice: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Max Price (₹)</label>
                    <input
                      type="number"
                      value={newProjForm.maxPrice}
                      onChange={(e) => setNewProjForm({ ...newProjForm, maxPrice: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Total Towers</label>
                    <input
                      type="number"
                      value={newProjForm.totalTowers}
                      onChange={(e) => setNewProjForm({ ...newProjForm, totalTowers: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Total Units</label>
                    <input
                      type="number"
                      value={newProjForm.totalUnits}
                      onChange={(e) => setNewProjForm({ ...newProjForm, totalUnits: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">MahaRERA Number</label>
                    <input
                      type="text"
                      value={newProjForm.reraNumber}
                      onChange={(e) => setNewProjForm({ ...newProjForm, reraNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-cyan-300 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Featured Project Banner</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={newProjForm.featuredImage}
                          onChange={(e) => setNewProjForm({ ...newProjForm, featuredImage: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                        />
                        <label className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-cyan-400 font-bold rounded-xl border border-neutral-700 flex items-center gap-1.5 cursor-pointer text-xs shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const r = new FileReader();
                                r.onload = (ev) => {
                                  if (ev.target?.result) {
                                    setNewProjForm({ ...newProjForm, featuredImage: ev.target.result as string });
                                    toast({ title: 'Banner Uploaded', description: 'Project photo updated from device.', type: 'success' });
                                  }
                                };
                                r.readAsDataURL(f);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {newProjForm.featuredImage && (
                        <div className="h-20 w-full rounded-xl overflow-hidden border border-neutral-800 relative bg-neutral-950">
                          <img src={newProjForm.featuredImage} alt="Project Preview" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                            Banner Preview
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveMenu('proj-manage')}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    Register Project
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW 6: PROJECT MANAGEMENT - MANAGE PROJECTS (`proj-manage`)          */}
          {/* =================================================================== */}
          {activeMenu === 'proj-manage' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
                <div>
                  <h2 className="text-base font-bold text-white">Manage Represented Projects</h2>
                  <span className="text-xs text-neutral-400">
                    {projects.length} verified developer townships in your agency catalogue
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMenu('proj-add')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-neutral-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Grid of Projects */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-full h-44 relative bg-neutral-950">
                        <img src={p.featuredImage} alt={p.name} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[10px] font-bold text-cyan-300">
                          {p.city}
                        </span>
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-amber-500 text-neutral-950 text-[10px] font-black uppercase">
                          {p.constructionStatus.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="text-[11px] text-amber-400 font-bold">{p.developerName}</div>
                        <h4 className="text-sm font-bold text-white leading-snug">{p.name}</h4>
                        <div className="text-xs text-neutral-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{p.locality}, {p.city}</span>
                        </div>

                        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                          <span className="text-neutral-400">Pricing Range:</span>
                          <span className="font-bold text-emerald-400 font-mono">
                            {formatIndianPrice(p.minPrice)} - {formatIndianPrice(p.maxPrice)}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1 pt-1 text-center font-mono text-[10px] text-neutral-300">
                          <div className="p-1 rounded bg-neutral-950">
                            <span className="text-neutral-500 block text-[9px]">Towers</span>
                            <strong>{p.totalTowers}</strong>
                          </div>
                          <div className="p-1 rounded bg-neutral-950">
                            <span className="text-neutral-500 block text-[9px]">Units</span>
                            <strong>{p.totalUnits}</strong>
                          </div>
                          <div className="p-1 rounded bg-neutral-950">
                            <span className="text-neutral-500 block text-[9px]">Possession</span>
                            <strong>{p.possessionDate}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-[10px] text-neutral-400 font-mono flex justify-between items-center">
                        <span>RERA: {p.reraNumber}</span>
                        <span className="text-emerald-400 font-bold">Verified</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW 7: AGENT PROFILE SHOWCASE (`profile`)                           */}
          {/* =================================================================== */}
          {activeMenu === 'profile' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden bg-neutral-800 border-2 border-amber-500/40 shrink-0">
                      <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-white">{profile.name}</h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          MahaRERA Certified
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 font-semibold mt-0.5">{profile.agencyName}</p>
                      <div className="text-[11px] text-amber-400 font-mono mt-1">
                        Registration No: <strong>{profile.reraNumber}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditProfileForm(profile);
                      setActiveMenu('edit-profile');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile Details</span>
                  </button>
                </div>

                {/* Performance Track Record */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                    <span className="text-[11px] text-neutral-400 block font-medium">Experience</span>
                    <span className="text-xl font-black text-white mt-1 block">{profile.experienceYears}+ Years</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                    <span className="text-[11px] text-neutral-400 block font-medium">Deals Closed</span>
                    <span className="text-xl font-black text-amber-400 mt-1 block">{profile.totalDealsClosed} Families</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                    <span className="text-[11px] text-neutral-400 block font-medium">Total Volume</span>
                    <span className="text-xl font-black text-emerald-400 mt-1 block">₹{profile.totalVolumeCrores} Cr</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                    <span className="text-[11px] text-neutral-400 block font-medium">Buyer Rating</span>
                    <span className="text-xl font-black text-amber-300 mt-1 block">★ {profile.rating} / 5.0</span>
                  </div>
                </div>

                {/* About & Corridors */}
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-neutral-200 uppercase tracking-wider text-[11px]">Agency Bio & Specialization</h4>
                  <p className="text-neutral-300 leading-relaxed bg-neutral-950 p-4 rounded-2xl border border-neutral-800/80">
                    {profile.bio}
                  </p>

                  <div className="pt-2">
                    <span className="text-neutral-400 font-bold block mb-1.5 text-[11px]">Operating Corridors:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.operatingCities.map((city) => (
                        <span
                          key={city}
                          className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 font-semibold"
                        >
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                      <span className="text-neutral-500 text-[10px] block">Contact Helpline</span>
                      <span className="font-bold text-white text-xs block">{profile.phone}</span>
                      <span className="text-neutral-400 text-[11px] block">{profile.email}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                      <span className="text-neutral-500 text-[10px] block">Official Agency Address</span>
                      <span className="text-neutral-300 text-xs block leading-snug">{profile.officeAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW 8: EDIT PROFILE (`edit-profile`)                                 */}
          {/* =================================================================== */}
          {activeMenu === 'edit-profile' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-amber-400" />
                    <span>Edit Agent Profile</span>
                  </h2>
                  <p className="text-xs text-neutral-400">Update your agency credentials and contact info</p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMenu('profile')}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  Back to Profile
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 text-xs shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Agent Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editProfileForm.name}
                      onChange={(e) => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Agency / Consultancy Firm Name</label>
                    <input
                      type="text"
                      value={editProfileForm.agencyName}
                      onChange={(e) => setEditProfileForm({ ...editProfileForm, agencyName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={editProfileForm.phone}
                      onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">WhatsApp Number</label>
                    <input
                      type="tel"
                      value={editProfileForm.whatsapp}
                      onChange={(e) => setEditProfileForm({ ...editProfileForm, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editProfileForm.email}
                      onChange={(e) => setEditProfileForm({ ...editProfileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">MahaRERA Registration Number</label>
                    <input
                      type="text"
                      value={editProfileForm.reraNumber}
                      onChange={(e) => setEditProfileForm({ ...editProfileForm, reraNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-amber-300 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">Avatar Photo URL</label>
                    <input
                      type="url"
                      value={editProfileForm.avatarUrl}
                      onChange={(e) => setEditProfileForm({ ...editProfileForm, avatarUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Professional Bio & Experience</label>
                  <textarea
                    rows={3}
                    value={editProfileForm.bio}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Office / Branch Address</label>
                  <input
                    type="text"
                    value={editProfileForm.officeAddress}
                    onChange={(e) => setEditProfileForm({ ...editProfileForm, officeAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveMenu('profile')}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW 9: CHANGE PASSWORD (`change-password`)                          */}
          {/* =================================================================== */}
          {activeMenu === 'change-password' && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Change Password</h2>
                <p className="text-xs text-neutral-400">Ensure your agent account remains secure</p>
              </div>

              <form onSubmit={handleChangePassword} className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 text-xs shadow-2xl">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Current Password *</label>
                  <input
                    type="password"
                    required
                    value={changePasswordForm.currentPassword}
                    onChange={(e) => setChangePasswordForm({ ...changePasswordForm, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">New Password *</label>
                  <input
                    type="password"
                    required
                    value={changePasswordForm.newPassword}
                    onChange={(e) => setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">Minimum 6 characters</span>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={changePasswordForm.confirmPassword}
                    onChange={(e) => setChangePasswordForm({ ...changePasswordForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
