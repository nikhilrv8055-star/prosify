'use client';

import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Shield,
  KeyRound,
  Copy,
  Check,
  Send,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Building2,
  Briefcase,
  Users,
  Eye,
  EyeOff,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  UserCheck,
  UserX,
  Edit,
  Trash2,
} from 'lucide-react';
import { RbacUser, UserRole } from '@/lib/auth/rbacStore';

export function UserProvisioningSuite() {
  const [users, setUsers] = useState<RbacUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'VENDOR' | 'AGENT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Create User Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formRole, setFormRole] = useState<'VENDOR' | 'AGENT'>('VENDOR');
  const [formData, setFormData] = useState({
    name: '',
    businessOrAgencyName: '',
    email: '',
    phone: '',
    territory: 'Mumbai MMR',
    categoryOrRera: '',
    officialIdOrGst: '',
    customSecureId: '',
    password: '',
    requirePasswordChange: true,
  });

  const [provisionedSuccess, setProvisionedSuccess] = useState<{
    user: any;
    temporaryPassword: string;
  } | null>(null);

  // Edit / Password Reset Modal State
  const [resetModalUser, setResetModalUser] = useState<RbacUser | null>(null);
  const [newResetPassword, setNewResetPassword] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/provision-user');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to load provisioned users', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleGenerateIdAndPassword = () => {
    const code = Math.floor(1000 + Math.random() * 9000);
    const prefix = formRole === 'VENDOR' ? 'VEN' : 'AGT';
    const genId = `${prefix}-${code}`;
    const genPass = `${prefix.charAt(0) + prefix.slice(1).toLowerCase()}#${code}!Secure`;

    setFormData((prev) => ({
      ...prev,
      customSecureId: genId,
      password: genPass,
      name: prev.name || (formRole === 'VENDOR' ? `Vendor Partner ${code}` : `Sales Agent ${code}`),
      businessOrAgencyName:
        prev.businessOrAgencyName ||
        (formRole === 'VENDOR' ? `Enterprise Vendor Solutions ${code}` : `Realty Associates ${code}`),
      email: prev.email || `${genId.toLowerCase()}@prosify.in`,
      phone: prev.phone || `+91 98${code} 12345`,
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionFeedback(null);
    try {
      const res = await fetch('/api/admin/provision-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: formRole,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setActionFeedback(data.error || 'Failed to provision user');
        return;
      }

      setProvisionedSuccess({
        user: data.user,
        temporaryPassword: data.temporaryPassword,
      });

      fetchUsers();
    } catch (err: any) {
      setActionFeedback(err.message || 'Error creating user');
    }
  };

  const handleToggleStatus = async (user: RbacUser) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await fetch('/api/admin/provision-user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          action: 'toggle_status',
          status: newStatus,
        }),
      });
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleResetPasswordSubmit = async () => {
    if (!resetModalUser) return;
    try {
      const res = await fetch('/api/admin/provision-user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: resetModalUser.id,
          action: 'reset_password',
          newPassword: newResetPassword || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionFeedback(`Password reset! New credentials: ${data.temporaryPassword}`);
        setResetModalUser(null);
        setNewResetPassword('');
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to reset password', err);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSendWelcomeAlert = (user: any, pass: string) => {
    setActionFeedback(
      `✓ Welcome login credentials dispatched to ${user.email} and ${user.phone || 'mobile'} via SMS/Email dispatch simulator.`
    );
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.secureId.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.vendorProfile?.businessName && u.vendorProfile.businessName.toLowerCase().includes(q)) ||
      (u.agentProfile?.agencyName && u.agentProfile.agencyName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl p-6 sm:p-8 text-white border border-neutral-700 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Shield className="w-3.5 h-3.5" />
                Multi-Tenant RBAC Suite
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Isolated Private Portals
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Vendor & Agent Provisioning Suite
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Public self-registration is strictly disabled. Provision secure enterprise accounts with unique User IDs, initial temporary passwords, and mandatory first-login password enforcement.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setProvisionedSuccess(null);
                setIsCreateOpen(true);
              }}
              className="px-5 py-3 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#F4C430] hover:from-[#C5A880] hover:to-[#E5B520] text-neutral-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New Account</span>
            </button>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-neutral-700/60">
          <div className="bg-neutral-800/60 backdrop-blur-xs p-4 rounded-xl border border-neutral-700">
            <div className="text-xs text-neutral-400">Total Provisioned</div>
            <div className="text-2xl font-bold mt-1 text-white">{users.length}</div>
          </div>
          <div className="bg-neutral-800/60 backdrop-blur-xs p-4 rounded-xl border border-amber-500/30">
            <div className="text-xs text-amber-400">Active Vendors</div>
            <div className="text-2xl font-bold mt-1 text-amber-300">
              {users.filter((u) => u.role === 'VENDOR' && u.status === 'ACTIVE').length}
            </div>
          </div>
          <div className="bg-neutral-800/60 backdrop-blur-xs p-4 rounded-xl border border-emerald-500/30">
            <div className="text-xs text-emerald-400">Active Agents</div>
            <div className="text-2xl font-bold mt-1 text-emerald-300">
              {users.filter((u) => u.role === 'AGENT' && u.status === 'ACTIVE').length}
            </div>
          </div>
          <div className="bg-neutral-800/60 backdrop-blur-xs p-4 rounded-xl border border-sky-500/30">
            <div className="text-xs text-sky-400">Pending First Login</div>
            <div className="text-2xl font-bold mt-1 text-sky-300">
              {users.filter((u) => u.status === 'PENDING_FIRST_LOGIN').length}
            </div>
          </div>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span>{actionFeedback}</span>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-amber-700 hover:text-amber-950 ml-4 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Directory & Controls Table Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {(['ALL', 'VENDOR', 'AGENT'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  roleFilter === r
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {r === 'ALL' ? 'All Roles' : `${r}s`}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by ID, name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">User ID & Role</th>
                <th className="py-3 px-4">Name & Business / Agency</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Territory / Category</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions & Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-neutral-400" />
                    Loading provisioned accounts...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    No provisioned accounts found. Click &quot;Create New Account&quot; to onboard.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50/60 transition-colors">
                    {/* User ID & Role */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded text-xs">
                          {user.secureId}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            user.role === 'VENDOR'
                              ? 'bg-amber-100 text-amber-800'
                              : user.role === 'AGENT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-1 font-mono">
                        Portal: {user.role === 'VENDOR' ? '/vendor/login' : '/agent/login'}
                      </div>
                    </td>

                    {/* Name & Business */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900 text-xs">{user.name}</div>
                      <div className="text-neutral-500 text-[11px]">
                        {user.vendorProfile?.businessName || user.agentProfile?.agencyName || 'Central Entity'}
                      </div>
                      {user.vendorProfile?.gstNumber && (
                        <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          GST: {user.vendorProfile.gstNumber}
                        </div>
                      )}
                      {user.agentProfile?.reraNumber && (
                        <div className="text-[10px] text-emerald-700 font-mono mt-0.5 font-medium">
                          RERA: {user.agentProfile.reraNumber}
                        </div>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="text-neutral-800 font-mono text-[11px]">{user.phone}</div>
                      <div className="text-neutral-500 text-[11px]">{user.email}</div>
                    </td>

                    {/* Territory / Category */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-neutral-800 text-[11px]">
                        {user.vendorProfile?.territory || user.agentProfile?.territory || 'Maharashtra'}
                      </div>
                      <div className="text-neutral-400 text-[10px]">
                        {user.vendorProfile?.category || (user.agentProfile ? `Target: ₹${(user.agentProfile.monthlyTargetInr / 10000000).toFixed(1)} Cr` : 'System')}
                      </div>
                    </td>

                    {/* Account Status */}
                    <td className="py-3.5 px-4">
                      {user.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ACTIVE
                        </span>
                      ) : user.status === 'PENDING_FIRST_LOGIN' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <KeyRound className="w-3 h-3 text-amber-600" />
                          Pending First Login
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          SUSPENDED
                        </span>
                      )}
                    </td>

                    {/* Action Controls */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setResetModalUser(user);
                            setNewResetPassword('');
                          }}
                          title="Reset temporary password"
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(user)}
                          title={user.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            user.status === 'ACTIVE'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? (
                            <UserX className="w-3.5 h-3.5" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <a
                          href={user.role === 'VENDOR' ? '/vendor/login' : '/agent/login'}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open Private Portal Login"
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in"
        >
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-neutral-900 text-white p-6 relative">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                ×
              </button>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-2">
                <UserPlus className="w-3.5 h-3.5" />
                Administrative User Provisioning
              </div>
              <h3 className="text-xl font-bold tracking-tight">Onboard New Vendor or Agent</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Creates an authenticated enterprise profile with private route permissions.
              </p>
            </div>

            {provisionedSuccess ? (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Account Successfully Provisioned!
                  </div>
                  <p className="text-xs text-emerald-800 mt-1">
                    Please share these credentials with the partner. They will be required to change this temporary password upon first login.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 text-neutral-200 font-mono text-xs space-y-2 relative">
                  <div>
                    <span className="text-neutral-400">Portal Login URL: </span>
                    <span className="text-amber-400">{provisionedSuccess.user.loginUrl}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">User ID / Username: </span>
                    <span className="text-white font-bold">{provisionedSuccess.user.secureId}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Email: </span>
                    <span className="text-white">{provisionedSuccess.user.email}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Temporary Password: </span>
                    <span className="text-emerald-400 font-bold">{provisionedSuccess.temporaryPassword}</span>
                  </div>

                  <button
                    onClick={() =>
                      copyToClipboard(
                        `Prosify Private Portal Credentials:\nLogin URL: ${provisionedSuccess.user.loginUrl}\nUser ID: ${provisionedSuccess.user.secureId}\nEmail: ${provisionedSuccess.user.email}\nTemporary Password: ${provisionedSuccess.temporaryPassword}\nNote: Password change required on first login.`,
                        'copy_cred_success'
                      )
                    }
                    className="absolute top-3 right-3 p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-sans"
                  >
                    {copiedKey === 'copy_cred_success' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy All</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() =>
                      handleSendWelcomeAlert(
                        provisionedSuccess.user,
                        provisionedSuccess.temporaryPassword
                      )
                    }
                    className="flex-1 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Send Welcome SMS / Email</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsCreateOpen(false);
                      setProvisionedSuccess(null);
                    }}
                    className="py-3 px-5 rounded-xl border border-neutral-300 hover:bg-neutral-100 font-semibold text-xs text-neutral-700 transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateSubmit} className="p-6 sm:p-8 space-y-4">
                {/* Role Selector Tabs */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Select Account Role <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormRole('VENDOR')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        formRole === 'VENDOR'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-900 ring-2 ring-amber-500/30'
                          : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-amber-600" />
                      <span>Vendor / Service Provider</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormRole('AGENT')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        formRole === 'AGENT'
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/30'
                          : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <Briefcase className="w-4 h-4 text-emerald-600" />
                      <span>Field & Sales Agent</span>
                    </button>
                  </div>
                </div>

                {/* Auto-Generate Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleGenerateIdAndPassword}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer underline"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Auto-Fill Smart Credentials</span>
                  </button>
                </div>

                {/* Name & Business Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Varma"
                      className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      {formRole === 'VENDOR' ? 'Business / Company Name' : 'Agency Name'}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.businessOrAgencyName}
                      onChange={(e) =>
                        setFormData({ ...formData, businessOrAgencyName: e.target.value })
                      }
                      placeholder={formRole === 'VENDOR' ? 'e.g. BuildTech Infra Ltd' : 'e.g. Varma Realty'}
                      className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Official Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="partner@example.com"
                      className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98200 12345"
                      className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono"
                    />
                  </div>
                </div>

                {/* Territory & Category/RERA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Territory / Region
                    </label>
                    <input
                      type="text"
                      value={formData.territory}
                      onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
                      placeholder="e.g. Mumbai MMR / Thane"
                      className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      {formRole === 'VENDOR' ? 'Service Category' : 'RERA Reg. Number'}
                    </label>
                    <input
                      type="text"
                      value={formData.categoryOrRera}
                      onChange={(e) => setFormData({ ...formData, categoryOrRera: e.target.value })}
                      placeholder={formRole === 'VENDOR' ? 'e.g. Building Materials' : 'e.g. A51900018742'}
                      className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono"
                    />
                  </div>
                </div>

                {/* User ID & Password Override */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Secure User ID (Optional override)
                    </label>
                    <input
                      type="text"
                      value={formData.customSecureId}
                      onChange={(e) => setFormData({ ...formData, customSecureId: e.target.value })}
                      placeholder={formRole === 'VENDOR' ? 'Auto: VEN-XXXX' : 'Auto: AGT-XXXX'}
                      className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                      Initial Temporary Password
                    </label>
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Auto-generated if left blank"
                      className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono"
                    />
                  </div>
                </div>

                {/* First Login Policy Toggle */}
                <div className="pt-2">
                  <label className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.requirePasswordChange}
                      onChange={(e) =>
                        setFormData({ ...formData, requirePasswordChange: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-neutral-300 cursor-pointer"
                    />
                    <span className="font-semibold">
                      Require password change on first login (Recommended security policy)
                    </span>
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Provision Account</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PASSWORD RESET MODAL */}
      {resetModalUser && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in"
        >
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-neutral-900">
              Reset Password for {resetModalUser.name} ({resetModalUser.secureId})
            </h3>
            <p className="text-xs text-neutral-500">
              This will overwrite the current password and flag the account to require a password update on next login.
            </p>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                New Temporary Password (Optional)
              </label>
              <input
                type="text"
                placeholder="Leave blank to auto-generate"
                value={newResetPassword}
                onChange={(e) => setNewResetPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                onClick={() => setResetModalUser(null)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPasswordSubmit}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
