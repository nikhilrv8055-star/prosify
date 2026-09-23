'use client';

import React, { useState } from 'react';
import { Users, ShieldCheck, BadgePercent, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { useToast } from '@/components/ui/toast';
import { store } from '@/lib/data/store';

export default function PartnerPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [reraNumber, setReraNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !reraNumber.trim()) {
      toast('Please fill in your name, mobile, and MahaRERA number', 'error');
      return;
    }

    store.createPartner({
      name: name.trim(),
      agencyName: agencyName.trim() || name.trim() + ' Advisory',
      mobile: mobile.trim(),
      email: email.trim(),
      reraNumber: reraNumber.trim(),
      commissionSlab: '2.5% Base + Volume Incentives',
    });

    setIsSubmitted(true);
    toast('Partner registered successfully! Account credentials sent to mobile.', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Navbar />

      <div className="bg-[#171717] text-white py-12 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A017]/20 border border-[#D4A017]/40 text-[#F4C430] text-xs font-bold uppercase">
            <Users className="w-3.5 h-3.5 text-[#D4A017]" />
            Channel Partner Ingestion Network
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Grow Your Realty Business With Prosify
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto">
            Get instant developer inventory feeds, guaranteed 15-day broker commission payouts, and CRM lead tracking across Mumbai MMR and Pune.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-xl font-bold text-neutral-950">MahaRERA Partner Registration</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Join 500+ registered channel partners sourcing direct developer allocations
            </p>
          </div>

          {isSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-bold text-neutral-950">Partner Onboarding Complete!</h3>
              <p className="text-xs text-neutral-600 max-w-md mx-auto">
                Welcome to Prosify Partner Network. Your dedicated affiliate manager will activate your dashboard and send your verified inventory links.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Partner / Principal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Gaurav Shinde"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Agency / Firm Name
                  </label>
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="e.g. Apex Realty LLP"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@agency.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    MahaRERA Agent No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={reraNumber}
                    onChange={(e) => setReraNumber(e.target.value)}
                    placeholder="e.g. A51800004120"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Complete Partner Registration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
