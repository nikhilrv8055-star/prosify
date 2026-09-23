'use client';

import React, { useState, useMemo } from 'react';
import { X, Building2, Phone, Mail, User, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Property, Project } from '@/lib/types';
import { getStoredAttribution, PartnerAttribution } from '@/lib/attribution';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
  project?: Project | null;
  propertyTitle?: string;
  propertyLocation?: string;
}

export function EnquiryModal({ isOpen, onClose, property, project, propertyTitle, propertyLocation }: EnquiryModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState('₹50 Lakh - ₹1 Cr');
  const [requirement, setRequirement] = useState('2 BHK');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const attribution = useMemo(() => {
    return isOpen && typeof window !== 'undefined' ? getStoredAttribution() : null;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name || !phone || phone.length < 10) {
      setErrorMessage('Please enter your full name and a valid 10-digit mobile number');
      return;
    }

    setSubmitting(true);
    try {
      const attr = attribution || getStoredAttribution();
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          propertyId: property?.id,
          propertyTitle: propertyTitle || property?.title,
          projectId: project?.id || property?.projectId,
          projectName: project?.name || property?.projectName,
          developerName: project?.developerName || property?.developerName,
          budget,
          requirement,
          location: propertyLocation || property?.city || project?.city || 'Mumbai MMR',
          notes: attr?.partnerCode
            ? `Referred via Channel Partner ${attr.partnerCode} (${attr.partnerName || 'Authorized CP'})`
            : 'Direct enquiry submitted via modal',
          partnerId: attr?.partnerId,
          partnerCode: attr?.partnerCode,
          partnerName: attr?.partnerName,
          source: attr?.partnerCode ? 'CHANNEL_PARTNER' : 'WEBSITE',
          utmSource: attr?.utmSource,
          utmMedium: attr?.utmMedium,
          utmCampaign: attr?.utmCampaign,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2500);
      } else {
        setErrorMessage(data.error?.message || 'Failed to submit enquiry');
      }
    } catch {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#171717] text-white p-5 flex items-center justify-between border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-1.5 text-[#F4C430] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Direct Developer Enquiry
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {propertyTitle || property?.title || project?.name || 'Get Exclusive Pricing & Floor Plans'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900">Enquiry Submitted!</h4>
              <p className="text-sm text-neutral-600 max-w-xs mx-auto">
                Thank you, <strong>{name}</strong>. Our verified property consultant will connect with you on {phone} within 15 minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-[#D4A017]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Mobile Number (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-[#D4A017]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-[#D4A017]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Your Budget
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                  >
                    <option value="Under ₹50 Lakh">Under ₹50 Lakh</option>
                    <option value="₹50 Lakh - ₹1 Cr">₹50 Lakh - ₹1 Cr</option>
                    <option value="₹1 Cr - ₹2 Cr">₹1 Cr - ₹2 Cr</option>
                    <option value="₹2 Cr - ₹5 Cr">₹2 Cr - ₹5 Cr</option>
                    <option value="Above ₹5 Cr">Above ₹5 Cr</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Requirement
                  </label>
                  <select
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                  >
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK+">4 BHK+</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 font-bold text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <span>Request Callback & Price Sheet</span>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-neutral-400 text-center">
                🔒 We respect your privacy. No spam. 100% RERA verified developer connects only.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
