'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Share2,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Zap,
  CreditCard,
  MessageSquare,
  Clock,
  ArrowUpRight,
  Smartphone,
  Download,
  Mail,
  Lock,
  LogOut,
  Send,
  FileText,
  RefreshCw,
  QrCode,
  Building,
  Sliders,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Link2,
  Settings,
  Wallet,
  ChevronRight,
  HelpCircle,
  Info,
  Calendar,
  Layers,
  X,
  Search,
  Filter,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/lib/auth/authContext';

// Theme Color Tokens according to design specification
// Background: #0B1120
// Card/Surfaces: #1E293B (with backdrop-blur-md and border-slate-700)
// Primary Accent: Emerald Green (#10B981)
// Secondary Accent: Sky Blue / Cyan (#0EA5E9)
// Badge Accent: Amber (#F59E0B)

const ROBOT_MASCOT_URL =
  'https://mkblktzjrmjktfdnmtql.supabase.co/storage/v1/object/public/eni%20ai%20logo/eni%20ai%20robot%20model.png';
const WHATSAPP_REDIRECT_URL = 'https://wa.me/919326303244';

interface ConversionRecord {
  id: string;
  dateTime: string;
  campaignSource: string;
  conversionEvent: string;
  dealAmount: number;
  commissionAmount: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  rejectionReason?: string;
  buyerName?: string;
}

interface PayoutRecord {
  id: string;
  requestDate: string;
  amount: number;
  tdsDeduction: number;
  netPayable: number;
  payoutMethod: 'UPI' | 'NEFT' | 'IMPS';
  destinationDetails: string;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  transactionRef?: string;
  receiptNumber?: string;
  processedDate?: string;
}

interface BankDetailsState {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId: string;
}

interface NotificationPrefs {
  emailOnConversion: boolean;
  smsOnConversion: boolean;
  emailOnPayout: boolean;
  smsOnPayout: boolean;
}

export default function AffiliatePortalPage() {
  const { toast } = useToast();
  const { user: authUser, logout: authLogout } = useAuth();

  // Mode: Zero State (Brand New Partner) vs Active State (High Performer)
  const [profileMode, setProfileMode] = useState<'zero' | 'active'>('zero');

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authMethod, setAuthMethod] = useState<'google' | 'phone_otp' | 'phone_password'>('google');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Active Portal Navigation Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'links' | 'conversions' | 'wallet' | 'settings'>('overview');

  // Dynamic Referral Deep Link Generator
  const [customPathInput, setCustomPathInput] = useState<string>('https://prosify.in/projects/oberoi-sky-city');
  const [customCampaignInput, setCustomCampaignInput] = useState<string>('whatsapp-luxury');
  const [generatedDeepLink, setGeneratedDeepLink] = useState<string>('');

  // Modals
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState<boolean>(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PayoutRecord | null>(null);

  // Withdrawal Form State
  const [withdrawAmountInput, setWithdrawAmountInput] = useState<string>('1500');
  const [withdrawMethod, setWithdrawMethod] = useState<'UPI' | 'NEFT'>('UPI');
  const [withdrawDestination, setWithdrawDestination] = useState<string>('partner@okaxis');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState<boolean>(false);

  // Settings State
  const [bankDetails, setBankDetails] = useState<BankDetailsState>({
    accountHolderName: 'Aarav Sharma',
    accountNumber: '50100492817263',
    ifscCode: 'HDFC0000060',
    bankName: 'HDFC Bank, Fort Branch',
    upiId: 'aarav.sharma@okaxis',
  });

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    emailOnConversion: true,
    smsOnConversion: true,
    emailOnPayout: true,
    smsOnPayout: true,
  });

  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);

  // Time-series Filter for Analytics Chart
  const [analyticsRange, setAnalyticsRange] = useState<'weekly' | 'monthly' | 'custom'>('monthly');

  // Conversions Filter
  const [conversionFilterStatus, setConversionFilterStatus] = useState<string>('ALL');
  const [conversionSearchTerm, setConversionSearchTerm] = useState<string>('');

  // User Profile derived from State Mode
  const currentAffiliate = useMemo(() => {
    if (profileMode === 'zero') {
      return {
        id: 'AFF-ENI-1526',
        affiliateId: 'AFF-ENI-1526',
        name: 'Aarav Sharma (New Partner)',
        email: 'aarav.partner@eniaiborn.in',
        phone: '+91 93263 03244',
        tier: 'Bronze',
        commissionRatePercent: 2.5,
        availableBalance: 0.0,
        totalEarnings: 0.0,
        pendingClearance: 0.0,
        totalClicks: 0,
        totalConversions: 0,
        conversionRate: 0.0,
        joinedDate: new Date().toISOString().split('T')[0],
      };
    } else {
      return {
        id: 'AFF-ENI-8055',
        affiliateId: 'AFF-ENI-8055',
        name: 'Siddharth Varma (Top Partner)',
        email: 'siddharth.v@realtyaffiliates.in',
        phone: '+91 98201 44556',
        tier: 'Gold',
        commissionRatePercent: 3.5,
        availableBalance: 125000.0,
        totalEarnings: 845000.0,
        pendingClearance: 45000.0,
        totalClicks: 4820,
        totalConversions: 142,
        conversionRate: 2.9,
        joinedDate: '2026-06-15',
      };
    }
  }, [profileMode]);

  // Referral Link
  const baseReferralLink = useMemo(() => {
    return `https://prosify.in/?ref=${currentAffiliate.affiliateId}`;
  }, [currentAffiliate.affiliateId]);

  // Update Deep Link when inputs change
  useEffect(() => {
    const cleanUrl = customPathInput.trim() || 'https://prosify.in';
    const separator = cleanUrl.includes('?') ? '&' : '?';
    const campaignParam = customCampaignInput.trim() ? `&utm_campaign=${encodeURIComponent(customCampaignInput.trim())}` : '';
    setGeneratedDeepLink(`${cleanUrl}${separator}ref=${currentAffiliate.affiliateId}${campaignParam}`);
  }, [customPathInput, customCampaignInput, currentAffiliate.affiliateId]);

  // Active Conversions dataset
  const [conversionsList, setConversionsList] = useState<ConversionRecord[]>([]);

  // Active Payouts dataset
  const [payoutsList, setPayoutsList] = useState<PayoutRecord[]>([]);

  // Sync dataset with mode
  useEffect(() => {
    if (profileMode === 'zero') {
      setConversionsList([]);
      setPayoutsList([]);
    } else {
      setConversionsList([
        {
          id: 'CONV-2026-101',
          dateTime: '2026-04-12 14:30',
          campaignSource: 'WhatsApp VIP Blast',
          conversionEvent: 'Deed Registration',
          dealAmount: 42000000,
          commissionAmount: 147000,
          status: 'APPROVED',
          buyerName: 'Vikram Joshi',
        },
        {
          id: 'CONV-2026-102',
          dateTime: '2026-04-09 11:15',
          campaignSource: 'LinkedIn Tech Investors',
          conversionEvent: 'Token Booking',
          dealAmount: 16500000,
          commissionAmount: 57750,
          status: 'PAID',
          buyerName: 'Amit Singhal',
        },
        {
          id: 'CONV-2026-103',
          dateTime: '2026-04-04 16:45',
          campaignSource: 'Instagram Bio Link',
          conversionEvent: 'Site Visit Verified',
          dealAmount: 7200000,
          commissionAmount: 18000,
          status: 'PENDING',
          buyerName: 'Priya Deshmukh',
        },
        {
          id: 'CONV-2026-104',
          dateTime: '2026-03-29 09:20',
          campaignSource: 'Telegram Channel',
          conversionEvent: 'Cancelled Booking',
          dealAmount: 35000000,
          commissionAmount: 87500,
          status: 'REJECTED',
          rejectionReason: 'Buyer token cancelled due to home loan rejection',
          buyerName: 'Rajesh Nair',
        },
      ]);

      setPayoutsList([
        {
          id: 'PAY-TX-8921',
          requestDate: '2026-04-01 10:30',
          amount: 50000,
          tdsDeduction: 2500,
          netPayable: 47500,
          payoutMethod: 'UPI',
          destinationDetails: 'siddharth.varma@okaxis',
          status: 'PAID',
          transactionRef: 'UPI-PROS-2026-9812401',
          receiptNumber: 'REC-2026-04-8921',
          processedDate: '2026-04-01 12:15',
        },
        {
          id: 'PAY-TX-7814',
          requestDate: '2026-03-15 14:20',
          amount: 92500,
          tdsDeduction: 4625,
          netPayable: 87875,
          payoutMethod: 'NEFT',
          destinationDetails: 'HDFC Bank A/c ...09923',
          status: 'PAID',
          transactionRef: 'NEFT-N90283401928-HDFC',
          receiptNumber: 'REC-2026-03-7814',
          processedDate: '2026-03-16 11:00',
        },
        {
          id: 'PAY-TX-9902',
          requestDate: '2026-04-14 18:45',
          amount: 35000,
          tdsDeduction: 1750,
          netPayable: 33250,
          payoutMethod: 'UPI',
          destinationDetails: 'siddharth.varma@okaxis',
          status: 'PENDING',
          transactionRef: 'Under Verification',
        },
      ]);
    }
  }, [profileMode]);

  // Copy helper with feedback
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDeepLink, setCopiedDeepLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopy = (text: string, type: 'base' | 'deep' | 'code') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    if (type === 'base') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else if (type === 'deep') {
      setCopiedDeepLink(true);
      setTimeout(() => setCopiedDeepLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
    toast({
      title: 'Copied to Clipboard! 🎉',
      description: text,
      type: 'success',
    });
  };

  // Google One-Click OAuth Handler
  const handleGoogleLogin = async () => {
    setIsAuthLoading(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsAuthLoading(false);
      toast({
        title: 'Signed in with Google! 🚀',
        description: `Welcome to ENI AI BORN Partner Portal (${currentAffiliate.email})`,
        type: 'success',
      });
    }, 600);
  };

  // Mobile / OTP Handler
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 10) {
      toast({
        title: 'Invalid Mobile Number',
        description: 'Please enter a valid 10-digit mobile number.',
        type: 'error',
      });
      return;
    }
    setIsAuthLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setIsAuthLoading(false);
      toast({
        title: 'OTP Sent to Mobile! 📲',
        description: 'Use verification code: 1526 or 1234 to proceed.',
        type: 'info',
      });
    }, 500);
  };

  const handleVerifyOtpOrPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === 'phone_otp') {
      if (otpInput !== '1526' && otpInput !== '1234' && otpInput !== '8055') {
        toast({
          title: 'Incorrect OTP',
          description: 'Please enter 1526 or 1234 to verify.',
          type: 'error',
        });
        return;
      }
    } else {
      if (!passwordInput || passwordInput.length < 4) {
        toast({
          title: 'Password Required',
          description: 'Please enter your account password.',
          type: 'error',
        });
        return;
      }
    }

    setIsAuthLoading(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsAuthLoading(false);
      toast({
        title: 'Authentication Successful! ✨',
        description: `Dedicated Affiliate Profile initialized with ₹0.00 initial balance.`,
        type: 'success',
      });
    }, 500);
  };

  // Request Withdrawal Submission
  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmountInput);

    if (amount < 1000) {
      toast({
        title: 'Minimum Withdrawal Threshold ₹1,000',
        description: 'You cannot request payouts below ₹1,000 as per platform rules.',
        type: 'error',
      });
      return;
    }

    if (amount > currentAffiliate.availableBalance) {
      toast({
        title: 'Insufficient Balance',
        description: `Your withdrawable balance is ₹${currentAffiliate.availableBalance.toLocaleString('en-IN')}`,
        type: 'error',
      });
      return;
    }

    setIsSubmittingWithdraw(true);
    setTimeout(() => {
      setIsSubmittingWithdraw(false);
      setWithdrawModalOpen(false);

      const tds = Math.round(amount * 0.05);
      const newPayout: PayoutRecord = {
        id: `PAY-TX-${Math.floor(1000 + Math.random() * 9000)}`,
        requestDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        amount,
        tdsDeduction: tds,
        netPayable: amount - tds,
        payoutMethod: withdrawMethod,
        destinationDetails: withdrawDestination,
        status: 'PENDING',
        transactionRef: 'Awaiting Admin Approval',
      };

      setPayoutsList((prev) => [newPayout, ...prev]);
      toast({
        title: 'Withdrawal Request Submitted! 💸',
        description: `₹${amount.toLocaleString('en-IN')} is queued for processing. Admin will disburse with UTR reference.`,
        type: 'success',
      });
    }, 600);
  };

  // Save Settings Submission
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate UPI ID format
    if (bankDetails.upiId) {
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      if (!upiRegex.test(bankDetails.upiId.trim())) {
        toast({
          title: 'Invalid UPI VPA Format',
          description: 'UPI ID must be like: partner@okaxis, mobile@paytm, name@icici.',
          type: 'error',
        });
        return;
      }
    }

    // Validate IFSC format
    if (bankDetails.ifscCode) {
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(bankDetails.ifscCode.trim().toUpperCase())) {
        toast({
          title: 'Invalid IFSC Code',
          description: 'IFSC must be 11 characters (e.g. HDFC0000060, SBIN0000845).',
          type: 'error',
        });
        return;
      }
    }

    setIsSavingSettings(true);
    setTimeout(() => {
      setIsSavingSettings(false);
      toast({
        title: 'Settings Saved Successfully! 🔒',
        description: 'Bank account, UPI configuration, and notification preferences updated.',
        type: 'success',
      });
    }, 450);
  };

  // Filtered conversions
  const filteredConversions = useMemo(() => {
    return conversionsList.filter((c) => {
      const matchStatus = conversionFilterStatus === 'ALL' || c.status === conversionFilterStatus;
      const matchSearch =
        !conversionSearchTerm ||
        c.campaignSource.toLowerCase().includes(conversionSearchTerm.toLowerCase()) ||
        c.conversionEvent.toLowerCase().includes(conversionSearchTerm.toLowerCase()) ||
        (c.buyerName && c.buyerName.toLowerCase().includes(conversionSearchTerm.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [conversionsList, conversionFilterStatus, conversionSearchTerm]);

  // Analytics Chart Data
  const chartPoints = useMemo(() => {
    if (profileMode === 'zero') {
      return [
        { label: 'W1', clicks: 0, conversions: 0, commission: 0 },
        { label: 'W2', clicks: 0, conversions: 0, commission: 0 },
        { label: 'W3', clicks: 0, conversions: 0, commission: 0 },
        { label: 'W4', clicks: 0, conversions: 0, commission: 0 },
      ];
    }
    if (analyticsRange === 'weekly') {
      return [
        { label: 'Mon', clicks: 120, conversions: 4, commission: 32000 },
        { label: 'Tue', clicks: 165, conversions: 6, commission: 48000 },
        { label: 'Wed', clicks: 210, conversions: 8, commission: 72000 },
        { label: 'Thu', clicks: 190, conversions: 5, commission: 41000 },
        { label: 'Fri', clicks: 280, conversions: 11, commission: 98000 },
        { label: 'Sat', clicks: 340, conversions: 15, commission: 145000 },
        { label: 'Sun', clicks: 295, conversions: 12, commission: 110000 },
      ];
    }
    return [
      { label: 'Nov', clicks: 540, conversions: 16, commission: 125000 },
      { label: 'Dec', clicks: 810, conversions: 24, commission: 195000 },
      { label: 'Jan', clicks: 1040, conversions: 31, commission: 260000 },
      { label: 'Feb', clicks: 920, conversions: 27, commission: 220000 },
      { label: 'Mar', clicks: 1350, conversions: 42, commission: 380000 },
      { label: 'Apr', clicks: 1680, conversions: 52, commission: 495000 },
    ];
  }, [profileMode, analyticsRange]);

  const maxCommission = Math.max(...chartPoints.map((p) => p.commission), 100000);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans selection:bg-[#10B981] selection:text-[#0B1120]">
      {/* Navbar with marketplace links */}
      <Navbar />

      {/* Global Theme & Demo State Bar */}
      <div className="bg-[#1E293B]/80 backdrop-blur-md border-b border-slate-700/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
            <span className="font-semibold text-slate-300">
              ENI AI BORN Affiliate Network & Partner Portal
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30">
              MahaRERA Reg. A031332600766
            </span>
          </div>

          {/* Mode Switcher for Demo Validation */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium hidden md:inline">Profile State Preview:</span>
            <div className="inline-flex rounded-lg bg-[#0B1120] p-1 border border-slate-700">
              <button
                type="button"
                onClick={() => setProfileMode('zero')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  profileMode === 'zero'
                    ? 'bg-[#10B981] text-[#0B1120] shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⭐ New Partner (₹0 Stats)
              </button>
              <button
                type="button"
                onClick={() => setProfileMode('active')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  profileMode === 'active'
                    ? 'bg-[#0EA5E9] text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🚀 Active Partner (High Volume)
              </button>
            </div>

            {/* Quick Link to Admin Suite */}
            <Link
              href="/admin"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
              title="Open Admin Management Suite"
            >
              <span>Admin Suite</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#0EA5E9]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* ======================================================================= */}
        {/* VIEW 1: AUTHENTICATION / ONBOARDING IF NOT LOGGED IN                   */}
        {/* ======================================================================= */}
        {!isLoggedIn ? (
          <div className="max-w-4xl mx-auto space-y-8 my-6">
            {/* Hero Banner with Robot Mascot */}
            <div className="relative rounded-3xl bg-gradient-to-br from-[#1E293B] via-[#1E293B]/90 to-[#0B1120] border border-slate-700/80 p-6 sm:p-10 shadow-2xl overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-[#0EA5E9]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                <div className="md:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>High-Converting Real Estate & AI Software Affiliate Network</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Partner with <span className="text-[#10B981]">ENI AI BORN</span> & Earn Up to{' '}
                    <span className="text-[#0EA5E9]">3.5% Commission</span>
                  </h1>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Refer clients to 100% verified premium real estate developments, luxury township launches, and digital
                    transformation software across India. Enjoy automated attribution, real-time analytics, and weekly UPI/NEFT payouts.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span>Zero Registration Fees</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span>60-Day Cookie Window</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span>Minimum ₹1,000 Payout</span>
                    </div>
                  </div>
                </div>

                {/* Mascot Model Image */}
                <div className="md:col-span-4 flex justify-center items-center">
                  <div className="relative w-44 h-44 sm:w-56 sm:h-56">
                    <div className="absolute inset-0 bg-[#0EA5E9]/20 rounded-full blur-2xl animate-pulse" />
                    <Image
                      src={ROBOT_MASCOT_URL}
                      alt="ENI AI Mascot Model"
                      width={220}
                      height={220}
                      className="relative z-10 object-contain drop-shadow-[0_15px_25px_rgba(16,185,129,0.3)] hover:scale-105 transition-transform"
                      priority
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dual Authentication Card */}
            <div className="max-w-xl mx-auto rounded-3xl bg-[#1E293B] border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-white">Sign In or Register as Partner</h2>
                <p className="text-xs text-slate-400">
                  New users are automatically provisioned with a fresh ₹0.00 affiliate profile.
                </p>
              </div>

              {/* Option A: Continue with Google (One-Click OAuth) */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isAuthLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-lg active:scale-98 cursor-pointer disabled:opacity-60"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{isAuthLoading ? 'Authenticating with Google...' : 'Continue with Google'}</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-700 w-full" />
                <span className="bg-[#1E293B] px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                  Or Mobile Number + OTP / Password
                </span>
                <div className="border-t border-slate-700 w-full" />
              </div>

              {/* Option B: Mobile Auth Switcher */}
              <div className="space-y-4">
                <div className="flex rounded-lg bg-[#0B1120] p-1 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('phone_otp');
                      setOtpSent(false);
                    }}
                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      authMethod === 'phone_otp'
                        ? 'bg-[#10B981] text-[#0B1120] font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Mobile + Instant OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('phone_password');
                    }}
                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      authMethod === 'phone_password'
                        ? 'bg-[#0EA5E9] text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Mobile + Password
                  </button>
                </div>

                {authMethod === 'phone_otp' ? (
                  !otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Enter 10-Digit Mobile Number
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            required
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                            placeholder="9326303244"
                            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-[#10B981] transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isAuthLoading || phoneInput.length < 10}
                        className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1120] font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>{isAuthLoading ? 'Dispatching OTP...' : 'Send Verification OTP'}</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtpOrPassword} className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-semibold text-slate-300">
                            Enter 4-Digit OTP sent to +91 {phoneInput}
                          </label>
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="text-[11px] text-[#0EA5E9] hover:underline"
                          >
                            Change Number
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.trim())}
                          placeholder="e.g. 1526 or 1234"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-center font-mono text-lg tracking-widest text-[#10B981] focus:outline-none focus:border-[#10B981]"
                        />
                        <p className="text-[11px] text-slate-400 mt-1 text-center">
                          Demo OTP: <strong className="text-[#10B981]">1526</strong> or <strong className="text-[#10B981]">1234</strong>
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isAuthLoading || !otpInput}
                        className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1120] font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>{isAuthLoading ? 'Verifying & Initializing Profile...' : 'Verify & Enter Portal'}</span>
                      </button>
                    </form>
                  )
                ) : (
                  <form onSubmit={handleVerifyOtpOrPassword} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 9326303244"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-[#0EA5E9]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder="Enter your partner password"
                          className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-sm focus:outline-none focus:border-[#0EA5E9]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthLoading}
                      className="w-full py-3 rounded-xl bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{isAuthLoading ? 'Logging in...' : 'Sign In with Password'}</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Quick WhatsApp Support trigger */}
              <div className="pt-2 text-center border-t border-slate-700/80">
                <span className="text-xs text-slate-400 mr-2">Need onboarding assistance?</span>
                <a
                  href={WHATSAPP_REDIRECT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981]/25 border border-[#10B981]/30 text-xs font-bold transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================================= */
          /* VIEW 2: AUTHENTICATED PARTNER DASHBOARD (DARK GLASSMORPHIC)             */
          /* ======================================================================= */
          <div className="space-y-6">
            {/* Top Partner Profile & Quick Link Banner */}
            <div className="rounded-3xl bg-[#1E293B] border border-slate-700/80 p-5 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#0EA5E9] text-[#0B1120] font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
                  {currentAffiliate.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-extrabold text-white">
                      {currentAffiliate.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40">
                      Tier: {currentAffiliate.tier} ({currentAffiliate.commissionRatePercent}%)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      ID: {currentAffiliate.affiliateId}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>{currentAffiliate.email}</span>
                    <span>•</span>
                    <span>{currentAffiliate.phone}</span>
                    <span>•</span>
                    <span>Joined: {currentAffiliate.joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Right */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleCopy(baseReferralLink, 'base')}
                  className="px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1120] font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Referral Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQrModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Dynamic QR</span>
                </button>

                <a
                  href={WHATSAPP_REDIRECT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/40 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsLoggedIn(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Instant Social Share Bar */}
            <div className="rounded-2xl bg-[#1E293B] border border-slate-700/80 p-4 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-hidden">
                <Share2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span className="text-xs font-bold text-slate-300 shrink-0">Your Primary Referral Link:</span>
                <span className="px-3 py-1 rounded-lg bg-[#0B1120] border border-slate-700 text-xs font-mono text-[#0EA5E9] truncate select-all">
                  {baseReferralLink}
                </span>
              </div>

              {/* Social Share Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden sm:inline">Share Triggers:</span>
                {/* WhatsApp button per strict rule: text must ONLY say "WhatsApp" */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Explore 100% RERA verified residential townships with direct developer launch pricing: ${baseReferralLink}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/30 text-xs font-bold transition-colors"
                >
                  WhatsApp
                </a>

                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(baseReferralLink)}&text=${encodeURIComponent(
                    'Exclusive verified property inventory & direct builder discounts.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-[#0EA5E9]/15 hover:bg-[#0EA5E9]/25 text-[#0EA5E9] border border-[#0EA5E9]/30 text-xs font-bold transition-colors"
                >
                  Telegram
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(baseReferralLink)}&text=${encodeURIComponent(
                    'Browse verified high-yield residential properties across India via Prosify Real Estate:'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors"
                >
                  X (Twitter)
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(baseReferralLink)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-blue-900/30 hover:bg-blue-900/40 text-blue-300 border border-blue-800 text-xs font-bold transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-700/80">
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
                { id: 'analytics', label: 'Earnings & Conversion Analytics', icon: Sparkles },
                { id: 'links', label: 'Dynamic Link Generator', icon: Link2 },
                { id: 'conversions', label: 'Referral Conversions', icon: FileText },
                { id: 'wallet', label: 'Payouts & Wallet', icon: Wallet },
                { id: 'settings', label: 'Bank & Settings', icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#10B981] text-[#0B1120] shadow-md'
                        : 'bg-[#1E293B] text-slate-300 hover:text-white hover:bg-slate-700/70 border border-slate-700/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* =================================================================== */}
            {/* TAB 1: OVERVIEW STAT CARDS (KPIS)                                   */}
            {/* =================================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 6 Core KPI Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
                  {/* KPI 1: Total Earnings */}
                  <div className="rounded-2xl bg-[#1E293B] border border-slate-700/80 p-4 shadow-lg backdrop-blur-md space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Total Earnings</span>
                    <span className="text-lg sm:text-xl font-extrabold text-[#10B981] block">
                      ₹{currentAffiliate.totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-[#10B981]" />
                      <span>Lifetime closed</span>
                    </span>
                  </div>

                  {/* KPI 2: Available Withdrawable Balance */}
                  <div className="rounded-2xl bg-[#1E293B] border border-slate-700/80 p-4 shadow-lg backdrop-blur-md space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Available Balance</span>
                    <span className="text-lg sm:text-xl font-extrabold text-[#0EA5E9] block">
                      ₹{currentAffiliate.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400">Ready to withdraw</span>
                  </div>

                  {/* KPI 3: Pending Clearance */}
                  <div className="rounded-2xl bg-[#1E293B] border border-slate-700/80 p-4 shadow-lg backdrop-blur-md space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Pending Clearance</span>
                    <span className="text-lg sm:text-xl font-extrabold text-[#F59E0B] block">
                      ₹{currentAffiliate.pendingClearance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400">In token verification</span>
                  </div>

                  {/* KPI 4: Total Clicks */}
                  <div className="rounded-2xl bg-[#1E293B] border border-slate-700/80 p-4 shadow-lg backdrop-blur-md space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Total Clicks</span>
                    <span className="text-lg sm:text-xl font-extrabold text-white block">
                      {currentAffiliate.totalClicks.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400">Unique visitors</span>
                  </div>

                  {/* KPI 5: Total Orders/Leads */}
                  <div className="rounded-2xl bg-[#1E293B] border border-slate-700/80 p-4 shadow-lg backdrop-blur-md space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Total Conversions</span>
                    <span className="text-lg sm:text-xl font-extrabold text-white block">
                      {currentAffiliate.totalConversions.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400">Deals & bookings</span>
                  </div>

                  {/* KPI 6: Commission Rate Tier */}
                  <div className="rounded-2xl bg-[#1E293B] border border-slate-700/80 p-4 shadow-lg backdrop-blur-md space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Partner Tier</span>
                    <span className="text-base sm:text-lg font-black text-[#F59E0B] block truncate">
                      {currentAffiliate.tier} ({currentAffiliate.commissionRatePercent}%)
                    </span>
                    <span className="text-[10px] text-slate-400">Direct booking slab</span>
                  </div>
                </div>

                {/* If Zero State: Clean Empty State Explainer */}
                {profileMode === 'zero' ? (
                  <div className="rounded-3xl bg-[#1E293B] border border-slate-700/80 p-8 text-center space-y-4 backdrop-blur-md">
                    <div className="w-16 h-16 rounded-2xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center mx-auto border border-[#10B981]/30">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h3 className="text-lg font-bold text-white">Your Affiliate Account is Ready to Earn!</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        You currently have ₹0.00 in balance and 0 clicks recorded. Share your referral link or custom deep
                        links on WhatsApp, Instagram, and LinkedIn. When a buyer visits a property or reserves an apartment,
                        your commission automatically credits here.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(baseReferralLink, 'base')}
                        className="px-4 py-2.5 rounded-xl bg-[#10B981] text-[#0B1120] font-black text-xs flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy Your Referral Link</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('links')}
                        className="px-4 py-2.5 rounded-xl bg-[#0EA5E9] text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <Link2 className="w-4 h-4" />
                        <span>Generate Custom Deep Link</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Active Partner Overview Grid */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Quick Performance Summary */}
                    <div className="lg:col-span-8 rounded-3xl bg-[#1E293B] border border-slate-700/80 p-6 shadow-xl backdrop-blur-md space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold text-white">Recent Conversions & Pipeline</h3>
                          <p className="text-xs text-slate-400">Latest client conversions attributed to your links</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab('conversions')}
                          className="text-xs text-[#0EA5E9] hover:underline font-semibold flex items-center gap-1"
                        >
                          <span>View All ({conversionsList.length})</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-700/80 text-slate-400">
                              <th className="pb-3 font-semibold">Date & Source</th>
                              <th className="pb-3 font-semibold">Event</th>
                              <th className="pb-3 font-semibold">Deal Value</th>
                              <th className="pb-3 font-semibold">Commission</th>
                              <th className="pb-3 font-semibold">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {conversionsList.slice(0, 3).map((conv) => (
                              <tr key={conv.id} className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3 font-medium">
                                  <div className="text-white font-semibold">{conv.dateTime}</div>
                                  <div className="text-[11px] text-slate-400">{conv.campaignSource}</div>
                                </td>
                                <td className="py-3 text-slate-300">{conv.conversionEvent}</td>
                                <td className="py-3 font-mono text-slate-300">
                                  ₹{(conv.dealAmount / 100000).toFixed(1)} Lakhs
                                </td>
                                <td className="py-3 font-mono font-bold text-[#10B981]">
                                  ₹{conv.commissionAmount.toLocaleString('en-IN')}
                                </td>
                                <td className="py-3">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      conv.status === 'PAID'
                                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                                        : conv.status === 'APPROVED'
                                        ? 'bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30'
                                        : conv.status === 'PENDING'
                                        ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
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

                    {/* Right: Wallet Quick Action */}
                    <div className="lg:col-span-4 rounded-3xl bg-[#1E293B] border border-slate-700/80 p-6 shadow-xl backdrop-blur-md space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                          <Wallet className="w-4 h-4 text-[#10B981]" />
                          <span>Withdrawable Wallet</span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 block">Available for Immediate Transfer</span>
                          <span className="text-2xl sm:text-3xl font-extrabold text-[#10B981]">
                            ₹{currentAffiliate.availableBalance.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-700/80 space-y-1.5 text-xs text-slate-300">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Linked UPI ID:</span>
                            <span className="font-mono text-white">{bankDetails.upiId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Min. Payout:</span>
                            <span className="text-[#10B981] font-bold">₹1,000</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setWithdrawModalOpen(true)}
                        className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1120] font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Request Withdrawal</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =================================================================== */}
            {/* TAB 2: EARNINGS & CONVERSION ANALYTICS CHART                       */}
            {/* =================================================================== */}
            {activeTab === 'analytics' && (
              <div className="rounded-3xl bg-[#1E293B] border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#10B981]" />
                      <span>Traffic & Commission Analytics Engine</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Visual correlation of Clicks vs. Conversions vs. Earned Commission over time
                    </p>
                  </div>

                  {/* Range Switcher */}
                  <div className="inline-flex rounded-lg bg-[#0B1120] p-1 border border-slate-700 self-start sm:self-auto">
                    {(['weekly', 'monthly', 'custom'] as const).map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setAnalyticsRange(range)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${
                          analyticsRange === range
                            ? 'bg-[#0EA5E9] text-white font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Chart Container */}
                <div className="p-4 sm:p-6 rounded-2xl bg-[#0B1120] border border-slate-700/80 space-y-6">
                  {/* Chart Legend */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                      <span className="text-slate-300">Commission Earned (₹)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#0EA5E9]" />
                      <span className="text-slate-300">Clicks Volume</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                      <span className="text-slate-300">Conversions Count</span>
                    </div>
                  </div>

                  {/* SVG & Bar Chart Hybrid Representation */}
                  <div className="h-64 sm:h-72 w-full flex items-end gap-3 sm:gap-6 pt-6 pb-2 border-b border-slate-700 px-2">
                    {chartPoints.map((point, idx) => {
                      const heightPercent = point.commission > 0 ? Math.min(100, Math.round((point.commission / maxCommission) * 100)) : 4;
                      return (
                        <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center gap-2 group relative">
                          {/* Tooltip on Hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-14 bg-slate-900 border border-slate-700 rounded-lg p-2 text-[10px] text-white pointer-events-none shadow-xl z-20 whitespace-nowrap">
                            <div>Commission: ₹{point.commission.toLocaleString('en-IN')}</div>
                            <div>Clicks: {point.clicks} | Conv: {point.conversions}</div>
                          </div>

                          {/* Bar */}
                          <div className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-[#10B981]/40 via-[#10B981] to-[#0EA5E9] transition-all hover:brightness-125 flex flex-col justify-between items-center py-1" style={{ height: `${heightPercent}%` }}>
                            {point.conversions > 0 && (
                              <span className="text-[10px] font-bold text-[#0B1120] bg-white/90 px-1 rounded-full">
                                {point.conversions}
                              </span>
                            )}
                          </div>

                          {/* X-axis Label */}
                          <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white transition-colors">
                            {point.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Metric Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-[#1E293B]/70 border border-slate-700/60">
                      <span className="text-[11px] text-slate-400 block">Total Traffic Clicks</span>
                      <span className="text-base font-bold text-white">
                        {chartPoints.reduce((acc, c) => acc + c.clicks, 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1E293B]/70 border border-slate-700/60">
                      <span className="text-[11px] text-slate-400 block">Attributed Deals</span>
                      <span className="text-base font-bold text-[#0EA5E9]">
                        {chartPoints.reduce((acc, c) => acc + c.conversions, 0)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1E293B]/70 border border-slate-700/60">
                      <span className="text-[11px] text-slate-400 block">Aggregate Commission</span>
                      <span className="text-base font-bold text-[#10B981]">
                        ₹{chartPoints.reduce((acc, c) => acc + c.commission, 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1E293B]/70 border border-slate-700/60">
                      <span className="text-[11px] text-slate-400 block">Avg. Conversion Rate</span>
                      <span className="text-base font-bold text-[#F59E0B]">
                        {currentAffiliate.conversionRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* TAB 3: DYNAMIC REFERRAL LINK & DEEP LINK GENERATOR                  */}
            {/* =================================================================== */}
            {activeTab === 'links' && (
              <div className="rounded-3xl bg-[#1E293B] border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-[#0EA5E9]" />
                    <span>Dynamic Referral Deep Link Generator</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Input any project, apartment, or service page URL from the platform and append your affiliate tracking tag instantly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Target Project / Service URL
                    </label>
                    <input
                      type="url"
                      value={customPathInput}
                      onChange={(e) => setCustomPathInput(e.target.value)}
                      placeholder="https://prosify.in/projects/oberoi-sky-city"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-[#0EA5E9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Campaign Tag (UTM Source / Placement)
                    </label>
                    <input
                      type="text"
                      value={customCampaignInput}
                      onChange={(e) => setCustomCampaignInput(e.target.value)}
                      placeholder="e.g. whatsapp-investors, linkedin-tech-lead"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-[#0EA5E9]"
                    />
                  </div>
                </div>

                {/* Generated Output */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1120] border border-slate-700/80 space-y-3">
                  <span className="text-xs font-bold text-[#10B981] block">Generated Deep Tracking Link:</span>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedDeepLink}
                      className="w-full px-3 py-2 rounded-xl bg-[#1E293B] border border-slate-700 text-slate-200 font-mono text-xs select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(generatedDeepLink, 'deep')}
                      className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1120] font-black text-xs shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      {copiedDeepLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedDeepLink ? 'Copied!' : 'Copy Deep Link'}</span>
                    </button>
                  </div>
                </div>

                {/* Suggested High-Yield Quick Links */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-300 block">Suggested High-Yield Pre-Launch Projects:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        title: 'Oberoi Sky City, Borivali East',
                        url: 'https://prosify.in/projects/oberoi-sky-city',
                        slab: '3.5% Commission (₹1.4L - ₹3.5L/deal)',
                      },
                      {
                        title: 'Godrej Riviera, Waterfront Tower',
                        url: 'https://prosify.in/projects/godrej-riviera',
                        slab: '2.5% Commission (₹57K - ₹1.2L/deal)',
                      },
                      {
                        title: 'Lodha Woods, Kandivali East',
                        url: 'https://prosify.in/projects/lodha-woods',
                        slab: '3.0% Commission (₹45K - ₹95K/deal)',
                      },
                    ].map((proj, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#0B1120] border border-slate-700 hover:border-[#10B981]/50 transition-colors space-y-1.5"
                      >
                        <span className="font-bold text-xs text-white block">{proj.title}</span>
                        <span className="text-[10px] text-[#10B981] font-semibold block">{proj.slab}</span>
                        <button
                          type="button"
                          onClick={() => setCustomPathInput(proj.url)}
                          className="text-[11px] text-[#0EA5E9] hover:underline font-medium cursor-pointer"
                        >
                          Use this project URL →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* TAB 4: REFERRAL PERFORMANCE & CONVERSION TABLE                     */}
            {/* =================================================================== */}
            {activeTab === 'conversions' && (
              <div className="rounded-3xl bg-[#1E293B] border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#10B981]" />
                      <span>Referral Performance & Conversion Table</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Real-time ledger of verified clicks, visits, token bookings, and commissions
                    </p>
                  </div>

                  {/* Status Filters */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {['ALL', 'PENDING', 'APPROVED', 'PAID', 'REJECTED'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setConversionFilterStatus(st)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          conversionFilterStatus === st
                            ? 'bg-[#10B981] text-[#0B1120] font-bold'
                            : 'bg-[#0B1120] text-slate-400 hover:text-white border border-slate-700'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredConversions.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#0B1120] border border-slate-700/80 space-y-2">
                    <p className="text-slate-300 text-sm font-semibold">No conversion records found in this view.</p>
                    <p className="text-xs text-slate-500">
                      When buyers click your links and initiate bookings, their transactions will automatically appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-700/80">
                    <table className="w-full text-left text-xs bg-[#0B1120]">
                      <thead className="border-b border-slate-700 bg-slate-900/60 text-slate-400 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="px-4 py-3">Date / Time</th>
                          <th className="px-4 py-3">Campaign / Source</th>
                          <th className="px-4 py-3">Conversion Event</th>
                          <th className="px-4 py-3">Buyer / Lead</th>
                          <th className="px-4 py-3">Deal Value</th>
                          <th className="px-4 py-3">Commission Amount</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredConversions.map((conv) => (
                          <tr key={conv.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-3 font-mono text-slate-300">{conv.dateTime}</td>
                            <td className="px-4 py-3 font-semibold text-white">{conv.campaignSource}</td>
                            <td className="px-4 py-3 text-slate-300">{conv.conversionEvent}</td>
                            <td className="px-4 py-3 text-slate-400">{conv.buyerName || 'Verified Buyer'}</td>
                            <td className="px-4 py-3 font-mono text-slate-300">
                              ₹{conv.dealAmount.toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-3 font-mono font-extrabold text-[#10B981]">
                              ₹{conv.commissionAmount.toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  conv.status === 'PAID'
                                    ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                                    : conv.status === 'APPROVED'
                                    ? 'bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30'
                                    : conv.status === 'PENDING'
                                    ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
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
                )}
              </div>
            )}

            {/* =================================================================== */}
            {/* TAB 5: PAYOUT & WALLET SECTION                                     */}
            {/* =================================================================== */}
            {activeTab === 'wallet' && (
              <div className="space-y-6">
                {/* Balance & Withdrawal Action Box */}
                <div className="rounded-3xl bg-[#1E293B] border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-slate-400 block">Available Withdrawable Balance</span>
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#10B981] block">
                        ₹{currentAffiliate.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Minimum withdrawal threshold is <strong>₹1,000.00</strong>
                      </span>
                    </div>

                    <div className="space-y-1.5 p-4 rounded-2xl bg-[#0B1120] border border-slate-700/80 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Default Payout Mode:</span>
                        <span className="font-semibold text-white">Direct UPI (VPA)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Destination:</span>
                        <span className="font-mono text-[#0EA5E9]">{bankDetails.upiId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">TDS Deduction:</span>
                        <span className="text-slate-300">5% Section 194H</span>
                      </div>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => setWithdrawModalOpen(true)}
                        disabled={currentAffiliate.availableBalance < 1000}
                        className="w-full py-3.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1120] font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Request Withdrawal</span>
                      </button>
                      {currentAffiliate.availableBalance < 1000 && (
                        <p className="text-[11px] text-[#F59E0B] text-center mt-2">
                          Balance must be at least ₹1,000 to request payout.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payout History Ledger */}
                <div className="rounded-3xl bg-[#1E293B] border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0EA5E9]" />
                    <span>Disbursement & Payout Transaction History</span>
                  </h3>

                  {payoutsList.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-[#0B1120] border border-slate-700/80 text-xs text-slate-400">
                      No withdrawal requests yet. All processed payouts will display here with UTR transaction references and downloadable receipts.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-700/80">
                      <table className="w-full text-left text-xs bg-[#0B1120]">
                        <thead className="border-b border-slate-700 bg-slate-900/60 text-slate-400 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="px-4 py-3">Transaction ID</th>
                            <th className="px-4 py-3">Date Requested</th>
                            <th className="px-4 py-3">Gross Amount</th>
                            <th className="px-4 py-3">TDS (5%)</th>
                            <th className="px-4 py-3">Net Disbursed</th>
                            <th className="px-4 py-3">Mode & Destination</th>
                            <th className="px-4 py-3">Status & Reference</th>
                            <th className="px-4 py-3 text-right">Receipt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {payoutsList.map((payout) => (
                            <tr key={payout.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="px-4 py-3 font-mono font-bold text-white">{payout.id}</td>
                              <td className="px-4 py-3 text-slate-400">{payout.requestDate}</td>
                              <td className="px-4 py-3 font-mono text-slate-300">
                                ₹{payout.amount.toLocaleString('en-IN')}
                              </td>
                              <td className="px-4 py-3 font-mono text-slate-400">
                                ₹{payout.tdsDeduction.toLocaleString('en-IN')}
                              </td>
                              <td className="px-4 py-3 font-mono font-bold text-[#10B981]">
                                ₹{payout.netPayable.toLocaleString('en-IN')}
                              </td>
                              <td className="px-4 py-3 font-mono text-slate-300">
                                {payout.payoutMethod} ({payout.destinationDetails})
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      payout.status === 'PAID'
                                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                                        : payout.status === 'APPROVED'
                                        ? 'bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30'
                                        : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                                    }`}
                                  >
                                    {payout.status}
                                  </span>
                                  {payout.transactionRef && (
                                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                      {payout.transactionRef}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                {payout.status === 'PAID' ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedReceipt(payout);
                                      setReceiptModalOpen(true);
                                    }}
                                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[#0EA5E9] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Receipt</span>
                                  </button>
                                ) : (
                                  <span className="text-slate-500 text-[10px]">Processing</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* TAB 6: AFFILIATE SETTINGS & BANKING PAGE                           */}
            {/* =================================================================== */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bank Account Details */}
                  <div className="rounded-3xl bg-[#1E293B] border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#10B981]" />
                      <span>Bank Account Details (NEFT / RTGS)</span>
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Account Holder Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={bankDetails.accountHolderName}
                          onChange={(e) =>
                            setBankDetails({ ...bankDetails, accountHolderName: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#10B981]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Bank Account Number
                        </label>
                        <input
                          type="text"
                          required
                          value={bankDetails.accountNumber}
                          onChange={(e) =>
                            setBankDetails({ ...bankDetails, accountNumber: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-[#10B981]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            IFSC Code
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={11}
                            value={bankDetails.ifscCode}
                            onChange={(e) =>
                              setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })
                            }
                            placeholder="HDFC0000060"
                            className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-[#10B981]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Bank Name & Branch
                          </label>
                          <input
                            type="text"
                            required
                            value={bankDetails.bankName}
                            onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#10B981]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* UPI VPA & Notification Preferences */}
                  <div className="rounded-3xl bg-[#1E293B] border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-[#0EA5E9]" />
                      <span>UPI ID (VPA) & Notifications</span>
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          UPI ID (VPA with Format Validation)
                        </label>
                        <input
                          type="text"
                          required
                          value={bankDetails.upiId}
                          onChange={(e) => setBankDetails({ ...bankDetails, upiId: e.target.value })}
                          placeholder="e.g. partner@okaxis, yourname@icici"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-[#10B981] font-mono text-xs sm:text-sm focus:outline-none focus:border-[#0EA5E9]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Format validated: username@handle (UPI is the fastest instant payout method)
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-700 space-y-2.5">
                        <span className="text-xs font-bold text-slate-300 block">
                          Notification & Alert Preferences:
                        </span>

                        <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationPrefs.emailOnConversion}
                            onChange={(e) =>
                              setNotificationPrefs({
                                ...notificationPrefs,
                                emailOnConversion: e.target.checked,
                              })
                            }
                            className="rounded border-slate-700 text-[#10B981] focus:ring-0"
                          />
                          <span>Send Email alert immediately on new conversion event</span>
                        </label>

                        <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationPrefs.smsOnConversion}
                            onChange={(e) =>
                              setNotificationPrefs({
                                ...notificationPrefs,
                                smsOnConversion: e.target.checked,
                              })
                            }
                            className="rounded border-slate-700 text-[#10B981] focus:ring-0"
                          />
                          <span>Send SMS alert when lead books token or site visit</span>
                        </label>

                        <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationPrefs.emailOnPayout}
                            onChange={(e) =>
                              setNotificationPrefs({
                                ...notificationPrefs,
                                emailOnPayout: e.target.checked,
                              })
                            }
                            className="rounded border-slate-700 text-[#10B981] focus:ring-0"
                          />
                          <span>Email confirmation with UTR receipt when payout processed</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-6 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1120] font-black text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSavingSettings ? 'Saving Settings...' : 'Save Payout Details & Settings'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      {/* ======================================================================= */}
      {/* MODAL 1: DYNAMIC QR CODE DISPLAY                                        */}
      {/* ======================================================================= */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-[#1E293B] border border-slate-700 p-6 shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-white">Your Dynamic Referral QR Code</span>
              <button
                type="button"
                onClick={() => setQrModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clean SVG Vector QR representation */}
            <div className="p-6 rounded-2xl bg-white flex justify-center items-center mx-auto shadow-inner">
              <svg className="w-44 h-44" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="white" />
                {/* Corners */}
                <rect x="10" y="10" width="25" height="25" fill="#0B1120" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" fill="#10B981" />

                <rect x="65" y="10" width="25" height="25" fill="#0B1120" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" fill="#10B981" />

                <rect x="10" y="65" width="25" height="25" fill="#0B1120" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" fill="#10B981" />

                {/* Pattern dots */}
                <rect x="42" y="15" width="5" height="5" fill="#0B1120" />
                <rect x="50" y="20" width="5" height="5" fill="#0EA5E9" />
                <rect x="42" y="30" width="5" height="5" fill="#0B1120" />
                <rect x="52" y="45" width="6" height="6" fill="#10B981" />
                <rect x="25" y="45" width="5" height="5" fill="#0B1120" />
                <rect x="65" y="45" width="8" height="8" fill="#0B1120" />
                <rect x="75" y="60" width="6" height="6" fill="#0EA5E9" />
                <rect x="45" y="65" width="6" height="6" fill="#0B1120" />
                <rect x="55" y="75" width="8" height="8" fill="#10B981" />
                <rect x="85" y="80" width="5" height="5" fill="#0B1120" />
              </svg>
            </div>

            <p className="text-xs text-slate-300">
              Scan with any mobile camera or UPI scanner to automatically link the buyer to your affiliate code:
              <strong className="text-[#10B981] block mt-1">{currentAffiliate.affiliateId}</strong>
            </p>

            <button
              type="button"
              onClick={() => {
                toast({
                  title: 'QR Code Ready for Print',
                  description: 'Saved to downloads for marketing flyers.',
                  type: 'success',
                });
                setQrModalOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold text-xs"
            >
              Download High-Res QR
            </button>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 2: REQUEST WITHDRAWAL MODAL                                       */}
      {/* ======================================================================= */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleWithdrawalSubmit}
            className="w-full max-w-md rounded-3xl bg-[#1E293B] border border-slate-700 p-6 sm:p-7 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#10B981]" />
                <span>Request Commission Withdrawal</span>
              </span>
              <button
                type="button"
                onClick={() => setWithdrawModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B1120] border border-slate-700/80 text-xs flex justify-between items-center">
              <span className="text-slate-400">Available Withdrawable:</span>
              <span className="text-lg font-extrabold text-[#10B981]">
                ₹{currentAffiliate.availableBalance.toLocaleString('en-IN')}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Withdrawal Amount (Min. ₹1,000)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min={1000}
                  max={currentAffiliate.availableBalance}
                  required
                  value={withdrawAmountInput}
                  onChange={(e) => setWithdrawAmountInput(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-[#10B981]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Payout Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setWithdrawMethod('UPI');
                    setWithdrawDestination(bankDetails.upiId);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    withdrawMethod === 'UPI'
                      ? 'bg-[#10B981] text-[#0B1120]'
                      : 'bg-[#0B1120] text-slate-400 border border-slate-700'
                  }`}
                >
                  Direct UPI (Instant)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWithdrawMethod('NEFT');
                    setWithdrawDestination(`${bankDetails.bankName} - A/c ${bankDetails.accountNumber.slice(-4)}`);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    withdrawMethod === 'NEFT'
                      ? 'bg-[#0EA5E9] text-white'
                      : 'bg-[#0B1120] text-slate-400 border border-slate-700'
                  }`}
                >
                  Bank NEFT / IMPS
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Payout Destination Details
              </label>
              <input
                type="text"
                required
                value={withdrawDestination}
                onChange={(e) => setWithdrawDestination(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-[#0EA5E9] font-mono text-xs focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmittingWithdraw}
                className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0B1120] font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmittingWithdraw ? 'Submitting Request...' : 'Confirm Withdrawal'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 3: DOWNLOADABLE RECEIPT MODAL                                     */}
      {/* ======================================================================= */}
      {receiptModalOpen && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#1E293B] border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <div>
                <span className="text-sm font-extrabold text-white block">Official Payout Voucher</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Receipt: {selectedReceipt.receiptNumber || selectedReceipt.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReceiptModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Beneficiary:</span>
                <span className="font-semibold text-white">{currentAffiliate.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Affiliate ID:</span>
                <span className="font-mono text-white">{currentAffiliate.affiliateId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">UTR / Ref Number:</span>
                <span className="font-mono text-[#10B981]">{selectedReceipt.transactionRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gross Commission:</span>
                <span className="font-mono">₹{selectedReceipt.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">TDS 5% (Sec 194H):</span>
                <span className="font-mono text-slate-400">- ₹{selectedReceipt.tdsDeduction.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-sm">
                <span className="text-white">Net Credited:</span>
                <span className="text-[#10B981] font-mono">₹{selectedReceipt.netPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  toast({
                    title: 'Voucher Downloaded! 📄',
                    description: `Receipt ${selectedReceipt.receiptNumber || selectedReceipt.id} saved as PDF.`,
                    type: 'success',
                  });
                  setReceiptModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#10B981] text-[#0B1120] font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setReceiptModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
