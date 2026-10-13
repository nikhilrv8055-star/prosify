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
  Eye,
  EyeOff,
} from 'lucide-react';
import { ProsifyAnimatedLogo } from '@/components/brand/ProsifyAnimatedLogo';

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

  // Login form state (Empty by default - no prefilled id or password)
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        <div className="absolute inset-0 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
          <ProsifyAnimatedLogo
            panelType="vendor"
            welcomeTitle="welcome to prosify vendor"
            subtitle="Dedicated workspace access for registered builders, material vendors & engineering suppliers"
          />
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
                  placeholder="Enter vendor ID or registered email"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <span className="text-[10px] text-slate-400">Secure Access</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:from-sky-500 hover:to-sky-600 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Vendor Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-between border-t border-slate-700/60 mt-4">
              <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-1">
                ← Back to Marketplace
              </Link>
              <Link href="/agent" className="text-amber-400 hover:underline">
                Agent Workspace →
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
