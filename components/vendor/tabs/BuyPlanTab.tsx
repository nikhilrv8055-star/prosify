'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  Check,
  X,
  Lock,
} from 'lucide-react';
import { VENDOR_PLANS } from '../mockVendorData';
import { VendorPlan } from '../types';

interface BuyPlanTabProps {
  onUpgradePlan: (plan: VendorPlan) => void;
}

export function BuyPlanTab({ onUpgradePlan }: BuyPlanTabProps) {
  const [selectedPlan, setSelectedPlan] = useState<VendorPlan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING'>('UPI');

  const handleSelectPlan = (plan: VendorPlan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    onUpgradePlan(selectedPlan);
    setIsCheckoutOpen(false);
    setPaymentSuccess(`Payment Verified! You are now subscribed to ${selectedPlan.name}. Invoice generated.`);
    setTimeout(() => setPaymentSuccess(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30 text-[10px] font-bold">
            VENDOR SUBSCRIPTION TIERS
          </span>
          <span className="text-xs text-slate-400">Current Plan: <strong>Pro Developer Plan</strong></span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-sky-400" />
          <span>Vendor & Developer Subscription Plans</span>
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed mt-1">
          Scale your real estate sales volume with featured homepage spotlighting, priority WhatsApp routing, Grade-A API push sync, and dedicated account management.
        </p>
      </div>

      {paymentSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{paymentSuccess}</span>
        </div>
      )}

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VENDOR_PLANS.map((plan) => {
          const isCurrent = plan.id === 'plan-pro';
          return (
            <div
              key={plan.id}
              className={`p-6 rounded-3xl border flex flex-col justify-between space-y-6 transition-all relative ${
                isCurrent
                  ? 'bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-sky-500/60 shadow-2xl shadow-sky-500/10 scale-[1.02]'
                  : 'bg-[#1E293B]/70 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-sky-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                  CURRENT ACTIVE PLAN
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-sky-400 tracking-wider uppercase font-mono">
                    {plan.badge}
                  </span>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                </div>

                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-black text-white">₹{plan.price.toLocaleString()}</span>
                  <span className="text-xs text-slate-400">{plan.billingCycle}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Listing Quota:</span>
                    <strong className="text-white">{plan.propertiesLimit}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Mega Projects:</span>
                    <strong className="text-indigo-400">{plan.projectsLimit}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Inquiry Routing:</span>
                    <strong className="text-emerald-400">{plan.leadQuota}</strong>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Included Features:
                  </span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    : 'bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-slate-950 shadow-lg shadow-sky-500/25'
                }`}
              >
                <span>{isCurrent ? 'Renew Current Plan' : 'Select & Upgrade Plan'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Plan Checkout Simulation Modal */}
      {isCheckoutOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-400" />
                <span>Checkout: {selectedPlan.name}</span>
              </h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimulatePayment} className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Subscription Package:</span>
                  <strong className="text-white">{selectedPlan.name}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Billing Frequency:</span>
                  <span className="text-slate-400">Monthly Auto-Renewal</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 pt-2 border-t border-slate-800 text-sm">
                  <span>Total Amount Due:</span>
                  <strong className="text-emerald-400 font-mono text-base">₹{selectedPlan.price.toLocaleString()}</strong>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Select Payment Gateway</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`py-2 rounded-xl text-center font-bold border transition-colors ${
                      paymentMethod === 'UPI'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    UPI / QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`py-2 rounded-xl text-center font-bold border transition-colors ${
                      paymentMethod === 'CARD'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NET_BANKING')}
                    className={`py-2 rounded-xl text-center font-bold border transition-colors ${
                      paymentMethod === 'NET_BANKING'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Net Banking
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>256-Bit SSL Encrypted Escrow Gateway. GST Invoice auto-emailed.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  Pay ₹{selectedPlan.price.toLocaleString()} & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
