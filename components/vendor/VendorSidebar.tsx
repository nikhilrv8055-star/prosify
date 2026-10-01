'use client';

import React from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Layers,
  Users,
  LifeBuoy,
  CreditCard,
  Receipt,
  UserCheck,
  Lock,
  LogOut,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { PortalUser } from '@/lib/auth/portalUsers';

export type VendorTabKey =
  | 'dashboard'
  | 'properties'
  | 'messages'
  | 'projects'
  | 'agents'
  | 'support-tickets'
  | 'buy-plan'
  | 'payment-logs'
  | 'edit-profile'
  | 'change-password';

interface VendorSidebarProps {
  currentTab: VendorTabKey;
  onSelectTab: (tab: VendorTabKey) => void;
  onLogout: () => void;
  session: PortalUser;
  messageBadgeCount?: number;
  ticketBadgeCount?: number;
}

export function VendorSidebar({
  currentTab,
  onSelectTab,
  onLogout,
  session,
  messageBadgeCount = 3,
  ticketBadgeCount = 1,
}: VendorSidebarProps) {
  const menuItems: Array<{
    id: VendorTabKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string | null;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'properties',
      label: 'Property Management',
      icon: Building2,
      badge: null,
    },
    {
      id: 'messages',
      label: 'Property Messages',
      icon: MessageSquare,
      badge: messageBadgeCount > 0 ? messageBadgeCount : null,
    },
    {
      id: 'projects',
      label: 'Project Management',
      icon: Layers,
      badge: null,
    },
    {
      id: 'agents',
      label: 'Agents',
      icon: Users,
      badge: null,
    },
    {
      id: 'support-tickets',
      label: 'Support Tickets',
      icon: LifeBuoy,
      badge: ticketBadgeCount > 0 ? ticketBadgeCount : null,
    },
    {
      id: 'buy-plan',
      label: 'Buy Plan',
      icon: CreditCard,
      badge: 'PRO',
    },
    {
      id: 'payment-logs',
      label: 'Payment Logs',
      icon: Receipt,
      badge: null,
    },
    {
      id: 'edit-profile',
      label: 'Edit Profile',
      icon: UserCheck,
      badge: null,
    },
    {
      id: 'change-password',
      label: 'Change Password',
      icon: Lock,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-[#0B1120] border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen select-none">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-slate-700 p-1 flex items-center justify-center shrink-0">
            <Image
              src="https://mkblktzjrmjktfdnmtql.supabase.co/storage/v1/object/public/eni%20ai%20logo/eni%20ai%20robot%20model.png"
              alt="ENI AI Mascot"
              width={34}
              height={34}
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-white text-xs tracking-wider">VENDOR PANEL</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate font-semibold">{session.name}</p>
          </div>
        </div>

        {/* Navigation Items (All 10 main menu items) */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-slate-950 font-bold shadow-md shadow-sky-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-slate-950 text-sky-400 font-mono'
                        : item.badge === 'PRO'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: User code + Logout Option */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
          <div>
            <span className="text-slate-400 block text-[10px]">Vendor Account ID</span>
            <strong className="text-cyan-400 font-mono">{session.assignedCode || 'VND-402'}</strong>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Active Connection" />
        </div>

        {/* WhatsApp Helpdesk */}
        <a
          href="https://wa.me/919326303244"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
        >
          <span>WhatsApp</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Option 11: Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
