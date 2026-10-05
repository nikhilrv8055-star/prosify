'use client';

import React, { useState, useEffect } from 'react';
import {
  Webhook,
  KeyRound,
  RefreshCw,
  PlusCircle,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code2,
  Building,
  Radio,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Shield,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Send,
  Download,
  Terminal,
} from 'lucide-react';
import { DeveloperApiConnection, DeveloperProjectSyncItem } from '@/lib/types';
import { store } from '@/lib/data/store';

interface DeveloperApiTabProps {
  onRefresh?: () => void;
}

export function DeveloperApiTab({ onRefresh }: DeveloperApiTabProps) {
  const [connections, setConnections] = useState<DeveloperApiConnection[]>(() =>
    store.getDeveloperApiConnections()
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Connect Modal State
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [sandboxModalOpen, setSandboxModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    developerName: '',
    apiType: 'INBOUND_PUSH' as 'INBOUND_PUSH' | 'OUTBOUND_PULL',
    pullEndpointUrl: '',
    authType: 'BEARER' as 'BEARER' | 'API_KEY' | 'NONE',
    authToken: '',
    syncFrequency: 'REALTIME' as 'REALTIME' | 'HOURLY' | 'DAILY' | 'MANUAL',
    autoApproveNewProjects: true,
  });

  // Sandbox State
  const [sandboxApiKey, setSandboxApiKey] = useState(
    () => store.getDeveloperApiConnections()[0]?.inboundApiKey || ''
  );
  const [sandboxPayload, setSandboxPayload] = useState(
    JSON.stringify(
      [
        {
          name: 'Godrej Horizon Tower C',
          developerName: 'Godrej Properties Ltd',
          city: 'Mumbai',
          locality: 'Wadala Central',
          reraNumber: 'P51900034821',
          priceStartingFrom: '₹1.85 Cr',
          minPrice: 18500000,
          maxPrice: 39000000,
          constructionStatus: 'UNDER_CONSTRUCTION',
          possessionDate: 'June 2028',
          totalUnits: 160,
          availableUnits: 55,
          description: 'Contemporary high-rise residences with panoramic harbor views and sky-deck leisure club.',
          amenities: ['Sky Lounge', 'Infinity Pool', 'Squash Court', 'EV Stations', '24x7 Security'],
          bhkTypes: ['2 BHK', '3 BHK', '4 BHK'],
          towers: ['Tower C'],
        },
      ],
      null,
      2
    )
  );
  const [sandboxResult, setSandboxResult] = useState<any>(null);
  const [sandboxLoading, setSandboxLoading] = useState(false);

  const refreshList = () => {
    setConnections(store.getDeveloperApiConnections());
    if (onRefresh) onRefresh();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Trigger Live Sync
  const handleTriggerSync = async (conn: DeveloperApiConnection) => {
    setSyncingId(conn.id);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/developer-api/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionId: conn.id }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(
          `✅ Sync complete for ${conn.developerName}: ${data.createdCount} new projects registered, ${data.updatedCount} updated!`
        );
        refreshList();
      } else {
        setFeedback(`❌ Sync failed: ${data.error}`);
      }
    } catch {
      setFeedback('❌ Sync request failed. Check server status.');
    } finally {
      setSyncingId(null);
    }
  };

  // Create Connection
  const handleCreateConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.developerName) return;

    try {
      const res = await fetch('/api/admin/developer-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(`✅ Connected ${formData.developerName} API successfully!`);
        setConnectModalOpen(false);
        setFormData({
          developerName: '',
          apiType: 'INBOUND_PUSH',
          pullEndpointUrl: '',
          authType: 'BEARER',
          authToken: '',
          syncFrequency: 'REALTIME',
          autoApproveNewProjects: true,
        });
        refreshList();
      } else {
        setFeedback(`❌ Error: ${data.error}`);
      }
    } catch {
      setFeedback('❌ Failed to create developer connection');
    }
  };

  // Delete Connection
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove the API connection for ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/developer-api?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFeedback(`Removed API connection for ${name}`);
        refreshList();
      }
    } catch {
      setFeedback('Failed to remove connection');
    }
  };

  // Toggle Connection Status
  const handleToggleStatus = async (conn: DeveloperApiConnection) => {
    const newStatus = conn.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      const res = await fetch('/api/admin/developer-api', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: conn.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        refreshList();
      }
    } catch {
      setFeedback('Failed to toggle status');
    }
  };

  // Execute Sandbox Test
  const handleRunSandbox = async () => {
    setSandboxLoading(true);
    setSandboxResult(null);
    try {
      const parsed = JSON.parse(sandboxPayload);
      const res = await fetch('/api/v1/developer/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': sandboxApiKey,
        },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      setSandboxResult(data);
      if (data.success) {
        refreshList();
      }
    } catch (err: any) {
      setSandboxResult({ success: false, error: 'JSON_PARSE_ERROR', message: err.message });
    } finally {
      setSandboxLoading(false);
    }
  };

  const totalSyncedProjects = connections.reduce((sum, c) => sum + (c.totalProjectsSynced || 0), 0);
  const activeCount = connections.filter((c) => c.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Header with Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white tracking-wide">
              BUILDER & DEVELOPER REAL ESTATE API SYNC
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/20 text-emerald-400 border border-emerald-500/30">
              Live Auto-Registration
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Builders and developers connect their ERP, CRM, or cloud feeds here. New projects, RERA filings, and unit inventory automatically register and sync into the marketplace without manual data entry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setDocsModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>API Docs & cURL</span>
          </button>

          <button
            onClick={() => setSandboxModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-bold flex items-center gap-1.5 border border-purple-500/40 transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>API Sandbox</span>
          </button>

          <button
            onClick={() => setConnectModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b8890f] text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-[#D4A017]/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Connect Builder API</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4A017]" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white font-bold ml-2">
            ×
          </button>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#1E293B]/80 border border-slate-700/80">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Connected Builders</span>
          <span className="text-2xl font-black text-white mt-1 block">{connections.length}</span>
          <span className="text-[11px] text-emerald-400 font-semibold">{activeCount} Live & Active</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#1E293B]/80 border border-slate-700/80">
          <span className="text-[11px] font-semibold text-[#0EA5E9] uppercase tracking-wider block">Auto-Synced Projects</span>
          <span className="text-2xl font-black text-white mt-1 block">{totalSyncedProjects}</span>
          <span className="text-[11px] text-slate-400">RERA Direct Ingest</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#1E293B]/80 border border-slate-700/80">
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">Inbound Endpoint</span>
          <span className="text-xs font-mono font-bold text-white mt-1.5 block truncate">/api/v1/developer/sync</span>
          <span className="text-[11px] text-emerald-400">High-Availability REST</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#1E293B]/80 border border-slate-700/80">
          <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">Sync Engine Health</span>
          <span className="text-2xl font-black text-white mt-1 block">{connections.length > 0 ? '100%' : 'Ready'}</span>
          <span className="text-[11px] text-slate-400">Zero Pipeline Lag</span>
        </div>
      </div>

      {/* Connected Builders Table */}
      <div className="rounded-2xl bg-[#1E293B]/90 border border-slate-700 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-900/70 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#10B981] animate-pulse" />
            <h3 className="font-bold text-white text-sm">Active Builder API Pipelines</h3>
          </div>
          <span className="text-xs text-slate-400">
            {connections.length} Developer APIs Configured
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Developer Entity</th>
                <th className="py-3 px-4">Integration Type</th>
                <th className="py-3 px-4">Inbound API Key / Feed</th>
                <th className="py-3 px-4">Sync Cadence</th>
                <th className="py-3 px-4">Synced Projects</th>
                <th className="py-3 px-4">Last Sync Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {connections.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No developer API pipelines configured yet. Click &quot;Connect Builder API&quot; above to integrate an ERP push webhook or scheduled XML/JSON feed.
                  </td>
                </tr>
              ) : (
                connections.map((c) => {
                const isSyncing = syncingId === c.id;
                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Developer Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold shrink-0">
                          <Building className="w-4 h-4 text-[#D4A017]" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{c.developerName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {c.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* API Type */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          c.apiType === 'INBOUND_PUSH'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                        }`}
                      >
                        {c.apiType === 'INBOUND_PUSH' ? 'Inbound Push (Webhook)' : 'Outbound Pull (Feed)'}
                      </span>
                    </td>

                    {/* API Key */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
                          {c.inboundApiKey ? `${c.inboundApiKey.slice(0, 16)}...` : 'N/A'}
                        </code>
                        <button
                          onClick={() => handleCopy(c.inboundApiKey || '', c.id)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy Inbound API Key"
                        >
                          {copiedKey === c.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      {c.pullEndpointUrl && (
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-[200px] mt-0.5">
                          {c.pullEndpointUrl}
                        </div>
                      )}
                    </td>

                    {/* Frequency */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <span className="font-semibold text-white">{c.syncFrequency}</span>
                      {c.autoApproveNewProjects && (
                        <span className="block text-[10px] text-emerald-400">Auto-RERA Verify</span>
                      )}
                    </td>

                    {/* Synced Projects */}
                    <td className="py-3.5 px-4">
                      <span className="font-black text-sm text-[#0EA5E9]">{c.totalProjectsSynced}</span>
                      <span className="text-[11px] text-slate-400 block">projects active</span>
                    </td>

                    {/* Last Sync Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            c.lastSyncStatus === 'SUCCESS'
                              ? 'bg-emerald-400 animate-pulse'
                              : c.lastSyncStatus === 'PARTIAL'
                              ? 'bg-amber-400'
                              : 'bg-slate-500'
                          }`}
                        />
                        <span className="font-bold text-[11px] text-slate-200">
                          {c.lastSyncStatus || 'PENDING'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 max-w-[180px]">
                        {c.lastSyncMessage || 'Ready for sync'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleTriggerSync(c)}
                          disabled={isSyncing}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
                          title="Trigger live sync now"
                        >
                          <RefreshCw className={`w-3 h-3 text-[#D4A017] ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                        </button>

                        <button
                          onClick={() => handleToggleStatus(c)}
                          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title={c.status === 'ACTIVE' ? 'Pause sync' : 'Resume sync'}
                        >
                          {c.status === 'ACTIVE' ? (
                            <ToggleRight className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-slate-500" />
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(c.id, c.developerName)}
                          className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remove API connection"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONNECT BUILDER API MODAL */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-3xl p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
              <div className="flex items-center gap-2">
                <Webhook className="w-4 h-4 text-[#D4A017]" />
                <h3 className="font-bold text-sm">Configure Builder Project Sync API</h3>
              </div>
              <button onClick={() => setConnectModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                ×
              </button>
            </div>

            <form onSubmit={handleCreateConnection} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Builder / Developer Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prestige Estates, DLF, Oberoi Realty"
                  value={formData.developerName}
                  onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#D4A017]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Integration Architecture</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, apiType: 'INBOUND_PUSH' })}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.apiType === 'INBOUND_PUSH'
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                        : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-emerald-400">Inbound Push API</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      We give builder an API key; builder ERP pushes projects to ENI endpoint.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, apiType: 'OUTBOUND_PULL' })}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.apiType === 'OUTBOUND_PULL'
                        ? 'bg-sky-500/10 border-sky-500/50 text-white'
                        : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-sky-400">Outbound Pull Feed</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Builder provides their JSON feed URL; ENI automatically polls on schedule.
                    </div>
                  </button>
                </div>
              </div>

              {formData.apiType === 'OUTBOUND_PULL' && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Builder Project Feed URL (JSON / REST Endpoint) *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://erp.builder.com/api/v1/projects.json"
                      value={formData.pullEndpointUrl}
                      onChange={(e) => setFormData({ ...formData, pullEndpointUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono text-[11px] focus:outline-none focus:border-[#D4A017]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Auth Type</label>
                      <select
                        value={formData.authType}
                        onChange={(e) => setFormData({ ...formData, authType: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                      >
                        <option value="BEARER">Bearer Token</option>
                        <option value="API_KEY">API Key Header</option>
                        <option value="NONE">Public / None</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Sync Cadence</label>
                      <select
                        value={formData.syncFrequency}
                        onChange={(e) => setFormData({ ...formData, syncFrequency: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                      >
                        <option value="REALTIME">Real-Time Webhook</option>
                        <option value="HOURLY">Hourly Polling</option>
                        <option value="DAILY">Daily Batch</option>
                        <option value="MANUAL">Manual Trigger</option>
                      </select>
                    </div>
                  </div>

                  {formData.authType !== 'NONE' && (
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Developer Auth Token / API Secret
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••••••••••"
                        value={formData.authToken}
                        onChange={(e) => setFormData({ ...formData, authToken: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono text-[11px]"
                      />
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <input
                  type="checkbox"
                  id="autoApprove"
                  checked={formData.autoApproveNewProjects}
                  onChange={(e) => setFormData({ ...formData, autoApproveNewProjects: e.target.checked })}
                  className="rounded border-slate-700 text-[#D4A017] focus:ring-[#D4A017]"
                />
                <label htmlFor="autoApprove" className="text-slate-300 text-[11px] cursor-pointer">
                  Auto-certify & publish newly ingested projects (ProVerify™ Verified)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setConnectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b8890f] text-slate-950 font-black cursor-pointer shadow-md"
                >
                  Generate Credentials & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* API DOCS & cURL MODAL */}
      {docsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-[#1E293B] border border-slate-700 rounded-3xl p-6 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#0EA5E9]" />
                <h3 className="font-bold text-base">Developer API Documentation & Integration Guide</h3>
              </div>
              <button onClick={() => setDocsModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-base">
                ×
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Builders can push single or multiple real estate projects directly to our endpoint. New projects are automatically created, RERA numbers matched, and available units updated in real-time.
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                1. Endpoint & Required Headers
              </span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 space-y-1">
                <div>POST /api/v1/developer/sync</div>
                <div className="text-slate-400">Content-Type: application/json</div>
                <div className="text-slate-400">x-api-key: eni_dev_live_YOUR_BUILDER_KEY</div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                2. cURL Example for Builders
              </span>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
{`curl -X POST https://yourdomain.com/api/v1/developer/sync \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: eni_dev_live_godrej_98f24a1b80c3" \\
  -d '[
    {
      "name": "Godrej Park World",
      "developerName": "Godrej Properties Ltd",
      "city": "Pune",
      "locality": "Hinjawadi Phase 1",
      "reraNumber": "P52100054321",
      "priceStartingFrom": "₹65 Lakhs",
      "minPrice": 6500000,
      "maxPrice": 14000000,
      "constructionStatus": "NEW_LAUNCH",
      "possessionDate": "Dec 2028",
      "totalUnits": 300,
      "availableUnits": 120,
      "amenities": ["Clubhouse", "Infinity Pool", "Yoga Deck"],
      "bhkTypes": ["2 BHK", "3 BHK"]
    }
  ]'`}
              </pre>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                3. Expected Response (200 OK)
              </span>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre">
{`{
  "success": true,
  "developer": "Godrej Properties Ltd",
  "createdCount": 1,
  "updatedCount": 0,
  "totalProcessed": 1,
  "syncedProjects": [
    {
      "id": "proj-1727680000",
      "name": "Godrej Park World",
      "slug": "godrej-park-world-pune",
      "marketplaceUrl": "/projects/godrej-park-world-pune"
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* API SANDBOX / INGEST TESTER */}
      {sandboxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-[#1E293B] border border-slate-700 rounded-3xl p-6 text-white shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-base">Developer API Live Simulator & Test Sandbox</h3>
              </div>
              <button onClick={() => setSandboxModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-base">
                ×
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Test how a builder’s API payload registers projects in real-time. Select a builder API key below, review or edit the JSON payload, and click <strong>&quot;Simulate Inbound Push&quot;</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Builder Key</label>
                <select
                  value={sandboxApiKey}
                  onChange={(e) => setSandboxApiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono text-[11px]"
                >
                  {connections.map((c) => (
                    <option key={c.id} value={c.inboundApiKey || ''}>
                      {c.developerName} ({c.inboundApiKey ? c.inboundApiKey.slice(0, 18) : 'N/A'}...)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Endpoint</label>
                <input
                  type="text"
                  readOnly
                  value="POST /api/v1/developer/sync"
                  className="w-full px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold text-xs mb-1">
                JSON Project Payload:
              </label>
              <textarea
                rows={9}
                value={sandboxPayload}
                onChange={(e) => setSandboxPayload(e.target.value)}
                className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setSandboxPayload(
                    JSON.stringify(
                      [
                        {
                          name: `Oberoi Sky City Phase ${Math.floor(2 + Math.random() * 5)}`,
                          developerName: 'Oberoi Realty',
                          city: 'Mumbai',
                          locality: 'Borivali East',
                          reraNumber: `PRM/KA/RERA/${Math.floor(100000 + Math.random() * 900000)}`,
                          priceStartingFrom: '₹2.45 Cr',
                          minPrice: 24500000,
                          maxPrice: 52000000,
                          constructionStatus: 'UNDER_CONSTRUCTION',
                          possessionDate: 'March 2029',
                          totalUnits: 200,
                          availableUnits: 85,
                          description: 'Luxury high-rise residential oasis connected to western express highway.',
                          amenities: ['Sky Gym', 'Private Cinema', 'Tennis Court', 'Squash Court'],
                          bhkTypes: ['3 BHK', '4 BHK'],
                          towers: ['Tower Enigma', 'Tower Elysian'],
                        },
                      ],
                      null,
                      2
                    )
                  );
                }}
                className="text-xs text-purple-400 hover:underline font-semibold cursor-pointer"
              >
                + Load Random Project Sample
              </button>

              <button
                onClick={handleRunSandbox}
                disabled={sandboxLoading}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-purple-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sandboxLoading ? 'Transmitting...' : 'Simulate Inbound Push'}</span>
              </button>
            </div>

            {sandboxResult && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">
                  API Ingest Output:
                </span>
                <pre
                  className={`p-3 rounded-xl border text-[11px] font-mono overflow-x-auto ${
                    sandboxResult.success
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {JSON.stringify(sandboxResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
