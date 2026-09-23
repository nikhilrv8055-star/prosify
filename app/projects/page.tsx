'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, ShieldCheck, MapPin, Building, ArrowRight, Sparkles, ClipboardEdit } from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { PropertyRequirementModal } from '@/components/marketplace/PropertyRequirementModal';
import { store } from '@/lib/data/store';

export default function ProjectsPage() {
  const [city, setCity] = useState('ALL');
  const [requirementOpen, setRequirementOpen] = useState(false);
  const projects = store.getProjects(city);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Navbar />

      <div className="bg-[#171717] text-white py-10 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#D4A017] uppercase tracking-wide">
                Masterplanned Communities
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
                New Launch & Landmark Projects
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
                Explore integrated townships and luxury developments with direct developer allotment and pre-launch pricing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRequirementOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#D4A017] text-neutral-950 font-bold text-xs shrink-0 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <ClipboardEdit className="w-4 h-4" />
              <span>Post Project Requirement</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['ALL', 'Mumbai', 'Thane', 'Navi Mumbai', 'Pune'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCity(c)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                city === c
                  ? 'bg-neutral-950 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {c === 'ALL' ? 'All Locations' : c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="group bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col"
            >
              <div className="relative aspect-16/10 bg-neutral-100 overflow-hidden">
                <Image
                  src={proj.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80'}
                  alt={proj.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase">
                  {proj.status.replace('_', ' ')}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{proj.locality}, {proj.city}</span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-950">{proj.name}</h3>
                  <p className="text-xs font-semibold text-[#D4A017]">{proj.developerName}</p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {proj.highlights.map((h, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-medium">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Price Range</span>
                    <span className="text-sm font-black text-neutral-950">{proj.priceRange}</span>
                  </div>
                  <Link
                    href={`/properties?q=${encodeURIComponent(proj.name)}`}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold transition-colors"
                  >
                    View Units
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      <PropertyRequirementModal
        isOpen={requirementOpen}
        onClose={() => setRequirementOpen(false)}
      />
    </div>
  );
}
