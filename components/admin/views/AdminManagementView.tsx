'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  UserCheck,
  Languages,
  Plus,
  Trash2,
  Lock,
  Key,
  CheckCircle2,
  Search,
  BadgeCheck,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Sliders,
  Check,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  AdminAccount,
  AdminRoleType,
  ROLE_PRESET_MODULES,
} from '@/lib/data/serverAdminStaffDb';
import { ADMIN_NAV_GROUPS } from '../AdminSidebarAccordion';

interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
  isEnabled: boolean;
}

const INITIAL_LANGUAGES: LanguageItem[] = [
  { code: 'en', name: 'English (Indian Business)', nativeName: 'English', isDefault: true, isEnabled: true },
  { code: 'hi', name: 'Hindi', nativeName: 'Hindi', isDefault: false, isEnabled: true },
  { code: 'mr', name: 'Marathi (Maharashtra State)', nativeName: 'Marathi', isDefault: false, isEnabled: true },
  { code: 'gu', name: 'Gujarati', nativeName: 'Gujarati', isDefault: false, isEnabled: true },
];

export function AdminManagementView({ subview = 'admin-roles' }: { subview?: string }) {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [languages, setLanguages] = useState<LanguageItem[]>(INITIAL_LANGUAGES);
  const [activeTab, setActiveTab] = useState<'admins' | 'roles' | 'languages'>(
    subview === 'admin-users' ? 'admins' : subview === 'admin-languages' ? 'languages' : 'admins'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');

  // Add Admin Modal State
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newAdmin, setNewAdmin] = useState<{
    name: string;
    username: string;
    email: string;
    password: string;
    role: AdminRoleType;
    roleTitle: string;
    allowedGroups: string[];
    notes: string;
  }>({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'AFFILIATE_MANAGER',
    roleTitle: ROLE_PRESET_MODULES.AFFILIATE_MANAGER.roleTitle,
    allowedGroups: [...ROLE_PRESET_MODULES.AFFILIATE_MANAGER.groups],
    notes: '',
  });

  // Edit Admin Modal State
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);
  const [editShowPassword, setEditShowPassword] = useState(false);

  // Success Created Credentials Banner/Modal
  const [createdCredentials, setCreatedCredentials] = useState<{
    loginId: string;
    password: string;
    role: string;
    name: string;
  } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/staff', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.accounts)) {
        setAccounts(data.accounts);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch admin accounts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Update role presets when role changes in Create Form
  const handleRoleChange = (role: AdminRoleType) => {
    const preset = ROLE_PRESET_MODULES[role] || ROLE_PRESET_MODULES.CUSTOM;
    setNewAdmin((prev) => ({
      ...prev,
      role,
      roleTitle: preset.roleTitle,
      allowedGroups: role === 'SUPER_ADMIN' ? ['*'] : [...preset.groups],
    }));
  };

  // Toggle group checkbox for custom access
  const handleToggleGroupCheckbox = (groupId: string) => {
    setNewAdmin((prev) => {
      let updated: string[];
      if (prev.allowedGroups.includes('*')) {
        updated = ADMIN_NAV_GROUPS.map((g) => g.id).filter((id) => id !== groupId);
      } else if (prev.allowedGroups.includes(groupId)) {
        updated = prev.allowedGroups.filter((g) => g !== groupId);
      } else {
        updated = [...prev.allowedGroups, groupId];
      }
      return {
        ...prev,
        allowedGroups: updated,
        role: updated.length === ADMIN_NAV_GROUPS.length ? 'SUPER_ADMIN' : 'CUSTOM',
      };
    });
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const finalPass = `Prosify#${result}`;
    setNewAdmin((prev) => ({ ...prev, password: finalPass }));
    setShowPassword(true);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.username.trim() || !newAdmin.email.trim() || !newAdmin.password.trim()) {
      showToast('Name, Login ID, Email, and Password are required.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(data.message || 'Admin account created successfully!');
        setCreatedCredentials({
          loginId: newAdmin.username.trim().toLowerCase(),
          password: newAdmin.password.trim(),
          role: newAdmin.roleTitle,
          name: newAdmin.name.trim(),
        });
        setIsAddAdminOpen(false);
        setNewAdmin({
          name: '',
          username: '',
          email: '',
          password: '',
          role: 'AFFILIATE_MANAGER',
          roleTitle: ROLE_PRESET_MODULES.AFFILIATE_MANAGER.roleTitle,
          allowedGroups: [...ROLE_PRESET_MODULES.AFFILIATE_MANAGER.groups],
          notes: '',
        });
        await fetchAccounts();
      } else {
        showToast(data.error?.message || data.error || 'Failed to create admin user.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to connect to admin API.', 'error');
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    try {
      const res = await fetch('/api/admin/staff', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAdmin.id,
          name: editingAdmin.name,
          email: editingAdmin.email,
          password: editingAdmin.password,
          role: editingAdmin.role,
          roleTitle: editingAdmin.roleTitle,
          allowedGroups: editingAdmin.allowedGroups,
          status: editingAdmin.status,
          notes: editingAdmin.notes,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Admin account updated successfully!');
        setEditingAdmin(null);
        await fetchAccounts();
      } else {
        showToast(data.error?.message || data.error || 'Update failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Network error', 'error');
    }
  };

  const handleToggleStatus = async (account: AdminAccount) => {
    if (account.isRoot) {
      showToast('Root Super Administrator cannot be suspended.', 'error');
      return;
    }

    const nextStatus = account.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: account.id, status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Account is now ${nextStatus}`);
        await fetchAccounts();
      } else {
        showToast(data.error?.message || data.error || 'Failed to toggle status', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Network error', 'error');
    }
  };

  const handleDeleteAdmin = async (id: string, isRoot?: boolean) => {
    if (isRoot) {
      showToast('Cannot delete Root Super Administrator.', 'error');
      return;
    }
    if (!confirm('Are you sure you want to revoke and delete this admin user?')) return;

    try {
      const res = await fetch(`/api/admin/staff?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Admin account revoked and deleted.');
        await fetchAccounts();
      } else {
        showToast(data.error?.message || data.error || 'Failed to delete account', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Network error', 'error');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard!`);
    }
  };

  const copyFullCredentials = (account: AdminAccount) => {
    const text = `PROSIFY ADMIN ACCESS CREDENTIALS\n---------------------------------\nLogin URL: ${window.location.origin}/admin\nLogin ID / Username: ${account.username}\nEmail: ${account.email}\nPassword: ${account.password}\nAssigned Role: ${account.roleTitle}\nAccess Scope: ${account.allowedGroups.includes('*') ? 'All Modules (Unrestricted)' : account.allowedGroups.length + ' Allowed Modules'}\nStatus: ${account.status}`;
    copyToClipboard(text, 'Full credentials');
  };

  const filteredAccounts = accounts.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'ALL' || a.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-16 right-6 z-50 px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 border animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-800'
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-linear-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-neutral-800 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Shield className="w-4 h-4" />
            </div>
            <span>Admin Roles, Staff IDs & RBAC Access Control</span>
          </h2>
          <p className="text-xs text-neutral-400 max-w-2xl">
            Create unique Login IDs and Passwords for each staff member. Staff logging in will only see and access the exact modules authorized by the Main Administrator.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchAccounts}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh Directory"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsAddAdminOpen(true)}
            className="px-4 py-2 rounded-xl bg-linear-to-r from-[#D4A017] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs shadow-lg shadow-[#D4A017]/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Admin User / Staff ID</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('admins')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'admins'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Staff Accounts ({accounts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'roles'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Role Policy Definitions</span>
        </button>
        <button
          onClick={() => setActiveTab('languages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'languages'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          <Languages className="w-4 h-4" />
          <span>Languages ({languages.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ADMIN STAFF DIRECTORY & PASSWORDS                                  */}
      {/* ========================================================================= */}
      {activeTab === 'admins' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff by name, login ID, email, or role title..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="SUPER_ADMIN">Super Administrator</option>
                <option value="PROPERTY_MANAGER">Property Manager</option>
                <option value="CRM_SALES_MANAGER">CRM & Sales Director</option>
                <option value="AFFILIATE_MANAGER">Affiliate Manager</option>
                <option value="VENDOR_AGENT_MANAGER">Vendors & Agents</option>
                <option value="CONTENT_CMS_MANAGER">Content & CMS Editor</option>
                <option value="FINANCE_MANAGER">Finance Officer</option>
                <option value="CUSTOM">Custom Access</option>
              </select>
            </div>
          </div>

          {/* Accounts Table */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950/80 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Admin User / Staff</th>
                    <th className="py-3.5 px-4">Login ID & Email</th>
                    <th className="py-3.5 px-4">Assigned Role</th>
                    <th className="py-3.5 px-4">Authorized Access Scope</th>
                    <th className="py-3.5 px-4">Password</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredAccounts.map((account) => {
                    const isSuper = account.allowedGroups.includes('*');
                    const groupCount = isSuper ? ADMIN_NAV_GROUPS.length : account.allowedGroups.length;

                    return (
                      <tr key={account.id} className="hover:bg-neutral-800/30 transition-colors">
                        {/* Name */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-amber-400 text-xs shrink-0">
                              {account.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{account.name}</span>
                                {account.isRoot && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold uppercase">
                                    Root Super Admin
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-neutral-500">
                                Created: {account.createdAt ? account.createdAt.split('T')[0] : '2026-01-01'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Login ID & Email */}
                        <td className="py-4 px-4">
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 font-mono text-amber-400 font-bold text-xs">
                            <span>{account.username}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(account.username, 'Login ID')}
                              className="text-neutral-500 hover:text-white ml-1 cursor-pointer"
                              title="Copy Login ID"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-[11px] text-neutral-400 mt-1">{account.email}</div>
                        </td>

                        {/* Assigned Role */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                              account.role === 'SUPER_ADMIN'
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                : account.role === 'AFFILIATE_MANAGER'
                                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                                : account.role === 'CRM_SALES_MANAGER'
                                ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
                                : account.role === 'PROPERTY_MANAGER'
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                            }`}
                          >
                            {account.roleTitle}
                          </span>
                        </td>

                        {/* Access Scope */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs">
                              {isSuper ? 'All System Modules (Full)' : `${groupCount} Authorized Modules`}
                            </span>
                          </div>
                          <div className="text-[10px] text-neutral-500 mt-0.5 truncate max-w-xs">
                            {isSuper
                              ? 'Unconstrained access across all tabs'
                              : account.allowedGroups
                                  .map((g) => ADMIN_NAV_GROUPS.find((ag) => ag.id === g)?.label || g)
                                  .join(', ')}
                          </div>
                        </td>

                        {/* Password */}
                        <td className="py-4 px-4">
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-neutral-950 border border-neutral-800 font-mono text-xs text-neutral-300">
                            <span>••••••••</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(account.password, 'Password')}
                              className="text-neutral-400 hover:text-amber-400 ml-1 cursor-pointer transition-colors"
                              title="Copy Password"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              account.status === 'ACTIVE'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                            }`}
                          >
                            {account.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => copyFullCredentials(account)}
                              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="Copy Full Credentials Package"
                            >
                              <Copy className="w-3 h-3 text-amber-400" />
                              <span>Copy ID & Pass</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingAdmin(account);
                                setEditShowPassword(false);
                              }}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white cursor-pointer transition-colors"
                              title="Edit Access & Password"
                            >
                              <Key className="w-3.5 h-3.5 text-cyan-400" />
                            </button>

                            {!account.isRoot && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(account)}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                                    account.status === 'ACTIVE'
                                      ? 'bg-neutral-800 hover:bg-rose-950 text-neutral-400 hover:text-rose-400'
                                      : 'bg-emerald-500 hover:bg-emerald-600 text-neutral-950'
                                  }`}
                                >
                                  {account.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAdmin(account.id, account.isRoot)}
                                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 cursor-pointer transition-colors"
                                  title="Delete Account"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredAccounts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-neutral-500">
                        No admin accounts found matching your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ROLE DEFINITIONS & SCOPE REFERENCE                                */}
      {/* ========================================================================= */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(ROLE_PRESET_MODULES) as AdminRoleType[]).map((roleKey) => {
            const role = ROLE_PRESET_MODULES[roleKey];
            const isSuper = roleKey === 'SUPER_ADMIN';

            return (
              <div
                key={roleKey}
                className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      isSuper
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                    }`}
                  >
                    {roleKey}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 font-bold">
                    {isSuper ? 'All Modules' : `${role.groups.length} Modules`}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{role.roleTitle}</h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{role.description}</p>
                </div>

                <div className="pt-2 border-t border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1.5">
                    Authorized Sidebar Modules
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {isSuper ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        Unrestricted Full Access
                      </span>
                    ) : (
                      role.groups.map((g) => {
                        const grp = ADMIN_NAV_GROUPS.find((ag) => ag.id === g);
                        return (
                          <span
                            key={g}
                            className="px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 border border-neutral-800 text-[10px]"
                          >
                            {grp?.label || g}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LANGUAGES LOCALIZATION                                            */}
      {/* ========================================================================= */}
      {activeTab === 'languages' && (
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">System Languages</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Configure available languages for buyers and portal users</p>
            </div>
          </div>
          <div className="divide-y divide-neutral-800">
            {languages.map((l) => (
              <div key={l.code} className="p-4 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-sm">{l.name}</span>
                  <div className="text-xs text-neutral-500 font-mono">Code: {l.code} • Native: {l.nativeName}</div>
                </div>
                <div className="flex items-center gap-2">
                  {l.isDefault && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      Default
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      l.isEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {l.isEnabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE NEW ADMIN USER / STAFF ID WITH RBAC                        */}
      {/* ========================================================================= */}
      {isAddAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Admin User & Assign Role Access</h3>
                  <p className="text-xs text-neutral-400">Generate ID, Password, and select exact modules to authorize</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAdminOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              {/* Full Name & Login ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300 block">Staff Full Name *</label>
                  <input
                    type="text"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300 block">Login ID / Username *</label>
                  <input
                    type="text"
                    value={newAdmin.username}
                    onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    placeholder="e.g. rahul_sales"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="font-semibold text-neutral-300 block">Official Email Address *</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="e.g. rahul.sharma@prosify.in"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Password with Generator */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-neutral-300">Password *</label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Secure Password</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    placeholder="Set password for this admin"
                    className="w-full pl-3 pr-10 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1">
                <label className="font-semibold text-neutral-300 block">Assign Role Preset</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => handleRoleChange(e.target.value as AdminRoleType)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="SUPER_ADMIN">Super Administrator (Unrestricted All Access)</option>
                  <option value="PROPERTY_MANAGER">Property & Project Manager (Properties, Projects, Specs)</option>
                  <option value="CRM_SALES_MANAGER">CRM & Sales Director (Leads, Pipeline, Tickets, Reports)</option>
                  <option value="AFFILIATE_MANAGER">Affiliate Program Manager (Affiliates, Payouts, Conversions)</option>
                  <option value="VENDOR_AGENT_MANAGER">Vendors & Agents Director (Vendors, Agents, Portals)</option>
                  <option value="CONTENT_CMS_MANAGER">Content & CMS Editor (Homepage, Footer, Blogs, FAQs)</option>
                  <option value="FINANCE_MANAGER">Finance & Payouts Officer (Payments, Gateways, Payouts)</option>
                  <option value="CUSTOM">Custom Access (Select Specific Modules Below)</option>
                </select>
                <p className="text-[11px] text-neutral-400 mt-1">
                  {ROLE_PRESET_MODULES[newAdmin.role]?.description || 'Custom module permissions'}
                </p>
              </div>

              {/* Module Checkbox Permissions Grid */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 uppercase">
                    Authorized Sidebar Modules ({newAdmin.allowedGroups.includes('*') ? 'All' : newAdmin.allowedGroups.length})
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    Checked modules will be visible to this user
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-h-48 overflow-y-auto">
                  {ADMIN_NAV_GROUPS.map((group) => {
                    const isChecked = newAdmin.allowedGroups.includes('*') || newAdmin.allowedGroups.includes(group.id);

                    return (
                      <label
                        key={group.id}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleGroupCheckbox(group.id)}
                          className="rounded text-amber-500 focus:ring-0 cursor-pointer"
                        />
                        <span className="font-semibold truncate">{group.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAdminOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4A017] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold shadow-lg shadow-[#D4A017]/20 cursor-pointer"
                >
                  Create & Save Admin User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT ADMIN ACCESS & CHANGE PASSWORD                               */}
      {/* ========================================================================= */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Edit Admin Account: {editingAdmin.name}</h3>
                <p className="text-xs text-neutral-400">Login ID: <strong className="text-amber-400 font-mono">{editingAdmin.username}</strong></p>
              </div>
              <button
                type="button"
                onClick={() => setEditingAdmin(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateAdmin} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-300 block">Full Name</label>
                <input
                  type="text"
                  value={editingAdmin.name}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-300 block">Password</label>
                <div className="relative">
                  <input
                    type={editShowPassword ? 'text' : 'password'}
                    value={editingAdmin.password}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, password: e.target.value })}
                    className="w-full pl-3 pr-10 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setEditShowPassword(!editShowPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {editShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-300 block">Role Title</label>
                <input
                  type="text"
                  value={editingAdmin.roleTitle}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, roleTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  required
                />
              </div>

              {/* Module Checkbox Permissions Grid */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                <span className="text-[11px] font-bold text-amber-400 uppercase block">
                  Authorized Modules ({editingAdmin.allowedGroups.includes('*') ? 'All' : editingAdmin.allowedGroups.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {ADMIN_NAV_GROUPS.map((group) => {
                    const isChecked = editingAdmin.allowedGroups.includes('*') || editingAdmin.allowedGroups.includes(group.id);

                    return (
                      <label
                        key={group.id}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer ${
                          isChecked
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            let updated: string[];
                            if (editingAdmin.allowedGroups.includes('*')) {
                              updated = ADMIN_NAV_GROUPS.map((g) => g.id).filter((id) => id !== group.id);
                            } else if (editingAdmin.allowedGroups.includes(group.id)) {
                              updated = editingAdmin.allowedGroups.filter((g) => g !== group.id);
                            } else {
                              updated = [...editingAdmin.allowedGroups, group.id];
                            }
                            setEditingAdmin({ ...editingAdmin, allowedGroups: updated });
                          }}
                          className="rounded text-amber-500"
                        />
                        <span className="font-semibold truncate">{group.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CREDENTIALS CREATED CELEBRATION MODAL                             */}
      {/* ========================================================================= */}
      {createdCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="w-full max-w-md bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl p-6 relative text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Admin User Created Successfully!</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Share these login credentials with <strong className="text-white">{createdCredentials.name}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left space-y-2 text-xs">
              <div>
                <span className="text-neutral-500 block text-[10px]">Login URL</span>
                <span className="font-mono font-bold text-white text-[11px]">
                  {typeof window !== 'undefined' ? `${window.location.origin}/admin` : 'https://prosify.in/admin'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Login ID / Username</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{createdCredentials.loginId}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Password</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{createdCredentials.password}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Role / Access Level</span>
                <span className="font-bold text-white">{createdCredentials.role}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const text = `PROSIFY ADMIN ACCESS CREDENTIALS\n---------------------------------\nLogin URL: ${window.location.origin}/admin\nLogin ID: ${createdCredentials.loginId}\nPassword: ${createdCredentials.password}\nRole: ${createdCredentials.role}\nName: ${createdCredentials.name}`;
                  copyToClipboard(text, 'Credentials');
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Credentials Package</span>
              </button>
              <button
                type="button"
                onClick={() => setCreatedCredentials(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
