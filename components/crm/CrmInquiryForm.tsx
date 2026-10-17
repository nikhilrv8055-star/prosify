'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  User,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Building2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface CrmInquiryFormProps {
  defaultInquiryType?: string;
  propertyTitle?: string;
  propertyId?: string;
  leadTag?: string;
  cityDefault?: string;
  compact?: boolean;
  onSuccess?: (leadId: string) => void;
}

const TOP_CITIES = [
  'Mumbai',
  'Pune',
  'Nagpur',
  'Nashik',
  'Thane',
  'Navi Mumbai',
  'Chhatrapati Sambhajinagar',
  'Solapur',
  'Kolhapur',
  'Other Maharashtra City',
];

const INQUIRY_TYPES = [
  'General Advisory & Search',
  'Pre-Launch Developer Discounts',
  'Site Visit Cab Booking',
  'Channel Partner / Broker Onboarding',
  'Home Loan & Deed Assistance',
  'NRI High-Yield Investment',
];

export function CrmInquiryForm({
  defaultInquiryType = 'General Advisory & Search',
  propertyTitle,
  propertyId,
  leadTag = 'Contact_Inquiry',
  cityDefault = 'Mumbai',
  compact = false,
  onSuccess,
}: CrmInquiryFormProps) {
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(cityDefault);
  const [inquiryType, setInquiryType] = useState(defaultInquiryType);
  const [message, setMessage] = useState('');

  // Honeypot spam trap (hidden from humans, bots autofill it)
  const [honeypot, setHoneypot] = useState('');

  // Automatically captured metadata
  const [metadata, setMetadata] = useState<{
    sourceUrl: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
  }>({
    sourceUrl: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);

  // Capture URL & UTM parameters on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      setMetadata({
        sourceUrl: window.location.href,
        utmSource: url.searchParams.get('utm_source') || url.searchParams.get('ref') || '',
        utmMedium: url.searchParams.get('utm_medium') || '',
        utmCampaign: url.searchParams.get('utm_campaign') || '',
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Indian Phone Validation Check
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
        description: 'Please enter a valid 10-digit Indian mobile number (e.g. 9820144556).',
        type: 'error',
      });
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast({
        title: 'Invalid Email Address',
        description: 'Please provide a valid email format (e.g. name@example.com).',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: fullName.trim(),
        phone: cleanDigits,
        email: email.trim() || undefined,
        city: city || 'Mumbai',
        inquiryType,
        message: message.trim() || undefined,
        leadTag,
        propertyId,
        propertyTitle,
        sourceUrl: metadata.sourceUrl,
        utmSource: metadata.utmSource || undefined,
        utmMedium: metadata.utmMedium || undefined,
        utmCampaign: metadata.utmCampaign || undefined,
        honeypot, // Spam honeypot
      };

      const res = await fetch('/api/crm/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast({
          title: 'Inquiry Submitted! 🎉',
          description: data.message || 'Thank you! Our representative will contact you shortly.',
          type: 'success',
        });

        setSubmittedLeadId(data.leadId);
        if (onSuccess) onSuccess(data.leadId);

        // Auto-reset form
        setFullName('');
        setPhone('');
        setEmail('');
        setMessage('');
      } else {
        toast({
          title: 'Submission Failed',
          description: data.error || 'Please review your entries and try again.',
          type: 'error',
        });
      }
    } catch {
      toast({
        title: 'Network Error',
        description: 'Unable to reach the CRM pipeline. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {submittedLeadId ? (
        <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">Inquiry Received & Synced!</h4>
          <p className="text-xs text-neutral-300 max-w-sm mx-auto">
            Your inquiry has been successfully captured and routed to our dedicated real estate advisor. Reference Lead ID:{' '}
            <strong className="font-mono text-emerald-400">{submittedLeadId}</strong>.
          </p>
          <button
            type="button"
            onClick={() => setSubmittedLeadId(null)}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold cursor-pointer"
          >
            Submit Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot Spam Trap (Visually Hidden) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="crm-website-trap">Leave this field blank</label>
            <input
              type="text"
              id="crm-website-trap"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {propertyTitle && (
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-2 text-xs text-neutral-300">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">
                Inquiring about: <strong className="text-white">{propertyTitle}</strong>
              </span>
            </div>
          )}

          {/* Full Name & Phone */}
          <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} gap-3`}>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Amit Sharma"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                WhatsApp / Mobile Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="text-xs font-bold text-neutral-400 absolute left-3 top-2.5 font-mono">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9820144556"
                  className="w-full pl-11 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Email & City */}
          <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} gap-3`}>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Email Address <span className="text-neutral-500 text-[10px]">(Optional)</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. amit@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Target City <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                >
                  {TOP_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Inquiry Type */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Inquiry Category
            </label>
            <select
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              {INQUIRY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Message / Requirements */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Requirement Details / Questions
            </label>
            <textarea
              rows={compact ? 2 : 3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Looking for 3 BHK under 2.5 Cr with immediate possession in Kandivali East..."
              className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1120] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting inquiry...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Inquiry & Request Callback</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Brokerage & RERA Certified</span>
            </span>
            <span className="text-[10px] text-neutral-500">Auto-synced to CRM</span>
          </div>
        </form>
      )}
    </div>
  );
}
