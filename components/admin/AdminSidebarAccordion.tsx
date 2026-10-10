'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Layers,
  Building,
  Package,
  CreditCard,
  Users,
  ShieldCheck,
  LifeBuoy,
  Home,
  FileText,
  BookOpen,
  HelpCircle,
  Image as ImageIcon,
  Settings,
  Shield,
  ChevronDown,
  ChevronRight,
  Search,
  KeyRound,
  Webhook,
  Workflow,
  Sparkles,
  Share2,
  UserCheck,
  Cloud,
} from 'lucide-react';
import { AdminMenuKey } from './adminMenuTypes';

export interface NavGroup {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string | null;
  items?: {
    id: AdminMenuKey;
    label: string;
    badge?: number | string | null;
  }[];
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    id: 'grp-dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    items: [
      { id: 'dashboard', label: 'Command Center Overview' },
      { id: 'portal-access', label: 'All Portals Access & Passwords' },
      { id: 'developer-api', label: 'Builder Sync API Gateway' },
    ],
  },
  {
    id: 'grp-specs',
    label: 'Property Specifications',
    icon: Settings,
    items: [
      { id: 'spec-settings', label: 'Settings' },
      { id: 'spec-categories', label: 'Categories' },
      { id: 'spec-amenities', label: 'Amenities' },
      { id: 'spec-countries', label: 'Countries' },
      { id: 'spec-states', label: 'States' },
      { id: 'spec-cities', label: 'Cities' },
    ],
  },
  {
    id: 'grp-props',
    label: 'Property Management',
    icon: Building2,
    items: [
      { id: 'prop-settings', label: 'Settings' },
      { id: 'prop-add', label: 'Add Property' },
      { id: 'prop-manage', label: 'Manage Properties' },
      { id: 'prop-featured', label: 'Featured Properties' },
      { id: 'prop-pricing-all', label: 'Pricing: All Request' },
      { id: 'prop-pricing-pending', label: 'Pricing: Pending Request', badge: 2 },
      { id: 'prop-pricing-accepted', label: 'Pricing: Accepted Request' },
      { id: 'prop-pricing-rejected', label: 'Pricing: Rejected Request' },
      { id: 'prop-messages', label: 'Property Messages' },
    ],
  },
  {
    id: 'grp-projects',
    label: 'Project Management',
    icon: Layers,
    items: [
      { id: 'proj-settings', label: 'Settings' },
      { id: 'proj-add', label: 'Add Project' },
      { id: 'proj-manage', label: 'Manage Projects' },
      { id: 'proj-agents', label: 'Agents & Channel Partners' },
    ],
  },
  {
    id: 'grp-packages',
    label: 'Package Management',
    icon: Package,
    items: [
      { id: 'pkg-settings', label: 'Settings' },
      { id: 'pkg-packages', label: 'Packages' },
      { id: 'pkg-menu-builder', label: 'Menu Builder' },
    ],
  },
  {
    id: 'grp-payments',
    label: 'Payment Log',
    icon: CreditCard,
    items: [
      { id: 'payment-logs', label: 'All Payment Logs & Payouts' },
    ],
  },
  {
    id: 'grp-users',
    label: 'Users Management',
    icon: Users,
    items: [
      { id: 'users-registered', label: 'Registered Users' },
      { id: 'users-add', label: 'Add User' },
      { id: 'users-subscribers', label: 'Subscribers' },
    ],
  },
  {
    id: 'grp-vendors',
    label: 'Vendors Management',
    icon: Building,
    items: [
      { id: 'vendors-settings', label: 'Settings' },
      { id: 'vendors-registered', label: 'Registered vendors' },
      { id: 'vendors-add', label: 'Add vendor' },
    ],
  },
  {
    id: 'grp-agents',
    label: 'Agent Panel & Management',
    icon: UserCheck,
    badge: 'Sync Vault',
    items: [
      { id: 'agents-management', label: 'Manage Agents & Panel' },
      { id: 'agents-add', label: 'Add Agent (Auto-Gen ID)' },
      { id: 'agents-cloud-sync', label: 'Cloud Storage & Sync Vault' },
    ],
  },
  {
    id: 'grp-tickets',
    label: 'Support Tickets',
    icon: LifeBuoy,
    badge: 2,
    items: [
      { id: 'tickets-settings', label: 'Setting' },
      { id: 'tickets-all', label: 'All Tickets' },
      { id: 'tickets-pending', label: 'Pending Tickets', badge: 1 },
      { id: 'tickets-open', label: 'Open Tickets', badge: 2 },
      { id: 'tickets-closed', label: 'Closed Tickets' },
    ],
  },
  {
    id: 'grp-home',
    label: 'Home Page CMS',
    icon: Home,
    items: [
      { id: 'home-hero', label: 'Hero Section' },
      { id: 'home-about', label: 'About Section' },
      { id: 'home-why-us', label: 'Why Choose Us Section' },
      { id: 'home-brand', label: 'Brand Section' },
      { id: 'home-property', label: 'Property Section' },
      { id: 'home-featured-property', label: 'Featured Property Section' },
      { id: 'home-counter', label: 'Counter Section' },
      { id: 'home-city', label: 'City Section' },
      { id: 'home-testimonial', label: 'Testimonial Section' },
      { id: 'home-vendor', label: 'Vendor Section' },
      { id: 'home-subscribe', label: 'Subscribe Section' },
      { id: 'home-sections-visibility', label: 'Section Show/Hide' },
    ],
  },
  {
    id: 'grp-footer',
    label: 'Footer CMS',
    icon: FileText,
    items: [
      { id: 'footer-logo', label: 'Logo & Image' },
      { id: 'footer-content', label: 'Content' },
      { id: 'footer-quick-links', label: 'Quick Links' },
      { id: 'footer-custom-pages', label: 'Custom Pages' },
    ],
  },
  {
    id: 'grp-blog',
    label: 'Blog Management',
    icon: BookOpen,
    items: [
      { id: 'blog-categories', label: 'Categories' },
      { id: 'blog-posts', label: 'Posts' },
    ],
  },
  {
    id: 'grp-faq',
    label: 'FAQ Management',
    icon: HelpCircle,
    items: [
      { id: 'faq-manage', label: 'All FAQs & Q&A' },
    ],
  },
  {
    id: 'grp-ads',
    label: 'Advertisements',
    icon: ImageIcon,
    badge: 'Photos Ads',
    items: [
      { id: 'ads-settings', label: 'Settings' },
      { id: 'ads-photo-ads', label: 'All Advertisements (Photos Ads)' },
      { id: 'ads-announcements', label: 'Announcement Popups' },
    ],
  },
  {
    id: 'grp-settings',
    label: 'Basic Settings',
    icon: Settings,
    items: [
      { id: 'settings-general', label: 'General Settings' },
      { id: 'settings-contact', label: 'Contact Page' },
      { id: 'settings-email', label: 'Email Settings' },
      { id: 'settings-mail-from', label: 'Mail From Admin' },
      { id: 'settings-mail-to', label: 'Mail To Admin' },
      { id: 'settings-mail-templates', label: 'Mail Templates' },
      { id: 'settings-breadcrumb', label: 'Breadcrumb' },
      { id: 'settings-page-headings', label: 'Page Headings' },
      { id: 'settings-plugins', label: 'Plugins' },
      { id: 'settings-seo', label: 'SEO Informations' },
      { id: 'settings-maintenance', label: 'Maintenance Mode' },
      { id: 'settings-cookie', label: 'Cookie Alert' },
      { id: 'settings-social', label: 'Social Medias' },
      { id: 'settings-mobile-app', label: 'Mobile App Settings' },
    ],
  },
  {
    id: 'grp-gateways',
    label: 'Payment Gateways',
    icon: CreditCard,
    items: [
      { id: 'gateway-online', label: 'Online Gateways' },
      { id: 'gateway-offline', label: 'Offline Gateways' },
    ],
  },
  {
    id: 'grp-admin',
    label: 'Admin Management',
    icon: Shield,
    items: [
      { id: 'admin-roles', label: 'Role & Permissions' },
      { id: 'admin-users', label: 'Registered Admins' },
      { id: 'admin-languages', label: 'Language Management' },
    ],
  },
  {
    id: 'grp-affiliate',
    label: 'Affiliate Program',
    icon: Share2,
    badge: '3.0%',
    items: [
      { id: 'affiliate-settings', label: 'Settings & Commission' },
      { id: 'affiliate-members', label: 'Registered Affiliates', badge: 5 },
      { id: 'affiliate-conversions', label: 'Conversions & Referral Logs' },
      { id: 'affiliate-payouts', label: 'Payouts & Withdrawals', badge: 2 },
      { id: 'affiliate-creatives', label: 'Marketing Creatives & Banners' },
    ],
  },
];

interface AdminSidebarAccordionProps {
  activeMenu: AdminMenuKey;
  onSelectMenu: (menu: AdminMenuKey) => void;
  currentUser: string;
}

export function AdminSidebarAccordion({
  activeMenu,
  onSelectMenu,
  currentUser,
}: AdminSidebarAccordionProps) {
  // Keep track of which groups are expanded
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    // Open the group that contains activeMenu by default
    const initial: Record<string, boolean> = { 'grp-dashboard': true };
    for (const group of ADMIN_NAV_GROUPS) {
      if (group.items?.some((item) => item.id === activeMenu)) {
        initial[group.id] = true;
      }
    }
    return initial;
  });

  const [filterSearch, setFilterSearch] = useState('');

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleItemClick = (id: AdminMenuKey, groupId: string) => {
    onSelectMenu(id);
    setOpenGroups((prev) => ({ ...prev, [groupId]: true }));
  };

  const isSearchActive = filterSearch.trim().length > 0;

  return (
    <aside className="w-72 bg-[#121824] border-r border-slate-800 flex flex-col h-[calc(100vh-57px)] sticky top-[57px] shrink-0 text-slate-300">
      {/* Search Header */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-950/40">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search all admin modules..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 bg-slate-900 rounded-xl border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Accordion Menu List */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {ADMIN_NAV_GROUPS.map((group) => {
          const Icon = group.icon;
          const isGroupOpen = openGroups[group.id] || isSearchActive;

          // Filter subitems if search active
          const matchingItems = group.items?.filter((item) =>
            isSearchActive
              ? item.label.toLowerCase().includes(filterSearch.toLowerCase()) ||
                group.label.toLowerCase().includes(filterSearch.toLowerCase())
              : true
          );

          if (isSearchActive && (!matchingItems || matchingItems.length === 0)) {
            return null;
          }

          const hasActiveChild = group.items?.some((i) => i.id === activeMenu);

          return (
            <div key={group.id} className="rounded-xl overflow-hidden">
              {/* Group Accordion Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none ${
                  hasActiveChild
                    ? 'bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${hasActiveChild ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="truncate">{group.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {group.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {group.badge}
                    </span>
                  )}
                  {isGroupOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
              </button>

              {/* Submenu Children */}
              {isGroupOpen && matchingItems && matchingItems.length > 0 && (
                <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-slate-800 ml-4 my-1">
                  {matchingItems.map((item) => {
                    const isItemActive = activeMenu === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id, group.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                          isItemActive
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ml-1 ${
                              isItemActive
                                ? 'bg-slate-950 text-amber-300'
                                : 'bg-slate-800 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Operator Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="truncate font-mono">{currentUser}</span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          Root Control
        </span>
      </div>
    </aside>
  );
}
