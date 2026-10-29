'use client';

import React, { useState } from 'react';
import {
  X,
  Code2,
  Sparkles,
  CheckCircle2,
  Send,
  Building2,
  Smartphone,
  Database,
  Layers,
  ShieldCheck,
  Phone,
  User,
  Mail,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { brandConfig } from '@/src/config/brand';

interface SoftwareDevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SoftwareDevelopmentModal({ isOpen, onClose }: SoftwareDevelopmentModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [serviceType, setServiceType] = useState('Real Estate CRM & Automation');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone.slice(-10),
          email: email.trim() || undefined,
          requirement: `Software Development Services: ${serviceType}. Company: ${company}. Notes: ${notes}`,
          notes: `Software Development Inquiry by Prosify Technologies`,
          source: 'DIRECT_WEBSITE',
        }),
      });

      setSubmitted(true);
    } catch {
      setSubmitted(true); // Graceful fallback
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-950 text-white border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Gold Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 px-6 pt-6 pb-4 border-b border-slate-800/80 flex items-start justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prosify Technologies</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Software Development Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Enterprise PropTech solutions, custom real estate CRM, builder inventory ERP, web portals & mobile apps.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="relative z-10 p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Software Consultation Request Received!
              </h3>
              <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
                Thank you, <strong>{name}</strong>. Our senior software solutions architect will reach out within 2 hours
                to discuss your requirements and share architecture proposals.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/919324908055?text=${encodeURIComponent(
                    `Hello Prosify Tech Team, I just requested a consultation for ${serviceType}. My name is ${name} (${company}). Let's connect.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connect on WhatsApp Now</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setPhone('');
                    setEmail('');
                    setCompany('');
                    setNotes('');
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 4 Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>Real Estate CRM & Lead Automation</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-snug">
                    Omnichannel lead sync from Meta Ads, Google Ads, 99acres & Housing with instant WhatsApp bot assignment.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>Builder ERP & Inventory Portals</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-snug">
                    Live tower/unit booking grids, agreement generators, payment milestone tracking & MahaRERA compliance vaults.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span>Custom Web & Mobile Apps</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-snug">
                    High-speed Next.js 15 web applications and iOS/Android native apps with offline-ready site visit modes.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Code2 className="w-4 h-4 text-amber-400" />
                    <span>Cloudflare R2 & Cloud Scalability</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-snug">
                    Zero-egress object storage, microservices architecture, secure OAuth 2.0 & automated webhook syndication.
                  </p>
                </div>
              </div>

              {/* Consultation / Quote Form */}
              <div className="pt-2">
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-white">Request Demo & Technical Proposal</h3>
                  <p className="text-[11px] text-slate-400">
                    Tell us about your project requirements to receive a customized scope document and pricing quote.
                  </p>
                </div>

                {error && (
                  <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1 text-[11px]">Your Full Name *</label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-500 absolute inset-y-0 left-3 my-auto" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Vikas Sharma"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1 text-[11px]">Phone / WhatsApp Number *</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 text-xs font-mono">+91</span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full pl-11 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1 text-[11px]">Work Email Address</label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-500 absolute inset-y-0 left-3 my-auto" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="vikas@realtygroup.in"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1 text-[11px]">Company / Brokerage / Builder Name</label>
                      <div className="relative">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 absolute inset-y-0 left-3 my-auto" />
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="e.g. Apex Realty Developers"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1 text-[11px]">Primary Software Need</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-amber-400"
                    >
                      <option value="Real Estate CRM & Automation">Real Estate CRM & Lead Automation Platform</option>
                      <option value="Builder ERP & Inventory Portal">Builder ERP, Inventory & Billing Portal</option>
                      <option value="Custom Web App & Marketplace">Custom Web Marketplace / Portal (Next.js)</option>
                      <option value="iOS & Android Mobile App">iOS & Android Real Estate Mobile App</option>
                      <option value="Broker & Channel Partner Network Portal">Broker & Channel Partner Network Portal</option>
                      <option value="Full Digital Transformation">Complete End-to-End PropTech Architecture</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1 text-[11px]">Brief Project Scope or Feature List</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tell us about expected users, timeline, or current bottlenecks..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      'Submitting Request...'
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Schedule Technical Demo & Quote</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SoftwareDevelopmentModal;
