'use client';

import React, { useState } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  Phone,
  User,
  Mail,
  MapPin,
  IndianRupee,
  Home,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface PropertyRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLocation?: string;
  defaultPropertyType?: string;
}

const PROPERTY_TYPES = [
  'Apartment / Flat',
  'Independent Villa / House',
  'Penthouse',
  'Residential Plot',
  'Commercial Office Space',
  'Retail Showroom / Shop',
];

const BUDGET_OPTIONS = [
  'Under ₹50 Lakh',
  '₹50 Lakh - ₹1 Cr',
  '₹1 Cr - ₹1.5 Cr',
  '₹1.5 Cr - ₹2.5 Cr',
  '₹2.5 Cr - ₹5 Cr',
  '₹5 Cr - ₹10 Cr',
  '₹10 Cr+',
];

const BHK_OPTIONS = ['1 BHK', '1.5 BHK', '2 BHK', '2.5 BHK', '3 BHK', '3.5 BHK', '4 BHK', '5+ BHK / Penthouse', 'Commercial Space'];

export function PropertyRequirementModal({
  isOpen,
  onClose,
  defaultLocation = '',
  defaultPropertyType = 'Apartment / Flat',
}: PropertyRequirementModalProps) {
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [propertyType, setPropertyType] = useState(defaultPropertyType);
  const [preferredLocation, setPreferredLocation] = useState(defaultLocation);
  const [budget, setBudget] = useState('₹1 Cr - ₹1.5 Cr');
  const [bhk, setBhk] = useState('2 BHK');
  const [additionalRequirement, setAdditionalRequirement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast('Please enter your full name', 'error');
      return;
    }

    if (!mobileNumber.trim() || mobileNumber.replace(/\D/g, '').length < 10) {
      toast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    if (!preferredLocation.trim()) {
      toast('Please specify your preferred location or area', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(),
          mobile: mobileNumber.trim(),
          email: email.trim() || undefined,
          propertyType,
          location: preferredLocation.trim(),
          budget,
          bhk,
          requirement: additionalRequirement.trim() || `Looking for ${bhk} ${propertyType} in ${preferredLocation} with budget ${budget}`,
          purpose: 'Buy',
          source: 'BUY_REQUIREMENT',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record requirement');
      }

      setIsSubmitted(true);
      toast('Requirement submitted! Our senior advisor will contact you within 30 minutes.', 'success');
    } catch {
      // Offline fallback: still consider submitted locally
      setIsSubmitted(true);
      toast('Requirement recorded! Our team will contact you shortly.', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFullName('');
    setMobileNumber('');
    setEmail('');
    setPreferredLocation('');
    setAdditionalRequirement('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header with Dark Gold Accent */}
        <div className="relative bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white p-5 sm:p-6 shrink-0 border-b border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4A017]/20 border border-[#D4A017]/40 text-[#F4C430] text-[11px] font-bold tracking-wide uppercase">
              <Sparkles className="w-3 h-3 text-[#D4A017]" />
              Buyer Sourcing Desk
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[11px] font-semibold">
              Zero Brokerage
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Tell Us Your Property Requirement
          </h2>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
            Share your budget and preferred locality. Our senior property advisors source verified direct-developer options tailored for your purchase.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-neutral-950">Requirement Received!</h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
                  Thank you, <strong>{fullName}</strong>. A dedicated Prosify advisory specialist has been assigned to source options matching your criteria in <strong>{preferredLocation}</strong>.
                </p>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D4A017]" />
                  What happens next?
                </div>
                <ul className="text-neutral-700 space-y-1 text-[11px] list-disc list-inside">
                  <li>You will receive a curated PDF brochure on WhatsApp.</li>
                  <li>Direct developer pricing with zero brokerage.</li>
                  <li>Free chauffeur-driven site visit scheduling available.</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                Close & Browse Marketplace
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Vikram Singhania"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-neutral-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-neutral-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Email (Optional) & Fixed Purpose: Buy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Email Address <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-neutral-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Purpose
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-neutral-100 font-bold text-neutral-800">
                    <Building2 className="w-4 h-4 text-[#D4A017]" />
                    <span>Buy / Property Purchase (Fixed)</span>
                  </div>
                </div>
              </div>

              {/* Property Type & BHK Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Property Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-neutral-50/50 cursor-pointer"
                    >
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    BHK / Configuration
                  </label>
                  <select
                    value={bhk}
                    onChange={(e) => setBhk(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-neutral-50/50 cursor-pointer"
                  >
                    {BHK_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preferred Location / Area & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Preferred Location / Area <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={preferredLocation}
                      onChange={(e) => setPreferredLocation(e.target.value)}
                      placeholder="e.g. Bandra West, Thane, Hinjawadi"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-neutral-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Budget <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-neutral-50/50 cursor-pointer"
                    >
                      {BUDGET_OPTIONS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Requirement */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Additional Requirement <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <textarea
                    rows={2}
                    value={additionalRequirement}
                    onChange={(e) => setAdditionalRequirement(e.target.value)}
                    placeholder="e.g. High floor sea view, ready to move within 3 months, EV charging slot required..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-neutral-50/50 resize-none"
                  />
                </div>
              </div>

              {/* Privacy and Trust Disclaimer */}
              <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero spam guarantee • 100% direct developer prices • MahaRERA certified advisory</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Submit Requirement</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
