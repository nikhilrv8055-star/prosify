'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  PortalUser,
  authenticatePortalUser,
  getPortalSession,
  setPortalSession,
  clearPortalSession,
  getPortalUsers,
  updatePortalUser,
  updatePortalUserPassword,
} from '@/lib/auth/portalUsers';
import {
  getScopedVendorData,
  saveScopedVendorData,
  ScopedVendorData,
} from '@/lib/auth/scopedPortalStorage';
import { VendorSidebar, VendorTabKey } from '@/components/vendor/VendorSidebar';
import { DashboardTab } from '@/components/vendor/tabs/DashboardTab';
import { PropertyManagementTab } from '@/components/vendor/tabs/PropertyManagementTab';
import { PropertyMessagesTab } from '@/components/vendor/tabs/PropertyMessagesTab';
import { ProjectManagementTab } from '@/components/vendor/tabs/ProjectManagementTab';
import { AgentsTab } from '@/components/vendor/tabs/AgentsTab';
import { SupportTicketsTab } from '@/components/vendor/tabs/SupportTicketsTab';
import { BuyPlanTab } from '@/components/vendor/tabs/BuyPlanTab';
import { PaymentLogsTab } from '@/components/vendor/tabs/PaymentLogsTab';
import { EditProfileTab } from '@/components/vendor/tabs/EditProfileTab';
import { ChangePasswordTab } from '@/components/vendor/tabs/ChangePasswordTab';
import {
  VendorPropertyItem,
  VendorProjectItem,
  PropertyMessageItem,
  VendorAgentItem,
  SupportTicketItem,
  PaymentLogItem,
  VendorPlan,
} from '@/components/vendor/types';
import {
  ExternalLink,
  Lock,
  CheckCircle2,
  AlertCircle,
  Building2,
  ShieldCheck,
  UserCheck,
  KeyRound,
  ArrowRight,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function VendorPortalPage() {
  const [session, setSession] = useState<PortalUser | null>(() => getPortalSession('VENDOR'));
  const [activeTab, setActiveTab] = useState<VendorTabKey>('dashboard');

  // Available vendor accounts registered via Admin Panel
  const [allVendorAccounts, setAllVendorAccounts] = useState<PortalUser[]>([]);

  useEffect(() => {
    const loadAccounts = () => {
      const users = getPortalUsers();
      setAllVendorAccounts(users.filter((u) => u.role === 'VENDOR'));
    };
    loadAccounts();
    window.addEventListener('eni_portal_users_updated', loadAccounts);
    return () => window.removeEventListener('eni_portal_users_updated', loadAccounts);
  }, []);

  // Login form state
  const [usernameInput, setUsernameInput] = useState('vendor@eni.com');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Strictly Scoped Data Container for the logged in vendor
  const [scopedData, setScopedData] = useState<ScopedVendorData | null>(null);

  // Sync isolated data whenever session changes
  useEffect(() => {
    if (session?.id) {
      const data = getScopedVendorData(session.id, session);
      setScopedData(data);
    } else {
      setScopedData(null);
    }
  }, [session?.id]);

  // Derived scoped collections (isolated strictly per vendor ID)
  const properties = useMemo(() => scopedData?.properties || [], [scopedData?.properties]);
  const projects = useMemo(() => scopedData?.projects || [], [scopedData?.projects]);
  const messages = useMemo(() => scopedData?.messages || [], [scopedData?.messages]);
  const agents = useMemo(() => scopedData?.agents || [], [scopedData?.agents]);
  const tickets = useMemo(() => scopedData?.tickets || [], [scopedData?.tickets]);
  const payments = useMemo(() => scopedData?.payments || [], [scopedData?.payments]);

  // Helper to persist modifications into this vendor's private storage bucket
  const persistScopedPatch = (patch: Partial<ScopedVendorData>) => {
    if (!session?.id || !scopedData) return;
    const updated: ScopedVendorData = {
      ...scopedData,
      ...patch,
    };
    setScopedData(updated);
    saveScopedVendorData(session.id, updated);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    const result = authenticatePortalUser(usernameInput, passwordInput, 'VENDOR');
    if (result.success && result.user) {
      setPortalSession('VENDOR', result.user);
      setSession(result.user);
    } else {
      setLoginError(result.error || 'Authentication failed. Please verify credentials set in Admin Panel.');
    }
    setIsSubmitting(false);
  };

  const handleQuickLoginAs = (vendor: PortalUser) => {
    setUsernameInput(vendor.username);
    setPasswordInput(vendor.password);
    setPortalSession('VENDOR', vendor);
    setSession(vendor);
  };

  const handleLogout = () => {
    clearPortalSession('VENDOR');
    setSession(null);
    setScopedData(null);
  };

  // Property Handlers (Strictly Scoped)
  const handleAddProperty = (newProp: Omit<VendorPropertyItem, 'id' | 'createdAt' | 'views' | 'inquiries'>) => {
    const item: VendorPropertyItem = {
      ...newProp,
      id: `vp-${session?.id || 'vnd'}-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      inquiries: 0,
    };
    persistScopedPatch({ properties: [item, ...properties] });
  };

  const handleUpdatePropertyStatus = (id: string, status: VendorPropertyItem['status']) => {
    const next = properties.map((p) => (p.id === id ? { ...p, status } : p));
    persistScopedPatch({ properties: next });
  };

  const handleDeleteProperty = (id: string) => {
    const next = properties.filter((p) => p.id !== id);
    persistScopedPatch({ properties: next });
  };

  // Project Handler (Strictly Scoped)
  const handleAddProject = (newProj: Omit<VendorProjectItem, 'id'>) => {
    const item: VendorProjectItem = {
      ...newProj,
      id: `vproj-${session?.id || 'vnd'}-${Date.now()}`,
    };
    persistScopedPatch({ projects: [item, ...projects] });
  };

  // Message Reply Handler (Strictly Scoped)
  const handleReplyMessage = (id: string, _replyText: string) => {
    const next = messages.map((m) =>
      m.id === id ? { ...m, status: 'RESPONDED' as const } : m
    );
    persistScopedPatch({ messages: next });
  };

  // Agent Add Handler (Strictly Scoped to this Vendor)
  const handleAddAgent = (newAgent: Omit<VendorAgentItem, 'id' | 'dealsClosed'>) => {
    const item: VendorAgentItem = {
      ...newAgent,
      id: `va-${session?.id || 'vnd'}-${Date.now()}`,
      dealsClosed: 0,
    };
    persistScopedPatch({ agents: [item, ...agents] });
  };

  // Support Ticket Handler (Strictly Scoped)
  const handleCreateTicket = (newTicket: Omit<SupportTicketItem, 'id' | 'ticketNumber' | 'createdAt' | 'lastReply'>) => {
    const item: SupportTicketItem = {
      ...newTicket,
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${session?.assignedCode || 'VND'}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastReply: 'Ticket received by compliance helpdesk. Awaiting assignment.',
    };
    persistScopedPatch({ tickets: [item, ...tickets] });
  };

  // Plan Upgrade Handler (Strictly Scoped)
  const handleUpgradePlan = (plan: VendorPlan) => {
    const newLog: PaymentLogItem = {
      id: `pay-${Date.now()}`,
      txnNumber: `TXN-${session?.assignedCode || 'VND'}-${Date.now().toString().slice(-4)}`,
      description: `${plan.name} Monthly Subscription`,
      amount: plan.price,
      paymentMethod: 'UPI',
      date: new Date().toISOString().split('T')[0],
      status: 'SUCCESS',
      invoiceUrl: '#',
    };
    persistScopedPatch({ payments: [newLog, ...payments] });
  };

  // Profile Update Handler (Strictly Scoped)
  const handleUpdateProfile = (updatedData: any) => {
    if (session) {
      const updatedUser: PortalUser = {
        ...session,
        name: updatedData.name || session.name,
        companyOrProject: updatedData.companyOrProject || session.companyOrProject,
        phone: updatedData.phone || session.phone,
      };
      setSession(updatedUser);
      setPortalSession('VENDOR', updatedUser);
      updatePortalUser(session.id, updatedUser);

      if (scopedData) {
        persistScopedPatch({
          profile: {
            ...scopedData.profile,
            name: updatedData.name || scopedData.profile.name,
            companyName: updatedData.companyOrProject || scopedData.profile.companyName,
            phone: updatedData.phone || scopedData.profile.phone,
          },
        });
      }
    }
  };

  // Password Change Handler (Strictly Scoped)
  const handlePasswordChanged = (newPass: string) => {
    if (session) {
      const updatedUser: PortalUser = { ...session, password: newPass };
      setSession(updatedUser);
      setPortalSession('VENDOR', updatedUser);
      updatePortalUserPassword(session.id, newPass);
    }
  };

  // =========================================================================
  // LOGIN SCREEN (GATED WITH STRICT ADMIN-PROVISIONED CREDENTIALS)
  // =========================================================================
  if (!session) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-slate-200">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#0EA5E9]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl bg-[#1E293B] border border-slate-700 p-2 flex items-center justify-center shadow-xl">
              <Building2 className="w-8 h-8 text-sky-400" />
            </div>
          </div>
          <h2 className="text-center text-2xl font-black text-white tracking-tight">
            Vendor & Developer Portal
          </h2>
          <p className="mt-1 text-center text-xs text-slate-400">
            Dedicated portal access for registered builders, material vendors & engineering suppliers
          </p>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/30 text-[11px] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ROLE: VENDOR • ISOLATED MULTI-TENANT ACCESS</span>
            </span>
          </div>

          {/* Admin Managed Notification Banner */}
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-amber-200/90 text-xs flex items-start gap-2.5 shadow-lg">
            <KeyRound className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-amber-300">Admin-Provisioned Accounts Only</div>
              <div className="text-[11px] text-slate-400 leading-relaxed">
                Vendor IDs and passwords are generated exclusively from the Admin Panel (<Link href="/admin" className="text-amber-400 underline font-semibold">/admin</Link> → Vendors Management). Each ID is strictly isolated to its own listings and buyer inquiries.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
          <div className="bg-[#1E293B]/90 backdrop-blur-md py-7 px-6 shadow-2xl rounded-3xl border border-slate-700 sm:px-9 space-y-5">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Vendor ID or Registered Email
                </label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="vendor@eni.com or VND-402"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <span className="text-[10px] text-slate-400">Issued by Admin</span>
                </div>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:from-sky-500 hover:to-sky-600 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Vendor Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick-Switch Accounts created in Admin Panel */}
            <div className="pt-4 border-t border-slate-700/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin-Created Accounts ({allVendorAccounts.length})</span>
                </span>
                <Link
                  href="/admin"
                  className="text-[10px] text-sky-400 hover:underline flex items-center gap-0.5"
                >
                  <span>Create in /admin</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {allVendorAccounts.map((vnd) => (
                  <button
                    key={vnd.id}
                    type="button"
                    onClick={() => handleQuickLoginAs(vnd)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 transition-all group flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-sky-300 flex items-center gap-1.5">
                        <span>{vnd.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {vnd.assignedCode || 'VND'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ID: {vnd.username} • Pass: {vnd.password}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold group-hover:bg-sky-500 group-hover:text-slate-950 transition-all shrink-0">
                      Login ID →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-between">
              <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-1">
                ← Back to Marketplace
              </Link>
              <Link href="/agent" className="text-amber-400 hover:underline">
                Agent Portal →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED VENDOR CONSOLE (STRICTLY ISOLATED TO THIS VENDOR ID)
  // =========================================================================
  const newMessagesCount = messages.filter((m) => m.status === 'NEW').length;
  const openTicketsCount = tickets.filter((t) => t.status !== 'RESOLVED').length;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 flex flex-col md:flex-row">
      {/* LEFT SIDEBAR: Contains All Requested Items */}
      <VendorSidebar
        currentTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onLogout={handleLogout}
        session={session}
        messageBadgeCount={newMessagesCount}
        ticketBadgeCount={openTicketsCount}
      />

      {/* RIGHT CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full space-y-5">
        {/* Isolated Tenant Identity Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-[#1E293B] to-slate-900 border border-slate-700/80 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center font-mono text-sm border border-emerald-500/30 shrink-0">
              {session.name ? session.name.charAt(0) : 'V'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{session.companyOrProject || session.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  {session.assignedCode || 'VND-PORTAL'}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] font-semibold">
                  Dedicated Account
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Logged in as: <strong className="text-slate-200">{session.username}</strong></span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Strict Data Isolation Active</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Link
              href="/admin"
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-medium transition-colors"
            >
              Admin Panel
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Switch / Logout</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            session={session}
            properties={properties}
            projects={projects}
            messages={messages}
            agents={agents}
            tickets={tickets}
            payments={payments}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* TAB 2: Property Management */}
        {activeTab === 'properties' && (
          <PropertyManagementTab
            properties={properties}
            onAddProperty={handleAddProperty}
            onUpdateStatus={handleUpdatePropertyStatus}
            onDeleteProperty={handleDeleteProperty}
          />
        )}

        {/* TAB 3: Property Messages */}
        {activeTab === 'messages' && (
          <PropertyMessagesTab
            messages={messages}
            onReplyMessage={handleReplyMessage}
          />
        )}

        {/* TAB 4: Project Management */}
        {activeTab === 'projects' && (
          <ProjectManagementTab
            projects={projects}
            onAddProject={handleAddProject}
          />
        )}

        {/* TAB 5: Agents */}
        {activeTab === 'agents' && (
          <AgentsTab
            agents={agents}
            onAddAgent={handleAddAgent}
          />
        )}

        {/* TAB 6: Support Tickets */}
        {activeTab === 'support-tickets' && (
          <SupportTicketsTab
            tickets={tickets}
            onCreateTicket={handleCreateTicket}
          />
        )}

        {/* TAB 7: Buy Plan */}
        {activeTab === 'buy-plan' && (
          <BuyPlanTab onUpgradePlan={handleUpgradePlan} />
        )}

        {/* TAB 8: Payment Logs */}
        {activeTab === 'payment-logs' && (
          <PaymentLogsTab payments={payments} />
        )}

        {/* TAB 9: Edit Profile */}
        {activeTab === 'edit-profile' && (
          <EditProfileTab
            session={session}
            profile={scopedData?.profile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {/* TAB 10: Change Password */}
        {activeTab === 'change-password' && (
          <ChangePasswordTab
            session={session}
            onPasswordChanged={handlePasswordChanged}
          />
        )}
      </main>
    </div>
  );
}
