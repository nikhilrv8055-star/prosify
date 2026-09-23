'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Crown,
  CheckCircle2,
  ArrowRight,
  Landmark,
  FileCheck2,
  Paintbrush,
  Truck,
  Zap,
  Building,
  Receipt,
  PhoneCall,
  Clock,
  ChevronRight,
  BadgePercent,
  Check,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

// -------------------------------------------------------------
// 1. SERVICES MODAL
// -------------------------------------------------------------
interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileServicesModal({ isOpen, onClose }: ModalBaseProps) {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<string | null>('loan');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const services = [
    {
      id: 'loan',
      title: 'Home Loan Assistance',
      icon: Landmark,
      badge: 'From 8.35% p.a.',
      desc: 'Partnered with SBI, HDFC & ICICI for instant paperless sanction.',
      benefits: ['Zero processing fee offer', 'Instant eligibility check', 'Doorstep document pickup'],
    },
    {
      id: 'legal',
      title: 'Legal & RERA Verification',
      icon: FileCheck2,
      badge: 'RERA Certified',
      desc: '30-year title search report, dispute clearance & agreement vetting.',
      benefits: ['RERA compliance verification', 'Encumbrance certificate check', 'Senior property lawyer consultation'],
    },
    {
      id: 'interiors',
      title: 'Interiors & Modular Fitouts',
      icon: Paintbrush,
      badge: '10-Yr Warranty',
      desc: 'Complete turnkey modular kitchens, wardrobes & luxury civil works.',
      benefits: ['Free 3D visual designs', '45-day guaranteed move-in', 'No cost EMI available'],
    },
    {
      id: 'property-valuation',
      title: 'Property Valuation & Legal Check',
      icon: ShieldCheck,
      badge: 'Certified',
      desc: 'Government-approved valuation, title verification & RERA clearance.',
      benefits: ['Title search report', 'Market value assessment', 'Legal clearance certificate'],
    },
    {
      id: 'movers',
      title: 'Packers & Movers',
      icon: Truck,
      badge: '100% Insured',
      desc: 'Safe, stress-free inter-city & intra-city home shifting.',
      benefits: ['Multi-layer bubble wrap protection', 'Damage transit insurance', 'Dedicated movement manager'],
    },
  ];

  const activeServiceObj = services.find((s) => s.id === selectedService) || services[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast({
        title: 'Please enter a valid 10-digit mobile number',
        type: 'error',
      });
      return;
    }

    setSubmitted(true);
    toast({
      title: 'Service Request Registered!',
      description: `Our ${activeServiceObj.title} expert will call you shortly on +91 ${phone}`,
      type: 'success',
    });

    setTimeout(() => {
      setSubmitted(false);
      setPhone('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900/90 backdrop-blur-2xl border border-white/20 rounded-t-3xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-white max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="relative p-5 pb-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-b from-white/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Home Services
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-[#F4C430] border border-amber-400/30 font-semibold">
                  Verified
                </span>
              </h3>
              <p className="text-xs text-neutral-400">Complete end-to-end real estate assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Service Selector Chips */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {services.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedService === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedService(item.id)}
                  className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400/60 shadow-lg shadow-amber-500/10'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-amber-400 text-neutral-950' : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">{item.title}</div>
                    <div className="text-[10px] text-amber-300 font-medium mt-0.5">{item.badge}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Service Card Detail */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/15 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  {activeServiceObj.title}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 font-black">
                    {activeServiceObj.badge}
                  </span>
                </h4>
                <p className="text-xs text-neutral-300 mt-1">{activeServiceObj.desc}</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 border-t border-white/10">
              {activeServiceObj.benefits.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Booking Form */}
          <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-white/5 to-transparent border border-amber-400/30 space-y-3">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Get Free Callback & Instant Quote</span>
            </div>

            <div className="flex gap-2">
              <div className="flex items-center px-3 rounded-xl bg-neutral-800/80 border border-white/15 text-xs text-neutral-400">
                +91
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit Mobile Number"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-white/15 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-98 transition-all cursor-pointer"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Request Submitted!</span>
                </>
              ) : (
                <>
                  <span>Request Callback for {activeServiceObj.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. BILL PAYMENTS MODAL
// -------------------------------------------------------------
export function MobileBillPaymentsModal({ isOpen, onClose }: ModalBaseProps) {
  const { toast } = useToast();
  const [billType, setBillType] = useState<'maintenance' | 'property_tax' | 'electricity'>('maintenance');
  const [payeeName, setPayeeName] = useState('');
  const [payeeUpi, setPayeeUpi] = useState('');
  const [amount, setAmount] = useState('25000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  if (!isOpen) return null;

  const parsedAmount = Number(amount) || 0;
  const cashbackEstimated = Math.round(parsedAmount * 0.015);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payeeName.trim()) {
      toast({
        title: 'Please enter recipient name',
        type: 'error',
      });
      return;
    }
    if (!payeeUpi.trim()) {
      toast({
        title: 'Please enter Landlord / Society UPI ID or Account',
        type: 'error',
      });
      return;
    }
    if (!parsedAmount || parsedAmount < 100) {
      toast({
        title: 'Minimum payment amount is ₹100',
        type: 'error',
      });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setTransactionId(`TXN${Math.floor(10000000 + Math.random() * 90000000)}`);
      setPaymentSuccess(true);
      toast({
        title: 'Payment Successful!',
        description: `₹${parsedAmount.toLocaleString('en-IN')} paid to ${payeeName}. You earned ₹${cashbackEstimated} rewards!`,
        type: 'success',
      });
    }, 1800);
  };

  const handleReset = () => {
    setPaymentSuccess(false);
    setPayeeName('');
    setPayeeUpi('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900/90 backdrop-blur-2xl border border-white/20 rounded-t-3xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-white max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="relative p-5 pb-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-b from-white/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-neutral-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
              <CreditCard className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Bill Payments
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-semibold flex items-center gap-1">
                  <BadgePercent className="w-3 h-3" /> Up to 2% Cashback
                </span>
              </h3>
              <p className="text-xs text-neutral-400">Pay Society Maintenance, Property Tax & Utilities using Credit Card/UPI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {paymentSuccess ? (
            <div className="p-6 text-center space-y-4 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Payment Confirmed!</h4>
                <p className="text-xs text-neutral-300 mt-1">
                  Transaction ID: <span className="font-mono text-emerald-400">{transactionId || 'TXN84910284'}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/10 text-left text-xs space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Paid To:</span>
                  <span className="text-white font-semibold">{payeeName}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>UPI / Account:</span>
                  <span className="text-white font-mono">{payeeUpi}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Amount Paid:</span>
                  <span className="text-emerald-400 font-bold text-sm">₹{parsedAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-400 pt-2 border-t border-white/10">
                  <span>Rewards Earned:</span>
                  <span className="text-amber-400 font-bold">+{cashbackEstimated} Coins</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs"
                >
                  Make Another Payment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast({ title: 'Payment Receipt downloaded to device', type: 'info' });
                    handleReset();
                  }}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Download Receipt</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Payment Category Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'maintenance', label: 'Society Maint.', icon: ShieldCheck, tag: 'Most Popular' },
                  { id: 'property_tax', label: 'Property Tax', icon: Building, tag: 'Municipal Dues' },
                  { id: 'electricity', label: 'Electricity/Gas', icon: Zap, tag: 'BBPS Direct' },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = billType === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setBillType(tab.id as any)}
                      className={`p-3 rounded-2xl text-center border transition-all ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-400/60 shadow-lg shadow-emerald-500/10'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-emerald-400' : 'text-neutral-400'}`} />
                      <div className="text-xs font-bold text-white">{tab.label}</div>
                      <div className="text-[9px] text-emerald-300 font-medium mt-0.5">{tab.tag}</div>
                    </button>
                  );
                })}
              </div>

              {/* Form */}
              <form onSubmit={handlePay} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    {billType === 'property_tax' ? 'Property Owner / Assessment Name' : billType === 'maintenance' ? 'Society / RWA Name' : 'Consumer Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={payeeName}
                    onChange={(e) => setPayeeName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-white/15 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    {billType === 'property_tax' ? 'Property SAC / Assessment Number' : 'Society UPI / Consumer Number'}
                  </label>
                  <input
                    type="text"
                    required
                    value={payeeUpi}
                    onChange={(e) => setPayeeUpi(e.target.value)}
                    placeholder="e.g. society@okhdfcbank or 5010049281..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-white/15 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Payment Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-neutral-400 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount in Rupees"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-neutral-800/80 border border-white/15 text-white placeholder-neutral-500 text-xs font-bold focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  {parsedAmount > 0 && (
                    <div className="flex items-center justify-between text-[11px] mt-1.5 text-neutral-400">
                      <span>45 days interest-free credit</span>
                      <span className="text-emerald-400 font-bold">Earn ~₹{cashbackEstimated} rewards</span>
                    </div>
                  )}
                </div>

                {/* Benefits pill */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    <span className="text-neutral-200">Instant Society & Municipal Payment Receipt</span>
                  </div>
                  <span className="text-emerald-400 font-bold text-[11px]">Free PDF</span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-emerald-300 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-98 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                      <span>Processing Payment via Secure Gateway...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-neutral-950" />
                      <span>Pay ₹{parsedAmount ? parsedAmount.toLocaleString('en-IN') : '0'} with Credit Card / UPI</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. PLANS MODAL
// -------------------------------------------------------------
export function MobilePlansModal({ isOpen, onClose }: ModalBaseProps) {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('buyer_vip');

  if (!isOpen) return null;

  const plans = [
    {
      id: 'buyer_vip',
      name: 'Buyer VIP Pass',
      badge: 'Most Popular',
      price: '₹999',
      duration: 'Valid for 90 days',
      savings: 'Save up to ₹1,50,000 Brokerage',
      highlight: true,
      features: [
        'Dedicated Senior Property Advisor',
        'Direct Developer Pre-launch Inventory',
        'Unlimited verified site visits with cab pickup',
        'Free Title Search & Legal Verification (Worth ₹4,999)',
        'Zero Brokerage on all verified projects',
      ],
    },
    {
      id: 'owner_express',
      name: 'Owner Express Sale',
      badge: 'Fast Closing',
      price: '₹2,499',
      duration: 'Valid until property sold',
      savings: '100% Direct Buyer Leads',
      highlight: false,
      features: [
        'Professional HDR Photography & 3D Tour',
        'Featured top placement in search results',
        'AI Buyer Matching algorithm blast',
        'Dedicated Relationship Manager for buyer calls',
        'Standard Sales Agreement drafting included',
      ],
    },
    {
      id: 'investor_priority',
      name: 'Investor VIP Club',
      badge: 'High Yield Pre-Launch',
      price: '₹1,499',
      duration: 'Valid for 1 year',
      savings: 'Exclusive Pre-Launch Allocation',
      highlight: false,
      features: [
        'Priority access to developer pre-launch allotments',
        'Direct bulk-buying discounts & zero brokerage',
        'Comprehensive ROI & infrastructure growth analysis',
        'Dedicated senior portfolio manager',
      ],
    },
  ];

  const handleSelectPlan = (planName: string, price: string) => {
    toast({
      title: `${planName} Activated!`,
      description: `Your subscription of ${price} is active. Our VIP desk will contact you.`,
      type: 'success',
    });
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-neutral-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900/90 backdrop-blur-2xl border border-white/20 rounded-t-3xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-white max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="relative p-5 pb-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-b from-white/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-neutral-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Crown className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Exclusive Plans
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-[#F4C430] border border-amber-400/30 font-semibold">
                  Zero Brokerage
                </span>
              </h3>
              <p className="text-xs text-neutral-400">Save lakhs with VIP assistance and guaranteed verified deals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Plan cards */}
          <div className="space-y-3">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/15'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute top-3.5 right-3.5 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4A017] text-neutral-950">
                      {plan.badge}
                    </span>
                  )}

                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400 text-neutral-950'
                          : 'border-white/30 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                      <p className="text-[11px] text-amber-300 font-medium">{plan.savings}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-neutral-400">/ {plan.duration}</span>
                  </div>

                  {/* Features list */}
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  {isSelected && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPlan(plan.name, plan.price);
                      }}
                      className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-98 transition-all"
                    >
                      <span>Activate {plan.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
