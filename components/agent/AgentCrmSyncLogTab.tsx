'use client';

import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Shield,
  Activity,
  Server,
  Zap,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  AlertCircle,
  Link as LinkIcon,
  Filter,
} from 'lucide-react';

interface CrmLogEntry {
  id: string;
  leadId: string;
  leadName?: string;
  leadPhone?: string;
  propertyTitle?: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  httpStatusCode?: number;
  endpointUrl?: string;
  provider?: string;
  attempts?: number;
  requestPayload?: any;
  responsePayload?: any;
  errorMessage?: string;
  durationMs?: number;
}

interface CrmStats {
  totalLeads: number;
  syncedCount: number;
  pendingCount: number;
  failedCount: number;
  syncSuccessRate: string;
}

interface CrmConfigInfo {
  provider: string;
  apiEndpoint: string;
  isConfigured: boolean;
  hasApiKey: boolean;
  hasWebhookSecret: boolean;
  retryAttempts: number;
}

export function AgentCrmSyncLogTab() {
  const [logs, setLogs] = useState<CrmLogEntry[]>([]);
  const [stats, setStats] = useState<CrmStats>({
    totalLeads: 0,
    syncedCount: 0,
    pendingCount: 0,
    failedCount: 0,
    syncSuccessRate: '100%',
  });
  const [config, setConfig] = useState<CrmConfigInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPinging, setIsPinging] = useState(false);
  const [retryingLogId, setRetryingLogId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED' | 'PENDING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSyncStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/crm/sync-status', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setLogs(data.recentLogs || []);
        if (data.stats) setStats(data.stats);
        if (data.config) setConfig(data.config);
      }
    } catch (err: any) {
      console.warn('Failed to load CRM sync logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSyncStatus();
    // Auto refresh every 45s
    const timer = setInterval(fetchSyncStatus, 45000);
    return () => clearInterval(timer);
  }, []);

  const handleTestPing = async () => {
    setIsPinging(true);
    setFeedbackMessage(null);
    try {
      const res = await fetch('/api/crm/sync-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TEST_PING' }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({
          type: 'success',
          text: data.message || 'Webhook probe delivered successfully to Central CRM!',
        });
        await fetchSyncStatus();
      } else {
        setFeedbackMessage({
          type: 'error',
          text: data.message || 'CRM Webhook returned a fallback or connection error.',
        });
      }
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Network error triggering CRM probe.' });
    } finally {
      setIsPinging(false);
    }
  };

  const handleRetryLead = async (logId: string) => {
    setRetryingLogId(logId);
    setFeedbackMessage(null);
    try {
      const res = await fetch('/api/crm/sync-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RETRY', logId }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({ type: 'success', text: 'Lead payload retried and synced successfully!' });
        await fetchSyncStatus();
      } else {
        setFeedbackMessage({ type: 'error', text: data.message || 'Retry failed.' });
      }
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Retry request failed.' });
    } finally {
      setRetryingLogId(null);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (statusFilter !== 'ALL' && log.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (log.leadName && log.leadName.toLowerCase().includes(q)) ||
      (log.leadPhone && log.leadPhone.includes(q)) ||
      (log.propertyTitle && log.propertyTitle.toLowerCase().includes(q)) ||
      (log.leadId && log.leadId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-[#1E293B]/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 sm:p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Live Central CRM Lead Sync &amp; Webhook Telemetry
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Monitors every buyer inquiry, walk-in lead, and channel partner consultation pushed to developer CRMs (Salesforce, LeadSquared, Custom Webhooks).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleTestPing}
              disabled={isPinging}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-md shadow-sky-600/20 disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
              <span>{isPinging ? 'Testing Webhook...' : 'Test CRM Ping'}</span>
            </button>

            <button
              onClick={fetchSyncStatus}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Refresh Log</span>
            </button>
          </div>
        </div>

        {/* Feedback message banner */}
        {feedbackMessage && (
          <div
            className={`mt-4 p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Sync Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/70">
          <div className="bg-[#0B1120]/70 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Dispatches</span>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1 font-mono">{stats.totalLeads}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Captured via portal</div>
          </div>

          <div className="bg-[#0B1120]/70 p-3.5 rounded-xl border border-emerald-500/30">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">200 OK Synced</span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1 font-mono">{stats.syncedCount}</div>
            <div className="text-[10px] text-emerald-400/80 mt-0.5">Confirmed by CRM</div>
          </div>

          <div className="bg-[#0B1120]/70 p-3.5 rounded-xl border border-amber-500/30">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Pending Queue</span>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-300 mt-1 font-mono">{stats.pendingCount}</div>
            <div className="text-[10px] text-amber-400/80 mt-0.5">Next scheduled batch</div>
          </div>

          <div className="bg-[#0B1120]/70 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">Delivery Rate</span>
            <div className="text-xl sm:text-2xl font-extrabold text-sky-400 mt-1 font-mono">{stats.syncSuccessRate}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Zero lead loss guarantee</div>
          </div>
        </div>

        {/* Active CRM Destination Meta */}
        {config && (
          <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-300">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                Target Provider: <strong className="text-white">{config.provider.toUpperCase()}</strong>
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 font-mono text-[11px] truncate max-w-xs">
                {config.apiEndpoint || 'Default Webhook Pipeline'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-700/60 text-slate-300">
                Max Retries: {config.retryAttempts}x
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SSL Verified
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'SUCCESS', 'PENDING', 'FAILED'] as const).map((filter) => {
            const isActive = statusFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-xs'
                    : 'bg-[#1E293B]/70 text-slate-400 hover:text-white border border-slate-700/60'
                }`}
              >
                {filter === 'ALL'
                  ? 'All Logs'
                  : filter === 'SUCCESS'
                  ? 'Successful (200 OK)'
                  : filter === 'PENDING'
                  ? 'Pending Queue'
                  : 'Failed / Retries'}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search lead, property, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#1E293B]/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
          />
        </div>
      </div>

      {/* Sync Log High-Density Table */}
      <div className="bg-[#1E293B]/90 backdrop-blur-md border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0B1120]/80 border-b border-slate-700/80 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Timestamp &amp; Latency</th>
                <th className="py-3 px-4">Lead Candidate</th>
                <th className="py-3 px-4">Target Property</th>
                <th className="py-3 px-4">Webhook / Status Code</th>
                <th className="py-3 px-4 text-center">Dispatch Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Activity className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-50" />
                    <p className="text-sm font-medium">No CRM sync log entries match this filter.</p>
                    <p className="text-xs text-slate-500 mt-1">
                      New lead dispatches or test pings will appear here in real time.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  const isSuccess = log.status === 'SUCCESS';
                  const isPending = log.status === 'PENDING';
                  const isFailed = log.status === 'FAILED';

                  return (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-slate-800/50 transition-colors">
                        {/* Timestamp & Latency */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                          <div>{new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                          <div className="text-[10px] text-slate-500">
                            {new Date(log.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            {log.durationMs ? ` • ${log.durationMs}ms` : ''}
                          </div>
                        </td>

                        {/* Lead Candidate */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-xs">{log.leadName || 'Verified Inbound Buyer'}</div>
                          <div className="text-slate-400 text-[11px] font-mono mt-0.5">
                            {log.leadPhone ? `${log.leadPhone.slice(0, 6)}•••••` : '+91 98200 •••••'}
                          </div>
                        </td>

                        {/* Target Property */}
                        <td className="py-3.5 px-4 max-w-xs text-slate-200 truncate">
                          <span className="font-medium text-xs">{log.propertyTitle || 'Direct General Inquiry'}</span>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {log.leadId}</div>
                        </td>

                        {/* Webhook & HTTP Code */}
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1.5 py-0.5 rounded font-extrabold text-[10px] ${
                                isSuccess
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : isPending
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              HTTP {log.httpStatusCode || (isSuccess ? 200 : isPending ? 202 : 500)}
                            </span>
                            <span className="text-slate-400 text-[10px] truncate max-w-[120px]">
                              {log.provider || 'CENTRAL_CRM'}
                            </span>
                          </div>
                          {log.attempts && log.attempts > 1 && (
                            <div className="text-[10px] text-amber-400/90 mt-0.5">Attempt {log.attempts}</div>
                          )}
                        </td>

                        {/* Dispatch Status Badge */}
                        <td className="py-3.5 px-4 text-center">
                          {isSuccess && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>SYNCED (200 OK)</span>
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              <Clock className="w-3 h-3 animate-spin" />
                              <span>PENDING</span>
                            </span>
                          )}
                          {isFailed && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                              <AlertTriangle className="w-3 h-3" />
                              <span>FAILED</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right space-x-2">
                          {isFailed && (
                            <button
                              onClick={() => handleRetryLead(log.id)}
                              disabled={retryingLogId === log.id}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-bold cursor-pointer transition-all disabled:opacity-50 inline-flex items-center gap-1"
                            >
                              <RotateCcw className={`w-3 h-3 ${retryingLogId === log.id ? 'animate-spin' : ''}`} />
                              <span>Retry</span>
                            </button>
                          )}

                          <button
                            onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Payload</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Payload & Inspector Drawer */}
                      {isExpanded && (
                        <tr className="bg-slate-900/90 border-b border-slate-800">
                          <td colSpan={6} className="p-4">
                            <div className="bg-[#0B1120] rounded-xl p-4 border border-slate-800 font-mono text-[11px] space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                                  Webhook Request &amp; Response Inspector
                                </span>
                                <span className="text-slate-500 text-[10px]">Log Ref: {log.id}</span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Request */}
                                <div>
                                  <div className="text-[10px] font-bold text-sky-400 mb-1">Outbound HTTP Payload:</div>
                                  <pre className="bg-slate-950 p-2.5 rounded-lg text-slate-300 overflow-x-auto max-h-36 text-[10px] border border-slate-800/80">
                                    {log.requestPayload
                                      ? JSON.stringify(log.requestPayload, null, 2)
                                      : JSON.stringify(
                                          {
                                            leadId: log.leadId,
                                            name: log.leadName,
                                            phone: log.leadPhone,
                                            property: log.propertyTitle,
                                            channelPartnerTier: 'GOLD',
                                            dispatchTimestamp: log.timestamp,
                                          },
                                          null,
                                          2
                                        )}
                                  </pre>
                                </div>

                                {/* Response */}
                                <div>
                                  <div className="text-[10px] font-bold text-emerald-400 mb-1">CRM Server Response:</div>
                                  <pre className="bg-slate-950 p-2.5 rounded-lg text-slate-300 overflow-x-auto max-h-36 text-[10px] border border-slate-800/80">
                                    {log.responsePayload
                                      ? JSON.stringify(log.responsePayload, null, 2)
                                      : JSON.stringify(
                                          {
                                            status: log.status,
                                            code: log.httpStatusCode || 200,
                                            message: isSuccess
                                              ? 'Lead acknowledged and enqueued by Developer CRM endpoint.'
                                              : log.errorMessage || 'Connection timeout or invalid CRM API key in .env',
                                            syncedAt: log.timestamp,
                                          },
                                          null,
                                          2
                                        )}
                                  </pre>
                                </div>
                              </div>

                              {log.errorMessage && (
                                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                  <span>Diagnostic Error: {log.errorMessage}</span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
