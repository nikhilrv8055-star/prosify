'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  ChevronRight,
  Heart,
  ShieldCheck,
  Building,
  Building2,
  Key,
  Home,
  Briefcase,
  Calculator,
  Calendar,
  Sparkles,
  Rocket,
  Layers,
  Users,
  PlusCircle,
  Percent,
  CheckCircle2,
} from 'lucide-react';
import { Property, Project, Developer } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/lib/auth/authContext';

interface MobileHomePageProps {
  properties: Property[];
  projects: Project[];
  developers: Developer[];
  onOpenEnquiry: (property?: Property, project?: Project) => void;
  onOpenSiteVisit: (property?: Property, project?: Project) => void;
  onOpenValuation: () => void;
  onOpenLoanCalc: () => void;
  onOpenServicesDrawer: () => void;
}

export function MobileHomePage({
  properties,
  projects,
  developers,
  onOpenEnquiry,
  onOpenSiteVisit,
  onOpenValuation,
  onOpenLoanCalc,
  onOpenServicesDrawer,
}: MobileHomePageProps) {
  const router = useRouter();
  const { savedPropertyIds, toggleSavedProperty } = useAuth();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'BUY' | 'PROJECTS' | 'COMMERCIAL' | 'NEW_LAUNCH'>('BUY');
  const [bannerMode, setBannerMode] = useState<'BUYER' | 'OWNER'>('BUYER');

  const quickSearchSuggestions = [
    { label: '2 BHK in Thane', query: '2 BHK Thane', type: 'BUY' },
    { label: 'Bandra West', query: 'Bandra', type: 'BUY' },
    { label: 'Godrej Riviera', query: 'Godrej Riviera', type: 'BUY' },
    { label: 'Lodha Palava', query: 'Lodha Palava', type: 'BUY' },
    { label: '1 BHK under 45L', query: '1 BHK', type: 'BUY' },
  ];

  const categories = [
    { key: 'BUY', label: 'Buy', href: '/properties?type=BUY' },
    { key: 'PROJECTS', label: 'Projects', href: '/projects' },
    { key: 'COMMERCIAL', label: 'Commercial', href: '/properties?type=COMMERCIAL' },
    { key: 'NEW_LAUNCH', label: 'New Launches', href: '/properties?possession=NEW_LAUNCH' },
  ];

  const services = [
    {
      id: 'search',
      title: 'Property Search',
      desc: 'Smart search by budget & locality',
      icon: Search,
      action: () => router.push('/properties'),
      color: 'bg-amber-500/10 text-amber-700',
    },
    {
      id: 'buy',
      title: 'Buy Property',
      desc: 'Direct verified developer inventory',
      icon: Home,
      action: () => router.push('/properties?type=BUY'),
      color: 'bg-emerald-500/10 text-emerald-700',
    },
    {
      id: 'launches',
      title: 'New Launches',
      desc: 'Exclusive early-bird pre-launch bookings',
      icon: Rocket,
      action: () => router.push('/properties?possession=NEW_LAUNCH'),
      color: 'bg-blue-500/10 text-blue-700',
    },
    {
      id: 'projects',
      title: 'New Projects',
      desc: 'Townships & early-stage launches',
      icon: Layers,
      action: () => router.push('/projects'),
      color: 'bg-purple-500/10 text-purple-700',
    },
    {
      id: 'commercial',
      title: 'Commercial',
      desc: 'Grade-A offices & retail storefronts',
      icon: Building,
      action: () => router.push('/properties?type=COMMERCIAL'),
      color: 'bg-rose-500/10 text-rose-700',
    },
    {
      id: 'post',
      title: 'Post Property',
      desc: 'Direct buyer leads with zero spam',
      icon: PlusCircle,
      action: () => onOpenEnquiry(),
      color: 'bg-yellow-500/10 text-yellow-700',
      badge: 'Free',
    },
    {
      id: 'loan',
      title: 'Home Loan EMI',
      desc: 'Compare rates from 14+ banks',
      icon: Calculator,
      action: onOpenLoanCalc,
      color: 'bg-indigo-500/10 text-indigo-700',
    },
    {
      id: 'visit',
      title: 'Site Visit',
      desc: 'Complimentary private cab tour',
      icon: Calendar,
      action: () => onOpenSiteVisit(),
      color: 'bg-teal-500/10 text-teal-700',
    },
    {
      id: 'valuation',
      title: 'Property Valuation',
      desc: 'Market price assessment in seconds',
      icon: Percent,
      action: onOpenValuation,
      color: 'bg-cyan-500/10 text-cyan-700',
    },
    {
      id: 'partner',
      title: 'Channel Partner',
      desc: 'Earn up to 3.5% commission payouts',
      icon: Users,
      action: () => router.push('/partner'),
      color: 'bg-orange-500/10 text-orange-700',
    },
  ];

  const popularLocations = [
    { name: 'Mumbai', count: '1,420+ Properties', slug: 'mumbai', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80' },
    { name: 'Thane', count: '890+ Properties', slug: 'thane', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80' },
    { name: 'Dombivli', count: '640+ Properties', slug: 'dombivli', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80' },
    { name: 'Kalyan', count: '510+ Properties', slug: 'kalyan', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80' },
    { name: 'Navi Mumbai', count: '780+ Properties', slug: 'navi-mumbai', img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=400&q=80' },
    { name: 'Pune', count: '1,150+ Properties', slug: 'pune', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80' },
    { name: 'Nagpur', count: '380+ Properties', slug: 'nagpur', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80' },
    { name: 'Nashik', count: '290+ Properties', slug: 'nashik', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80' },
  ];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    if (activeCategory === 'COMMERCIAL') {
      params.set('type', 'COMMERCIAL');
    } else if (activeCategory === 'NEW_LAUNCH') {
      params.set('possession', 'NEW_LAUNCH');
    } else if (activeCategory === 'PROJECTS') {
      router.push(`/projects${searchQuery.trim() ? `?q=${encodeURIComponent(searchQuery.trim())}` : ''}`);
      return;
    }
    router.push(`/properties?${params.toString()}`);
  };

  const handleChipClick = (suggestion: typeof quickSearchSuggestions[0]) => {
    setSearchQuery(suggestion.query);
    router.push(`/properties?q=${encodeURIComponent(suggestion.query)}&type=${suggestion.type}`);
  };

  return (
    <div className="block md:hidden bg-[#F8F8F6] pb-24">
      {/* ==================================================== */}
      {/* 1. MOBILE SEARCH AREA                                */}
      {/* ==================================================== */}
      <section className="bg-white px-4 pt-3 pb-3 border-b border-neutral-200/70 shadow-2xs">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center bg-neutral-100 rounded-2xl border border-neutral-200/90 shadow-inner focus-within:ring-2 focus-within:ring-[#D4A017] focus-within:border-transparent transition-all">
            <Search className="w-4 h-4 text-neutral-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by locality, landmark or project"
              className="w-full py-2.5 px-3 bg-transparent text-xs font-medium text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-neutral-400 px-2 hover:text-neutral-700"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="m-1 px-3.5 py-1.5 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] active:scale-95 text-neutral-950 font-bold text-xs transition-all shadow-xs shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Suggestions / Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 pb-0.5">
          <span className="text-[10px] uppercase font-bold text-neutral-400 shrink-0">Popular:</span>
          {quickSearchSuggestions.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleChipClick(item)}
              className="px-2.5 py-1 rounded-full bg-neutral-100 text-[11px] font-medium text-neutral-700 hover:bg-[#D4A017]/15 hover:text-neutral-900 border border-neutral-200/60 shrink-0 whitespace-nowrap active:scale-95 transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. MOBILE PROPERTY CATEGORY TABS                     */}
      {/* ==================================================== */}
      <section className="bg-white px-3 py-2.5 border-b border-neutral-200/70">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.key as any);
                  if (cat.key === 'PROJECTS') {
                    router.push('/projects');
                  } else {
                    router.push(cat.href);
                  }
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#D4A017] text-neutral-950 shadow-xs ring-1 ring-[#D4A017]'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. MOBILE PROMOTIONAL BANNER                         */}
      {/* ==================================================== */}
      <section className="p-3.5">
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-neutral-200 bg-neutral-900 text-white min-h-[140px] flex flex-col justify-between p-4">
          <Image
            src={
              bannerMode === 'BUYER'
                ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
                : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
            }
            alt="Prosify Real Estate"
            fill
            className="object-cover opacity-30"
            sizes="100vw"
            referrerPolicy="no-referrer"
          />

          {/* Banner content */}
          <div className="relative z-10 space-y-1">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4A017] text-neutral-950">
                <ShieldCheck className="w-3 h-3" />
                <span>RERA Approved</span>
              </span>

              {/* Mode toggle */}
              <div className="flex bg-neutral-950/70 p-0.5 rounded-lg border border-white/10 text-[10px]">
                <button
                  type="button"
                  onClick={() => setBannerMode('BUYER')}
                  className={`px-2 py-0.5 rounded-md font-semibold ${
                    bannerMode === 'BUYER' ? 'bg-[#D4A017] text-neutral-950' : 'text-neutral-300'
                  }`}
                >
                  Buy/Invest
                </button>
                <button
                  type="button"
                  onClick={() => setBannerMode('OWNER')}
                  className={`px-2 py-0.5 rounded-md font-semibold ${
                    bannerMode === 'OWNER' ? 'bg-[#D4A017] text-neutral-950' : 'text-neutral-300'
                  }`}
                >
                  Sell/Post
                </button>
              </div>
            </div>

            {bannerMode === 'BUYER' ? (
              <>
                <h3 className="text-base font-extrabold text-white leading-tight pt-1">
                  Looking for Your Dream Property?
                </h3>
                <p className="text-[11px] text-amber-200 font-medium">
                  Verified Properties • Direct Trusted Developers • Zero Spam
                </p>
              </>
            ) : (
              <>
                <h3 className="text-base font-extrabold text-white leading-tight pt-1">
                  Want to Sell Your Property?
                </h3>
                <p className="text-[11px] text-amber-200 font-medium">
                  Direct Verified Buyers • Zero Brokerage Listing
                </p>
              </>
            )}
          </div>

          <div className="relative z-10 pt-3 flex items-center justify-between">
            {bannerMode === 'BUYER' ? (
              <Link
                href="/properties"
                className="px-4 py-1.5 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] active:scale-95 text-neutral-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-all"
              >
                <span>Explore Properties</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => onOpenEnquiry()}
                className="px-4 py-1.5 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] active:scale-95 text-neutral-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <span>Post Property Free</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            <span className="text-[10px] text-neutral-300">
              100% Genuine Inventory
            </span>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. MOBILE QUICK SERVICES                             */}
      {/* ==================================================== */}
      <section className="px-3.5 py-2">
        <div className="flex items-center justify-between mb-2 px-0.5">
          <div>
            <h2 className="text-sm font-bold text-neutral-950">Explore Prosify Services</h2>
            <p className="text-[10px] text-neutral-500">Verified marketplace utilities</p>
          </div>
          <button
            type="button"
            onClick={onOpenServicesDrawer}
            className="text-xs font-bold text-[#D4A017] hover:text-amber-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar py-1">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                type="button"
                onClick={service.action}
                className="w-32 shrink-0 bg-white/70 backdrop-blur-xl rounded-2xl p-3 border border-white/70 shadow-[0_8px_24px_rgba(31,38,135,0.05)] hover:border-[#D4A017] hover:bg-white/85 active:scale-95 transition-all text-left flex flex-col justify-between cursor-pointer ring-1 ring-black/[0.02]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${service.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {service.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#D4A017] text-neutral-950">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{service.title}</h4>
                </div>
                <p className="text-[10px] text-neutral-500 mt-1 line-clamp-2 leading-tight">
                  {service.desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. MOBILE FEATURED PROPERTY CARDS (HORIZONTAL RAIL)  */}
      {/* ==================================================== */}
      <section className="px-3.5 py-4">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div>
            <h2 className="text-sm font-bold text-neutral-950">Featured Properties</h2>
            <p className="text-[10px] text-neutral-500">Handpicked verified homes with RERA certainty</p>
          </div>
          <Link
            href="/properties"
            className="text-xs font-bold text-[#D4A017] hover:text-amber-700 flex items-center gap-0.5"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-stretch gap-3.5 overflow-x-auto no-scrollbar py-1">
          {properties.slice(0, 6).map((prop) => {
            const isSaved = savedPropertyIds.includes(prop.id);
            return (
              <div
                key={prop.id}
                className="w-[260px] shrink-0 bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)] hover:shadow-lg hover:bg-white/85 transition-all flex flex-col justify-between ring-1 ring-black/[0.02]"
              >
                {/* Top Image Container */}
                <div className="relative aspect-[16/10] bg-neutral-100">
                  <Image
                    src={prop.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}
                    alt={prop.title}
                    fill
                    className="object-cover"
                    sizes="260px"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#171717]/85 backdrop-blur-xs text-white text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3 text-[#D4A017]" />
                      <span>Verified</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#D4A017] text-neutral-950 text-[10px] font-bold">
                      {prop.propertyType || prop.type}
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSavedProperty(prop.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-700 hover:text-red-500 shadow-xs"
                    aria-label="Save property"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  {/* Bottom Price in Image */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-baseline justify-between text-white">
                    <span className="text-base font-extrabold text-white tracking-tight drop-shadow-xs">
                      {formatPrice(prop.price)}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-200">
                      ₹{prop.pricePerSqft?.toLocaleString('en-IN') || '14,200'}/sq.ft
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-neutral-950 line-clamp-1">
                      {prop.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-1">
                      <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span className="truncate">{prop.locality}, {prop.city}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 my-2.5 py-1.5 border-y border-neutral-100 text-[10px] text-neutral-600">
                      <div>
                        <span className="text-neutral-400 block text-[9px] uppercase font-semibold">Config</span>
                        <strong className="text-neutral-900 font-bold">{prop.bhk} BHK</strong>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[9px] uppercase font-semibold">Carpet Area</span>
                        <strong className="text-neutral-900 font-bold">{prop.carpetArea || (prop as any).areaSqFt} sq.ft</strong>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/properties/${prop.slug}`}
                    className="w-full py-2 rounded-xl bg-neutral-900 hover:bg-black active:scale-98 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#D4A017]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 6. MOBILE NEW PROJECTS (HORIZONTAL RAIL)             */}
      {/* ==================================================== */}
      <section className="px-3.5 py-2">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div>
            <h2 className="text-sm font-bold text-neutral-950">New Launch Projects</h2>
            <p className="text-[10px] text-neutral-500">Early bird bookings with clubhouses & pre-launch rates</p>
          </div>
          <Link
            href="/projects"
            className="text-xs font-bold text-[#D4A017] hover:text-amber-700 flex items-center gap-0.5"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-stretch gap-3.5 overflow-x-auto no-scrollbar py-1">
          {projects.slice(0, 6).map((proj) => (
            <div
              key={proj.id}
              className="w-[250px] shrink-0 bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)] hover:shadow-lg hover:bg-white/85 transition-all flex flex-col justify-between ring-1 ring-black/[0.02]"
            >
              <div className="relative aspect-[16/10] bg-neutral-100">
                <Image
                  src={proj.images?.[0] || proj.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'}
                  alt={proj.name}
                  fill
                  className="object-cover"
                  sizes="250px"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                <div className="absolute top-2.5 left-2.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#D4A017] text-neutral-950 text-[10px] font-bold">
                    <Sparkles className="w-3 h-3" />
                    <span>New Launch</span>
                  </span>
                </div>

                <div className="absolute bottom-2 left-2.5 right-2.5">
                  <span className="text-[10px] text-neutral-300 block">Starting from</span>
                  <span className="text-sm font-extrabold text-white">
                    {proj.startingPrice ? formatPrice(proj.startingPrice) : 'On Request'}
                  </span>
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-neutral-950 line-clamp-1">{proj.name}</h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5 truncate">{proj.locality}, {proj.city}</p>

                  <div className="flex items-center justify-between text-[10px] text-neutral-600 my-2 pt-2 border-t border-neutral-100">
                    <span>Possession: <strong className="text-neutral-900">{proj.possessionDate}</strong></span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold text-[9px]">
                      RERA
                    </span>
                  </div>
                </div>

                <Link
                  href={`/projects/${proj.slug}`}
                  className="w-full py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 active:scale-98 text-neutral-900 font-bold text-xs text-center flex items-center justify-center gap-1 transition-all"
                >
                  <span>View Project</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 7. MOBILE POPULAR LOCATIONS (HORIZONTAL CARDS)       */}
      {/* ==================================================== */}
      <section className="px-3.5 py-4">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div>
            <h2 className="text-sm font-bold text-neutral-950">Popular Locations</h2>
            <p className="text-[10px] text-neutral-500">Key residential and commercial clusters</p>
          </div>
          <Link
            href="/properties?view=locations"
            className="text-xs font-bold text-[#D4A017] hover:text-amber-700 flex items-center gap-0.5"
          >
            <span>All Hubs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar py-1">
          {popularLocations.map((loc) => (
            <Link
              key={loc.name}
              href={`/properties?city=${loc.slug}`}
              className="w-28 shrink-0 rounded-2xl overflow-hidden aspect-[3/4] relative bg-neutral-900 shadow-2xs hover:shadow-md transition-all group"
            >
              <Image
                src={loc.img}
                alt={loc.name}
                fill
                className="object-cover opacity-75 group-hover:scale-105 transition-transform"
                sizes="120px"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2.5 flex flex-col justify-end">
                <h4 className="text-white font-bold text-xs leading-tight">{loc.name}</h4>
                <p className="text-[10px] text-amber-300 font-medium">{loc.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 8. MOBILE TRUSTED DEVELOPERS (HORIZONTAL RAIL)       */}
      {/* ==================================================== */}
      <section className="px-3.5 py-3">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div>
            <h2 className="text-sm font-bold text-neutral-950">Trusted Developers</h2>
            <p className="text-[10px] text-neutral-500">Direct inventory with Grade-A track records</p>
          </div>
          <Link
            href="/developers"
            className="text-xs font-bold text-[#D4A017] hover:text-amber-700 flex items-center gap-0.5"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar py-1">
          {developers.map((dev) => (
            <Link
              key={dev.id}
              href={`/developers/${dev.slug}`}
              className="w-36 shrink-0 bg-white/70 backdrop-blur-xl p-3 rounded-2xl border border-white/70 text-center hover:border-[#D4A017] hover:bg-white/85 shadow-[0_8px_24px_rgba(31,38,135,0.05)] transition-all flex flex-col items-center justify-between gap-1.5 ring-1 ring-black/[0.02]"
            >
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-neutral-800">
                <Building className="w-5 h-5 text-[#D4A017]" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-neutral-900 line-clamp-1">{dev.name}</h4>
                <p className="text-[10px] text-neutral-500 mt-0.5">{dev.ongoingProjects} Active Projects</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>Verified</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
