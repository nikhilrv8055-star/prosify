'use client';

import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Shield,
  UserCheck,
  UserX,
  PlusCircle,
  Search,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Building,
  Briefcase,
  Users,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  PortalUser,
  PortalRole,
  getPortalUsers,
  syncPortalUsersFromCloud,
  createPortalUser,
  updatePortalUserPassword,
  updatePortalUserStatus,
  deletePortalUser,
} from '@/lib/auth/portalUsers';

export function PortalAccessTab() {
  const [users, setUsers] = useState<PortalUser[]>(() => getPortalUsers());
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit Password Modal State
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PortalUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Create User Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    username: '',
    role: 'VENDOR' as PortalRole,
    password: '',
    phone: '',
    companyOrProject: '',
  });

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleAutoGenerateCredentials = () => {
    const code = Math.floor(100 + Math.random() * 900);
    const cleanRole = createForm.role.toLowerCase();
    const generatedId = `${cleanRole}_${code}@prosify.in`;
    const generatedPassword = `Prosify#${createForm.role.slice(0, 3)}${code}!`;
    setCreateForm((prev) => ({
      ...prev,
      username: generatedId,
      password: generatedPassword,
      name: prev.name || `${createForm.role === 'VENDOR' ? 'Vendor Enterprise' : createForm.role === 'AGENT' ? 'Senior Channel Partner' : 'Portal User'} #${code}`,
    }));
  };

  const refreshUsers = () => {
    setUsers(getPortalUsers());
  };

  useEffect(() => {
    // 1. Fetch live from cloud API to sync any IDs created on other devices
    syncPortalUsersFromCloud().then((cloudUsers) => {
      setUsers(cloudUsers);
    });

    const handleUpdate = () => {
      setUsers(getPortalUsers());
    };
    window.addEventListener('eni_portal_users_updated', handleUpdate);
    return () => window.removeEventListener('eni_portal_users_updated', handleUpdate);
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.companyOrProject && u.companyOrProject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.assignedCode && u.assignedCode.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const handleCopyCredentials = (user: PortalUser) => {
    const text = `Portal: ${window.location.origin}${user.portalUrl}\nUsername: ${user.username}\nPassword: ${user.password}\nRole: ${user.role} Portal`;
    navigator.clipboard.writeText(text);
    setCopiedId(user.id);
    setFeedbackMessage(`Copied credentials for ${user.name}`);
    setTimeout(() => {
      setCopiedId(null);
      setFeedbackMessage(null);
    }, 2500);
  };

  const handleOpenPasswordModal = (user: PortalUser) => {
    setSelectedUser(user);
    setNewPassword(user.password);
    setShowPassword(true);
    setPasswordModalOpen(true);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newPassword.trim()) return;

    updatePortalUserPassword(selectedUser.id, newPassword.trim());
    refreshUsers();
    setPasswordModalOpen(false);
    setFeedbackMessage(`Password updated successfully for ${selectedUser.name}!`);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleToggleStatus = (user: PortalUser) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    updatePortalUserStatus(user.id, nextStatus);
    refreshUsers();
    setFeedbackMessage(`${user.name} access is now ${nextStatus}`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.username || !createForm.password) return;

    let targetPortal = '/vendor';
    let codePrefix = 'VND';
    if (createForm.role === 'AGENT') {
      targetPortal = '/agent';
      codePrefix = 'AGT';
    } else if (createForm.role === 'CUSTOMER') {
      targetPortal = '/customer';
      codePrefix = 'CUST';
    } else if (createForm.role === 'ADMIN') {
      targetPortal = '/admin';
      codePrefix = 'ADM';
    }

    createPortalUser({
      name: createForm.name,
      username: createForm.username.toLowerCase(),
      role: createForm.role,
      password: createForm.password,
      phone: createForm.phone || '+91 98000 00000',
      companyOrProject: createForm.companyOrProject || `${createForm.role} Account`,
      status: 'ACTIVE',
      portalUrl: targetPortal,
      assignedCode: `${codePrefix}-${Math.floor(100 + Math.random() * 900)}`,
    });

    refreshUsers();
    setCreateModalOpen(false);
    setCreateForm({
      name: '',
      username: '',
      role: 'VENDOR',
      password: '',
      phone: '',
      companyOrProject: '',
    });
    setFeedbackMessage(`New ${createForm.role} account created and synced to Cloud Database! Accessible from any device.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const getRoleBadge = (role: PortalRole) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 w-fit">
            <Shield className="w-3.5 h-3.5" />
            Admin Panel
          </span>
        );
      case 'VENDOR':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30 flex items-center gap-1.5 w-fit">
            <Building className="w-3.5 h-3.5" />
            Vendor Panel
          </span>
        );
      case 'AGENT':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 flex items-center gap-1.5 w-fit">
            <Briefcase className="w-3.5 h-3.5" />
            Agent Panel
          </span>
        );
      case 'CUSTOMER':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1.5 w-fit">
            <Users className="w-3.5 h-3.5" />
            Customer Panel
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-6 rounded-2xl bg-[#1E293B] border border-slate-700 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#10B981]/20 text-[#10B981]">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Portal Access & Password Management Center
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                  Admin Authority
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Sabhi portals (Vendor, Agent, Customer) ke passwords aur access yahan Admin panel se set aur control kiye jaate hain. Ye portals public website me show nahi hote aur direct URL (/vendor, /agent, /customer) se hi open hote hain.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New User & Set Password</span>
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#1E293B]/80 border border-slate-700 backdrop-blur-md">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Portal Users</span>
          <span className="text-2xl font-black text-white mt-1 block">{users.length}</span>
          <span className="text-[11px] text-slate-500">Across 4 Separate Panels</span>
        </div>

        <div className="p-4 rounded-xl bg-[#1E293B]/80 border border-slate-700 backdrop-blur-md">
          <span className="text-[11px] font-semibold text-[#0EA5E9] uppercase tracking-wider block">Vendor Accounts</span>
          <span className="text-2xl font-black text-white mt-1 block">
            {users.filter((u) => u.role === 'VENDOR').length}
          </span>
          <span className="text-[11px] text-slate-400">Direct URL: <code className="text-[#0EA5E9]">/vendor</code></span>
        </div>

        <div className="p-4 rounded-xl bg-[#1E293B]/80 border border-slate-700 backdrop-blur-md">
          <span className="text-[11px] font-semibold text-[#F59E0B] uppercase tracking-wider block">Agent Accounts</span>
          <span className="text-2xl font-black text-white mt-1 block">
            {users.filter((u) => u.role === 'AGENT').length}
          </span>
          <span className="text-[11px] text-slate-400">Direct URL: <code className="text-[#F59E0B]">/agent</code></span>
        </div>

        <div className="p-4 rounded-xl bg-[#1E293B]/80 border border-slate-700 backdrop-blur-md">
          <span className="text-[11px] font-semibold text-[#10B981] uppercase tracking-wider block">Customer Accounts</span>
          <span className="text-2xl font-black text-white mt-1 block">
            {users.filter((u) => u.role === 'CUSTOMER').length}
          </span>
          <span className="text-[11px] text-slate-400">Direct URL: <code className="text-[#10B981]">/customer</code></span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user name, login username, company, or ID code..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'VENDOR', 'AGENT', 'CUSTOMER', 'ADMIN'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                roleFilter === role
                  ? 'bg-[#10B981] text-slate-950 shadow-md shadow-[#10B981]/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {role === 'ALL' ? 'All Roles' : `${role.charAt(0) + role.slice(1).toLowerCase()}s`}
            </button>
          ))}
        </div>
      </div>

      {/* User Credentials & Password Management Table */}
      <div className="rounded-2xl bg-[#1E293B]/90 backdrop-blur-md border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-700 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Portal / Role</th>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Login Username</th>
                <th className="py-3 px-4">Admin Password Control</th>
                <th className="py-3 px-4">Access Status</th>
                <th className="py-3 px-4">Direct Portal Link</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No users match the search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      {getRoleBadge(u.role)}
                      {u.assignedCode && (
                        <span className="text-[10px] font-mono text-slate-400 block mt-1">
                          ID: {u.assignedCode}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.companyOrProject}</div>
                      {u.phone && <div className="text-[10px] text-slate-500">{u.phone}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-xs text-[#0EA5E9] bg-slate-900/60 px-2 py-1 rounded border border-slate-800 w-fit">
                        {u.username}
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Created: {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="font-mono text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-amber-300 font-semibold">
                          {u.password}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenPasswordModal(u)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[#10B981] hover:text-emerald-300 text-[11px] font-bold border border-slate-700 transition-colors cursor-pointer"
                          title="Set / Change Password"
                        >
                          Change
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Controlled by Admin
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30'
                        }`}
                        title="Click to toggle Active / Suspended status"
                      >
                        {u.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <a
                        href={u.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-[#0EA5E9] hover:underline"
                        title="Open Portal in New Tab"
                      >
                        <span>{u.portalUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span className="text-[10px] text-slate-500 block">Hidden from public menu</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyCredentials(u)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Copy Full Login Credentials (URL, Username, Password)"
                        >
                          {copiedId === u.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenPasswordModal(u)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] font-bold text-[11px] border border-[#10B981]/30 transition-colors cursor-pointer"
                        >
                          Set Password
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Set / Change Password Modal */}
      {passwordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#1E293B] border border-slate-700 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Set User Password</h3>
                  <span className="text-xs text-slate-400">{selectedUser.name} ({selectedUser.role})</span>
                </div>
              </div>
              <button
                onClick={() => setPasswordModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block font-semibold">Portal Destination:</span>
                <div className="text-white font-mono">{window?.location?.origin || ''}{selectedUser.portalUrl}</div>
                <div className="text-slate-400 text-[11px]">Username: <strong className="text-white font-mono">{selectedUser.username}</strong></div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Password (Set by Admin)</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new secure password"
                    className="w-full px-3 py-2.5 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-[#10B981] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const randomPass = `${selectedUser.role.charAt(0) + selectedUser.role.slice(1).toLowerCase()}#${Math.floor(1000 + Math.random() * 9000)}`;
                    setNewPassword(randomPass);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Generate Strong Password
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20"
                >
                  Save & Apply Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Create New User Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#10B981]/20 text-[#10B981]">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Create Portal User & Set Password</h3>
                  <span className="text-xs text-slate-400">Admin Panel User Provisioning</span>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Portal / Role</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as PortalRole })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-semibold focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="VENDOR">Vendor Panel (/vendor)</option>
                    <option value="AGENT">Agent Panel (/agent)</option>
                    <option value="CUSTOMER">Customer Panel (/customer)</option>
                    <option value="ADMIN">Admin Panel (/admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name / Entity Name</label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="e.g. Ramesh Traders / Priya Sharma"
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">Credentials Provisioning</span>
                <button
                  type="button"
                  onClick={handleAutoGenerateCredentials}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-[11px] flex items-center gap-1 border border-emerald-500/30 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Auto-Generate ID & Password</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Login Username or Email</label>
                  <input
                    type="text"
                    required
                    value={createForm.username}
                    onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                    placeholder="e.g. vendor2@eni.com"
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Set Initial Password</label>
                  <input
                    type="text"
                    required
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder="e.g. Pass#2026"
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    placeholder="+91 98200 00000"
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company / Project / Booking</label>
                  <input
                    type="text"
                    value={createForm.companyOrProject}
                    onChange={(e) => setCreateForm({ ...createForm, companyOrProject: e.target.value })}
                    placeholder="e.g. Apex Supplies / Unit 502"
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                <span className="text-white font-semibold block">Notice:</span>
                The created user will strictly only have access to their designated portal ({createForm.role === 'VENDOR' ? '/vendor' : createForm.role === 'AGENT' ? '/agent' : createForm.role === 'CUSTOMER' ? '/customer' : '/admin'}). They cannot access the other portals.
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20"
                >
                  Create User & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
