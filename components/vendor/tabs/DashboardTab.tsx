'use client';

import React from 'react';
import {
  Building2,
  Layers,
  MessageSquare,
  Users,
  CreditCard,
  Receipt,
  LifeBuoy,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  PlusCircle,
  Eye,
} from 'lucide-react';
import {
  VendorPropertyItem,
  VendorProjectItem,
  PropertyMessageItem,
  VendorAgentItem,
  SupportTicketItem,
  PaymentLogItem,
} from '../types';
import { PortalUser } from '@/lib/auth/portalUsers';

interface DashboardTabProps {
  session: PortalUser;
  properties: VendorPropertyItem[];
  projects: VendorProjectItem[];
  messages: PropertyMessageItem[];
  agents: VendorAgentItem[];
  tickets: SupportTicketItem[];
  payments: PaymentLogItem[];
  onNavigateTab: (tab: any) => void;
}

export function DashboardTab({
  session,
  properties,
  projects,
  messages,
  agents,
  tickets,
  payments,
  onNavigateTab,
}: DashboardTabProps) {
  const totalPropertyValue = properties.reduce((sum, p) => sum + p.price, 0);
  const activePropertiesCount = properties.filter((p) => p.status === 'AVAILABLE').length;
  const newMessagesCount = messages.filter((m) => m.status === 'NEW').length;
  const openTicketsCount = tickets.filter((t) => t.status !== 'RESOLVED').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Vendor Enterprise
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
                PRO DEVELOPER TIER
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Welcome back, {session.name}
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Real-time command center for property inventory syndication, project milestones, verified agent networks, and buyer inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('properties')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:from-sky-500 hover:to-sky-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-sky-500/20 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Property</span>
            </button>
            <button
              onClick={() => onNavigateTab('buy-plan')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 cursor-pointer"
            >
              <span>Manage Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('properties')}
          className="p-4 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 hover:border-sky-500/50 transition-all cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Properties Managed</span>
            <Building2 className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">{properties.length}</div>
          <span className="text-[11px] text-emerald-400 font-semibold">{activePropertiesCount} Active on Market</span>
        </div>

        <div
          onClick={() => onNavigateTab('projects')}
          className="p-4 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 hover:border-indigo-500/50 transition-all cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Projects Active</span>
            <Layers className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">{projects.length}</div>
          <span className="text-[11px] text-slate-300">1,800+ Total Units</span>
        </div>

        <div
          onClick={() => onNavigateTab('messages')}
          className="p-4 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Property Inquiries</span>
            <MessageSquare className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">{messages.length}</div>
          <span className="text-[11px] text-amber-400 font-semibold">
            {newMessagesCount > 0 ? `${newMessagesCount} New Inquiries` : 'All Responded'}
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('agents')}
          className="p-4 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Channel Partners</span>
            <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white mt-1.5">{agents.length}</div>
          <span className="text-[11px] text-emerald-400">27 Deals Closed</span>
        </div>
      </div>

      {/* Secondary Metrics & Active Plan Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Portfolio Valuation</span>
          <div className="text-xl font-black text-sky-400 font-mono">
            ₹{(totalPropertyValue / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-slate-500">Live verified listed value</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Subscription & Plan</span>
          <div className="text-xl font-black text-emerald-400">Pro Developer</div>
          <span className="text-[10px] text-slate-400">Renews on 20 Oct 2026 (Auto-Renew Active)</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Support Desk Health</span>
          <div className="text-xl font-black text-amber-400">
            {openTicketsCount > 0 ? `${openTicketsCount} Pending Ticket` : 'All Resolved'}
          </div>
          <span className="text-[10px] text-slate-500">Average response time: 45 mins</span>
        </div>
      </div>

      {/* Two-Column Section: Recent Messages & Quick Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Property Messages */}
        <div className="p-5 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Recent Buyer Messages</h3>
            </div>
            <button
              onClick={() => onNavigateTab('messages')}
              className="text-xs text-sky-400 hover:underline font-semibold"
            >
              View All Messages →
            </button>
          </div>

          <div className="space-y-2.5">
            {messages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                onClick={() => onNavigateTab('messages')}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-white font-semibold">{msg.senderName}</strong>
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>
                <p className="text-[11px] text-sky-300 font-medium truncate">{msg.propertyTitle}</p>
                <p className="text-[11px] text-slate-400 truncate">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Properties Spotlight */}
        <div className="p-5 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">Listed Property Inventory</h3>
            </div>
            <button
              onClick={() => onNavigateTab('properties')}
              className="text-xs text-sky-400 hover:underline font-semibold"
            >
              Manage Inventory →
            </button>
          </div>

          <div className="space-y-2.5">
            {properties.slice(0, 3).map((prop) => (
              <div
                key={prop.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-white truncate max-w-xs">{prop.title}</h4>
                  <p className="text-[11px] text-slate-400">
                    {prop.location}, {prop.city} • {prop.bhk} • {prop.carpetArea} sq.ft
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <strong className="text-emerald-400 font-mono block">
                    ₹{(prop.price / 10000000).toFixed(2)} Cr
                  </strong>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      prop.status === 'AVAILABLE'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {prop.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
