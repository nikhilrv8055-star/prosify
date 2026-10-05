'use client';

import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Percent,
  ShieldCheck,
  TrendingUp,
  X,
  ExternalLink,
} from 'lucide-react';
import { ChannelPartner } from '@/lib/types';
import { formatIndianPrice } from '@/lib/utils';
import { store } from '@/lib/data/store';

interface PartnersTabProps {
  partners: ChannelPartner[];
  onRefresh: () => void;
}

export function PartnersTab({ partners, onRefresh }: PartnersTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [newPartner, setNewPartner] = useState({
    name: '',
    companyName: '',
    email: 'partner@realty.in',
    phone: '+91 98200 99999',
    reraRegistrationNumber: 'A51700028912',
    tier: 'GOLD' as any,
    commissionRate: 2.5,
    panNumber: 'ABCDE1234F',
    gstNumber: '27ABCDE1234F1Z5',
  });

  const filtered = partners.filter((p) => {
    const q = searchTerm.toLowerCase();
    const name = p.name || p.partnerName || '';
    const company = p.companyName || '';
    const code = p.partnerCode || p.code || '';
    return (
      name.toLowerCase().includes(q) ||
      company.toLowerCase().includes(q) ||
      code.toLowerCase().includes(q)
    );
  });

  const handleCopyLink = (code: string) => {
    const link = `https://prosify.in/?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = (p: ChannelPartner) => {
    const nextStatus = p.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    store.updateChannelPartner(p.id, { status: nextStatus });
    onRefresh();
  };

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name) return;

    store.createChannelPartner({
      companyName: newPartner.companyName,
      partnerName: newPartner.name,
      email: newPartner.email,
      phone: newPartner.phone,
      address: 'Mumbai, Maharashtra',
      panNumber: newPartner.panNumber,
      gstNumber: newPartner.gstNumber,
      reraNumber: newPartner.reraRegistrationNumber,
    });

    setIsModalOpen(false);
    onRefresh();
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'DIAMOND':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'PLATINUM':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'GOLD':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#F59E0B]" />
            <span>Channel Partner (CP) Network & Commission Ledger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            MahaRERA certified broker network, dynamic commission slabs (2.0% - 3.5%), and referral attribution
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#F59E0B]/20 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Channel Partner</span>
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-slate-700 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search partner by name, agency, or CP code (e.g. CP101)..."
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Partners Table */}
      <div className="rounded-2xl bg-[#1E293B]/90 backdrop-blur-md border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700/80">
              <tr>
                <th className="py-3 px-4">CP Identity & Agency</th>
                <th className="py-3 px-4">MahaRERA & Tax IDs</th>
                <th className="py-3 px-4">Tier / Slab</th>
                <th className="py-3 px-4">Deals & Earned</th>
                <th className="py-3 px-4">Attribution Link</th>
                <th className="py-3 px-4 text-right">Status / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No channel partners registered yet. Click &quot;Register Channel Partner&quot; above to onboard an affiliate or agency.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                const partnerName = p.partnerName || p.name || 'Partner';
                const partnerCode = p.code || p.partnerCode || 'CP';
                const rera = p.reraNumber || p.reraRegistrationNumber || 'RERA Applied';
                const tier = p.tier || 'GOLD';
                const rate = p.commissionRate || 2.5;
                const bookings = p.bookingsCount || p.successfulBookings || 0;
                const leads = p.leadsCount || p.totalLeadsSubmitted || 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{partnerName}</div>
                      <div className="text-[11px] text-slate-400">
                        {p.companyName} • <span className="font-mono text-[#0EA5E9]">{partnerCode}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div className="text-amber-300 font-semibold">{rera}</div>
                      <div className="text-slate-500 text-[10px]">PAN: {p.panNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getTierBadge(tier)}`}>
                        {tier} ({rate}%)
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#10B981]">
                        {formatIndianPrice(p.totalCommissionEarned || 0)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {bookings} Bookings ({leads} Leads)
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleCopyLink(partnerCode)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 font-mono text-[11px]"
                        title="Copy Unique Attribution Link"
                      >
                        {copiedCode === partnerCode ? (
                          <>
                            <Check className="w-3 h-3 text-[#10B981]" />
                            <span className="text-[#10B981]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[#0EA5E9]" />
                            <span>?ref={partnerCode}</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          p.status === 'ACTIVE'
                            ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        {p.status}
                      </button>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Partner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#F59E0B]" />
                <span>Onboard Channel Partner</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPartner} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Partner / Proprietor Name *</label>
                  <input
                    type="text"
                    required
                    value={newPartner.name}
                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Agency / Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newPartner.companyName}
                    onChange={(e) => setNewPartner({ ...newPartner, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">MahaRERA Broker Registration</label>
                  <input
                    type="text"
                    required
                    value={newPartner.reraRegistrationNumber}
                    onChange={(e) => setNewPartner({ ...newPartner, reraRegistrationNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPartner.commissionRate}
                    onChange={(e) => setNewPartner({ ...newPartner, commissionRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">PAN Number</label>
                  <input
                    type="text"
                    value={newPartner.panNumber}
                    onChange={(e) => setNewPartner({ ...newPartner, panNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono uppercase focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={newPartner.gstNumber}
                    onChange={(e) => setNewPartner({ ...newPartner, gstNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono uppercase focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-slate-950 font-bold cursor-pointer">
                  Register Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
