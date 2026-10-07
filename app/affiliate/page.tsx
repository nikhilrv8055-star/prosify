'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
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
  MapPin,
  Mail,
  Lock,
  LogOut,
  Code2,
  Megaphone,
  Send,
  FileText,
  RefreshCw,
  Rocket,
  Layers,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/lib/auth/authContext';
import { useLiveStore } from '@/lib/data/useLiveStore';
import { PAN_INDIA_CITIES } from '@/lib/data/panIndiaData';

// Initial mock conversion records for live demo
const SAMPLE_AFFILIATE_CONVERSIONS = [
  {
    id: 'conv-101',
    buyerName: 'Amit Sharma',
    buyerPhone: '+91 98201 *****',
    propertyTitle: 'Lodha Woods, Kandivali East',
    city: 'Mumbai MMR',
    stage: 'DEED_REGISTRATION',
    dealValue: 18500000,
    commissionAmount: 46250,
    status: 'PAID',
    payoutRef: 'UPI-PROS-984210',
    date: '2026-03-18',
  },
  {
    id: 'conv-102',
    buyerName: 'Rohit Mehta',
    buyerPhone: '+91 98114 *****',
    propertyTitle: 'Godrej Nest, Baner',
    city: 'Pune',
    stage: 'TOKEN_BOOKED',
    dealValue: 14500000,
    commissionAmount: 36250,
    status: 'PAID',
    payoutRef: 'UPI-PROS-984211',
    date: '2026-03-24',
  },
  {
    id: 'conv-103',
    buyerName: 'Pooja Iyer',
    buyerPhone: '+91 99002 *****',
    propertyTitle: 'Prestige Falcon City, Kanakapura Road',
    city: 'Bangalore',
    stage: 'DEED_REGISTRATION',
    dealValue: 22000000,
    commissionAmount: 55000,
    status: 'PAID',
    payoutRef: 'NEFT-PROS-772190',
    date: '2026-04-02',
  },
  {
    id: 'conv-104',
    buyerName: 'Vikram Rathore',
    buyerPhone: '+91 97188 *****',
    propertyTitle: 'DLF The Arbour, Golf Course Extension',
    city: 'Delhi NCR',
    stage: 'SITE_VISIT_VERIFIED',
    dealValue: 31000000,
    commissionAmount: 42500,
    status: 'PENDING',
    payoutRef: 'Pending Registration',
    date: '2026-04-05',
  },
];

export default function AffiliateProgramPage() {
  const { toast } = useToast();
  const { user, isAuthenticated, login, loginWithGoogle, logout } = useAuth();
  const { leads: liveLeads } = useLiveStore();

  // Email / Gmail Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active dashboard view tab
  const [dashboardSubTab, setDashboardSubTab] = useState<'income' | 'ads' | 'code' | 'calculator'>('income');

  // Interactive Commission Calculator State
  const [propertyPrice, setPropertyPrice] = useState<number>(12500000); // 1.25 Crore default
  const [dealCount, setDealCount] = useState<number>(2);
  const [tierRate, setTierRate] = useState<number>(2.5); // 2.5% default

  const estimatedCommissionPerDeal = (propertyPrice * tierRate) / 100;
  const totalEstimatedEarnings = estimatedCommissionPerDeal * dealCount;

  // Partner tracking code derived from user
  const partnerCode = useMemo(() => {
    if (!user) return 'PROSIFY1000';
    if (user.email && user.email.toLowerCase().includes('nikhil')) return 'PROSIFY-NIKHIL-8055';
    const cleanName = (user.name || user.email.split('@')[0])
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    return `PROSIFY-${cleanName.slice(0, 8) || 'PARTNER'}`;
  }, [user]);

  const referralUrl = `https://prosify.in?ref=${partnerCode}`;

  // Copy helper
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedHtmlCode, setCopiedHtmlCode] = useState(false);
  const [copiedAdIndex, setCopiedAdIndex] = useState<number | null>(null);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(referralUrl);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    toast({
      title: 'Affiliate Referral Link Copied!',
      description: referralUrl,
      type: 'success',
    });
  };

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(partnerCode);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    toast({
      title: 'Partner Code Copied!',
      description: partnerCode,
      type: 'success',
    });
  };

  // Payout request modal inside dashboard
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(42500);
  const [totalPaidAmount, setTotalPaidAmount] = useState(142500);
  const [payoutAmount, setPayoutAmount] = useState(42500);
  const [payoutUpi, setPayoutUpi] = useState('nikhilrv8055@okaxis');
  const [payoutHistory, setPayoutHistory] = useState([
    { id: 'tx-801', amount: 50000, upi: 'nikhilrv8055@okaxis', date: '2026-03-20', status: 'PAID', utr: 'UPI/608920198421' },
    { id: 'tx-802', amount: 92500, upi: 'nikhilrv8055@okaxis', date: '2026-03-05', status: 'PAID', utr: 'NEFT/N90283401928' },
  ]);

  // Ad post generator custom state
  const [adCity, setAdCity] = useState('Mumbai');
  const [adPropertyType, setAdPropertyType] = useState('Luxury Apartments');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Authentication Handlers
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const emailToUse = loginEmail.trim() || 'nikhilrv8055@gmail.com';
      await loginWithGoogle({
        email: emailToUse,
        name: emailToUse.toLowerCase().includes('nikhil') ? 'Nikhil R V' : emailToUse.split('@')[0],
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        role: 'CHANNEL_PARTNER',
      });
      toast({
        title: 'Logged in with Google! 🎉',
        description: `Welcome to Prosify Affiliate Partner Portal (${emailToUse})`,
        type: 'success',
      });
    } catch {
      await login('nikhilrv8055@gmail.com', 'CHANNEL_PARTNER');
      toast({
        title: 'Welcome to Affiliate Dashboard!',
        description: 'Signed in successfully.',
        type: 'success',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginEmail.includes('@')) {
      toast({
        title: 'Valid Email Required',
        description: 'Please enter a valid Gmail or email address to sign in.',
        type: 'error',
      });
      return;
    }

    setIsLoggingIn(true);
    try {
      await login(loginEmail.trim(), 'CHANNEL_PARTNER');
      toast({
        title: 'Logged In Successfully! 🎉',
        description: `Affiliate dashboard unlocked for ${loginEmail.trim()}`,
        type: 'success',
      });
    } catch {
      toast({
        title: 'Signed In',
        description: 'Welcome to your Affiliate Dashboard.',
        type: 'success',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount > availableBalance) {
      toast({
        title: 'Insufficient Balance',
        description: `Available balance is ₹${availableBalance.toLocaleString('en-IN')}`,
        type: 'error',
      });
      return;
    }

    if (payoutAmount < 1000) {
      toast({
        title: 'Minimum Withdrawal ₹1,000',
        description: 'Please enter an amount of at least ₹1,000.',
        type: 'error',
      });
      return;
    }

    setAvailableBalance((prev) => prev - payoutAmount);
    setTotalPaidAmount((prev) => prev + payoutAmount);
    setPayoutHistory((prev) => [
      {
        id: `tx-${Date.now().toString().slice(-4)}`,
        amount: payoutAmount,
        upi: payoutUpi,
        date: new Date().toISOString().split('T')[0],
        status: 'PROCESSING',
        utr: `UPI/PROS-${Math.floor(100000 + Math.random() * 900000)}`,
      },
      ...prev,
    ]);
    setPayoutModalOpen(false);

    toast({
      title: 'Withdrawal Request Submitted! 💸',
      description: `₹${payoutAmount.toLocaleString('en-IN')} is being transferred to ${payoutUpi}. Payout arrives within 24 hours.`,
      type: 'success',
    });
  };

  // Pre-generated social and advertising posts
  const autogeneratedAds = useMemo(() => {
    return [
      {
        id: 'ad-whatsapp-township',
        title: '1. WhatsApp / Telegram: High-Yield New Launch Alert',
        channel: 'WhatsApp & Telegram',
        badge: 'HIGHEST CONVERSION',
        color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
        text: `🚀 *EXCLUSIVE PRE-LAUNCH INVITATION - ZERO BROKERAGE!*

Looking to buy a luxury home or high-yield investment in 2026? 
Stop paying middlemen 2% brokerage fees!

Browse 100% MahaRERA & RERA verified luxury townships with *direct developer launch pricing*:
✅ *Direct Builder Pricing*: Save ₹3 Lakhs to ₹15 Lakhs per deal
✅ *Prime Metros*: Mumbai MMR, Pune, Bangalore, Hyderabad & Delhi NCR
✅ *Zero Brokerage Guarantee*: Direct developer inventory
✅ *Early-Bird Pre-Booking*: Extra floor-rise & payment plan waivers

👉 *Explore Live Projects & Reserve Unit:*
${referralUrl}

🎟 *VIP Partner Booking Code:* ${partnerCode}
(Enter this code during inquiry for prioritized site visit cab pickup!)`,
        whatsappShareText: `🚀 *EXCLUSIVE REAL ESTATE PRE-LAUNCH INVITATION* - Verified luxury 2 & 3 BHK homes with Zero Brokerage and direct developer launch discounts: ${referralUrl}`,
      },
      {
        id: 'ad-instagram-luxury',
        title: '2. Instagram / Facebook: Zero-Brokerage Homebuyer Post',
        channel: 'Instagram & Facebook',
        badge: 'SOCIAL VIRAL',
        color: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
        text: `🏡 *Buying your dream home in 2026? Read this before paying a broker!*

Did you know most home buyers lose ₹2,00,000 - ₹5,00,000 in brokerage fees for simple builder inventory?

With Prosify, you get:
✨ Direct access to Tier-1 developers (Lodha, Godrej, Prestige, DLF, Oberoi, Sobha)
✨ Transparent RERA carpet area price benchmarks
✨ Free assisted legal deed verification
✨ Zero spam, direct developer allocation

🔗 Tap the link below to search verified homes across India's top 9 metros:
${referralUrl}

Use my exclusive invite code: ${partnerCode}

#RealEstateIndia #ZeroBrokerage #PropertyInvestment #DreamHome #ProsifyPartner #MumbaiRealEstate #BangaloreHomes #PuneProperties`,
        whatsappShareText: `🏡 Stop paying 2% brokerage fees! Browse verified homes directly from Grade-A builders with Prosify: ${referralUrl}`,
      },
      {
        id: 'ad-linkedin-nri',
        title: '3. LinkedIn / Professional Network: NRI & Wealth Investment',
        channel: 'LinkedIn & Professional',
        badge: 'HIGH TICKET (₹1.5Cr+)',
        color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-400',
        text: `📊 *Why Indian Residential Real Estate is delivering 12-16% IRR for Domestic & NRI Wealth Portfolios in 2026:*

Key investment drivers:
1. Macro infrastructure tailwinds (Metro expansions, Coastal roads, Expressways)
2. Institutional Grade-A developer dominance ensuring strict RERA delivery timelines
3. Rental yield expansion to 4.2% - 6.5% across Bengaluru tech corridors, Mumbai MMR, and Pune IT hubs.

Through Prosify's direct developer network, investors access early-round institutional pricing with zero brokerage markups and authenticated title documentation.

Access the curated Pan-India investment catalogue here:
${referralUrl}

Institutional Reference Code: ${partnerCode}`,
        whatsappShareText: `📊 High-yield real estate investment opportunities across top Indian metros with direct developer pricing: ${referralUrl}`,
      },
      {
        id: 'ad-commercial-office',
        title: '4. Commercial: Grade-A Office & Pre-Leased Retail',
        channel: 'Commercial & Corporate',
        badge: 'STEADY RENTAL YIELD',
        color: 'border-purple-500/40 bg-purple-950/20 text-purple-400',
        text: `🏢 *Commercial Real Estate Opportunity: Pre-Leased Offices & Retail Storefronts*

Generate predictable passive cashflow with Grade-A commercial properties:
💼 Pre-leased offices with 8.2% - 9.5% gross rental yields
🏢 Prime corporate corridors (BKC, Powai, Hinjewadi, Whitefield, Cyber City)
📑 Audited 9-year lease deeds with MNC & institutional tenants
💰 Ticket sizes starting from ₹65 Lakhs up to ₹25+ Crores

View Verified Commercial Listings:
${referralUrl}

Partner Access Tag: ${partnerCode}`,
        whatsappShareText: `🏢 High-yield commercial pre-leased offices & retail shops across top business hubs: ${referralUrl}`,
      },
    ];
  }, [referralUrl, partnerCode]);

  // Embeddable HTML Website Banner Code
  const embedHtmlCode = useMemo(() => {
    return `<!-- Prosify Verified Real Estate Partner Ad Banner -->
<a href="${referralUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block; text-decoration:none;">
  <div style="background:#171717; color:#ffffff; padding:16px 24px; border-radius:16px; border:1px solid #D4A017; font-family:sans-serif; max-width:600px;">
    <span style="color:#D4A017; font-size:11px; font-weight:bold; text-transform:uppercase; letter-spacing:1px;">Verified Pan-India Real Estate</span>
    <h3 style="margin:6px 0; font-size:18px; color:#ffffff;">Zero Brokerage on Verified Homes & New Launches</h3>
    <p style="margin:4px 0 12px; font-size:13px; color:#a3a3a3;">Direct developer pricing across Mumbai, Pune, Bangalore, Hyderabad & Delhi NCR.</p>
    <span style="background:#D4A017; color:#000000; padding:8px 16px; border-radius:8px; font-weight:bold; font-size:12px; display:inline-block;">Explore Properties &rarr;</span>
  </div>
</a>`;
  }, [referralUrl]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950">
      <Navbar />

      {/* ======================================================================= */}
      {/* 1. UNAUTHENTICATED STATE: FIRST EMAIL / GMAIL LOGIN REQUIRED            */}
      {/* ======================================================================= */}
      {!isAuthenticated || !user ? (
        <div className="flex-1 py-12 lg:py-20 flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden">
          {/* Background ambient lighting */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

          <div className="max-w-xl w-full relative z-10 space-y-6">
            {/* Header Badge */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Prosify Partner & Affiliate Portal</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Sign In to Access Your <span className="text-[#F4C430]">Affiliate Dashboard</span>
              </h1>

              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                Log in with your Gmail or Email address to unlock your live referral income, autogenerated advertising posts, and custom partner code.
              </p>
            </div>

            {/* Login Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-5">
              {/* Option A: One-Click Continue with Google (Gmail) */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {/* Google SVG Icon */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>{isLoggingIn ? 'Signing in with Google...' : 'Continue with Google (Gmail)'}</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-neutral-800 w-full" />
                <span className="bg-neutral-900 px-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider shrink-0">
                  Or Sign In with Email
                </span>
                <div className="border-t border-neutral-800 w-full" />
              </div>

              {/* Option B: Direct Email Form */}
              <form onSubmit={handleEmailLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Your Gmail / Work Email Address:
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. nikhilrv8055@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-medium text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 text-neutral-950" />
                  <span>{isLoggingIn ? 'Verifying...' : 'Sign In to Affiliate Dashboard'}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-950" />
                </button>
              </form>

              {/* Quick prefill shortcut for user */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('nikhilrv8055@gmail.com');
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
                >
                  Quick fill: nikhilrv8055@gmail.com
                </button>
              </div>
            </div>

            {/* Program Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                <span className="text-amber-400 font-black text-sm block">Up to 3%</span>
                <span className="text-[10px] text-neutral-400">Commission</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                <span className="text-emerald-400 font-black text-sm block">Autogenerated</span>
                <span className="text-[10px] text-neutral-400">Ad Posts & Copy</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                <span className="text-cyan-400 font-black text-sm block">Unique Code</span>
                <span className="text-[10px] text-neutral-400">60-Day Tracking</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                <span className="text-purple-400 font-black text-sm block">Weekly UPI</span>
                <span className="text-[10px] text-neutral-400">Direct Payouts</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================================= */
        /* 2. AUTHENTICATED STATE: FULL AFFILIATE DASHBOARD                        */
        /* ======================================================================= */
        <div className="flex-1 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 w-full">
          {/* Top Partner Profile & Authentication Status Bar */}
          <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 flex items-center justify-center font-black text-xl shadow-md shrink-0">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    {user.name || user.email.split('@')[0]}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase">
                    Gold Partner (2.5% Commission)
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5 flex flex-wrap items-center gap-1.5">
                  <span>{user.email}</span>
                  <span>•</span>
                  <span>Partner Code: <strong className="text-white font-mono">{partnerCode}</strong></span>
                </p>
              </div>
            </div>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Sign Out / Switch Account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Tracking URL Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/20 via-neutral-900 to-neutral-900 border border-amber-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-xs font-bold text-amber-400 shrink-0 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                <span>Your Referral URL:</span>
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-200 truncate select-all">
                {referralUrl}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copiedCode ? 'Code Copied' : `Code: ${partnerCode}`}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Namaste! If you are planning to buy a verified home across top Indian metros (Mumbai, Pune, Bangalore, Hyderabad, Chennai, Delhi NCR) with direct developer pricing and zero brokerage, browse verified projects here: ${referralUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>WhatsApp Share</span>
              </a>
            </div>
          </div>

          {/* Dashboard Navigation Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 border-b border-neutral-800 pb-2 overflow-x-auto">
            {[
              { id: 'income', label: '1. My Income & Payouts', icon: DollarSign },
              { id: 'ads', label: '2. Autogenerated Ads Post', icon: Megaphone },
              { id: 'code', label: '3. Tracking Code & Tools', icon: Code2 },
              { id: 'calculator', label: '4. Commission Calculator', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = dashboardSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDashboardSubTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ======================================================================= */}
          {/* TAB 1: USER APNI INCOME (EARNINGS, STATS & PAYOUT HISTORY)               */}
          {/* ======================================================================= */}
          {dashboardSubTab === 'income' && (
            <div className="space-y-6">
              {/* Income Metrics KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {/* Total Income Earned */}
                <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-left">
                  <span className="text-xs text-neutral-400 block font-medium">Total Income Earned</span>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
                    ₹{(185000).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold mt-0.5 block flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>From 12 referred deals</span>
                  </span>
                </div>

                {/* Payable Balance */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left relative overflow-hidden">
                  <span className="text-xs text-amber-400 block font-bold">Payable Balance</span>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono mt-1">
                    ₹{availableBalance.toLocaleString('en-IN')}
                  </div>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPayoutAmount(availableBalance);
                        setPayoutModalOpen(true);
                      }}
                      disabled={availableBalance <= 0}
                      className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-[11px] cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                    >
                      Withdraw via UPI / Bank
                    </button>
                  </div>
                </div>

                {/* Paid Out to Bank/UPI */}
                <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-left">
                  <span className="text-xs text-neutral-400 block font-medium">Paid Out to Bank/UPI</span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">
                    ₹{totalPaidAmount.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-neutral-500 mt-0.5 block">Direct account transfer</span>
                </div>

                {/* Commission Rate */}
                <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-left">
                  <span className="text-xs text-neutral-400 block font-medium">Active Commission Rate</span>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono mt-1">
                    2.50%
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-0.5 block">Gold Tier milestone</span>
                </div>
              </div>

              {/* Deal Conversions & Earnings Table */}
              <div className="bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden shadow-xl">
                <div className="p-5 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>Referred Deals & Commission Earnings History</span>
                    </h3>
                    <span className="text-xs text-neutral-400">
                      Live tracking of your referred homebuyers from inquiry to deed registration.
                    </span>
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    2.5% Gold Tier Rate Active
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px] font-bold">
                      <tr>
                        <th className="py-3 px-4">Buyer Lead</th>
                        <th className="py-3 px-4">Property / Project</th>
                        <th className="py-3 px-4">City</th>
                        <th className="py-3 px-4">Pipeline Status</th>
                        <th className="py-3 px-4">Deal Value</th>
                        <th className="py-3 px-4 text-right">Commission Earned</th>
                        <th className="py-3 px-4 text-center">Payout Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {SAMPLE_AFFILIATE_CONVERSIONS.map((conv) => (
                        <tr key={conv.id} className="hover:bg-neutral-800/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-white block">{conv.buyerName}</span>
                            <span className="text-[10px] text-neutral-400">{conv.buyerPhone}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-neutral-200 block">{conv.propertyTitle}</span>
                            <span className="text-[10px] text-neutral-500">{conv.date}</span>
                          </td>
                          <td className="py-3.5 px-4 text-neutral-300">
                            {conv.city}
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
                              {conv.stage.replace(/_/g, ' ')}
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
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                conv.status === 'PAID'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {conv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cash Withdrawal Activity & Payout Requests Ledger */}
              <div className="bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden shadow-xl">
                <div className="p-5 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>Cash Withdrawal History & Payout Requests</span>
                    </h3>
                    <span className="text-xs text-neutral-400">
                      Direct transfers processed to your registered UPI ID or Bank account.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPayoutAmount(availableBalance);
                      setPayoutModalOpen(true);
                    }}
                    disabled={availableBalance <= 0}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Request New Cash Withdrawal</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px] font-bold">
                      <tr>
                        <th className="py-3 px-4">Withdrawal ID</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Destination UPI / Account</th>
                        <th className="py-3 px-4">Date Requested</th>
                        <th className="py-3 px-4">Reference UTR</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 font-mono">
                      {payoutHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-neutral-800/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-white">{item.id}</td>
                          <td className="py-3 px-4 font-black text-emerald-400">₹{item.amount.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4 text-neutral-300 font-sans">{item.upi}</td>
                          <td className="py-3 px-4 text-neutral-400">{item.date}</td>
                          <td className="py-3 px-4 text-neutral-400 text-[11px]">{item.utr}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-sans ${
                                item.status === 'PAID'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {item.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 2: AUTOGENERATED ADS POST                                           */}
          {/* ======================================================================= */}
          {dashboardSubTab === 'ads' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-400" />
                    <span>Autogenerated Real Estate Advertising Posts</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Ready-to-publish social media captions with your unique referral link ({referralUrl}) and partner code ({partnerCode}) automatically embedded!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Live Link Auto-Injected
                  </span>
                </div>
              </div>

              {/* Autogenerated Ad Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {autogeneratedAds.map((ad, idx) => (
                  <div
                    key={ad.id}
                    className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${ad.color}`}>
                          {ad.channel}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {ad.badge}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white leading-snug">{ad.title}</h4>

                      {/* Post Copy Container */}
                      <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-mono whitespace-pre-line leading-relaxed max-h-52 overflow-y-auto select-all">
                        {ad.text}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof navigator !== 'undefined' && navigator.clipboard) {
                            navigator.clipboard.writeText(ad.text);
                          }
                          setCopiedAdIndex(idx);
                          setTimeout(() => setCopiedAdIndex(null), 2000);
                          toast({
                            title: 'Ad Post Copied! 📋',
                            description: 'Ready to paste into WhatsApp, Instagram, or LinkedIn.',
                            type: 'success',
                          });
                        }}
                        className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors active:scale-95"
                      >
                        {copiedAdIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAdIndex === idx ? 'Copied!' : 'Copy Ad Post'}</span>
                      </button>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(ad.whatsappShareText)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer transition-colors active:scale-95"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Share on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Instant Custom Ad Post Generator */}
              <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Instant Custom Ad Post Generator</span>
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Pick a city and property segment to autogenerate a targeted promotional post with your code.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Select Target Metro City:</label>
                    <select
                      value={adCity}
                      onChange={(e) => setAdCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                    >
                      {PAN_INDIA_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Select Segment / Asset Type:</label>
                    <select
                      value={adPropertyType}
                      onChange={(e) => setAdPropertyType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Luxury Apartments">Luxury Apartments & High-Rise Flats</option>
                      <option value="Villas & Gated Communities">Villas & Row Houses</option>
                      <option value="Commercial Offices">Commercial Grade-A Office Spaces</option>
                      <option value="Residential Plots">RERA Verified Plotted Developments</option>
                      <option value="New Launches">Pre-Launch Early-Bird Opportunities</option>
                    </select>
                  </div>
                </div>

                {/* Generated Preview */}
                {(() => {
                  const generatedPost = `⚡ *EXCLUSIVE PROPERTY ALERT: ${adPropertyType.toUpperCase()} IN ${adCity.toUpperCase()}!*

Looking for prime real estate in ${adCity} with zero brokerage and direct builder pricing?

Explore verified Grade-A projects with Prosify:
✅ 100% RERA Registered
✅ Direct Developer Allocation (Save 2% Brokerage)
✅ Flexible 10:90 & 20:80 Construction Linked Payment Plans
✅ Verified Carpet Area & Title Deeds

🔗 *View Available Units & Schedule Free Site Visit:*
${referralUrl}&city=${encodeURIComponent(adCity)}

🎟 *Use Partner Booking Code:* ${partnerCode}`;

                  return (
                    <div className="space-y-3 pt-2">
                      <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 font-mono whitespace-pre-line leading-relaxed select-all">
                        {generatedPost}
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                              navigator.clipboard.writeText(generatedPost);
                            }
                            toast({
                              title: 'Custom Ad Post Copied! 🎯',
                              description: `Generated for ${adCity} (${adPropertyType}) with code ${partnerCode}`,
                              type: 'success',
                            });
                          }}
                          className="px-4 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Custom Ad Post</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 3: TRACKING CODE & MARKETING TOOLS                                  */}
          {/* ======================================================================= */}
          {dashboardSubTab === 'code' && (
            <div className="space-y-6">
              {/* Partner Tracking Code Card */}
              <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-amber-400" />
                      <span>Your Unique Partner Code & Tracking Attribution</span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Share this code with clients, followers, or family. When entered in requirement forms or lead posts, you get credited automatically.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-neutral-500 block uppercase font-bold tracking-wider">
                      Partner Referral Code
                    </span>
                    <span className="text-2xl font-black text-amber-400 font-mono tracking-wider">
                      {partnerCode}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-5 py-2.5 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Code Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              {/* Embeddable HTML Ad Code Widget */}
              <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>Autogenerated Website & Blog HTML Banner Code</span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Paste this HTML code snippet directly into your blog, website, or email newsletter to embed an interactive ad with your tracking link.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText(embedHtmlCode);
                      }
                      setCopiedHtmlCode(true);
                      setTimeout(() => setCopiedHtmlCode(false), 2000);
                      toast({
                        title: 'HTML Ad Code Copied! 💻',
                        description: 'Ready to paste into your WordPress, Next.js, or HTML site.',
                        type: 'success',
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedHtmlCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHtmlCode ? 'HTML Code Copied!' : 'Copy HTML Code'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-cyan-300 font-mono whitespace-pre-wrap overflow-x-auto select-all max-h-48">
                  {embedHtmlCode}
                </div>
              </div>

              {/* QR Code Card */}
              <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-purple-400" />
                    <span>Printable Visiting Card & Brochure QR Code</span>
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-lg leading-relaxed">
                    Have offline meetings or site inspections? Let clients scan your personalized QR code directly on their smartphone to bookmark your referral link.
                  </p>
                  <span className="text-[11px] text-amber-400 block font-mono">
                    Points to: {referralUrl}
                  </span>
                </div>

                {/* QR Code Box */}
                <div className="p-3 bg-white rounded-2xl shadow-lg shrink-0 flex flex-col items-center">
                  {/* Real Dynamic QR Code image via QRServer API */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(referralUrl)}`}
                    alt="Prosify Affiliate QR Code"
                    width={140}
                    height={140}
                    className="rounded-lg"
                  />
                  <span className="text-[10px] text-neutral-900 font-black mt-1 font-mono">
                    {partnerCode}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 4: COMMISSION CALCULATOR                                            */}
          {/* ======================================================================= */}
          {dashboardSubTab === 'calculator' && (
            <div className="p-6 sm:p-10 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl relative overflow-hidden">
              <div className="max-w-3xl">
                <span className="text-amber-400 text-xs font-black uppercase tracking-wider block">
                  Interactive Earnings Simulation
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Simulate Your Monthly Real Estate Commission
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-2">
                  Adjust average property value and expected deal volume to calculate your projected earnings.
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
                    <span className="block text-xs font-bold text-neutral-300 mb-2">Commission Tier:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { tier: 'Bronze', rate: 1.5 },
                        { tier: 'Silver', rate: 2.0 },
                        { tier: 'Gold', rate: 2.5 },
                        { tier: 'Diamond', rate: 3.0 },
                      ].map((t) => (
                        <button
                          key={t.tier}
                          type="button"
                          onClick={() => setTierRate(t.rate)}
                          className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                            tierRate === t.rate
                              ? 'bg-amber-500/20 border-amber-500 text-white'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <span className="text-xs font-bold block">{t.tier}</span>
                          <span className="text-sm font-black text-amber-400 mt-1 block">{t.rate}%</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Output Card */}
                <div className="lg:col-span-5">
                  <div className="p-6 rounded-3xl bg-neutral-950 border border-amber-500/30 shadow-xl space-y-4 text-center">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                      Estimated Monthly Payout
                    </span>

                    <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                      ₹{totalEstimatedEarnings.toLocaleString('en-IN')}
                    </div>

                    <div className="text-xs text-neutral-400 space-y-1 font-medium border-t border-neutral-800 pt-3">
                      <div>Commission Per Deal: <strong className="text-white font-mono">₹{estimatedCommissionPerDeal.toLocaleString('en-IN')}</strong></div>
                      <div>Annualized Potential: <strong className="text-emerald-400 font-mono">₹{(totalEstimatedEarnings * 12).toLocaleString('en-IN')} / year</strong></div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDashboardSubTab('ads')}
                      className="w-full py-3 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>Start Sharing Autogenerated Ads &rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================================= */}
      {/* PAYOUT REQUEST MODAL                                                    */}
      {/* ======================================================================= */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Request Affiliate Commission Payout</span>
            </h3>

            <p className="text-xs text-neutral-400">
              Withdraw your verified earnings directly to your UPI ID or Bank account.
            </p>

            <form onSubmit={handleRequestPayout} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex justify-between items-center">
                <span className="text-neutral-400">Available Balance:</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  ₹{availableBalance.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Withdrawal Amount (₹) *
                </label>
                <input
                  type="number"
                  min={1000}
                  max={availableBalance}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Destination UPI ID / Account *
                </label>
                <input
                  type="text"
                  required
                  value={payoutUpi}
                  onChange={(e) => setPayoutUpi(e.target.value)}
                  placeholder="e.g. yourname@upi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayoutModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black cursor-pointer shadow-md active:scale-95"
                >
                  Confirm Withdrawal
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
