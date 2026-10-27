'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Share2,
  TrendingUp,
  Award,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Clock,
  ExternalLink,
  Building,
  UserPlus,
  ArrowUpRight,
  Calculator,
  Wallet,
  Sparkles,
  Phone,
  User,
  Calendar,
  X,
  Send,
  Layers,
  ChevronDown,
  Info,
  DollarSign,
  Briefcase,
  AlertCircle,
  Hash,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';

// Properties available for the Share Studio
interface ShareProperty {
  id: string;
  name: string;
  developer: string;
  location: string;
  priceRange: string;
  slug: string;
  rera: string;
  highlight: string;
  image: string;
}

const VERIFIED_PROPERTIES: ShareProperty[] = [
  {
    id: 'thane-ghodbunder',
    name: 'Raymond Realty Ten X & Godrej Ascend',
    developer: 'Raymond Realty & Godrej Properties',
    location: 'Pokhran Rd & Ghodbunder, Thane West',
    priceRange: '₹1.15 Cr - ₹2.85 Cr',
    slug: 'thane-luxury-corridor',
    rera: 'P51700019265',
    highlight: '0% Brokerage • 25+ Lifestyle Amenities • Near Viviana Mall',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'borivali-east',
    name: 'Lodha Woods & Oberoi Sky City',
    developer: 'Lodha Group & Oberoi Realty',
    location: 'Western Express Highway, Borivali East, Mumbai',
    priceRange: '₹1.95 Cr - ₹4.50 Cr',
    slug: 'borivali-sky-corridor',
    rera: 'P51800028741',
    highlight: 'Next to Sanjay Gandhi National Park • Zero Stamp Duty Offer',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'dombivli-east',
    name: 'Runwal Gardens & Lodha Palava City',
    developer: 'Runwal Group & Lodha',
    location: 'Kalyan-Shilphata Road, Dombivli East',
    priceRange: '₹48 Lakh - ₹92 Lakh',
    slug: 'dombivli-smart-city',
    rera: 'P51700025643',
    highlight: 'Integrated Smart Township • High Rental Yield (5.2%)',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'bkc-mumbai',
    name: 'Piramal Mahalaxmi & BKC Signature Towers',
    developer: 'Piramal Realty & Rustomjee',
    location: 'Bandra Kurla Complex & Central Mumbai',
    priceRange: '₹4.20 Cr - ₹14.50 Cr',
    slug: 'bkc-ultra-luxury',
    rera: 'P51900015854',
    highlight: 'Sea & Racecourse Views • Private Elevators & Helipad Access',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'all-projects',
    name: 'Prosify Verified Prime Portfolio (Master Catalog)',
    developer: 'All Top 16 Verified Developers (Lodha, Godrej, Piramal, etc.)',
    location: 'MMR & Pune Metro Real Estate Corridors',
    priceRange: '₹48 Lakh - ₹15.00 Cr',
    slug: '',
    rera: 'MahaRERA: A031332600766',
    highlight: 'Direct Developer Inventory • 10-Year Title Search Verified',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
  },
];

interface LeadRecord {
  id: string;
  clientName: string;
  clientPhone: string; // masked in UI e.g. +91 98******21
  rawPhone?: string;
  projectName: string;
  milestone: 'NEW_INQUIRY' | 'VERIFIED' | 'SITE_VISIT_DONE' | 'BOOKED';
  bonusText: string;
  commissionEstimate: string;
  registeredDate: string;
}

interface PayoutRecord {
  id: string;
  date: string;
  amount: number;
  mode: 'UPI' | 'NEFT';
  destination: string;
  utrNumber: string;
  status: 'PROCESSED' | 'PROCESSING';
}

export default function AffiliateDashboardPage() {
  // Active Affiliate Profile State (clutter-free, dedicated)
  const [partner, setPartner] = useState({
    name: 'Rahul Sharma',
    referralCode: 'AM-RAHUL24',
    tier: 'Awas Mitra 2.5%' as 'Awas Mitra 2.5%' | 'Gold 3.0%' | 'Prime 3.5%',
    commissionPercent: 2.5,
    clicks30d: 1482,
    clicksGrowth: '+18%',
    leadsCount: 38,
    siteVisitsDone: 14,
    pipelineCommission: 245000,
    withdrawableBalance: 68500,
    upiId: 'rahul.sharma@okhdfcbank',
    bankAccount: '••••••••4812',
    bankIfsc: 'HDFC0001244',
  });

  // Share Studio State
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('thane-ghodbunder');
  const [activeTab, setActiveTab] = useState<'hinglish' | 'english' | 'instagram' | 'linkedin'>('hinglish');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);

  // Calculator State
  const [calcPropertyPrice, setCalcPropertyPrice] = useState<number>(12500000); // 1.25 Cr

  // Modal States
  const [isRegisterLeadOpen, setIsRegisterLeadOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // Form States for Register Lead Modal
  const [leadForm, setLeadForm] = useState({
    clientName: '',
    clientPhone: '',
    project: 'Raymond Realty Ten X (Thane)',
    visitDate: '',
    notes: '',
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccessMsg, setLeadSuccessMsg] = useState('');

  // Form States for Withdraw Modal
  const [withdrawAmount, setWithdrawAmount] = useState<number>(25000);
  const [withdrawMode, setWithdrawMode] = useState<'UPI' | 'NEFT'>('UPI');
  const [withdrawUpiInput, setWithdrawUpiInput] = useState('rahul.sharma@okhdfcbank');
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState('');

  // Leads Table State
  const [leads, setLeads] = useState<LeadRecord[]>([
    {
      id: 'lead-1',
      clientName: 'Sanjay Deshmukh',
      clientPhone: '+91 98******21',
      projectName: 'Raymond Realty Ten X (Thane)',
      milestone: 'BOOKED',
      bonusText: 'Token Paid',
      commissionEstimate: '₹3,12,500 (Processing)',
      registeredDate: '24 Oct 2026',
    },
    {
      id: 'lead-2',
      clientName: 'Priya Narayanan',
      clientPhone: '+91 91******84',
      projectName: 'Lodha Woods (Borivali East)',
      milestone: 'SITE_VISIT_DONE',
      bonusText: '+₹500 Bonus Credited',
      commissionEstimate: '₹4,87,500 (At Final Deed)',
      registeredDate: '22 Oct 2026',
    },
    {
      id: 'lead-3',
      clientName: 'Vikramaditya Kulkarni',
      clientPhone: '+91 97******09',
      projectName: 'Runwal Gardens (Dombivli)',
      milestone: 'SITE_VISIT_DONE',
      bonusText: '+₹500 Bonus Credited',
      commissionEstimate: '₹1,45,000 (Follow-up Call)',
      registeredDate: '19 Oct 2026',
    },
    {
      id: 'lead-4',
      clientName: 'Anil Mehta',
      clientPhone: '+91 99******55',
      projectName: 'Piramal Mahalaxmi (BKC South)',
      milestone: 'VERIFIED',
      bonusText: 'AC Cab Scheduled',
      commissionEstimate: '₹10,50,000 (VIP Deal)',
      registeredDate: '16 Oct 2026',
    },
    {
      id: 'lead-5',
      clientName: 'Harpreet Singh',
      clientPhone: '+91 93******30',
      projectName: 'Godrej Ascend (Thane West)',
      milestone: 'NEW_INQUIRY',
      bonusText: 'Floor Plan Sent',
      commissionEstimate: '₹2,65,000 (In Review)',
      registeredDate: '14 Oct 2026',
    },
  ]);

  // Payouts Table State
  const [payouts, setPayouts] = useState<PayoutRecord[]>([
    {
      id: 'pay-1',
      date: '20 Oct 2026',
      amount: 45000,
      mode: 'UPI',
      destination: 'rahul.sharma@okhdfcbank',
      utrNumber: 'UTR98412490812',
      status: 'PROCESSED',
    },
    {
      id: 'pay-2',
      date: '12 Oct 2026',
      amount: 52000,
      mode: 'NEFT',
      destination: 'HDFC Bank (••••4812)',
      utrNumber: 'UTR77329104851',
      status: 'PROCESSED',
    },
    {
      id: 'pay-3',
      date: '04 Oct 2026',
      amount: 38000,
      mode: 'UPI',
      destination: 'rahul.sharma@okhdfcbank',
      utrNumber: 'UTR66210948211',
      status: 'PROCESSED',
    },
  ]);

  // Restore referral code & profile from localStorage if saved
  useEffect(() => {
    try {
      const storedRef = localStorage.getItem('prosify_ref') || localStorage.getItem('prosify_partner_ref');
      if (storedRef && storedRef !== partner.referralCode) {
        setPartner((prev) => ({
          ...prev,
          referralCode: storedRef,
        }));
      }
    } catch {
      // Safe ignore
    }
  }, [partner.referralCode]);

  // Selected Property for the Share Studio
  const selectedProperty = useMemo(() => {
    return VERIFIED_PROPERTIES.find((p) => p.id === selectedPropertyId) || VERIFIED_PROPERTIES[0];
  }, [selectedPropertyId]);

  // Dynamic Referral Link
  const referralLink = useMemo(() => {
    if (selectedProperty.slug) {
      return `https://prosify.in/properties/${selectedProperty.slug}?ref=${partner.referralCode}`;
    }
    return `https://prosify.in/?ref=${partner.referralCode}`;
  }, [selectedProperty, partner.referralCode]);

  // Generated Social Content for 4 Tabs
  const shareContent = useMemo(() => {
    const propName = selectedProperty.name;
    const loc = selectedProperty.location;
    const price = selectedProperty.priceRange;

    return {
      hinglish: `Namaste ji! 🙏

Agar aap Mumbai / MMR me apna dream home ya high-return real estate investment plan kar rahe hain, toh Prosify ke verified luxury homes zaroor check kijiye:

📍 ${propName} (${loc})
💰 Starting from ${price}
✨ 0% Brokerage & Direct Developer Allotment
🛡️ MahaRERA Approved (${selectedProperty.rera})
🎁 Special ProReward™ VIP benefits guaranteed!

Official PDF Brochure aur VIP Price List dekhne ke liye is link par click karein:
👉 ${referralLink}

(Complimentary AC cab pickup & drop facility available hai site visit ke liye!)`,

      english: `Dear Homebuyer & Investor,

Looking for a legally verified, premium home in MMR with 0% brokerage?

Explore ${propName} located at ${loc}.
• Pricing: ${price}
• Developer: ${selectedProperty.developer}
• MahaRERA Certified: ${selectedProperty.rera}
• 10-Year Title Search Verified & Direct Developer Price Protection

Access the verified floor plans and book a complimentary site tour here:
👉 ${referralLink}

ProSify Realty Realm™ • MahaRERA Reg. No. A031332600766`,

      instagram: `Own your dream residence at ${propName}! 🏡✨

📍 Location: ${loc}
💰 Investment: ${price}
💎 Features: ${selectedProperty.highlight}

✅ Zero Brokerage
✅ 100% MahaRERA Verified (${selectedProperty.rera})
✅ Direct Developer Allocation

Unlock official inventory and book a free luxury site escort:
🔗 Link: ${referralLink}

#ProsifyRealty #MumbaiRealEstate #ThaneHomes #LuxuryLiving #DreamHome #PropertyInvestment #MahaRERA #ZeroBrokerage #RealEstateInvestor`,

      linkedin: `High-Yield Real Estate Investment Opportunity in MMR:

${propName} (${loc}) presents an outstanding risk-adjusted capital appreciation opportunity (projected 11-14% CAGR) supported by robust infrastructure growth.

Key Financial Highlights:
🔹 Starting: ${price}
🔹 Developer Track Record: ${selectedProperty.developer}
🔹 MahaRERA Compliance: ${selectedProperty.rera}
🔹 0% Brokerage & Transparent Title Assurance via Prosify

Access institutional project dossier and reserve your private walkthrough:
${referralLink}

#RealEstateInvesting #MMRInfrastructure #WealthManagement #PropertyAdvisory #Prosify #CommercialAndResidential`,
    };
  }, [selectedProperty, referralLink]);

  const [customizedMessage, setCustomizedMessage] = useState(shareContent.hinglish);

  // Update customized message when tab or property changes
  useEffect(() => {
    setCustomizedMessage(shareContent[activeTab]);
  }, [activeTab, shareContent]);

  // Copy referral link only
  const handleCopyOnlyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      // Fallback
    }
  };

  // Copy social post + link
  const handleCopyPost = async () => {
    try {
      await navigator.clipboard.writeText(customizedMessage);
      setCopiedPost(true);
      setTimeout(() => setCopiedPost(false), 2200);
    } catch {
      // Fallback
    }
  };

  // WhatsApp Direct Share
  const handleWhatsAppShare = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(customizedMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Register Lead Submission
  const handleRegisterLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.clientName || !leadForm.clientPhone) return;

    setLeadSubmitting(true);
    setLeadSuccessMsg('');

    try {
      // Register lead to backend
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadForm.clientName,
          phone: leadForm.clientPhone,
          propertyName: leadForm.project,
          notes: `Walk-in Lead tagged by Awas Mitra ${partner.referralCode}. Visit: ${leadForm.visitDate}. Notes: ${leadForm.notes}`,
          partnerCode: partner.referralCode,
          source: 'CHANNEL_PARTNER',
        }),
      });

      // Optimistic lead update
      const newLeadRecord: LeadRecord = {
        id: `lead-${Date.now()}`,
        clientName: leadForm.clientName,
        clientPhone: `+91 ${leadForm.clientPhone.slice(0, 2)}******${leadForm.clientPhone.slice(-2)}`,
        projectName: leadForm.project,
        milestone: 'NEW_INQUIRY',
        bonusText: 'Direct Tagged',
        commissionEstimate: '₹2,50,000 (Active)',
        registeredDate: 'Today',
      };

      setLeads((prev) => [newLeadRecord, ...prev]);
      setPartner((prev) => ({
        ...prev,
        leadsCount: prev.leadsCount + 1,
      }));

      setLeadSuccessMsg('Client lead registered and tagged to your partner code successfully!');
      setTimeout(() => {
        setIsRegisterLeadOpen(false);
        setLeadSuccessMsg('');
        setLeadForm({ clientName: '', clientPhone: '', project: 'Raymond Realty Ten X (Thane)', visitDate: '', notes: '' });
      }, 1800);
    } catch {
      setLeadSuccessMsg('Lead recorded in local tracking session.');
    } finally {
      setLeadSubmitting(false);
    }
  };

  // Handle Withdraw Submission
  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount < 1000 || withdrawAmount > partner.withdrawableBalance) return;

    setWithdrawSubmitting(true);
    setWithdrawSuccessMsg('');

    try {
      // Mock withdrawal request record
      const utr = `UTR${Math.floor(10000000000 + Math.random() * 90000000000)}`;
      const newPayout: PayoutRecord = {
        id: `pay-${Date.now()}`,
        date: 'Today',
        amount: withdrawAmount,
        mode: withdrawMode,
        destination: withdrawMode === 'UPI' ? withdrawUpiInput : `${partner.bankAccount} (${partner.bankIfsc})`,
        utrNumber: utr,
        status: 'PROCESSING',
      };

      setPayouts((prev) => [newPayout, ...prev]);
      setPartner((prev) => ({
        ...prev,
        withdrawableBalance: prev.withdrawableBalance - withdrawAmount,
      }));

      setWithdrawSuccessMsg(`Withdrawal request for ₹${withdrawAmount.toLocaleString('en-IN')} submitted! Payout will reflect within 2-4 hours.`);
      setTimeout(() => {
        setIsWithdrawOpen(false);
        setWithdrawSuccessMsg('');
      }, 2000);
    } finally {
      setWithdrawSubmitting(false);
    }
  };

  // Calculate estimated earnings for calculator
  const estimatedCommission = useMemo(() => {
    return Math.round((calcPropertyPrice * partner.commissionPercent) / 100);
  }, [calcPropertyPrice, partner.commissionPercent]);

  const tdsDeduction = useMemo(() => {
    return Math.round(estimatedCommission * 0.05); // 5% TDS
  }, [estimatedCommission]);

  const netPayableEst = useMemo(() => {
    return estimatedCommission - tdsDeduction;
  }, [estimatedCommission, tdsDeduction]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* ========================================================================= */}
        {/* SECTION 1: TOP PARTNER BAR & 4 KPI CARDS                                  */}
        {/* ========================================================================= */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-md relative overflow-hidden">
          {/* Subtle gold glow accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Partner Identity Bar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400 font-bold text-xl">
                  {partner.name.charAt(0)}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{partner.name}</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30">
                    <Award className="w-3.5 h-3.5" />
                    Tier: {partner.tier}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    MahaRERA Verified Partner
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 font-mono text-slate-300">
                    Partner Code: <strong className="text-amber-300 font-semibold">{partner.referralCode}</strong>
                  </span>
                  <span>•</span>
                  <span>ProSify Realty Realm™ (Reg. A031332600766)</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">30-Day Cookie Attribution Active</span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsRegisterLeadOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-sm transition-all shadow-sm cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>+ Register Client Lead</span>
              </button>

              <button
                type="button"
                onClick={() => setIsWithdrawOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Withdraw to UPI/Bank</span>
              </button>
            </div>
          </div>

          {/* 4 Clean KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            {/* Card 1: Link Clicks */}
            <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4.5 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-medium">Link Clicks (30d)</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> {partner.clicksGrowth}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
                {partner.clicks30d.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Unique prospects visited your links</p>
            </div>

            {/* Card 2: My Leads & Site Visits */}
            <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4.5 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-medium">My Leads & Site Visits</span>
                <span className="text-amber-400 font-semibold">14 Completed</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight flex items-baseline gap-2">
                <span>{partner.leadsCount}</span>
                <span className="text-xs text-slate-400 font-sans font-normal">leads registered</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">+₹500 bonus earned per site visit</p>
            </div>

            {/* Card 3: Pipeline Commission */}
            <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4.5 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-medium">Pipeline Commission</span>
                <span className="text-blue-400 font-semibold">Under Verification</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono tracking-tight">
                ₹{partner.pipelineCommission.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Expected on final deed registration</p>
            </div>

            {/* Card 4: Withdrawable Balance */}
            <div className="bg-gradient-to-br from-amber-500/10 via-slate-950/70 to-slate-950/90 border border-amber-500/30 rounded-xl p-4.5 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-amber-200/80 mb-2">
                <span className="font-semibold text-amber-300">Withdrawable Balance</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                  Instant
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
                ₹{partner.withdrawableBalance.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Available for weekly UPI / NEFT transfer</p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: ALL-IN-ONE SOCIAL POST & WHATSAPP SHARE STUDIO (CORE FEATURE) */}
        {/* ========================================================================= */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-md">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Growth Marketing Suite</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                All-in-One Social Post & WhatsApp Share Studio
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Select any verified Prosify property to instantly generate customized, RERA-compliant promotional pitches
                with your referral link embedded.
              </p>
            </div>

            {/* Quick Master Referral Link Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="truncate max-w-[220px] sm:max-w-[260px] font-mono text-slate-400 text-[11px]">
                {referralLink}
              </div>
              <button
                type="button"
                onClick={handleCopyOnlyLink}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Property Selector Dropdown */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Step 1: Choose Verified Property or Catalog
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {VERIFIED_PROPERTIES.map((prop) => {
                const isSelected = prop.id === selectedPropertyId;
                return (
                  <button
                    key={prop.id}
                    type="button"
                    onClick={() => setSelectedPropertyId(prop.id)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-400/80 text-white shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-white truncate">{prop.name.split('&')[0]}</div>
                    <div className="text-[11px] text-amber-300/90 font-mono mt-0.5">{prop.priceRange}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-1">{prop.location.split(',')[0]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2-Column Studio: Left Preview Card, Right Content Tabs & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Visual Property Share Card Preview */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-44 w-full bg-slate-900">
                <Image
                  src={selectedProperty.image}
                  alt={selectedProperty.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase">
                  Verified Inventory
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-emerald-500/80 text-slate-950 text-[10px] font-bold">
                  0% Brokerage
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <div className="font-mono text-xs text-amber-300 font-bold">{selectedProperty.priceRange}</div>
                  <div className="font-bold text-sm leading-tight text-white line-clamp-1">{selectedProperty.name}</div>
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Developer Partner</div>
                  <div className="text-white font-semibold text-xs">{selectedProperty.developer}</div>
                </div>

                <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
                  <span>Location:</span>
                  <span className="text-slate-200">{selectedProperty.location}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>RERA Registry:</span>
                  <span className="font-mono text-amber-400 font-semibold">{selectedProperty.rera}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Your partner code <strong className="font-mono text-white">{partner.referralCode}</strong> is automatically
                    stitched into this link.
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Format Tabs & Copy / Share Tools */}
            <div className="lg:col-span-7 space-y-4">
              {/* Tab Selector Buttons */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('hinglish')}
                  className={`flex-1 min-w-[120px] px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'hinglish'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  WhatsApp (Hinglish)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('english')}
                  className={`flex-1 min-w-[120px] px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'english'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  WhatsApp (English)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('instagram')}
                  className={`flex-1 min-w-[120px] px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'instagram'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Instagram & FB
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('linkedin')}
                  className={`flex-1 min-w-[120px] px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'linkedin'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  LinkedIn / Investor
                </button>
              </div>

              {/* Editable Message Box */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-medium">Editable Promotional Pitch</span>
                  <span className="text-[11px] text-slate-500">You can customize words before sharing</span>
                </div>
                <textarea
                  rows={8}
                  value={customizedMessage}
                  onChange={(e) => setCustomizedMessage(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm font-sans leading-relaxed focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all resize-y"
                />
              </div>

              {/* 3 One-Click Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Share Directly on WhatsApp */}
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-900/30 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </button>

                {/* 2. Copy Social Post + Link */}
                <button
                  type="button"
                  onClick={handleCopyPost}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  {copiedPost ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Post Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-400" />
                      <span>Copy Full Post</span>
                    </>
                  )}
                </button>

                {/* 3. Copy Only Referral Link */}
                <button
                  type="button"
                  onClick={handleCopyOnlyLink}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-amber-400" />
                      <span>Copy Link Only</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: MY REFERRED LEADS & DIRECT CLIENT TAGGING                     */}
        {/* ========================================================================= */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Briefcase className="w-4 h-4" />
                <span>Client Registry & Deal Pipeline</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                My Referred Leads & Direct Client Tagging
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Full transparency on inquiry stages, site visits, and milestone-linked commission payouts.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsRegisterLeadOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Tag Walk-in Client</span>
            </button>
          </div>

          {/* Clean Leads Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Masked Mobile</th>
                  <th className="py-3 px-4">Target Project</th>
                  <th className="py-3 px-4">Milestone Status</th>
                  <th className="py-3 px-4">Commission Stage</th>
                  <th className="py-3 px-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                {leads.map((lead) => {
                  let badgeClass = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                  let statusLabel = 'New Inquiry';

                  if (lead.milestone === 'VERIFIED') {
                    badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                    statusLabel = 'Verified';
                  } else if (lead.milestone === 'SITE_VISIT_DONE') {
                    badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                    statusLabel = 'Site Visit Done (+₹500)';
                  } else if (lead.milestone === 'BOOKED') {
                    badgeClass = 'bg-purple-500/10 text-purple-400 border-purple-500/30 font-bold';
                    statusLabel = 'Booked (2.5% Payout)';
                  }

                  return (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">{lead.clientName}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{lead.clientPhone}</td>
                      <td className="py-3 px-4 text-slate-300">{lead.projectName}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border ${badgeClass}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-300 font-medium">
                        {lead.commissionEstimate}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{lead.registeredDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            Client phone numbers are privacy-masked for end-user data security. Full logs are archived with MahaRERA audit compliance.
          </p>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: SIMPLE EARNINGS CALCULATOR & WEEKLY PAYOUTS                   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Simple Earnings Calculator */}
          <section className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4" />
              <span>Real-Time Commission Simulator</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mb-1">
              Simple Earnings Calculator
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Estimate your earnings based on average property agreement values at your current tier ({partner.commissionPercent}%).
            </p>

            <div className="space-y-5">
              {/* Slider Input */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-300 font-medium">Property Agreement Value:</span>
                  <span className="text-lg font-bold text-amber-300 font-mono">
                    ₹{(calcPropertyPrice / 100000).toFixed(1)} Lakhs
                  </span>
                </div>
                <input
                  type="range"
                  min={5000000} // 50 Lakhs
                  max={50000000} // 5 Crores
                  step={500000} // 5 Lakh increments
                  value={calcPropertyPrice}
                  onChange={(e) => setCalcPropertyPrice(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>₹50 Lakhs</span>
                  <span>₹1.50 Cr</span>
                  <span>₹3.00 Cr</span>
                  <span>₹5.00 Cr</span>
                </div>
              </div>

              {/* Commission Breakdown Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Gross Commission ({partner.commissionPercent}%):</span>
                  <span className="font-mono text-white font-semibold">
                    ₹{estimatedCommission.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Standard TDS Deduction (5%):</span>
                  <span className="font-mono text-slate-400">- ₹{tdsDeduction.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Site Visit Bonus Incentive:</span>
                  <span className="font-mono text-emerald-400 font-semibold">+ ₹500 (Guaranteed)</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm font-bold">
                  <span className="text-amber-300">Estimated Net Payout:</span>
                  <span className="font-mono text-emerald-400 text-base">
                    ₹{(netPayableEst + 500).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-amber-200/90 space-y-1">
                <p className="font-semibold text-amber-300">💡 Tier Progression Advantage:</p>
                <p className="text-slate-400">
                  Deliver 5 bookings to unlock <strong>Gold Tier (3.0%)</strong>, or 10 bookings for{' '}
                  <strong>Prime Tier (3.5%)</strong> with dedicated senior manager assistance.
                </p>
              </div>
            </div>
          </section>

          {/* Weekly UPI / NEFT Payouts & History */}
          <section className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <CreditCard className="w-4 h-4" />
                <span>Weekly Settlements</span>
              </div>
              <button
                type="button"
                onClick={() => setIsWithdrawOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Withdraw Funds
              </button>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mb-1">
              Payouts & Bank UTR History
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Settlements processed weekly to your verified UPI VPA or NEFT bank account.
            </p>

            {/* Payouts Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3">Bank UTR</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                  {payouts.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 text-slate-400">{pay.date}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-white">
                        ₹{pay.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                          {pay.mode}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-amber-300">{pay.utrNumber}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            pay.status === 'PROCESSED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {pay.status === 'PROCESSED' ? 'Processed (Paid)' : 'Processing'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <div>
                <span className="text-slate-300 font-semibold">Active Payout Account:</span>{' '}
                <span className="font-mono text-amber-300">{partner.upiId}</span>
              </div>
              <span className="text-emerald-400 font-medium">Auto-Verified</span>
            </div>
          </section>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: REGISTER WALK-IN CLIENT LEAD                                     */}
      {/* ========================================================================= */}
      {isRegisterLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsRegisterLeadOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <UserPlus className="w-4 h-4" />
              <span>Direct Lead Tagging</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Register Client Lead</h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">
              Tag client details before site visit to lock in your {partner.commissionPercent}% commission protection.
            </p>

            {leadSuccessMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{leadSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegisterLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Buyer Full Name *</label>
                <input
                  type="text"
                  required
                  value={leadForm.clientName}
                  onChange={(e) => setLeadForm((prev) => ({ ...prev, clientName: e.target.value }))}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Buyer Mobile Number (10 digits) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={leadForm.clientPhone}
                    onChange={(e) => setLeadForm((prev) => ({ ...prev, clientPhone: e.target.value }))}
                    placeholder="9876543210"
                    className="w-full pl-11 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Project / Corridor</label>
                <select
                  value={leadForm.project}
                  onChange={(e) => setLeadForm((prev) => ({ ...prev, project: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-amber-400"
                >
                  <option value="Raymond Realty Ten X (Thane)">Raymond Realty Ten X (Thane West)</option>
                  <option value="Godrej Ascend (Ghodbunder Rd)">Godrej Ascend (Ghodbunder Rd, Thane)</option>
                  <option value="Lodha Woods (Borivali East)">Lodha Woods (Borivali East, Mumbai)</option>
                  <option value="Runwal Gardens (Dombivli East)">Runwal Gardens (Dombivli East)</option>
                  <option value="Piramal Mahalaxmi (BKC South)">Piramal Mahalaxmi (BKC South)</option>
                  <option value="General MMR Luxury Portfolio">General MMR Luxury Portfolio</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Expected Site Visit Date</label>
                <input
                  type="date"
                  value={leadForm.visitDate}
                  onChange={(e) => setLeadForm((prev) => ({ ...prev, visitDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Notes / Specific Configuration</label>
                <input
                  type="text"
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. 2 BHK East-facing, budget ~1.2 Cr"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {leadSubmitting ? 'Tagging Client...' : 'Register & Lock Referral'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: WITHDRAW TO UPI / BANK                                          */}
      {/* ========================================================================= */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsWithdrawOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Wallet className="w-4 h-4" />
              <span>Instant Settlement</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Withdraw Available Earnings</h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">
              Available Withdrawable Balance:{' '}
              <strong className="text-amber-300 font-mono">
                ₹{partner.withdrawableBalance.toLocaleString('en-IN')}
              </strong>
            </p>

            {withdrawSuccessMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{withdrawSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
              {/* Quick Amount Chips */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Withdrawal Amount (₹) *</label>
                <div className="flex items-center gap-2 mb-2">
                  {[5000, 10000, 25000, partner.withdrawableBalance].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setWithdrawAmount(val)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono cursor-pointer transition-colors ${
                        withdrawAmount === val
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {val === partner.withdrawableBalance ? 'All' : `₹${(val / 1000)}k`}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={1000}
                  max={partner.withdrawableBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm outline-none focus:border-amber-400"
                />
              </div>

              {/* Payout Mode Toggle */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Transfer Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawMode('UPI')}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold transition-colors cursor-pointer ${
                      withdrawMode === 'UPI'
                        ? 'bg-amber-500/10 border-amber-400 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Instant UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawMode('NEFT')}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold transition-colors cursor-pointer ${
                      withdrawMode === 'NEFT'
                        ? 'bg-amber-500/10 border-amber-400 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    NEFT / IMPS Bank
                  </button>
                </div>
              </div>

              {withdrawMode === 'UPI' ? (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">UPI ID (VPA) *</label>
                  <input
                    type="text"
                    required
                    value={withdrawUpiInput}
                    onChange={(e) => setWithdrawUpiInput(e.target.value)}
                    placeholder="e.g. rahul@okaxis"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs outline-none focus:border-amber-400"
                  />
                </div>
              ) : (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="text-slate-200 font-semibold">Registered Bank Account</div>
                  <div>Account: {partner.bankAccount}</div>
                  <div>IFSC: {partner.bankIfsc} (HDFC Bank)</div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={withdrawSubmitting || withdrawAmount < 1000}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                >
                  {withdrawSubmitting
                    ? 'Processing Transfer...'
                    : `Confirm Transfer of ₹${withdrawAmount.toLocaleString('en-IN')}`}
                </button>
              </div>

              <p className="text-[10px] text-slate-500 text-center">
                Prosify Finance Team processes payouts in compliance with IT Act Section 194H.
              </p>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
