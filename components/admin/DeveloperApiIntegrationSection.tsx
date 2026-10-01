'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Key,
  Copy,
  Check,
  RotateCw,
  Zap,
  ShieldCheck,
  Sliders,
  ExternalLink,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  Layers,
  ArrowUpRight,
  Code,
  Radio,
  Lock,
  Globe,
  X,
  Send,
  Eye,
  EyeOff,
  Flame,
} from 'lucide-react';
import { DeveloperApiCredential, DeveloperPushResult } from '@/lib/types';

interface DeveloperApiIntegrationSectionProps {
  onRefreshAll?: () => void;
}

export function DeveloperApiIntegrationSection({ onRefreshAll }: DeveloperApiIntegrationSectionProps) {
  const [credentials, setCredentials] = useState<DeveloperApiCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Configuration Modal State
  const [activeConfigCred, setActiveConfigCred] = useState<DeveloperApiCredential | null>(null);
  const [isRotatingKey, setIsRotatingKey] = useState(false);
  const [isPullingFeed, setIsPullingFeed] = useState<string | null>(null);

  // Provision New Developer Modal
  const [isNewDevModalOpen, setIsNewDevModalOpen] = useState(false);
  const [newDevForm, setNewDevForm] = useState({
    developerName: '',
    developerId: 'dev-1',
    tier: 'GRADE_A' as const,
    outboundUrl: '',
    syncFrequency: 'REALTIME' as const,
  });

  // Live Test Sandbox State
  const [activeSandboxDev, setActiveSandboxDev] = useState<DeveloperApiCredential | null>(null);
  const [sandboxActionType, setSandboxActionType] = useState<'PROJECT' | 'INVENTORY'>('INVENTORY');
  const [sandboxProjectPayload, setSandboxProjectPayload] = useState({
    name: 'Godrej Horizon Sky',
    reraNumber: 'PRM/MH/RERA/1251/310/PR/2026/009182',
    city: 'Mumbai',
    location: 'Bandra Kurla Complex (BKC)',
    description: 'Ultra-luxury sky suites with private elevator vestibules and golf-view balconies.',
    priceMin: 22000000,
    priceMax: 65000000,
    totalUnits: 180,
    towers: ['Tower Emerald', 'Tower Sapphire'],
    status: 'NEW_LAUNCH' as const,
  });
  const [sandboxUnitPayload, setSandboxUnitPayload] = useState({
    unitNumber: 'A-402',
    tower: 'Tower A',
    floor: 4,
    bhk: '3 BHK',
    price: 14500000,
    status: 'BOOKED' as const,
    bookingReference: 'BK-GODREJ-LIVE-8821',
  });
  const [isPushingLive, setIsPushingLive] = useState(false);
  const [lastPushResponse, setLastPushResponse] = useState<DeveloperPushResult | null>(null);

  const fetchCredentials = async () => {
    try {
      const res = await fetch('/api/developer-api/credentials');
      const data = await res.json();
      if (data.success && data.data) {
        setCredentials(data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch developer credentials', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isCurrent = true;
    fetch('/api/developer-api/credentials')
      .then((res) => res.json())
      .then((data) => {
        if (isCurrent && data.success && data.data) {
          setCredentials(data.data);
        }
      })
      .catch((err) => console.error('Failed to fetch developer credentials', err))
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRotateKey = async (id: string) => {
    setIsRotatingKey(true);
    try {
      const res = await fetch(`/api/developer-api/credentials/${id}/rotate`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `API Key rotated successfully! New Key: ${data.newApiKey}`);
        await fetchCredentials();
        if (activeConfigCred && activeConfigCred.id === id) {
          setActiveConfigCred((prev) => prev ? { ...prev, apiKey: data.newApiKey, apiSecret: data.newSecret } : null);
        }
      } else {
        showNotification('error', data.error || 'Failed to rotate API Key');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Key rotation failed');
    } finally {
      setIsRotatingKey(false);
    }
  };

  const handleUpdatePermissions = async (
    id: string,
    permissionKey: keyof DeveloperApiCredential['permissions'],
    newValue: boolean
  ) => {
    try {
      const target = credentials.find((c) => c.id === id);
      if (!target) return;
      const updatedPermissions = { ...target.permissions, [permissionKey]: newValue };

      const res = await fetch(`/api/developer-api/credentials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: updatedPermissions }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `Updated permissions for ${target.developerName}`);
        fetchCredentials();
        if (activeConfigCred && activeConfigCred.id === id) {
          setActiveConfigCred((prev) => prev ? { ...prev, permissions: updatedPermissions } : null);
        }
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Permission update failed');
    }
  };

  const handleSaveOutboundConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConfigCred) return;

    try {
      const res = await fetch(`/api/developer-api/credentials/${activeConfigCred.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outboundApiConfig: activeConfigCred.outboundApiConfig,
          permissions: activeConfigCred.permissions,
          rateLimitPerMin: activeConfigCred.rateLimitPerMin,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `Saved API sync settings for ${activeConfigCred.developerName}`);
        setActiveConfigCred(null);
        fetchCredentials();
      } else {
        showNotification('error', data.error || 'Failed to save configuration');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Error saving settings');
    }
  };

  // Trigger Outbound Pull (Developer gave their API)
  const handleTriggerPull = async (credentialId: string) => {
    setIsPullingFeed(credentialId);
    try {
      const res = await fetch(`/api/developer-api/credentials/${credentialId}/pull`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotification(
          'success',
          `Auto-Sync Complete! Pulled ${data.projectsCount} projects and ${data.unitsCount} real-time units from builder API.`
        );
        fetchCredentials();
        if (onRefreshAll) onRefreshAll();
      } else {
        showNotification('error', data.error || 'Failed to pull from builder API');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Outbound sync failed');
    } finally {
      setIsPullingFeed(null);
    }
  };

  // Execute Live Inbound Push Simulation
  const handleSendLivePush = async () => {
    if (!activeSandboxDev) return;
    setIsPushingLive(true);
    setLastPushResponse(null);

    try {
      const payload =
        sandboxActionType === 'PROJECT'
          ? {
              action: 'SYNC_PROJECT' as const,
              project: {
                ...sandboxProjectPayload,
                bhkTypes: ['2 BHK', '3 BHK', '4 BHK'],
                amenities: [
                  'Infinity Lap Pool',
                  'Sky Lounge',
                  'Automated Valet',
                  'Concierge Desk',
                  'EV Charging',
                ],
              },
            }
          : {
              action: 'UPDATE_INVENTORY' as const,
              units: [
                {
                  unitNumber: sandboxUnitPayload.unitNumber,
                  tower: sandboxUnitPayload.tower,
                  floor: Number(sandboxUnitPayload.floor),
                  bhk: sandboxUnitPayload.bhk,
                  price: Number(sandboxUnitPayload.price),
                  status: sandboxUnitPayload.status,
                  bookingReference: sandboxUnitPayload.bookingReference,
                },
              ],
            };

      const res = await fetch('/api/developer-api/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': activeSandboxDev.apiKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLastPushResponse(data);
        showNotification(
          'success',
          `Push Verified (HTTP 200): ${data.message} • ${data.synced?.unitsUpdated || 0} unit(s) updated, ${data.synced?.projectsCreated || 0} project(s) created.`
        );
        fetchCredentials();
        if (onRefreshAll) onRefreshAll();
      } else {
        showNotification('error', data.error?.message || 'Inbound push failed');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Push request error');
    } finally {
      setIsPushingLive(false);
    }
  };

  const handleCreateNewDev = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevForm.developerName) return;

    try {
      const res = await fetch('/api/developer-api/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          developerName: newDevForm.developerName,
          developerId: newDevForm.developerId,
          tier: newDevForm.tier,
          outboundApiConfig: newDevForm.outboundUrl
            ? {
                enabled: true,
                endpointUrl: newDevForm.outboundUrl,
                format: 'JSON_REST',
                syncFrequency: newDevForm.syncFrequency,
                autoRegisterNewProjects: true,
              }
            : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification('success', `Created API credentials for ${newDevForm.developerName}`);
        setIsNewDevModalOpen(false);
        setNewDevForm({
          developerName: '',
          developerId: 'dev-1',
          tier: 'GRADE_A',
          outboundUrl: '',
          syncFrequency: 'REALTIME',
        });
        fetchCredentials();
      } else {
        showNotification('error', data.error || 'Failed to create developer connection');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Error creating credential');
    }
  };

  // Metrics
  const totalProjectsSynced = credentials.reduce((sum, c) => sum + (c.totalProjectsSynced || 0), 0);
  const totalUnitsSynced = credentials.reduce((sum, c) => sum + (c.totalUnitsSynced || 0), 0);
  const activeDevelopersCount = credentials.filter((c) => c.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Ingress Gateway Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider">
                Bidirectional Push & Pull
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Building2 className="w-6 h-6 text-indigo-400" />
              <span>Grade-A Developer Real-Time API & Inventory Push Gateway</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Allows top developers (Godrej, Lodha, Oberoi, Prestige, Sobha, Hiranandani) to securely push real estate
              projects, new tower launches, and real-time unit availability changes (Available → Blocked → Booked → Sold)
              directly into our CRM database via authenticated REST API. Also supports outbound polling from builder feeds.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsNewDevModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Connect New Builder API</span>
            </button>
            <button
              onClick={fetchCredentials}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition-colors"
              title="Refresh Developer Connections"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Connected Builders</span>
            <div className="text-xl font-black text-white mt-1 flex items-baseline gap-1.5">
              <span>{activeDevelopersCount}</span>
              <span className="text-[11px] font-normal text-emerald-400">/ {credentials.length} Registered</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Synced Projects</span>
            <div className="text-xl font-black text-indigo-400 mt-1 font-mono">
              {totalProjectsSynced}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Real-Time Units Synced</span>
            <div className="text-xl font-black text-emerald-400 mt-1 font-mono">
              {totalUnitsSynced.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Push Protocol</span>
            <div className="text-xs font-bold text-cyan-300 mt-1.5 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>x-api-key / Bearer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inbound API Ingress Endpoint Card */}
      <div className="p-5 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Authenticated Developer Push Endpoint</h3>
              <p className="text-xs text-slate-400">
                Grade-A developers send <code className="text-cyan-300 font-mono text-[11px]">POST</code> requests with their allocated API Key in headers.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono px-3 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Accepts: application/json</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 overflow-x-auto text-slate-300">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">POST</span>
            <span className="text-emerald-400 font-semibold select-all">https://admin.prosify.in/api/developer-api/push</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 text-[11px]">Header: x-api-key: &lt;DEVELOPER_API_KEY&gt;</span>
          </div>

          <button
            onClick={() => handleCopy('https://admin.prosify.in/api/developer-api/push', 'endpoint')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
          >
            {copiedKey === 'endpoint' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Ingress URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Developer API Connections Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            <span>Configured Grade-A Developer Credentials & Outbound Sync Feeds ({credentials.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Strict HMAC & API-Key RBAC isolation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {credentials.map((cred) => {
            const isVisible = visibleKeyId === cred.id;
            const isPulling = isPullingFeed === cred.id;

            return (
              <div
                key={cred.id}
                className="p-5 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl flex flex-col justify-between space-y-4 transition-all hover:border-slate-600"
              >
                <div className="space-y-3">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{cred.developerName}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {cred.tier.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Dev ID: {cred.developerId}</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 shrink-0 ${
                        cred.status === 'ACTIVE'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                          : 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          cred.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                      />
                      {cred.status}
                    </span>
                  </div>

                  {/* API Key Box */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Live Ingress API Key</span>
                      <button
                        onClick={() => setVisibleKeyId(isVisible ? null : cred.id)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{isVisible ? 'Hide' : 'Reveal'}</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2 font-mono text-xs">
                      <span className="text-cyan-300 truncate">
                        {isVisible ? cred.apiKey : `${cred.apiKey.slice(0, 12)}••••••••••••••••`}
                      </span>
                      <button
                        onClick={() => handleCopy(cred.apiKey, `key-${cred.id}`)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                        title="Copy API Key"
                      >
                        {copiedKey === `key-${cred.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Outbound Sync Status (Builder's API) */}
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-indigo-400" />
                        <span>Builder Outbound Feed:</span>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          cred.outboundApiConfig?.enabled
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {cred.outboundApiConfig?.enabled ? 'FEED CONFIGURED' : 'PUSH ONLY'}
                      </span>
                    </div>

                    {cred.outboundApiConfig?.enabled && (
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {cred.outboundApiConfig.endpointUrl}
                      </p>
                    )}
                  </div>

                  {/* Permissions Pills */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Enforced Ingress Permissions
                    </span>
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <span
                        className={`px-2 py-0.5 rounded border ${
                          cred.permissions.canPushProjects
                            ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        Push Projects: {cred.permissions.canPushProjects ? 'YES' : 'NO'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded border ${
                          cred.permissions.canPushInventoryStatus
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        Real-time Units: {cred.permissions.canPushInventoryStatus ? 'YES' : 'NO'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded border ${
                          cred.permissions.canUpdatePricing
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        Price Overwrite: {cred.permissions.canUpdatePricing ? 'YES' : 'NO'}
                      </span>
                    </div>
                  </div>

                  {/* Sync Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Projects Synced</span>
                      <strong className="text-white font-mono text-xs">{cred.totalProjectsSynced || 0}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Units Synced</span>
                      <strong className="text-emerald-400 font-mono text-xs">
                        {(cred.totalUnitsSynced || 0).toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {cred.lastPushMessage && (
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[10px] text-slate-300 flex items-start gap-1.5">
                      <Zap className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="truncate">{cred.lastPushMessage}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveConfigCred(cred)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveSandboxDev(cred);
                        setLastPushResponse(null);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Live Push Test</span>
                    </button>
                  </div>

                  {cred.outboundApiConfig?.enabled && (
                    <button
                      onClick={() => handleTriggerPull(cred.id)}
                      disabled={isPulling}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 cursor-pointer disabled:opacity-50"
                      title="Pull latest projects & units from builder API"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isPulling ? 'animate-spin' : ''}`} />
                      <span>{isPulling ? 'Pulling...' : 'Sync Pull'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configuration & Key Management Modal */}
      {activeConfigCred && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Configure Integration: {activeConfigCred.developerName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tier: {activeConfigCred.tier} • Enforce API Ingress controls & Outbound Sync
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveConfigCred(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOutboundConfig} className="space-y-6">
              {/* SECTION 1: INBOUND CREDENTIALS & ROTATION */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  <span>Inbound Push Authentication Credentials</span>
                </h4>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Active API Key (Send in x-api-key header)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={activeConfigCred.apiKey}
                        className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(activeConfigCred.apiKey, 'modal-key')}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700 cursor-pointer"
                      >
                        {copiedKey === 'modal-key' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-400">Rotate credential if compromised or expired:</span>
                    <button
                      type="button"
                      onClick={() => handleRotateKey(activeConfigCred.id)}
                      disabled={isRotatingKey}
                      className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isRotatingKey ? 'animate-spin' : ''}`} />
                      <span>{isRotatingKey ? 'Rotating...' : 'Rotate API Key'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 2: INGRESS PERMISSIONS */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Push Ingress Permissions</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-bold text-white block">Push Project Catalog</span>
                      <span className="text-[11px] text-slate-400">Auto-register / update projects</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeConfigCred.permissions.canPushProjects}
                      onChange={(e) =>
                        setActiveConfigCred({
                          ...activeConfigCred,
                          permissions: {
                            ...activeConfigCred.permissions,
                            canPushProjects: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-bold text-white block">Real-Time Inventory Status</span>
                      <span className="text-[11px] text-slate-400">Update Available/Booked/Sold status</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeConfigCred.permissions.canPushInventoryStatus}
                      onChange={(e) =>
                        setActiveConfigCred({
                          ...activeConfigCred,
                          permissions: {
                            ...activeConfigCred.permissions,
                            canPushInventoryStatus: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-bold text-white block">Price Overwrite Authority</span>
                      <span className="text-[11px] text-slate-400">Allow pricing updates on units</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeConfigCred.permissions.canUpdatePricing}
                      onChange={(e) =>
                        setActiveConfigCred({
                          ...activeConfigCred,
                          permissions: {
                            ...activeConfigCred.permissions,
                            canUpdatePricing: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="font-bold text-white block">BHK Layout Syndication</span>
                      <span className="text-[11px] text-slate-400">Map new floor plans & towers</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeConfigCred.permissions.canSyncBhkLayouts}
                      onChange={(e) =>
                        setActiveConfigCred({
                          ...activeConfigCred,
                          permissions: {
                            ...activeConfigCred.permissions,
                            canSyncBhkLayouts: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                </div>
              </div>

              {/* SECTION 3: BUILDER OUTBOUND API FEED (BUILDER GIVES THEIR API) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Builder Outbound API Feed (Automatic Register & Sync)</span>
                  </h4>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={activeConfigCred.outboundApiConfig?.enabled ?? false}
                      onChange={(e) =>
                        setActiveConfigCred({
                          ...activeConfigCred,
                          outboundApiConfig: {
                            enabled: e.target.checked,
                            endpointUrl: activeConfigCred.outboundApiConfig?.endpointUrl || '',
                            authHeaderKey: activeConfigCred.outboundApiConfig?.authHeaderKey || 'Authorization',
                            authHeaderValue: activeConfigCred.outboundApiConfig?.authHeaderValue || '',
                            format: activeConfigCred.outboundApiConfig?.format || 'JSON_REST',
                            syncFrequency: activeConfigCred.outboundApiConfig?.syncFrequency || 'REALTIME',
                            autoRegisterNewProjects: activeConfigCred.outboundApiConfig?.autoRegisterNewProjects ?? true,
                          },
                        })
                      }
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400"
                    />
                    <span className="font-semibold text-emerald-300">Enable Outbound Polling</span>
                  </label>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Builders / developers provide their own API endpoint URL and Auth Token so Prosify automatically
                    fetches their projects and registers new developments directly into the system.
                  </p>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-400 block">
                      Builder API Endpoint URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://api.developer.com/v2/inventory/feed"
                      value={activeConfigCred.outboundApiConfig?.endpointUrl || ''}
                      onChange={(e) =>
                        setActiveConfigCred({
                          ...activeConfigCred,
                          outboundApiConfig: {
                            ...activeConfigCred.outboundApiConfig!,
                            endpointUrl: e.target.value,
                          },
                        })
                      }
                      className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Auth Header Name
                      </label>
                      <input
                        type="text"
                        placeholder="Authorization or X-API-KEY"
                        value={activeConfigCred.outboundApiConfig?.authHeaderKey || 'Authorization'}
                        onChange={(e) =>
                          setActiveConfigCred({
                            ...activeConfigCred,
                            outboundApiConfig: {
                              ...activeConfigCred.outboundApiConfig!,
                              authHeaderKey: e.target.value,
                            },
                          })
                        }
                        className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Auth Token / Secret
                      </label>
                      <input
                        type="text"
                        placeholder="Bearer token or secret key"
                        value={activeConfigCred.outboundApiConfig?.authHeaderValue || ''}
                        onChange={(e) =>
                          setActiveConfigCred({
                            ...activeConfigCred,
                            outboundApiConfig: {
                              ...activeConfigCred.outboundApiConfig!,
                              authHeaderValue: e.target.value,
                            },
                          })
                        }
                        className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Sync Frequency
                      </label>
                      <select
                        value={activeConfigCred.outboundApiConfig?.syncFrequency || 'REALTIME'}
                        onChange={(e) =>
                          setActiveConfigCred({
                            ...activeConfigCred,
                            outboundApiConfig: {
                              ...activeConfigCred.outboundApiConfig!,
                              syncFrequency: e.target.value as any,
                            },
                          })
                        }
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="REALTIME">Real-time Webhook Stream</option>
                        <option value="HOURLY">Hourly Cron Polling</option>
                        <option value="DAILY">Daily Midnight Reconciliation</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={activeConfigCred.outboundApiConfig?.autoRegisterNewProjects ?? true}
                          onChange={(e) =>
                            setActiveConfigCred({
                              ...activeConfigCred,
                              outboundApiConfig: {
                                ...activeConfigCred.outboundApiConfig!,
                                autoRegisterNewProjects: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400"
                        />
                        <span className="text-slate-300">Auto-register newly discovered projects</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveConfigCred(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs shadow-lg shadow-indigo-500/25 cursor-pointer"
                >
                  Save Integration Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIVE TEST SANDBOX MODAL */}
      {activeSandboxDev && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Live Ingress Push Tester: {activeSandboxDev.developerName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Direct authenticated HTTP simulation using live API Key <code className="text-cyan-300 font-mono text-[11px]">{activeSandboxDev.apiKey.slice(0, 14)}...</code>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSandboxDev(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Test Action Type Selector */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSandboxActionType('INVENTORY')}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer text-center ${
                  sandboxActionType === 'INVENTORY'
                    ? 'bg-indigo-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Push Real-Time Inventory Unit Status
              </button>
              <button
                type="button"
                onClick={() => setSandboxActionType('PROJECT')}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer text-center ${
                  sandboxActionType === 'PROJECT'
                    ? 'bg-indigo-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Push New Project Registration
              </button>
            </div>

            {/* INVENTORY UNIT STATUS TEST FORM */}
            {sandboxActionType === 'INVENTORY' && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Simulate Live Unit Availability Change</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Updates CRM & Matrix Instantly</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Unit Number</label>
                    <input
                      type="text"
                      value={sandboxUnitPayload.unitNumber}
                      onChange={(e) => setSandboxUnitPayload({ ...sandboxUnitPayload, unitNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Tower</label>
                    <input
                      type="text"
                      value={sandboxUnitPayload.tower}
                      onChange={(e) => setSandboxUnitPayload({ ...sandboxUnitPayload, tower: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">New Unit Status</label>
                    <select
                      value={sandboxUnitPayload.status}
                      onChange={(e) => setSandboxUnitPayload({ ...sandboxUnitPayload, status: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                    >
                      <option value="AVAILABLE">AVAILABLE (Unsold)</option>
                      <option value="BOOKED">BOOKED (Customer Agreement)</option>
                      <option value="SOLD">SOLD (Registered Deal)</option>
                      <option value="BLOCKED">BLOCKED (Manager Hold)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Floor</label>
                    <input
                      type="number"
                      value={sandboxUnitPayload.floor}
                      onChange={(e) => setSandboxUnitPayload({ ...sandboxUnitPayload, floor: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={sandboxUnitPayload.price}
                      onChange={(e) => setSandboxUnitPayload({ ...sandboxUnitPayload, price: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Booking Ref</label>
                    <input
                      type="text"
                      value={sandboxUnitPayload.bookingReference}
                      onChange={(e) => setSandboxUnitPayload({ ...sandboxUnitPayload, bookingReference: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PROJECT REGISTRATION TEST FORM */}
            {sandboxActionType === 'PROJECT' && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Simulate Project Auto-Registration Push</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Registers in Catalog</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Project Name</label>
                    <input
                      type="text"
                      value={sandboxProjectPayload.name}
                      onChange={(e) => setSandboxProjectPayload({ ...sandboxProjectPayload, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">RERA Number</label>
                    <input
                      type="text"
                      value={sandboxProjectPayload.reraNumber}
                      onChange={(e) => setSandboxProjectPayload({ ...sandboxProjectPayload, reraNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">City & Micro-Market</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={sandboxProjectPayload.city}
                        onChange={(e) => setSandboxProjectPayload({ ...sandboxProjectPayload, city: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                      <input
                        type="text"
                        value={sandboxProjectPayload.location}
                        onChange={(e) => setSandboxProjectPayload({ ...sandboxProjectPayload, location: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Price Range (₹)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={sandboxProjectPayload.priceMin}
                        onChange={(e) => setSandboxProjectPayload({ ...sandboxProjectPayload, priceMin: Number(e.target.value) })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={sandboxProjectPayload.priceMax}
                        onChange={(e) => setSandboxProjectPayload({ ...sandboxProjectPayload, priceMax: Number(e.target.value) })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Project Description</label>
                    <textarea
                      rows={2}
                      value={sandboxProjectPayload.description}
                      onChange={(e) => setSandboxProjectPayload({ ...sandboxProjectPayload, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Push Response Output Panel */}
            {lastPushResponse && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 space-y-2 text-xs">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Response: HTTP 200 OK (Reconciled into CRM)</span>
                  </span>
                  <span className="text-[10px] font-mono">{lastPushResponse.synced.timestamp.split('T')[1].slice(0, 8)}</span>
                </div>
                <p className="text-emerald-200">{lastPushResponse.message}</p>
                {lastPushResponse.affectedUnits && lastPushResponse.affectedUnits.length > 0 && (
                  <div className="pt-2 border-t border-emerald-900/60 flex items-center gap-3 font-mono text-[11px] text-emerald-300">
                    <span>Unit: <strong>{lastPushResponse.affectedUnits[0].unitNumber}</strong></span>
                    <span>Status: <strong className="text-white bg-emerald-900 px-1.5 py-0.5 rounded">{lastPushResponse.affectedUnits[0].status}</strong></span>
                    <span>State: Synced</span>
                  </div>
                )}
              </div>
            )}

            {/* SEND TEST PUSH BUTTON */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveSandboxDev(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close Sandbox
              </button>
              <button
                type="button"
                onClick={handleSendLivePush}
                disabled={isPushingLive}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className={`w-4 h-4 ${isPushingLive ? 'animate-bounce' : ''}`} />
                <span>{isPushingLive ? 'Transmitting Inbound Push...' : 'Send Authenticated Push Request'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONNECT NEW BUILDER API MODAL */}
      {isNewDevModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Connect New Grade-A Builder API</h3>
              </div>
              <button
                onClick={() => setIsNewDevModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewDev} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Developer Enterprise Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DLF Limited or Brigade Enterprises"
                  value={newDevForm.developerName}
                  onChange={(e) => setNewDevForm({ ...newDevForm, developerName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Developer Rating / Tier</label>
                <select
                  value={newDevForm.tier}
                  onChange={(e) => setNewDevForm({ ...newDevForm, tier: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
                >
                  <option value="GRADE_A_PLUS">Grade-A+ (Conglomerate / DA1 Rated)</option>
                  <option value="GRADE_A">Grade-A (National Enterprise)</option>
                  <option value="GRADE_B">Grade-B (Regional Developer)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Builder Outbound API URL (Optional - if builder provided their API)
                </label>
                <input
                  type="url"
                  placeholder="https://api.developer.com/v1/projects"
                  value={newDevForm.outboundUrl}
                  onChange={(e) => setNewDevForm({ ...newDevForm, outboundUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Prosify will auto-generate Inbound Push API Keys (<code className="text-cyan-400">dev_live_...</code>) regardless of outbound URL.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewDevModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold shadow-lg shadow-indigo-500/25 cursor-pointer"
                >
                  Generate Credentials & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
