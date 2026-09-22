'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Users, Building, CheckCircle2, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { brandConfig } from '@/src/config/brand';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50">
      <Navbar />

      {/* Hero */}
      <div className="bg-[#171717] text-white py-16 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">
            Trusted Real Estate Ecosystem
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            About {brandConfig.name}
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
            Maharashtra’s premier MahaRERA-certified real estate marketplace and unified channel partner ecosystem, connecting homebuyers, verified channel partners, and Grade-A developers.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1 space-y-12">
        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D4A017] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-neutral-950">100% MahaRERA Compliance</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every property and township listed on {brandConfig.name} is verified against government MahaRERA records. Zero deceptive listings, zero speculative advertisements.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-neutral-950">Empowering Channel Partners</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Providing 1,200+ registered brokers and agencies with transparent 30-day attribution tracking, real-time client pipeline visibility, and automated commission settlements.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-neutral-950">Direct Developer Inventory</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Partnered directly with Godrej Properties, Lodha, Oberoi Realty, and Runwal for live unit availability, direct builder pricing, and zero brokerage to homebuyers.
            </p>
          </div>
        </div>

        {/* Credentials & Numbers */}
        <div className="bg-[#171717] text-white p-8 rounded-3xl border border-neutral-800 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl font-bold text-white">Our Track Record in Numbers</h3>
            <p className="text-xs text-neutral-400">Transforming property transactions across MMR and Pune</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center pt-4">
            <div>
              <strong className="text-3xl font-extrabold text-[#F4C430] block">₹1,250+ Cr</strong>
              <span className="text-xs text-neutral-400 mt-1 block">GMV Transacted</span>
            </div>
            <div>
              <strong className="text-3xl font-extrabold text-white block">3,400+</strong>
              <span className="text-xs text-neutral-400 mt-1 block">Happy Homeowners</span>
            </div>
            <div>
              <strong className="text-3xl font-extrabold text-white block">1,200+</strong>
              <span className="text-xs text-neutral-400 mt-1 block">Registered Channel Partners</span>
            </div>
            <div>
              <strong className="text-3xl font-extrabold text-emerald-400 block">100%</strong>
              <span className="text-xs text-neutral-400 mt-1 block">MahaRERA Audited</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
