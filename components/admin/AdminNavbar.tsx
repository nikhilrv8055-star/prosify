'use client';

import React, { useState } from 'react';
import {
  Shield,
  Bell,
  LogOut,
  ChevronDown,
  UserCheck,
  ExternalLink,
  Lock,
  Sparkles,
  Check,
  CheckCheck,
  Menu,
  X,
} from 'lucide-react';
import { AdminNotification } from '@/lib/types';
import { brandConfig } from '@/src/config/brand';
import { ProsifyLogo } from '@/components/brand/ProsifyLogo';

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'SALES_MANAGER'
  | 'FINANCE_OFFICER'
  | 'COMPLIANCE_OFFICER';

interface AdminNavbarProps {
  currentRole: AdminRole;
  onRoleChange: (role: AdminRole) => void;
  onLogout: () => void;
  notifications: AdminNotification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onNavigateTab: (tab: string) => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function AdminNavbar({
  currentRole,
  onRoleChange,
  onLogout,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onNavigateTab,
  onToggleSidebar,
  isSidebarOpen,
}: AdminNavbarProps) {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const roleMeta: Record<AdminRole, { title: string; color: string; desc: string }> = {
    SUPER_ADMIN: {
      title: 'Super Administrator',
      color: 'bg-amber-500/20 text-[#F4C430] border-amber-500/40',
      desc: 'Full System Control Plane & Policy Authority',
    },
    ADMIN: {
      title: 'Operations Admin',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      desc: 'Inventory, Listings & Partner Management',
    },
    SALES_MANAGER: {
      title: 'CRM & Sales Director',
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
      desc: 'Omnichannel Leads, Pipeline, Assignments',
    },
    FINANCE_OFFICER: {
      title: 'Finance & Payouts Officer',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      desc: 'Commissions, Section 194H TDS, RTGS Payouts',
    },
    COMPLIANCE_OFFICER: {
      title: 'RERA Compliance Auditor',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      desc: 'Regulatory Disclosures & Audit Trails',
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-[#171717]/95 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-6 py-2.5">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand & Domain Indicator */}
        <div className="flex items-center gap-3 sm:gap-4">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Toggle navigation sidebar"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 text-[#F4C430]" />}
            </button>
          )}

          <ProsifyLogo variant="admin" size="md" badge="Admin" href="/admin" showTagline={false} />

          {/* Subdomain pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono">
            <Lock className="w-3 h-3 text-[#D4A017]" />
            <span className="text-neutral-500">Host:</span>
            <span className="text-[#F4C430] font-bold">admin.prosify.in</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] animate-pulse ml-1" />
          </div>
        </div>

        {/* Right: RBAC selector, Notifications, WhatsApp, User profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* RBAC Role Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-xs text-neutral-200 transition-all cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#D4A017]" />
              <span className="hidden sm:inline font-mono font-medium">Role:</span>
              <span className="font-bold text-white">{roleMeta[currentRole].title}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Simulate RBAC Access Role
                  </span>
                  <span className="text-xs text-neutral-200">
                    Switch administrative view & permissions:
                  </span>
                </div>

                <div className="space-y-1">
                  {(Object.keys(roleMeta) as AdminRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        onRoleChange(role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col transition-colors cursor-pointer ${
                        currentRole === role
                          ? 'bg-[#D4A017]/20 border border-[#D4A017]/40 text-white font-bold'
                          : 'hover:bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{roleMeta[role].title}</span>
                        {currentRole === role && (
                          <UserCheck className="w-3.5 h-3.5 text-[#D4A017]" />
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 mt-0.5">
                        {roleMeta[role].desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="System Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">System Notifications</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-neutral-800 text-[#D4A017]">
                      {unreadNotifications.length} unread
                    </span>
                  </div>
                  {unreadNotifications.length > 0 && (
                    <button
                      onClick={onMarkAllNotificationsRead}
                      className="text-[11px] text-[#D4A017] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-xs text-neutral-500">
                      No notifications logged
                    </p>
                  ) : (
                    notifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          notif.isRead
                            ? 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400'
                            : 'bg-neutral-800/80 border-[#D4A017]/30 text-neutral-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{notif.title}</span>
                          {!notif.isRead && (
                            <button
                              onClick={() => onMarkNotificationRead(notif.id)}
                              className="text-[10px] text-[#D4A017] hover:underline"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] mt-0.5 leading-tight text-neutral-300">
                          {notif.message}
                        </p>
                        <span className="text-[9px] font-mono text-neutral-500 mt-1 block">
                          {new Date(notif.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Strict rule: WhatsApp Redirection to https://wa.me/919326303244, button text MUST ONLY say "WhatsApp" */}
          <a
            href="https://wa.me/919326303244"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs shadow-md transition-colors"
          >
            <span>WhatsApp</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
            <div className="hidden sm:block text-right">
              <span className="block text-xs font-bold text-white font-mono">admin@prosify.local</span>
              <span className="block text-[10px] text-[#D4A017]">Super Admin</span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-rose-400 hover:border-rose-500/50 transition-colors cursor-pointer"
              title="Terminate Secure Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
