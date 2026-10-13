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

          {/* Multi-Tab Search Box with Glassmorphism */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_16px_48px_0_rgba(31,38,135,0.08)] p-4 sm:p-6 text-neutral-900 border border-white/75 ring-1 ring-black/[0.04]">
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


      {/* Tell Us Your Property Requirement Dedicated Section */}
      <section className="py-12 bg-gradient-to-br from-amber-500/10 via-amber-100/30 to-white border-y border-amber-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/75 shadow-[0_16px_48px_rgba(212,160,23,0.14)] flex flex-col lg:flex-row items-center justify-between gap-8 ring-1 ring-black/[0.03]">
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
                className="bg-white/65 backdrop-blur-xl p-4 rounded-2xl border border-white/70 text-center hover:border-[#D4A017] hover:bg-white/85 hover:shadow-[0_14px_32px_rgba(212,160,23,0.18)] shadow-[0_8px_24px_rgba(31,38,135,0.05)] transition-all group flex flex-col items-center justify-between gap-2 ring-1 ring-black/[0.02]"
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

      <Footer />

      {/* Modals */}
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
