'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, Car, User, Phone, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { Property } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import { store } from '@/lib/data/store';

interface SiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

const TIME_SLOTS = [
  '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
];

export function SiteVisitModal({ isOpen, onClose, property }: SiteVisitModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [cabRequired, setCabRequired] = useState(true);
  const [pickupAddress, setPickupAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      toast('Please enter name and mobile number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      store.createSiteVisit({
        propertyId: property.id,
        propertyTitle: property.title,
        leadName: name.trim(),
        leadMobile: mobile.trim(),
        date,
        timeSlot,
        cabRequired,
        pickupAddress: cabRequired ? pickupAddress : undefined,
      });

      setIsSubmitted(true);
      toast('Site visit confirmed! Our chauffeur and property manager will coordinate with you.', 'success');
    } catch {
      toast('Could not schedule visit. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
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
            aria-label="Close site visit modal"
            className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#D4A017]/20 text-[#F4C430] text-[10px] font-bold uppercase mb-1">
            <Car className="w-3 h-3 text-[#D4A017]" />
            Free Chauffeur Pickup
          </div>
          <h3 className="text-lg font-bold text-white line-clamp-1">
            Book Site Visit: {property.title}
          </h3>
          <p className="text-xs text-neutral-400">
            {property.locality}, {property.city}
          </p>
        </div>

        <div className="p-5">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-lg font-bold text-neutral-900">Visit Scheduled</h4>
              <p className="text-xs text-neutral-600">
                Your visit to <strong>{property.title}</strong> is booked for <strong>{date}</strong> ({timeSlot}).
                {cabRequired && ' Complimentary pickup will be dispatched to your location.'}
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 px-5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Full Name *</label>
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
                <label className="block text-xs font-bold text-neutral-700 mb-1">Mobile Number *</label>
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-9 pr-2 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                  >
                    {TIME_SLOTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cab option */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={cabRequired}
                    onChange={(e) => setCabRequired(e.target.checked)}
                    className="rounded text-[#D4A017] accent-[#D4A017]"
                  />
                  <span>Need Free Chauffeur Pickup & Drop?</span>
                </label>
                {cabRequired && (
                  <div className="relative pt-1">
                    <MapPin className="absolute left-2.5 top-3.5 w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="text"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="Enter pickup address / landmark"
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] bg-white"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Free Site Visit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
