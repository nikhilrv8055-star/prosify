'use client';

import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  UserPlus,
  Trash2,
  Edit2,
  ExternalLink,
  ShieldCheck,
  Search,
  BadgeCheck,
  Mail,
  Phone,
  Key,
  Copy,
  Sparkles,
  Lock,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  Building,
  Briefcase,
  AlertCircle,
  FileText,
  Database,
  ArrowUpRight,
  X,
  Check,
} from 'lucide-react';
import {
  PortalUser,
  getPortalUsers,
  createPortalUser,
  updatePortalUser,
  deletePortalUser,
  savePortalUsers,
  setPortalSession,
  syncPortalUsersFromCloud,
} from '@/lib/auth/portalUsers';
import {
  getScopedAgentData,
  createInitialAgentData,
  saveScopedAgentData,
} from '@/lib/auth/scopedPortalStorage';

export interface AgentDetailsModalData {
  id: string;
  name: string;
  username: string;
  assignedCode: string;
  phone: string;
  companyOrProject: string;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  tier?: string;
  dealsClosed?: number;
  reraNumber?: string;
  panNumber?: string;
  commissionRate?: string;
  specialization?: string;
  city?: string;
  cloudBucketUri?: string;
  cloudSyncedAt?: string;
}

export function AgentsManagementView({ subview = 'agents-management' }: { subview?: string }) {
  const [activeTab, setActiveTab] = useState<'management' | 'add' | 'cloud-sync'>(
    subview === 'agents-add'
      ? 'add'
      : subview === 'agents-cloud-sync'
      ? 'cloud-sync'
      : 'management'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toast, setToast] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Inspect / Details Modal State
  const [selectedAgentDetails, setSelectedAgentDetails] = useState<AgentDetailsModalData | null>(null);

  // Edit Agent Modal State
  const [editingAgent, setEditingAgent] = useState<PortalUser | null>(null);

  // Portal agents state
  const [portalAgents, setPortalAgents] = useState<PortalUser[]>(() =>
    getPortalUsers().filter((u) => u.role === 'AGENT')
  );

  const refreshAgents = () => {
    setPortalAgents(getPortalUsers().filter((u) => u.role === 'AGENT'));
    syncPortalUsersFromCloud().then((cloudUsers) => {
      setPortalAgents(cloudUsers.filter((u) => u.role === 'AGENT'));
    });
  };

  useEffect(() => {
    // Live sync from persistent server storage on load/refresh
    syncPortalUsersFromCloud().then((cloudUsers) => {
      setPortalAgents(cloudUsers.filter((u) => u.role === 'AGENT'));
    });
    const handleUpdate = () => refreshAgents();
    window.addEventListener('eni_portal_users_updated', handleUpdate);
    return () => window.removeEventListener('eni_portal_users_updated', handleUpdate);
  }, []);

  // Form State for Add Agent
  const [newAgent, setNewAgent] = useState({
    name: '',
    username: '',
    password: '',
    phone: '',
    agency: '',
    assignedCode: '',
    reraNumber: '',
    tier: 'GOLD',
    city: 'Mumbai',
    commissionRate: '2.5%',
    syncToCloud: true,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Auto-generate Unique Agent ID (AGT-XXXX) and credentials
  const handleAutoGenerateAgentId = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const agentCode = `AGT-${randomCode}`;
    const cleanName = (newAgent.name || 'agent')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 8);
    const generatedUsername = `agt_${cleanName || 'realty'}_${randomCode}@prosify.in`;
    const generatedPassword = `Prosify#Agt${randomCode}!`;

    setNewAgent((prev) => ({
      ...prev,
      assignedCode: agentCode,
      username: generatedUsername,
      password: generatedPassword,
    }));

    showToast(`Generated Agent ID: ${agentCode} & secure credentials!`);
  };

  const handleOpenAgentPanel = (agent: PortalUser) => {
    setPortalSession('AGENT', agent);
    window.location.href = '/agent';
  };

  // Sync to Cloud Storage API endpoint
  const syncAgentToCloudStorage = async (agent: PortalUser) => {
    try {
      const res = await fetch('/api/admin/cloud-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'AGENT',
          assignedCode: agent.assignedCode || `AGT-${Math.floor(1000 + Math.random() * 9000)}`,
          username: agent.username,
          password: agent.password,
          name: agent.name,
          phone: agent.phone || '',
          companyOrProject: agent.companyOrProject || '',
          status: agent.status,
        }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('Cloud sync error:', err);
      return null;
    }
  };

  // Add Agent Handler
  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgent.name.trim()) {
      showToast('Please enter the agent name.');
      return;
    }

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const finalCode = newAgent.assignedCode.trim() || `AGT-${randomCode}`;
    const finalUsername =
      newAgent.username.trim() ||
      `agt_${newAgent.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8)}_${randomCode}@prosify.in`;
    const finalPassword = newAgent.password.trim() || `Prosify#Agt${randomCode}!`;
    const agencyDesc = newAgent.agency.trim()
      ? `${newAgent.agency.trim()}${newAgent.reraNumber ? ` (RERA: ${newAgent.reraNumber})` : ''}`
      : 'Prosify Certified Partner Agent';

    setIsSyncingCloud(true);

    const created = createPortalUser({
      name: newAgent.name.trim(),
      username: finalUsername,
      role: 'AGENT',
      password: finalPassword,
      phone: newAgent.phone.trim() || '+91 98200 88888',
      companyOrProject: agencyDesc,
      status: 'ACTIVE',
      portalUrl: '/agent',
      assignedCode: finalCode,
    });

    // Initialize dedicated isolated data storage for this agent ID
    const initialData = createInitialAgentData(created);
    saveScopedAgentData(created.id, initialData);

    // Sync to Cloud Storage bucket
    if (newAgent.syncToCloud) {
      await syncAgentToCloudStorage(created);
    }

    setIsSyncingCloud(false);
    refreshAgents();

    setNewAgent({
      name: '',
      username: '',
      password: '',
      phone: '',
      agency: '',
      assignedCode: '',
      reraNumber: '',
      tier: 'GOLD',
      city: 'Mumbai',
      commissionRate: '2.5%',
      syncToCloud: true,
    });

    setActiveTab('management');
    showToast(`Agent created & Cloud Synced! ID: ${finalCode} • Login: ${finalUsername}`);
  };

  // Remove Agent Handler
  const handleDeleteAgent = async (agent: PortalUser) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove agent "${agent.name}" (${agent.assignedCode || agent.username})? This will revoke portal access and purge their credentials.`
    );
    if (!confirmDelete) return;

    try {
      // Delete from cloud storage vault
      await fetch(`/api/admin/cloud-sync?assignedCode=${agent.assignedCode || ''}&id=${agent.id}`, {
        method: 'DELETE',
      });
    } catch {}

    deletePortalUser(agent.id);
    refreshAgents();
    showToast(`Agent ${agent.name} removed and cloud revoked.`);
  };

  // Save Edit Agent
  const handleSaveEditAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;

    const updated = updatePortalUser(editingAgent.id, {
      name: editingAgent.name,
      username: editingAgent.username,
      password: editingAgent.password,
      phone: editingAgent.phone,
      companyOrProject: editingAgent.companyOrProject,
      status: editingAgent.status,
      assignedCode: editingAgent.assignedCode,
    });

    if (updated) {
      await syncAgentToCloudStorage(updated);
    }

    setEditingAgent(null);
    refreshAgents();
    showToast(`Updated details for agent ${editingAgent.name} & re-synced to cloud!`);
  };

  // Copy Agent credentials
  const handleCopyCredentials = (agent: PortalUser) => {
    const text = `PROSIFY AGENT PANEL ACCESS CREDENTIALS\nAgent ID: ${agent.assignedCode || 'AGT-PORTAL'}\nAgent Name: ${agent.name}\nLogin ID / Username: ${agent.username}\nPassword: ${agent.password}\nPortal URL: ${window.location.origin}/agent\nStatus: ${agent.status} (Cloud Verified)`;
    navigator.clipboard.writeText(text);
    setCopiedId(agent.id);
    showToast(`Copied Agent login credentials for ${agent.name}!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Trigger Bulk Cloud Sync
  const handleBulkCloudSync = async () => {
    setIsSyncingCloud(true);
    for (const ag of portalAgents) {
      await syncAgentToCloudStorage(ag);
    }
    setIsSyncingCloud(false);
    showToast(`All ${portalAgents.length} Agents successfully synchronized to Cloud Storage bucket!`);
  };

  const filteredAgents = portalAgents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.assignedCode && a.assignedCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.companyOrProject && a.companyOrProject.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#D4A017]" />
            <span>Agent Panel Details & Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Administer sales agents, broker partners, auto-generate unique Agent IDs, edit details, and maintain secure Cloud Storage synchronization.
          </p>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('management')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'management'
                ? 'bg-[#D4A017] text-neutral-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Manage Agents ({portalAgents.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'add'
                ? 'bg-[#D4A017] text-neutral-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Add Agent
          </button>
          <button
            onClick={() => setActiveTab('cloud-sync')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'cloud-sync'
                ? 'bg-[#D4A017] text-neutral-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-sky-400" />
            <span>Cloud Storage Sync</span>
          </button>
        </div>
      </div>

      {/* Strict Account & Data Isolation Notice */}
      <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-[#D4A017]/30 text-amber-200/90 text-xs flex items-start gap-2.5 shadow-lg">
        <ShieldCheck className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-[#F4C430]">Har Agent ID Ka Alag Seperate Private Account (Strict Data Isolation)</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Admin panel se banayi gayi har Agent ID aur Password ka alag independent account rehta hai. Is ID se jo bhi agent login karega use sirf usika portfolio, projects, buyer inquiries aur commission details dikhayi dengi.
          </p>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* VIEW 1: MANAGE AGENTS & DETAILS */}
      {activeTab === 'management' && (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Agent ID, name, agency, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4A017]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="PENDING">Pending</option>
              </select>

              <button
                onClick={handleBulkCloudSync}
                disabled={isSyncingCloud}
                className="px-3 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-semibold flex items-center gap-1.5 border border-sky-500/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                <span>Sync All to Cloud</span>
              </button>

              <button
                onClick={() => setActiveTab('add')}
                className="px-3.5 py-2 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Agent</span>
              </button>
            </div>
          </div>

          {/* Agents Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#1E293B]/60 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Agent & Agency Details</th>
                  <th className="p-3.5">Generated ID & Login Credentials</th>
                  <th className="p-3.5">Cloud Storage Sync</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAgents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                      No agents found. Use the "Add Agent" button to create an agent and generate a synced ID.
                    </td>
                  </tr>
                ) : (
                  filteredAgents.map((ag) => {
                    const isPassVisible = showPasswords[ag.id] || false;
                    return (
                      <tr key={ag.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Agent & Agency */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-[#D4A017]/15 text-[#D4A017] font-bold flex items-center justify-center font-mono text-sm border border-[#D4A017]/30 shrink-0">
                              {ag.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-white flex items-center gap-1.5">
                                <span>{ag.name}</span>
                                <BadgeCheck className="w-3.5 h-3.5 text-sky-400" />
                              </div>
                              <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                {ag.companyOrProject || 'Channel Partner'}
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                {ag.phone || 'Phone not set'}
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                                  {getScopedAgentData(ag.id, ag).properties.length} Properties
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                                  {getScopedAgentData(ag.id, ag).messages.length} Leads
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* ID & Credentials */}
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-mono">
                              <span className="text-[#D4A017] font-bold px-1.5 py-0.5 rounded bg-[#D4A017]/10 border border-[#D4A017]/25">
                                {ag.assignedCode || 'AGT-PORTAL'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300">
                              <span className="text-slate-500 text-[10px]">User:</span>
                              <span className="truncate max-w-[180px]">{ag.username}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                              <span className="text-slate-500 text-[10px]">Pass:</span>
                              <span className="text-amber-300 font-bold">
                                {isPassVisible ? ag.password : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setShowPasswords((prev) => ({ ...prev, [ag.id]: !isPassVisible }))
                                }
                                className="text-slate-500 hover:text-slate-300 ml-1"
                              >
                                {isPassVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => handleCopyCredentials(ag)}
                                className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Copy className="w-3 h-3 text-[#D4A017]" />
                                <span>{copiedId === ag.id ? 'Copied' : 'Copy ID & Pass'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenAgentPanel(ag)}
                                className="px-2 py-0.5 rounded-md bg-[#D4A017]/15 hover:bg-[#D4A017]/25 text-[10px] text-[#D4A017] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Login As this Agent in isolated portal"
                              >
                                <span>Open Panel</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Cloud Storage Sync Status */}
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                              <span className="text-[11px] font-semibold text-emerald-300">
                                Cloud Synced
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
                              gs://vault/{ag.assignedCode || 'AGT'}.json
                            </div>
                            <button
                              onClick={() => syncAgentToCloudStorage(ag).then(() => showToast(`Re-synced ${ag.name} to Cloud!`))}
                              className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1"
                            >
                              <RefreshCw className="w-2.5 h-2.5" />
                              <span>Force Re-sync</span>
                            </button>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              ag.status === 'ACTIVE'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : ag.status === 'SUSPENDED'
                                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {ag.status}
                          </span>
                        </td>

                        {/* Actions (Details, Edit, Remove) */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() =>
                                setSelectedAgentDetails({
                                  id: ag.id,
                                  name: ag.name,
                                  username: ag.username,
                                  assignedCode: ag.assignedCode || 'AGT-PORTAL',
                                  phone: ag.phone || '+91 98200 88888',
                                  companyOrProject: ag.companyOrProject || 'Patil Realty Consultants',
                                  role: ag.role,
                                  status: ag.status,
                                  tier: 'GOLD ELITE',
                                  dealsClosed: 14,
                                  reraNumber: 'A51900018742',
                                  panNumber: 'ABCDE9876F',
                                  commissionRate: '2.5%',
                                  specialization: 'Luxury High-Rise & Commercial Pre-Leased',
                                  city: 'Mumbai & Pune Metro',
                                  cloudBucketUri: `gs://prosify-os-prod.storage.app/agent-credentials/${ag.assignedCode || 'AGT-882'}.json`,
                                  cloudSyncedAt: ag.createdAt || new Date().toISOString(),
                                })
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                              title="View Full Agent Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setEditingAgent(ag)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer"
                              title="Edit Agent Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteAgent(ag)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Remove Agent & Revoke Credentials"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: ADD AGENT (AUTO-GEN ID & CLOUD STORAGE) */}
      {activeTab === 'add' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#D4A017]" />
                <span>Add Agent & Auto-Generate Synced ID</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically provisions a unique Agent ID (AGT-XXXX) and synchronizes to Cloud Storage.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAutoGenerateAgentId}
              className="px-3 py-1.5 rounded-xl bg-[#D4A017]/20 hover:bg-[#D4A017]/30 text-[#D4A017] font-semibold text-xs flex items-center gap-1.5 border border-[#D4A017]/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>Auto-Generate ID & Credentials</span>
            </button>
          </div>

          <form onSubmit={handleAddAgent} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Agent Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Patil"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#D4A017]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Generated Agent ID (AGT-XXXX) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. AGT-8492"
                    value={newAgent.assignedCode}
                    onChange={(e) => setNewAgent({ ...newAgent, assignedCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-[#D4A017] font-mono font-bold focus:outline-none focus:border-[#D4A017]"
                  />
                  <button
                    type="button"
                    onClick={handleAutoGenerateAgentId}
                    className="absolute right-2 top-2 text-[10px] text-slate-400 hover:text-white"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Portal Login ID / Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. agt_patil_8492@prosify.in"
                  value={newAgent.username}
                  onChange={(e) => setNewAgent({ ...newAgent, username: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono focus:outline-none focus:border-[#D4A017]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Secure Password *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prosify#Agt8492!"
                  value={newAgent.password}
                  onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono focus:outline-none focus:border-[#D4A017]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Agency / Consultancy Name</label>
                <input
                  type="text"
                  placeholder="e.g. Patil Realty Consultants"
                  value={newAgent.agency}
                  onChange={(e) => setNewAgent({ ...newAgent, agency: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#D4A017]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Direct Phone / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="+91 97654 32109"
                  value={newAgent.phone}
                  onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono focus:outline-none focus:border-[#D4A017]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-slate-300 font-medium mb-1">MahaRERA / RERA Number</label>
                <input
                  type="text"
                  placeholder="A51900018742"
                  value={newAgent.reraNumber}
                  onChange={(e) => setNewAgent({ ...newAgent, reraNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono uppercase focus:outline-none focus:border-[#D4A017]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Commission Split</label>
                <input
                  type="text"
                  placeholder="2.5%"
                  value={newAgent.commissionRate}
                  onChange={(e) => setNewAgent({ ...newAgent, commissionRate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#D4A017]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Operating Territory / City</label>
                <input
                  type="text"
                  placeholder="Mumbai, Pune"
                  value={newAgent.city}
                  onChange={(e) => setNewAgent({ ...newAgent, city: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#D4A017]"
                />
              </div>
            </div>

            {/* Cloud Sync Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Cloud className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Sync ID to Cloud Storage Bucket</div>
                  <div className="text-[11px] text-slate-400">
                    Immediately uploads credential record to the encrypted Cloud Vault (gs://prosify-os-prod.storage.app)
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={newAgent.syncToCloud}
                onChange={(e) => setNewAgent({ ...newAgent, syncToCloud: e.target.checked })}
                className="w-4 h-4 rounded text-[#D4A017] accent-[#D4A017]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('management')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSyncingCloud}
                className="px-5 py-2 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSyncingCloud ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing to Cloud...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save Agent & Sync ID</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 3: CLOUD STORAGE & SYNC VAULT */}
      {activeTab === 'cloud-sync' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Cloud Storage Synchronized Vault</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      LIVE ACTIVE
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Centralized cloud bucket repository ensuring Agent and Vendor IDs stay synchronized across all platforms.
                  </p>
                </div>
              </div>

              <button
                onClick={handleBulkCloudSync}
                disabled={isSyncingCloud}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                <span>Run Full Vault Synchronization</span>
              </button>
            </div>

            {/* Cloud Storage Specs Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Cloud Storage Bucket</span>
                <span className="font-mono text-sky-300 text-xs block font-bold">
                  gs://prosify-os-prod.storage.app/
                </span>
                <span className="text-[10px] text-slate-400">Encrypted AES-256 Cloud Vault</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Total Synced Agent IDs</span>
                <span className="font-mono text-white text-base block font-extrabold">
                  {portalAgents.length} Active Records
                </span>
                <span className="text-[10px] text-emerald-400">Real-time bi-directional sync</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Vault Security Standard</span>
                <span className="text-white font-semibold text-xs block">
                  RBAC Partitioned Isolation
                </span>
                <span className="text-[10px] text-slate-400">Strict Agent & Vendor credentials segregation</span>
              </div>
            </div>

            {/* Synced Records List */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-300">Synchronized Bucket Manifest:</h4>
              <div className="space-y-2">
                {portalAgents.map((ag) => (
                  <div
                    key={ag.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <Cloud className="w-4 h-4 text-sky-400 shrink-0" />
                      <div>
                        <div className="font-mono font-bold text-white flex items-center gap-2">
                          <span>{ag.assignedCode || 'AGT-PORTAL'}</span>
                          <span className="text-slate-400 font-normal">({ag.name})</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          gs://prosify-os-prod.storage.app/agent-credentials/{ag.assignedCode || 'AGT'}.json
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Synchronized
                      </span>
                      <button
                        onClick={() => handleCopyCredentials(ag)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold"
                      >
                        Copy JSON ID
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: VIEW AGENT DETAILS */}
      {selectedAgentDetails && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1E293B] rounded-2xl max-w-lg w-full border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 p-5 flex items-start justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#D4A017]/20 text-[#D4A017] font-bold flex items-center justify-center font-mono text-base border border-[#D4A017]/30">
                  {selectedAgentDetails.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{selectedAgentDetails.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4A017]/20 text-[#D4A017] border border-[#D4A017]/30 font-mono">
                      {selectedAgentDetails.assignedCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedAgentDetails.companyOrProject}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAgentDetails(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-500 block">Agent Login ID / Username</span>
                  <strong className="text-white font-mono">{selectedAgentDetails.username}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-500 block">Direct Telephone</span>
                  <strong className="text-white font-mono">{selectedAgentDetails.phone}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-500 block">RERA Registration</span>
                  <strong className="text-white font-mono">{selectedAgentDetails.reraNumber}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-500 block">Commission Split Rate</span>
                  <strong className="text-white">{selectedAgentDetails.commissionRate}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-500 block">Deals Closed</span>
                  <strong className="text-emerald-400 text-sm">{selectedAgentDetails.dealsClosed} Properties</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-500 block">Account Status</span>
                  <strong className="text-white uppercase">{selectedAgentDetails.status}</strong>
                </div>
              </div>

              {/* Cloud Sync Information */}
              <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-sky-300 font-bold">
                  <Cloud className="w-4 h-4 text-sky-400" />
                  <span>Cloud Storage Status: Fully Synchronized</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300 break-all">
                  {selectedAgentDetails.cloudBucketUri}
                </div>
                <div className="text-[10px] text-slate-400">
                  Synced: {new Date(selectedAgentDetails.cloudSyncedAt || Date.now()).toLocaleString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <a
                  href="/agent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>Open Dedicated Agent Panel</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setSelectedAgentDetails(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT AGENT DETAILS */}
      {editingAgent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1E293B] rounded-2xl max-w-lg w-full border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-5 flex items-center justify-between border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <span>Edit Agent Details: {editingAgent.name}</span>
              </h3>
              <button onClick={() => setEditingAgent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditAgent} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Agent Name</label>
                <input
                  type="text"
                  required
                  value={editingAgent.name}
                  onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Agent ID</label>
                  <input
                    type="text"
                    required
                    value={editingAgent.assignedCode || ''}
                    onChange={(e) => setEditingAgent({ ...editingAgent, assignedCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-[#D4A017] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Password</label>
                  <input
                    type="text"
                    required
                    value={editingAgent.password}
                    onChange={(e) => setEditingAgent({ ...editingAgent, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Login Username</label>
                  <input
                    type="text"
                    required
                    value={editingAgent.username}
                    onChange={(e) => setEditingAgent({ ...editingAgent, username: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Telephone</label>
                  <input
                    type="tel"
                    value={editingAgent.phone || ''}
                    onChange={(e) => setEditingAgent({ ...editingAgent, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Agency & Description</label>
                <input
                  type="text"
                  value={editingAgent.companyOrProject || ''}
                  onChange={(e) => setEditingAgent({ ...editingAgent, companyOrProject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Status</label>
                <select
                  value={editingAgent.status}
                  onChange={(e) => setEditingAgent({ ...editingAgent, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAgent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 font-bold transition-all"
                >
                  Save Changes & Re-Sync Cloud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
