'use client';

import React, { useMemo } from 'react';
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
  RefreshCw,
  Sparkles,
  Layers,
  PhoneCall,
  Activity,
  Flame,
  CalendarCheck,
  AlertTriangle,
  MapPin,
  Bot,
  FileCheck2,
  Boxes,
} from 'lucide-react';
import { formatIndianPrice } from '@/lib/utils';
import { Property, Project, Lead, ChannelPartner, Booking, Commission, Unit, AuditLogItem } from '@/lib/types';
import { store } from '@/lib/data/store';

interface DashboardTabProps {
  properties: Property[];
  projects?: Project[];
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
  projects = store.getAllProjectsForAdmin(),
  leads,
  partners,
  bookings,
  commissions,
  units,
  onNavigateTab,
  onTriggerSync,
}: DashboardTabProps) {
  // 7 Primary Command Center KPI Counts
  const totalLeadsCount = leads.length;
  const hotLeadsCount = leads.filter(
    (l) => l.qualification === 'HOT' || (l.leadScore || 0) >= 80 || l.status === 'BOOKED' || l.status === 'SITE_VISIT'
  ).length;

  const pendingVerificationProjectsCount = projects.filter(
    (p) =>
      p.verificationStatus === 'DATA_RECEIVED' ||
      p.verificationStatus === 'VALIDATION' ||
      p.verificationStatus === 'RERA_CHECK' ||
      p.verificationStatus === 'DOCUMENT_CHECK' ||
      p.verificationStatus === 'HUMAN_VERIFICATION' ||
      !p.isProVerifyCertified
  ).length;

  const scheduledSiteVisitsCount = leads.filter(
    (l) => l.status === 'SITE_VISIT_SCHEDULED' || l.status === 'SITE_VISIT'
  ).length;

  const totalProjectsCount = projects.length;
  const availableInventoryCount = units.filter((u) => u.status === 'AVAILABLE').length;
  const proVerifyCertifiedProjectsCount = projects.filter((p) => p.isProVerifyCertified).length;

  // Property Demand Analytics (Grouped by: Thane, Navi Mumbai, Mumbai Suburbs, Other Maharashtra locations)
  const demandAnalytics = useMemo(() => {
    const buckets = {
      thane: { count: 0, leads: 0, totalValue: 0 },
      naviMumbai: { count: 0, leads: 0, totalValue: 0 },
      mumbaiSuburbs: { count: 0, leads: 0, totalValue: 0 },
      otherMaharashtra: { count: 0, leads: 0, totalValue: 0 },
    };

    for (const p of properties) {
      const cityLoc = `${p.city} ${p.locality}`.toLowerCase();
      if (cityLoc.includes('thane') || cityLoc.includes('ghodbunder') || cityLoc.includes('majiwada')) {
        buckets.thane.count++;
        buckets.thane.totalValue += p.price;
      } else if (cityLoc.includes('navi mumbai') || cityLoc.includes('kharghar') || cityLoc.includes('vashi') || cityLoc.includes('panvel')) {
        buckets.naviMumbai.count++;
        buckets.naviMumbai.totalValue += p.price;
      } else if (
        cityLoc.includes('mumbai') ||
        cityLoc.includes('bandra') ||
        cityLoc.includes('andheri') ||
        cityLoc.includes('powai') ||
        cityLoc.includes('mulund') ||
        cityLoc.includes('borivali')
      ) {
        buckets.mumbaiSuburbs.count++;
        buckets.mumbaiSuburbs.totalValue += p.price;
      } else {
        buckets.otherMaharashtra.count++;
        buckets.otherMaharashtra.totalValue += p.price;
      }
    }

    for (const l of leads) {
      const loc = (l.location || l.requirement || '').toLowerCase();
      if (loc.includes('thane')) buckets.thane.leads++;
      else if (loc.includes('navi mumbai') || loc.includes('panvel')) buckets.naviMumbai.leads++;
      else if (loc.includes('mumbai') || loc.includes('bandra') || loc.includes('powai')) buckets.mumbaiSuburbs.leads++;
      else buckets.otherMaharashtra.leads++;
    }

    return [
      { name: 'Thane', leads: buckets.thane.leads, properties: buckets.thane.count, valCr: (buckets.thane.totalValue / 10000000).toFixed(1), color: '#D4A017' },
      { name: 'Navi Mumbai', leads: buckets.naviMumbai.leads, properties: buckets.naviMumbai.count, valCr: (buckets.naviMumbai.totalValue / 10000000).toFixed(1), color: '#0EA5E9' },
      { name: 'Mumbai Suburbs', leads: buckets.mumbaiSuburbs.leads, properties: buckets.mumbaiSuburbs.count, valCr: (buckets.mumbaiSuburbs.totalValue / 10000000).toFixed(1), color: '#10B981' },
      { name: 'Other Maharashtra locations', leads: buckets.otherMaharashtra.leads, properties: buckets.otherMaharashtra.count, valCr: (buckets.otherMaharashtra.totalValue / 10000000).toFixed(1), color: '#8B5CF6' },
    ];
  }, [properties, leads]);

  // AI Alerts
  const aiAlerts = useMemo(() => {
    const list: Array<{ id: string; type: 'RERA_MISMATCH' | 'PROPERTY_MISMATCH' | 'HOT_LEAD'; title: string; desc: string; time: string; severity: 'critical' | 'warning' | 'info' }> = [];

    // Find RERA mismatches in projects
    for (const proj of projects) {
      if (proj.reraValidationSummary?.hasMismatches) {
        list.push({
          id: `alert-rera-${proj.id}`,
          type: 'RERA_MISMATCH',
          title: `MahaRERA Escrow Audit Alert: ${proj.name}`,
          desc: `${proj.reraValidationSummary.issues[0] || 'Escrow 70:30 bank reconciliation discrepancy found by ProVerify Agent.'}`,
          time: '25m ago',
          severity: 'critical',
        });
      }
    }

    // HOT Leads alert
    const hot = leads.find((l) => l.qualification === 'HOT' || (l.leadScore || 0) >= 80);
    if (hot) {
      list.push({
        id: `alert-hot-${hot.id}`,
        type: 'HOT_LEAD',
        title: `🔥 High-Intent Lead Alert: ${hot.name}`,
        desc: `Score: ${hot.leadScore || 85}/100 (HOT). High budget (${hot.budget}) inquiring for ${hot.propertyTitle || hot.location}. Immediate callback required.`,
        time: '12m ago',
        severity: 'critical',
      });
    }

    // Property mismatch / inventory threshold
    list.push({
      id: 'alert-prop-mismatch',
      type: 'PROPERTY_MISMATCH',
      title: 'ProMatch Inventory Alignment Notice',
      desc: 'Buyer demand for 3 BHK in Majiwada exceeds current verified ready inventory by 24%. Syndication feed update recommended.',
      time: '1h ago',
      severity: 'warning',
    });

    return list;
  }, [projects, leads]);

  // Live Activity Feed from store audit logs
  const auditLogs = store.getAuditLogs().slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1E293B] via-[#0B1120] to-[#1E293B] border border-slate-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4A017] animate-ping" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Prosify Command Center™
            </h2>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#D4A017]/20 text-[#D4A017] border border-[#D4A017]/40 font-mono">
              AI REALTY OPERATING SYSTEM
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Centralized operations engine unifying ProMatch™ AI matching, ProLead™ lead scoring, ProVerify™ compliance, and real-time Maharashtra inventory syndication.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('verification')}
            className="px-3.5 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b8890f] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#D4A017]/20 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ProVerify™ Queue</span>
          </button>
          <button
            onClick={() => onNavigateTab('crm')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-600 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>ProLead™ CRM</span>
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

      {/* 7 COMMAND CENTER KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* KPI 1: Total Leads */}
        <div
          onClick={() => onNavigateTab('leads')}
          className="p-4 rounded-xl bg-[#1E293B]/90 border border-slate-700 hover:border-slate-500 cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Total Leads</span>
            <Users className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white tracking-tight">{totalLeadsCount}</div>
          <span className="text-[10px] text-emerald-400 font-medium">+14% this week</span>
        </div>

        {/* KPI 2: Hot Leads */}
        <div
          onClick={() => onNavigateTab('crm')}
          className="p-4 rounded-xl bg-[#1E293B]/90 border border-amber-500/40 hover:border-amber-500 cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-amber-300">Hot Leads</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 tracking-tight">{hotLeadsCount}</div>
          <span className="text-[10px] text-amber-300/80 font-medium">Score ≥ 80 / Hot</span>
        </div>

        {/* KPI 3: Pending Verification Projects */}
        <div
          onClick={() => onNavigateTab('verification')}
          className="p-4 rounded-xl bg-[#1E293B]/90 border border-slate-700 hover:border-[#D4A017] cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Pending Verify</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white tracking-tight">{pendingVerificationProjectsCount}</div>
          <span className="text-[10px] text-amber-400 font-medium">Officer action due</span>
        </div>

        {/* KPI 4: Scheduled Site Visits */}
        <div
          onClick={() => onNavigateTab('crm')}
          className="p-4 rounded-xl bg-[#1E293B]/90 border border-slate-700 hover:border-slate-500 cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Site Visits</span>
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white tracking-tight">{scheduledSiteVisitsCount}</div>
          <span className="text-[10px] text-slate-400">Scheduled / Done</span>
        </div>

        {/* KPI 5: Total Projects */}
        <div
          onClick={() => onNavigateTab('projects')}
          className="p-4 rounded-xl bg-[#1E293B]/90 border border-slate-700 hover:border-slate-500 cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Total Projects</span>
            <Building2 className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white tracking-tight">{totalProjectsCount}</div>
          <span className="text-[10px] text-slate-400 font-medium">Maharashtra</span>
        </div>

        {/* KPI 6: Available Inventory */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="p-4 rounded-xl bg-[#1E293B]/90 border border-slate-700 hover:border-slate-500 cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">Inventory</span>
            <Boxes className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white tracking-tight">{availableInventoryCount}</div>
          <span className="text-[10px] text-emerald-400 font-medium">Available Units</span>
        </div>

        {/* KPI 7: ProVerify Certified Projects */}
        <div
          onClick={() => onNavigateTab('verification')}
          className="p-4 rounded-xl bg-[#1E293B]/90 border border-[#D4A017]/50 hover:border-[#D4A017] cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[#D4A017]">ProVerify™</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4A017]" />
          </div>
          <div className="text-xl font-bold text-[#D4A017] tracking-tight">{proVerifyCertifiedProjectsCount}</div>
          <span className="text-[10px] text-emerald-400 font-medium">100% Certified</span>
        </div>
      </div>

      {/* MID SECTION: Property Demand Analytics & AI Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Property Demand Analytics (Grouped by Thane, Navi Mumbai, Mumbai Suburbs, Other Maharashtra) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D4A017]" />
              <div>
                <h3 className="text-sm font-bold text-white">Property Demand Analytics</h3>
                <p className="text-xs text-slate-400">Micro-market buyer inquiry concentration across Maharashtra</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              Live Aggregate
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {demandAnalytics.map((region) => {
              const percentage = Math.round((region.leads / (leads.length || 1)) * 100);
              return (
                <div key={region.name} className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: region.color }} />
                      <span>{region.name}</span>
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span><strong>{region.leads}</strong> Inquiries ({percentage}%)</span>
                      <span className="text-slate-500">•</span>
                      <span><strong>{region.properties}</strong> Properties (₹{region.valCr} Cr)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(8, percentage)}%`,
                        backgroundColor: region.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI ALERTS WIDGET */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Autonomous AI Alerts</h3>
                <p className="text-xs text-slate-400">ProVerify & ProLead cognitive scanner warnings</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
              {aiAlerts.length} Active
            </span>
          </div>

          <div className="space-y-2.5">
            {aiAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-xl border text-xs space-y-1 ${
                  alert.severity === 'critical'
                    ? 'bg-red-500/10 border-red-500/30 text-red-300'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{alert.title}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-normal">{alert.time}</span>
                </div>
                <p className="text-[11px] text-slate-300 pl-5 leading-relaxed">{alert.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('ai-governance')}
            className="w-full py-2 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 font-medium text-xs border border-purple-800/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Open AI Governance & Action Ledger</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ACTIVITY FEED SECTION */}
      <div className="p-6 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#10B981]" />
            <div>
              <h3 className="text-sm font-bold text-white">Live Operating System Activity Feed</h3>
              <p className="text-xs text-slate-400">Chronological immutable event ledger across leads, verification, and CRM sync</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('audit-logs')}
            className="text-xs text-[#D4A017] hover:underline font-semibold flex items-center gap-1"
          >
            <span>Full Audit Trail →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                  {log.action}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-slate-200 text-[11px] leading-snug line-clamp-2">
                {log.details || log.metadata || `${log.entity} updated`}
              </p>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                Actor: {log.user}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

