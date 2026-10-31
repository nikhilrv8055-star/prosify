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
import { PortalAccessTab } from '@/components/admin/PortalAccessTab';
import { DeveloperApiTab } from '@/components/admin/DeveloperApiTab';
import { AdminSidebarAccordion, ADMIN_NAV_GROUPS } from '@/components/admin/AdminSidebarAccordion';
import { AdminMenuKey } from '@/components/admin/adminMenuTypes';
import { PropertySpecificationsView } from '@/components/admin/views/PropertySpecificationsView';
import { PropertyPricingRequestsView } from '@/components/admin/views/PropertyPricingRequestsView';
import { PackageManagementView } from '@/components/admin/views/PackageManagementView';
import { UsersManagementView } from '@/components/admin/views/UsersManagementView';
import { VendorsManagementView } from '@/components/admin/views/VendorsManagementView';
import { AgentsManagementView } from '@/components/admin/views/AgentsManagementView';
import { SupportTicketsAdminView } from '@/components/admin/views/SupportTicketsAdminView';
import { HomePageCmsView } from '@/components/admin/views/HomePageCmsView';
import { FooterCmsView } from '@/components/admin/views/FooterCmsView';
import { BlogManagementView } from '@/components/admin/views/BlogManagementView';
import { FaqManagementView } from '@/components/admin/views/FaqManagementView';
import { AdvertisementsView } from '@/components/admin/views/AdvertisementsView';
import { BasicSettingsView } from '@/components/admin/views/BasicSettingsView';
import { PaymentGatewaysView } from '@/components/admin/views/PaymentGatewaysView';
import { AdminManagementView } from '@/components/admin/views/AdminManagementView';
import { AffiliateProgramView } from '@/components/admin/views/AffiliateProgramView';
import { FestivalThemesAdminView } from '@/components/admin/views/FestivalThemesAdminView';
import { ShieldCheck, Bot, KeyRound, Webhook } from 'lucide-react';

function getGroupIdForTab(tabKey: string): string | null {
  for (const group of ADMIN_NAV_GROUPS) {
    if (group.items?.some((item) => item.id === tabKey)) {
      return group.id;
    }
  }
  if (tabKey.startsWith('spec-')) return 'grp-specs';
  if (tabKey.startsWith('prop-') || tabKey === 'properties') return 'grp-props';
  if (tabKey.startsWith('proj-') || tabKey === 'projects') return 'grp-projects';
  if (tabKey.startsWith('pkg-')) return 'grp-packages';
  if (tabKey.startsWith('users-')) return 'grp-users';
  if (tabKey.startsWith('vendors-')) return 'grp-vendors';
  if (tabKey.startsWith('agents-')) return 'grp-agents';
  if (tabKey.startsWith('tickets-')) return 'grp-tickets';
  if (tabKey.startsWith('home-')) return 'grp-home-cms';
  if (tabKey.startsWith('footer-')) return 'grp-footer-cms';
  if (tabKey.startsWith('blog-')) return 'grp-blog';
  if (tabKey.startsWith('faq-')) return 'grp-faq';
  if (tabKey.startsWith('ads-')) return 'grp-ads';
  if (tabKey.startsWith('festival-')) return 'grp-festival';
  if (tabKey.startsWith('settings-')) return 'grp-settings';
  if (tabKey.startsWith('gateway-')) return 'grp-gateways';
  if (tabKey.startsWith('admin-')) return 'grp-admin';
  if (tabKey.startsWith('affiliate-')) return 'grp-affiliate';
  if (tabKey === 'payment-logs') return 'grp-payments';
  if (tabKey === 'dashboard' || tabKey === 'portal-access' || tabKey === 'developer-api') return 'grp-dashboard';
  if (tabKey === 'leads' || tabKey === 'crm') return 'grp-crm';
  if (tabKey === 'reports') return 'grp-reports';
  return null;
}

function getFirstPermittedTab(allowedGroups: string[]): string {
  if (!allowedGroups || allowedGroups.length === 0 || allowedGroups.includes('*')) return 'dashboard';
  for (const group of ADMIN_NAV_GROUPS) {
    if (allowedGroups.includes(group.id) && group.items && group.items.length > 0) {
      return group.items[0].id;
    }
  }
  return 'dashboard';
}

export default function AdminAppPage() {
  // Authentication & RBAC State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>('admin@prosify.in');
  const [displayName, setDisplayName] = useState<string>('Super Administrator');
  const [currentRole, setCurrentRole] = useState<AdminRole>('SUPER_ADMIN');
  const [roleTitle, setRoleTitle] = useState<string>('Super Administrator');
  const [allowedGroups, setAllowedGroups] = useState<string[]>(['*']);

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
        const savedRole = sessionStorage.getItem('prosify_admin_role');
        const savedRoleTitle = sessionStorage.getItem('prosify_admin_role_title');
        const savedName = sessionStorage.getItem('prosify_admin_name');
        const savedGroups = sessionStorage.getItem('prosify_admin_allowed_groups');

        if (token && user) {
          setIsAuthenticated(true);
          setCurrentUser(user);
          if (savedRole) setCurrentRole(savedRole as AdminRole);
          if (savedRoleTitle) setRoleTitle(savedRoleTitle);
          if (savedName) setDisplayName(savedName);
          if (savedGroups) {
            try {
              const parsed = JSON.parse(savedGroups);
              if (Array.isArray(parsed)) {
                setAllowedGroups(parsed);
              }
            } catch {}
          }
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
    store.rehydrateFromStorage();
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

  // Subscribe to live multi-panel & website synchronization
  useEffect(() => {
    store.rehydrateFromStorage();
    const unsubscribe = store.subscribe(() => {
      refreshAllData();
    });
    const handleUpdate = () => refreshAllData();
    window.addEventListener('prosify:store-updated', handleUpdate);
    return () => {
      unsubscribe();
      window.removeEventListener('prosify:store-updated', handleUpdate);
    };
  }, []);

  const handleAuthenticated = (
    token: string,
    username: string,
    role?: AdminRole | string,
    userAllowedGroups?: string[],
    userRoleTitle?: string,
    userDisplayName?: string
  ) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
    if (role) setCurrentRole(role as AdminRole);
    if (userRoleTitle) setRoleTitle(userRoleTitle);
    if (userDisplayName) setDisplayName(userDisplayName);

    if (userAllowedGroups && Array.isArray(userAllowedGroups)) {
      setAllowedGroups(userAllowedGroups);
      const isTabPermitted =
        userAllowedGroups.includes('*') ||
        (getGroupIdForTab(activeTab) && userAllowedGroups.includes(getGroupIdForTab(activeTab)!));
      if (!isTabPermitted) {
        const fallback = getFirstPermittedTab(userAllowedGroups);
        setActiveTab(fallback);
      }
    } else {
      setAllowedGroups(['*']);
    }

    store.addAuditLog({
      action: 'ADMIN_AUTHENTICATED',
      entity: 'AuthSession',
      user: username,
      details: {
        host: 'admin.prosify.in',
        method: 'PROSIFY_ADMIN_AUTH',
        role: role || 'SUPER_ADMIN',
        roleTitle: userRoleTitle,
      },
    });
    refreshAllData();
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('prosify_admin_secure_token');
      sessionStorage.removeItem('prosify_admin_user');
      sessionStorage.removeItem('prosify_admin_username');
      sessionStorage.removeItem('prosify_admin_name');
      sessionStorage.removeItem('prosify_admin_role');
      sessionStorage.removeItem('prosify_admin_role_title');
      sessionStorage.removeItem('prosify_admin_allowed_groups');
      sessionStorage.removeItem('prosify_admin_is_root');
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
    setAllowedGroups(['*']);
    setRoleTitle('Super Administrator');
    setDisplayName('Super Administrator');
    setCurrentRole('SUPER_ADMIN');
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
  const isSuperAdmin = allowedGroups.includes('*') || currentRole === 'SUPER_ADMIN';

  const isTabAllowed = useMemo(() => {
    if (isSuperAdmin) return true;
    const groupId = getGroupIdForTab(activeTab);
    if (!groupId) return false;
    return allowedGroups.includes(groupId);
  }, [isSuperAdmin, activeTab, allowedGroups]);

  const tabsConfig = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, badge: null },
    {
      id: 'portal-access',
      label: 'Account Access & Passwords',
      icon: KeyRound,
      badge: null,
    },
    { id: 'properties', label: 'Properties', icon: Building2, badge: properties.length },
    { id: 'projects', label: 'Projects', icon: Layers, badge: projects.length },
    { id: 'developers', label: 'Developers', icon: Building, badge: developers.length },
    { id: 'developer-api', label: 'Builder API Sync', icon: Webhook, badge: null },
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
        roleTitle={roleTitle}
        displayName={displayName}
        currentUser={currentUser}
        allowedGroups={allowedGroups}
        isSuperAdmin={isSuperAdmin}
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

        {/* Mobile Left Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-72 pt-[57px] md:pt-0 transition-transform duration-200 ease-in-out md:hidden ${
            mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          <AdminSidebarAccordion
            activeMenu={activeTab as AdminMenuKey}
            onSelectMenu={(menu) => {
              setActiveTab(menu);
              setMobileSidebarOpen(false);
            }}
            currentUser={currentUser}
            allowedGroups={allowedGroups}
            roleTitle={roleTitle}
          />
        </div>

        {/* Desktop Left Sidebar ("ek ke niche ek" with Assigned Modules & Collapsible Groups) */}
        <div className="hidden md:block shrink-0">
          <AdminSidebarAccordion
            activeMenu={activeTab as AdminMenuKey}
            onSelectMenu={(menu) => {
              setActiveTab(menu);
            }}
            currentUser={currentUser}
            allowedGroups={allowedGroups}
            roleTitle={roleTitle}
          />
        </div>

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
        {/* RBAC Access Denied Guard */}
        {!isTabAllowed ? (
          <div className="p-8 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-center space-y-3 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              Restricted Administrative Domain
            </h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              Your active staff account (<strong>{displayName}</strong> - <span className="text-amber-400 font-semibold">{roleTitle}</span>) is assigned limited access by the Main Super Administrator. You do not have permissions to access the{' '}
              <span className="text-[#0EA5E9] font-mono font-bold">{activeTab.toUpperCase()}</span> module.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  const fallback = getFirstPermittedTab(allowedGroups);
                  setActiveTab(fallback);
                }}
                className="px-4 py-2 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Go to My Assigned Workspace
              </button>
              {isSuperAdmin && (
                <button
                  onClick={() => setCurrentRole('SUPER_ADMIN')}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs border border-neutral-700 transition-colors cursor-pointer"
                >
                  Elevate to Super Admin
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* 1. DASHBOARD & INTEGRATIONS */}
            {activeTab === 'dashboard' && (
              <DashboardTab
                properties={properties}
                projects={projects}
                leads={leads}
                partners={partners}
                bookings={bookings}
                commissions={commissions}
                units={units}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onTriggerSync={() => setActiveTab('sync-center')}
              />
            )}

            {activeTab === 'portal-access' && <PortalAccessTab />}
            {activeTab === 'developer-api' && <DeveloperApiTab onRefresh={refreshAllData} />}

            {/* 2. PROPERTY SPECIFICATIONS */}
            {activeTab.startsWith('spec-') && (
              <PropertySpecificationsView subview={activeTab} />
            )}

            {/* 3. PROPERTY MANAGEMENT & PRICING */}
            {(activeTab.startsWith('prop-pricing-') || activeTab === 'prop-messages') && (
              <PropertyPricingRequestsView subview={activeTab} />
            )}
            {(activeTab === 'properties' || (activeTab.startsWith('prop-') && !activeTab.startsWith('prop-pricing-') && activeTab !== 'prop-messages')) && (
              <PropertiesTab properties={properties} onRefresh={refreshAllData} subview={activeTab} />
            )}

            {/* 4. PROJECT MANAGEMENT */}
            {activeTab === 'proj-agents' && (
              <PartnersTab partners={partners} onRefresh={refreshAllData} />
            )}
            {(activeTab === 'projects' || (activeTab.startsWith('proj-') && activeTab !== 'proj-agents')) && (
              <ProjectsTab projects={projects} onRefresh={refreshAllData} subview={activeTab} />
            )}

            {/* 5. PACKAGE MANAGEMENT */}
            {activeTab.startsWith('pkg-') && (
              <PackageManagementView subview={activeTab} />
            )}

            {/* 6. PAYMENT LOG */}
            {activeTab === 'payment-logs' && (
              <PayoutsTab commissions={commissions} onRefresh={refreshAllData} />
            )}

            {/* 7. USERS MANAGEMENT */}
            {activeTab.startsWith('users-') && (
              <UsersManagementView subview={activeTab} />
            )}

            {/* 8. VENDORS MANAGEMENT */}
            {activeTab.startsWith('vendors-') && (
              <VendorsManagementView subview={activeTab} />
            )}

            {/* 8B. AGENT PANEL & MANAGEMENT (SYNC VAULT) */}
            {activeTab.startsWith('agents-') && (
              <AgentsManagementView subview={activeTab} />
            )}

            {/* 9. SUPPORT TICKETS */}
            {activeTab.startsWith('tickets-') && (
              <SupportTicketsAdminView subview={activeTab} />
            )}

            {/* 10. HOME PAGE CMS */}
            {activeTab.startsWith('home-') && (
              <HomePageCmsView />
            )}

            {/* 11. FOOTER CMS */}
            {activeTab.startsWith('footer-') && (
              <FooterCmsView subview={activeTab} />
            )}

            {/* 12. BLOG MANAGEMENT */}
            {activeTab.startsWith('blog-') && (
              <BlogManagementView subview={activeTab} />
            )}

            {/* 13. FAQ MANAGEMENT */}
            {activeTab === 'faq-manage' && (
              <FaqManagementView />
            )}

            {/* 14. ADVERTISEMENTS & PHOTO ADS */}
            {activeTab.startsWith('ads-') && (
              <AdvertisementsView subview={activeTab as any} />
            )}

            {/* 15. BASIC SETTINGS */}
            {activeTab.startsWith('settings-') && (
              <BasicSettingsView subview={activeTab} />
            )}

            {/* 16. PAYMENT GATEWAYS */}
            {activeTab.startsWith('gateway-') && (
              <PaymentGatewaysView subview={activeTab} />
            )}

            {/* 17. ADMIN MANAGEMENT */}
            {activeTab.startsWith('admin-') && (
              <AdminManagementView subview={activeTab} />
            )}

            {/* 18. AFFILIATE PROGRAM */}
            {activeTab.startsWith('affiliate-') && (
              <AffiliateProgramView subview={activeTab} />
            )}

            {/* 19. FESTIVAL & SEASONAL CELEBRATION THEMES */}
            {activeTab.startsWith('festival-') && (
              <FestivalThemesAdminView subview={activeTab} />
            )}

            {/* CLASSIC / SYSTEM TABS */}
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
            {/* Strict rule: WhatsApp Redirection to https://wa.me/919167991679, button text MUST ONLY say "WhatsApp" */}
            <a
              href="https://wa.me/919167991679"
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
