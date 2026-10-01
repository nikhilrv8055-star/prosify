'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Share2,
  TrendingUp,
  Award,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Copy,
  Check,
  Building2,
  Users,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Zap,
  Gift,
  QrCode,
  CreditCard,
  MessageSquare,
  HelpCircle,
  Clock,
  ArrowUpRight,
  Smartphone,
  Download,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { useToast } from '@/components/ui/toast';
import {
  INITIAL_AFFILIATE_MEMBERS,
  INITIAL_AFFILIATE_CREATIVES,
  INITIAL_AFFILIATE_CONVERSIONS,
} from '@/lib/data/affiliateStore';
import { AffiliateUser, AffiliateTier } from '@/lib/types';

export default function AffiliateProgramPage() {
  const { toast } = useToast();

  // Active view mode: 'overview' or 'dashboard'
  const [activePortalTab, setActivePortalTab] = useState<'overview' | 'dashboard' | 'signup'>('overview');

  // Interactive Commission Calculator State
  const [propertyPrice, setPropertyPrice] = useState<number>(12500000); // 1.25 Crore default
  const [dealCount, setDealCount] = useState<number>(2);
  const [tierRate, setTierRate] = useState<number>(2.0); // 2%

  const estimatedCommissionPerDeal = (propertyPrice * tierRate) / 100;
  const totalEstimatedEarnings = estimatedCommissionPerDeal * dealCount;

  // Active Affiliate for Dashboard Demo
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateUser>(INITIAL_AFFILIATE_MEMBERS[0]);
  const [copiedLink, setCopiedLink] = useState(false);

  // New Signup Form State
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    audienceType: 'Social Media Influencer / YouTuber',
    referralCode: '',
    payoutType: 'UPI',
    upiId: '',
    bankAccount: '',
    ifsc: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payout request modal inside dashboard
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(selectedAffiliate.payableBalance);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const referralUrl = `https://prosify.in?ref=${selectedAffiliate.referralCode}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(referralUrl);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
    toast({
      title: 'Affiliate Referral Link Copied!',
      description: referralUrl,
      type: 'success',
    });
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.phone) {
      toast({
        title: 'Missing Details',
        description: 'Please complete all required fields.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const code = (signupForm.referralCode || signupForm.name.slice(0, 4) + 'PROP')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');

      const newAffiliate: AffiliateUser = {
        id: `aff-${Date.now()}`,
        name: signupForm.name,
        email: signupForm.email,
        phone: signupForm.phone,
        referralCode: code,
        tier: 'Bronze',
        commissionRatePercent: 1.5,
        totalClicks: 1,
        totalLeads: 0,
        totalSiteVisits: 0,
        totalBookings: 0,
        totalEarned: 0,
        payableBalance: 0,
        paidAmount: 0,
        status: 'active',
        joinedAt: new Date().toISOString().split('T')[0],
        payoutDetails: {
          payoutType: signupForm.payoutType === 'UPI' ? 'UPI' : 'BANK_TRANSFER',
          upiId: signupForm.upiId || 'member@upi',
          accountNumber: signupForm.bankAccount,
          ifscCode: signupForm.ifsc,
        },
      };

      setSelectedAffiliate(newAffiliate);
      setIsSubmitting(false);
      setActivePortalTab('dashboard');

      toast({
        title: 'Welcome to Prosify Affiliate Program! 🎉',
        description: `Your tracking code ${code} is now live. Share your link to start earning!`,
        type: 'success',
      });
    }, 600);
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount > selectedAffiliate.payableBalance) {
      toast({
        title: 'Insufficient Balance',
        description: `Available balance is ₹${selectedAffiliate.payableBalance.toLocaleString('en-IN')}`,
        type: 'error',
      });
      return;
    }

    if (payoutAmount < 1000) {
      toast({
        title: 'Minimum Withdrawal is ₹1,000',
        description: 'Please enter an amount of at least ₹1,000.',
        type: 'error',
      });
      return;
    }

    setSelectedAffiliate((prev) => ({
      ...prev,
      payableBalance: prev.payableBalance - payoutAmount,
      paidAmount: prev.paidAmount + payoutAmount,
    }));

    setPayoutModalOpen(false);
    toast({
      title: 'Payout Request Submitted',
      description: `₹${payoutAmount.toLocaleString('en-IN')} will be transferred to your account within 24 hours.`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden border-b border-neutral-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* RERA Transparency Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide uppercase mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MahaRERA Certified Property Distribution & Referral Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Turn Property Referrals Into <span className="text-[#F4C430]">High-Yield Wealth</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base lg:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Earn up to <strong className="text-white">3.0% commission</strong> (₹1,50,000 to ₹15,00,000+ per deal) by introducing home buyers and NRI investors to verified high-demand projects in Mumbai MMR & Pune.
          </p>

          {/* Quick CTA Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setActivePortalTab('signup')}
              className="px-6 py-3.5 rounded-2xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Join Program & Get Referral Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActivePortalTab('dashboard')}
              className="px-6 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm transition-all border border-neutral-700 flex items-center gap-2 cursor-pointer"
            >
              <span>Affiliate Dashboard Demo</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-left">
              <span className="text-xs text-neutral-400 block font-medium">Top Commission Rate</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">Up to 3.0%</div>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">Direct developer payout</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-left">
              <span className="text-xs text-neutral-400 block font-medium">Tracking Window</span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">60 Days</div>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">Cross-device cookie attribution</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-left">
              <span className="text-xs text-neutral-400 block font-medium">Site Visit Bonus</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">₹1,500</div>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">Per verified buyer visit</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-left">
              <span className="text-xs text-neutral-400 block font-medium">Payout Settlement</span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">Weekly</div>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">Instant UPI & NEFT transfer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tab Navigation */}
      <section className="bg-neutral-900/60 border-b border-neutral-800 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 sm:gap-6 py-3">
            {[
              { id: 'overview', label: '1. Program Overview & Earnings', icon: Sparkles },
              { id: 'dashboard', label: '2. Affiliate Dashboard (Live)', icon: Zap },
              { id: 'signup', label: '3. Instant Onboarding Form', icon: ArrowRight },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activePortalTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePortalTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-neutral-950 shadow-md font-black'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* TAB CONTENT */}
      <main className="flex-1 py-10">
        {/* ======================================================================= */}
        {/* TAB 1: OVERVIEW & CALCULATOR                                           */}
        {/* ======================================================================= */}
        {activePortalTab === 'overview' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {/* Interactive Commission Calculator */}
            <div className="p-6 sm:p-10 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl relative overflow-hidden">
              <div className="max-w-3xl">
                <span className="text-amber-400 text-xs font-black uppercase tracking-wider block">
                  Potential Earnings Simulation
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  How Much Can You Earn As A Prosify Affiliate?
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-2">
                  Select average property value and expected bookings to simulate your monthly commission.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-center">
                {/* Inputs */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Property Value Slider */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-neutral-300">Average Property Agreement Value:</span>
                      <span className="text-amber-400 font-mono text-sm">
                        ₹{(propertyPrice / 100000).toLocaleString('en-IN')} Lakhs ({propertyPrice >= 10000000 ? `₹${(propertyPrice / 10000000).toFixed(2)} Cr` : ''})
                      </span>
                    </div>
                    <input
                      type="range"
                      min={4000000}
                      max={50000000}
                      step={500000}
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(Number(e.target.value))}
                      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#D4A017]"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-mono">
                      <span>₹40 Lakhs (Affordable)</span>
                      <span>₹1.5 Cr (Mid-Luxe)</span>
                      <span>₹5.0 Cr (Ultra-Luxury)</span>
                    </div>
                  </div>

                  {/* Deals Count */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-neutral-300">Successful Deals / Month:</span>
                      <span className="text-white font-mono text-sm">{dealCount} Bookings</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 4, 8, 12].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setDealCount(num)}
                          className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            dealCount === num
                              ? 'bg-amber-500 text-neutral-950 font-black'
                              : 'bg-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {num} {num === 1 ? 'deal' : 'deals'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tier Rate Selection */}
                  <div>
                    <span className="block text-xs font-bold text-neutral-300 mb-2">Your Affiliate Tier:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { tier: 'Bronze', rate: 1.5 },
                        { tier: 'Silver', rate: 1.8 },
                        { tier: 'Gold', rate: 2.2 },
                        { tier: 'Diamond', rate: 2.8 },
                      ].map((t) => (
                        <button
                          key={t.tier}
                          type="button"
                          onClick={() => setTierRate(t.rate)}
                          className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                            tierRate === t.rate
                              ? 'bg-amber-500/20 border-amber-500 text-white'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          <span className="block text-xs font-bold text-white">{t.tier}</span>
                          <span className="text-sm font-black text-amber-400">{t.rate}% rate</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Result Card */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-amber-950/20 border border-amber-500/30 text-center space-y-4 shadow-xl">
                  <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block">
                    Estimated Monthly Payout
                  </span>

                  <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                    <span className="text-amber-400">₹</span>
                    {totalEstimatedEarnings.toLocaleString('en-IN')}
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-left space-y-1.5 text-xs text-neutral-300">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Per Deal Commission:</span>
                      <span className="font-bold text-emerald-400">
                        ₹{estimatedCommissionPerDeal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Total Deals Calculated:</span>
                      <span className="font-bold text-white">{dealCount} closed transactions</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Site Visit Bonuses (Avg. 5/deal):</span>
                      <span className="font-bold text-amber-400">+₹{(dealCount * 5 * 1500).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePortalTab('signup')}
                    className="w-full py-3.5 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    Start Earning With This Rate
                  </button>
                </div>
              </div>
            </div>

            {/* How It Works (3 Steps) */}
            <div className="space-y-6 text-center">
              <span className="text-amber-400 text-xs font-black uppercase tracking-wider">
                Seamless Digital Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">How The Program Works</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-6">
                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 relative">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg">
                    1
                  </div>
                  <h3 className="text-base font-bold text-white">Get Your Referral Link</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Sign up in 60 seconds to receive your unique tracking link and custom QR code. Access banners, WhatsApp swipe copy, and project flyers.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 relative">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-lg">
                    2
                  </div>
                  <h3 className="text-base font-bold text-white">Refer Buyers & Investors</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Share links on WhatsApp, YouTube, Instagram, or email. When buyers click, a 60-day cookie attributes all their inquiries and bookings to your account.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 relative">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg">
                    3
                  </div>
                  <h3 className="text-base font-bold text-white">Get Instant Bank Payouts</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Track leads in real-time. When a buyer completes a site visit or token booking, commission credits to your dashboard. Withdraw via UPI or NEFT.
                  </p>
                </div>
              </div>
            </div>

            {/* Commission Tiers */}
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-amber-400 text-xs font-black uppercase tracking-wider">
                  Growth & Rewards
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Affiliate Partner Tiers</h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Higher volume unlocks higher commission rates, VIP event invites, and custom landing pages.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    name: 'Bronze Partner',
                    rate: '1.5%',
                    perks: ['Standard 60-day cookie', 'Access to social swipe copy', 'Weekly UPI settlement', 'Live lead pipeline tracking'],
                    criteria: '0 - 1 Booking / Mo',
                    highlight: false,
                  },
                  {
                    name: 'Silver Partner',
                    rate: '1.8%',
                    perks: ['Dedicated Account Manager', 'Pre-launch project allocations', 'Priority site visit cab booking', 'WhatsApp lead alerts'],
                    criteria: '2 - 4 Bookings / Mo',
                    highlight: false,
                  },
                  {
                    name: 'Gold Partner',
                    rate: '2.2%',
                    perks: ['Custom branded landing page', 'Co-branded marketing collateral', '₹2,500 site visit bonus', 'Bi-weekly developer previews'],
                    criteria: '5 - 9 Bookings / Mo',
                    highlight: true,
                  },
                  {
                    name: 'Diamond VIP',
                    rate: '2.8% - 3.0%',
                    perks: ['Direct developer desk access', 'Instant 24-hr NEFT disbursement', 'Quarterly luxury performance incentives', 'NRI investor webinar hosting'],
                    criteria: '10+ Bookings / Mo',
                    highlight: false,
                  },
                ].map((tier, i) => (
                  <div
                    key={i}
                    className={`p-6 rounded-2xl flex flex-col justify-between transition-all ${
                      tier.highlight
                        ? 'bg-neutral-900 border-2 border-amber-500 shadow-xl ring-2 ring-amber-500/20'
                        : 'bg-neutral-900/70 border border-neutral-800'
                    }`}
                  >
                    <div>
                      {tier.highlight && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-black uppercase tracking-wider mb-2 inline-block">
                          Most Popular
                        </span>
                      )}
                      <h3 className="text-base font-bold text-white">{tier.name}</h3>
                      <div className="text-3xl font-black text-amber-400 mt-2 font-mono">{tier.rate}</div>
                      <span className="text-[11px] text-neutral-400 block mt-0.5 font-semibold">
                        {tier.criteria}
                      </span>

                      <ul className="mt-4 space-y-2 text-xs text-neutral-300">
                        {tier.perks.map((p, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePortalTab('signup')}
                      className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        tier.highlight
                          ? 'bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black shadow-md'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                      }`}
                    >
                      Apply For {tier.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="text-center mb-6">
                <span className="text-amber-400 text-xs font-black uppercase tracking-wider">Help & Clarity</span>
                <h2 className="text-2xl font-black text-white mt-1">Frequently Asked Questions</h2>
              </div>

              {[
                {
                  q: 'Do I need a MahaRERA broker license to join the Affiliate Program?',
                  a: 'No. Digital affiliates and influencers refer prospective leads under Prosify’s certified RERA distribution network. Prosify handles all developer site interactions, compliance documentation, and deed registrations.',
                },
                {
                  q: 'How does referral tracking and attribution work?',
                  a: 'When an interested buyer clicks your link (e.g. prosify.in?ref=YOURCODE), a 60-day cookie is saved. Any inquiry, requirement post, or booking submitted during this window is automatically tagged to your partner profile.',
                },
                {
                  q: 'When and how are commissions paid out?',
                  a: 'Commissions are credited immediately upon developer milestone verification (e.g. token booking or deed registration). You can withdraw to your UPI ID or Bank account anytime your balance exceeds ₹1,000.',
                },
                {
                  q: 'Can I refer family, friends, or myself?',
                  a: 'Yes, absolutely! Many affiliates successfully refer colleagues, friends, or purchase their own primary home to save significant brokerage fees through direct developer rebates.',
                },
              ].map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <span>{item.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/80 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 2: LIVE AFFILIATE DASHBOARD                                        */}
        {/* ======================================================================= */}
        {activePortalTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Dashboard Header Bar */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 flex items-center justify-center font-black text-xl shadow-md">
                  {selectedAffiliate.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedAffiliate.name}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase">
                      {selectedAffiliate.tier} Tier ({selectedAffiliate.commissionRatePercent}%)
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Member since {selectedAffiliate.joinedAt} • Code: <strong className="text-white font-mono">{selectedAffiliate.referralCode}</strong>
                  </p>
                </div>
              </div>

              {/* Demo Profile Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 hidden sm:inline">Switch Demo Profile:</span>
                <select
                  value={selectedAffiliate.id}
                  onChange={(e) => {
                    const found = INITIAL_AFFILIATE_MEMBERS.find((m) => m.id === e.target.value);
                    if (found) setSelectedAffiliate(found);
                  }}
                  className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {INITIAL_AFFILIATE_MEMBERS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.tier})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Referral Link & Share Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/20 via-neutral-900 to-neutral-900 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Your Dedicated Affiliate Tracking Link:</span>
                </span>
                <span className="text-[11px] text-neutral-400">60-Day Cookie Auto-Attached</span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-200 truncate select-all">
                  {referralUrl}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Namaste! If you are planning to buy a verified 2 or 3 BHK flat in Mumbai or Pune with direct developer pricing, check out this curated list: ${referralUrl}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>WhatsApp Share</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block font-medium">Link Clicks</span>
                <span className="text-xl font-black text-white font-mono mt-1 block">
                  {selectedAffiliate.totalClicks.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block font-medium">Buyer Inquiries</span>
                <span className="text-xl font-black text-amber-400 font-mono mt-1 block">
                  {selectedAffiliate.totalLeads}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block font-medium">Site Visits Done</span>
                <span className="text-xl font-black text-cyan-400 font-mono mt-1 block">
                  {selectedAffiliate.totalSiteVisits}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block font-medium">Booked Deals</span>
                <span className="text-xl font-black text-emerald-400 font-mono mt-1 block">
                  {selectedAffiliate.totalBookings}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block font-medium">Total Earned</span>
                <span className="text-xl font-black text-white font-mono mt-1 block">
                  ₹{(selectedAffiliate.totalEarned / 1000).toFixed(0)}k
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-[11px] text-amber-400 block font-bold">Payable Balance</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-black text-amber-300 font-mono">
                    ₹{(selectedAffiliate.payableBalance / 1000).toFixed(0)}k
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPayoutAmount(selectedAffiliate.payableBalance);
                      setPayoutModalOpen(true);
                    }}
                    disabled={selectedAffiliate.payableBalance <= 0}
                    className="text-[10px] font-black text-neutral-950 bg-amber-400 px-2 py-0.5 rounded cursor-pointer hover:bg-amber-300 disabled:opacity-50"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>

            {/* Referred Deals Pipeline Table */}
            <div className="bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden">
              <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Your Referred Buyer Pipeline & Commissions</h3>
                  <span className="text-xs text-neutral-400">
                    Live updates as your leads progress from inquiry to deed registration.
                  </span>
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {selectedAffiliate.commissionRatePercent}% Rate Applied
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Buyer Lead</th>
                      <th className="py-3 px-4">Property & Project</th>
                      <th className="py-3 px-4">Pipeline Status</th>
                      <th className="py-3 px-4">Agreement Value</th>
                      <th className="py-3 px-4 text-right">Commission Earned</th>
                      <th className="py-3 px-4 text-center">Payout Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {INITIAL_AFFILIATE_CONVERSIONS.filter(
                      (c) => c.referralCode === selectedAffiliate.referralCode
                    ).map((conv) => (
                      <tr key={conv.id} className="hover:bg-neutral-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{conv.buyerName}</span>
                          <span className="text-[10px] text-neutral-400">{conv.buyerPhone}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-neutral-200 block">{conv.propertyTitle}</span>
                          <span className="text-[10px] text-neutral-400">{conv.city}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              conv.stage === 'DEED_REGISTRATION'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : conv.stage === 'TOKEN_BOOKED'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            }`}
                          >
                            {conv.stage.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          ₹{(conv.dealValue / 100000).toLocaleString('en-IN')} Lakhs
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-400 text-sm">
                          ₹{conv.commissionAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              conv.status === 'PAID'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {conv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {INITIAL_AFFILIATE_CONVERSIONS.filter(
                      (c) => c.referralCode === selectedAffiliate.referralCode
                    ).length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-neutral-500">
                          No referrals recorded yet. Share your referral link above to see referred buyers appear here!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ready-to-Share Swipe Creatives */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Ready-Made Promotional Creatives</h3>
                  <span className="text-xs text-neutral-400">Copy pre-written captions with your link already embedded.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INITIAL_AFFILIATE_CREATIVES.slice(0, 2).map((crt) => {
                  const customizedText = crt.copyText ? crt.copyText.replace('{LINK}', referralUrl) : '';
                  return (
                    <div
                      key={crt.id}
                      className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase">
                          {crt.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-neutral-400">{crt.targetCategory}</span>
                      </div>

                      <h4 className="text-xs font-bold text-white">{crt.title}</h4>

                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-300 font-mono whitespace-pre-line max-h-36 overflow-y-auto">
                        {customizedText}
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                              navigator.clipboard.writeText(customizedText);
                            }
                            toast({
                              title: 'Caption Copied!',
                              description: 'Ready to paste into WhatsApp, Telegram, or Instagram!',
                              type: 'success',
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy With My Link</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 3: INSTANT ONBOARDING FORM                                         */}
        {/* ======================================================================= */}
        {activePortalTab === 'signup' && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="text-center space-y-2">
              <span className="text-amber-400 text-xs font-black uppercase tracking-wider">
                60-Second Setup
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Join The Prosify Affiliate Program
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Start sharing curated real-estate listings immediately. No paperwork or upfront fee required.
              </p>
            </div>

            <form
              onSubmit={handleSignupSubmit}
              className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Your Full Name / Brand *</label>
                <input
                  type="text"
                  required
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  placeholder="E.g. Siddharth Verma (Property Vlogs)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    placeholder="your.email@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                    placeholder="+91 98200 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">How Do You Reach Property Buyers?</label>
                <select
                  value={signupForm.audienceType}
                  onChange={(e) => setSignupForm({ ...signupForm, audienceType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option>Social Media Influencer / YouTuber</option>
                  <option>Real Estate Consultant / Channel Partner</option>
                  <option>Corporate Employee / IT Professional Network</option>
                  <option>NRI Community Leader / Financial Advisor</option>
                  <option>Direct Friends & Family Referrals</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Preferred Custom Referral Code (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-neutral-500">prosify.in?ref=</span>
                  <input
                    type="text"
                    value={signupForm.referralCode}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, referralCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })
                    }
                    placeholder="MYHOMES"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-amber-400 font-mono font-bold uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Settlement Preference */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 block">Payout Details for Commission Transfers</span>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payoutType"
                      checked={signupForm.payoutType === 'UPI'}
                      onChange={() => setSignupForm({ ...signupForm, payoutType: 'UPI' })}
                      className="text-amber-500 focus:ring-0"
                    />
                    <span className="text-white font-bold">UPI ID (Instant Transfer)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payoutType"
                      checked={signupForm.payoutType === 'BANK'}
                      onChange={() => setSignupForm({ ...signupForm, payoutType: 'BANK' })}
                      className="text-amber-500 focus:ring-0"
                    />
                    <span className="text-white font-bold">Bank Account (NEFT/RTGS)</span>
                  </label>
                </div>

                {signupForm.payoutType === 'UPI' ? (
                  <div>
                    <label className="block text-neutral-400 mb-1 text-[11px]">UPI Virtual Payment Address (VPA)</label>
                    <input
                      type="text"
                      value={signupForm.upiId}
                      onChange={(e) => setSignupForm({ ...signupForm, upiId: e.target.value })}
                      placeholder="username@okhdfcbank or 9820012345@upi"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-neutral-400 mb-1 text-[11px]">Account Number</label>
                      <input
                        type="text"
                        value={signupForm.bankAccount}
                        onChange={(e) => setSignupForm({ ...signupForm, bankAccount: e.target.value })}
                        placeholder="50100..."
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1 text-[11px]">IFSC Code</label>
                      <input
                        type="text"
                        value={signupForm.ifsc}
                        onChange={(e) => setSignupForm({ ...signupForm, ifsc: e.target.value.toUpperCase() })}
                        placeholder="HDFC0000128"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono uppercase"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-sm uppercase tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Generating Your Tracking Code...' : 'Activate My Affiliate Account Now'}
                </button>
              </div>

              <p className="text-[11px] text-neutral-500 text-center">
                By joining, you agree to MahaRERA ethical promotional standards and direct broker commission disbursement terms.
              </p>
            </form>
          </div>
        )}
      </main>

      {/* WITHDRAWAL / PAYOUT MODAL */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl p-6 relative">
            <h3 className="text-base font-bold text-white">Withdraw Affiliate Earnings</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Transfer your cleared commissions to your linked account.
            </p>

            <form onSubmit={handleRequestPayout} className="space-y-4 mt-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex justify-between items-center">
                <span className="text-neutral-400">Available Balance:</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  ₹{selectedAffiliate.payableBalance.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Withdrawal Amount (₹) *
                </label>
                <input
                  type="number"
                  min={1000}
                  max={selectedAffiliate.payableBalance}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono font-bold"
                />
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400">
                Destination: <strong className="text-white">{selectedAffiliate.payoutDetails.upiId || selectedAffiliate.payoutDetails.accountNumber}</strong>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayoutModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black cursor-pointer shadow-md"
                >
                  Confirm Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
