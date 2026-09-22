'use client';

import React, { useState } from 'react';
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  Send,
  Building,
  ShieldCheck,
  Search,
  Filter,
  FileCheck,
  X,
  CreditCard,
} from 'lucide-react';
import { Commission } from '@/lib/types';
import { formatIndianPrice } from '@/lib/utils';
import { store } from '@/lib/data/store';

interface CommissionsTabProps {
  commissions: Commission[];
  onRefresh: () => void;
}

export function CommissionsTab({ commissions, onRefresh }: CommissionsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [utrNumber, setUtrNumber] = useState('');

  const filtered = commissions.filter((c) => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const propTitle = c.propertyTitle || c.projectName || '';
    const matchesSearch =
      c.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = (commissionId: string) => {
    store.updateCommissionStatus(commissionId, 'APPROVED');
    onRefresh();
  };

  const handleOpenDisburse = (c: Commission) => {
    setSelectedCommission(c);
    setUtrNumber(`HDFC${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  };

  const handleExecuteDisburse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommission) return;

    store.updateCommissionStatus(
      selectedCommission.id,
      'PAID',
      new Date().toISOString().split('T')[0]
    );

    const tds = selectedCommission.tdsDeducted || Math.round(selectedCommission.amount * 0.05);
    const net = selectedCommission.netPayable || (selectedCommission.amount - tds);

    store.addAuditLog({
      action: 'PAYOUT_DISBURSED',
      entity: 'Commission',
      entityId: selectedCommission.id,
      user: 'eni1526',
      details: {
        partner: selectedCommission.partnerName,
        netDisbursed: net,
        tdsDeducted: tds,
        utrNumber,
      },
    });

    setSelectedCommission(null);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-[#10B981]" />
            <span>Brokerage Commissions & RTGS Payout Disbursement</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated Section 194H 5% TDS compliance ledger, multi-tier CP settlement, and banking audit trail
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by partner name, property, or payout ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-[#10B981]"
        >
          <option value="ALL">All Payout Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="PAID">DISBURSED / PAID</option>
        </select>
      </div>

      {/* Commissions Table */}
      <div className="rounded-2xl bg-[#1E293B]/90 backdrop-blur-md border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700/80">
              <tr>
                <th className="py-3 px-4">Deal Reference & Property</th>
                <th className="py-3 px-4">Beneficiary CP</th>
                <th className="py-3 px-4">Agreement Value</th>
                <th className="py-3 px-4">Brokerage / TDS 194H</th>
                <th className="py-3 px-4">Net Payable</th>
                <th className="py-3 px-4 text-right">Settlement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((c) => {
                const tds = c.tdsDeducted || Math.round(c.amount * 0.05);
                const net = c.netPayable || (c.amount - tds);
                const title = c.propertyTitle || c.projectName || 'Property Deal';
                const rate = c.ratePercent || 2.0;

                return (
                  <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{title}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Ref: {c.id} • Unit: {c.unitNumber || 'TBD'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{c.partnerName}</div>
                      <div className="text-[10px] text-[#0EA5E9] font-mono">CP Rate: {rate}%</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-200">
                        {formatIndianPrice(c.agreementValue || c.amount * 50)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-300">Gross: <strong>{formatIndianPrice(c.amount)}</strong></div>
                      <div className="text-rose-400 text-[10px] font-mono">
                        - TDS (5%): {formatIndianPrice(tds)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-bold text-[#10B981] font-mono">
                        {formatIndianPrice(net)}
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mt-0.5 ${
                          c.status === 'PAID'
                            ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                            : c.status === 'APPROVED'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {c.status === 'PENDING' && (
                        <button
                          onClick={() => handleApprove(c.id)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold cursor-pointer"
                        >
                          Approve Payout
                        </button>
                      )}
                      {c.status === 'APPROVED' && (
                        <button
                          onClick={() => handleOpenDisburse(c)}
                          className="px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-xs shadow-md shadow-[#10B981]/20 cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <Send className="w-3 h-3" />
                          <span>Disburse RTGS</span>
                        </button>
                      )}
                      {c.status === 'PAID' && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          Disbursed on {c.paidAt || 'Completed'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RTGS Payout Disbursement Modal */}
      {selectedCommission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#10B981]" />
                <span>Execute Bank RTGS Payout</span>
              </h3>
              <button onClick={() => setSelectedCommission(null)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteDisburse} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Beneficiary:</span>
                  <span className="font-bold text-white">{selectedCommission.partnerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deal Reference:</span>
                  <span className="text-slate-200">{selectedCommission.propertyTitle || selectedCommission.projectName || 'Property'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross Brokerage:</span>
                  <span>{formatIndianPrice(selectedCommission.amount)}</span>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>Less: Section 194H TDS (5%):</span>
                  <span>-{formatIndianPrice(selectedCommission.tdsDeducted || Math.round(selectedCommission.amount * 0.05))}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm text-[#10B981]">
                  <span>Net Disbursable Amount:</span>
                  <span>{formatIndianPrice(selectedCommission.netPayable || (selectedCommission.amount - (selectedCommission.tdsDeducted || Math.round(selectedCommission.amount * 0.05))))}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Bank Settlement Reference / UTR Number *
                </label>
                <input
                  type="text"
                  required
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setSelectedCommission(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold shadow-md shadow-[#10B981]/20 cursor-pointer"
                >
                  Confirm & Disburse Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
