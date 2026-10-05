'use client';

import React, { useState } from 'react';
import {
  IndianRupee,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Building2,
  User,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export interface PricingRequestItem {
  id: string;
  requestId: string;
  propertyTitle: string;
  developerOrVendor: string;
  buyerName: string;
  buyerPhone: string;
  basePrice: number;
  offeredPrice: number;
  paymentMode: 'FULL_DOWNPAYMENT' | 'BANK_LOAN_PRE_APPROVED' | 'FLEXIBLE_CONSTRUCTION_LINKED';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  submittedDate: string;
  adminNotes?: string;
}

const INITIAL_REQUESTS: PricingRequestItem[] = [];

export function PropertyPricingRequestsView({ subview = 'prop-pricing-all' }: { subview?: string }) {
  const [requests, setRequests] = useState<PricingRequestItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'rejected'>(
    subview === 'prop-pricing-pending'
      ? 'pending'
      : subview === 'prop-pricing-accepted'
      ? 'accepted'
      : subview === 'prop-pricing-rejected'
      ? 'rejected'
      : 'all'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateStatus = (id: string, newStatus: 'ACCEPTED' | 'REJECTED') => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast(`Pricing Request status changed to ${newStatus}`);
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.developerOrVendor.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'pending') return matchesSearch && r.status === 'PENDING';
    if (activeTab === 'accepted') return matchesSearch && r.status === 'ACCEPTED';
    if (activeTab === 'rejected') return matchesSearch && r.status === 'REJECTED';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-amber-400" />
            <span>Property Pricing & Direct Offer Negotiation Requests</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage buyer price counter-offers, token downpayment approvals, and direct builder concessions.
          </p>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pending' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending ({requests.filter((r) => r.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'accepted' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Accepted ({requests.filter((r) => r.status === 'ACCEPTED').length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'rejected' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rejected ({requests.filter((r) => r.status === 'REJECTED').length})
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search by ID, property or buyer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white"
        />
      </div>

      {/* REQUESTS TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#1E293B]/60 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="p-3.5">Offer #</th>
              <th className="p-3.5">Property & Builder</th>
              <th className="p-3.5">Prospective Buyer</th>
              <th className="p-3.5">List Price vs Offer</th>
              <th className="p-3.5">Payment Terms</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Decision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                  No pricing counter-offers or discount requests received yet.
                </td>
              </tr>
            ) : (
              filteredRequests.map((r) => {
              const diffPercent = (((r.offeredPrice - r.basePrice) / r.basePrice) * 100).toFixed(1);
              return (
                <tr key={r.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-mono font-bold text-amber-400">{r.requestId}</td>
                  <td className="p-3.5 max-w-xs">
                    <div className="font-semibold text-white truncate">{r.propertyTitle}</div>
                    <div className="text-[11px] text-slate-400">{r.developerOrVendor}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-slate-200">{r.buyerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{r.buyerPhone}</div>
                  </td>
                  <td className="p-3.5 font-mono">
                    <div className="text-slate-400 line-through text-[11px]">
                      ₹{(r.basePrice / 100000).toFixed(2)} L
                    </div>
                    <div className="text-white font-bold text-xs flex items-center gap-1.5">
                      <span>₹{(r.offeredPrice / 100000).toFixed(2)} L</span>
                      <span className="text-[10px] text-rose-400">({diffPercent}%)</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-800 text-slate-300">
                      {r.paymentMode.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'ACCEPTED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : r.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {r.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'ACCEPTED')}
                          className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                          title="Accept Offer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(r.id, 'REJECTED')}
                          className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold"
                          title="Reject Offer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px]">Decided</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
