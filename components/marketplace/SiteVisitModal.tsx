'use client';

import React, { useState, useMemo } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle2, ShieldCheck, Car } from 'lucide-react';
import { Property, Project } from '@/lib/types';
import { getStoredAttribution, PartnerAttribution } from '@/lib/attribution';
import { store } from '@/lib/data/store';

interface SiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
  project?: Project | null;
}

export function SiteVisitModal({ isOpen, onClose, property, project }: SiteVisitModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [visitDate, setVisitDate] = useState('2026-09-22');
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [cabRequired, setCabRequired] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const attribution = useMemo(() => {
    return isOpen && typeof window !== 'undefined' ? getStoredAttribution() : null;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || phone.length < 10) {
      setErrorMessage('Please provide your name and 10-digit mobile number');
      return;
    }

    setSubmitting(true);
    try {
      const attr = attribution || getStoredAttribution();
      const res = await fetch('/api/site-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName: name,
          leadPhone: phone,
          propertyId: property?.id,
          propertyTitle: property?.title,
          projectId: project?.id || property?.projectId,
          projectName: project?.name || property?.projectName,
          partnerId: attr?.partnerId,
          partnerCode: attr?.partnerCode,
          visitDate,
          visitTime,
          notes: `${notes} ${cabRequired ? '| Free Site Cab Pickup Requested' : ''} ${attr?.partnerCode ? `| CP Ref: ${attr.partnerCode}` : ''}`.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.data) {
          if (data.data.lead) store.ingestLead(data.data.lead);
          if (data.data.visit) store.ingestSiteVisit(data.data.visit);
        }
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2500);
      } else {
        setErrorMessage(data.error?.message || 'Failed to schedule visit');
      }
    } catch {
      setErrorMessage('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#171717] text-white p-5 flex items-center justify-between border-b border-neutral-800">
          <div>
            <span className="text-[#F4C430] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Complimentary Site Visit
            </span>
            <h3 className="text-base font-bold text-white mt-1 line-clamp-1">
              {property?.title || project?.name || 'Schedule Experience Walkthrough'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900">Site Visit Confirmed!</h4>
              <p className="text-sm text-neutral-600">
                Your appointment on <strong>{visitDate}</strong> at <strong>{visitTime}</strong> has been registered. Our site representative will coordinate your entry pass.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Visitor Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Joshi"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Mobile Number (For Gate Entry Pass) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98201 00000"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Preferred Time Slot *
                  </label>
                  <select
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                  >
                    <option value="10:00 AM">10:00 AM (Morning)</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM (Afternoon)</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="05:00 PM">05:00 PM (Sunset Walk)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-800">
                  <input
                    type="checkbox"
                    checked={cabRequired}
                    onChange={(e) => setCabRequired(e.target.checked)}
                    className="rounded text-[#D4A017] focus:ring-[#D4A017]"
                  />
                  <Car className="w-4 h-4 text-neutral-500" />
                  <span>Request complimentary AC cab pickup from nearest station</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Specific Requirements or Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Visiting with family, interested in top floor"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 font-bold text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? 'Confirming Appointment...' : 'Confirm Free Site Visit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
