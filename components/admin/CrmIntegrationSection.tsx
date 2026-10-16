'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  Code2,
  Copy,
  Check,
  Zap,
  Info,
  Server,
  Layers,
  ChevronRight,
  HelpCircle,
  FileText,
  Key,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface CrmSyncLog {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  crmProvider: string;
  requestPayload: any;
  responsePayload: any;
  statusCode: number;
  errorMessage?: string;
  syncStatus: 'SYNCED' | 'PENDING' | 'FAILED';
  idempotencyKey: string;
  syncTimestamp: string;
}

export function CrmIntegrationSection() {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isPinging, setIsPinging] = useState(false);
  const [isRetrying, setIsRetrying] = useState<string | null>(null);

  const [crmConfig, setCrmConfig] = useState({
    provider: 'webhook',
    apiEndpoint: '',
    isConfigured: false,
    hasApiKey: false,
    hasWebhookSecret: false,
    retryAttempts: 3,
  });

  const [stats, setStats] = useState({
    totalLeads: 0,
    syncedCount: 0,
    pendingCount: 0,
    failedCount: 0,
    syncSuccessRate: '100%',
  });

  const [logs, setLogs] = useState<CrmSyncLog[]>([]);
  const [selectedLogForInspect, setSelectedLogForInspect] = useState<CrmSyncLog | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'zoho' | 'hubspot' | 'leadsquared' | 'webhook'>('webhook');

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/crm/sync-status');
      const data = await res.json();
      if (data.success) {
        setCrmConfig(data.config);
        setStats(data.stats);
        setLogs(data.recentLogs || []);
      }
    } catch {
      // Keep state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleTestPing = async () => {
    setIsPinging(true);
    try {
      const res = await fetch('/api/crm/sync-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TEST_PING' }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Test Lead Probe Delivered! 🚀',
          description: data.message || 'CRM endpoint responded with success.',
          type: 'success',
        });
      } else {
        toast({
          title: 'Probe Recorded Locally',
          description: data.message || 'Operating in fail-safe fallback mode.',
          type: 'info',
        });
      }
      fetchStatus();
    } catch {
      toast({
        title: 'Connection Probe Error',
        description: 'Unable to reach backend dispatcher.',
        type: 'error',
      });
    } finally {
      setIsPinging(false);
    }
  };

  const handleRetryLog = async (logId: string) => {
    setIsRetrying(logId);
    try {
      const res = await fetch('/api/crm/sync-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RETRY', logId }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Lead Retried Successfully! ✨',
          description: data.message,
          type: 'success',
        });
      } else {
        toast({
          title: 'Retry Attempt Failed',
          description: data.message,
          type: 'error',
        });
      }
      fetchStatus();
    } catch {
      toast({
        title: 'Network Error',
        description: 'Failed to communicate with retry dispatcher.',
        type: 'error',
      });
    } finally {
      setIsRetrying(null);
    }
  };

  const sampleWebhookUrl = 'https://webhook.site/your-unique-crm-uuid';

  return (
    <div className="space-y-6">
      {/* Top Status & Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Provider Status */}
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-700/80 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>CRM Pipeline Status</span>
            <Server className="w-4 h-4 text-[#0EA5E9]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white uppercase">{crmConfig.provider}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                crmConfig.isConfigured
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {crmConfig.isConfigured ? 'CONNECTED' : 'LOCAL FALLBACK'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-1">
            Endpoint: {crmConfig.apiEndpoint || 'Stored locally until CRM URL added in .env'}
          </p>
        </div>

        {/* Card 2: Synced Leads */}
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-700/80 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Successfully Synced</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">{stats.syncedCount}</span>
            <span className="text-xs text-slate-400">/ {stats.totalLeads} Total</span>
          </div>
          <p className="text-[11px] text-slate-400">Dispatched with HTTP 200/201 ack</p>
        </div>

        {/* Card 3: Pending Queue */}
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-700/80 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Pending Local Leads</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400">{stats.pendingCount}</span>
            <span className="text-xs text-slate-400">Safe in local DB</span>
          </div>
          <p className="text-[11px] text-slate-400">Ready for automated sync</p>
        </div>

        {/* Card 4: Failed / Retry Queue */}
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-700/80 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Failed Deliveries</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-400">{stats.failedCount}</span>
            <span className="text-xs text-slate-400">3 retries exhausted</span>
          </div>
          <p className="text-[11px] text-slate-400">Can be manually retried below</p>
        </div>
      </div>

      {/* Action Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#1E293B] to-slate-900 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Automated Lead Capture & Outbound Webhook Dispatcher</span>
          </h3>
          <p className="text-xs text-slate-300">
            All user actions (Inquiry Forms, Affiliate Signups, Request Callback, Download Brochure) automatically trigger this pipeline with exponential backoff retries.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleTestPing}
            disabled={isPinging}
            className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1120] font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isPinging ? 'Sending Probe...' : 'Send Test Lead Probe'}</span>
          </button>

          <button
            type="button"
            onClick={fetchStatus}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh Status & Logs"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Step-by-Step Instructions on Where to Paste the CRM Webhook URL */}
      <div className="p-6 rounded-2xl bg-[#1E293B] border border-slate-700/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-[#0EA5E9]" />
              <span>Step-by-Step Instructions: Connecting Your External CRM</span>
            </h4>
            <p className="text-xs text-slate-400">
              Select your CRM platform to see the exact steps and variables to configure in your <code>.env</code> file.
            </p>
          </div>

          <div className="inline-flex rounded-lg bg-[#0B1120] p-1 border border-slate-700">
            {(['webhook', 'zoho', 'hubspot', 'leadsquared'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveGuideTab(tab)}
                className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer ${
                  activeGuideTab === tab
                    ? 'bg-[#0EA5E9] text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'webhook' ? 'Generic Webhook / Zapier' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Guides Content */}
        {activeGuideTab === 'webhook' && (
          <div className="space-y-3 text-xs text-slate-300">
            <p>
              Use this option for <strong>Zapier, Make.com, n8n, Pabbly, or custom API endpoints</strong>:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
              <li>
                In Zapier or Make, create a new trigger: <strong>&quot;Webhooks by Zapier &rarr; Catch Hook&quot;</strong>.
              </li>
              <li>Copy the generated Webhook URL (e.g. <code>https://hooks.zapier.com/hooks/catch/...</code>).</li>
              <li>
                Open your project&apos;s <code>.env</code> file (or hosting environment variables) and set:
              </li>
            </ol>
            <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 font-mono text-xs text-emerald-400 space-y-1">
              <div>CRM_PROVIDER=&quot;webhook&quot;</div>
              <div>CRM_API_ENDPOINT=&quot;https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_URL&quot;</div>
              <div>CRM_API_KEY=&quot;optional-bearer-token-if-required&quot;</div>
            </div>
          </div>
        )}

        {activeGuideTab === 'zoho' && (
          <div className="space-y-3 text-xs text-slate-300">
            <p>
              Connect to <strong>Zoho CRM Web-to-Lead or REST API</strong>:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
              <li>Go to <strong>Zoho CRM &rarr; Settings &rarr; Developer Space &rarr; Webforms or Webhooks</strong>.</li>
              <li>Create a new Webhook or generate an API token for the <code>Leads</code> module.</li>
              <li>Update your <code>.env</code> file with the Zoho endpoint:</li>
            </ol>
            <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 font-mono text-xs text-emerald-400 space-y-1">
              <div>CRM_PROVIDER=&quot;zoho&quot;</div>
              <div>CRM_API_ENDPOINT=&quot;https://www.zohoapis.in/crm/v2/Leads&quot;</div>
              <div>CRM_API_KEY=&quot;Zoho-oauthtoken YOUR_ZOHO_OAUTH_TOKEN&quot;</div>
            </div>
          </div>
        )}

        {activeGuideTab === 'hubspot' && (
          <div className="space-y-3 text-xs text-slate-300">
            <p>
              Connect to <strong>HubSpot Contacts API or Forms Endpoint</strong>:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
              <li>In HubSpot, create a <strong>Private App</strong> under <em>Settings &rarr; Integrations &rarr; Private Apps</em>.</li>
              <li>Grant <code>crm.objects.contacts.write</code> permission and copy your Access Token.</li>
              <li>Configure your <code>.env</code>:</li>
            </ol>
            <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 font-mono text-xs text-emerald-400 space-y-1">
              <div>CRM_PROVIDER=&quot;hubspot&quot;</div>
              <div>CRM_API_ENDPOINT=&quot;https://api.hubapi.com/crm/v3/objects/contacts&quot;</div>
              <div>CRM_API_KEY=&quot;pat-na1-YOUR-HUBSPOT-PRIVATE-TOKEN&quot;</div>
            </div>
          </div>
        )}

        {activeGuideTab === 'leadsquared' && (
          <div className="space-y-3 text-xs text-slate-300">
            <p>
              Connect to <strong>LeadSquared Lead Management</strong>:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
              <li>Navigate to <strong>Settings &rarr; API and Webhooks</strong> in your LeadSquared portal.</li>
              <li>Copy your Host URL and generate an Access Key &amp; Secret Key.</li>
              <li>Add them to your <code>.env</code> file:</li>
            </ol>
            <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 font-mono text-xs text-emerald-400 space-y-1">
              <div>CRM_PROVIDER=&quot;leadsquared&quot;</div>
              <div>CRM_API_ENDPOINT=&quot;https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture&quot;</div>
              <div>CRM_API_KEY=&quot;accessKey=YOUR_KEY&amp;secretKey=YOUR_SECRET&quot;</div>
            </div>
          </div>
        )}
      </div>

      {/* Live CRM Sync Logs & Inspector Table */}
      <div className="rounded-2xl bg-[#1E293B] border border-slate-700/80 overflow-hidden shadow-xl space-y-0">
        <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Ingress & Sync Transmission Logs</span>
            </h4>
            <p className="text-xs text-slate-400">
              Detailed payload inspector with HTTP status codes and retry action buttons
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{logs.length} Transactions Recorded</span>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No CRM synchronization transactions recorded yet. Submit a test lead or contact form above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bg-[#0B1120]">
              <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Lead Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">HTTP Status</th>
                  <th className="px-4 py-3">Sync Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">
                      {log.syncTimestamp?.substring(0, 19).replace('T', ' ')}
                    </td>
                    <td className="px-4 py-3 font-bold text-white">{log.leadName}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{log.leadPhone}</td>
                    <td className="px-4 py-3 font-semibold text-slate-300 uppercase text-[11px]">
                      {log.crmProvider}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">
                      {log.statusCode ? (
                        <span
                          className={
                            log.statusCode >= 200 && log.statusCode < 300
                              ? 'text-emerald-400 font-bold'
                              : 'text-rose-400 font-bold'
                          }
                        >
                          HTTP {log.statusCode}
                        </span>
                      ) : (
                        <span className="text-slate-500">Local (No HTTP)</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.syncStatus === 'SYNCED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : log.syncStatus === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {log.syncStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedLogForInspect(log)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[#0EA5E9] text-[11px] font-semibold cursor-pointer"
                        >
                          Inspect JSON
                        </button>
                        {log.syncStatus === 'FAILED' && (
                          <button
                            type="button"
                            onClick={() => handleRetryLog(log.id)}
                            disabled={isRetrying === log.id}
                            className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                          >
                            {isRetrying === log.id ? 'Retrying...' : 'Retry'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* JSON Payload Inspector Modal */}
      {selectedLogForInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-3xl bg-[#1E293B] border border-slate-700 p-6 space-y-4 text-slate-100 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">CRM Payload Inspector</h4>
                <p className="text-[11px] font-mono text-slate-400">
                  Lead: {selectedLogForInspect.leadName} ({selectedLogForInspect.leadId})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLogForInspect(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-300 block mb-1">
                  Dispatched Request Payload (JSON):
                </span>
                <pre className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-56">
                  {JSON.stringify(selectedLogForInspect.requestPayload, null, 2)}
                </pre>
              </div>

              {selectedLogForInspect.responsePayload && (
                <div>
                  <span className="text-xs font-bold text-slate-300 block mb-1">
                    CRM Gateway Response:
                  </span>
                  <pre className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 font-mono text-xs text-cyan-400 overflow-x-auto max-h-36">
                    {JSON.stringify(selectedLogForInspect.responsePayload, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLogForInspect.errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
                  <strong>Transmission Error:</strong> {selectedLogForInspect.errorMessage}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedLogForInspect(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
