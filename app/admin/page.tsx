'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Building2,
  Layers,
  Building,
  Grid3X3,
  Users,
  UserPlus,
  Workflow,
  Handshake,
  IndianRupee,
  CreditCard,
  RefreshCw,
  Cable,
  FileSpreadsheet,
  Bell,
  Settings,
  ShieldAlert,
  Shield,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { store } from '@/lib/data/store';
import {
  Property,
  Project,
  Developer,
  Lead,
  ChannelPartner,
  Commission,
  Booking,
  Unit,
  AdminNotification,
  AuditLog,
} from '@/lib/types';
import { AdminAuthGate } from '@/components/admin/AdminAuthGate';
import { AdminNavbar, AdminRole } from '@/components/admin/AdminNavbar';
import { brandConfig } from '@/src/config/brand';
import { DashboardTab } from '@/components/admin/DashboardTab';
import { PropertiesTab } from '@/components/admin/PropertiesTab';
import { ProjectsTab } from '@/components/admin/ProjectsTab';
import { DevelopersTab } from '@/components/admin/DevelopersTab';
import { InventoryTab } from '@/components/admin/InventoryTab';
import { LeadsTab } from '@/components/admin/LeadsTab';
import { CrmTab } from '@/components/admin/CrmTab';
import { PartnersTab } from '@/components/admin/PartnersTab';
import { CommissionsTab } from '@/components/admin/CommissionsTab';
import { PayoutsTab } from '@/components/admin/PayoutsTab';
import { SyncCenterTab } from '@/components/admin/SyncCenterTab';
import { IntegrationsTab } from '@/components/admin/IntegrationsTab';
import { ReportsTab } from '@/components/admin/ReportsTab';
import { NotificationsTab } from '@/components/admin/NotificationsTab';
import { SettingsTab } from '@/components/admin/SettingsTab';
import { AuditLogsTab } from '@/components/admin/AuditLogsTab';

export default function AdminAppPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>('admin@prosify.local');
  const [currentRole, setCurrentRole] = useState<AdminRole>('SUPER_ADMIN');

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Live Store States
  const [properties, setProperties] = useState<Property[]>(() => store.getProperties());
  const [projects, setProjects] = useState<Project[]>(() => store.getProjects());
  const [developers, setDevelopers] = useState<Developer[]>(() => store.getDevelopers());
  const [leads, setLeads] = useState<Lead[]>(() => store.getLeads());
  const [partners, setPartners] = useState<ChannelPartner[]>(() => store.getChannelPartners());
  const [commissions, setCommissions] = useState<Commission[]>(() => store.getCommissions());
  const [bookings, setBookings] = useState<Booking[]>(() => store.getBookings());
  const [units, setUnits] = useState<Unit[]>(() => store.getUnits());
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => store.getNotifications());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => store.getAuditLogs());

  // Initialize and check session asynchronously
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const token = sessionStorage.getItem('prosify_admin_secure_token') || sessionStorage.getItem('eni_admin_secure_token');
        const user = sessionStorage.getItem('prosify_admin_user') || sessionStorage.getItem('eni_admin_user');
        if (token && user) {
          setIsAuthenticated(true);
          setCurrentUser(user);
        }
      } catch (e) {
        console.warn('Session check fallback', e);
      } finally {
        setAuthChecked(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Reload store state
  const refreshAllData = () => {
    setProperties([...store.getProperties()]);
    setProjects([...store.getProjects()]);
    setDevelopers([...store.getDevelopers()]);
    setLeads([...store.getLeads()]);
    setPartners([...store.getChannelPartners()]);
    setCommissions([...store.getCommissions()]);
    setBookings([...store.getBookings()]);
    setUnits([...store.getUnits()]);
    setNotifications([...store.getNotifications()]);
    setAuditLogs([...store.getAuditLogs()]);
  };

  const handleAuthenticated = (token: string, username: string) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
    store.addAuditLog({
      action: 'ADMIN_AUTHENTICATED',
      entity: 'AuthSession',
      user: username,
      details: { host: 'admin.prosify.in', method: 'PROSIFY_ADMIN_AUTH' },
    });
    refreshAllData();
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('prosify_admin_secure_token');
      sessionStorage.removeItem('prosify_admin_user');
      sessionStorage.removeItem('prosify_admin_auth_time');
      sessionStorage.removeItem('eni_admin_secure_token');
      sessionStorage.removeItem('eni_admin_user');
      sessionStorage.removeItem('eni_admin_auth_time');
    } catch (e) {
      console.warn('Session clear', e);
    }
    store.addAuditLog({
      action: 'ADMIN_LOGOUT',
      entity: 'AuthSession',
      user: currentUser,
      details: { host: 'admin.prosify.in' },
    });
    setIsAuthenticated(false);
  };

  // Notification actions
  const handleMarkNotificationRead = (id: string) => {
    store.markNotificationAsRead(id);
    setNotifications([...store.getNotifications()]);
  };

  const handleMarkAllNotificationsRead = () => {
    store.markAllNotificationsAsRead();
    setNotifications([...store.getNotifications()]);
  };

  // RBAC Permission Checker
  const rolePermissions: Record<AdminRole, string[]> = {
    SUPER_ADMIN: [
      'dashboard',
      'properties',
      'projects',
      'developers',
      'inventory',
      'leads',
      'crm',
      'partners',
      'commissions',
      'payouts',
      'sync-center',
      'integrations',
      'reports',
      'notifications',
      'settings',
      'audit-logs',
    ],
    ADMIN: [
      'dashboard',
      'properties',
      'projects',
      'developers',
      'inventory',
      'leads',
      'crm',
      'partners',
      'sync-center',
      'reports',
      'notifications',
    ],
    SALES_MANAGER: ['dashboard', 'leads', 'crm', 'inventory', 'properties', 'partners', 'reports', 'notifications'],
    FINANCE_OFFICER: ['dashboard', 'commissions', 'payouts', 'partners', 'reports', 'notifications', 'audit-logs'],
    COMPLIANCE_OFFICER: [
      'dashboard',
      'properties',
      'projects',
      'developers',
      'reports',
      'notifications',
      'audit-logs',
    ],
  };

  const isTabAllowed = rolePermissions[currentRole].includes(activeTab);

  const tabsConfig = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'properties', label: 'Properties', icon: Building2, badge: properties.length },
    { id: 'projects', label: 'Projects', icon: Layers, badge: projects.length },
    { id: 'developers', label: 'Developers', icon: Building, badge: developers.length },
    { id: 'inventory', label: 'Inventory', icon: Grid3X3, badge: units.length },
    { id: 'leads', label: 'Leads', icon: UserPlus, badge: leads.filter((l) => l.status === 'NEW').length },
    { id: 'crm', label: 'CRM Pipeline', icon: Workflow, badge: leads.filter((l) => l.status === 'SITE_VISIT_SCHEDULED').length },
    { id: 'partners', label: 'Partners', icon: Handshake, badge: partners.length },
    {
      id: 'commissions',
      label: 'Commissions',
      icon: IndianRupee,
      badge: commissions.filter((c) => c.status === 'PENDING').length,
    },
    {
      id: 'payouts',
      label: 'Payouts',
      icon: CreditCard,
      badge: commissions.filter((c) => c.status === 'APPROVED').length,
    },
    { id: 'sync-center', label: 'Sync Center', icon: RefreshCw, badge: null },
    { id: 'integrations', label: 'Integrations', icon: Cable, badge: null },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet, badge: null },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: notifications.filter((n) => !n.isRead).length,
    },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
    { id: 'audit-logs', label: 'Audit Logs', icon: ShieldAlert, badge: auditLogs.length },
  ];

  // Prevent flash before session check
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#171717] text-neutral-100 flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span className="w-4 h-4 border-2 border-[#D4A017] border-t-transparent rounded-full animate-spin" />
          <span>Validating admin.prosify.in credentials...</span>
        </div>
      </div>
    );
  }

  // Not authenticated: render the secure login gate
  if (!isAuthenticated) {
    return <AdminAuthGate onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-[#171717] text-neutral-100 flex flex-col font-sans selection:bg-[#D4A017] selection:text-neutral-950">
      {/* Top Secure Navbar */}
      <AdminNavbar
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setMobileSidebarOpen(false);
        }}
        onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        isSidebarOpen={mobileSidebarOpen}
      />

      {/* Main Admin Two-Column Layout (Left Sidebar + Right Content) */}
      <div className="flex-1 flex w-full relative min-h-[calc(100vh-57px)]">
        {/* Mobile Backdrop Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-30 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* LEFT SIDEBAR NAVIGATION ("ek ke niche ek") */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-neutral-900/98 backdrop-blur-xl border-r border-neutral-800 flex flex-col pt-[57px] md:pt-0 transition-transform duration-200 ease-in-out md:static md:translate-x-0 md:h-[calc(100vh-57px)] md:sticky md:top-[57px] md:z-20 shrink-0 ${
            mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-3.5 border-b border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D4A017]" />
              <span className="text-xs font-bold text-neutral-200 tracking-wider uppercase">Navigation</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-md border border-neutral-700/60">
              {tabsConfig.length} Modules
            </span>
          </div>

          {/* Vertical list of all 16 options one below another */}
          <nav className="flex-1 overflow-y-auto p-2.5 space-y-1" aria-label="Admin Navigation Sidebar">
            {tabsConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isAllowed = rolePermissions[currentRole].includes(tab.id);

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group text-left ${
                    isActive
                      ? 'bg-[#D4A017] text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                      : isAllowed
                      ? 'text-neutral-300 hover:text-white hover:bg-neutral-800/80'
                      : 'text-neutral-600 hover:text-neutral-500 hover:bg-neutral-800/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-neutral-950' : 'text-neutral-400 group-hover:text-[#F4C430]'}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.badge !== null && tab.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ml-1.5 shrink-0 ${
                        isActive
                          ? 'bg-neutral-950 text-[#F4C430]'
                          : tab.id === 'notifications' || tab.id === 'crm'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-neutral-800 text-neutral-300 border border-neutral-700/60'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Admin User Footer inside Sidebar */}
          <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/50 text-[11px] text-neutral-400 flex items-center justify-between">
            <span className="truncate font-mono">{currentUser}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
        {/* RBAC Access Denied Guard */}
        {!isTabAllowed ? (
          <div className="p-8 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 text-center space-y-3 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              Restricted Administrative Domain
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your active role (<strong>{currentRole}</strong>) does not have authorization to view the{' '}
              <span className="text-[#0EA5E9] font-semibold">{activeTab.toUpperCase()}</span> module.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentRole('SUPER_ADMIN')}
                className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Elevate to Super Admin (Root)
              </button>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardTab
                properties={properties}
                leads={leads}
                partners={partners}
                bookings={bookings}
                commissions={commissions}
                units={units}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onTriggerSync={() => setActiveTab('sync-center')}
              />
            )}

            {activeTab === 'properties' && (
              <PropertiesTab properties={properties} onRefresh={refreshAllData} />
            )}

            {activeTab === 'projects' && (
              <ProjectsTab projects={projects} onRefresh={refreshAllData} />
            )}

            {activeTab === 'developers' && (
              <DevelopersTab developers={developers} onRefresh={refreshAllData} />
            )}

            {activeTab === 'inventory' && (
              <InventoryTab units={units} onRefresh={refreshAllData} />
            )}

            {activeTab === 'leads' && (
              <LeadsTab leads={leads} onRefresh={refreshAllData} />
            )}

            {activeTab === 'crm' && (
              <CrmTab leads={leads} onRefresh={refreshAllData} />
            )}

            {activeTab === 'partners' && (
              <PartnersTab partners={partners} onRefresh={refreshAllData} />
            )}

            {activeTab === 'commissions' && (
              <CommissionsTab commissions={commissions} onRefresh={refreshAllData} />
            )}

            {activeTab === 'payouts' && (
              <PayoutsTab commissions={commissions} onRefresh={refreshAllData} />
            )}

            {activeTab === 'sync-center' && <SyncCenterTab />}

            {activeTab === 'integrations' && <IntegrationsTab />}

            {activeTab === 'reports' && (
              <ReportsTab
                properties={properties}
                leads={leads}
                partners={partners}
                commissions={commissions}
                units={units}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationsTab
                notifications={notifications}
                onMarkRead={handleMarkNotificationRead}
                onMarkAllRead={handleMarkAllNotificationsRead}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'settings' && <SettingsTab />}

            {activeTab === 'audit-logs' && <AuditLogsTab logs={auditLogs} />}
          </>
        )}
      </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-800 bg-[#171717] px-4 sm:px-6 py-4 text-xs text-neutral-400">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{brandConfig.companyLegalName}</span>
            <span>•</span>
            <span>{brandConfig.adminName}</span>
            <span>•</span>
            <span className="text-[#D4A017] font-mono">admin.prosify.in</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-neutral-400">Operator: <strong className="text-white font-mono">{currentUser}</strong></span>
            {/* Strict rule: WhatsApp Redirection to https://wa.me/919326303244, button text MUST ONLY say "WhatsApp" */}
            <a
              href="https://wa.me/919326303244"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
            >
              <span>WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
