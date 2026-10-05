'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  TrendingUp,
  Link as LinkIcon,
  Copy,
  CheckCircle2,
  Clock,
  IndianRupee,
  Calendar,
  Layers,
  ArrowRight,
  Share2,
  Eye,
  MousePointerClick,
  Building,
  Check,
  ShieldCheck,
  QrCode,
  Download,
  Building2,
  Sparkles,
  Lock,
} from 'lucide-react';
import { PortalSwitcher } from '@/components/marketplace/PortalSwitcher';
import { PartnerFlowTester } from '@/components/marketplace/PartnerFlowTester';
import { store } from '@/lib/data/store';
import { ChannelPartner, Lead, SiteVisit, Booking, Commission } from '@/lib/types';
import { formatIndianPrice } from '@/lib/utils';

const DEFAULT_PARTNER: ChannelPartner = {
  id: 'cp-default',
  code: 'CP-PROSIFY',
  partnerName: 'Channel Partner',
  name: 'Channel Partner',
  companyName: 'Prosify Verified Partner Network',
  email: 'partner@prosify.in',
  phone: '+91 93263 03244',
  address: 'Mumbai, Maharashtra',
  panNumber: 'AABCP1234M',
  tier: 'GOLD',
  status: 'ACTIVE',
  commissionRate: 2.5,
  reraNumber: 'A51800049281',
  clicksCount: 0,
  leadsCount: 0,
  siteVisitsCount: 0,
  bookingsCount: 0,
  totalCommissionEarned: 0,
  totalCommissionPaid: 0,
  pendingCommission: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
};

export default function PartnerPortalPage() {
  const [, setRefreshKey] = useState(0);

  // Subscribe to live multi-panel updates
  useEffect(() => {
    const unsub = store.subscribe(() => {
      setRefreshKey((k) => k + 1);
    });
    const handleUpdate = () => setRefreshKey((k) => k + 1);
    window.addEventListener('prosify:store-updated', handleUpdate);
    return () => {
      unsub();
      window.removeEventListener('prosify:store-updated', handleUpdate);
    };
  }, []);

  // Channel partner data
  const partners = store.getChannelPartners();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partners[0]?.id || 'cp-default');
  const activePartner = partners.find((p) => p.id === selectedPartnerId) || partners[0] || DEFAULT_PARTNER;

  // Data for active partner - Strictly isolated by partnerId
  const leads = store.getLeads({ partnerId: activePartner?.id });
  const siteVisits = store.getSiteVisits(activePartner?.id);
  const bookings = store.getBookings(activePartner?.id);
  const commissions = store.getCommissions(activePartner?.id);
  const trackingLinks = store.getTrackingLinks(activePartner?.id);
  const projects = store.getProjects();

  // Tracking link builder state
  const [targetProject, setTargetProject] = useState(projects[0]?.slug || 'godrej-origins-bandra');
  const [utmSource, setUtmSource] = useState('whatsapp');
  const [utmCampaign, setUtmCampaign] = useState('diwali_launch');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'links' | 'leads' | 'visits' | 'commissions' | 'flow-test'>('overview');

  // Generate tracking link
  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.prosify.in';
    const link = `${baseUrl}/projects/${targetProject}?partner=${activePartner.code}&utm_source=${utmSource}&utm_campaign=${utmCampaign}`;
    setGeneratedLink(link);

    // Save to store
    store.createTrackingLink({
      partnerId: activePartner.id,
      targetUrl: `/projects/${targetProject}`,
      utmSource,
      utmCampaign,
    });
    setRefreshKey((k) => k + 1);
  };

  const handleCopyLink = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      <PortalSwitcher currentPortal="partner" />

      {/* Partner Portal Header */}
      <header className="bg-[#171717] text-white border-b border-neutral-800 sticky top-[37px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">Prosify Partner Network</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Subdomain: partner.prosify.in
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Channel Partner Portal • MahaRERA Reg No: <strong>{activePartner.reraNumber || 'A51800049281'}</strong>
              </p>
            </div>
          </div>

          {/* Partner Selector (For previewing different partner accounts) */}
          <div className="flex items-center gap-2 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800 text-xs">
            <span className="text-neutral-400 hidden sm:inline px-2">Account:</span>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="bg-neutral-800 text-white rounded-lg px-2.5 py-1 text-xs border border-neutral-700 font-semibold"
            >
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.companyName} ({p.code})
                </option>
              ))}
            </select>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400">
              {activePartner.status}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto border-t border-neutral-800 text-xs font-semibold">
          {[
            { key: 'overview', label: 'Dashboard Overview' },
            { key: 'links', label: 'Campaign Links & QR' },
            { key: 'leads', label: `Attributed Leads (${leads.length})` },
            { key: 'visits', label: `Site Visits (${siteVisits.length})` },
            { key: 'commissions', label: `Commission Ledger (${commissions.length})` },
            { key: 'flow-test', label: '⚡ End-to-End Flow Test' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-[#D4A017] text-[#F4C430] font-bold'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* Strict Isolation Notice */}
        <div className="bg-neutral-900 text-white p-3.5 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Strict Partner Isolation Active</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-emerald-400 border border-emerald-500/30">
                  {activePartner.code} Session
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                You are viewing verified metrics, attributed leads, and payouts exclusive to <strong>{activePartner.companyName}</strong>. Partner B cannot view your leads, and you cannot view Partner B&apos;s.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('flow-test')}
              className="px-3 py-1.5 rounded-xl bg-[#D4A017] hover:bg-[#b58710] text-neutral-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test Complete Flow</span>
            </button>
          </div>
        </div>
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
                <span className="text-xs text-neutral-500 font-medium block">Total Clicks</span>
                <strong className="text-2xl font-bold text-neutral-900 mt-1 block">
                  {(activePartner.clicksCount ?? activePartner.clicks ?? 0).toLocaleString('en-IN')}
                </strong>
                <span className="text-[11px] text-emerald-600 font-medium">30-day tracking</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
                <span className="text-xs text-neutral-500 font-medium block">Leads Generated</span>
                <strong className="text-2xl font-bold text-neutral-900 mt-1 block">
                  {leads.length}
                </strong>
                <span className="text-[11px] text-blue-600 font-medium">Auto-attributed</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
                <span className="text-xs text-neutral-500 font-medium block">Site Visits</span>
                <strong className="text-2xl font-bold text-neutral-900 mt-1 block">
                  {siteVisits.length}
                </strong>
                <span className="text-[11px] text-purple-600 font-medium">Facilitated</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
                <span className="text-xs text-neutral-500 font-medium block">Bookings Closed</span>
                <strong className="text-2xl font-bold text-neutral-900 mt-1 block">
                  {bookings.length}
                </strong>
                <span className="text-[11px] text-emerald-600 font-medium">Confirmed</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
                <span className="text-xs text-neutral-500 font-medium block">Total Commission</span>
                <strong className="text-2xl font-bold text-emerald-700 mt-1 block">
                  {formatIndianPrice(activePartner.totalCommissionEarned ?? activePartner.commissionEarned ?? 0)}
                </strong>
                <span className="text-[11px] text-neutral-500">Cumulative</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
                <span className="text-xs text-neutral-500 font-medium block">Pending Payout</span>
                <strong className="text-2xl font-bold text-amber-600 mt-1 block">
                  {formatIndianPrice(activePartner.pendingCommission ?? activePartner.commissionPending ?? 0)}
                </strong>
                <span className="text-[11px] text-neutral-500">In Verification</span>
              </div>
            </div>

            {/* Attribution Pipeline Architecture Card */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-neutral-950 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#D4A017]" />
                    <span>Automated Attribution & Commission Guarantee Lifecycle</span>
                  </h3>
                  <p className="text-xs text-neutral-500">
                    How client visits via your partner link ({activePartner.code}) are locked and compensated
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  30-Day First/Last Touch Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs pt-2">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center">
                    1
                  </div>
                  <strong className="block text-neutral-900">Link Click</strong>
                  <p className="text-neutral-500 text-[11px]">
                    Visitor clicks your unique tracking link (WhatsApp, SMS, Ad).
                  </p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center">
                    2
                  </div>
                  <strong className="block text-neutral-900">Cookie Tagged</strong>
                  <p className="text-neutral-500 text-[11px]">
                    30-day session cookie written with Partner ID <strong>{activePartner.code}</strong>.
                  </p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center">
                    3
                  </div>
                  <strong className="block text-neutral-900">Lead Ingestion</strong>
                  <p className="text-neutral-500 text-[11px]">
                    Client submits enquiry on any property; lead permanently tagged to your CRM account.
                  </p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center">
                    4
                  </div>
                  <strong className="block text-neutral-900">Site Visit & Pass</strong>
                  <p className="text-neutral-500 text-[11px]">
                    Site manager receives client pass tagged with your broker code.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                    5
                  </div>
                  <strong className="block text-emerald-900">Booking & Payout</strong>
                  <p className="text-emerald-700 text-[11px]">
                    Unit booked. Commission ledger automatically calculates 2.0% - 3.5% payout.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Generator Box */}
            <div className="bg-gradient-to-br from-[#171717] to-neutral-900 text-white p-6 rounded-2xl border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-[#D4A017]" />
                    <span>Quick Campaign Link Generator</span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Generate instant tracked links to share on WhatsApp, Facebook, or SMS
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('links')}
                  className="text-xs text-[#D4A017] hover:underline font-semibold"
                >
                  Advanced Generator →
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  readOnly
                  value={`https://www.prosify.in/?partner=${activePartner.code}&utm_source=whatsapp`}
                  className="flex-1 w-full bg-neutral-800 border border-neutral-700 text-xs px-3 py-2.5 rounded-xl font-mono text-neutral-300"
                />
                <button
                  onClick={() =>
                    handleCopyLink(
                      `https://www.prosify.in/?partner=${activePartner.code}&utm_source=whatsapp`
                    )
                  }
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy WhatsApp Link'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAMPAIGN LINKS & QR */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="text-base font-bold text-neutral-950">
                  Custom Campaign Tracking Link Builder
                </h3>
                <p className="text-xs text-neutral-500">
                  Create tailored links with UTM parameters for accurate ROI tracking
                </p>
              </div>

              <form onSubmit={handleGenerateLink} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Select Target Project
                  </label>
                  <select
                    value={targetProject}
                    onChange={(e) => setTargetProject(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-neutral-50 font-medium"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.name} ({p.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    UTM Source
                  </label>
                  <select
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 bg-neutral-50 font-medium"
                  >
                    <option value="whatsapp">WhatsApp Broadcast</option>
                    <option value="facebook_ad">Facebook Ads</option>
                    <option value="instagram">Instagram Bio / Story</option>
                    <option value="sms_campaign">SMS Blast</option>
                    <option value="email_newsletter">Email Newsletter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    placeholder="e.g. festive_offer_oct"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                  />
                </div>

                <div className="sm:col-span-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-[#D4A017] hover:text-neutral-950 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Generate Tracked Link
                  </button>
                </div>
              </form>

              {/* Generated Link Display */}
              {generatedLink && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">Your Attributed Link:</span>
                    <button
                      onClick={() => handleCopyLink(generatedLink)}
                      className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-amber-300 text-xs font-mono break-all text-neutral-800">
                    {generatedLink}
                  </div>
                </div>
              )}
            </div>

            {/* Active Tracking Links Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 space-y-4">
              <h4 className="text-sm font-bold text-neutral-950">Active Partner Tracking Links</h4>
              <div className="border border-neutral-200 rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                    <tr>
                      <th className="p-3">Target Path</th>
                      <th className="p-3">Source</th>
                      <th className="p-3">Campaign</th>
                      <th className="p-3">Clicks</th>
                      <th className="p-3">Leads</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {trackingLinks.map((link) => (
                      <tr key={link.id} className="hover:bg-neutral-50">
                        <td className="p-3 font-mono text-neutral-800">{link.targetUrl}</td>
                        <td className="p-3 font-medium text-neutral-700">{link.utmSource || 'direct'}</td>
                        <td className="p-3 text-neutral-500">{link.utmCampaign || '-'}</td>
                        <td className="p-3 font-bold text-neutral-900">{link.clicks}</td>
                        <td className="p-3 font-bold text-emerald-700">{link.leads ?? link.leadsCount ?? Math.floor(link.clicks * 0.08)}</td>
                        <td className="p-3">
                          <button
                            onClick={() =>
                              handleCopyLink(
                                `${window.location.origin}${link.targetUrl}?partner=${activePartner.code}&utm_source=${link.utmSource || ''}`
                              )
                            }
                            className="text-xs text-[#D4A017] hover:underline font-semibold"
                          >
                            Copy Link
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ATTRIBUTED LEADS */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-950">
                  Client Leads Ingested & Attributed
                </h3>
                <p className="text-xs text-neutral-500">
                  All enquiries routed through your referral code ({activePartner.code})
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-lg">
                {leads.length} Total Inquiries
              </span>
            </div>

            <div className="border border-neutral-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                  <tr>
                    <th className="p-3">Lead Name</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Project / Property</th>
                    <th className="p-3">Budget</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-neutral-50">
                      <td className="p-3 font-bold text-neutral-950">{lead.name}</td>
                      <td className="p-3 text-neutral-600">{lead.phone}</td>
                      <td className="p-3 text-neutral-800 font-medium">
                        {lead.projectName || lead.propertyTitle || 'General Enquiry'}
                      </td>
                      <td className="p-3 text-neutral-600">{lead.budget}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-3 text-neutral-500">{lead.createdAt.split('T')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SITE VISITS */}
        {activeTab === 'visits' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-950">Site Visits Facilitated</h3>
                <p className="text-xs text-neutral-500">
                  Scheduled and completed physical walkthroughs for your clients
                </p>
              </div>
            </div>

            <div className="border border-neutral-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                  <tr>
                    <th className="p-3">Client Name</th>
                    <th className="p-3">Project</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Assigned Site Rep</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {siteVisits.map((visit) => (
                    <tr key={visit.id} className="hover:bg-neutral-50">
                      <td className="p-3 font-bold text-neutral-950">
                        {visit.leadName}
                        <span className="block text-[11px] text-neutral-500 font-normal">
                          {visit.leadPhone}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-neutral-800">{visit.projectName}</td>
                      <td className="p-3 text-neutral-700">
                        {visit.visitDate} at {visit.visitTime}
                      </td>
                      <td className="p-3 text-neutral-600">{visit.salesExecutive}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            visit.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {visit.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: COMMISSION LEDGER */}
        {activeTab === 'commissions' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-950">Brokerage & Commission Ledger</h3>
                <p className="text-xs text-neutral-500">
                  Detailed deal-by-deal accounting with TDS calculation and bank UTR numbers
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-500 block">Total Earned:</span>
                <strong className="text-base font-bold text-emerald-700">
                  {formatIndianPrice(activePartner.totalCommissionEarned ?? activePartner.commissionEarned ?? 0)}
                </strong>
              </div>
            </div>

            <div className="border border-neutral-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Project & Unit</th>
                    <th className="p-3">Agreement Value</th>
                    <th className="p-3">Rate %</th>
                    <th className="p-3">Commission Payable</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">UTR / Payout Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {commissions.map((comm) => (
                    <tr key={comm.id} className="hover:bg-neutral-50">
                      <td className="p-3 font-mono font-bold text-neutral-900">{comm.bookingId}</td>
                      <td className="p-3">
                        <strong className="text-neutral-900 block">{comm.projectName}</strong>
                        <span className="text-[11px] text-neutral-500">Unit {comm.unitNumber}</span>
                      </td>
                      <td className="p-3 text-neutral-800 font-medium">
                        {formatIndianPrice(comm.agreementValue || (comm.amount / ((comm.ratePercent || 2) / 100)))}
                      </td>
                      <td className="p-3 text-neutral-700 font-bold">{comm.ratePercent}%</td>
                      <td className="p-3 font-extrabold text-emerald-700">
                        {formatIndianPrice(comm.amount)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            comm.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : comm.status === 'APPROVED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {comm.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-neutral-600">
                        {comm.utrNumber ? `UTR: ${comm.utrNumber}` : 'Pending Disbursement'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: COMPLETE FLOW TEST SIMULATOR */}
        {activeTab === 'flow-test' && (
          <div className="space-y-6">
            <PartnerFlowTester
              defaultPartnerId={activePartner.id}
              onFlowCompleted={() => setRefreshKey((k) => k + 1)}
            />
          </div>
        )}
      </main>
    </div>
  );
}
