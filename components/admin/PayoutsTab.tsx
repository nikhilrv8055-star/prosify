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
  Download,
  AlertCircle,
  CreditCard,
  Landmark,
  FileSpreadsheet,
  Receipt,
  X,
  Sparkles,
} from 'lucide-react';
import { Commission } from '@/lib/types';
import { formatIndianPrice } from '@/lib/utils';
import { store } from '@/lib/data/store';
import { useToast } from '@/components/ui/toast';

interface PayoutsTabProps {
  commissions: Commission[];
  onRefresh: () => void;
}

export function PayoutsTab({ commissions, onRefresh }: PayoutsTabProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Commission | null>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Financial Metrics
  const totalDisbursed = commissions
    .filter((c) => c.status === 'PAID')
    .reduce((acc, c) => acc + (c.netPayable || Math.round(c.amount * 0.95)), 0);

  const pendingDisbursement = commissions
    .filter((c) => c.status === 'APPROVED')
    .reduce((acc, c) => acc + (c.netPayable || Math.round(c.amount * 0.95)), 0);

  const totalTdsRemitted = commissions
    .filter((c) => c.status === 'PAID')
    .reduce((acc, c) => acc + (c.tdsDeducted || Math.round(c.amount * 0.05)), 0);

  // Filtered List
  const filtered = commissions.filter((c) => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const propTitle = c.propertyTitle || c.projectName || '';
    const utr = c.utrNumber || '';
    const matchesSearch =
      c.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.partnerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      utr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Open disburse modal
  const handleOpenDisburse = (c: Commission) => {
    setSelectedCommission(c);
    setUtrNumber(`HDFC${c.id.replace(/\D/g, '').padEnd(10, '9').slice(0, 10)}`);
  };

  // Execute single disbursement
  const handleExecuteDisburse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommission) return;

    setIsProcessing(true);
    setTimeout(() => {
      store.updateCommissionStatus(
        selectedCommission.id,
        'PAID',
        utrNumber
      );

      store.addAuditLog({
        action: 'PAYOUT_DISBURSED_RTGS',
        entity: 'CommissionPayout',
        user: 'eni1526',
        details: {
          commissionId: selectedCommission.id,
          partner: selectedCommission.partnerName,
          amount: selectedCommission.amount,
          utrNumber,
          tdsDeducted: selectedCommission.tdsDeducted || Math.round(selectedCommission.amount * 0.05),
          host: 'admin.prosify.in',
        },
      });

      toast({
        title: 'RTGS Payout Disbursed',
        description: `Disbursed ${formatIndianPrice(selectedCommission.netPayable || Math.round(selectedCommission.amount * 0.95))} to ${selectedCommission.partnerName}. UTR: ${utrNumber}`,
        type: 'success',
      });

      setIsProcessing(false);
      setSelectedCommission(null);
      onRefresh();
    }, 500);
  };

  // Batch disburse all approved
  const handleBatchDisburse = () => {
    const approvedCommissions = commissions.filter((c) => c.status === 'APPROVED');
    if (approvedCommissions.length === 0) {
      toast({
        title: 'No Pending Batches',
        description: 'All eligible commissions have already been disbursed.',
        type: 'info',
      });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      approvedCommissions.forEach((c, idx) => {
        const batchUtr = `HDFC${Date.now().toString().slice(-8)}${(idx + 10).toString().padStart(2, '0')}`;
        store.updateCommissionStatus(c.id, 'PAID', batchUtr);
        store.addAuditLog({
          action: 'BATCH_PAYOUT_EXECUTED',
          entity: 'CommissionPayout',
          user: 'eni1526',
          details: { commissionId: c.id, partner: c.partnerName, amount: c.amount, utrNumber: batchUtr },
        });
      });

      toast({
        title: 'Batch Disbursement Completed',
        description: `Successfully cleared ${approvedCommissions.length} approved payouts via HDFC Corporate Direct Gateway.`,
        type: 'success',
      });

      setIsProcessing(false);
      onRefresh();
    }, 800);
  };

  // Download Bank Upload CSV (NEFT/RTGS File)
  const handleDownloadBankCSV = () => {
    const headers = [
      'Beneficiary Name',
      'Partner Code',
      'Bank Account Number',
      'IFSC Code',
      'Transfer Mode',
      'Gross Amount INR',
      'Section 194H TDS 5%',
      'Net Payout Amount INR',
      'Payment Status',
      'UTR Reference',
      'Remittance Date',
    ];

    const rows = filtered.map((c) => {
      const tds = c.tdsDeducted || Math.round(c.amount * 0.05);
      const net = c.netPayable || c.amount - tds;
      const dummyAcc = `50100${c.partnerCode.replace(/\D/g, '') || '9876543210'}`;
      const dummyIfsc = 'HDFC0000240';
      const utr = c.utrNumber || (c.status === 'PAID' ? 'HDFC9988776655' : 'PENDING');
      const paidDate = c.paidAt || 'PENDING';

      return [
        `"${c.partnerName.replace(/"/g, '""')}"`,
        c.partnerCode,
        dummyAcc,
        dummyIfsc,
        net > 200000 ? 'RTGS' : 'NEFT',
        c.amount,
        tds,
        net,
        c.status,
        utr,
        paidDate,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HDFC_Corporate_Payout_Batch_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Banking Batch Exported',
      description: 'NEFT/RTGS formatted CSV ready for corporate portal upload.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1E293B]/70 p-5 rounded-2xl border border-slate-700/70 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">RTGS / NEFT Payouts & Section 194H Remittance</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
              Corporate Clearinghouse
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated TDS 5% withholding under Section 194H, bank verification, and instant RTGS disbursement with tamper-evident audit trails.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadBankCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-800 hover:text-white transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>Bank Batch CSV</span>
          </button>

          <button
            onClick={handleBatchDisburse}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10B981] text-slate-950 text-xs font-bold hover:bg-[#059669] disabled:opacity-50 transition-all shadow-md shadow-[#10B981]/20"
          >
            <Send className="w-4 h-4" />
            <span>Disburse All Approved</span>
          </button>
        </div>
      </div>

      {/* Corporate Bank Status Strip */}
      <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">HDFC Bank Corporate Clearing A/C</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                API CONNECTED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              A/C: 50200088921844 • IFSC: HDFC0000060 • Entity: Prosify Technologies Private Limited
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Liquid Escrow Balance</span>
            <span className="text-base font-bold text-white font-mono">₹1,45,80,000</span>
          </div>
          <div className="pl-4 border-l border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">TDS Compliance</span>
            <span className="text-xs font-bold text-emerald-400">Section 194H (5%) Active</span>
          </div>
        </div>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[#1E293B]/70 p-4 rounded-xl border border-slate-700/60">
          <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">Total Disbursed</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block font-mono">
            {formatIndianPrice(totalDisbursed)}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Credited via RTGS / NEFT</span>
        </div>

        <div className="bg-[#1E293B]/70 p-4 rounded-xl border border-slate-700/60">
          <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">Ready for Payout</span>
          <span className="text-xl font-bold text-amber-400 mt-1 block font-mono">
            {formatIndianPrice(pendingDisbursement)}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Approved deal commissions</span>
        </div>

        <div className="bg-[#1E293B]/70 p-4 rounded-xl border border-slate-700/60">
          <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">194H TDS Withheld</span>
          <span className="text-xl font-bold text-blue-400 mt-1 block font-mono">
            {formatIndianPrice(totalTdsRemitted)}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Form 26AS Tax Ledger</span>
        </div>

        <div className="bg-[#1E293B]/70 p-4 rounded-xl border border-slate-700/60">
          <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">Disbursement Rate</span>
          <span className="text-xl font-bold text-white mt-1 block">
            {commissions.length > 0 ? ((commissions.filter((c) => c.status === 'PAID').length / commissions.length) * 100).toFixed(1) + '%' : '100%'}
          </span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Avg Turnaround: 24 Hours</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#1E293B]/50 p-3 rounded-xl border border-slate-700/60">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search payouts by partner, code (e.g. APEX2026), UTR reference, or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All Payout Statuses</option>
            <option value="APPROVED">Ready for Disbursement (Approved)</option>
            <option value="PAID">Disbursed (Paid)</option>
            <option value="PENDING">Under Audit Review (Pending)</option>
          </select>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-[#1E293B]/80 rounded-2xl border border-slate-700/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-700 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Beneficiary Partner</th>
                <th className="py-3 px-4">Deal Reference</th>
                <th className="py-3 px-4 text-right">Gross Brokerage</th>
                <th className="py-3 px-4 text-right">194H TDS (5%)</th>
                <th className="py-3 px-4 text-right">Net Disbursed</th>
                <th className="py-3 px-4">Status & UTR</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No payouts match your search or filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const tds = item.tdsDeducted || Math.round(item.amount * 0.05);
                  const net = item.netPayable || item.amount - tds;
                  const isPaid = item.status === 'PAID';
                  const isReady = item.status === 'APPROVED';

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{item.partnerName}</div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-0.5">
                          <span className="text-[#0EA5E9]">{item.partnerCode}</span>
                          <span>•</span>
                          <span>PAN: AABCP{item.partnerCode.replace(/\D/g, '').padEnd(4, '8').slice(0, 4)}M</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium truncate max-w-[170px]">
                          {item.propertyTitle || item.projectName || 'Residential Deal'}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Agmt: {formatIndianPrice(item.agreementValue || item.amount * 50)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-300">
                        {formatIndianPrice(item.amount)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-rose-400">
                        -{formatIndianPrice(tds)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                        {formatIndianPrice(net)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`inline-flex items-center w-fit px-2 py-0.5 rounded text-[10px] font-bold ${
                              isPaid
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : isReady
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {item.status}
                          </span>
                          {item.utrNumber && (
                            <span className="text-[10px] font-mono text-slate-400">
                              UTR: {item.utrNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isReady && (
                            <button
                              onClick={() => handleOpenDisburse(item)}
                              className="px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow-sm"
                            >
                              <Send className="w-3 h-3" />
                              <span>Disburse</span>
                            </button>
                          )}

                          {isPaid && (
                            <button
                              onClick={() => setSelectedReceipt(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] flex items-center gap-1"
                            >
                              <Receipt className="w-3 h-3 text-emerald-400" />
                              <span>Voucher</span>
                            </button>
                          )}

                          {item.status === 'PENDING' && (
                            <span className="text-[11px] text-slate-500 italic">
                              Awaiting Deal Audit
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Process Single RTGS Disbursement */}
      {selectedCommission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Execute RTGS / NEFT Payout</h3>
              </div>
              <button
                onClick={() => setSelectedCommission(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteDisburse} className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Beneficiary:</span>
                  <span className="text-white font-bold">{selectedCommission.partnerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Partner Code:</span>
                  <span className="text-[#0EA5E9] font-mono">{selectedCommission.partnerCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross Brokerage:</span>
                  <span className="text-white font-mono">{formatIndianPrice(selectedCommission.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">TDS 5% (Section 194H):</span>
                  <span className="text-rose-400 font-mono">
                    -{formatIndianPrice(selectedCommission.tdsDeducted || Math.round(selectedCommission.amount * 0.05))}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between">
                  <span className="text-emerald-400 font-bold">Net RTGS Transfer:</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm">
                    {formatIndianPrice(selectedCommission.netPayable || Math.round(selectedCommission.amount * 0.95))}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Corporate Clearing Account</label>
                <input
                  type="text"
                  disabled
                  value="HDFC Bank • A/C 50200088921844 • IFSC HDFC0000060"
                  className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Bank UTR Reference Number *</label>
                <input
                  type="text"
                  required
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-[#10B981]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Auto-stamped on Form 16A remittance ledger and partner statement.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setSelectedCommission(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 rounded-xl bg-[#10B981] text-slate-950 font-bold hover:bg-[#059669] flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm RTGS Release</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Payout Voucher / Receipt */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Payment Disbursement Voucher</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Ref ID: {selectedReceipt.id} • Section 194H Tax Compliant
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2 font-mono">
                <div className="text-center pb-2 border-b border-slate-800">
                  <span className="text-sm font-bold text-white block">PROSIFY TECHNOLOGIES PRIVATE LIMITED</span>
                  <span className="text-[11px] text-slate-400">GSTIN: 27AABCU9603R1ZM • MahaRERA: A51800049281</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Beneficiary Partner:</span>
                    <span className="text-white font-bold">{selectedReceipt.partnerName}</span>
                    <span className="text-slate-400 block">Code: {selectedReceipt.partnerCode}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block">Disbursed Date:</span>
                    <span className="text-white">{selectedReceipt.paidAt || '2026-03-20'}</span>
                    <span className="text-emerald-400 block">Status: CLEARED</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gross Brokerage Amount:</span>
                    <span className="text-white">{formatIndianPrice(selectedReceipt.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Less: TDS @ 5% (Sec 194H):</span>
                    <span className="text-rose-400 font-bold">
                      -{formatIndianPrice(selectedReceipt.tdsDeducted || Math.round(selectedReceipt.amount * 0.05))}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm">
                    <span className="text-emerald-400">Net Disbursed via RTGS:</span>
                    <span className="text-emerald-400">
                      {formatIndianPrice(selectedReceipt.netPayable || Math.round(selectedReceipt.amount * 0.95))}
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px]">
                  <span className="text-slate-400">Bank UTR Number: </span>
                  <span className="text-[#0EA5E9] font-bold">{selectedReceipt.utrNumber || 'HDFC9988776655'}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    toast({
                      title: 'Voucher Saved',
                      description: 'Tax voucher printed to partner disbursement folder.',
                      type: 'success',
                    });
                    setSelectedReceipt(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#10B981] text-slate-950 font-bold"
                >
                  Print / Save Voucher
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
