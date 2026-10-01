'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Save,
  CheckCircle2,
  Shield,
  CreditCard,
} from 'lucide-react';
import { PortalUser } from '@/lib/auth/portalUsers';

interface EditProfileTabProps {
  session: PortalUser;
  onUpdateProfile: (updatedData: {
    name: string;
    companyOrProject: string;
    phone: string;
    email: string;
    address: string;
    gstin: string;
    reraNumber: string;
    bankAccount: string;
    ifscCode: string;
  }) => void;
}

export function EditProfileTab({ session, onUpdateProfile }: EditProfileTabProps) {
  const [formData, setFormData] = useState({
    name: session.name || 'BuildTech Smart Materials & Engineering',
    companyOrProject: session.companyOrProject || 'BuildTech Materials Ltd',
    phone: session.phone || '+91 98201 55678',
    email: session.username || 'vendor@eni.com',
    address: 'Unit 402, Trade World B-Wing, Senapati Bapat Marg, Lower Parel, Mumbai',
    city: 'Mumbai - 400013',
    gstin: '27AABCB1234F1Z5',
    reraNumber: 'PRM/KA/RERA/1251/310',
    bankAccount: '91823901928471 (HDFC Bank Ltd)',
    ifscCode: 'HDFC0000128',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-sky-400" />
          <span>Vendor Enterprise Profile & KYC Verification</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Update registered business details, contact information, GSTIN, and escrow payout bank coordinates.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Profile changes saved successfully! Company credentials updated across platform.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-[#1E293B]/80 border border-slate-700 shadow-xl space-y-6">
        {/* SECTION 1: PRIMARY BUSINESS IDENTITY */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4" />
            <span>Business Entity Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Company / Entity Name *</label>
              <input
                type="text"
                required
                value={formData.companyOrProject}
                onChange={(e) => setFormData({ ...formData, companyOrProject: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Primary Contact Person *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Official Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Mobile Phone (Direct / WhatsApp) *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: STATUTORY & LEGAL KYC */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Taxation & Real Estate Registrations</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">GSTIN Number *</label>
              <input
                type="text"
                required
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-cyan-300 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">RERA Promoter / Entity ID</label>
              <input
                type="text"
                value={formData.reraNumber}
                onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Registered Office Address</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-xs"
            />
          </div>
        </div>

        {/* SECTION 3: ESCROW BANK PAYOUT COORDINATES */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span>Escrow & Payout Bank Account</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Bank Name & Account Number</label>
              <input
                type="text"
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">IFSC Code</label>
              <input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
