'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  PhoneCall,
  Download,
  Users,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building2,
  Loader2,
  Send,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export type CrmActionType = 'Request Callback' | 'Download Brochure' | 'Apply for Affiliate';

interface CrmLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: CrmActionType;
  propertyTitle?: string;
  propertyId?: string;
  defaultCity?: string;
}

export function CrmLeadModal({
  isOpen,
  onClose,
  actionType,
  propertyTitle,
  propertyId,
  defaultCity = 'Mumbai',
}: CrmLeadModalProps) {
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(defaultCity);
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDone(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const digitsOnly = phone.replace(/\D/g, '');
    const cleanDigits =
      digitsOnly.length === 12 && digitsOnly.startsWith('91')
        ? digitsOnly.slice(2)
        : digitsOnly.length === 11 && digitsOnly.startsWith('0')
        ? digitsOnly.slice(1)
        : digitsOnly;

    if (!/^[6-9]\d{9}$/.test(cleanDigits)) {
      toast({
        title: 'Invalid Mobile Number',
        description: 'Please enter a valid 10-digit Indian mobile number.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const sourceUrl = typeof window !== 'undefined' ? window.location.href : 'https://prosify.in';
      const url = typeof window !== 'undefined' ? new URL(window.location.href) : null;

      const payload = {
        name: name.trim(),
        phone: cleanDigits,
        email: email.trim() || undefined,
        city,
        inquiryType: actionType.toUpperCase().replace(/\s+/g, '_'),
        highIntentAction: actionType,
        leadTag: `High_Intent_${actionType.replace(/\s+/g, '_')}`,
        propertyId,
        propertyTitle,
        sourceUrl,
        utmSource: url?.searchParams.get('utm_source') || url?.searchParams.get('ref') || undefined,
        utmMedium: url?.searchParams.get('utm_medium') || undefined,
        utmCampaign: url?.searchParams.get('utm_campaign') || undefined,
        honeypot,
      };

      const res = await fetch('/api/crm/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsDone(true);
        toast({
          title: 'Action Confirmed! 🚀',
          description: data.message || 'Our team will reach out with details.',
          type: 'success',
        });

        // If brochure download action, trigger simulated PDF download
        if (actionType === 'Download Brochure') {
          setTimeout(() => {
            const sampleBlob = new Blob(
              [
                `%PDF-1.4\nPROSIFY VERIFIED PROPERTY BROCHURE\nProject: ${
                  propertyTitle || 'Premier Luxury Township'
                }\nAuthorized RERA: MahaRERA Reg. A031332600766\nThank you for downloading directly via Prosify Marketplace.`,
              ],
              { type: 'application/pdf' }
            );
            const downloadUrl = URL.createObjectURL(sampleBlob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${(propertyTitle || 'Project').replace(/[^a-z0-9]/gi, '_')}_Brochure.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);
          }, 800);
        }
      } else {
        toast({
          title: 'Submission Issue',
          description: data.error || 'Please review your entry and try again.',
          type: 'error',
        });
      }
    } catch {
      toast({
        title: 'Network Issue',
        description: 'Unable to reach CRM pipeline. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalIcon =
    actionType === 'Request Callback' ? (
      <PhoneCall className="w-5 h-5 text-emerald-400" />
    ) : actionType === 'Download Brochure' ? (
      <Download className="w-5 h-5 text-cyan-400" />
    ) : (
      <Users className="w-5 h-5 text-amber-400" />
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#1E293B] border border-slate-700/80 p-6 sm:p-7 shadow-2xl relative text-slate-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isDone ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {actionType === 'Download Brochure' ? 'Brochure Download Ready!' : 'Callback Scheduled!'}
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              {actionType === 'Download Brochure'
                ? 'Your verified PDF brochure is downloading now. Our advisory team will also message you floor plans on WhatsApp.'
                : 'A dedicated relationship manager will call you within 15 minutes during business hours.'}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1120] font-black text-xs cursor-pointer shadow-md"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                {modalIcon}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{actionType}</h3>
                <p className="text-xs text-slate-400">
                  {propertyTitle ? (
                    <span className="truncate block max-w-[260px] text-emerald-400 font-medium">
                      {propertyTitle}
                    </span>
                  ) : (
                    'Instant priority VIP routing via Prosify'
                  )}
                </p>
              </div>
            </div>

            {/* Honeypot field */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Verma"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                WhatsApp / Mobile Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="text-xs font-bold text-slate-400 absolute left-3 top-2.5 font-mono">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9820144556"
                  className="w-full pl-11 pr-3 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address <span className="text-slate-500 text-[10px]">(For digital brochure copy)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                City Preference
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai, Pune, Nagpur, Nashik"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1120] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to CRM...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirm & {actionType}</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Spam Guarantee • 100% RERA Verified Inventory</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
