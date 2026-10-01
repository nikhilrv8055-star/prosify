'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  PortalUser,
  authenticatePortalUser,
  getPortalSession,
  setPortalSession,
  clearPortalSession,
} from '@/lib/auth/portalUsers';
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
  INITIAL_VENDOR_PROPERTIES,
  INITIAL_VENDOR_PROJECTS,
  INITIAL_PROPERTY_MESSAGES,
  INITIAL_VENDOR_AGENTS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_PAYMENT_LOGS,
} from '@/components/vendor/mockVendorData';
import {
  VendorPropertyItem,
  VendorProjectItem,
  PropertyMessageItem,
  VendorAgentItem,
  SupportTicketItem,
  PaymentLogItem,
  VendorPlan,
} from '@/components/vendor/types';
import { ExternalLink, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VendorPortalPage() {
  const [session, setSession] = useState<PortalUser | null>(() => getPortalSession('VENDOR'));
  const [activeTab, setActiveTab] = useState<VendorTabKey>('dashboard');

  // Login form state
  const [usernameInput, setUsernameInput] = useState('vendor@eni.com');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vendor Data State
  const [properties, setProperties] = useState<VendorPropertyItem[]>(INITIAL_VENDOR_PROPERTIES);
  const [projects, setProjects] = useState<VendorProjectItem[]>(INITIAL_VENDOR_PROJECTS);
  const [messages, setMessages] = useState<PropertyMessageItem[]>(INITIAL_PROPERTY_MESSAGES);
  const [agents, setAgents] = useState<VendorAgentItem[]>(INITIAL_VENDOR_AGENTS);
  const [tickets, setTickets] = useState<SupportTicketItem[]>(INITIAL_SUPPORT_TICKETS);
  const [payments, setPayments] = useState<PaymentLogItem[]>(INITIAL_PAYMENT_LOGS);

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

  const handleLogout = () => {
    clearPortalSession('VENDOR');
    setSession(null);
  };

  // Property Handlers
  const handleAddProperty = (newProp: Omit<VendorPropertyItem, 'id' | 'createdAt' | 'views' | 'inquiries'>) => {
    const item: VendorPropertyItem = {
      ...newProp,
      id: `vp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      inquiries: 0,
    };
    setProperties([item, ...properties]);
  };

  const handleUpdatePropertyStatus = (id: string, status: VendorPropertyItem['status']) => {
    setProperties(properties.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter((p) => p.id !== id));
  };

  // Project Handler
  const handleAddProject = (newProj: Omit<VendorProjectItem, 'id'>) => {
    const item: VendorProjectItem = {
      ...newProj,
      id: `vproj-${Date.now()}`,
    };
    setProjects([item, ...projects]);
  };

  // Message Reply Handler
  const handleReplyMessage = (id: string, replyText: string) => {
    setMessages(
      messages.map((m) =>
        m.id === id ? { ...m, status: 'RESPONDED' } : m
      )
    );
  };

  // Agent Add Handler
  const handleAddAgent = (newAgent: Omit<VendorAgentItem, 'id' | 'dealsClosed'>) => {
    const item: VendorAgentItem = {
      ...newAgent,
      id: `va-${Date.now()}`,
      dealsClosed: 0,
    };
    setAgents([item, ...agents]);
  };

  // Support Ticket Handler
  const handleCreateTicket = (newTicket: Omit<SupportTicketItem, 'id' | 'ticketNumber' | 'createdAt' | 'lastReply'>) => {
    const item: SupportTicketItem = {
      ...newTicket,
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-VND-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastReply: 'Ticket received by compliance helpdesk. Awaiting assignment.',
    };
    setTickets([item, ...tickets]);
  };

  // Plan Upgrade Handler
  const handleUpgradePlan = (plan: VendorPlan) => {
    const newLog: PaymentLogItem = {
      id: `pay-${Date.now()}`,
      txnNumber: `TXN-ENI-${Date.now().toString().slice(-4)}`,
      description: `${plan.name} Monthly Subscription`,
      amount: plan.price,
      paymentMethod: 'UPI',
      date: new Date().toISOString().split('T')[0],
      status: 'SUCCESS',
      invoiceUrl: '#',
    };
    setPayments([newLog, ...payments]);
  };

  // Profile Update Handler
  const handleUpdateProfile = (updatedData: any) => {
    if (session) {
      const updatedUser = {
        ...session,
        name: updatedData.name,
        companyOrProject: updatedData.companyOrProject,
        phone: updatedData.phone,
      };
      setSession(updatedUser);
      setPortalSession('VENDOR', updatedUser);
    }
  };

  // Password Change Handler
  const handlePasswordChanged = (newPass: string) => {
    if (session) {
      const updatedUser = { ...session, password: newPass };
      setSession(updatedUser);
      setPortalSession('VENDOR', updatedUser);
    }
  };

  // LOGIN SCREEN GATED FOR VENDOR
  if (!session) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#0EA5E9]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl bg-[#1E293B] border border-slate-700 p-2 flex items-center justify-center shadow-xl">
              <Image
                src="https://mkblktzjrmjktfdnmtql.supabase.co/storage/v1/object/public/eni%20ai%20logo/eni%20ai%20robot%20model.png"
                alt="ENI AI Born Robot Mascot"
                width={52}
                height={52}
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <h2 className="text-center text-2xl font-black text-white tracking-tight">
            Vendor & Developer Portal
          </h2>
          <p className="mt-1 text-center text-xs text-slate-400">
            Secure login for registered materials suppliers, developers, and builders
          </p>

          <div className="mt-2 flex justify-center">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/30 text-[10px] font-bold">
              ROLE: VENDOR • ENTERPRISE ACCESS
            </span>
          </div>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
          <div className="bg-[#1E293B]/80 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl border border-slate-700 sm:px-10 space-y-5">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Vendor Email or User ID
                </label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="vendor@eni.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <span className="text-[10px] text-slate-400">Default: password123</span>
                </div>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:from-sky-500 hover:to-sky-600 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In to Vendor Portal'}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-700/60 text-center text-xs text-slate-400 space-y-1">
              <p>Password lost or need account access?</p>
              <a
                href="https://wa.me/919326303244"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-semibold flex items-center justify-center gap-1"
              >
                <span>WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED VENDOR CONSOLE WITH LEFT SIDEBAR
  const newMessagesCount = messages.filter((m) => m.status === 'NEW').length;
  const openTicketsCount = tickets.filter((t) => t.status !== 'RESOLVED').length;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 flex flex-col md:flex-row">
      {/* LEFT SIDEBAR: Contains All 11 Requested Items */}
      <VendorSidebar
        currentTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onLogout={handleLogout}
        session={session}
        messageBadgeCount={newMessagesCount}
        ticketBadgeCount={openTicketsCount}
      />

      {/* RIGHT CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full">
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
