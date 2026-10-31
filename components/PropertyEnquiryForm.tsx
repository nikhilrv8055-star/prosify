'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Send,
  CheckCircle2,
  Phone,
  User,
  Mail,
  Calendar,
  Sparkles,
  Building2,
  Clock,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';

interface PropertyEnquiryFormProps {
  propertyId?: string;
  propertyTitle?: string;
  projectId?: string;
  projectName?: string;
  location?: string;
  priceRange?: string;
  compact?: boolean;
  onSuccess?: (leadData: any) => void;
}

export function PropertyEnquiryForm({
  propertyId,
  propertyTitle = 'Luxury Residential Project',
  projectId,
  projectName,
  location = 'Mumbai Metropolitan Region',
  priceRange,
  compact = false,
  onSuccess,
}: PropertyEnquiryFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState('₹75L - ₹1.5Cr');
  const [scheduleVisit, setScheduleVisit] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [notes, setNotes] = useState('');
  const [affiliateRef, setAffiliateRef] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract referral cookie or fallback to URL / localStorage
  useEffect(() => {
    let code: string | null = null;

    // 1. Check cookies for prosify_ref
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)prosify_ref=([^;]+)/);
      if (match && match[1]) {
        code = decodeURIComponent(match[1]);
      }
    }

    // 2. Fallback to URL search param
    if (!code && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      code = urlParams.get('ref') || urlParams.get('partner') || urlParams.get('cp');
    }

    // 3. Fallback to localStorage
    if (!code && typeof window !== 'undefined') {
      code = localStorage.getItem('prosify_ref') || localStorage.getItem('prosify_partner_ref');
    }

    if (code) {
      setAffiliateRef(code);
      try {
        localStorage.setItem('prosify_ref', code);
      } catch {
        // Ignore storage errors in sandbox
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate phone number (10 digits)
    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    if (cleanedPhone.length < 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        phone: cleanedPhone.slice(-10),
        email: email.trim() || undefined,
        propertyId: propertyId || undefined,
        propertyTitle: propertyTitle || projectName,
        projectId: projectId || undefined,
        projectName: projectName || propertyTitle,
        budget,
        location,
        hasSiteVisitRequest: scheduleVisit,
        notes: scheduleVisit && visitDate ? `Site Visit Date: ${visitDate}. ${notes}` : notes || undefined,
        partnerCode: affiliateRef || undefined,
        source: affiliateRef ? 'CHANNEL_PARTNER' : 'WEBSITE',
        utmSource: affiliateRef ? `affiliate_${affiliateRef}` : undefined,
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message || 'Failed to submit enquiry.');
      }

      setSubmitted(true);
      if (onSuccess) {
        onSuccess(data.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 text-center text-white backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40 animate-pulse">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          Enquiry Registered Successfully!
        </h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto mb-5 leading-relaxed">
          Thank you, <strong className="text-white">{name}</strong>. A dedicated Prosify Senior Relationship Manager
          has been assigned to your request for <strong className="text-amber-300">{projectName || propertyTitle}</strong>.
        </p>

        {affiliateRef && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Attributed to Affiliate Partner ID: <span className="font-mono font-bold">{affiliateRef}</span>
          </div>
        )}

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 text-xs text-slate-400 space-y-2 mb-6">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> Guaranteed Callback:
            </span>
            <span className="font-semibold text-emerald-400">Within 15 Minutes</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> RERA Protection:
            </span>
            <span className="font-mono text-slate-400">MahaRERA Reg. A031332600766</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/919324908055?text=${encodeURIComponent(
              `Hello Prosify Team, I just submitted an enquiry for ${projectName || propertyTitle}. My name is ${name}. Please share floor plans and price sheet.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-lg shadow-emerald-900/30"
          >
            <MessageCircle className="w-4 h-4" />
            Instant WhatsApp Connect
          </a>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setName('');
              setPhone('');
              setEmail('');
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 sm:p-7 text-white backdrop-blur-md shadow-2xl relative ${
        compact ? 'max-w-md' : 'max-w-lg'
      }`}
    >
      {/* Partner Attribution Banner */}
      {affiliateRef && (
        <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <p className="text-amber-200 font-semibold">Verified Partner Referral Active</p>
              <p className="text-slate-400 text-[11px]">
                Partner ID: <span className="font-mono text-amber-300">{affiliateRef}</span> • ProReward™ Deal Protected
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold tracking-wider uppercase">
            VIP Priority
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Building2 className="w-3.5 h-3.5" />
          <span>Direct Developer Allocation • 0% Brokerage</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
          Request Floor Plans & Best Offer
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {projectName || propertyTitle} {priceRange ? `• ${priceRange}` : ''}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rajesh Sharma"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp / Mobile Number *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs font-medium">
              +91
            </div>
            <input
              type="tel"
              required
              maxLength={12}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98765 43210"
              className="w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 text-sm outline-none transition-all font-mono"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">We respect privacy. No spam or cold calls guaranteed.</p>
        </div>

        {/* Email Address (Optional) */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Email Address <span className="text-slate-500">(for official PDF brochure)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rajesh@example.com"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Budget Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Investment / Buying Budget</label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-amber-400 text-white text-sm outline-none"
          >
            <option value="Under ₹50 Lakh">Under ₹50 Lakh</option>
            <option value="₹50L - ₹75L">₹50 Lakh - ₹75 Lakh</option>
            <option value="₹75L - ₹1.5Cr">₹75 Lakh - ₹1.50 Crore</option>
            <option value="₹1.5Cr - ₹2.5Cr">₹1.50 Crore - ₹2.50 Crore</option>
            <option value="₹2.5Cr - ₹5.0Cr">₹2.50 Crore - ₹5.00 Crore</option>
            <option value="Above ₹5.0 Crore">Above ₹5.00 Crore (Ultra Luxury)</option>
          </select>
        </div>

        {/* Site Visit Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={scheduleVisit}
              onChange={(e) => setScheduleVisit(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-400 focus:ring-offset-slate-900 bg-slate-950"
            />
            <span>
              Schedule a Complimentary VIP Site Visit (Includes free AC cab pickup & drop)
            </span>
          </label>

          {scheduleVisit && (
            <div className="mt-2.5 pl-6">
              <label className="block text-[11px] text-slate-400 mb-1">Preferred Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700 text-white text-xs outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              Securing Official Price...
            </span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Get Detailed Brochure & VIP Price Quote</span>
            </>
          )}
        </button>

        {/* RERA Footer Trust Bar */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            10-Year RERA Advocacy
          </span>
          <span className="font-mono text-slate-500">MahaRERA: A031332600766</span>
        </div>
      </form>
    </div>
  );
}
export default PropertyEnquiryForm;
