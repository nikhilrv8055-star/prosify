'use client';

import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Download,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  FileText,
} from 'lucide-react';
import { PaymentLogItem } from '../types';

interface PaymentLogsTabProps {
  payments: PaymentLogItem[];
}

export function PaymentLogsTab({ payments }: PaymentLogsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const filtered = payments.filter(
    (p) =>
      p.txnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);

  const handleDownloadInvoice = (txnNumber: string) => {
    setDownloadNotice(`Generated Tax Invoice (GST PDF) for ${txnNumber}`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <span>Payment Logs & Billing History</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            View transaction receipts, download GST-compliant tax invoices, and track plan subscription fees.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-3">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Billed</span>
            <strong className="text-emerald-400 font-mono text-sm">₹{totalSpent.toLocaleString()}</strong>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-slate-400 font-medium">All Tax Invoices Paid</span>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#1E293B]/80 border border-slate-700 flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search txn ID, plan description, payment method..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <span className="text-slate-400 font-medium">{filtered.length} Invoices Recorded</span>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-[#1E293B]/80 border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px] font-semibold uppercase">
              <tr>
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5">Description & Purpose</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Tax Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No payment logs found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono text-cyan-400 font-semibold">
                      {item.txnNumber}
                    </td>

                    <td className="p-3.5 text-white font-medium max-w-xs">
                      {item.description}
                    </td>

                    <td className="p-3.5 font-mono font-bold text-white text-sm">
                      ₹{item.amount.toLocaleString()}
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                        {item.paymentMethod.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-400 text-[11px]">
                      {item.date}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          item.status === 'SUCCESS'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(item.txnNumber)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-semibold flex items-center gap-1.5 ml-auto cursor-pointer transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>GST PDF</span>
                      </button>
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
