'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Filter,
  SlidersHorizontal,
  Grid,
  List as ListIcon,
  X,
  Sparkles,
  MapPin,
  CheckCircle2,
  Scale,
  ArrowUpDown,
  Search,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { PropertyCard } from '@/components/marketplace/PropertyCard';
import { EnquiryModal } from '@/components/marketplace/EnquiryModal';
import { SiteVisitModal } from '@/components/marketplace/SiteVisitModal';
import { SmartMatcherModal } from '@/components/marketplace/SmartMatcherModal';
import {
  MobileFilterOverlay,
  MobileFilterCriteria,
  DEFAULT_FILTER_CRITERIA,
} from '@/components/marketplace/MobileFilterOverlay';
import { store } from '@/lib/data/store';
import { Property } from '@/lib/types';
import { formatIndianPrice } from '@/lib/utils';
import { useAuth } from '@/lib/auth/authContext';
import { useToast } from '@/components/ui/toast';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const { toggleCompareProperty, comparedPropertyIds } = useAuth();
  const { toast } = useToast();

  // URL parameters init
  const initialCity = searchParams.get('city') || 'ALL';
  const initialType = searchParams.get('type') || 'ALL';
  const initialPropType = searchParams.get('propertyType') || 'ALL';
  const initialBhk = searchParams.get('bhk') || '';
  const initialPossession = searchParams.get('possession') || '';
  const initialMinPrice = Number(searchParams.get('minPrice')) || 0;
  const initialMaxPrice = Number(searchParams.get('maxPrice')) || 0;
  const initialQuery = searchParams.get('q') || '';

  // Multi-criteria filter state (persisted in localStorage + URL)
  const [criteria, setCriteria] = useState<MobileFilterCriteria>(() => {
    let base: MobileFilterCriteria = {
      city: initialCity,
      listingType: initialType === 'RENT' ? 'BUY' : initialType,
      propertyType: initialPropType,
      bhks: initialBhk && initialBhk !== 'ALL' ? initialBhk.split(',').filter(Boolean) : [],
      minPrice: initialMinPrice,
      maxPrice: initialMaxPrice,
      possessionStatuses: initialPossession && initialPossession !== 'ALL' ? initialPossession.split(',').filter(Boolean) : [],
      verifiedOnly: false,
    };

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('prosify_mobile_filters_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (!searchParams.get('bhk') && parsed.bhks) base.bhks = parsed.bhks;
          if (!searchParams.get('possession') && parsed.possessionStatuses) base.possessionStatuses = parsed.possessionStatuses;
          if (!searchParams.get('maxPrice') && parsed.maxPrice) base.maxPrice = parsed.maxPrice;
          if (!searchParams.get('minPrice') && parsed.minPrice) base.minPrice = parsed.minPrice;
          if (!searchParams.get('city') && parsed.city) base.city = parsed.city;
          if (!searchParams.get('type') && parsed.listingType) base.listingType = parsed.listingType === 'RENT' ? 'BUY' : parsed.listingType;
          if (!searchParams.get('propertyType') && parsed.propertyType) base.propertyType = parsed.propertyType;
          if (parsed.verifiedOnly !== undefined) base.verifiedOnly = parsed.verifiedOnly;
        }
      } catch {}
    }
    if (base.listingType === 'RENT') {
      base.listingType = 'BUY';
    }
    return base;
  });

  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync criteria updates with persistence & URL parameters
  const handleApplyCriteria = (newCriteria: MobileFilterCriteria) => {
    setCriteria(newCriteria);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('prosify_mobile_filters_v2', JSON.stringify(newCriteria));
      }
    } catch {}

    const params = new URLSearchParams();
    if (newCriteria.city !== 'ALL') params.set('city', newCriteria.city);
    if (newCriteria.listingType !== 'ALL') params.set('type', newCriteria.listingType);
    if (newCriteria.propertyType !== 'ALL') params.set('propertyType', newCriteria.propertyType);
    if (newCriteria.bhks.length > 0) params.set('bhk', newCriteria.bhks.join(','));
    if (newCriteria.possessionStatuses.length > 0) params.set('possession', newCriteria.possessionStatuses.join(','));
    if (newCriteria.minPrice > 0) params.set('minPrice', newCriteria.minPrice.toString());
    if (newCriteria.maxPrice > 0) params.set('maxPrice', newCriteria.maxPrice.toString());
    if (query) params.set('q', query);

    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  // Helper chip removers
  const removeBhk = (bhkToRemove: string) => {
    handleApplyCriteria({
      ...criteria,
      bhks: criteria.bhks.filter((b) => b !== bhkToRemove),
    });
  };

  const removePossession = (posToRemove: string) => {
    handleApplyCriteria({
      ...criteria,
      possessionStatuses: criteria.possessionStatuses.filter((p) => p !== posToRemove),
    });
  };

  const resetPrice = () => {
    handleApplyCriteria({
      ...criteria,
      minPrice: 0,
      maxPrice: 0,
    });
  };

  // Active criteria counter
  const activeCount = useMemo(() => {
    let count = 0;
    if (criteria.city !== 'ALL') count++;
    if (criteria.listingType !== 'ALL') count++;
    if (criteria.propertyType !== 'ALL') count++;
    if (criteria.bhks.length > 0) count += criteria.bhks.length;
    if (criteria.minPrice > 0 || criteria.maxPrice > 0) count++;
    if (criteria.possessionStatuses.length > 0) count += criteria.possessionStatuses.length;
    if (criteria.verifiedOnly) count++;
    return count;
  }, [criteria]);

  // Modals state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [matcherOpen, setMatcherOpen] = useState(false);
  const [comparedProperties, setComparedProperties] = useState<Property[]>([]);

  // Filter application
  const properties = useMemo(() => {
    return store.getProperties({
      city: criteria.city === 'ALL' ? undefined : criteria.city,
      listingType: criteria.listingType === 'ALL' ? undefined : criteria.listingType,
      propertyType: criteria.propertyType === 'ALL' ? undefined : criteria.propertyType,
      bhk: criteria.bhks.length > 0 ? criteria.bhks : undefined,
      possessionStatus: criteria.possessionStatuses.length > 0 ? criteria.possessionStatuses : undefined,
      minPrice: criteria.minPrice > 0 ? criteria.minPrice : undefined,
      maxPrice: criteria.maxPrice > 0 ? criteria.maxPrice : undefined,
      verifiedOnly: criteria.verifiedOnly,
      searchQuery: query || undefined,
      sort,
    });
  }, [criteria, query, sort]);

  const resetFilters = () => {
    setCriteria(DEFAULT_FILTER_CRITERIA);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('prosify_mobile_filters_v2');
      }
    } catch {}
    setQuery('');
    setSort('relevance');
    window.history.replaceState(null, '', window.location.pathname);
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

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50">
      <Navbar
        onOpenEnquiry={() => setEnquiryOpen(true)}
        onOpenMatcher={() => setMatcherOpen(true)}
      />

      {/* Search Header Banner */}
      <div className="bg-[#171717] text-white py-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Properties for Sale in Maharashtra
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Showing <strong>{properties.length} verified listings</strong> with complete RERA transparency
              </p>
            </div>

            {/* Keyword Search Input in header */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by project, developer or locality..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Listing Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filter toggle & active criteria pills bar (.lg:hidden) */}
          <div className="lg:hidden flex flex-col gap-2.5 bg-white p-3 rounded-2xl border border-neutral-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                aria-label="Open Mobile Filter Overlay"
              >
                <SlidersHorizontal
                  className={`w-4 h-4 text-[#D4A017] transition-all ${
                    activeCount > 0 ? 'animate-pulse' : ''
                  }`}
                />
                <span>Filters</span>
                {activeCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#D4A017] text-neutral-950 text-[10px] font-black flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2">
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs text-[#FD3752] hover:underline font-semibold flex items-center gap-1 active:scale-95 cursor-pointer py-1 px-2 rounded-md hover:bg-red-50"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
                <span className="text-xs font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-lg">
                  {properties.length} {properties.length === 1 ? 'property' : 'properties'}
                </span>
              </div>
            </div>

            {/* Active criteria pills (tap to remove or open overlay) */}
            {activeCount > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-semibold">
                {criteria.city !== 'ALL' && (
                  <button
                    type="button"
                    onClick={() => handleApplyCriteria({ ...criteria, city: 'ALL' })}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200 whitespace-nowrap active:scale-95"
                    title="Remove city filter"
                  >
                    <span>📍 {criteria.city}</span>
                    <X className="w-3 h-3 text-neutral-400 hover:text-neutral-700" />
                  </button>
                )}
                {criteria.bhks.map((bhkVal) => (
                  <button
                    key={bhkVal}
                    type="button"
                    onClick={() => removeBhk(bhkVal)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 whitespace-nowrap active:scale-95"
                    title={`Remove ${bhkVal} filter`}
                  >
                    <span>🛏️ {bhkVal}</span>
                    <X className="w-3 h-3 text-amber-700" />
                  </button>
                ))}
                {(criteria.minPrice > 0 || criteria.maxPrice > 0) && (
                  <button
                    type="button"
                    onClick={resetPrice}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 whitespace-nowrap active:scale-95"
                    title="Reset budget"
                  >
                    <span>💰 {criteria.maxPrice > 0 ? `≤ ${formatIndianPrice(criteria.maxPrice)}` : `≥ ${formatIndianPrice(criteria.minPrice)}`}</span>
                    <X className="w-3 h-3 text-emerald-700" />
                  </button>
                )}
                {criteria.possessionStatuses.map((posVal) => (
                  <button
                    key={posVal}
                    type="button"
                    onClick={() => removePossession(posVal)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 whitespace-nowrap active:scale-95"
                    title="Remove possession filter"
                  >
                    <span>📅 {posVal === 'READY_TO_MOVE' ? 'Ready' : posVal === 'NEW_LAUNCH' ? 'New Launch' : 'Under Const.'}</span>
                    <X className="w-3 h-3 text-blue-700" />
                  </button>
                ))}
                {criteria.propertyType !== 'ALL' && (
                  <button
                    type="button"
                    onClick={() => handleApplyCriteria({ ...criteria, propertyType: 'ALL' })}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200 whitespace-nowrap active:scale-95"
                    title="Remove property category"
                  >
                    <span>🏢 {criteria.propertyType}</span>
                    <X className="w-3 h-3 text-purple-700" />
                  </button>
                )}
                {criteria.verifiedOnly && (
                  <button
                    type="button"
                    onClick={() => handleApplyCriteria({ ...criteria, verifiedOnly: false })}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 whitespace-nowrap active:scale-95"
                    title="Remove verified filter"
                  >
                    <span>✓ Verified</span>
                    <X className="w-3 h-3 text-emerald-700" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Left Sidebar Filters (Desktop only) */}
          <aside className="hidden lg:block lg:w-72 shrink-0 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="font-bold text-sm text-neutral-950 flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-[#D4A017]" />
                  <span>Filter Properties</span>
                  {activeCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#D4A017] text-neutral-950 text-[10px] font-black flex items-center justify-center">
                      {activeCount}
                    </span>
                  )}
                </h3>
                {activeCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-[#FD3752] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All</span>
                  </button>
                )}
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Location / City
                </label>
                <select
                  value={criteria.city}
                  onChange={(e) => handleApplyCriteria({ ...criteria, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-neutral-50"
                >
                  <option value="ALL">All Cities</option>
                  <option value="Mumbai">Mumbai MMR</option>
                  <option value="Thane">Thane</option>
                  <option value="Dombivli">Dombivli</option>
                  <option value="Kalyan">Kalyan</option>
                  <option value="Pune">Pune</option>
                  <option value="Nagpur">Nagpur</option>
                </select>
              </div>

              {/* Listing Type */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Listing Type
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {['ALL', 'BUY', 'COMMERCIAL'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleApplyCriteria({ ...criteria, listingType: t })}
                      className={`py-1.5 px-2 rounded-lg font-medium border transition-colors ${
                        criteria.listingType === t
                          ? 'bg-neutral-950 text-white border-neutral-950'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {t === 'ALL' ? 'All' : t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Property Category
                </label>
                <select
                  value={criteria.propertyType}
                  onChange={(e) => handleApplyCriteria({ ...criteria, propertyType: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-neutral-50"
                >
                  <option value="ALL">All Types</option>
                  <option value="APARTMENT">Apartment / Flat</option>
                  <option value="VILLA">Villa / Bungalow</option>
                  <option value="PENTHOUSE">Penthouse</option>
                  <option value="PLOT">Residential Plot</option>
                  <option value="OFFICE">Commercial Office</option>
                  <option value="SHOP">Retail Shop</option>
                </select>
              </div>

              {/* BHK Selection (Multiple criteria support) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-700">
                    Bedrooms (BHK)
                  </label>
                  {criteria.bhks.length > 0 && (
                    <span className="text-[10px] text-[#D4A017] font-bold">
                      {criteria.bhks.length} selected
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-xs text-center">
                  {['1 BHK', '2 BHK', '3 BHK', '4 BHK'].map((b) => {
                    const isSelected = criteria.bhks.includes(b);
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          const next = isSelected
                            ? criteria.bhks.filter((x) => x !== b)
                            : [...criteria.bhks, b];
                          handleApplyCriteria({ ...criteria, bhks: next });
                        }}
                        className={`py-1.5 rounded-lg font-medium border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#D4A017] text-neutral-950 border-[#D4A017] font-bold'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {b.replace(' BHK', '')} BHK
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Max Budget Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1.5">
                  <span>Max Budget</span>
                  <span>{criteria.maxPrice === 0 ? 'Any Budget' : formatIndianPrice(criteria.maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000000"
                  step="2500000"
                  value={criteria.maxPrice}
                  onChange={(e) => handleApplyCriteria({ ...criteria, maxPrice: Number(e.target.value) })}
                  className="w-full accent-[#D4A017] cursor-pointer"
                />
              </div>

              {/* Possession Status */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Possession Status
                </label>
                <select
                  value={criteria.possessionStatuses[0] || 'ALL'}
                  onChange={(e) => handleApplyCriteria({ ...criteria, possessionStatuses: e.target.value === 'ALL' ? [] : [e.target.value] })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-neutral-50"
                >
                  <option value="ALL">Any Timeline</option>
                  <option value="READY_TO_MOVE">Ready to Move</option>
                  <option value="UNDER_CONSTRUCTION">Under Construction</option>
                  <option value="NEW_LAUNCH">New Launch</option>
                </select>
              </div>

              {/* Verified Only Toggle */}
              <div className="pt-2 border-t border-neutral-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-800">
                  <input
                    type="checkbox"
                    checked={criteria.verifiedOnly}
                    onChange={(e) => handleApplyCriteria({ ...criteria, verifiedOnly: e.target.checked })}
                    className="rounded text-[#D4A017] focus:ring-[#D4A017] accent-[#D4A017]"
                  />
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Show Verified Listings Only</span>
                </label>
              </div>

              {/* AI Matcher Banner CTA */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
                  Need Guidance?
                </span>
                <p className="text-[11px] text-amber-800 leading-snug">
                  Use our algorithmic matcher to calculate compatibility with your specific budget.
                </p>
                <button
                  type="button"
                  onClick={() => setMatcherOpen(true)}
                  className="w-full py-1.5 text-xs font-bold bg-[#D4A017] text-neutral-950 rounded-lg hover:bg-[#F4C430]"
                >
                  Launch Matcher
                </button>
              </div>
            </div>
          </aside>

          {/* Right Main Grid */}
          <div className="flex-1 space-y-6">
            {/* Sorting & View Controls Bar */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <span>Showing <strong>{properties.length}</strong> matching properties</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                  <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Sort by:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="py-1 px-2 text-xs rounded-lg border border-neutral-300 font-medium text-neutral-800 bg-neutral-50"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="area_asc">Area: Low to High</option>
                    <option value="area_desc">Area: High to Low</option>
                  </select>
                </div>

                {/* Grid / List switcher */}
                <div className="hidden sm:flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 ${viewMode === 'grid' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 ${viewMode === 'list' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}
                    title="List View"
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            {properties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-[#D4A017] mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950">No matching properties found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try broadening your budget, selecting All Cities, or removing specific filter requirements.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {properties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    onScheduleVisit={(p) => {
                      setSelectedProperty(p);
                      setVisitOpen(true);
                    }}
                    onEnquire={(p) => {
                      setSelectedProperty(p);
                      setEnquiryOpen(true);
                    }}
                    onToggleCompare={handleToggleCompare}
                    isCompared={comparedPropertyIds.includes(prop.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        property={selectedProperty}
      />

      <SiteVisitModal
        isOpen={visitOpen}
        onClose={() => setVisitOpen(false)}
        property={selectedProperty}
      />

      <SmartMatcherModal
        isOpen={matcherOpen}
        onClose={() => setMatcherOpen(false)}
      />

      {/* Full-screen Mobile Filter Overlay with multi-criteria & persistence */}
      <MobileFilterOverlay
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        criteria={criteria}
        onApply={handleApplyCriteria}
      />
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 p-8 text-center text-xs text-neutral-500">Loading properties...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
