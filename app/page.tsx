'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  Building2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Award,
  PhoneCall,
  ClipboardEdit,
  Car,
  BadgePercent,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { PropertyCard } from '@/components/marketplace/PropertyCard';
import { EnquiryModal } from '@/components/marketplace/EnquiryModal';
import { SiteVisitModal } from '@/components/marketplace/SiteVisitModal';
import { PropertyRequirementModal } from '@/components/marketplace/PropertyRequirementModal';
import { store } from '@/lib/data/store';
import { Property } from '@/lib/types';
import { brandConfig } from '@/src/config/brand';

export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState('ALL');
  const [bhk, setBhk] = useState('ALL');
  const [budget, setBudget] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [requirementModalOpen, setRequirementModalOpen] = useState(false);

  const featuredProperties = store.getFeaturedProperties();
  const developers = store.getDevelopers();
  const projects = store.getProjects();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city !== 'ALL') params.set('city', city);
    if (bhk !== 'ALL') params.set('bhk', bhk);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white pt-12 pb-20 sm:pt-16 sm:pb-24 overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4A017_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-700/80 text-neutral-300 text-xs shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">Direct Developer Pricing</span>
            <span className="text-neutral-500">•</span>
            <span className="text-[#D4A017] font-bold">Zero Brokerage</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Buy Premium Properties Directly From Top Developers
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Verified RERA residences, luxury sea-facing highrises, and corporate commercial spaces across Mumbai, Thane, Navi Mumbai, and Pune.
          </p>

          {/* Quick Search Form */}
          <div className="max-w-4xl mx-auto bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border border-neutral-200 text-neutral-900 mt-6">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* City */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1 text-left">
                  City / Region
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                >
                  <option value="ALL">All Maharashtra</option>
                  <option value="Mumbai">Mumbai MMR</option>
                  <option value="Thane">Thane</option>
                  <option value="Navi Mumbai">Navi Mumbai</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              {/* BHK */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1 text-left">
                  Configuration
                </label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                >
                  <option value="ALL">All Configurations</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4+ BHK / Penthouse</option>
                </select>
              </div>

              {/* Locality or Keyword */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1 text-left">
                  Locality / Project
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Lower Parel, Kolshet"
                  className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                />
              </div>

              {/* Search CTA */}
              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Search className="w-4 h-4 text-[#D4A017]" />
                  <span>Search Properties</span>
                </button>
              </div>
            </form>

            {/* Quick Requirement Link under search */}
            <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-neutral-500">
                Can&apos;t find your exact specification?
              </span>
              <button
                type="button"
                onClick={() => setRequirementModalOpen(true)}
                className="text-[#D4A017] hover:text-[#b88912] font-bold flex items-center gap-1 cursor-pointer"
              >
                <ClipboardEdit className="w-3.5 h-3.5" />
                <span>Tell Us Your Property Requirement &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED REQUIREMENT BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 w-full">
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#D4A017]/20 border border-[#D4A017]/40 text-[#F4C430] text-[10px] font-extrabold uppercase">
              <Sparkles className="w-3 h-3 text-[#D4A017]" />
              Buyer Concierge Service
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Tell Us Your Property Requirement
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
              Have specific budget criteria or looking for pre-launch developer allocation? Submit your exact requirement and get direct-developer options with zero brokerage within 30 minutes.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setRequirementModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <ClipboardEdit className="w-4 h-4" />
              <span>Submit Requirement</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#D4A017] uppercase tracking-wider">
              Exclusive Inventory
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950">
              Featured Properties for Sale
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Hand-picked verified luxury residences and commercial suites
            </p>
          </div>

          <Link
            href="/properties"
            className="text-xs font-bold text-neutral-900 hover:text-[#D4A017] flex items-center gap-1 transition-colors"
          >
            <span>View All ({store.getProperties().length}) Properties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((prop) => (
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
            />
          ))}
        </div>
      </section>

      {/* Why Buy Through Prosify Section */}
      <section className="bg-neutral-900 text-white py-16 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#D4A017] uppercase tracking-wider">
              The Prosify Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Why Buyers Trust Prosify
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Transparent transactions directly with top-tier developers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-neutral-950/80 rounded-3xl border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-[#D4A017] flex items-center justify-center font-bold">
                <BadgePercent className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Zero Brokerage</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Direct transactions without intermediary charges. 100% savings on brokerage fees for property buyers.
              </p>
            </div>

            <div className="p-6 bg-neutral-950/80 rounded-3xl border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-[#D4A017] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">100% RERA Verified</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Every listed project is verified with official MahaRERA registration, floor plans, and title clearances.
              </p>
            </div>

            <div className="p-6 bg-neutral-950/80 rounded-3xl border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-[#D4A017] flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Free Chauffeur Site Visits</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Experience doorstep luxury pickup & drop for site visits with dedicated property specialists.
              </p>
            </div>

            <div className="p-6 bg-neutral-950/80 rounded-3xl border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-[#D4A017] flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Direct Developer Discounts</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Exclusive festive schemes, pre-launch priority allocations, and upfront developer price benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Developers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#D4A017] uppercase tracking-wider">
              Trusted Builders
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950">
              Leading Real Estate Developers
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Certified developers with proven delivery track records in Maharashtra
            </p>
          </div>

          <Link
            href="/developers"
            className="text-xs font-bold text-neutral-900 hover:text-[#D4A017] flex items-center gap-1"
          >
            <span>View All Developers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.slice(0, 3).map((dev) => (
            <div
              key={dev.id}
              className="p-5 rounded-3xl border border-neutral-200 bg-white hover:shadow-lg transition-all space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 relative overflow-hidden shrink-0">
                  <Image
                    src={dev.logo}
                    alt={dev.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-950 line-clamp-1">{dev.name}</h3>
                  <span className="text-[11px] text-neutral-500">Est. {dev.establishedYear} • {dev.completedSqFtMillion}M+ sq.ft delivered</span>
                </div>
              </div>
              <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                {dev.description}
              </p>
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-medium">{dev.totalProjects} Active Projects</span>
                <Link
                  href={`/properties?q=${encodeURIComponent(dev.name)}`}
                  className="font-bold text-[#D4A017] hover:underline"
                >
                  View Listings &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

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
        isOpen={requirementModalOpen}
        onClose={() => setRequirementModalOpen(false)}
      />
    </div>
  );
}
