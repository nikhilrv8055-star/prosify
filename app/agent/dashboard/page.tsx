'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Users,
  Target,
  DollarSign,
  UserPlus,
  LogOut,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  TrendingUp,
  Award,
  ChevronRight,
  ShieldCheck,
  Send,
  Loader2,
  Check,
  Calculator,
  Activity,
} from 'lucide-react';
import { ProsifyAnimatedLogo } from '@/components/brand/ProsifyAnimatedLogo';
import { AgentCommissionCalculator } from '@/components/agent/AgentCommissionCalculator';
import { AgentCrmSyncLogTab } from '@/components/agent/AgentCrmSyncLogTab';

interface AgentLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyTitle: string;
  budget: string;
  status: 'NEW' | 'IN_PROGRESS' | 'FOLLOW_UP' | 'SITE_VISIT' | 'CLOSED' | 'LOST';
  notes: string;
  assignedDate: string;
  lastFollowUp: string;
}

interface ClosedCommissionDeal {
  id: string;
  dealId: string;
  buyerName: string;
  propertyTitle: string;
  dealValue: string;
  commissionRate: string;
  earnedCommission: string;
  payoutStatus: 'PAID' | 'APPROVED_PENDING_UTR' | 'UNDER_VERIFICATION';
  closedDate: string;
}

const INITIAL_AGENT_LEADS: AgentLead[] = [
  {
    id: 'ld-1',
    name: 'Dr. Siddharth Deshmukh',
    phone: '+91 98200 87654',
    email: 'siddharth.deshmukh@gmail.com',
    propertyTitle: 'Lodha Crown Tower B - 3 BHK Sea View',
    budget: '₹2.45 Cr',
    status: 'IN_PROGRESS',
    notes: 'Interested in floor 18+. Cheque ready for token. Requires legal review.',
    assignedDate: '2026-10-14',
    lastFollowUp: 'Yesterday, 4:00 PM',
  },
  {
    id: 'ld-2',
    name: 'Meera Iyer',
    phone: '+91 98199 22331',
    email: 'meera.iyer@corporate.in',
    propertyTitle: 'Godrej Horizon Bandra - 2 BHK Premium',
    budget: '₹1.80 Cr',
    status: 'SITE_VISIT',
    notes: 'VIP doorstep cab scheduled for Saturday 11:30 AM.',
    assignedDate: '2026-10-12',
    lastFollowUp: 'Today, 10:15 AM',
  },
  {
    id: 'ld-3',
    name: 'Karan Mehra',
    phone: '+91 97650 99887',
    email: 'karan.m@startuphub.co',
    propertyTitle: 'Shapoorji Pallonji Joyville - 2 BHK Smart',
    budget: '₹95 Lakh',
    status: 'CLOSED',
    notes: 'Booking token cleared! Deed registered on Oct 08.',
    assignedDate: '2026-09-28',
    lastFollowUp: '2026-10-08',
  },
  {
    id: 'ld-4',
    name: 'Amitabh & Sunita Singhal',
    phone: '+91 98330 45671',
    email: 'singhal.amitabh@yahoo.co.in',
    propertyTitle: 'Oberoi Sky City Borivali - 4 BHK Duplex',
    budget: '₹4.20 Cr',
    status: 'FOLLOW_UP',
    notes: 'Evaluating bank loan interest rates with HDFC desk.',
    assignedDate: '2026-10-10',
    lastFollowUp: '2 days ago',
  },
  {
    id: 'ld-5',
    name: 'Rohit Kulkarni',
    phone: '+91 98450 11229',
    email: 'rohit.kulkarni@tech.org',
    propertyTitle: 'Dosti Eastern Bay - 2 BHK High Rise',
    budget: '₹1.65 Cr',
    status: 'NEW',
    notes: 'Direct website inquiry via WhatsApp link. Needs pricing plan.',
    assignedDate: 'Today, 08:30 AM',
    lastFollowUp: 'Pending first call',
  },
];

const INITIAL_COMMISSIONS: ClosedCommissionDeal[] = [
  {
    id: 'com-1',
    dealId: 'DEAL-2026-0912',
    buyerName: 'Karan Mehra',
    propertyTitle: 'Shapoorji Pallonji Joyville Unit 1204',
    dealValue: '₹95,00,000',
    commissionRate: '2.2%',
    earnedCommission: '₹2,09,000',
    payoutStatus: 'PAID',
    closedDate: '2026-10-08',
  },
  {
    id: 'com-2',
    dealId: 'DEAL-2026-0884',
    buyerName: 'Vikramaditya Rao',
    propertyTitle: 'Godrej City Panvel - Villa Plot 45',
    dealValue: '₹90,00,000',
    commissionRate: '2.2%',
    earnedCommission: '₹1,98,000',
    payoutStatus: 'PAID',
    closedDate: '2026-09-24',
  },
  {
    id: 'com-3',
    dealId: 'DEAL-2026-1049',
    buyerName: 'Dr. Siddharth Deshmukh (Advance Token)',
    propertyTitle: 'Lodha Crown Tower B - Unit 1802',
    dealValue: '₹2,45,00,000',
    commissionRate: '2.2%',
    earnedCommission: '₹5,39,000',
    payoutStatus: 'APPROVED_PENDING_UTR',
    closedDate: 'Accruing Oct 15',
  },
];

export default function AgentDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'leads' | 'targets' | 'commissions' | 'calculator' | 'crm_sync' | 'add_lead'>('leads');
  const [leads, setLeads] = useState<AgentLead[]>(INITIAL_AGENT_LEADS);
  const [commissions, setCommissions] = useState<ClosedCommissionDeal[]>(INITIAL_COMMISSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [currentUser, setCurrentUser] = useState<{ secureId: string; name: string; username?: string } | null>(null);

  React.useEffect(() => {
    try {
      const match = document.cookie.match(/prosify_agent_session=([^;]+)/);
      if (match && match[1]) {
        const decoded = JSON.parse(atob(decodeURIComponent(match[1])));
        if (decoded) {
          setCurrentUser(decoded);
        }
      }
    } catch {}
  }, []);

  // Offline Lead Capture Form State
  const [offlineForm, setOfflineForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Mumbai',
    propertyTitle: '',
    budget: '₹1 Cr - ₹2 Cr',
    notes: '',
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [offlineSuccessMessage, setOfflineSuccessMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/agent/logout', { method: 'POST' });
      router.push('/agent/login');
      router.refresh();
    } catch {
      router.push('/agent/login');
    }
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: AgentLead['status']) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, status: newStatus, lastFollowUp: 'Updated just now' }
          : l
      )
    );
  };

  const handleOfflineLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);
    setOfflineSuccessMessage(null);

    try {
      // Connects directly to our centralized CRM lead capture endpoint
      const res = await fetch('/api/crm/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: offlineForm.name,
          phone: offlineForm.phone,
          email: offlineForm.email,
          city: offlineForm.city,
          propertyTitle: offlineForm.propertyTitle,
          budget: offlineForm.budget,
          message: `Direct Offline Customer Walk-in logged by Agent Suresh Patil (AGT-4310): ${offlineForm.notes}`,
          leadTag: 'Agent_Offline_Walkin',
          affiliateId: 'AGT-4310',
          inquiryType: 'Offline Walk-in / Direct Visit',
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Add to active agent leads
        const newLead: AgentLead = {
          id: `ld-${Date.now()}`,
          name: offlineForm.name,
          phone: offlineForm.phone,
          email: offlineForm.email,
          propertyTitle: offlineForm.propertyTitle || 'General Inbound',
          budget: offlineForm.budget,
          status: 'NEW',
          notes: offlineForm.notes || 'Offline walk-in registered.',
          assignedDate: 'Just now',
          lastFollowUp: 'Pending first call',
        };

        setLeads([newLead, ...leads]);
        setOfflineSuccessMessage(
          `✓ Lead "${offlineForm.name}" registered and automatically synchronized to external CRM webhook with Agent ID AGT-4310!`
        );
        setOfflineForm({
          name: '',
          phone: '',
          email: '',
          city: 'Mumbai',
          propertyTitle: '',
          budget: '₹1 Cr - ₹2 Cr',
          notes: '',
        });
      }
    } catch (err) {
      console.error('Error submitting offline lead', err);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const filteredLeads = leads.filter((l) => {
    if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      l.propertyTitle.toLowerCase().includes(q)
    );
  });

  // Calculate KPIs
  const monthlyTarget = 25000000; // 2.5 Cr
  const achievedVolume = 18500000; // 1.85 Cr
  const progressPercent = Math.round((achievedVolume / monthlyTarget) * 100);

  return (
    <div className="min-h-screen bg-[#0C1210] text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-neutral-950">
      {/* Top Navbar */}
      <header className="px-6 py-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <ProsifyAnimatedLogo size="sm" />
          <span className="hidden sm:inline-block h-4 w-px bg-neutral-700" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {currentUser?.secureId || 'AGT-PARTNER'}
            </span>
            <span className="text-xs text-neutral-300 font-semibold hidden md:inline">
              {currentUser?.name || 'Senior Certified Channel Partner'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            Gold Tier Partner
          </span>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-medium border border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Target Progress */}
          <div className="bg-neutral-900/90 p-5 rounded-2xl border border-neutral-800 shadow-md">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Monthly Target</span>
              <span className="font-bold text-emerald-400">{progressPercent}%</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              ₹1.85 Cr <span className="text-xs text-neutral-500 font-normal">/ ₹2.5 Cr</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-neutral-900/90 p-5 rounded-2xl border border-neutral-800 shadow-md">
            <div className="text-xs text-neutral-400">Total Commission Earned</div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1">₹4,07,000</div>
            <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Direct UTR settlement
            </div>
          </div>

          <div className="bg-neutral-900/90 p-5 rounded-2xl border border-neutral-800 shadow-md">
            <div className="text-xs text-neutral-400">Active Assigned Leads</div>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">{leads.length}</div>
            <div className="text-[11px] text-amber-400 mt-1">
              {leads.filter((l) => l.status === 'SITE_VISIT').length} site visits scheduled
            </div>
          </div>

          <div className="bg-neutral-900/90 p-5 rounded-2xl border border-neutral-800 shadow-md">
            <div className="text-xs text-neutral-400">Pending Clearance</div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-300 mt-1">₹5,39,000</div>
            <div className="text-[11px] text-neutral-400 mt-1">Lodha Crown Unit 1802 deal</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto">
          {[
            { id: 'leads', label: 'Assigned Leads Directory', icon: Users },
            { id: 'calculator', label: 'Commission Calculator', icon: Calculator },
            { id: 'crm_sync', label: 'CRM Sync & Webhooks', icon: Activity },
            { id: 'targets', label: 'Target vs. Achievement', icon: Target },
            { id: 'commissions', label: 'Commission Ledger', icon: DollarSign },
            { id: 'add_lead', label: '+ Add Offline Walk-in Lead', icon: UserPlus },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ASSIGNED LEADS DIRECTORY */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {(['ALL', 'NEW', 'IN_PROGRESS', 'SITE_VISIT', 'FOLLOW_UP', 'CLOSED'] as const).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        statusFilter === st
                          ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/40'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {st === 'ALL' ? 'All Leads' : st.replace('_', ' ')}
                    </button>
                  )
                )}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search buyer, phone, project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-950/60 border-b border-neutral-800 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Buyer &amp; Contact</th>
                      <th className="py-3 px-4">Target Property</th>
                      <th className="py-3 px-4">Budget</th>
                      <th className="py-3 px-4">Stage / Status</th>
                      <th className="py-3 px-4">Latest Notes</th>
                      <th className="py-3 px-4 text-right">Quick Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-xs">{lead.name}</div>
                          <div className="text-emerald-400 font-mono text-[11px] mt-0.5">{lead.phone}</div>
                          <div className="text-neutral-500 text-[10px]">{lead.email}</div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-neutral-200 max-w-xs">
                          {lead.propertyTitle}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-300">{lead.budget}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              lead.status === 'CLOSED'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : lead.status === 'SITE_VISIT'
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : lead.status === 'IN_PROGRESS'
                                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {lead.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-400 text-[11px] max-w-xs truncate">
                          {lead.notes}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                            className="bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-lg text-[11px] px-2 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            <option value="NEW">New</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="SITE_VISIT">Site Visit Scheduled</option>
                            <option value="FOLLOW_UP">Follow-up</option>
                            <option value="CLOSED">Closed (Won)</option>
                            <option value="LOST">Lost</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TARGET VS ACHIEVEMENT */}
        {activeTab === 'targets' && (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-white">Monthly &amp; Quarterly Sales Targets</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Target performance automatically calculates commission tier bonus eligibility.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <span className="text-xs text-neutral-400 font-semibold block">October 2026 Target</span>
                  <div className="text-2xl font-bold text-white">₹2,50,00,000 (2.5 Cr)</div>
                  <div className="text-xs text-neutral-500">Benchmark across Bandra-Khar Corridor</div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <span className="text-xs text-emerald-400 font-semibold block">Closed Volume So Far</span>
                  <div className="text-2xl font-bold text-emerald-400">₹1,85,00,000 (1.85 Cr)</div>
                  <div className="text-xs text-neutral-400">Across 4 verified developer registrations</div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <span className="text-xs text-amber-400 font-semibold block">Pipeline Under Negotiation</span>
                  <div className="text-2xl font-bold text-amber-300">₹4,25,00,000 (4.25 Cr)</div>
                  <div className="text-xs text-neutral-400">High probability closure by month end</div>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="mt-8 p-6 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                  <span>Quota Achievement Velocity</span>
                  <span className="text-emerald-400">74% Target Reached</span>
                </div>
                <div className="w-full bg-neutral-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-linear-to-r from-emerald-500 to-teal-400 h-full rounded-full w-3/4" />
                </div>
                <div className="flex justify-between text-[11px] text-neutral-500 mt-2 font-mono">
                  <span>₹0 Cr</span>
                  <span>₹1.25 Cr (50%)</span>
                  <span>₹2.5 Cr (100% Target)</span>
                  <span>₹3.0 Cr (Super Achiever)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMMISSION LEDGER */}
        {activeTab === 'commissions' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Closed Deals &amp; Commission Ledger</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Calculated transparently based on builder registered deed value and partner tier rate.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400 block">Total Payouts Received</span>
                <span className="text-xl font-bold text-emerald-400">₹4,07,000</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-950/60 border-b border-neutral-800 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Deal Reference</th>
                    <th className="py-3 px-4">Buyer Name</th>
                    <th className="py-3 px-4">Property / Unit</th>
                    <th className="py-3 px-4">Agreement Value</th>
                    <th className="py-3 px-4">Rate (%)</th>
                    <th className="py-3 px-4">Earned Commission</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {commissions.map((deal) => (
                    <tr key={deal.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">{deal.dealId}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">{deal.buyerName}</td>
                      <td className="py-3.5 px-4 text-neutral-300">{deal.propertyTitle}</td>
                      <td className="py-3.5 px-4 font-mono text-white">{deal.dealValue}</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">{deal.commissionRate}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-300 text-sm">
                        {deal.earnedCommission}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            deal.payoutStatus === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {deal.payoutStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: QUICK ACTION: ADD DIRECT OFFLINE LEAD */}
        {activeTab === 'add_lead' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
                <UserPlus className="w-3.5 h-3.5" />
                Offline Walk-in / Field Lead Capture
              </div>
              <h3 className="text-xl font-bold text-white">Log Customer Walk-in / Direct Referral</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Instantly captures client interest, locks partner attribution to your Agent ID (AGT-4310), and dispatches lead metadata to our central CRM pipeline.
              </p>
            </div>

            {offlineSuccessMessage && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{offlineSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleOfflineLeadSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1.5">
                    Customer Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={offlineForm.name}
                    onChange={(e) => setOfflineForm({ ...offlineForm, name: e.target.value })}
                    placeholder="e.g. Vikram Malhotra"
                    disabled={isSubmittingLead}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={offlineForm.phone}
                    onChange={(e) => setOfflineForm({ ...offlineForm, phone: e.target.value })}
                    placeholder="98200 12345"
                    disabled={isSubmittingLead}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={offlineForm.email}
                    onChange={(e) => setOfflineForm({ ...offlineForm, email: e.target.value })}
                    placeholder="vikram@example.com"
                    disabled={isSubmittingLead}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1.5">Budget Range</label>
                  <select
                    value={offlineForm.budget}
                    onChange={(e) => setOfflineForm({ ...offlineForm, budget: e.target.value })}
                    disabled={isSubmittingLead}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="₹50 Lakh - ₹1 Cr">₹50 Lakh - ₹1 Cr</option>
                    <option value="₹1 Cr - ₹2 Cr">₹1 Cr - ₹2 Cr</option>
                    <option value="₹2 Cr - ₹5 Cr">₹2 Cr - ₹5 Cr</option>
                    <option value="₹5 Cr+ (Luxury / Penthouse)">₹5 Cr+ (Luxury / Penthouse)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5">
                  Interested Property or Project
                </label>
                <input
                  type="text"
                  value={offlineForm.propertyTitle}
                  onChange={(e) => setOfflineForm({ ...offlineForm, propertyTitle: e.target.value })}
                  placeholder="e.g. Lodha Crown Tower A or Godrej Horizon"
                  disabled={isSubmittingLead}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5">Walk-in Discussion Notes</label>
                <textarea
                  rows={3}
                  value={offlineForm.notes}
                  onChange={(e) => setOfflineForm({ ...offlineForm, notes: e.target.value })}
                  placeholder="e.g. Client visited site office today. Seeking 3 BHK on high floor with 2 car parks."
                  disabled={isSubmittingLead}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingLead}
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmittingLead ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                    <span>Synchronizing Lead to CRM...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Register Lead &amp; Lock Partner Commission</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: COMMISSION CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="space-y-4">
            <AgentCommissionCalculator initialPropertyPrice={18500000} currentAgentTier="gold" />
          </div>
        )}

        {/* TAB 6: CRM SYNC & WEBHOOK TELEMETRY */}
        {activeTab === 'crm_sync' && (
          <div className="space-y-4">
            <AgentCrmSyncLogTab />
          </div>
        )}
      </main>
    </div>
  );
}
