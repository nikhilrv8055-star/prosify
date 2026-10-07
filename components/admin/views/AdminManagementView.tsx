'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { AdminRole } from '../AdminNavbar';

interface AdminUserRecord {
  id: string;
  name: string;
  username: string;
  email: string;
  role: AdminRole;
  status: 'ACTIVE' | 'LOCKED';
  lastLogin: string;
}

interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
  isEnabled: boolean;
}

const INITIAL_ADMINS: AdminUserRecord[] = [
  {
    id: 'adm-root',
    name: 'Super Administrator',
    username: 'admin',
    email: 'admin@prosify.in',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    lastLogin: 'Active Now',
  },
];

const INITIAL_LANGUAGES: LanguageItem[] = [
  { code: 'en', name: 'English (Indian Business)', nativeName: 'English', isDefault: true, isEnabled: true },
  { code: 'hi', name: 'Hindi', nativeName: 'Hindi', isDefault: false, isEnabled: true },
  { code: 'mr', name: 'Marathi (Maharashtra State)', nativeName: 'Marathi', isDefault: false, isEnabled: true },
  { code: 'gu', name: 'Gujarati', nativeName: 'Gujarati', isDefault: false, isEnabled: true },
];

export function AdminManagementView({ subview = 'admin-roles' }: { subview?: string }) {
  const [admins, setAdmins] = useState<AdminUserRecord[]>(INITIAL_ADMINS);
  const [languages, setLanguages] = useState<LanguageItem[]>(INITIAL_LANGUAGES);
  const [activeTab, setActiveTab] = useState<'roles' | 'admins' | 'languages'>(
    subview === 'admin-users' ? 'admins' : subview === 'admin-languages' ? 'languages' : 'roles'
  );

  const [toast, setToast] = useState<string | null>(null);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    username: '',
    email: '',
    role: 'ADMIN' as AdminRole,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.username.trim() || !newAdmin.email.trim()) return;

    const adm: AdminUserRecord = {
      id: `adm-${Date.now()}`,
      name: newAdmin.name || newAdmin.username,
      username: newAdmin.username.toLowerCase(),
      email: newAdmin.email,
      role: newAdmin.role,
      status: 'ACTIVE',
      lastLogin: 'Never',
    };

    setAdmins([...admins, adm]);
    setIsAddAdminOpen(false);
    setNewAdmin({ name: '', username: '', email: '', role: 'ADMIN' });
    showToast(`New admin profile created for ${adm.name}`);
  };

  const handleDeleteAdmin = (id: string) => {
    if (id === 'adm-1') {
      showToast('Cannot delete Root Super Administrator.');
      return;
    }
    setAdmins(admins.filter((a) => a.id !== id));
    showToast('Admin user revoked.');
  };

  const handleToggleLanguage = (code: string) => {
    setLanguages(
      languages.map((l) => (l.code === code ? { ...l, isEnabled: !l.isEnabled } : l))
    );
    showToast('Language localization toggled.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span>Admin Management & Governance</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage granular RBAC roles & permissions, administrative operators, and multi-language localizations.
          </p>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'roles' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Role & Permissions
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'admins' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Registered Admins ({admins.length})
          </button>
          <button
            onClick={() => setActiveTab('languages')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'languages' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Language Management
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* VIEW 1: ROLES & PERMISSIONS */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#1E293B]/80 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Level 0 (Root)
                </span>
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Super Administrator</h3>
              <p className="text-xs text-slate-400">
                Unrestricted access to all 18 modules, developer push tokens, financial payouts, and user management.
              </p>
              <div className="text-[11px] font-mono text-emerald-400">18 / 18 Modules Allowed</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#1E293B]/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  Level 1
                </span>
                <UserCheck className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Operations Admin</h3>
              <p className="text-xs text-slate-400">
                Can manage properties, master projects, channel partners, and vendor developer listings.
              </p>
              <div className="text-[11px] font-mono text-blue-400">14 / 18 Modules Allowed</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#1E293B]/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  Regulatory
                </span>
                <Lock className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-sm font-bold text-white">RERA Compliance Auditor</h3>
              <p className="text-xs text-slate-400">
                Verifies title documents, MahaRERA certificates, compliance audit logs, and developer credentials.
              </p>
              <div className="text-[11px] font-mono text-purple-400">9 / 18 Modules Allowed</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#1E293B]/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Treasury
                </span>
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Finance & Payouts Officer</h3>
              <p className="text-xs text-slate-400">
                Executes TDS Section 194H calculations, broker RTGS disbursements, and financial auditing.
              </p>
              <div className="text-[11px] font-mono text-emerald-400">7 / 18 Modules Allowed</div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: REGISTERED ADMINS */}
      {activeTab === 'admins' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsAddAdminOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Admin User</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#1E293B]/60 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Administrator</th>
                  <th className="p-3.5">Username</th>
                  <th className="p-3.5">Assigned Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Last Active</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {admins.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{a.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{a.email}</div>
                    </td>
                    <td className="p-3.5 font-mono text-amber-400">{a.username}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {a.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono">{a.lastLogin}</td>
                    <td className="p-3.5 text-right">
                      {a.id !== 'adm-1' && (
                        <button
                          onClick={() => handleDeleteAdmin(a.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: LANGUAGES */}
      {activeTab === 'languages' && (
        <div className="space-y-4 max-w-2xl">
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#1E293B]/60 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Language</th>
                  <th className="p-3.5">ISO Code</th>
                  <th className="p-3.5">Script</th>
                  <th className="p-3.5">Default</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {languages.map((l) => (
                  <tr key={l.code} className="hover:bg-slate-800/40">
                    <td className="p-3.5 font-bold text-white">{l.name}</td>
                    <td className="p-3.5 font-mono text-amber-400 uppercase">{l.code}</td>
                    <td className="p-3.5 text-slate-300 font-semibold">{l.nativeName}</td>
                    <td className="p-3.5">
                      {l.isDefault ? (
                        <span className="text-[10px] font-bold text-emerald-400">YES</span>
                      ) : (
                        <span className="text-[10px] text-slate-500">NO</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleToggleLanguage(l.code)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          l.isEnabled
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {l.isEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE ADMIN MODAL */}
      {isAddAdminOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>Create New Admin Operator</span>
            </h3>

            <form onSubmit={handleCreateAdmin} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Operator Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunil Gavaskar"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Username (Login ID)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. sunilg"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Official Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="sunil@prosify.in"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Assigned Administrative Role</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                >
                  <option value="ADMIN">Operations Admin</option>
                  <option value="SALES_MANAGER">CRM & Sales Director</option>
                  <option value="FINANCE_OFFICER">Finance & Payouts Officer</option>
                  <option value="COMPLIANCE_OFFICER">RERA Compliance Auditor</option>
                  <option value="SUPER_ADMIN">Super Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddAdminOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
