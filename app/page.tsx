'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  Building2,
  MapPin,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Users,
  Building,
  PhoneCall,
  SlidersHorizontal,
  Home,
  Check,
  Rocket,
  Briefcase,
  Shield,
  UserCheck,
  Scale,
  Share2,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { PropertyCard } from '@/components/marketplace/PropertyCard';
import { ProjectCard } from '@/components/marketplace/ProjectCard';
import { EnquiryModal } from '@/components/marketplace/EnquiryModal';
import { SiteVisitModal } from '@/components/marketplace/SiteVisitModal';
import { SmartMatcherModal } from '@/components/marketplace/SmartMatcherModal';
import { PropertyRequirementModal } from '@/components/marketplace/PropertyRequirementModal';
import { MetaInstantFormModal } from '@/components/leadgen/MetaInstantFormModal';
import { LocalSeoConsultantsSection } from '@/components/leadgen/LocalSeoConsultantsSection';
import { useLiveStore } from '@/lib/data/useLiveStore';
import { CITY_HUBS } from '@/lib/data/panIndiaData';
import { Property, Project } from '@/lib/types';
import { formatIndianPrice } from '@/lib/utils';
import { useAuth } from '@/lib/auth/authContext';
import { useToast } from '@/components/ui/toast';
import { useFestivalTheme } from '@/components/theme/FestivalThemeProvider';

export default function HomePage() {
  const router = useRouter();
  const { toggleCompareProperty, comparedPropertyIds } = useAuth();
  const { toast } = useToast();
  const { properties: allProperties, projects: allProjects, developers: allDevelopers, cities } = useLiveStore();
  const {
    config: themeConfig,
    currentTheme,
    activeAccentColor,
    activeBannerImage,
    activeBadgeText,
  } = useFestivalTheme();

  // Search form state
  const [searchTab, setSearchTab] = useState<'BUY' | 'PROJECTS' | 'COMMERCIAL'>('BUY');
  const [city, setCity] = useState('All');
  const [propertyType, setPropertyType] = useState('ALL');
  const [budget, setBudget] = useState('ALL');
  const [bhk, setBhk] = useState('ALL');
  const [query, setQuery] = useState('');

  // Modals state
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [matcherOpen, setMatcherOpen] = useState(false);
  const [requirementOpen, setRequirementOpen] = useState(false);
  const [metaModalOpen, setMetaModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Compare properties
  const [comparedProperties, setComparedProperties] = useState<Property[]>([]);

  // Get reactive data from live synchronized store
  const featuredProperties = useMemo(() => allProperties.filter((p) => p.isFeatured).slice(0, 6), [allProperties]);
  const projects = useMemo(() => allProjects.slice(0, 6), [allProjects]);
  const developers = useMemo(() => allDevelopers.slice(0, 6), [allDevelopers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTab === 'PROJECTS') {
      if (city !== 'All') params.set('city', city);
      if (query) params.set('q', query);
      router.push(`/projects?${params.toString()}`);
      return;
    }

    if (searchTab !== 'BUY') params.set('type', searchTab);
    if (city !== 'All') params.set('city', city);
    if (propertyType !== 'ALL') params.set('propertyType', propertyType);
    if (bhk !== 'ALL') params.set('bhk', bhk);
    if (query) params.set('q', query);
    router.push(`/properties?${params.toString()}`);
  };

  const handleOpenEnquiry = (property?: Property) => {
    setSelectedProperty(property || null);
    setSelectedProject(null);
    setEnquiryOpen(true);
  };

  const handleOpenSiteVisit = (property?: Property) => {
    setSelectedProperty(property || null);
    setSelectedProject(null);
    setVisitOpen(true);
  };

  const handleToggleCompare = (property: Property) => {
    const isCurrentlyCompared = comparedPropertyIds.includes(property.id);
    if (!isCurrentlyCompared && comparedPropertyIds.length >= 4) {
      toast({
        title: 'Comparison Limit Reached',
        description: 'You can compare up to 4 properties at once.',
        type: 'warning',
      });
      return;
    }
    toggleCompareProperty(property.id);
  };

  const locations = CITY_HUBS;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50">
      <Navbar
        onOpenEnquiry={() => handleOpenEnquiry()}
        onOpenMatcher={() => setMatcherOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative bg-[#0F172A] text-white overflow-hidden py-16 lg:py-24">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src={
              themeConfig.isEnabled && activeBannerImage
                ? activeBannerImage
                : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80'
            }
            alt={themeConfig.isEnabled ? `${currentTheme.name} Festive Background` : 'Luxury Architecture'}
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#D4A017]/20 text-[#F4C430] border border-[#D4A017]/40 backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>India’s Most Trusted Direct Developer Real Estate Marketplace</span>
              </div>

              {themeConfig.isEnabled && (
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md"
                  style={{
                    backgroundColor: `${activeAccentColor}25`,
                    color: activeAccentColor,
                    borderColor: `${activeAccentColor}50`,
                  }}
                >
                  <span>{currentTheme.iconEmoji}</span>
                  <span>{activeBadgeText || currentTheme.name}</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Find Your Perfect Home Across Top Indian Metros
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed">
              Explore verified properties, new launch projects, and high-yield real estate investments across Mumbai, Pune, Bangalore, Hyderabad, Chennai, Delhi, Noida, Gurugram, and Ahmedabad with direct RERA transparency.
            </p>
          </div>

          {/* Multi-Tab Search Box */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 text-neutral-900 border border-neutral-200/80">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-4 mb-4 overflow-x-auto">
              {[
                { key: 'BUY', label: 'Buy Property' },
                { key: 'PROJECTS', label: 'New Projects' },
                { key: 'COMMERCIAL', label: 'Commercial' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSearchTab(tab.key as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                    searchTab === tab.key
                      ? 'bg-[#171717] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setMatcherOpen(true)}
                className="ml-auto px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
                <span className="hidden sm:inline">AI Smart Match</span>
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              {/* City Selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                  Location / City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-800"
                  >
                    <option value="All">All 9 Indian Metros</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-800"
                >
                  <option value="ALL">All Property Types</option>
                  <option value="APARTMENT">Apartment / Flat</option>
                  <option value="VILLA">Villa / Row House</option>
                  <option value="PENTHOUSE">Penthouse</option>
                  <option value="PLOT">Residential Plot</option>
                  <option value="OFFICE">Office Space</option>
                  <option value="SHOP">Retail Shop</option>
                </select>
              </div>

              {/* Configuration BHK */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                  BHK Config
                </label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-800"
                >
                  <option value="ALL">Any Configuration</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK+</option>
                </select>
              </div>

              {/* Keyword / Project */}
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                  Project or Locality
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Godrej, Bandra..."
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div>
                <button
                  type="submit"
                  style={themeConfig.isEnabled ? { backgroundColor: activeAccentColor } : {}}
                  className={`w-full py-2.5 px-4 rounded-xl ${
                    themeConfig.isEnabled
                      ? 'text-neutral-950 font-black shadow-lg'
                      : 'bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 font-bold shadow-md'
                  } text-xs sm:text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2`}
                >
                  <Search className="w-4 h-4" />
                  <span>Search Properties</span>
                </button>
              </div>
            </form>

            {/* Direct Requirement Quick Trigger */}
            <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Can&apos;t find the exact home or budget you are looking for?</span>
              </div>
              <button
                type="button"
                onClick={() => setRequirementOpen(true)}
                className="font-bold text-[#b88912] hover:text-[#916b0b] flex items-center gap-1.5 transition-colors underline underline-offset-4 cursor-pointer"
              >
                <span>Tell Us Your Property Requirement</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Creative & Attractive Desktop Options & Services Showcase */}
      <section className="py-10 bg-white border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-900 border border-amber-500/20 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>Marketplace Options & Services</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                Explore All Platform Options & Services
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Direct access to verified buyer inventories, new launches, commercial spaces, and smart advisory tools
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMatcherOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>AI Smart Match</span>
              </button>
              <button
                type="button"
                onClick={() => setRequirementOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-neutral-950 text-amber-300 hover:bg-neutral-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Post Requirement</span>
              </button>
            </div>
          </div>

          {/* 10 Creative Interactive Option Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {[
              {
                title: 'Buy Verified Homes',
                subtitle: 'Residential Real Estate',
                desc: 'Luxury Apartments, Villas & Penthouses',
                badge: '0% Brokerage',
                badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                icon: Home,
                href: '/properties?type=BUY',
                gradient: 'from-amber-500/15 via-amber-50/40 to-transparent',
                iconBg: 'bg-amber-100 text-amber-800',
              },
              {
                title: 'New Launch Projects',
                subtitle: 'Direct Pre-Launch Inventory',
                desc: 'Priority builder allocations & early discounts',
                badge: 'Hot Launch',
                badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
                icon: Rocket,
                href: '/properties?possession=NEW_LAUNCH',
                gradient: 'from-rose-500/15 via-rose-50/40 to-transparent',
                iconBg: 'bg-rose-100 text-rose-800',
              },
              {
                title: 'Commercial & Retail',
                subtitle: 'Grade-A Prime Assets',
                desc: 'Grade-A tech parks, retail shops & offices',
                badge: 'High Yield',
                badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
                icon: Briefcase,
                href: '/properties?type=COMMERCIAL',
                gradient: 'from-sky-500/15 via-sky-50/40 to-transparent',
                iconBg: 'bg-sky-100 text-sky-800',
              },
              {
                title: 'Pan-India Metros',
                subtitle: '9 Top Growth Cities',
                desc: 'Mumbai, Pune, Bengaluru, Hyderabad & NCR',
                badge: 'Pan-India',
                badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
                icon: MapPin,
                href: '/micro-markets',
                gradient: 'from-purple-500/15 via-purple-50/40 to-transparent',
                iconBg: 'bg-purple-100 text-purple-800',
              },
              {
                title: 'AI Smart Property Match',
                subtitle: 'Intelligent Advisory',
                desc: 'Algorithmic matching for budget & metro',
                badge: 'Instant AI',
                badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
                icon: Sparkles,
                onClick: () => setMatcherOpen(true),
                gradient: 'from-amber-500/15 via-amber-100/40 to-transparent',
                iconBg: 'bg-amber-100 text-amber-900',
              },
              {
                title: 'Verified RERA Projects',
                subtitle: '100% Legal Clearance',
                desc: 'Curated master developments & township plans',
                badge: 'RERA Clear',
                badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                icon: ShieldCheck,
                href: '/projects',
                gradient: 'from-emerald-500/15 via-emerald-50/40 to-transparent',
                iconBg: 'bg-emerald-100 text-emerald-800',
              },
              {
                title: 'Luxury Villas & Estates',
                subtitle: 'Signature Living',
                desc: 'Private pools, golf estates & penthouses',
                badge: 'Elite Luxury',
                badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
                icon: Award,
                href: '/properties?type=BUY',
                gradient: 'from-cyan-500/15 via-cyan-50/40 to-transparent',
                iconBg: 'bg-cyan-100 text-cyan-800',
              },
              {
                title: 'Top Tier Developers',
                subtitle: 'Grade-A Builders',
                desc: 'Godrej, Lodha, Prestige, Sobha & DLF',
                badge: 'Reputed',
                badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
                icon: Building2,
                href: '/developers',
                gradient: 'from-slate-500/15 via-slate-50/40 to-transparent',
                iconBg: 'bg-slate-100 text-slate-800',
              },
              {
                title: 'Affiliate Program',
                subtitle: 'Referral Rewards',
                desc: 'Earn 3% direct commissions per booking',
                badge: 'Earn 3%',
                badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                icon: Share2,
                href: '/affiliate?tab=dashboard',
                gradient: 'from-emerald-500/15 via-emerald-50/40 to-transparent',
                iconBg: 'bg-emerald-100 text-emerald-800',
              },
              {
                title: 'Property Comparison',
                subtitle: 'Side-by-Side Analysis',
                desc: 'Compare 4 homes by price, carpet & RERA',
                badge: 'Side-by-Side',
                badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
                icon: Scale,
                href: '/compare',
                gradient: 'from-blue-500/15 via-blue-50/40 to-transparent',
                iconBg: 'bg-blue-100 text-blue-800',
              },
            ].map((option, idx) => {
              const Icon = option.icon;
              const CardContent = (
                <div className={`group relative h-full bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer active:scale-[0.98]`}>
                  {/* Subtle Top Gradient Accent on Hover */}
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${option.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

                  <div>
                    {/* Top row: Icon and Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className={`w-10 h-10 rounded-xl ${option.iconBg} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${option.badgeColor}`}>
                        {option.badge}
                      </span>
                    </div>

                    {/* Titles */}
                    <div className="space-y-0.5 mb-1.5">
                      <h3 className="text-sm font-extrabold text-neutral-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                        {option.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-amber-700/80">
                        {option.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {option.desc}
                    </p>
                  </div>

                  {/* Bottom Action Hint */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-600 group-hover:text-neutral-950 transition-colors">
                    <span className="text-[11px]">Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );

              if (option.onClick) {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={option.onClick}
                    className="text-left w-full h-full focus:outline-none"
                  >
                    {CardContent}
                  </button>
                );
              }

              return (
                <Link key={idx} href={option.href || '/'} className="block h-full">
                  {CardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tell Us Your Property Requirement Dedicated Section */}
      <section className="py-12 bg-gradient-to-br from-amber-500/10 via-amber-100/30 to-white border-y border-amber-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3.5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#D4A017]/20 text-amber-900 border border-[#D4A017]/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Zero Brokerage Dedicated Buyer Advisory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
                Looking for a Specific Property? Tell Us Your Requirement
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Skip endless browsing. Share your preferred location, budget and configuration. Our verified relationship managers will handpick matching direct-developer units and schedule private site visits.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { label: 'Direct Developer Rate', desc: 'No middleman markup' },
                  { label: '100% Verified RERA', desc: 'Pre-vetted legal titles' },
                  { label: 'Cab Site Visits', desc: 'Doorstep pickup & tour' },
                  { label: 'Home Loan Desk', desc: 'Lowest interest rates' },
                ].map((perk, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70">
                    <div className="text-xs font-bold text-neutral-900">{perk.label}</div>
                    <div className="text-[10px] text-neutral-500">{perk.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                type="button"
                onClick={() => setRequirementOpen(true)}
                className="px-8 py-4 rounded-2xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-sm transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Tell Us Your Property Requirement</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-neutral-500 text-center font-medium">
                Free consultation • Response within 30 minutes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Maharashtra Locations Section */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">
              Strategic Corridors
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 mt-1">
              Explore Popular Maharashtra Hubs
            </h2>
          </div>
          <Link
            href="/properties"
            className="text-xs font-semibold text-neutral-700 hover:text-[#D4A017] flex items-center gap-1"
          >
            <span>View All Localities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {locations.map((loc) => (
            <Link
              key={loc.name}
              href={`/properties?city=${loc.city}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-900 shadow-xs hover:shadow-md transition-all"
            >
              <Image
                src={loc.image}
                alt={loc.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-75 group-hover:opacity-90"
                sizes="(max-width: 768px) 50vw, 16vw"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent p-3.5 flex flex-col justify-end">
                <h4 className="text-white font-bold text-sm leading-tight">{loc.name}</h4>
                <p className="text-[11px] text-amber-300 font-medium">{loc.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Smart Property Matcher Interactive Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-14">
        <div className="bg-gradient-to-r from-[#171717] via-[#262626] to-[#1E293B] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-neutral-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#D4A017] text-neutral-950">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Proprietary Algorithm</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Find Your Ideal Home in 30 Seconds
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Answer 4 quick preferences regarding budget, locality, and family configuration. Our multi-weighted matching engine scours certified developer inventory to surface your highest-scoring properties.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setMatcherOpen(true)}
                className="px-6 py-3 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 font-bold text-sm transition-all shadow-md flex items-center gap-2"
              >
                <span>Launch Smart Property Matcher</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Showcase */}
      <section className="py-14 bg-white border-y border-neutral-200/80 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">
                Handpicked Collections
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 mt-1">
                Featured Verified Properties
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Curated high-demand inventory with zero brokerage and direct developer transparency
              </p>
            </div>

            <Link
              href="/properties"
              className="text-xs font-semibold px-4 py-2 rounded-xl border border-neutral-300 hover:border-neutral-900 text-neutral-800 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Explore All ({allProperties.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onScheduleVisit={handleOpenSiteVisit}
                onEnquire={handleOpenEnquiry}
                onToggleCompare={handleToggleCompare}
                isCompared={comparedPropertyIds.includes(prop.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* New Launch Projects Showcase */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">
              Masterplanned Communities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 mt-1">
              Trending New Launch Projects
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Explore integrated townships, clubhouses, and pre-launch booking pricing
            </p>
          </div>

          <Link
            href="/projects"
            className="text-xs font-semibold px-4 py-2 rounded-xl border border-neutral-300 hover:border-neutral-900 text-neutral-800 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      </section>

      {/* Trusted Developers Showcase */}
      <section className="py-14 bg-neutral-100 border-t border-neutral-200 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">
              Grade-A Real Estate Partners
            </span>
            <h3 className="text-2xl font-bold text-neutral-950">
              India’s Leading Real Estate Developers
            </h3>
            <p className="text-xs text-neutral-600">
              Direct inventory synchronization with certified track records of timely delivery
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {developers.map((dev) => (
              <Link
                key={dev.id}
                href={`/developers/${dev.slug}`}
                className="bg-white p-4 rounded-xl border border-neutral-200/90 text-center hover:border-[#D4A017] transition-all group flex flex-col items-center justify-between gap-2 shadow-2xs"
              >
                <div className="w-12 h-12 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-800 font-bold text-sm group-hover:scale-105 transition-transform">
                  <Building className="w-6 h-6 text-[#D4A017]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-neutral-900 line-clamp-1">{dev.name}</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{dev.ongoingProjects} Active Projects</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* META LEAD GENERATION ADS & INSTANT FORMS SHOWCASE */}
      <section className="py-14 bg-[#0B1120] border-t border-slate-800 w-full text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#0B1120] to-[#1E293B] border border-slate-700/80 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                <span>Meta Instant Forms & High-Intent Funnels</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Native Meta Lead Generation with <span className="text-[#0EA5E9]">Pre-Qualifying Friction Filters</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                When prospects click Facebook or Instagram Reel ads, native pre-filled contact details pop up instantly. Custom friction filters (budget brackets, timeline, and financing readiness) weed out casual window-shoppers so our sales advisors only receive verified, high-intent buyer inquiries.
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Pre-Filled Native Details
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Intent Scoring Filter
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Zero Window-Shoppers
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setMetaModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#10B981] via-[#0EA5E9] to-[#10B981] hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Instant Form Experience</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/919326303244"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#0da674] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* LOCAL SEO & MICRO-MARKET CONSULTANTS SECTION */}
      <div className="bg-[#0B1120] text-slate-100 border-t border-slate-800">
        <LocalSeoConsultantsSection limit={3} />
      </div>

      <Footer />

      {/* Modals */}
      <MetaInstantFormModal
        isOpen={metaModalOpen}
        onClose={() => setMetaModalOpen(false)}
      />
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        property={selectedProperty}
        project={selectedProject}
      />

      <SiteVisitModal
        isOpen={visitOpen}
        onClose={() => setVisitOpen(false)}
        property={selectedProperty}
        project={selectedProject}
      />

      <SmartMatcherModal
        isOpen={matcherOpen}
        onClose={() => setMatcherOpen(false)}
      />

      <PropertyRequirementModal
        isOpen={requirementOpen}
        onClose={() => setRequirementOpen(false)}
      />
    </div>
  );
}
