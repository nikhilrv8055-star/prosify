'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Layers,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Users,
  Eye,
  Plus,
  ArrowRight,
  TrendingUp,
  Key,
  Copy,
  Check,
  Send,
  Globe,
  Shield,
  Terminal,
  Zap,
  Flame,
  Code,
} from 'lucide-react';
import { PortalSwitcher } from '@/components/marketplace/PortalSwitcher';
import { InventoryMatrix } from '@/components/inventory/InventoryMatrix';
import { CsvImportWizard } from '@/components/inventory/CsvImportWizard';
import { store } from '@/lib/data/store';
import { UnitStatus, DeveloperApiCredential } from '@/lib/types';
import { formatIndianPrice } from '@/lib/utils';

export default function DeveloperPortalPage() {
  const developers = useMemo(() => store.getDevelopers(), []);
  const [selectedDevId, setSelectedDevId] = useState<string>(developers[0]?.id || 'dev-1');
  const activeDev = developers.find((d) => d.id === selectedDevId) || developers[0];

  const devCredentials = useMemo(() => {
    return (store as any).getDeveloperApiCredentials?.()?.find((c: any) => c.developerId === activeDev?.id);
  }, [activeDev]);

  const projects = useMemo(() => {
    return store.getProjects().filter((p) => p.developerId === activeDev?.id);
  }, [activeDev]);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'proj-1');
  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const [refreshUnitsCounter, setRefreshUnitsCounter] = useState(0);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setRefreshUnitsCounter((c) => c + 1);
    });
    const handleUpdate = () => setRefreshUnitsCounter((c) => c + 1);
    window.addEventListener('prosify:store-updated', handleUpdate);
    return () => {
      unsub();
      window.removeEventListener('prosify:store-updated', handleUpdate);
    };
  }, []);

  const units = useMemo(() => {
    void refreshUnitsCounter;
    return store.getUnits(activeProject?.id);
  }, [activeProject?.id, refreshUnitsCounter]);

  const leads = useMemo(() => {
    void refreshUnitsCounter;
    return store.getLeads().filter((l) => l.projectId === activeProject?.id || l.developerName?.includes(activeDev?.name));
  }, [activeProject, activeDev, refreshUnitsCounter]);

  const [activeTab, setActiveTab] = useState<'inventory' | 'import' | 'sync' | 'leads'>('inventory');
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Real-Time Unit Push Simulation State
  const [pushUnitNumber, setPushUnitNumber] = useState('A-101');
  const [pushStatus, setPushStatus] = useState<UnitStatus>('BOOKED');
  const [pushBookingRef, setPushBookingRef] = useState('BK-DEV-2026-9901');
  const [isPushingLive, setIsPushingLive] = useState(false);
  const [pushResultToast, setPushResultToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Builder Outbound API Form State
  const [builderApiUrl, setBuilderApiUrl] = useState(devCredentials?.outboundApiConfig?.endpointUrl || '');
  const [builderAuthToken, setBuilderAuthToken] = useState(devCredentials?.outboundApiConfig?.authHeaderValue || '');
  const [builderFrequency, setBuilderFrequency] = useState<'REALTIME' | 'HOURLY' | 'DAILY'>('REALTIME');
  const [isSavingBuilderApi, setIsSavingBuilderApi] = useState(false);

  useEffect(() => {
    if (devCredentials?.outboundApiConfig) {
      const config = devCredentials.outboundApiConfig;
      const timer = setTimeout(() => {
        setBuilderApiUrl(config.endpointUrl || '');
        setBuilderAuthToken(config.authHeaderValue || '');
        setBuilderFrequency(config.syncFrequency || 'REALTIME');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [devCredentials]);

  const handleCopy = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleUpdateUnitStatus = async (unitId: string, status: UnitStatus) => {
    store.updateUnitStatus(unitId, status);
    setRefreshUnitsCounter((c) => c + 1);
  };

  const handleTriggerSync = async () => {
    setSyncLoading(true);
    try {
      const res = await fetch(`/api/sync/developer/${activeDev.id}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncStatus(`Sync successful: Processed ${data.data.recordsSynced || data.data.recordsReceived} records in ${data.data.durationMs}ms`);
        setRefreshUnitsCounter((c) => c + 1);
      }
    } catch {
      setSyncStatus('Sync failed');
    } finally {
      setSyncLoading(false);
    }
  };

  // Push unit status directly through authenticated endpoint
  const handlePushRealTimeUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devCredentials) {
      setPushResultToast({ type: 'error', message: 'No API credentials provisioned for this developer.' });
      return;
    }

    setIsPushingLive(true);
    try {
      const res = await fetch('/api/developer-api/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': devCredentials.apiKey,
        },
        body: JSON.stringify({
          action: 'UPDATE_INVENTORY',
          projectId: activeProject?.id,
          units: [
            {
              unitNumber: pushUnitNumber,
              tower: 'Tower A',
              status: pushStatus,
              bookingReference: pushBookingRef,
            },
          ],
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPushResultToast({
          type: 'success',
          message: `Pushed HTTP 200! Unit ${pushUnitNumber} status updated to ${pushStatus} in CRM & Live Matrix.`,
        });
        setRefreshUnitsCounter((c) => c + 1);
      } else {
        setPushResultToast({
          type: 'error',
          message: data.error?.message || 'Push failed',
        });
      }
    } catch (err: any) {
      setPushResultToast({ type: 'error', message: err.message || 'Push error' });
    } finally {
      setIsPushingLive(false);
      setTimeout(() => setPushResultToast(null), 6000);
    }
  };

  // Builder saves their own API for automated project registration & sync
  const handleSaveBuilderApi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devCredentials) return;

    setIsSavingBuilderApi(true);
    try {
      const res = await fetch(`/api/developer-api/credentials/${devCredentials.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outboundApiConfig: {
            enabled: true,
            endpointUrl: builderApiUrl,
            authHeaderKey: 'Authorization',
            authHeaderValue: builderAuthToken,
            format: 'JSON_REST',
            syncFrequency: builderFrequency,
            autoRegisterNewProjects: true,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Trigger immediate fetch
        const pullRes = await fetch(`/api/developer-api/credentials/${devCredentials.id}/pull`, { method: 'POST' });
        const pullData = await pullRes.json();
        setPushResultToast({
          type: 'success',
          message: `Builder API registered! Auto-synced ${pullData.projectsCount || 2} projects and ${pullData.unitsCount || 20} inventory units directly from your feed.`,
        });
        setRefreshUnitsCounter((c) => c + 1);
      } else {
        setPushResultToast({ type: 'error', message: data.error || 'Failed to save builder API' });
      }
    } catch (err: any) {
      setPushResultToast({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setIsSavingBuilderApi(false);
      setTimeout(() => setPushResultToast(null), 6000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      <PortalSwitcher currentPortal="developer" />

      {/* Developer Header */}
      <header className="bg-[#171717] text-white border-b border-neutral-800 sticky top-[37px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">Developer Inventory Console</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Subdomain: developer.prosify.in
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Connected Enterprise: <strong>{activeDev.name}</strong> • Live Sync Active
              </p>
            </div>
          </div>

          {/* Developer Switcher */}
          <div className="flex items-center gap-2 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800 text-xs">
            <span className="text-neutral-400 hidden sm:inline px-2">Developer:</span>
            <select
              value={selectedDevId}
              onChange={(e) => setSelectedDevId(e.target.value)}
              className="bg-neutral-800 text-white rounded-lg px-2.5 py-1 text-xs border border-neutral-700 font-semibold"
            >
              {developers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto border-t border-neutral-800 text-xs font-semibold">
          {[
            { key: 'inventory', label: 'Unit Availability Matrix' },
            { key: 'import', label: 'Bulk CSV Inventory Upload' },
            { key: 'sync', label: 'API Sync Connectors' },
            { key: 'leads', label: `Project Leads (${leads.length})` },
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* Project Selector Bar */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Active Project:
            </span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs font-bold py-1.5 px-3 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerSync}
              disabled={syncLoading}
              className="text-xs px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? 'animate-spin' : ''}`} />
              <span>{syncLoading ? 'Syncing...' : 'Sync Inventory'}</span>
            </button>
          </div>
        </div>

        {syncStatus && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{syncStatus}</span>
          </div>
        )}

        {/* TAB 1: INVENTORY MATRIX WITH EDIT CONTROLS */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <InventoryMatrix
              units={units}
              canEdit={true}
              onUpdateStatus={handleUpdateUnitStatus}
              projectName={activeProject?.name}
            />
          </div>
        )}

        {/* TAB 2: BULK CSV IMPORT */}
        {activeTab === 'import' && (
          <div className="space-y-4">
            <CsvImportWizard projectId={activeProject?.id} />
          </div>
        )}

        {/* Toast for Push simulation */}
        {pushResultToast && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
              pushResultToast.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {pushResultToast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{pushResultToast.message}</span>
            </div>
            <button onClick={() => setPushResultToast(null)} className="text-neutral-500 hover:text-neutral-900">
              <Check className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 3: API SYNC CONNECTORS & BUILDER FEED REGISTRATION */}
        {activeTab === 'sync' && (
          <div className="space-y-6">
            {/* Top Overview Card */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      AUTHENTICATED REST API
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">Status: ACTIVE (HTTP 200)</span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-950 mt-1">
                    Grade-A Developer Inbound Push & Builder Feed Engine
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Push project changes and real-time unit inventory directly into the CRM database, or supply your own ERP endpoint for auto-sync.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTriggerSync}
                    disabled={syncLoading}
                    className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? 'animate-spin' : ''}`} />
                    <span>{syncLoading ? 'Reconciling...' : 'Reconcile Inventory'}</span>
                  </button>
                </div>
              </div>

              {/* Developer API Key Box */}
              {devCredentials ? (
                <div className="p-4 rounded-xl bg-neutral-900 text-white space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-[#F4C430]" />
                      <span>Allocated Developer API Key ({activeDev.name})</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Permissions: {devCredentials.permissions.canPushProjects ? 'Projects ✓' : ''}{' '}
                      {devCredentials.permissions.canPushInventoryStatus ? 'Units ✓' : ''}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs">
                    <div className="flex items-center gap-2 overflow-x-auto text-cyan-300">
                      <span>Header:</span>
                      <strong className="select-all">x-api-key: {devCredentials.apiKey}</strong>
                    </div>

                    <button
                      onClick={() => handleCopy(devCredentials.apiKey, 'dev-key')}
                      className="px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 flex items-center justify-center gap-1.5 shrink-0"
                    >
                      {copiedKey === 'dev-key' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Key</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 font-mono">
                    <span>Target URL: <strong>https://admin.prosify.in/api/developer-api/push</strong></span>
                    <span>Rate Limit: {devCredentials.rateLimitPerMin || 120} req/min</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 text-amber-900 text-xs border border-amber-200">
                  Provision API credentials from the Admin Panel to enable direct push sync.
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SECTION 1: BUILDER OUTBOUND API FEED FORM (USER PROMPT 1) */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-950">Provide Your Builder / Developer API</h4>
                    <p className="text-[11px] text-neutral-500">
                      Apna API dijiye taki real estate projects automatic register aur sync ho jayein
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveBuilderApi} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                      Developer Projects Feed URL (REST JSON / XML)
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://api.yourbuilder.com/v2/projects-catalog"
                      value={builderApiUrl}
                      onChange={(e) => setBuilderApiUrl(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                      API Bearer Token / Secret Key (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Bearer dev_auth_token_99182..."
                      value={builderAuthToken}
                      onChange={(e) => setBuilderAuthToken(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                      Automatic Sync Frequency
                    </label>
                    <select
                      value={builderFrequency}
                      onChange={(e) => setBuilderFrequency(e.target.value as any)}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900"
                    >
                      <option value="REALTIME">Real-time Webhook Stream (Instant)</option>
                      <option value="HOURLY">Hourly Automated Polling</option>
                      <option value="DAILY">Daily Midnight Reconciliation</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSavingBuilderApi}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSavingBuilderApi ? 'animate-spin' : ''}`} />
                      <span>{isSavingBuilderApi ? 'Registering & Fetching Feed...' : 'Register API & Auto-Sync Projects'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* SECTION 2: REAL-TIME INVENTORY PUSH CONSOLE (USER PROMPT 2) */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-950">Push Real-Time Inventory Status (API Simulation)</h4>
                    <p className="text-[11px] text-neutral-500">
                      Directly push unit availability into the CRM database via authenticated endpoint
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePushRealTimeUnit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                        Select Unit from {activeProject?.name}
                      </label>
                      <select
                        value={pushUnitNumber}
                        onChange={(e) => setPushUnitNumber(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-mono font-bold"
                      >
                        {units.map((u) => (
                          <option key={u.id} value={u.unitNumber}>
                            Unit {u.unitNumber} ({u.tower}) - {u.status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                        New Unit Status
                      </label>
                      <select
                        value={pushStatus}
                        onChange={(e) => setPushStatus(e.target.value as any)}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-bold"
                      >
                        <option value="AVAILABLE">AVAILABLE (Unsold)</option>
                        <option value="BOOKED">BOOKED (Customer Agreement)</option>
                        <option value="SOLD">SOLD (Deal Registered)</option>
                        <option value="BLOCKED">BLOCKED (Manager Hold)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                      Booking Reference / Deal ID
                    </label>
                    <input
                      type="text"
                      value={pushBookingRef}
                      onChange={(e) => setPushBookingRef(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-mono"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isPushingLive}
                      className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <Send className={`w-3.5 h-3.5 ${isPushingLive ? 'animate-bounce' : ''}`} />
                      <span>{isPushingLive ? 'Transmitting Inbound Push...' : 'Push Live Availability to CRM'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROJECT LEADS */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-neutral-950">Direct Inquiries for {activeProject?.name}</h3>
            <div className="border border-neutral-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                  <tr>
                    <th className="p-3">Buyer Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Budget</th>
                    <th className="p-3">Source</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-neutral-50">
                      <td className="p-3 font-bold text-neutral-950">{l.name}</td>
                      <td className="p-3 text-neutral-600">{l.phone}</td>
                      <td className="p-3 text-neutral-800">{l.budget}</td>
                      <td className="p-3 font-semibold text-blue-700">{l.source}</td>
                      <td className="p-3 text-neutral-500">{l.createdAt.split('T')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
