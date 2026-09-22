'use client';

import React from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCheck,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AdminNotification } from '@/lib/types';

interface NotificationsTabProps {
  notifications: AdminNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigateTab: (tab: string) => void;
}

export function NotificationsTab({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNavigateTab,
}: NotificationsTabProps) {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'WARNING':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'SUCCESS':
        return 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40';
      default:
        return 'bg-[#0EA5E9]/20 text-[#0EA5E9] border-[#0EA5E9]/40';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-[#0EA5E9] flex-shrink-0" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#0EA5E9]" />
            <span>Telemetry Alerts & Operational Notifications</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time event broadcasts regarding unit reservations, inbound leads, and compliance audits
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#0EA5E9] text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All Read ({unreadCount})</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#1E293B]/80 border border-slate-700 text-slate-400 text-xs">
            No system notifications recorded.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                n.isRead
                  ? 'bg-[#1E293B]/60 border-slate-800 opacity-80'
                  : 'bg-[#1E293B]/95 border-slate-700 shadow-lg'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getSeverityIcon(n.severity)}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xs font-bold text-white">{n.title}</h4>
                    <span className={`text-[10px] px-2 py-0.2 rounded border font-mono ${getSeverityBadge(n.severity)}`}>
                      {n.severity}
                    </span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    {new Date(n.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                {!n.isRead && (
                  <button
                    onClick={() => onMarkRead(n.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                  >
                    Mark Read
                  </button>
                )}
                {n.actionUrl && (
                  <button
                    onClick={() => {
                      onMarkRead(n.id);
                      const tab = (n.actionUrl || '').split('tab=')[1] || 'dashboard';
                      onNavigateTab(tab);
                    }}
                    className="px-3 py-1 rounded-lg bg-[#0EA5E9] hover:bg-[#0284c7] text-slate-950 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Target</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
