'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Filter,
  Grid,
  List as ListIcon,
  Search,
  CheckCircle2,
  ArrowUpDown,
  Sparkles,
  ClipboardEdit,
  ArrowRight,
  Scale,
  X,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { PropertyCard } from '@/components/marketplace/PropertyCard';
import { EnquiryModal } from '@/components/marketplace/EnquiryModal';
import { SiteVisitModal } from '@/components/marketplace/SiteVisitModal';
import { PropertyRequirementModal } from '@/components/marketplace/PropertyRequirementModal';
import { store } from '@/lib/data/store';
import { Property, ListingType, PropertyType } from '@/lib/types';
import { formatIndianPrice } from '@/lib/utils';

function PropertiesContent() {
  const searchParams = useSearchParams();

  const [city, setCity] = useState<string>(() => searchParams.get('city') || 'ALL');
  const [listingType, setListingType] = useState<string>(() => searchParams.get('type') || 'ALL');
  const [propertyType, setPropertyType] = useState<string>('ALL');
  const [selectedBhks, setSelectedBhks] = useState<string[]>(() => {
    const b = searchParams.get('bhk');
    return b && b !== 'ALL' ? [b] : [];
  });
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [possessionStatus, setPossessionStatus] = useState<string>('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [query, setQuery] = useState<string>(() => searchParams.get('q') || '');
  const [sort, setSort] = useState<string>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [requirementOpen, setRequirementOpen] = useState(false);
  const [comparedProperties, setComparedProperties] = useState<Property[]>([]);

  // Filter application
  const properties = useMemo(() => {
    let list = store.getProperties({
      city: city === 'ALL' ? undefined : city,
      listingType: (listingType === 'ALL' || !listingType) ? undefined : (listingType as ListingType),
      propertyType: propertyType === 'ALL' ? undefined : (propertyType as PropertyType),
      possessionStatuses: possessionStatus === 'ALL' ? undefined : [possessionStatus],
      bhks: selectedBhks.length > 0 ? selectedBhks : undefined,
      maxPrice: maxPrice > 0 ? maxPrice : undefined,
      verifiedOnly,
      query: query.trim() || undefined,
    });

    if (sort === 'price_asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sort === 'area_asc') {
      list = [...list].sort((a, b) => a.carpetAreaSqFt - b.carpetAreaSqFt);
    } else if (sort === 'area_desc') {
      list = [...list].sort((a, b) => b.carpetAreaSqFt - a.carpetAreaSqFt);
    }

    return list;
  }, [city, listingType, propertyType, selectedBhks, maxPrice, possessionStatus, verifiedOnly, query, sort]);

  const resetFilters = () => {
    setCity('ALL');
    setListingType('ALL');
    setPropertyType('ALL');
    setSelectedBhks([]);
    setMaxPrice(0);
    setPossessionStatus('ALL');
    setVerifiedOnly(false);
    setQuery('');
  };

  const handleToggleCompare = (property: Property) => {
    if (comparedProperties.some((p) => p.id === property.id)) {
      setComparedProperties((prev) => prev.filter((p) => p.id !== property.id));
    } else {
      if (comparedProperties.length >= 3) {
        setComparedProperties((prev) => [...prev.slice(1), property]);
      } else {
        setComparedProperties((prev) => [...prev, property]);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Navbar />

      {/* Search Header Banner */}
      <div className="bg-[#171717] text-white py-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Properties for Sale in Maharashtra
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Showing <strong>{properties.length} verified listings</strong> with direct developer pricing and zero brokerage
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-xl w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by project, developer or locality..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                />
              </div>
              <button
                type="button"
                onClick={() => setRequirementOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <ClipboardEdit className="w-3.5 h-3.5" />
                <span>Tell Us Requirement</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Listing Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Filter Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#D4A017]" />
                  <span className="text-sm font-bold text-neutral-950">Filters</span>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900"
                >
                  Reset All
                </button>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  City / Region
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50 font-medium"
                >
                  <option value="ALL">All Maharashtra</option>
                  <option value="Mumbai">Mumbai MMR</option>
                  <option value="Thane">Thane</option>
                  <option value="Navi Mumbai">Navi Mumbai</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              {/* Listing Type: Buy & Commercial ONLY (No Rent!) */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 rounded-xl">
                  {['ALL', 'BUY', 'COMMERCIAL'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setListingType(t)}
                      className={`py-1.5 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                        listingType === t
                          ? 'bg-neutral-950 text-white'
                          : 'text-neutral-600 hover:text-neutral-950'
                      }`}
                    >
                      {t === 'ALL' ? 'All' : t === 'BUY' ? 'Buy' : 'Commercial'}
                    </button>
                  ))}
                </div>
              </div>

              {/* BHK Configuration */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  BHK Configuration
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['1 BHK', '2 BHK', '3 BHK', '4 BHK'].map((b) => {
                    const isSelected = selectedBhks.includes(b);
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setSelectedBhks((prev) =>
                            isSelected ? prev.filter((item) => item !== b) : [...prev, b]
                          );
                        }}
                        className={`py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#D4A017] text-neutral-950 border-[#D4A017]'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Max Budget Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-neutral-700 mb-1.5">
                  <span>Max Budget</span>
                  <span>{maxPrice === 0 ? 'Any Budget' : formatIndianPrice(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000000"
                  step="2500000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#D4A017] cursor-pointer"
                />
              </div>

              {/* Possession Status */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Possession Timeline
                </label>
                <select
                  value={possessionStatus}
                  onChange={(e) => setPossessionStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-50"
                >
                  <option value="ALL">Any Timeline</option>
                  <option value="READY_TO_MOVE">Ready to Move</option>
                  <option value="UNDER_CONSTRUCTION">Under Construction</option>
                  <option value="NEW_LAUNCH">New Launch</option>
                </select>
              </div>

              {/* Verified Toggle */}
              <div className="pt-2 border-t border-neutral-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded text-[#D4A017] accent-[#D4A017]"
                  />
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Listings Only</span>
                </label>
              </div>

              {/* Requirement Card CTA in Sidebar */}
              <div className="p-4 bg-neutral-900 text-white rounded-2xl border border-neutral-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <ClipboardEdit className="w-3.5 h-3.5" />
                  Custom Property Search
                </span>
                <p className="text-[11px] text-neutral-300 leading-snug">
                  Looking for off-market or specific budget units? Let our senior team source it for you.
                </p>
                <button
                  type="button"
                  onClick={() => setRequirementOpen(true)}
                  className="w-full py-2 text-xs font-bold bg-[#D4A017] text-neutral-950 rounded-xl hover:bg-[#b88912] cursor-pointer transition-colors"
                >
                  Tell Us Requirement
                </button>
              </div>
            </div>
          </aside>

          {/* Right Main Grid */}
          <div className="flex-1 space-y-6">
            {/* Sorting & View Controls Bar */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-neutral-600">
                Showing <strong>{properties.length}</strong> verified properties for sale
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                  <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Sort by:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="py-1 px-2 text-xs rounded-lg border border-neutral-300 font-semibold text-neutral-800 bg-neutral-50"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="area_asc">Area: Low to High</option>
                    <option value="area_desc">Area: High to Low</option>
                  </select>
                </div>

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

            {/* Compared Floating Bar */}
            {comparedProperties.length > 0 && (
              <div className="bg-neutral-950 text-white p-3.5 rounded-2xl border border-neutral-800 flex items-center justify-between gap-4 shadow-lg animate-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-[#D4A017]" />
                  <span className="text-xs font-bold">
                    Comparing {comparedProperties.length} Properties
                  </span>
                  <div className="hidden sm:flex items-center gap-2">
                    {comparedProperties.map((p) => (
                      <span key={p.id} className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300">
                        {p.title}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setComparedProperties([])}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Clear Compare
                </button>
              </div>
            )}

            {/* Properties Grid */}
            {properties.length === 0 ? (
              <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-[#D4A017] mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950">No matching properties found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Can&apos;t find what you are looking for? Reset your filters or let us know your exact budget and location so we can source it directly for you.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => setRequirementOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#D4A017] text-neutral-950 text-xs font-bold hover:bg-[#b88912] flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ClipboardEdit className="w-3.5 h-3.5" />
                    <span>Tell Us Your Requirement</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
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
                      isCompared={comparedProperties.some((cp) => cp.id === prop.id)}
                    />
                  ))}
                </div>

                {/* Requirement Submission Banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-[#171717] via-neutral-900 to-[#1F2937] text-white border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#D4A017]/20 text-[#F4C430] border border-[#D4A017]/40 text-[10px] font-extrabold uppercase">
                      <Sparkles className="w-3 h-3 text-[#D4A017]" />
                      <span>Dedicated Buyer Sourcing</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-extrabold text-white">Can&apos;t Find Your Ideal Property?</h4>
                    <p className="text-xs text-neutral-300 max-w-xl leading-relaxed">
                      Submit your preferred location, BHK and budget. Our senior advisors will personally scout verified RERA developer units and off-market inventory with zero brokerage.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRequirementOpen(true)}
                    className="px-6 py-3 rounded-2xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs shrink-0 flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Tell Us Your Requirement</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
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

      <PropertyRequirementModal
        isOpen={requirementOpen}
        onClose={() => setRequirementOpen(false)}
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
