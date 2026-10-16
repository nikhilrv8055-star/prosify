'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Phone,
  Mail,
  User,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Send,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
  BadgeCheck,
  FileCheck2,
  Home,
  Check,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { useToast } from '@/components/ui/toast';
import { getStoredAttribution } from '@/lib/attribution';
import { brandConfig } from '@/src/config/brand';
import { store } from '@/lib/data/store';

export default function PostRequirementPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment / Flat');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('₹75 Lakh - ₹1.2 Cr');
  const [bhk, setBhk] = useState('2 BHK');
  const [possession, setPossession] = useState('Ready to Move');
  const [purpose, setPurpose] = useState<'Self Use' | 'Investment'>('Self Use');
  const [additionalRequirement, setAdditionalRequirement] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadReference, setLeadReference] = useState('');

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
    'Navi Mumbai (Kharghar)',
    'Panvel',
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
  const possessionOptions = ['Ready to Move', 'Within 3-6 Months', 'Within 1 Year', 'Under Construction (2+ Years)'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = fullName.trim();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!cleanName || cleanName.length < 2) {
      toast({
        title: 'Full Name Required',
        description: 'Please enter your name.',
        type: 'error',
      });
      return;
    }

    if (cleanPhone.length < 10) {
      toast({
        title: 'Invalid Mobile Number',
        description: 'Please enter a valid 10-digit mobile number.',
        type: 'error',
      });
      return;
    }

    if (!location.trim()) {
      toast({
        title: 'Location Required',
        description: 'Please specify your preferred area or city.',
        type: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const stored = getStoredAttribution();
      const utmSource = urlParams?.get('utm_source') || stored?.utmSource || 'WEBSITE';
      const utmMedium = urlParams?.get('utm_medium') || stored?.utmMedium || 'POST_REQUIREMENT_PAGE';
      const utmCampaign = urlParams?.get('utm_campaign') || stored?.utmCampaign || 'DIRECT_DEMAND';
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
        purpose: `Buy (${purpose})`,
        bhk,
        budget,
        location: location.trim(),
        requirement: `[BUY REQUIREMENT] Type: ${propertyType} | Config: ${bhk} | Area: ${location.trim()} | Budget: ${budget} | Possession: ${possession} | Purpose: ${purpose}. ${
          additionalRequirement ? `Additional: ${additionalRequirement.trim()}` : ''
        }`,
        notes: `Possession: ${possession} | ${additionalRequirement.trim() || 'Submitted via Post Requirement Page.'}`,
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
        if (data.data) {
          store.ingestLead(data.data);
        }
        const refId = data.data?.id || `REQ-${Date.now().toString().slice(-6)}`;
        setLeadReference(refId);
        setSubmitted(true);
        toast({
          title: 'Requirement Registered!',
          description: 'Our senior property specialist will match certified developer units for you.',
          type: 'success',
        });
      } else {
        throw new Error(data.error?.message || 'Submission failed');
      }
    } catch (err: any) {
      toast({
        title: 'Error Submitting Requirement',
        description: err.message || 'Please check your internet connection and try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Prosify Team, I submitted my property requirement (Ref #${leadReference || 'WEBSITE'}):
• Name: ${fullName}
• Property: ${propertyType} (${bhk})
• Preferred Location: ${location}
• Budget: ${budget}
• Possession: ${possession}
Please share direct developer brochures and available floor plans.`
  );

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-neutral-950 text-white py-12 lg:py-16 border-b border-neutral-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#D4A017_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#D4A017]/20 text-[#F4C430] border border-[#D4A017]/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tell Us Your Requirement • Direct Developer Advisory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Looking for Your Dream Property in Maharashtra?
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Submit your specific property criteria below. We search direct developer inventories, unlock pre-launch prices, and connect you with RERA-registered verified homes.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-neutral-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#D4A017]" /> Zero Brokerage on New Launches
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4A017]" /> 100% MahaRERA Verified
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#D4A017]" /> Guaranteed Response within 15 mins
            </span>
          </div>
        </div>
      </section>

      {/* Main Container Form */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-neutral-200/80 p-6 sm:p-10">
          {submitted ? (
            /* SUCCESS RECAP */
            <div className="py-8 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>

              <div className="space-y-2 max-w-lg">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Requirement Ref #{leadReference}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-950">
                  Thank You, {fullName}!
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Your property requirement has been registered on Prosify. Our senior relationship manager has been assigned to prepare verified unit matches for you.
                </p>
              </div>

              {/* Requirement Recap Card */}
              <div className="w-full max-w-md bg-neutral-50 rounded-2xl p-5 border border-neutral-200 text-left space-y-3">
                <div className="font-bold text-xs text-neutral-800 border-b border-neutral-200 pb-2 flex items-center justify-between">
                  <span>Requirement Summary</span>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                    Direct Builder Sync
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
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
                  <div>
                    <span className="text-[11px] text-neutral-400 block">Possession</span>
                    <strong className="text-neutral-900">{possession}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 block">Purpose</span>
                    <strong className="text-neutral-900">{purpose}</strong>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-md space-y-3 pt-2">
                <a
                  href={`https://wa.me/919167991679?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFullName('');
                    setPhone('');
                    setLocation('');
                    setAdditionalRequirement('');
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-colors"
                >
                  Submit Another Requirement
                </button>
              </div>
            </div>
          ) : (
            /* FORM */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-xl font-bold text-neutral-900">
                  Client Property Requirement Form
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Fill in your details and requirements. We do not sell your data; our advisors curate direct builder options for you.
                </p>
              </div>

              {/* Purpose Selection */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-2">
                  Buying Purpose <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Self Use', label: 'Self Use / Family Residence' },
                    { id: 'Investment', label: 'Investment / High Rental Yield' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPurpose(p.id as any)}
                      className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all text-center ${
                        purpose === p.id
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-bold text-neutral-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="98200 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-900 tracking-wide"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Email Address <span className="text-neutral-400 font-normal">(Optional for brochure dispatch)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-900"
                  />
                </div>
              </div>

              {/* Property Type Grid */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-2">
                  Property Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {propertyTypeOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPropertyType(opt)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-left ${
                        propertyType === opt
                          ? 'bg-[#171717] text-white border-neutral-950 shadow-xs'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuration BHK & Possession */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    BHK Configuration
                  </label>
                  <select
                    value={bhk}
                    onChange={(e) => setBhk(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-900"
                  >
                    {bhkOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Possession Timeline
                  </label>
                  <select
                    value={possession}
                    onChange={(e) => setPossession(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-900"
                  >
                    {possessionOptions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preferred Location with Popular Chips */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Preferred Location / Locality <span className="text-rose-500">*</span>
                </label>
                <div className="relative mb-2">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Thane Majiwada, Dombivli, Bandra, Baner Pune..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-900"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-neutral-400 font-medium">Quick Select:</span>
                  {popularLocations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocation(loc)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                        location === loc
                          ? 'bg-[#D4A017] text-neutral-950 font-bold border-amber-500'
                          : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Budget Range <span className="text-rose-500">*</span>
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-900"
                >
                  {budgetPresets.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Specific Requirements or Amenities <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Higher floor, vaastu compliant, 2 car parkings, clubhouse, balcony with open view, home loan pre-approved..."
                  value={additionalRequirement}
                  onChange={(e) => setAdditionalRequirement(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white font-medium text-neutral-900"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-neutral-100 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-2xl bg-neutral-950 hover:bg-neutral-900 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Registering Requirement...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#F4C430]" />
                      <span>Submit Property Requirement</span>
                    </>
                  )}
                </button>

                <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-2 text-center sm:text-left">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <ShieldCheck className="w-4 h-4" /> 100% Privacy & Zero Spam Guarantee
                  </span>
                  <span>MahaRERA: {brandConfig.reraRegistration}</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
