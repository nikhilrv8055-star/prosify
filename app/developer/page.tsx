'use client';

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { PortalSwitcher } from '@/components/marketplace/PortalSwitcher';
import { InventoryMatrix } from '@/components/inventory/InventoryMatrix';
import { CsvImportWizard } from '@/components/inventory/CsvImportWizard';
import { store } from '@/lib/data/store';
import { UnitStatus } from '@/lib/types';
import { formatIndianPrice } from '@/lib/utils';

export default function DeveloperPortalPage() {
  const developers = useMemo(() => store.getDevelopers(), []);
  const [selectedDevId, setSelectedDevId] = useState<string>(developers[0]?.id || 'dev-1');
  const activeDev = developers.find((d) => d.id === selectedDevId) || developers[0];

  const projects = useMemo(() => {
    return store.getProjects().filter((p) => p.developerId === activeDev?.id);
  }, [activeDev]);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'proj-1');
  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const units = useMemo(() => {
    return store.getUnits(activeProject?.id);
  }, [activeProject]);

  const leads = useMemo(() => {
    return store.getLeads().filter((l) => l.projectId === activeProject?.id || l.developerName?.includes(activeDev?.name));
  }, [activeProject, activeDev]);

  const [activeTab, setActiveTab] = useState<'inventory' | 'import' | 'sync' | 'leads'>('inventory');
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleUpdateUnitStatus = async (unitId: string, status: UnitStatus) => {
    store.updateUnitStatus(unitId, status);
  };

  const handleTriggerSync = async () => {
    setSyncLoading(true);
    try {
      const res = await fetch(`/api/sync/developer/${activeDev.id}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncStatus(`Sync successful: Processed ${data.data.recordsSynced} records in ${data.data.durationMs}ms`);
      }
    } catch {
      setSyncStatus('Sync failed');
    } finally {
      setSyncLoading(false);
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

        {/* TAB 3: API SYNC CONNECTORS */}
        {activeTab === 'sync' && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-950">ERP & CRM Integration Connectors</h3>
              <p className="text-xs text-neutral-500">
                Configure bidirectional inventory synchronization with Salesforce, Farvision, or custom webhooks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-900">Farvision ERP Connector</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    CONNECTED
                  </span>
                </div>
                <p className="text-xs text-neutral-600">
                  Automated sync runs every 4 hours. Reads tower unit price sheets and status changes.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleTriggerSync}
                    className="text-xs font-semibold text-[#D4A017] hover:underline"
                  >
                    Trigger Immediate Sync →
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-900">Webhook Push Listener</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-neutral-600">
                  Endpoint: <code className="font-mono text-[11px] bg-white px-1 py-0.5 rounded border">/api/sync/developer/{activeDev.id}</code>
                </p>
                <p className="text-[11px] text-neutral-500">
                  Accepts JSON payload with unitNumber and status.
                </p>
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
