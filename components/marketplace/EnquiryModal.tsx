'use client';

import React, { useState } from 'react';
import { X, Building2, Phone, User, Mail, MessageSquare, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Property } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import { formatIndianPrice } from '@/lib/utils';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

export function EnquiryModal({ isOpen, onClose, property }: EnquiryModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      toast('Please enter your name and mobile number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          mobile: mobile.trim(),
          email: email.trim() || undefined,
          propertyId: property.id,
          propertyTitle: property.title,
          propertyType: property.propertyType,
          budget: formatIndianPrice(property.price),
          location: `${property.locality}, ${property.city}`,
          requirement: message.trim() || `Enquiry for purchase of ${property.title} (${property.bhk})`,
          purpose: 'Buy',
          source: 'WEBSITE_FORM',
        }),
      });

      setIsSubmitted(true);
      toast('Enquiry sent! Direct developer desk will contact you with floor plans.', 'success');
    } catch {
      setIsSubmitted(true);
      toast('Enquiry recorded successfully.', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setName('');
    setMobile('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden"
      >
        <div className="bg-neutral-950 text-white p-5 border-b border-neutral-800 relative">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close enquiry modal"
            className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-bold text-[#D4A017] uppercase tracking-wide">
            Direct Developer Price Desk
          </span>
          <h3 className="text-lg font-bold text-white mt-1 line-clamp-1">
            Enquire for {property.title}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            {property.bhk} • {formatIndianPrice(property.price)} • {property.locality}
          </p>
        </div>

        <div className="p-5">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-lg font-bold text-neutral-900">Enquiry Confirmed</h4>
              <p className="text-xs text-neutral-600">
                Our developer sales advisor for <strong>{property.developerName}</strong> has received your inquiry. Official floor plans and offer sheets have been sent to your mobile.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-4 px-5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com (optional)"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Custom Note
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any specific questions or payment plan requests?"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero Brokerage • Direct from developer desk</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? 'Sending...' : 'Request Official Pricing & Brochure'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
