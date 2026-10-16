'use client';

import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  Download,
  Users,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useCrmLead } from '@/lib/crm/useCrmLead';

export type HighIntentModalType = 'callback' | 'brochure' | 'affiliate';

interface HighIntentCtaModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: HighIntentModalType;
  propertyTitle?: string;
  projectId?: string;
  brochureUrl?: string;
}

export function HighIntentCtaModal({
  isOpen,
  onClose,
  type = 'callback',
  propertyTitle = 'Luxury High-Rise Residencies',
  projectId,
  brochureUrl = '/brochure-preview.pdf',
}: HighIntentCtaModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [preferredSlot, setPreferredSlot] = useState('Within 15 Mins (Urgent)');
  const [honeypot, setHoneypot] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSuccessState, setIsSuccessState] = useState(false);

  const { submitLead, isSubmitting, error, resetState } = useCrmLead({
    onSuccess: (leadId) => {
      setIsSuccessState(true);
      setToastMessage('Thank you! Our representative will contact you shortly.');

      // If downloading brochure, simulate auto-download trigger
      if (type === 'brochure') {
        const link = document.createElement('a');
        link.href = '#';
        link.setAttribute('download', `${propertyTitle.replace(/\s+/g, '_')}_Brochure.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Auto-reset form fields
      setName('');
      setPhone('');
      setEmail('');
      setHoneypot('');

      setTimeout(() => {
        setIsSuccessState(false);
        setToastMessage(null);
        resetState();
        onClose();
      }, 2500);
    },
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage(null);

    const cleanDigits = phone.replace(/\D/g, '');
    const tenDigits = cleanDigits.slice(-10);
    if (!/^[6-9]\d{9}$/.test(tenDigits)) {
      setToastMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    let leadTag = 'High_Intent_CTA';
    let inquiryType = 'Request Callback';
    let message = `Requested callback slot: ${preferredSlot}`;

    if (type === 'brochure') {
      leadTag = 'Brochure_Download';
      inquiryType = 'Download Brochure';
      message = `Downloaded verified project brochure for ${propertyTitle}`;
    } else if (type === 'affiliate') {
      leadTag = 'Affiliate_Partner';
      inquiryType = 'Apply for Affiliate';
      message = `User applied for partner/affiliate onboarding via High-Intent CTA`;
    }

    await submitLead({
      name,
      phone: `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`,
      email,
      city,
      inquiryType,
      message,
      leadTag,
      propertyTitle,
      projectId,
      _hp: honeypot,
    });
  };

  const getModalConfig = () => {
    switch (type) {
      case 'brochure':
        return {
          icon: Download,
          badge: 'Instant PDF Download',
          title: `Download Brochure for ${propertyTitle}`,
          subtitle: 'Enter your verified details to instantly unlock the official project brochure and pricing sheet.',
          ctaText: 'Unlock & Download Brochure',
          accent: 'from-amber-500 to-yellow-500',
        };
      case 'affiliate':
        return {
          icon: Users,
          badge: 'Partner Program Fast-Track',
          title: 'Apply to Become a Verified Affiliate Partner',
          subtitle: 'Earn up to 2.5% to 3.5% commission on property bookings with instant payouts & real-time tracking.',
          ctaText: 'Submit Partner Application',
          accent: 'from-emerald-600 to-teal-600',
        };
      case 'callback':
      default:
        return {
          icon: PhoneCall,
          badge: 'Priority Concierge',
          title: 'Request an Immediate Callback',
          subtitle: 'Our certified real estate advisors will connect with you to answer questions and arrange VIP site visits.',
          ctaText: 'Confirm Callback Request',
          accent: 'from-[#D4AF37] to-[#F4C430]',
        };
    }
  };

  const cfg = getModalConfig();
  const IconComponent = cfg.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-neutral-900 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <IconComponent className="w-3.5 h-3.5" />
              {cfg.badge}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white pr-6">
            {cfg.title}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 leading-relaxed">
            {cfg.subtitle}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {/* Toast Notification */}
          {toastMessage && (
            <div
              role="status"
              className={`mb-6 p-4 rounded-xl flex items-start gap-3 transition-all ${
                isSuccessState
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border border-amber-200 text-amber-800'
              }`}
            >
              {isSuccessState ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-semibold">{toastMessage}</p>
                {type === 'brochure' && isSuccessState && (
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Your PDF brochure is downloading automatically...
                  </p>
                )}
              </div>
            </div>
          )}

          {error && !toastMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field */}
            <div className="sr-only" aria-hidden="true" style={{ display: 'none' }}>
              <input
                type="text"
                tabIndex={-1}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sen"
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Phone / WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-semibold text-neutral-500 select-none">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98200 12345"
                  disabled={isSubmitting}
                  className="w-full pl-16 pr-4 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Email Address {type === 'brochure' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="email"
                required={type === 'brochure'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>

            {/* Callback Slot (only for callback type) */}
            {type === 'callback' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Preferred Callback Time
                </label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
                >
                  <option value="Within 15 Mins (Urgent)">⚡ Within 15 Mins (Priority)</option>
                  <option value="Today (10 AM - 1 PM)">Today Morning (10 AM - 1 PM)</option>
                  <option value="Today (2 PM - 6 PM)">Today Afternoon (2 PM - 6 PM)</option>
                  <option value="Today Evening (6 PM - 9 PM)">Today Evening (6 PM - 9 PM)</option>
                  <option value="Tomorrow Morning">Tomorrow Morning</option>
                  <option value="Weekend Preferred">Weekend Preferred</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-neutral-900 bg-linear-to-r ${cfg.accent} hover:opacity-95 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-4`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
                  <span>Submitting inquiry...</span>
                </>
              ) : (
                <>
                  <IconComponent className="w-4 h-4" />
                  <span>{cfg.ctaText}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-neutral-400 text-center pt-2">
              Protected by TLS encryption & automated CRM synchronization. No promotional spam.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
