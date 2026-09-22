'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Clock,
  User,
  Activity,
  FileCode,
  ShieldCheck,
} from 'lucide-react';
import { AuditLog } from '@/lib/types';

interface AuditLogsTabProps {
  logs: AuditLog[];
}

export function AuditLogsTab({ logs }: AuditLogsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');

  const filteredLogs = logs.filter((l) => {
    const matchesEntity = entityFilter === 'ALL' || l.entity === entityFilter;
    const matchesSearch =
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(l.details || {}).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesEntity && matchesSearch;
  });

  const entities = Array.from(new Set(logs.map((l) => l.entity))).filter(Boolean);

  const getActionColor = (action: string) => {
    if (action.includes('DELETE') || action.includes('REVOKE') || action.includes('FAIL')) {
      return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    }
    if (action.includes('CREATE') || action.includes('DISBURSE') || action.includes('APPROVE')) {
      return 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40';
    }
    if (action.includes('UPDATE') || action.includes('SYNC')) {
      return 'bg-[#0EA5E9]/20 text-[#0EA5E9] border-[#0EA5E9]/40';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#10B981]" />
          <span>Tamper-Evident Administrative Audit Log Trail</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Immutable event ledger recording all operator mutations, financial approvals, and property status changes
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by operator, action keyword, or payload details..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-[#10B981]"
        >
          <option value="ALL">All Entities</option>
          {entities.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-[#1E293B]/90 backdrop-blur-md border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700/80">
              <tr>
                <th className="py-3 px-4">Timestamp (IST)</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Event Mutation Details</th>
                <th className="py-3 px-4 text-right">Node IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500 font-sans">
                    No matching audit records.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-white flex items-center gap-1">
                        <User className="w-3 h-3 text-[#10B981]" />
                        {l.user}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getActionColor(l.action)}`}>
                        {l.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#0EA5E9] font-semibold">
                      {l.entity} {l.entityId ? `#${l.entityId}` : ''}
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate font-sans text-xs">
                      {l.details ? JSON.stringify(l.details) : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 whitespace-nowrap">
                      103.21.14.82
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
