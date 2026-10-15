'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Download,
  BookOpen,
  FileText,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Layers,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { store } from '@/lib/data/store';
import { useToast } from '@/components/ui/toast';

export interface LocalityGuideItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'INFRASTRUCTURE' | 'PRICE_TRENDS' | 'INVESTMENT_REPORT' | 'LEGAL_CHECKLIST';
  region: string;
  coverImage: string;
  pageCount: number;
  fileSize: string;
  keyTakeaways: string[];
  sampleContent: {
    chapter1: string;
    chapter2: string;
    chapter3: string;
    projectedYield: string;
  };
}

interface GatedEbookDownloadModalProps {
  guide: LocalityGuideItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GatedEbookDownloadModal({ guide, isOpen, onClose }: GatedEbookDownloadModalProps) {
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [investmentInterest, setInvestmentInterest] = useState('Within 6 Months');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isOpen || !guide) return null;

  const handleDownloadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      toast({
        title: 'Please Complete All Fields',
        description: 'Provide your name, WhatsApp phone number, and email to unlock your download.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Ingest into real-time store as a verified lead
      const notes = `[E-Book Download]: Unlocked '${guide.title}' (${guide.region}) | Investment Horizon: ${investmentInterest}`;

      store.createLead({
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        source: 'LOCALITY_GUIDE',
        budget: '₹1 Cr - ₹2.5 Cr',
        location: guide.region,
        propertyTitle: guide.title,
        notes,
        status: 'NEW',
        leadScore: 75,
        qualification: 'WARM',
        hasBrochureDownload: true,
      });

      setIsUnlocked(true);

      toast({
        title: 'Guide Unlocked Successfully!',
        description: `Your access link for ${guide.title} has been generated. Download starting...`,
        type: 'success',
      });
    } catch (err) {
      console.error('Lead capture error:', err);
      toast({
        title: 'Download Error',
        description: 'Unable to unlock document. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsUnlocked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0B1120] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden relative my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#1E293B] border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#10B981]/20 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Prosify Research E-Book & Locality Guide</span>
              <span className="text-[10px] text-slate-400">Exclusive 100% Verified Market Intelligence</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isUnlocked ? (
          <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
            {/* Guide Preview Card */}
            <div className="p-4 rounded-2xl bg-[#1E293B]/80 border border-slate-700 flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-28 h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 shadow-lg">
                <Image
                  src={guide.coverImage}
                  alt={guide.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-cyan-300">
                  {guide.pageCount} Pages PDF
                </span>
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30">
                    {guide.category.replace(/_/g, ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30">
                    {guide.region}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{guide.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{guide.subtitle}</p>

                <div className="text-[11px] text-emerald-400 font-semibold flex items-center justify-center sm:justify-start gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Forecast Yield: {guide.sampleContent.projectedYield}</span>
                </div>
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>What You&apos;ll Discover Inside:</span>
              </span>
              <ul className="space-y-1.5 text-slate-400">
                {guide.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gated Access Form */}
            <form onSubmit={handleDownloadSubmit} className="space-y-3.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Unlock Instant High-Resolution Download</span>
                </span>
                <span className="text-[10px] text-slate-400">Zero Spam Guarantee</span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-medium mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 font-medium mb-1">WhatsApp Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98201 XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 font-medium mb-1">Email (PDF Delivery) *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-medium mb-1">Investment Horizon</label>
                <select
                  value={investmentInterest}
                  onChange={(e) => setInvestmentInterest(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#10B981]"
                >
                  <option value="Immediate (Under 30 Days)">Immediate Buyer (Under 30 Days)</option>
                  <option value="Within 6 Months">Planning within 1 to 6 Months</option>
                  <option value="Researching Trends">Market Research & Price Benchmarking</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#10B981] via-[#0EA5E9] to-[#10B981] hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating Secure Link...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Free PDF Report ({guide.fileSize})</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Content State */
          <div className="p-6 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Your Comprehensive Guide is Unlocked!</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                A copy has been routed to <strong className="text-white">{email}</strong> and your download token is ready.
              </p>
            </div>

            {/* Interactive Preview Summary */}
            <div className="p-4 rounded-2xl bg-[#1E293B] border border-slate-700 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <span className="font-bold text-white">{guide.title}</span>
                <span className="text-[10px] text-cyan-400 font-mono">Verified 2026 Edition</span>
              </div>

              <div className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-amber-400 block mb-0.5">Chapter 1: Infrastructure Velocity</strong>
                  {guide.sampleContent.chapter1}
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-emerald-400 block mb-0.5">Chapter 2: Micro-Market Price Trajectory</strong>
                  {guide.sampleContent.chapter2}
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-sky-400 block mb-0.5">Chapter 3: Grade-A Developer Sanctions</strong>
                  {guide.sampleContent.chapter3}
                </div>
              </div>

              {/* Direct Instant Action */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    toast({
                      title: 'Download Triggered',
                      description: `Initiated PDF download for ${guide.title}`,
                      type: 'success',
                    });
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Document</span>
                </button>

                <a
                  href="https://wa.me/919167991679"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-[#10B981] hover:bg-[#0da674] text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
