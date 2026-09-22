'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Save,
  CheckCircle2,
  Server,
  Lock,
  Globe,
  ExternalLink,
  Percent,
} from 'lucide-react';

export function SettingsTab() {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [settings, setSettings] = useState({
    agencyName: 'Prosify Technologies Private Limited',
    adminHost: 'admin.prosify.in',
    tdsRate: 5.0,
    silverRate: 2.0,
    goldRate: 2.5,
    platinumRate: 3.0,
    diamondRate: 3.5,
    sessionTimeoutMins: 15,
    ipWhitelist: '103.21.14.82, 192.168.1.0/24',
    enableAuditLogs: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#10B981]" />
            <span>Platform Policy & Agency Configuration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational parameters, statutory TDS rate settings, and host network access restrictions
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Platform policies updated and synced to production cluster.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Agency Identity Card */}
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#0EA5E9]" />
            <span>Agency & Host Topology</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Agency Legal Title</label>
              <input
                type="text"
                value={settings.agencyName}
                onChange={(e) => setSettings({ ...settings, agencyName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Administrative Domain Host</label>
              <input
                type="text"
                disabled
                value={settings.adminHost}
                className="w-full px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800 text-[#0EA5E9] font-mono focus:outline-none cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Strict isolation: Never exposed through public website links
              </span>
            </div>
          </div>
        </div>

        {/* Financial Slabs & TDS */}
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-[#F59E0B]" />
            <span>Statutory Section 194H & Channel Partner Slabs</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Statutory TDS Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.tdsRate}
                onChange={(e) => setSettings({ ...settings, tdsRate: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
              />
              <span className="text-[10px] text-slate-400">Section 194H standard</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Silver Slab (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.silverRate}
                onChange={(e) => setSettings({ ...settings, silverRate: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Gold Slab (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.goldRate}
                onChange={(e) => setSettings({ ...settings, goldRate: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Platinum Slab (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.platinumRate}
                onChange={(e) => setSettings({ ...settings, platinumRate: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Diamond Slab (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.diamondRate}
                onChange={(e) => setSettings({ ...settings, diamondRate: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>
        </div>

        {/* Security Policies */}
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#10B981]" />
            <span>Administrative Security & Inactivity Locks</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Root Operator ID (Static Authentication)
              </label>
              <input
                type="text"
                disabled
                value="eni1526"
                className="w-full px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Session Idle Inactivity Timeout (Minutes)
              </label>
              <input
                type="number"
                value={settings.sessionTimeoutMins}
                onChange={(e) => setSettings({ ...settings, sessionTimeoutMins: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-medium mb-1">
                Allowed IP Whitelist Subnets (CIDR)
              </label>
              <input
                type="text"
                value={settings.ipWhitelist}
                onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>
        </div>

        {/* Save button & WhatsApp Support Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Strict rule: WhatsApp Redirection to https://wa.me/919326303244, button text MUST ONLY say "WhatsApp" */}
          <a
            href="https://wa.me/919326303244"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/40 text-xs font-semibold"
          >
            <span>WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-xs shadow-lg shadow-[#10B981]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Persist System Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
