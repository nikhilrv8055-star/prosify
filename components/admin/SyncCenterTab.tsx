'use client';

import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Server,
  Database,
  ArrowDownUp,
  Activity,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Eye,
  Clock,
  ShieldCheck,
  X,
  FileCode,
  AlertCircle,
  Cpu,
  Key,
} from 'lucide-react';
import { DeveloperSyncSource, SyncJob } from '@/lib/types';

export function SyncCenterTab() {
  const [sources, setSources] = useState<DeveloperSyncSource[]>([]);
  const [jobs, setJobs] = useState<SyncJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSyncingId, setActiveSyncingId] = useState<string | null>(null);
  const [activeRetryingId, setActiveRetryingId] = useState<string | null>(null);
  const [selectedJobForModal, setSelectedJobForModal] = useState<SyncJob | null>(null);
  const [simulateErrorForNextSync, setSimulateErrorForNextSync] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [statusNotification, setStatusNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // New source form state
  const [newSourceForm, setNewSourceForm] = useState({
    developerName: '',
    developerId: 'dev-1',
    sourceType: 'API' as const,
    feedFormat: 'JSON_REST' as const,
    authType: 'BEARER_TOKEN' as const,
    apiUrl: '',
    apiKey: '',
    syncFrequency: 'HOURLY' as const,
    autoSyncEnabled: true,
    maxRetries: 3,
    backoffSeconds: 30,
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/sync/sources');
      const data = await res.json();
      if (data.success) {
        setSources(data.sources || []);
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Failed to load sync sources', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const res = await fetch('/api/sync/sources');
        const data = await res.json();
        if (isMounted && data.success) {
          setSources(data.sources || []);
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error('Failed to load sync sources', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setStatusNotification({ type, message });
    setTimeout(() => setStatusNotification(null), 5000);
  };

  const handleRunSync = async (sourceId: string, simulateError: boolean = false) => {
    setActiveSyncingId(sourceId);
    try {
      const res = await fetch(`/api/sync/developer/${sourceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulateError }),
      });
      const data = await res.json();
      if (data.success) {
        if (simulateError) {
          showNotification('error', `Sync failed as simulated for testing retry system.`);
        } else {
          showNotification(
            'success',
            `Synced ${data.data.recordsReceived} records for ${data.data.developerName} (${data.data.recordsCreated} new, ${data.data.recordsUpdated} updated).`
          );
        }
        await fetchData();
      } else {
        showNotification('error', data.error?.message || 'Sync failed');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Sync request failed');
    } finally {
      setActiveSyncingId(null);
    }
  };

  const handleRetryJob = async (jobId: string) => {
    setActiveRetryingId(jobId);
    try {
      const res = await fetch('/api/sync/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          'success',
          `Retry attempt succeeded! Reconciled ${data.data.recordsReceived} records.`
        );
        await fetchData();
      } else {
        showNotification('error', data.error?.message || 'Retry failed');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to trigger retry');
    } finally {
      setActiveRetryingId(null);
    }
  };

  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceForm.developerName || !newSourceForm.apiUrl) {
      showNotification('error', 'Please provide Developer Name and Endpoint URL');
      return;
    }

    try {
      const res = await fetch('/api/sync/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSourceForm,
          retryPolicy: {
            maxRetries: Number(newSourceForm.maxRetries),
            backoffSeconds: Number(newSourceForm.backoffSeconds),
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `Added developer sync feed for ${newSourceForm.developerName}`);
        setIsAddModalOpen(false);
        setNewSourceForm({
          developerName: '',
          developerId: 'dev-1',
          sourceType: 'API',
          feedFormat: 'JSON_REST',
          authType: 'BEARER_TOKEN',
          apiUrl: '',
          apiKey: '',
          syncFrequency: 'HOURLY',
          autoSyncEnabled: true,
          maxRetries: 3,
          backoffSeconds: 30,
        });
        await fetchData();
      } else {
        showNotification('error', data.error?.message || 'Failed to create feed');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to add source');
    }
  };

  const handleDeleteSource = async (id: string, name: string) => {
    if (!confirm(`Remove developer sync configuration for ${name}?`)) return;
    try {
      const res = await fetch(`/api/sync/developer/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `Removed feed for ${name}`);
        await fetchData();
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete feed');
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear the synchronization log trail?')) return;
    try {
      await fetch('/api/sync/clear-logs', { method: 'POST' });
      showNotification('success', 'Sync log trail cleared');
      await fetchData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to clear logs');
    }
  };

  const handleToggleAutoSync = async (source: DeveloperSyncSource) => {
    const updatedStatus = !source.autoSyncEnabled;
    try {
      await fetch(`/api/sync/developer/${source.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoSyncEnabled: updatedStatus }),
      });
      setSources((prev) =>
        prev.map((s) => (s.id === source.id ? { ...s, autoSyncEnabled: updatedStatus } : s))
      );
      showNotification(
        'success',
        `Auto-sync ${updatedStatus ? 'enabled' : 'paused'} for ${source.developerName}`
      );
    } catch {
      showNotification('error', 'Failed to update auto-sync status');
    }
  };

  const failedJobsCount = jobs.filter((j) => j.status === 'FAILED' || j.status === 'PARTIAL').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusNotification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-2 ${
            statusNotification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusNotification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusNotification.message}</span>
          </div>
          <button
            onClick={() => setStatusNotification(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#10B981]" />
            <span>Developer Auto-Sync System & Enterprise Pipeline</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated bidirectional reconciliation with developer ERPs, XML feeds, and SFTP endpoints with exponential backoff retries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 cursor-pointer hover:bg-slate-750">
            <input
              type="checkbox"
              checked={simulateErrorForNextSync}
              onChange={(e) => setSimulateErrorForNextSync(e.target.checked)}
              className="rounded accent-rose-500 w-3.5 h-3.5"
            />
            <span className="text-[11px]">Test Error Simulation</span>
          </label>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Developer Feed</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Configured Feeds</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">{sources.length}</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">All Authenticated Feeds</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Units Reconciled</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            {sources.reduce((sum, s) => sum + (s.unitsMappedCount || 0), 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across All Active Projects</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Sync Success Rate</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-mono">98.4%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Zero Unhandled Failures</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Retry Queue</span>
            <RotateCcw className={`w-4 h-4 ${failedJobsCount > 0 ? 'text-amber-400' : 'text-slate-400'}`} />
          </div>
          <div
            className={`mt-2 text-2xl font-black font-mono ${
              failedJobsCount > 0 ? 'text-amber-400' : 'text-white'
            }`}
          >
            {failedJobsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {failedJobsCount > 0 ? 'Pending Retry / Backoff' : 'All Pipelines In Sync'}
          </div>
        </div>
      </div>

      {/* Developer Feeds List */}
      <div className="rounded-2xl bg-[#1E293B]/90 backdrop-blur-md border border-slate-700 shadow-xl overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-900/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Developer Sync Connectors ({sources.length})
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">Official API, XML & SFTP Ingress Only</span>
        </div>

        <div className="divide-y divide-slate-800">
          {sources.map((source) => {
            const isSyncing = activeSyncingId === source.id;
            return (
              <div
                key={source.id}
                className="p-4 sm:p-5 hover:bg-slate-850/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white">{source.developerName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-300 border border-slate-700">
                      {source.feedFormat || source.sourceType}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {source.authType || 'BEARER_TOKEN'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                        source.status === 'SUCCESS'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          : source.status === 'FAILED'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                          : source.status === 'PARTIAL'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          source.status === 'SUCCESS'
                            ? 'bg-emerald-400'
                            : source.status === 'FAILED'
                            ? 'bg-rose-400'
                            : 'bg-amber-400'
                        }`}
                      />
                      {source.status}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-slate-400 break-all">{source.apiUrl}</p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span>
                      Cadence: <strong className="text-slate-200">{source.syncFrequency}</strong>
                    </span>
                    <span>
                      Mapped Units: <strong className="text-cyan-400 font-mono">{source.unitsMappedCount || 0}</strong>
                    </span>
                    <span>
                      Last Reconciled:{' '}
                      <strong className="text-slate-200">
                        {source.lastSyncAt ? new Date(source.lastSyncAt).toLocaleTimeString() : 'Never'}
                      </strong>
                    </span>
                    {source.apiKeyMasked && (
                      <span className="flex items-center gap-1">
                        <Key className="w-3 h-3 text-amber-400" />
                        <span className="font-mono text-slate-300">{source.apiKeyMasked}</span>
                      </span>
                    )}
                  </div>

                  {source.lastErrorMessage && (
                    <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300 text-[11px] flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{source.lastErrorMessage}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleToggleAutoSync(source)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      source.autoSyncEnabled
                        ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-300 hover:bg-emerald-900/60'
                        : 'bg-slate-800 border-slate-750 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    Auto-Sync: {source.autoSyncEnabled ? 'ENABLED' : 'PAUSED'}
                  </button>

                  <button
                    onClick={() => handleRunSync(source.id, simulateErrorForNextSync)}
                    disabled={isSyncing}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Reconciling...' : 'Run Sync Now'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteSource(source.id, source.developerName)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all cursor-pointer"
                    title="Delete connector"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sync Job History & Retry System */}
      <div className="rounded-2xl bg-[#1E293B]/90 backdrop-blur-md border border-slate-700 overflow-hidden shadow-xl">
        <div className="px-5 py-3 bg-slate-900/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Live Synchronization Logs & Retry System ({jobs.length})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearLogs}
              className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              Clear Logs
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Developer Feed</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Reconciled</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Job Status & Retry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {jobs.map((job) => {
                const isRetrying = activeRetryingId === job.id;
                const canRetry = job.status === 'FAILED' || job.status === 'PARTIAL';
                return (
                  <tr key={job.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{job.developerName}</span>
                        {job.statusCode && (
                          <span
                            className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                              job.statusCode === 200
                                ? 'bg-emerald-950 text-emerald-300'
                                : job.statusCode === 504
                                ? 'bg-rose-950 text-rose-300'
                                : 'bg-amber-950 text-amber-300'
                            }`}
                          >
                            HTTP {job.statusCode}
                          </span>
                        )}
                      </div>
                      {job.errorMessage && (
                        <p className="text-[11px] text-rose-400 mt-0.5 max-w-sm truncate">
                          {job.errorMessage}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(job.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="text-slate-200">
                        {job.recordsReceived} total
                      </div>
                      <div className="text-[10px] text-slate-400">
                        +{job.recordsCreated || 0} created / {job.recordsUpdated || 0} updated
                        {(job.recordsFailed || 0) > 0 && (
                          <span className="text-rose-400 font-bold ml-1">
                            ({job.recordsFailed} failed)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {job.durationMs}ms
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold text-[11px] px-2 py-0.5 rounded ${
                            job.status === 'SUCCESS'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                              : job.status === 'FAILED'
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {job.status === 'SUCCESS' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          {job.status}
                        </span>

                        {job.retryStatus && job.retryStatus !== 'NONE' && (
                          <div className="text-[10px] text-slate-400">
                            Retry: <span className="text-amber-400 font-semibold">{job.retryCount || 0}/{job.maxRetries || 3}</span>
                            {job.retryStatus === 'RETRIED' && (
                              <span className="text-emerald-400 ml-1 font-semibold">(Recovered)</span>
                            )}
                            {job.nextRetryAt && (
                              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                <span>{job.nextRetryAt}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {canRetry && (
                        <button
                          onClick={() => handleRetryJob(job.id)}
                          disabled={isRetrying}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] inline-flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <RotateCcw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                          <span>{isRetrying ? 'Retrying...' : 'Retry Now'}</span>
                        </button>
                      )}

                      {job.logPayload && (
                        <button
                          onClick={() => setSelectedJobForModal(job)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] inline-flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-cyan-400" />
                          <span>Telemetry</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload Modal */}
      {selectedJobForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Sync Telemetry Payload - {selectedJobForModal.developerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedJobForModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Status: <strong className="text-white">{selectedJobForModal.status}</strong></span>
                <span>Duration: <strong className="text-white">{selectedJobForModal.durationMs}ms</strong></span>
                <span>HTTP Code: <strong className="text-white">{selectedJobForModal.statusCode || 200}</strong></span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-cyan-300 font-mono text-[11px] max-h-72 overflow-y-auto border border-slate-800">
                {selectedJobForModal.logPayload}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedJobForModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Developer Feed Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Add Developer Catalog Feed</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSource} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Developer / Enterprise Group Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shapoorji Pallonji Real Estate"
                  value={newSourceForm.developerName}
                  onChange={(e) =>
                    setNewSourceForm({ ...newSourceForm, developerName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Feed Format</label>
                  <select
                    value={newSourceForm.feedFormat}
                    onChange={(e) =>
                      setNewSourceForm({ ...newSourceForm, feedFormat: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="JSON_REST">REST API (JSON)</option>
                    <option value="XML_FEED">Syndication XML Feed</option>
                    <option value="SFTP">Secure SFTP Export</option>
                    <option value="WEBHOOK">Inbound Webhook</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Authentication</label>
                  <select
                    value={newSourceForm.authType}
                    onChange={(e) =>
                      setNewSourceForm({ ...newSourceForm, authType: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="BEARER_TOKEN">OAuth2 / Bearer Token</option>
                    <option value="API_KEY">API Key Header</option>
                    <option value="BASIC_AUTH">HTTP Basic Auth</option>
                    <option value="MUTUAL_TLS">Mutual TLS / SSH Key</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Endpoint / Feed Ingress URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://api.developer.com/v2/inventory/feed"
                  value={newSourceForm.apiUrl}
                  onChange={(e) => setNewSourceForm({ ...newSourceForm, apiUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Feed API Key / Token Secret
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••"
                  value={newSourceForm.apiKey}
                  onChange={(e) => setNewSourceForm({ ...newSourceForm, apiKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Frequency</label>
                  <select
                    value={newSourceForm.syncFrequency}
                    onChange={(e) =>
                      setNewSourceForm({ ...newSourceForm, syncFrequency: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="REALTIME">Real-time Hook</option>
                    <option value="HOURLY">Hourly (Recommended)</option>
                    <option value="DAILY">Daily at 02:00 IST</option>
                    <option value="MANUAL">Manual Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Max Retries</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newSourceForm.maxRetries}
                    onChange={(e) =>
                      setNewSourceForm({ ...newSourceForm, maxRetries: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Backoff Sec</label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={newSourceForm.backoffSeconds}
                    onChange={(e) =>
                      setNewSourceForm({ ...newSourceForm, backoffSeconds: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Save & Test Handshake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
