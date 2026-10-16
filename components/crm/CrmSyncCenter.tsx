'use client';

import React, { useState, useEffect } from 'react';
import {
  Webhook,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Send,
  Zap,
  Copy,
  Check,
  Search,
  Filter,
  ShieldCheck,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Database,
  Terminal,
} from 'lucide-react';

interface LeadRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  requirement?: string;
  propertyTitle?: string;
  source?: string;
  utmSource?: string;
  crmSyncStatus: 'SYNCED' | 'FAILED' | 'PENDING';
  crmLastSyncedAt?: string;
  realaticLeadId?: string;
  createdAt: string;
}

interface CrmStats {
  totalLeads: number;
  syncedCount: number;
  pendingCount: number;
  failedCount: number;
}

export function CrmSyncCenter() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [stats, setStats] = useState<CrmStats>({ totalLeads: 0, syncedCount: 0, pendingCount: 0, failedCount: 0 });
  const [provider, setProvider] = useState<string>('webhook');
  const [isEndpointConfigured, setIsEndpointConfigured] = useState(false);
  const [endpointMasked, setEndpointMasked] = useState('');
  const [testEndpoint, setTestEndpoint] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'SYNCED' | 'FAILED' | 'PENDING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchCrmData = async () => {
    setIsLoading(true);
    try {
      const [leadsRes, configRes] = await Promise.all([
        fetch(`/api/crm/leads${activeTab !== 'ALL' ? `?status=${activeTab}` : ''}`),
        fetch('/api/crm/lead-capture'),
      ]);

      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data.leads || []);
      }

      if (configRes.ok) {
        const cfg = await configRes.json();
        setProvider(cfg.provider || 'webhook');
        setIsEndpointConfigured(cfg.isEndpointConfigured);
        setEndpointMasked(cfg.apiEndpointMasked || '');
        if (cfg.stats) setStats(cfg.stats);
      }
    } catch (err) {
      console.error('Failed to load CRM sync data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCrmData();
  }, [activeTab]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/crm/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: testEndpoint || undefined }),
      });
      const data = await res.json();
      setTestResult(data);
      fetchCrmData();
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Network test failed' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleRetrySync = async (leadId: string) => {
    setRetryingId(leadId);
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      if (data.success) {
        // Optimistically update status
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, crmSyncStatus: 'SYNCED', crmLastSyncedAt: new Date().toISOString() } : l))
        );
      }
      fetchCrmData();
    } catch (err) {
      console.error('Failed to retry sync', err);
    } finally {
      setRetryingId(null);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredLeads = leads.filter((l) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.requirement && l.requirement.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-linear-to-r from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl p-6 sm:p-8 text-white border border-neutral-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live CRM Dispatcher v1.0
              </span>
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-mono">
                Provider: {provider.toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              CRM Lead Capture & Integration Hub
            </h2>
            <p className="text-sm text-neutral-300 mt-1 max-w-2xl">
              Automated pipelines syncing contact inquiries, high-intent CTA conversions, and affiliate registrations into your external CRM with exponential backoff & fail-safe local fallback.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCrmData}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm font-medium text-neutral-200 border border-neutral-700 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Leads
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-neutral-700/60">
          <div className="bg-neutral-800/60 backdrop-blur-xs p-4 rounded-xl border border-neutral-700/80">
            <div className="text-xs font-medium text-neutral-400">Total Leads Captured</div>
            <div className="text-2xl sm:text-3xl font-bold mt-1 text-white">{stats.totalLeads}</div>
            <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
              <Database className="w-3 h-3 text-neutral-400" />
              Stored in Local Failsafe DB
            </div>
          </div>

          <div className="bg-neutral-800/60 backdrop-blur-xs p-4 rounded-xl border border-emerald-500/30">
            <div className="text-xs font-medium text-emerald-400">Synced to CRM</div>
            <div className="text-2xl sm:text-3xl font-bold mt-1 text-emerald-400">{stats.syncedCount}</div>
            <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Dispatched with 200 OK
            </div>
          </div>

          <div className="bg-neutral-800/60 backdrop-blur-xs p-4 rounded-xl border border-amber-500/30">
            <div className="text-xs font-medium text-amber-400">Pending / Awaiting Config</div>
            <div className="text-2xl sm:text-3xl font-bold mt-1 text-amber-400">{stats.pendingCount}</div>
            <div className="text-[11px] text-amber-400/80 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              Safe in local database
            </div>
          </div>

          <div className="bg-neutral-800/60 backdrop-blur-xs p-4 rounded-xl border border-rose-500/30">
            <div className="text-xs font-medium text-rose-400">Sync Retries / Failed</div>
            <div className="text-2xl sm:text-3xl font-bold mt-1 text-rose-400">{stats.failedCount}</div>
            <div className="text-[11px] text-rose-400/80 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              Retryable with 1-click
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Live Webhook Ping Tester + Setup Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Webhook Handshake & Test Dispatcher */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <Zap className="w-4 h-4 text-amber-500" />
            Live Handshake & Endpoint Verification
          </div>
          <h3 className="text-lg font-bold text-neutral-900">CRM Endpoint Connectivity Test</h3>
          <p className="text-xs text-neutral-500 mt-1">
            Dispatch a synthetic verification lead through our retry engine to verify that your webhook or CRM API receives payloads.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Webhook / REST API Target Endpoint
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder={
                    isEndpointConfigured
                      ? `Using .env endpoint (${endpointMasked})`
                      : 'https://hooks.zapier.com/hooks/catch/... or https://your-crm/api/v1/leads'
                  }
                  value={testEndpoint}
                  onChange={(e) => setTestEndpoint(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                />
                <button
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isTesting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {isTesting ? 'Pinging...' : 'Send Test Lead'}
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Leave empty to test the current endpoint configured in <code className="font-mono text-neutral-600">.env</code>.
              </p>
            </div>

            {testResult && (
              <div
                className={`p-4 rounded-xl text-xs border ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  )}
                  {testResult.message}
                </div>
                {testResult.latencyMs && (
                  <div className="mt-1 text-[11px] text-neutral-600 font-mono">
                    Round-trip latency: {testResult.latencyMs}ms | Attempts: {testResult.attempts}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Step-by-Step Instructions on Where to Paste the Webhook URL */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <HelpCircle className="w-4 h-4 text-[#C5A880]" />
            Step-by-Step Configuration Guide
          </div>
          <h3 className="text-lg font-bold text-neutral-900">Where to Paste Your CRM Webhook URL</h3>
          <p className="text-xs text-neutral-500 mt-1">
            Follow these 3 quick steps to link your CRM:
          </p>

          <ol className="mt-4 space-y-3 text-xs text-neutral-700">
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] font-bold shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong>Get Your Webhook URL:</strong> Create a Webhook trigger in Zapier, Make.com, Zoho CRM (Webhooks under Developer Space), or HubSpot (Workflows).
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] font-bold shrink-0 mt-0.5">
                2
              </span>
              <div className="w-full">
                <strong>Add to your <code className="font-mono bg-neutral-100 px-1 py-0.5 rounded">.env</code> file:</strong>
                <div className="mt-1.5 p-2.5 rounded-lg bg-neutral-900 text-neutral-200 font-mono text-[11px] relative group">
                  <pre className="overflow-x-auto">
{`CRM_PROVIDER="webhook" # or "zoho", "hubspot", "leadsquared"
CRM_API_ENDPOINT="https://hooks.zapier.com/hooks/catch/XXXX/YYYY"
CRM_API_KEY="" # Optional API Key or Bearer Token`}
                  </pre>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'CRM_PROVIDER="webhook"\nCRM_API_ENDPOINT="https://hooks.zapier.com/hooks/catch/XXXX/YYYY"\nCRM_API_KEY=""',
                        'env_block'
                      )
                    }
                    className="absolute top-2 right-2 p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                  >
                    {copiedKey === 'env_block' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 text-white text-[11px] font-bold shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong>Automatic Fail-Safe:</strong> Leads are always saved locally in the database first. If your CRM is down, they are flagged as <code className="text-rose-600 font-semibold">FAILED</code> and can be re-synced with one click below.
              </div>
            </li>
          </ol>
        </div>
      </div>

      {/* Captured Leads Table with CRM Sync Status */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'SYNCED', 'PENDING', 'FAILED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {tab === 'ALL' ? 'All Leads' : tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Lead Name & Contact</th>
                <th className="py-3 px-4">Inquiry / Intent</th>
                <th className="py-3 px-4">Attribution / Source</th>
                <th className="py-3 px-4">Local Status</th>
                <th className="py-3 px-4">CRM Sync Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-neutral-400" />
                    Loading leads database...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-50/60 transition-colors">
                    {/* Name & Contact */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900">{lead.name}</div>
                      <div className="text-neutral-500 font-mono text-[11px]">{lead.phone}</div>
                      {lead.email && <div className="text-neutral-400 text-[11px]">{lead.email}</div>}
                    </td>

                    {/* Inquiry / Intent */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-800 line-clamp-1">
                        {lead.requirement || 'General Inquiry'}
                      </div>
                      {lead.propertyTitle && (
                        <div className="text-[11px] text-amber-700 font-medium line-clamp-1">
                          Property: {lead.propertyTitle}
                        </div>
                      )}
                      <div className="text-[10px] text-neutral-400 mt-0.5">
                        {new Date(lead.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    {/* Attribution / Source */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium text-[11px]">
                        {lead.source || 'WEBSITE'}
                      </span>
                      {lead.utmSource && (
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                          utm: {lead.utmSource}
                        </div>
                      )}
                      {lead.affiliateId && (
                        <div className="text-[10px] text-emerald-700 font-mono mt-0.5 font-semibold">
                          Partner: {lead.affiliateId}
                        </div>
                      )}
                    </td>

                    {/* Local Status */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        Saved in DB
                      </span>
                    </td>

                    {/* CRM Sync Status */}
                    <td className="py-3 px-4">
                      {lead.crmSyncStatus === 'SYNCED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          SYNCED
                        </span>
                      ) : lead.crmSyncStatus === 'FAILED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          FAILED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          PENDING
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleRetrySync(lead.id)}
                        disabled={retryingId === lead.id}
                        title="Retry sync to CRM endpoint"
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1 disabled:opacity-50"
                      >
                        <RefreshCw
                          className={`w-3 h-3 ${retryingId === lead.id ? 'animate-spin' : ''}`}
                        />
                        {retryingId === lead.id ? 'Syncing...' : 'Retry'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
