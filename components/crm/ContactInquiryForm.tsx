'use client';

import React, { useState } from 'react';
import {
  Send,
  Loader2,
  CheckCircle2,
  Phone,
  Mail,
  User,
  MapPin,
  MessageSquare,
  AlertCircle,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useCrmLead } from '@/lib/crm/useCrmLead';

interface ContactInquiryFormProps {
  defaultCity?: string;
  defaultInquiryType?: string;
  propertyTitle?: string;
  projectId?: string;
  className?: string;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export function ContactInquiryForm({
  defaultCity = 'Mumbai',
  defaultInquiryType = 'General Inquiry',
  propertyTitle,
  projectId,
  className = '',
  onSuccess,
  title = 'Get in Touch with Our Real Estate Specialists',
  subtitle = 'Inquire about verified properties, schedule priority site visits, or get personalized investment guidance.',
  compact = false,
}: ContactInquiryFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(defaultCity);
  const [inquiryType, setInquiryType] = useState(defaultInquiryType);
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam honeypot
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { submitLead, isSubmitting, error, resetState } = useCrmLead({
    onSuccess: () => {
      // Form auto-reset upon successful submission
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setHoneypot('');
      setToastMessage('Thank you! Our representative will contact you shortly.');

      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage(null);

    // Validate 10-digit Indian phone
    const cleanDigits = phone.replace(/\D/g, '');
    const tenDigits = cleanDigits.slice(-10);
    if (!/^[6-9]\d{9}$/.test(tenDigits)) {
      setToastMessage('Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).');
      return;
    }

    await submitLead({
      name,
      email,
      phone: `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`,
      city,
      inquiryType,
      message,
      leadTag: 'Contact_Inquiry',
      propertyTitle,
      projectId,
      _hp: honeypot, // Honeypot field for bot spam deterrence
    });
  };

  return (
    <div className={`bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 sm:p-8 ${className}`}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-6 p-4 rounded-xl flex items-start gap-3 transition-all ${
            toastMessage.includes('Thank you')
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border border-amber-200 text-amber-800'
          }`}
        >
          {toastMessage.includes('Thank you') ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="text-sm font-medium">{toastMessage}</div>
        </div>
      )}

      {/* Backend API Error Banner */}
      {error && !toastMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm">{error}</div>
        </div>
      )}

      {!compact && (
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5A880] mb-1">
            <ShieldCheck className="w-4 h-4" />
            Verified Direct CRM Dispatch
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">{title}</h3>
          <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Anti-Spam Honeypot Field (Visually Hidden, Offscreen) */}
        <div className="sr-only" aria-hidden="true" style={{ display: 'none' }}>
          <label htmlFor="website_hp">Leave this field blank</label>
          <input
            id="website_hp"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vikram Malhotra"
              disabled={isSubmitting}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50/50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 focus:border-[#C5A880] transition-all disabled:opacity-60"
            />
          </div>
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vikram@example.com"
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50/50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 focus:border-[#C5A880] transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Phone / WhatsApp */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Phone / WhatsApp <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-semibold text-neutral-500 select-none">
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
                className="w-full pl-16 pr-4 py-2.5 text-sm bg-neutral-50/50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 focus:border-[#C5A880] transition-all disabled:opacity-60 font-mono"
              />
            </div>
          </div>
        </div>

        {/* City & Inquiry Type Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50/50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 focus:border-[#C5A880] transition-all disabled:opacity-60 appearance-none cursor-pointer"
              >
                <option value="Mumbai">Mumbai MMR</option>
                <option value="Thane">Thane</option>
                <option value="Navi Mumbai">Navi Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Nashik">Nashik</option>
                <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                <option value="Kolhapur">Kolhapur</option>
                <option value="Other">Other Maharashtra City</option>
              </select>
            </div>
          </div>

          {/* Inquiry Type */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Inquiry Type
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50/50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 focus:border-[#C5A880] transition-all disabled:opacity-60 appearance-none cursor-pointer"
              >
                <option value="General Inquiry">General Property Inquiry</option>
                <option value="Site Visit Request">Schedule VIP Site Visit</option>
                <option value="Price & Payment Plan">Price Sheet & Payment Plan</option>
                <option value="Download Brochure">Download Verified Brochure</option>
                <option value="Request Callback">Request Immediate Callback</option>
                <option value="Affiliate Partnership">Affiliate / Partner Inquiry</option>
              </select>
            </div>
          </div>
        </div>

        {/* Message / Requirements */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            Message / Specific Requirements
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Interested in 2 or 3 BHK near Metro station with possession by end of 2026..."
              disabled={isSubmitting}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50/50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A880]/30 focus:border-[#C5A880] transition-all disabled:opacity-60 resize-none"
            />
          </div>
        </div>

        {/* Submit Button with Loading State */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-neutral-900 bg-linear-to-r from-[#D4AF37] to-[#F4C430] hover:from-[#C5A880] hover:to-[#E5B520] shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
              <span>Submitting inquiry...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Inquiry</span>
            </>
          )}
        </button>

        {/* Anti-spam and Privacy disclaimer */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 text-center pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero-spam guarantee. Data securely synced to CRM over TLS 1.3 encryption.</span>
        </div>
      </form>
    </div>
  );
}
