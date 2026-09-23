'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, ShieldCheck, Award, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { store } from '@/lib/data/store';

export default function DevelopersPage() {
  const developers = store.getDevelopers();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Navbar />

      <div className="bg-[#171717] text-white py-10 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <span className="text-xs font-bold text-[#D4A017] uppercase tracking-wide">
            Verified Partnerships
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Grade-A Real Estate Developers
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl">
            Partnered directly with India’s most reputed real estate brands. Enjoy zero brokerage, guaranteed direct developer allotment, and certified MahaRERA compliance.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((dev) => (
            <div
              key={dev.id}
              className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-100 relative overflow-hidden shrink-0">
                    <Image
                      src={dev.logo}
                      alt={dev.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-neutral-950">{dev.name}</h2>
                    <span className="text-xs text-neutral-500 font-medium">
                      Est. {dev.establishedYear} • {dev.completedSqFtMillion}M+ sq.ft delivered
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {dev.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>MahaRERA: {dev.reraRegistrationNumber}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-700">{dev.totalProjects} Active Projects</span>
                <Link
                  href={`/properties?q=${encodeURIComponent(dev.name)}`}
                  className="font-bold text-[#D4A017] hover:underline flex items-center gap-1"
                >
                  <span>Explore Properties</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
