'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  Search,
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  Building,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Briefcase,
  Layers,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { store } from '@/lib/data/store';
import { EnquiryModal } from '@/components/marketplace/EnquiryModal';

export default function DevelopersPage() {
  const [search, setSearch] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedDeveloperForEnquiry, setSelectedDeveloperForEnquiry] = useState<string | null>(null);

  const developers = useMemo(() => {
    let list = store.getDevelopers();
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.about.toLowerCase().includes(q) ||
          (d.headquarters && d.headquarters.toLowerCase().includes(q))
      );
    }
    if (verifiedOnly) {
      list = list.filter((d) => d.isVerified);
    }
    return list;
  }, [search, verifiedOnly]);

  const allProjects = useMemo(() => store.getProjects(), []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#171717] text-white py-14 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4A017]">
            <Award className="w-4 h-4" />
            <span>MahaRERA Audited & Verified Developers</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Maharashtra’s Leading Real Estate Developers
              </h1>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Explore verified corporate developers, track masterplanned township portfolios, delivery records, and verified RERA compliance across MMR and Pune.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 sm:gap-6 bg-neutral-900/90 border border-neutral-800 p-4 rounded-2xl shrink-0">
              <div className="text-center px-3 border-r border-neutral-800">
                <span className="block text-xl font-extrabold text-[#D4A017]">
                  {store.getDevelopers().length}
                </span>
                <span className="text-[11px] text-neutral-400">Audited Groups</span>
              </div>
              <div className="text-center px-3 border-r border-neutral-800">
                <span className="block text-xl font-extrabold text-white">100%</span>
                <span className="text-[11px] text-neutral-400">MahaRERA Reg.</span>
              </div>
              <div className="text-center px-3">
                <span className="block text-xl font-extrabold text-emerald-400">
                  {allProjects.length}+
                </span>
                <span className="text-[11px] text-neutral-400">Active Townships</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        {/* Search & Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by builder name, group or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D4A017] transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700 select-none bg-neutral-50 hover:bg-neutral-100 px-3.5 py-2 rounded-xl border border-neutral-200 transition-colors">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded-sm text-[#D4A017] focus:ring-[#D4A017] accent-[#D4A017]"
              />
              <span>RERA Verified Only</span>
            </label>

            <span className="text-xs text-neutral-500">
              Showing <strong className="text-neutral-900">{developers.length}</strong> developers
            </span>
          </div>
        </div>

        {/* Developer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((dev) => {
            const devProjects = allProjects.filter(
              (p) => p.developerId === dev.id || p.developerName === dev.name
            );

            return (
              <div
                key={dev.id}
                className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                {/* Card Header & Brand */}
                <div className="p-6 border-b border-neutral-100 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-neutral-100 bg-neutral-50 shrink-0">
                      <Image
                        src={dev.logoUrl}
                        alt={dev.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {dev.isVerified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>MahaRERA Verified</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-neutral-950 group-hover:text-[#D4A017] transition-colors line-clamp-1">
                      <Link href={`/developers/${dev.slug}`}>{dev.name}</Link>
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Est. {dev.establishedYr}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{dev.headquarters || 'Mumbai, Maharashtra'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {dev.about}
                  </p>
                </div>

                {/* Track Record Stats */}
                <div className="grid grid-cols-3 bg-neutral-50/80 px-4 py-3 border-b border-neutral-100 text-center">
                  <div className="border-r border-neutral-200/60">
                    <span className="block text-sm font-bold text-neutral-900">
                      {dev.totalProjects || devProjects.length}
                    </span>
                    <span className="text-[10px] text-neutral-500">Total Proj.</span>
                  </div>
                  <div className="border-r border-neutral-200/60">
                    <span className="block text-sm font-bold text-neutral-900">
                      {dev.ongoingProjects || Math.max(1, devProjects.length)}
                    </span>
                    <span className="text-[10px] text-neutral-500">Active</span>
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-emerald-700">
                      {dev.completedProjects || 12}+
                    </span>
                    <span className="text-[10px] text-neutral-500">Delivered</span>
                  </div>
                </div>

                {/* Active Projects Preview */}
                <div className="p-4 flex-1 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Featured Developments
                  </span>
                  {devProjects.length > 0 ? (
                    <div className="space-y-1.5">
                      {devProjects.slice(0, 2).map((proj) => (
                        <Link
                          key={proj.id}
                          href={`/projects/${proj.slug}`}
                          className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-xs text-neutral-800 transition-colors"
                        >
                          <span className="font-semibold truncate">{proj.name}</span>
                          <span className="text-neutral-500 text-[11px] shrink-0">{proj.locality}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 italic">Portfolio under verification</p>
                  )}
                </div>

                {/* Action Buttons (Real, functional handlers) */}
                <div className="p-4 border-t border-neutral-100 bg-white grid grid-cols-3 gap-2">
                  <Link
                    href={`/developers/${dev.slug}`}
                    className="col-span-1 py-2 px-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-900 text-xs font-semibold flex items-center justify-center gap-1 transition-colors text-center"
                  >
                    <span>Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href="https://wa.me/919326303244"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-1 py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors text-center"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setSelectedDeveloperForEnquiry(dev.name)}
                    className="col-span-1 py-2 px-2 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 text-xs font-bold transition-all shadow-xs text-center"
                  >
                    Enquire
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {developers.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200 space-y-3">
            <Building className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="font-bold text-neutral-900 text-base">No developers found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              We couldn’t find any builders matching your search. Try resetting your query or viewing all developers.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setVerifiedOnly(false);
              }}
              className="mt-2 text-xs font-bold text-[#D4A017] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Enquiry Modal for developer desk */}
      {selectedDeveloperForEnquiry && (
        <EnquiryModal
          isOpen={!!selectedDeveloperForEnquiry}
          onClose={() => setSelectedDeveloperForEnquiry(null)}
          propertyTitle={`Developer Desk: ${selectedDeveloperForEnquiry}`}
          propertyLocation="Corporate Sales Desk"
        />
      )}

      <Footer />
    </div>
  );
}
