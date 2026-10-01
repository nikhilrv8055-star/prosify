'use client';

import React, { useState } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Send,
  Search,
  Filter,
  User,
  ExternalLink,
} from 'lucide-react';

export interface AdminTicketItem {
  id: string;
  ticketNumber: string;
  creatorName: string;
  creatorRole: 'VENDOR' | 'BUYER' | 'CHANNEL_PARTNER';
  subject: string;
  category: 'BILLING' | 'LISTING_APPROVAL' | 'API_SYNC' | 'ACCOUNT' | 'DISPUTE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'PENDING' | 'CLOSED';
  createdAt: string;
  lastReply: string;
}

const INITIAL_TICKETS: AdminTicketItem[] = [
  {
    id: 't-1',
    ticketNumber: 'TKT-2026-9921',
    creatorName: 'Adarsh Malhotra (Godrej Properties)',
    creatorRole: 'VENDOR',
    subject: 'Webhook endpoint verification for Godrej Riviera Unit Status',
    category: 'API_SYNC',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: '2026-09-30 08:30',
    lastReply: 'Awaiting network security IP whitelist confirmation.',
  },
  {
    id: 't-2',
    ticketNumber: 'TKT-2026-9874',
    creatorName: 'Rajesh Mehra',
    creatorRole: 'BUYER',
    subject: 'Request for MahaRERA title verification certificate PDF',
    category: 'DISPUTE',
    priority: 'MEDIUM',
    status: 'PENDING',
    createdAt: '2026-09-29 14:15',
    lastReply: 'Legal desk requested title search report from registrar.',
  },
  {
    id: 't-3',
    ticketNumber: 'TKT-2026-9762',
    creatorName: 'Amit Shah (Apex Realty CP)',
    creatorRole: 'CHANNEL_PARTNER',
    subject: 'TDS certificate Form 16A download for Q2 commission payout',
    category: 'BILLING',
    priority: 'LOW',
    status: 'CLOSED',
    createdAt: '2026-09-25 10:00',
    lastReply: 'Form 16A dispatched to registered tax email ID.',
  },
  {
    id: 't-4',
    ticketNumber: 'TKT-2026-9940',
    creatorName: 'Sandeep Poddar (Lodha Group)',
    creatorRole: 'VENDOR',
    subject: 'Request to increase maximum photo ad banners in Dombivli cluster',
    category: 'LISTING_APPROVAL',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: '2026-09-30 11:20',
    lastReply: 'Marketing desk reviewing festive slot availability.',
  },
];

export function SupportTicketsAdminView({ subview = 'tickets-all' }: { subview?: string }) {
  const [tickets, setTickets] = useState<AdminTicketItem[]>(INITIAL_TICKETS);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'open' | 'closed' | 'settings'>(
    subview === 'tickets-pending'
      ? 'pending'
      : subview === 'tickets-open'
      ? 'open'
      : subview === 'tickets-closed'
      ? 'closed'
      : subview === 'tickets-settings'
      ? 'settings'
      : 'all'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<AdminTicketItem | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Settings State
  const [settings, setSettings] = useState({
    slaHoursHigh: 4,
    slaHoursNormal: 24,
    autoAssignRole: 'COMPLIANCE_OFFICER',
    emailAlertsOnCritical: true,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSendReply = (statusToSet: 'OPEN' | 'PENDING' | 'CLOSED') => {
    if (!selectedTicket || !replyMessage.trim()) return;

    setTickets(
      tickets.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: statusToSet,
              lastReply: replyMessage.trim(),
            }
          : t
      )
    );

    showToast(`Replied to ${selectedTicket.ticketNumber} and status marked as ${statusToSet}`);
    setReplyMessage('');
    setSelectedTicket(null);
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'open') return matchesSearch && t.status === 'OPEN';
    if (activeTab === 'pending') return matchesSearch && t.status === 'PENDING';
    if (activeTab === 'closed') return matchesSearch && t.status === 'CLOSED';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-indigo-400" />
            <span>Support Desk & Helpdesk Tickets</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Resolve complaints, vendor enquiries, compliance tickets, and technical API support requests.
          </p>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('open')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'open' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Open ({tickets.filter((t) => t.status === 'OPEN').length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pending' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending ({tickets.filter((t) => t.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'closed' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Closed ({tickets.filter((t) => t.status === 'CLOSED').length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* VIEW: TICKETS LIST (All / Open / Pending / Closed) */}
      {activeTab !== 'settings' && (
        <div className="space-y-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ticket #, subject or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#1E293B]/60 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Ticket #</th>
                  <th className="p-3.5">Subject & Category</th>
                  <th className="p-3.5">User Details</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Created Date</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5 font-mono font-bold text-amber-400">{t.ticketNumber}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{t.subject}</div>
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                        {t.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-200 font-medium">{t.creatorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{t.creatorRole}</div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.priority === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : t.priority === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'OPEN'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : t.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">{t.createdAt}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-2xl bg-[#1E293B]/80 border border-slate-700 shadow-xl max-w-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Support Desk SLA & Auto-Routing</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">High Priority SLA (Hours)</label>
                <input
                  type="number"
                  value={settings.slaHoursHigh}
                  onChange={(e) => setSettings({ ...settings, slaHoursHigh: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Normal Priority SLA (Hours)</label>
                <input
                  type="number"
                  value={settings.slaHoursNormal}
                  onChange={(e) => setSettings({ ...settings, slaHoursNormal: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Default Escalation Role</label>
              <select
                value={settings.autoAssignRole}
                onChange={(e) => setSettings({ ...settings, autoAssignRole: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
              >
                <option value="COMPLIANCE_OFFICER">RERA Compliance Auditor</option>
                <option value="ADMIN">Operations Admin</option>
                <option value="SUPER_ADMIN">Super Administrator</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <div>
                <h4 className="font-semibold text-white">Instant SMS / WhatsApp Escalation</h4>
                <p className="text-[11px] text-slate-400">Trigger direct alert to executive on critical builder disputes</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailAlertsOnCritical}
                onChange={(e) => setSettings({ ...settings, emailAlertsOnCritical: e.target.checked })}
                className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
              />
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => showToast('Helpdesk SLA settings saved!')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Update Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TICKET RESPONSE MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">{selectedTicket.ticketNumber}</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{selectedTicket.subject}</h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">From:</span>
                <strong className="text-white">{selectedTicket.creatorName}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="text-indigo-400 font-mono">{selectedTicket.category}</span>
              </div>
              <div>
                <span className="text-slate-400">Latest Status Note:</span>
                <p className="text-slate-200 mt-1 italic">&ldquo;{selectedTicket.lastReply}&rdquo;</p>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium text-xs mb-1">Administrative Reply & Resolution</label>
              <textarea
                rows={3}
                placeholder="Type resolution instructions to the ticket creator..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleSendReply('CLOSED')}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold"
              >
                Close Ticket
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSendReply('PENDING')}
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Mark Pending
                </button>
                <button
                  type="button"
                  onClick={() => handleSendReply('OPEN')}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Send & Keep Open
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
