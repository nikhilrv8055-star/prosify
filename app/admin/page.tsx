'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import {
  Users,
  LayoutDashboard,
  Calendar,
  Building,
  TrendingUp,
  Car,
  ShieldCheck,
  ClipboardEdit,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { LeadsTab } from '@/components/admin/LeadsTab';
import { store } from '@/lib/data/store';
import { Lead, SiteVisit, ChannelPartner, Property } from '@/lib/types';
import { formatIndianPrice } from '@/lib/utils';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'visits' | 'partners' | 'inventory'>('leads');
  const [leads, setLeads] = useState<Lead[]>(() => store.getLeads());
  const [visits, setVisits] = useState<SiteVisit[]>(() => store.getSiteVisits());
  const [partners, setPartners] = useState<ChannelPartner[]>(() => store.getPartners());
  const [properties, setProperties] = useState<Property[]>(() => store.getProperties());

  React.useEffect(() => {
    setLeads(store.getLeads());
    setVisits(store.getSiteVisits());
    setPartners(store.getPartners());
    setProperties(store.getProperties());
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Navbar />

      {/* Header */}
      <div className="bg-[#171717] text-white py-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4A017]/20 border border-[#D4A017]/40 text-[#F4C430] text-[10px] font-bold uppercase mb-1">
                <LayoutDashboard className="w-3 h-3 text-[#D4A017]" />
                Prosify Command Center
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Admin CRM & Buyer Desk Dashboard
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                Real-time lead ingestion, property requirement tracking, site visit coordination & partner network.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-300 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Feed Active
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-neutral-900/90 rounded-2xl border border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Ingested Leads</span>
              <span className="text-xl font-black text-white">{leads.length}</span>
            </div>
            <div className="p-3 bg-neutral-900/90 rounded-2xl border border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Scheduled Site Visits</span>
              <span className="text-xl font-black text-[#D4A017]">{visits.length}</span>
            </div>
            <div className="p-3 bg-neutral-900/90 rounded-2xl border border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Channel Partners</span>
              <span className="text-xl font-black text-white">{partners.length}</span>
            </div>
            <div className="p-3 bg-neutral-900/90 rounded-2xl border border-neutral-800">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Active Direct Listings</span>
              <span className="text-xl font-black text-emerald-400">{properties.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabbed Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-neutral-950 text-white'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            Leads & Requirements ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'visits'
                ? 'bg-neutral-950 text-white'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            Site Visits ({visits.length})
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'partners'
                ? 'bg-neutral-950 text-white'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            Channel Partners ({partners.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-neutral-950 text-white'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            Inventory Master ({properties.length})
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'leads' && <LeadsTab />}

        {activeTab === 'visits' && (
          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">Scheduled Site Visits</h3>
              <span className="text-xs text-neutral-500">Chauffeur dispatch and developer coordination</span>
            </div>
            {visits.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-400">
                No site visits recorded yet. Bookings from buyers will appear here in real-time.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Lead Name</th>
                      <th className="p-3.5">Property</th>
                      <th className="p-3.5">Date & Slot</th>
                      <th className="p-3.5">Chauffeur Cab</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {visits.map((v) => (
                      <tr key={v.id} className="hover:bg-neutral-50">
                        <td className="p-3.5 font-bold text-neutral-900">
                          {v.leadName}
                          <div className="text-[11px] font-normal text-neutral-500">{v.leadMobile}</div>
                        </td>
                        <td className="p-3.5 font-semibold text-neutral-800">{v.propertyTitle}</td>
                        <td className="p-3.5 text-neutral-600">
                          {v.date}
                          <div className="text-[10px] text-neutral-400">{v.timeSlot}</div>
                        </td>
                        <td className="p-3.5">
                          {v.cabRequired ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                              Pickup: {v.pickupAddress || 'Requested'}
                            </span>
                          ) : (
                            <span className="text-neutral-400 text-[11px]">Self conveyance</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {v.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'partners' && (
          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">Registered Channel Partners</h3>
              <span className="text-xs text-neutral-500">MahaRERA verified broker network</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Partner / Agency</th>
                    <th className="p-3.5">MahaRERA No.</th>
                    <th className="p-3.5">Contact</th>
                    <th className="p-3.5">Commission Slab</th>
                    <th className="p-3.5">Bookings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {partners.map((cp) => (
                    <tr key={cp.id} className="hover:bg-neutral-50">
                      <td className="p-3.5 font-bold text-neutral-900">
                        {cp.name}
                        <div className="text-[11px] font-normal text-neutral-500">{cp.agencyName}</div>
                      </td>
                      <td className="p-3.5 text-neutral-700 font-mono text-[11px]">{cp.reraNumber}</td>
                      <td className="p-3.5 text-neutral-600">
                        {cp.mobile}
                        <div className="text-[11px] text-neutral-400">{cp.email}</div>
                      </td>
                      <td className="p-3.5 text-neutral-800 font-semibold">{cp.commissionSlab}</td>
                      <td className="p-3.5 font-bold text-emerald-600">{cp.totalBookings} closed</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">Developer Property Master</h3>
              <span className="text-xs text-neutral-500">Live units on marketplace</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Property</th>
                    <th className="p-3.5">Developer</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Config / Area</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">RERA No.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {properties.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50">
                      <td className="p-3.5 font-bold text-neutral-900">{p.title}</td>
                      <td className="p-3.5 font-semibold text-neutral-700">{p.developerName}</td>
                      <td className="p-3.5 text-neutral-600">{p.locality}, {p.city}</td>
                      <td className="p-3.5 text-neutral-600">{p.bhk} • {p.carpetAreaSqFt} sq.ft</td>
                      <td className="p-3.5 font-bold text-neutral-900">{formatIndianPrice(p.price)}</td>
                      <td className="p-3.5 font-mono text-[11px] text-neutral-500">{p.reraNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
