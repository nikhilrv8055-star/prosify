'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
  Building,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { store } from '@/lib/data/store';
import { useToast } from '@/components/ui/toast';

export interface MicroMarketInfo {
  id: string;
  name: string;
  city: string;
  address: string;
  rating: number;
  reviewsCount: number;
  googleMapsUrl: string;
  consultantName: string;
  consultantTitle: string;
  speciality: string;
  activeProjects: number;
  phone: string;
}

interface LocalConsultantInquiryModalProps {
  market: MicroMarketInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LocalConsultantInquiryModal({
  market,
  isOpen,
  onClose,
}: LocalConsultantInquiryModalProps) {
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [configuration, setConfiguration] = useState('3 BHK Luxury');
  const [budget, setBudget] = useState('₹1.2 Cr - ₹2.5 Cr');
  const [siteVisitPreferred, setSiteVisitPreferred] = useState('This Weekend (Free Cab)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !market) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please provide your name and WhatsApp number for the consultant callback.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const notes = `[Local SEO Micro-Market Inbound]: Assigned to ${market.consultantName} (${market.name}, ${market.city}) | Pref: ${configuration} | Budget: ${budget} | Inspection: ${siteVisitPreferred}`;

      store.createLead({
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@inbound.prosify.in`,
        source: 'LOCAL_SEO',
        budget,
        location: `${market.name}, ${market.city}`,
        propertyTitle: `${market.name} Micro-Market Advisory`,
        notes,
        status: 'NEW',
        leadScore: 90,
        qualification: 'HOT',
        hasSiteVisitRequest: true,
      });

      setIsSuccess(true);

      toast({
        title: 'Local Consultant Assigned!',
        description: `Your inquiry for ${market.name} has been routed to senior advisor ${market.consultantName}.`,
        type: 'success',
      });
    } catch (err) {
      console.error('Inbound consultant routing error:', err);
      toast({
        title: 'Request Failed',
        description: 'Unable to route inquiry. Please try again or connect via WhatsApp.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0B1120] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden relative my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1E293B] border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0EA5E9]/20 border border-[#0EA5E9]/30 flex items-center justify-center text-[#0EA5E9]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">{market.name} Micro-Market Advisory</span>
              <span className="text-[10px] text-emerald-400">Google Verified 4.9★ Agency Partner</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Consultant Profile Pill */}
            <div className="p-3.5 rounded-2xl bg-[#1E293B]/70 border border-slate-700/80 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {market.consultantName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white truncate">{market.consultantName}</h4>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                </div>
                <p className="text-[11px] text-[#0EA5E9] truncate">{market.consultantTitle}</p>
                <p className="text-[10px] text-slate-400 truncate">{market.address}</p>
              </div>
            </div>

            {/* Micro-market Speciality Note */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <span className="text-amber-400 font-bold block">Local Authority Focus:</span>
              <p className="text-slate-400 leading-snug">{market.speciality}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] text-slate-300 font-medium mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kulkarni"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 font-medium mb-1">Mobile Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98201 XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 font-medium mb-1">Configuration Needed</label>
                  <select
                    value={configuration}
                    onChange={(e) => setConfiguration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                  >
                    <option value="2 BHK Premium">2 BHK Premium</option>
                    <option value="3 BHK Luxury">3 BHK Luxury</option>
                    <option value="4+ BHK Penthouse">4+ BHK Sky Mansion</option>
                    <option value="Commercial Office / Retail">Commercial / Retail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 font-medium mb-1">Target Budget</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#0EA5E9]"
                  >
                    <option value="₹75L - ₹1.2 Cr">₹75L - ₹1.2 Cr</option>
                    <option value="₹1.2 Cr - ₹2.5 Cr">₹1.2 Cr - ₹2.5 Cr</option>
                    <option value="₹2.5 Cr - ₹5 Cr">₹2.5 Cr - ₹5 Cr</option>
                    <option value="Ultra Luxury ₹5 Cr+">Ultra Luxury ₹5 Cr+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 font-medium mb-1">Site Inspection Preference</label>
                <select
                  value={siteVisitPreferred}
                  onChange={(e) => setSiteVisitPreferred(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
                >
                  <option value="This Weekend (Free Cab)">This Weekend (Complimentary AC Cab)</option>
                  <option value="Within 7 Days">Within 7 Days</option>
                  <option value="Virtual Live Video Tour">Virtual Live Video Consultation First</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0EA5E9] via-[#10B981] to-[#0EA5E9] hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Connecting Local Consultant...</span>
              ) : (
                <>
                  <span>Request Inbound Callback & Inspection</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Consultation Request Confirmed!</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                Senior consultant <strong className="text-white">{market.consultantName}</strong> has received your inquiry for{' '}
                <strong className="text-[#0EA5E9]">{market.name}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1E293B] border border-slate-700 text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Micro-Market Office</span>
                <span className="text-white font-semibold">{market.city}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Scheduled Action</span>
                <span className="text-[#10B981] font-semibold">{siteVisitPreferred}</span>
              </div>

              <div className="pt-2 border-t border-slate-700">
                <a
                  href="https://wa.me/919326303244"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#0da674] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
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
