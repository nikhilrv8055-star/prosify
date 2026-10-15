'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Sliders,
  Flame,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Clock,
  Building2,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import { store } from '@/lib/data/store';
import { useToast } from '@/components/ui/toast';

interface MetaInstantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectTitle?: string;
  initialCity?: string;
}

export function MetaInstantFormModal({
  isOpen,
  onClose,
  initialProjectTitle = 'Godrej Riviera - Waterfront Luxury Towers',
  initialCity = 'Mumbai NCR / Kalyan',
}: MetaInstantFormModalProps) {
  const { toast } = useToast();

  // Form State
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [fullName, setFullName] = useState('Vikram Singhania');
  const [phone, setPhone] = useState('+91 98201 99881');
  const [email, setEmail] = useState('vikram.s@singhaniaholdings.in');
  const [city, setCity] = useState(initialCity);

  // Pre-Qualifying Custom Questions (Friction Filters)
  const [budgetRange, setBudgetRange] = useState('₹1 Cr - ₹2 Cr');
  const [timeline, setTimeline] = useState('Immediate (Under 30 Days)');
  const [purpose, setPurpose] = useState('Family Residence (End-Use)');
  const [financingStatus, setFinancingStatus] = useState('Pre-Approved Bank Loan Ready');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadIdCreated, setLeadIdCreated] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate dynamic qualification intent score
  const calculateIntentScore = () => {
    let score = 50;
    if (timeline.includes('Immediate')) score += 30;
    else if (timeline.includes('1-3 Months')) score += 20;
    else if (timeline.includes('3-6 Months')) score += 10;

    if (financingStatus.includes('Pre-Approved') || financingStatus.includes('Ready Cash')) score += 15;
    if (budgetRange.includes('₹1 Cr') || budgetRange.includes('₹2 Cr') || budgetRange.includes('₹4 Cr')) score += 10;
    return Math.min(100, score);
  };

  const intentScore = calculateIntentScore();
  const isHotLead = intentScore >= 80;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      toast({
        title: 'Required Details Missing',
        description: 'Please provide your name and WhatsApp-enabled mobile number.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create lead directly into real-time store
      const qualification = isHotLead ? 'HOT' : intentScore >= 60 ? 'WARM' : 'COLD';
      const frictionSummary = `[Meta Instant Form Friction Filter]: Budget: ${budgetRange} | Purchase Timeline: ${timeline} | Intent: ${purpose} | Financing: ${financingStatus}`;

      const newLead = store.createLead({
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        source: 'META_ADS',
        budget: budgetRange,
        location: city,
        propertyTitle: initialProjectTitle,
        notes: frictionSummary,
        status: 'NEW',
        leadScore: intentScore,
        qualification,
      });

      setLeadIdCreated(newLead.id);
      setStep('success');

      toast({
        title: 'Native Instant Form Verified!',
        description: `Your pre-qualified inquiry for ${initialProjectTitle} has been submitted with an intent score of ${intentScore}/100.`,
        type: 'success',
      });
    } catch (err) {
      console.error('Lead submission error:', err);
      toast({
        title: 'Submission Error',
        description: 'Could not submit your inquiry. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0B1120] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden relative my-auto">
        {/* Meta / Instagram Reels Top Bar */}
        <div className="px-5 py-3.5 bg-[#1E293B] border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-black shadow-xs">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">Meta Instant Lead Ad</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30">
                  Verified Inbound
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Facebook & Instagram Native Instant Form</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Targeted Property Capsule */}
            <div className="p-3.5 rounded-2xl bg-[#1E293B]/70 border border-slate-700/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#10B981] shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{initialProjectTitle}</h4>
                  <span className="text-[11px] text-[#0EA5E9] font-medium">{city} • Direct Builder Rate</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  <ShieldCheck className="w-3 h-3" />
                  RERA Pass
                </span>
              </div>
            </div>

            {/* Friction Pre-Qualification Header & Live Intent Score */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-[#F59E0B]">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-300 block">Pre-Qualifying Friction Filters</span>
                  <span className="text-[10px] text-slate-400">Filters window-shoppers for prioritized sales routing</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Intent Score</span>
                <span className={`text-xs font-mono font-black ${isHotLead ? 'text-[#10B981]' : 'text-amber-400'}`}>
                  {intentScore}/100 {isHotLead ? '★ HOT' : 'WARM'}
                </span>
              </div>
            </div>

            {/* Friction Question 1: Preferred Budget Range */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#0EA5E9]" />
                <span>1. What is your preferred investment / budget range? *</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  '₹60L - ₹1 Cr',
                  '₹1 Cr - ₹2 Cr',
                  '₹2 Cr - ₹4 Cr',
                  'Ultra Luxury ₹4 Cr+',
                ].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudgetRange(b)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                      budgetRange === b
                        ? 'bg-[#0EA5E9]/20 text-[#0EA5E9] border-[#0EA5E9] ring-1 ring-[#0EA5E9]/50'
                        : 'bg-[#1E293B]/60 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <span>{b}</span>
                    {budgetRange === b && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Friction Question 2: Purchase Timeline */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                <span>2. When are you looking to purchase? (Timeline) *</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Immediate (Under 30 Days)',
                  '1 - 3 Months',
                  '3 - 6 Months',
                  'Just Exploring Market',
                ].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeline(t)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                      timeline === t
                        ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981] ring-1 ring-[#10B981]/50'
                        : 'bg-[#1E293B]/60 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <span className="truncate">{t}</span>
                    {timeline === t && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Friction Question 3: Purchase Purpose */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>3. Primary Purchase Purpose *</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Family Residence (End-Use)',
                  'High-Yield Capital Investment',
                ].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPurpose(p)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                      purpose === p
                        ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B] ring-1 ring-[#F59E0B]/50'
                        : 'bg-[#1E293B]/60 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <span className="truncate">{p}</span>
                    {purpose === p && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Friction Question 4: Financing Readiness */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-purple-400" />
                <span>4. Home Loan / Financing Status *</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Pre-Approved Bank Loan Ready',
                  'Self-Funded / Ready Capital',
                  'Require Pre-Sanction Advice',
                  'Evaluating Bank Interest Rates',
                ].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFinancingStatus(f)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                      financingStatus === f
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500 ring-1 ring-purple-500/50'
                        : 'bg-[#1E293B]/60 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <span className="truncate">{f}</span>
                    {financingStatus === f && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Pre-Filled Native Contact Fields */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  <span>Native Pre-Filled Contact Details</span>
                </span>
                <span className="text-[10px] text-slate-500">Auto-filled from Meta Account</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1 font-medium">Phone Number (WhatsApp)</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-[#10B981]"
                      placeholder="+91 98XXX XXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1 font-medium">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                      placeholder="name@domain.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Instant Submit Action */}
            <div className="pt-2 space-y-2.5">
              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                By tapping Submit, you agree to receive official project brochure, pricing sheet, and verified developer updates. Zero brokerage guaranteed.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#10B981] via-[#0EA5E9] to-[#10B981] hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Verifying & Submitting...</span>
                ) : (
                  <>
                    <span>Submit Pre-Qualified Inquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Pre-Qualified Instant Lead Received!</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                Thank you, <strong className="text-white">{fullName}</strong>. Your filtered requirement for{' '}
                <strong className="text-[#0EA5E9]">{initialProjectTitle}</strong> ({budgetRange}) has been registered with{' '}
                <strong className="text-[#10B981]">Intent Score {intentScore}/100</strong>.
              </p>
            </div>

            {/* Fast-track WhatsApp Action */}
            <div className="p-4 rounded-2xl bg-[#1E293B] border border-slate-700 text-left space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Sales Lead Reference</span>
                <span className="font-mono text-amber-400 font-bold">{leadIdCreated || 'LEAD-LIVE'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Priority Callback</span>
                <span className="text-[#10B981] font-semibold">Allocated within 15 Minutes</span>
              </div>

              <div className="pt-2 border-t border-slate-700/80">
                <a
                  href="https://wa.me/919167991679"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#0da674] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
