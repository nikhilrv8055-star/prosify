'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { ProjectCard } from '@/components/marketplace/ProjectCard';
import { store } from '@/lib/data/store';
import { useLiveStore } from '@/lib/data/useLiveStore';

function ProjectsListContent() {
  const searchParams = useSearchParams();
  const { projects: allLiveProjects, cities } = useLiveStore();
  const [city, setCity] = useState(searchParams?.get('city') || 'ALL');
  const [query, setQuery] = useState(searchParams?.get('q') || '');

  const projects = useMemo(() => {
    return store.getProjects({
      city: city === 'ALL' ? undefined : city,
      search: query || undefined,
    });
  }, [city, query, allLiveProjects]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-[#171717] text-white py-12 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F4C430]">
              RERA Registered Developments Across India
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Integrated Townships & Residential Projects
            </h1>
            <p className="text-sm text-neutral-400">
              Browse masterplanned communities from India’s foremost developers across Mumbai, Pune, Bangalore, Hyderabad, Chennai, Delhi NCR, and Ahmedabad.
            </p>
          </div>

          {/* Search & City Filter */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 max-w-2xl">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects or developers..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
              />
            </div>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full sm:w-48 py-2 px-3 text-xs sm:text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
            >
              <option value="ALL">All 9 Indian Metros</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-6">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>Found <strong>{projects.length}</strong> masterplanned projects</span>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="font-bold text-neutral-900 text-base">No projects match your search</h3>
            <button
              onClick={() => {
                setCity('ALL');
                setQuery('');
              }}
              className="text-xs text-[#D4A017] font-semibold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 p-8 text-center text-xs text-neutral-500">Loading projects...</div>}>
      <ProjectsListContent />
    </Suspense>
  );
}
