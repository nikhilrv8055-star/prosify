'use client';

import React from 'react';
import {
  TrendingUp,
  Building2,
  Users,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  PlusCircle,
  FileSpreadsheet,
  RefreshCw,
  Sparkles,
  Layers,
  PhoneCall,
  Activity,
} from 'lucide-react';
import { formatIndianPrice } from '@/lib/utils';
import { Property, Lead, ChannelPartner, Booking, Commission, Unit } from '@/lib/types';

interface DashboardTabProps {
  properties: Property[];
  leads: Lead[];
  partners: ChannelPartner[];
  bookings: Booking[];
  commissions: Commission[];
  units: Unit[];
  onNavigateTab: (tab: string) => void;
  onTriggerSync: () => void;
}

export function DashboardTab({
  properties,
  leads,
  partners,
  bookings,
  commissions,
  units,
  onNavigateTab,
  onTriggerSync,
}: DashboardTabProps) {
  // Aggregate stats
  const totalPipelineValue = properties.reduce((acc, p) => acc + p.price, 0);
  const totalBookedValue = bookings.reduce((acc, b) => acc + b.totalAgreementValue, 0);
  const totalCommissionPending = commissions
    .filter((c) => c.status === 'PENDING' || c.status === 'APPROVED')
    .reduce((acc, c) => acc + c.amount, 0);
  const totalCommissionDisbursed = commissions
    .filter((c) => c.status === 'PAID')
    .reduce((acc, c) => acc + c.amount, 0);

  const availableUnits = units.filter((u) => u.status === 'AVAILABLE').length;
  const holdUnits = units.filter((u) => u.status === 'HOLD').length;
  const bookedUnits = units.filter((u) => u.status === 'BOOKED' || u.status === 'SOLD').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1E293B] via-[#0B1120] to-[#1E293B] border border-slate-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Executive Real Estate Command Center
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/40 font-mono">
              v3.8 ENTERPRISE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Live multi-developer synchronization, MahaRERA compliant brokerage ledger, and automated omnichannel attribution pipeline across Maharashtra.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('properties')}
            className="px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#10B981]/20 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Property</span>
          </button>
          <button
            onClick={() => onNavigateTab('crm')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-600 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>Ingest Lead</span>
          </button>
          <button
            onClick={onTriggerSync}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Trigger Instant Webhook & Catalog Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Sync Feeds</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gross Pipeline Value */}
        <div className="p-5 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 hover:border-slate-600 transition-all shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Gross Inventory Value</span>
            <div className="p-2 rounded-xl bg-[#10B981]/20 text-[#10B981]">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            ₹{(totalPipelineValue / 10000000).toFixed(1)} Cr
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-[#10B981] font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +18.4%
            </span>
            <span className="text-slate-400">vs last quarter</span>
          </div>
        </div>

        {/* Card 2: Closed Bookings */}
        <div className="p-5 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 hover:border-slate-600 transition-all shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Closed Deal Volume</span>
            <div className="p-2 rounded-xl bg-[#0EA5E9]/20 text-[#0EA5E9]">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            ₹{(totalBookedValue / 10000000).toFixed(2)} Cr
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>{bookings.length} Bookings Registered</span>
            <span className="text-[#0EA5E9] font-semibold cursor-pointer" onClick={() => onNavigateTab('inventory')}>
              View Units →
            </span>
          </div>
        </div>

        {/* Card 3: Channel Partner Network */}
        <div className="p-5 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 hover:border-slate-600 transition-all shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Active Channel Partners</span>
            <div className="p-2 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {partners.length}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">100% MahaRERA Verified</span>
            <span className="text-[#F59E0B] font-semibold cursor-pointer" onClick={() => onNavigateTab('partners')}>
              Manage CPs →
            </span>
          </div>
        </div>

        {/* Card 4: Brokerage & Payouts */}
        <div className="p-5 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 hover:border-slate-600 transition-all shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider">Brokerage Disbursed</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            ₹{(totalCommissionDisbursed / 100000).toFixed(1)} L
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span className="text-amber-400 font-medium">
              ₹{(totalCommissionPending / 100000).toFixed(1)} L Pending
            </span>
            <span className="text-purple-400 font-semibold cursor-pointer" onClick={() => onNavigateTab('commissions')}>
              Payouts →
            </span>
          </div>
        </div>
      </div>

      {/* Mid Section: Tower Inventory Matrix & Omnichannel Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Inventory Velocity */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#10B981]" />
                <span>Tower Inventory Velocity & Status</span>
              </h3>
              <p className="text-xs text-slate-400">
                Live unit availability across all active developer townships
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs text-[#0EA5E9] hover:underline flex items-center gap-1 font-semibold"
            >
              Open Inventory Engine →
            </button>
          </div>

          {/* Status Breakdown Bar */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(availableUnits / (units.length || 1)) * 100}%` }}
                className="bg-[#10B981] h-full"
                title={`Available: ${availableUnits}`}
              />
              <div
                style={{ width: `${(holdUnits / (units.length || 1)) * 100}%` }}
                className="bg-[#F59E0B] h-full"
                title={`Hold: ${holdUnits}`}
              />
              <div
                style={{ width: `${(bookedUnits / (units.length || 1)) * 100}%` }}
                className="bg-[#0EA5E9] h-full"
                title={`Booked/Sold: ${bookedUnits}`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span>Available: <strong className="text-slate-200">{availableUnits} units</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span>On Hold: <strong className="text-slate-200">{holdUnits} units</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9]" />
                <span>Booked / Sold: <strong className="text-slate-200">{bookedUnits} units</strong></span>
              </div>
            </div>
          </div>

          {/* Quick List of Active Projects */}
          <div className="pt-2 border-t border-slate-700/60">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Key Focus Townships
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {properties.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => onNavigateTab('properties')}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 hover:border-[#10B981]/50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{p.developerName} • {p.city}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-[#10B981] block">
                      {formatIndianPrice(p.price)}
                    </span>
                    <span className="text-[10px] text-slate-400">{p.bhk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Omnichannel Leads Ingestion Feed */}
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0EA5E9]" />
              <h3 className="text-sm font-bold text-white">Live Ingested Leads</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] font-mono">
              Active Stream
            </span>
          </div>

          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {leads.slice(0, 5).map((l) => (
              <div
                key={l.id}
                onClick={() => onNavigateTab('crm')}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 hover:border-slate-500 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white truncate">{l.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {l.source}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">{l.propertyTitle || l.location}</span>
                  <span className="font-semibold text-emerald-400">{l.budget}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('crm')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Open CRM Lead Pipeline ({leads.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
