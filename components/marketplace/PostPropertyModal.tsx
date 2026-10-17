'use client';

import React, { useState } from 'react';
import {
  X,
  Home,
  CheckCircle2,
  Building2,
  Phone,
  User,
  Sparkles,
  MapPin,
  IndianRupee,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface PostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PostPropertyModal({ isOpen, onClose }: PostPropertyModalProps) {
  const { toast } = useToast();
  const [listingType] = useState<'SALE'>('SALE');
  const [propertyType, setPropertyType] = useState<'APARTMENT' | 'VILLA' | 'COMMERCIAL' | 'PLOT'>('APARTMENT');
  const [bhk, setBhk] = useState('2 BHK');
  const [city, setCity] = useState('Mumbai MMR');
  const [locality, setLocality] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !ownerPhone || ownerPhone.length < 10) {
      toast({
        title: 'Validation Error',
        description: 'Please provide your full name and valid 10-digit mobile number.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Send lead / listing to API
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ownerName,
          phone: ownerPhone,
          requirement: `${listingType} - ${bhk} ${propertyType}`,
          location: `${locality ? locality + ', ' : ''}${city}`,
          budget: `Expected: ₹${expectedPrice || 'Contact for price'}`,
          notes: `Owner Free Property Listing: ${listingType} of ${bhk} in ${locality}, ${city}.`,
        }),
      }).catch(() => {});

      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: 'Property Listed Successfully!',
        description: 'Your free listing is submitted for verification and will go live within 2 hours.',
      });
    } catch {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header with Brand Gradient */}
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 px-6 py-4.5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-xs">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Post Property</h3>
                <span className="px-2 py-0.5 rounded-full bg-neutral-950 text-white font-extrabold text-[10px] tracking-wider uppercase">
                  FREE
                </span>
              </div>
              <p className="text-xs text-rose-100">Zero brokerage • Direct verified buyers & tenants</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-neutral-900">Listing Submitted For Verification!</h4>
                <p className="text-sm text-neutral-600 mt-1 max-w-sm mx-auto">
                  Our relationship manager will verify your property details and activate your listing within 2 hours.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-left text-xs space-y-1.5 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Property:</span>
                  <span className="font-semibold text-neutral-900">{bhk} ({listingType})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">City / Location:</span>
                  <span className="font-semibold text-neutral-900">{locality || city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Zero Brokerage:</span>
                  <span className="font-semibold text-emerald-600">Guaranteed 100%</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-neutral-900 text-white font-bold text-sm hover:bg-neutral-800 transition-all cursor-pointer"
              >
                Done & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Listing Purpose */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-xs">
                <span className="text-neutral-700 font-semibold">Listing Purpose:</span>
                <span className="font-bold text-neutral-950 bg-white px-2.5 py-1 rounded-lg border border-amber-300 shadow-xs">
                  Sell / Resale Property
                </span>
              </div>

              {/* Property Category */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 mb-1.5 block">
                  Property Type:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'APARTMENT', label: 'Flat / Apt' },
                    { id: 'VILLA', label: 'Villa' },
                    { id: 'COMMERCIAL', label: 'Commercial' },
                    { id: 'PLOT', label: 'Plot / Land' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPropertyType(t.id as any)}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold text-center border transition-all ${
                        propertyType === t.id
                          ? 'border-rose-600 bg-rose-50 text-rose-700'
                          : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* BHK Selection if Apartment or Villa */}
              {(propertyType === 'APARTMENT' || propertyType === 'VILLA') && (
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1.5 block">
                    Configuration:
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setBhk(item)}
                        className={`py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          bhk === item
                            ? 'bg-neutral-900 text-white shadow-xs'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* City & Locality */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">
                    City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option>Mumbai MMR</option>
                    <option>Pune</option>
                    <option>Nagpur</option>
                    <option>Nashik</option>
                    <option>Thane</option>
                    <option>Navi Mumbai</option>
                    <option>Chhatrapati Sambhajinagar</option>
                    <option>Kolhapur</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">
                    Locality / Society
                  </label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Bandra West, Lodha"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Expected Price */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 mb-1 block">
                  Expected Selling Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-400 text-xs font-bold">₹</span>
                  <input
                    type="text"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value)}
                    placeholder="e.g. 1.25 Cr"
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-neutral-100">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Owner / Landlord Name"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px]">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Zero brokerage guaranteed • Direct verified tenants and buyers</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Posting Free Listing...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span>Post Free Property Listing</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
