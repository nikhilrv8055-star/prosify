'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Phone,
  Mail,
  User,
  MapPin,
  IndianRupee,
  Home,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Send,
  MessageSquare,
  ArrowRight,
  Clock,
  FileText,
} from 'lucide-react';
import { getStoredAttribution } from '@/lib/attribution';
import { useToast } from '@/components/ui/toast';

interface PropertyRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLocation?: string;
  defaultPropertyType?: string;
  defaultBudget?: string;
  defaultBhk?: string;
}

export function PropertyRequirementModal({
  isOpen,
  onClose,
  defaultLocation = '',
  defaultPropertyType = 'Apartment / Flat',
  defaultBudget = '₹75 Lakh - ₹1.2 Cr',
  defaultBhk = '2 BHK',
}: PropertyRequirementModalProps) {
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [propertyType, setPropertyType] = useState(defaultPropertyType);
  const [location, setLocation] = useState(defaultLocation);
  const [budget, setBudget] = useState(defaultBudget);
  const [bhk, setBhk] = useState(defaultBhk);
  const [additionalRequirement, setAdditionalRequirement] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadReference, setLeadReference] = useState('');

  // Pre-fill / reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setLeadReference('');
      if (defaultLocation && !location) setLocation(defaultLocation);
      if (defaultBudget && !budget) setBudget(defaultBudget);
    }
  }, [isOpen, defaultLocation, defaultBudget]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const propertyTypeOptions = [
    'Apartment / Flat',
    'Villa / Bungalow',
    'Penthouse',
    'Residential Plot',
    'Commercial Office',
    'Retail Shop / Showroom',
  ];

  const popularLocations = [
    'Thane West',
    'Dombivli (Palava)',
    'Kalyan West',
    'Bandra / BKC',
    'Andheri East',
    'Pune (Baner/Hinjawadi)',
    'Navi Mumbai',
  ];

  const budgetPresets = [
    'Under ₹45 Lakh',
    '₹45 Lakh - ₹75 Lakh',
    '₹75 Lakh - ₹1.2 Cr',
    '₹1.2 Cr - ₹2.0 Cr',
    '₹2.0 Cr - ₹3.5 Cr',
    'Above ₹3.5 Cr',
  ];

  const bhkOptions = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK / Villa'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const cleanName = fullName.trim();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!cleanName || cleanName.length < 2) {
      toast({
        title: 'Please enter your Full Name',
        type: 'error',
      });
      return;
    }

    if (cleanPhone.length < 10) {
      toast({
        title: 'Please enter a valid 10-digit mobile number',
        type: 'error',
      });
      return;
    }

    if (!location.trim()) {
      toast({
        title: 'Please specify your Preferred Location / Area',
        type: 'error',
      });
      return;
    }

    if (!budget.trim()) {
      toast({
        title: 'Please select or enter your Budget',
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      // Capture UTMs from URL or stored attribution
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const stored = getStoredAttribution();
      const utmSource = urlParams?.get('utm_source') || stored?.utmSource || 'WEBSITE';
      const utmMedium = urlParams?.get('utm_medium') || stored?.utmMedium || 'BUY_REQUIREMENT_MODAL';
      const utmCampaign = urlParams?.get('utm_campaign') || stored?.utmCampaign || 'PURCHASE_DEMAND';
      const partnerCode = urlParams?.get('ref') || urlParams?.get('partner') || stored?.partnerCode;

      const payload = {
        name: cleanName,
        phone: cleanPhone.length === 10 ? `+91 ${cleanPhone}` : cleanPhone,
        email: email.trim(),
        source: partnerCode ? 'CHANNEL_PARTNER' : 'BUY_REQUIREMENT',
        partnerCode: partnerCode || undefined,
        partnerId: stored?.partnerId || undefined,
        partnerName: stored?.partnerName || undefined,
        propertyType,
        purpose: 'Buy',
        bhk,
        budget,
        location: location.trim(),
        requirement: `[BUY REQUIREMENT] Type: ${propertyType} | Config: ${bhk} | Area: ${location.trim()} | Budget: ${budget}. ${
          additionalRequirement ? `Additional: ${additionalRequirement.trim()}` : ''
        }`,
        notes: additionalRequirement.trim() || `Submitted via "Tell Us Your Property Requirement" modal on Prosify.`,
        utmSource,
        utmMedium,
        utmCampaign,
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setLeadReference(data.data?.id || `REQ-${Date.now().toString().slice(-6)}`);
        setSubmitted(true);
        toast({
          title: 'Requirement Registered Successfully!',
          description: 'A Prosify property advisor will connect with you shortly.',
          type: 'success',
        });
      } else {
        throw new Error(data.error?.message || 'Submission failed');
      }
    } catch (err: any) {
      toast({
        title: 'Submission Error',
        description: err.message || 'Could not submit your requirement. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-neutral-200 text-neutral-900 max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="requirement-modal-title"
      >
        {/* Header */}
        <div className="relative px-5 py-4 border-b border-neutral-100 bg-neutral-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4A017]/15 text-[#D4A017] border border-[#D4A017]/30 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-[#996515]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="requirement-modal-title" className="text-base sm:text-lg font-bold text-neutral-950 tracking-tight">
                  Tell Us Your Property Requirement
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                  Buy Only
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-normal">
                Direct developer inventory • Zero spam • Tailored verified options
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200/70 text-neutral-400 hover:text-neutral-700 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {submitted ? (
            /* SUCCESS STATE */
            <div className="py-6 sm:py-8 flex flex-col items-center text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>

              <div className="space-y-1.5 max-w-md">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  Requirement Ref #{leadReference}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950 pt-1">
                  Thank You, {fullName}!
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  We have registered your property-buying requirement across Maharashtra. Our senior investment specialist is matching direct developer inventory tailored to your criteria.
                </p>
              </div>

              {/* Requirement Recap Card */}
              <div className="w-full max-w-md bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 text-left text-xs space-y-2">
                <div className="font-bold text-neutral-800 border-b border-neutral-200/70 pb-1.5 flex items-center justify-between">
                  <span>Requirement Summary</span>
                  <span className="text-[10px] font-semibold text-[#996515] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Purpose: Buy (Purchase)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-neutral-600 pt-1">
                  <div>
                    <span className="text-[11px] text-neutral-400 block">Property Type</span>
                    <strong className="text-neutral-900">{propertyType}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 block">Configuration</span>
                    <strong className="text-neutral-900">{bhk}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 block">Preferred Area</span>
                    <strong className="text-neutral-900">{location}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 block">Budget Range</span>
                    <strong className="text-neutral-900">{budget}</strong>
                  </div>
                </div>
                {additionalRequirement && (
                  <div className="pt-2 border-t border-neutral-200/60">
                    <span className="text-[11px] text-neutral-400 block">Notes:</span>
                    <p className="text-neutral-700 text-[11px] italic mt-0.5 line-clamp-2">
                      &ldquo;{additionalRequirement}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              <div className="w-full max-w-md space-y-2.5 pt-2">
                <a
                  href="https://wa.me/919326303244?text=Hi%20Prosify,%20I%20just%20submitted%20my%20property%20buying%20requirement%20online."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Connect Instantly on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-colors"
                >
                  Done / Close
                </button>
              </div>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Purpose Banner: Buy (Fixed) */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-amber-950">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4A017] shrink-0" />
                  <span className="text-[11px] font-semibold">
                    Purpose: <strong className="font-extrabold text-neutral-900">Property Purchase / Buy</strong> (Fixed)
                  </span>
                </div>
                <span className="text-[10px] font-medium text-amber-800 bg-white/80 px-2 py-0.5 rounded border border-amber-300">
                  Zero Brokerage on New Launches
                </span>
              </div>

              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kulkarni"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-neutral-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="98200 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-900 tracking-wide"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Email Address <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-900"
                  />
                </div>
              </div>

              {/* Row 3: Property Type * */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Property Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {propertyTypeOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPropertyType(opt)}
                      className={`py-2 px-2.5 rounded-xl text-left text-xs font-semibold border transition-all ${
                        propertyType === opt
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Preferred Location / Area * */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Preferred Location / Area <span className="text-rose-500">*</span>
                </label>
                <div className="relative mb-2">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Thane Majiwada, Dombivli, Kalyan, Baner Pune..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-900"
                  />
                </div>
                {/* Location suggestion chips */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-neutral-400 py-0.5">Popular:</span>
                  {popularLocations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocation(loc)}
                      className={`text-[11px] px-2 py-0.5 rounded-lg border font-medium transition-colors ${
                        location === loc
                          ? 'bg-[#D4A017]/20 border-[#D4A017] text-neutral-950 font-bold'
                          : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 5: Budget * & BHK Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    Budget Range <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-900"
                  >
                    {budgetPresets.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    BHK / Configuration
                  </label>
                  <select
                    value={bhk}
                    onChange={(e) => setBhk(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-900"
                  >
                    {bhkOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 6: Additional Requirement */}
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Additional Requirement <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Ready to move or under-construction, higher floor, vaastu compliant, balcony, home loan pre-approved with SBI..."
                  value={additionalRequirement}
                  onChange={(e) => setAdditionalRequirement(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-900"
                />
              </div>

              {/* Security note & submit button */}
              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Privacy & Zero Spam Guarantee
                  </span>
                  <span className="text-neutral-400">Direct Developer Tie-ups</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Requirement...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#D4A017]" />
                      <span>Submit Requirement</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
