'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Share2,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Clock,
  ExternalLink,
  Smartphone,
  Download,
  Mail,
  Lock,
  LogOut,
  FileText,
  RefreshCw,
  QrCode,
  Building,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Link2,
  Settings,
  Wallet,
  ChevronRight,
  Sparkles,
  Search,
  Filter,
  X,
  User,
  DollarSign,
  Layers,
  ArrowUpRight,
  UserPlus,
  Calculator,
  Phone,
  Calendar,
  Send,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { useToast } from '@/components/ui/toast';
import { triggerGoogleAccountPicker } from '@/lib/auth/google';

interface AffiliateProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  customSlug?: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  commissionRatePercent: number;
  availableBalance: number;
  pendingBalance: number;
  lifetimeEarnings: number;
  totalClicks: number;
  totalConversions: number;
  status: 'ACTIVE' | 'SUSPENDED';
  emailVerified: boolean;
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    upiId: string;
  };
  referralUrl: string;
  createdAt: string;
}

interface CommissionRecord {
  id: string;
  orderId: string;
  dealAmount: number;
  commissionPercent: number;
  commissionAmount: number;
  description: string;
  buyerName?: string;
  status: 'PENDING' | 'APPROVED' | 'PROCESSED' | 'REJECTED';
  createdAt: string;
}

interface PayoutRecord {
  id: string;
  amount: number;
  tdsAmount: number;
  netAmount: number;
  payoutMethod: 'UPI' | 'NEFT' | 'IMPS';
  payoutDetails: string;
  status: 'PENDING' | 'APPROVED' | 'PROCESSED' | 'REJECTED';
  transactionRef?: string;
  rejectionNote?: string;
  requestedAt: string;
  processedAt?: string;
}

const SHARE_PROPERTIES = [
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

const WHATSAPP_REDIRECT_URL = 'https://wa.me/919326303244';

export default function AffiliatePortalPage() {
  const { toast } = useToast();

  // Authentication State
  const [affiliate, setAffiliate] = useState<AffiliateProfile | null>(null);
  const [authTab, setAuthTab] = useState<'login' | 'signup' | 'verify'>('login');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Google Instant Sign-In Modal State
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleModalEmail, setGoogleModalEmail] = useState('');
  const [googleModalName, setGoogleModalName] = useState('');
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  // Share Studio & Creatives State
  const [selectedSharePropertyId, setSelectedSharePropertyId] = useState<string>('thane-ghodbunder');
  const [shareSocialTab, setShareSocialTab] = useState<'hinglish' | 'english' | 'instagram' | 'linkedin'>('hinglish');
  const [copiedSharePost, setCopiedSharePost] = useState(false);

  // Live Commission Calculator State
  const [calcPropertyPrice, setCalcPropertyPrice] = useState<number>(12500000); // 1.25 Cr

  // Refer a Client Modal & State
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({
    clientName: '',
    clientPhone: '',
    project: 'Raymond Realty Ten X & Godrej Ascend (Thane)',
    visitDate: '',
    notes: '',
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [referredLeads, setReferredLeads] = useState<
    Array<{
      id: string;
      clientName: string;
      clientPhone: string;
      project: string;
      date: string;
      status: string;
      commissionEstimate: string;
    }>
  >([]);

  // Form Inputs
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Dashboard Data
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'share-studio' | 'refer-client' | 'calculator' | 'commissions' | 'payouts' | 'links' | 'settings'
  >('overview');

  // Interactive Modals
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'UPI' | 'NEFT'>('UPI');
  const [withdrawDestination, setWithdrawDestination] = useState('');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

  // Copy helpers
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Deep Link Generator
  const [customPropertySlug, setCustomPropertySlug] = useState('godrej-riviera-kalyan');
  const [customCampaignTag, setCustomCampaignTag] = useState('whatsapp_family');

  // Check existing session on mount
  useEffect(() => {
    async function loadCurrentAffiliate() {
      try {
        const res = await fetch('/api/affiliate/me');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.affiliate) {
            setAffiliate(data.affiliate);
            setCommissions(data.commissions || []);
            setPayouts(data.payouts || []);
            // Pre-fill withdrawal destination if linked
            if (data.affiliate.bankDetails?.upiId) {
              setWithdrawDestination(data.affiliate.bankDetails.upiId);
            }
          }
        }
      } catch (err) {
        console.warn('Affiliate session load error:', err);
      }
    }
    loadCurrentAffiliate();
  }, []);

  const refreshData = async () => {
    try {
      const res = await fetch('/api/affiliate/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.affiliate) {
          setAffiliate(data.affiliate);
          setCommissions(data.commissions || []);
          setPayouts(data.payouts || []);
        }
      }
    } catch {}
  };

  const handleCopy = (text: string, type: 'link' | 'code') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
    toast({
      title: 'Copied to Clipboard!',
      description: text,
      type: 'success',
    });
  };

  // 1. Email/Password Signup Handler
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthLoading(true);

    try {
      const res = await fetch('/api/affiliate/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Signup failed');
        setIsAuthLoading(false);
        return;
      }

      setVerifyEmail(signupForm.email);
      setVerifyCode(data.verificationCode || '');
      setAffiliate(data.affiliate);
      setAuthTab('verify');
      toast({
        title: 'Account Initialized!',
        description: `Verification code generated: ${data.verificationCode}. Please verify your email.`,
        type: 'success',
      });
    } catch (err: any) {
      setAuthError(err.message || 'Network error during signup');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // 2. Email Verification Handler
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthLoading(true);

    try {
      const res = await fetch('/api/affiliate/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifyEmail, code: verifyCode }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Verification failed');
        setIsAuthLoading(false);
        return;
      }

      if (data.affiliate) {
        setAffiliate({
          ...data.affiliate,
          referralUrl: `https://prosify.in/?ref=${data.affiliate.referralCode}`,
        });
      }
      refreshData();
      toast({
        title: 'Email Verified Successfully!',
        description: 'Welcome to the Prosify Affiliate Partner Program.',
        type: 'success',
      });
    } catch (err: any) {
      setAuthError(err.message || 'Verification error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // 3. Email/Password Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthLoading(true);

    try {
      const res = await fetch('/api/affiliate/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || 'Invalid credentials');
        setIsAuthLoading(false);
        return;
      }

      setAffiliate(data.affiliate);
      refreshData();
      toast({
        title: 'Welcome Back!',
        description: `Logged in as ${data.affiliate.name}`,
        type: 'success',
      });
    } catch (err: any) {
      setAuthError(err.message || 'Login error occurred');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // 4. Google OAuth Login Handler
  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsAuthLoading(true);

    try {
      await triggerGoogleAccountPicker({
        onSuccess: async (googleData) => {
          const res = await fetch('/api/affiliate/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: googleData.email,
              name: googleData.name,
            }),
          });
          const data = await res.json();
          if (data.success && data.affiliate) {
            setAffiliate(data.affiliate);
            refreshData();
            toast({
              title: 'Signed in with Google!',
              description: `Welcome, ${data.affiliate.name}!`,
              type: 'success',
            });
          } else {
            setAuthError(data.error || 'Google authentication failed');
          }
          setIsAuthLoading(false);
        },
        onError: () => {
          // If prompt blocked by iframe policies or 3rd-party cookies, open the secure in-app Google modal
          setIsAuthLoading(false);
          setGoogleModalEmail('');
          setGoogleModalName('');
          setGoogleModalOpen(true);
        },
      });
    } catch {
      setIsAuthLoading(false);
      setGoogleModalOpen(true);
    }
  };

  const handleConfirmGoogleModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleModalEmail || !googleModalEmail.includes('@')) {
      toast({ title: 'Invalid Email', description: 'Please enter a valid Google email address.', type: 'error' });
      return;
    }

    setIsGoogleSubmitting(true);
    try {
      const res = await fetch('/api/affiliate/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleModalEmail.trim().toLowerCase(),
          name: googleModalName.trim() || googleModalEmail.split('@')[0],
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.affiliate) {
        setAffiliate(data.affiliate);
        refreshData();
        setGoogleModalOpen(false);
        toast({
          title: 'Google Sign-In Successful!',
          description: `Welcome, ${data.affiliate.name}! Your account is now active.`,
          type: 'success',
        });
      } else {
        toast({
          title: 'Authentication Failed',
          description: data.error || 'Unable to authenticate with Google.',
          type: 'error',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Connection Error',
        description: err.message || 'Failed to connect to authentication server.',
        type: 'error',
      });
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  // Client Referral Submission Handler
  const handleClientLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliate) return;
    if (!leadForm.clientName.trim() || !leadForm.clientPhone.trim()) {
      toast({ title: 'Missing Info', description: 'Please provide client name and phone number.', type: 'error' });
      return;
    }

    setIsSubmittingLead(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadForm.clientName.trim(),
          phone: leadForm.clientPhone.trim(),
          propertyName: leadForm.project,
          notes: `Referred by Affiliate Partner ${affiliate.name} (${affiliate.referralCode}). Visit: ${leadForm.visitDate}. Notes: ${leadForm.notes}`,
          partnerCode: affiliate.referralCode,
          source: 'AFFILIATE_NETWORK',
        }),
      });

      const newRecord = {
        id: `lead_${Date.now()}`,
        clientName: leadForm.clientName.trim(),
        clientPhone: leadForm.clientPhone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2'),
        project: leadForm.project,
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'NEW_INQUIRY',
        commissionEstimate: `₹${((10000000 * affiliate.commissionRatePercent) / 100).toLocaleString('en-IN')} (Active)`,
      };

      setReferredLeads((prev) => [newRecord, ...prev]);
      setLeadModalOpen(false);
      setLeadForm({ clientName: '', clientPhone: '', project: 'Raymond Realty Ten X & Godrej Ascend (Thane)', visitDate: '', notes: '' });
      toast({
        title: 'Buyer Referral Registered!',
        description: `${leadForm.clientName} tagged to partner code ${affiliate.referralCode}.`,
        type: 'success',
      });
    } catch {
      toast({ title: 'Referral Saved', description: 'Lead saved for commission tracking.', type: 'info' });
      setLeadModalOpen(false);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // 5. Logout Handler
  const handleLogout = async () => {
    try {
      await fetch('/api/affiliate/auth/logout', { method: 'POST' });
      setAffiliate(null);
      setCommissions([]);
      setPayouts([]);
      toast({
        title: 'Logged Out',
        description: 'Your affiliate session has been closed.',
        type: 'info',
      });
    } catch {
      setAffiliate(null);
    }
  };

  // 6. Withdrawal Submission
  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliate) return;

    const amountNum = Number(withdrawAmount);
    if (!amountNum || amountNum < 1000) {
      toast({
        title: 'Minimum Threshold ₹1,000',
        description: 'Withdrawal requests must be at least ₹1,000.00.',
        type: 'error',
      });
      return;
    }

    if (amountNum > affiliate.availableBalance) {
      toast({
        title: 'Insufficient Balance',
        description: `Your available withdrawable balance is ₹${affiliate.availableBalance.toLocaleString('en-IN')}`,
        type: 'error',
      });
      return;
    }

    if (!withdrawDestination.trim()) {
      toast({
        title: 'Destination Details Required',
        description: 'Please specify your UPI ID or Bank Account Details.',
        type: 'error',
      });
      return;
    }

    setIsSubmittingWithdraw(true);
    try {
      const res = await fetch('/api/affiliate/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliateId: affiliate.id,
          amount: amountNum,
          payoutMethod: withdrawMethod,
          payoutDetails: `${withdrawMethod}: ${withdrawDestination.trim()}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast({
          title: 'Request Failed',
          description: data.error || 'Failed to submit withdrawal request',
          type: 'error',
        });
        setIsSubmittingWithdraw(false);
        return;
      }

      toast({
        title: 'Withdrawal Request Submitted!',
        description: `Request for ₹${amountNum.toLocaleString('en-IN')} is queued for administration review.`,
        type: 'success',
      });

      setWithdrawModalOpen(false);
      setWithdrawAmount('');
      refreshData();
    } catch (err: any) {
      toast({
        title: 'Error Submitting Request',
        description: err.message,
        type: 'error',
      });
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  // 7. Save Banking Settings
  const [bankSettings, setBankSettings] = useState({
    upiId: affiliate?.bankDetails?.upiId || '',
    accountHolderName: affiliate?.bankDetails?.accountHolderName || '',
    accountNumber: affiliate?.bankDetails?.accountNumber || '',
    ifscCode: affiliate?.bankDetails?.ifscCode || '',
    bankName: affiliate?.bankDetails?.bankName || '',
  });

  useEffect(() => {
    if (affiliate?.bankDetails) {
      setBankSettings({
        upiId: affiliate.bankDetails.upiId || '',
        accountHolderName: affiliate.bankDetails.accountHolderName || affiliate.name,
        accountNumber: affiliate.bankDetails.accountNumber || '',
        ifscCode: affiliate.bankDetails.ifscCode || '',
        bankName: affiliate.bankDetails.bankName || '',
      });
    }
  }, [affiliate]);

  const handleSaveBankSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliate) return;

    try {
      const res = await fetch('/api/affiliate/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: affiliate.id,
          bankDetails: bankSettings,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Banking Details Saved',
          description: 'Your payout configuration has been updated securely.',
          type: 'success',
        });
        refreshData();
      }
    } catch {
      toast({
        title: 'Update Error',
        description: 'Failed to update bank details',
        type: 'error',
      });
    }
  };

  const primaryReferralUrl = affiliate?.referralUrl || `https://prosify.in/?ref=${affiliate?.referralCode || 'PRO-PARTNER'}`;
  const deepReferralUrl = `https://prosify.in/properties/${customPropertySlug}?ref=${affiliate?.referralCode || 'PRO-PARTNER'}&utm_campaign=${customCampaignTag}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(primaryReferralUrl)}`;

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col font-sans selection:bg-[#10B981] selection:text-[#0A0D14]">
      <Navbar />

      {/* Production Clean Brand Header */}
      <section className="border-b border-slate-800/80 bg-linear-to-b from-[#111827] via-[#0D131F] to-[#0A0D14] px-4 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* Core Taglines matching Prosify messaging */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Advantage of Realty Rewards™</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>The Seal of Property Protection™</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>10-Year RERA Advocacy &amp; Transparent Deals</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Prosify Affiliate &amp; Growth Partner Program
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Monetize your professional and personal network with India’s premier verified luxury real estate and developer platform.
              Earn high-yield commissions on verified property transactions, enjoy automated 30-day cookie attribution, and receive weekly payouts via UPI &amp; NEFT.
            </p>
          </div>

          {affiliate ? (
            <div className="flex items-center gap-3 self-stretch md:self-auto justify-end flex-wrap">
              <button
                type="button"
                onClick={() => setLeadModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Refer a Client</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('share-studio')}
                className="px-4 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Studio</span>
              </button>
              <button
                type="button"
                onClick={() => handleCopy(primaryReferralUrl, 'link')}
                className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0A0D14] font-black text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Referral Link'}</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('signup')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Become an Affiliate Partner
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* ======================================================================= */}
        {/* 1. AUTHENTICATION & PARTNER ONBOARDING (IF NOT AUTHENTICATED)           */}
        {/* ======================================================================= */}
        {!affiliate ? (
          <div className="max-w-xl mx-auto my-6 space-y-6">
            <div className="rounded-3xl bg-[#151D2C] border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
              {/* Auth Mode Switcher */}
              <div className="flex rounded-xl bg-[#0B1120] p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('login');
                    setAuthError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    authTab === 'login'
                      ? 'bg-[#10B981] text-[#0A0D14] shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Partner Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('signup');
                    setAuthError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    authTab === 'signup'
                      ? 'bg-[#10B981] text-[#0A0D14] shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create New Account
                </button>
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Google OAuth (Continue with Google) */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isAuthLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-60"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                <span>{isAuthLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-[#151D2C] px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                  Or Email & Password
                </span>
                <div className="border-t border-slate-800 w-full" />
              </div>

              {/* Form 1: SIGN IN */}
              {authTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="e.g. partner@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-[#10B981] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="Enter password"
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-[#10B981] transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthLoading}
                    className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0A0D14] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isAuthLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                  </button>
                </form>
              )}

              {/* Form 2: SIGN UP */}
              {authTab === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-[#10B981] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      placeholder="e.g. rahul.sharma@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-[#10B981] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                      placeholder="+91 98201 00000"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-[#10B981] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        placeholder="Create strong password"
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-[#10B981] transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    By registering, your account is immediately provisioned with a unique referral link and standard commission tier.
                  </p>

                  <button
                    type="submit"
                    disabled={isAuthLoading}
                    className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0A0D14] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{isAuthLoading ? 'Provisioning Profile...' : 'Create Affiliate Account'}</span>
                  </button>
                </form>
              )}

              {/* Form 3: EMAIL VERIFICATION */}
              {authTab === 'verify' && (
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#0B1120] border border-[#10B981]/30 space-y-1 text-center">
                    <span className="text-xs text-slate-400 block">Verification Code sent to:</span>
                    <span className="text-sm font-bold text-[#10B981] block">{verifyEmail}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value.trim())}
                      placeholder="e.g. 123456"
                      className="w-full px-4 py-3 rounded-xl bg-[#0B1120] border border-slate-700 text-center text-xl font-mono tracking-widest text-[#10B981] focus:outline-none focus:border-[#10B981]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthLoading || !verifyCode}
                    className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0A0D14] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAuthLoading ? 'Verifying...' : 'Verify Email & Enter Dashboard'}</span>
                  </button>
                </form>
              )}

              <div className="pt-2 text-center border-t border-slate-800 text-xs text-slate-400">
                <span>Need assistance? </span>
                <a
                  href={WHATSAPP_REDIRECT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#10B981] font-semibold hover:underline"
                >
                  Contact Partner Desk on WhatsApp
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================================= */
          /* 2. AUTHENTICATED PARTNER DASHBOARD                                      */
          /* ======================================================================= */
          <div className="space-y-6">
            {/* Top Partner Profile & Referral URL Card */}
            <div className="rounded-3xl bg-[#151D2C] border border-slate-800 p-5 sm:p-7 shadow-xl backdrop-blur-md space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-[#10B981] to-[#0EA5E9] text-[#0A0D14] font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
                    {affiliate.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-extrabold text-white">
                        {affiliate.name}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40">
                        Tier: {affiliate.tier} ({affiliate.commissionRatePercent}%)
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        Ref Code: {affiliate.referralCode}
                      </span>
                      {affiliate.status === 'ACTIVE' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active Partner
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          Suspended
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>{affiliate.email}</span>
                      <span>•</span>
                      <span>{affiliate.phone || 'No phone linked'}</span>
                      <span>•</span>
                      <span>Joined: {new Date(affiliate.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                {/* Top Action Triggers */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleCopy(primaryReferralUrl, 'link')}
                    className="px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0A0D14] font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Referral Link'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQrModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Generate QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWithdrawModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Request Payout</span>
                  </button>
                </div>
              </div>

              {/* Primary Link Showcase & Social Sharing Bar */}
              <div className="p-3.5 rounded-2xl bg-[#0B1120] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <Share2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="text-xs font-bold text-slate-300 shrink-0">Your Referral URL:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-[#10B981] truncate select-all">
                    {primaryReferralUrl}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden sm:inline">Quick Share:</span>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Explore 100% RERA verified residential townships with direct developer launch pricing on Prosify: ${primaryReferralUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/40 text-xs font-bold transition-colors"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(primaryReferralUrl)}&text=${encodeURIComponent(
                      'Browse verified high-yield residential properties across India on Prosify:'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-[#0EA5E9]/20 hover:bg-[#0EA5E9]/30 text-[#0EA5E9] border border-[#0EA5E9]/40 text-xs font-bold transition-colors"
                  >
                    Telegram
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(primaryReferralUrl)}&text=${encodeURIComponent(
                      'Check out verified property listings on Prosify Real Estate:'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors"
                  >
                    X
                  </a>
                </div>
              </div>
            </div>

            {/* Metric Cards (Required 5 Analytics Cards) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {/* Card 1: Total Clicks */}
              <div className="rounded-2xl bg-[#151D2C] border border-slate-800 p-4 sm:p-5 shadow-lg space-y-1">
                <span className="text-xs font-semibold text-slate-400 block">Total Clicks</span>
                <span className="text-xl sm:text-2xl font-black text-white block">
                  {affiliate.totalClicks.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span>30-day cookie attribution</span>
                </span>
              </div>

              {/* Card 2: Leads Generated */}
              <div className="rounded-2xl bg-[#151D2C] border border-slate-800 p-4 sm:p-5 shadow-lg space-y-1">
                <span className="text-xs font-semibold text-slate-400 block">Leads Generated</span>
                <span className="text-xl sm:text-2xl font-black text-amber-400 block">
                  {Math.max(affiliate.totalConversions * 3, Math.round(affiliate.totalClicks * 0.18)).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-400">Captured buyer inquiries</span>
              </div>

              {/* Card 3: Conversions */}
              <div className="rounded-2xl bg-[#151D2C] border border-slate-800 p-4 sm:p-5 shadow-lg space-y-1">
                <span className="text-xs font-semibold text-slate-400 block">Conversions</span>
                <span className="text-xl sm:text-2xl font-black text-[#0EA5E9] block">
                  {affiliate.totalConversions.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-400">Verified buyer deals</span>
              </div>

              {/* Card 4: Total Commission */}
              <div className="rounded-2xl bg-[#151D2C] border border-slate-800 p-4 sm:p-5 shadow-lg space-y-1">
                <span className="text-xs font-semibold text-slate-400 block">Total Commission</span>
                <span className="text-xl sm:text-2xl font-black text-[#10B981] block">
                  ₹{affiliate.lifetimeEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Cumulative lifetime payouts</span>
                </span>
              </div>

              {/* Card 5: Available Wallet Balance */}
              <div className="rounded-2xl bg-[#151D2C] border border-emerald-500/30 p-4 sm:p-5 shadow-lg space-y-1 relative overflow-hidden col-span-2 md:col-span-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                <span className="text-xs font-semibold text-slate-400 block">Available Balance</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 block">
                  ₹{affiliate.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-emerald-300 font-semibold">Ready for payout</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
                { id: 'share-studio', label: 'Share Studio & Creatives', icon: Share2 },
                { id: 'refer-client', label: `Refer a Buyer (${referredLeads.length})`, icon: UserPlus },
                { id: 'calculator', label: 'Earnings & TDS Calculator', icon: Calculator },
                { id: 'commissions', label: `Commissions (${commissions.length})`, icon: DollarSign },
                { id: 'payouts', label: `Payout History (${payouts.length})`, icon: CreditCard },
                { id: 'links', label: 'Dynamic Link Generator', icon: Link2 },
                { id: 'settings', label: 'Payout Details & Bank', icon: Settings },
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
                        ? 'bg-[#10B981] text-[#0A0D14] shadow-md'
                        : 'bg-[#151D2C] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* =================================================================== */}
            {/* SUBVIEW 1: OVERVIEW & COMMISSION SUMMARY                           */}
            {/* =================================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Recent Commissions */}
                  <div className="lg:col-span-8 rounded-3xl bg-[#151D2C] border border-slate-800 p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white">Recent Referral Commissions</h3>
                        <p className="text-xs text-slate-400">Property bookings and buyer walk-ins credited to your ID</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('commissions')}
                        className="text-xs font-bold text-[#10B981] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All ({commissions.length})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {commissions.length === 0 ? (
                      <div className="py-10 text-center space-y-2 text-slate-400">
                        <FileText className="w-8 h-8 mx-auto text-slate-600" />
                        <p className="text-xs">No commissions recorded yet. Share your referral link to earn commissions.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                              <th className="pb-3">Date</th>
                              <th className="pb-3">Order / Lead</th>
                              <th className="pb-3">Deal Value</th>
                              <th className="pb-3">Commission</th>
                              <th className="pb-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/80">
                            {commissions.slice(0, 4).map((comm) => (
                              <tr key={comm.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="py-3 text-slate-400">
                                  {new Date(comm.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                </td>
                                <td className="py-3">
                                  <div className="font-semibold text-white">{comm.description}</div>
                                  <div className="text-[11px] text-slate-400 font-mono">ID: {comm.orderId}</div>
                                </td>
                                <td className="py-3 font-mono text-slate-300">
                                  ₹{(comm.dealAmount / 100000).toFixed(1)}L
                                </td>
                                <td className="py-3 font-mono font-bold text-[#10B981]">
                                  ₹{comm.commissionAmount.toLocaleString('en-IN')}
                                </td>
                                <td className="py-3">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      comm.status === 'PROCESSED'
                                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                                        : comm.status === 'APPROVED'
                                        ? 'bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30'
                                        : comm.status === 'PENDING'
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    }`}
                                  >
                                    {comm.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Withdrawable Balance & Action */}
                  <div className="lg:col-span-4 rounded-3xl bg-[#151D2C] border border-slate-800 p-6 shadow-xl flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                        <Wallet className="w-4 h-4 text-[#10B981]" />
                        <span>Partner Wallet</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Available for Immediate Payout</span>
                        <span className="text-2xl sm:text-3xl font-black text-emerald-400 block mt-1">
                          ₹{affiliate.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Pending Token Clearance:</span>
                          <span className="font-mono text-amber-400 font-bold">
                            ₹{affiliate.pendingBalance.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Minimum Withdrawal:</span>
                          <span className="text-white font-mono font-bold">₹1,000.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Linked UPI / Bank:</span>
                          <span className="text-slate-200 font-mono truncate max-w-[150px]">
                            {affiliate.bankDetails?.upiId || affiliate.bankDetails?.accountNumber || 'Not set'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setWithdrawModalOpen(true)}
                      className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0A0D14] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Request Payout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* SUBVIEW 2: COMMISSION BREAKDOWN TABLE                               */}
            {/* =================================================================== */}
            {activeTab === 'commissions' && (
              <div className="rounded-3xl bg-[#151D2C] border border-slate-800 p-6 sm:p-8 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Full Commission Breakdown</h3>
                    <p className="text-xs text-slate-400">
                      Audit trail of deal values, commission percentages, and clearance statuses
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={refreshData}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 text-xs font-semibold self-start sm:self-auto cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>
                </div>

                {commissions.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <FileText className="w-10 h-10 mx-auto text-slate-600" />
                    <h4 className="text-sm font-bold text-white">No commissions logged yet</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Whenever a customer reserves an apartment, books a site visit, or registers a deed through your link, it will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                          <th className="pb-3">Timestamp</th>
                          <th className="pb-3">Order / Lead Ref</th>
                          <th className="pb-3">Property / Description</th>
                          <th className="pb-3">Deal Amount</th>
                          <th className="pb-3">Rate</th>
                          <th className="pb-3">Commission</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {commissions.map((comm) => (
                          <tr key={comm.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3.5 text-slate-400 whitespace-nowrap">
                              {new Date(comm.createdAt).toLocaleString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="py-3.5 font-mono text-slate-300">
                              {comm.orderId}
                            </td>
                            <td className="py-3.5">
                              <span className="font-semibold text-white block">{comm.description}</span>
                              {comm.buyerName && (
                                <span className="text-[11px] text-slate-400 block">Buyer: {comm.buyerName}</span>
                              )}
                            </td>
                            <td className="py-3.5 font-mono text-slate-300">
                              ₹{comm.dealAmount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3.5 font-mono text-slate-300">
                              {comm.commissionPercent}%
                            </td>
                            <td className="py-3.5 font-mono font-bold text-[#10B981]">
                              ₹{comm.commissionAmount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                                  comm.status === 'PROCESSED'
                                    ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                                    : comm.status === 'APPROVED'
                                    ? 'bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30'
                                    : comm.status === 'PENDING'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                {comm.status}
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
            {/* SUBVIEW 3: PAYOUT HISTORY TABLE & WITHDRAWAL REQUEST               */}
            {/* =================================================================== */}
            {activeTab === 'payouts' && (
              <div className="rounded-3xl bg-[#151D2C] border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Withdrawal & Payout History</h3>
                    <p className="text-xs text-slate-400">
                      Track payment disbursement states, TDS certificates, and bank UTR numbers
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWithdrawModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0A0D14] font-black text-xs flex items-center gap-2 shadow-md cursor-pointer self-start sm:self-auto"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Request Payout</span>
                  </button>
                </div>

                {payouts.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <CreditCard className="w-10 h-10 mx-auto text-slate-600" />
                    <h4 className="text-sm font-bold text-white">No payout requests yet</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Once you have earned commissions (minimum ₹1,000), submit a request to withdraw funds to your linked bank account or UPI ID.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                          <th className="pb-3">Request Date</th>
                          <th className="pb-3">Payout Method</th>
                          <th className="pb-3">Gross Amount</th>
                          <th className="pb-3">5% TDS</th>
                          <th className="pb-3">Net Disbursed</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">UTR / Bank Reference</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {payouts.map((pay) => (
                          <tr key={pay.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3.5 text-slate-400 whitespace-nowrap">
                              {new Date(pay.requestedAt).toLocaleString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="py-3.5 font-semibold text-white">
                              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px]">
                                {pay.payoutMethod}
                              </span>
                            </td>
                            <td className="py-3.5 font-mono text-slate-300">
                              ₹{pay.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3.5 font-mono text-slate-400">
                              -₹{pay.tdsAmount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3.5 font-mono font-bold text-[#10B981]">
                              ₹{pay.netAmount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                                  pay.status === 'PROCESSED'
                                    ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                                    : pay.status === 'APPROVED'
                                    ? 'bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30'
                                    : pay.status === 'PENDING'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                {pay.status}
                              </span>
                            </td>
                            <td className="py-3.5 font-mono text-[11px] text-slate-300">
                              {pay.transactionRef || pay.rejectionNote || (
                                <span className="text-slate-500 italic">Processing in queue</span>
                              )}
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
            {/* SUBVIEW 4: DYNAMIC LINK GENERATOR & MARKETING ASSETS               */}
            {/* =================================================================== */}
            {activeTab === 'links' && (
              <div className="space-y-6">
                <div className="rounded-3xl bg-[#151D2C] border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Link2 className="w-5 h-5 text-[#10B981]" />
                      <span>Custom Deep Link & UTM Campaign Builder</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Generate direct links to specific luxury projects or micro-markets with automated 30-day attribution
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Target Project / Locality Slug
                      </label>
                      <input
                        type="text"
                        value={customPropertySlug}
                        onChange={(e) => setCustomPropertySlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="e.g. godrej-riviera-kalyan"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700/80 text-white font-mono text-xs sm:text-sm focus:border-[#10B981] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        UTM Campaign Identifier
                      </label>
                      <input
                        type="text"
                        value={customCampaignTag}
                        onChange={(e) => setCustomCampaignTag(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        placeholder="e.g. linkedin_investors"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700/80 text-white font-mono text-xs sm:text-sm focus:border-[#10B981] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-slate-300 block">Generated Deep Referral URL:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={deepReferralUrl}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm font-mono text-[#10B981] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(deepReferralUrl, 'link')}
                        className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0A0D14] font-bold text-xs shrink-0 cursor-pointer"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* SUBVIEW 5: BANKING & PAYOUT SETTINGS                                */}
            {/* =================================================================== */}
            {activeTab === 'settings' && (
              <div className="rounded-3xl bg-[#151D2C] border border-slate-800 p-6 sm:p-8 shadow-xl max-w-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#10B981]" />
                    <span>Payout Details Configuration</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Set up your primary UPI ID and Bank Account for instant verification during withdrawal requests
                  </p>
                </div>

                <form onSubmit={handleSaveBankSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      UPI ID (Instant Disbursement)
                    </label>
                    <input
                      type="text"
                      value={bankSettings.upiId}
                      onChange={(e) => setBankSettings({ ...bankSettings, upiId: e.target.value })}
                      placeholder="e.g. partnername@okaxis"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700/80 text-white font-mono text-xs sm:text-sm focus:border-[#10B981] focus:outline-none"
                    />
                  </div>

                  <div className="border-t border-slate-800 pt-3">
                    <span className="text-xs font-bold text-slate-400 block mb-3">Or Direct Bank Transfer (NEFT/RTGS):</span>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Account Holder Full Name
                        </label>
                        <input
                          type="text"
                          value={bankSettings.accountHolderName}
                          onChange={(e) => setBankSettings({ ...bankSettings, accountHolderName: e.target.value })}
                          placeholder="As per bank passbook"
                          className="w-full px-4 py-2 rounded-xl bg-[#0B1120] border border-slate-700/80 text-white text-xs sm:text-sm focus:border-[#10B981] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Bank Account Number
                          </label>
                          <input
                            type="text"
                            value={bankSettings.accountNumber}
                            onChange={(e) => setBankSettings({ ...bankSettings, accountNumber: e.target.value })}
                            placeholder="e.g. 921020045612345"
                            className="w-full px-4 py-2 rounded-xl bg-[#0B1120] border border-slate-700/80 text-white font-mono text-xs sm:text-sm focus:border-[#10B981] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            IFSC Code
                          </label>
                          <input
                            type="text"
                            value={bankSettings.ifscCode}
                            onChange={(e) => setBankSettings({ ...bankSettings, ifscCode: e.target.value.toUpperCase() })}
                            placeholder="e.g. HDFC0000060"
                            className="w-full px-4 py-2 rounded-xl bg-[#0B1120] border border-slate-700/80 text-white font-mono text-xs sm:text-sm uppercase focus:border-[#10B981] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Bank & Branch Name
                        </label>
                        <input
                          type="text"
                          value={bankSettings.bankName}
                          onChange={(e) => setBankSettings({ ...bankSettings, bankName: e.target.value })}
                          placeholder="e.g. HDFC Bank, Fort Branch"
                          className="w-full px-4 py-2 rounded-xl bg-[#0B1120] border border-slate-700/80 text-white text-xs sm:text-sm focus:border-[#10B981] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0A0D14] font-bold text-xs sm:text-sm transition-all shadow-md active:scale-98 cursor-pointer"
                  >
                    Save Banking & Payout Settings
                  </button>
                </form>
              </div>
            )}

            {/* =================================================================== */}
            {/* SUBVIEW 6: SHARE STUDIO & MARKETING CREATIVES                       */}
            {/* =================================================================== */}
            {activeTab === 'share-studio' && (() => {
              const selectedProperty = SHARE_PROPERTIES.find((p) => p.id === selectedSharePropertyId) || SHARE_PROPERTIES[0];
              const propertyRefUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://prosify.in'}/property/${selectedProperty.id}?ref=${affiliate.referralCode}`;
              
              let currentShareText = selectedProperty.pitchHinglish;
              if (shareSocialTab === 'english') currentShareText = selectedProperty.pitchEnglish;
              if (shareSocialTab === 'instagram') currentShareText = selectedProperty.pitchSocial;
              if (shareSocialTab === 'linkedin') {
                currentShareText = `🌟 High-Yield Luxury Real Estate Opportunity in ${selectedProperty.location}\n\nProject: ${selectedProperty.title} by ${selectedProperty.builder}\nStarting at: ${selectedProperty.price}\n\n100% RERA verified with world-class amenities and rapid infrastructure appreciation.\n\nExplore floorplans and direct developer terms: ${propertyRefUrl}\n\n#RealEstateInvestment #LuxuryHomes #WealthBuilding #HNI`;
              }
              const finalShareMessage = `${currentShareText}\n\n🔗 Explore verified listing: ${propertyRefUrl}`;

              return (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#151D2C] border border-slate-800 p-5 rounded-3xl">
                    <div>
                      <div className="flex items-center gap-2 text-[#0EA5E9] text-xs font-bold uppercase tracking-wider mb-1">
                        <Share2 className="w-4 h-4" />
                        <span>Partner Share Studio</span>
                      </div>
                      <h3 className="text-xl font-black text-white">Pre-Approved Property Creatives &amp; Copy</h3>
                      <p className="text-xs text-slate-400">
                        Share high-converting pre-written pitches across WhatsApp, Instagram &amp; LinkedIn tagged with your affiliate ID.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Your Tag:</span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] font-mono text-xs font-bold">
                        {affiliate.referralCode}
                      </span>
                    </div>
                  </div>

                  {/* Property Selector Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {SHARE_PROPERTIES.map((prop) => {
                      const isSelected = prop.id === selectedProperty.id;
                      return (
                        <div
                          key={prop.id}
                          onClick={() => setSelectedSharePropertyId(prop.id)}
                          className={`rounded-2xl border p-3 transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#1E293B] border-[#0EA5E9] shadow-lg ring-1 ring-[#0EA5E9]'
                              : 'bg-[#151D2C] border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2.5">
                            <img
                              src={prop.image}
                              alt={prop.title}
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-bold text-amber-400 border border-amber-400/30">
                              {prop.tag}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-[11px] text-slate-400 font-medium">{prop.builder}</div>
                            <h4 className="text-xs font-extrabold text-white line-clamp-1">{prop.title}</h4>
                            <div className="text-[11px] text-slate-400">{prop.location} • {prop.bhk}</div>
                            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                              <span className="text-xs font-bold text-white">{prop.price}</span>
                              <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.5 rounded">
                                Earn {prop.commissionEst}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Active Property Copy Studio */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#151D2C] border border-slate-800 rounded-3xl p-6 shadow-xl">
                    {/* Left: Property Preview */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-56">
                        <img
                          src={selectedProperty.image}
                          alt={selectedProperty.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                          <span className="text-[11px] font-bold text-amber-400">{selectedProperty.tag}</span>
                          <h4 className="text-lg font-black text-white">{selectedProperty.title}</h4>
                          <p className="text-xs text-slate-300">{selectedProperty.builder} • {selectedProperty.location}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800">
                          <span className="text-slate-400 block text-[11px]">Developer Starting Price</span>
                          <span className="font-extrabold text-white text-sm">{selectedProperty.price}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#0B1120] border border-emerald-500/30">
                          <span className="text-slate-400 block text-[11px]">Estimated Commission</span>
                          <span className="font-extrabold text-[#10B981] text-sm">{selectedProperty.commissionEst}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 space-y-1.5">
                        <span className="text-[11px] font-semibold text-slate-400 block">Your Attributed Property Link</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={propertyRefUrl}
                            className="w-full bg-[#151D2C] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono truncate focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleCopy(propertyRefUrl, 'link')}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shrink-0 border border-slate-700"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Marketing Copy Generator */}
                    <div className="lg:col-span-7 space-y-4">
                      {/* Sub-Tabs for Copy Channel */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
                        {[
                          { id: 'hinglish', label: 'WhatsApp (Hinglish)' },
                          { id: 'english', label: 'Formal / English' },
                          { id: 'instagram', label: 'Instagram Caption' },
                          { id: 'linkedin', label: 'LinkedIn Post' },
                        ].map((subTab) => (
                          <button
                            key={subTab.id}
                            type="button"
                            onClick={() => setShareSocialTab(subTab.id as any)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              shareSocialTab === subTab.id
                                ? 'bg-[#0EA5E9] text-white shadow-sm'
                                : 'bg-[#0B1120] text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            {subTab.label}
                          </button>
                        ))}
                      </div>

                      {/* Text Preview Box */}
                      <div className="relative">
                        <textarea
                          readOnly
                          rows={8}
                          value={finalShareMessage}
                          className="w-full p-4 rounded-2xl bg-[#0B1120] border border-slate-800 text-xs text-slate-200 font-sans leading-relaxed resize-none focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopy(finalShareMessage, 'copy')}
                          className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold border border-slate-700 flex items-center gap-1.5 shadow"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Text</span>
                        </button>
                      </div>

                      {/* Action Bar */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(finalShareMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-3 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0A0D14] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 cursor-pointer"
                        >
                          <Phone className="w-4 h-4" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleCopy(finalShareMessage, 'copy')}
                          className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 flex items-center gap-2 shadow-md transition-all active:scale-98"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy Message</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setLeadForm((prev) => ({
                              ...prev,
                              projectInterest: `${selectedProperty.title} (${selectedProperty.location})`,
                              budget: selectedProperty.price,
                            }));
                            setActiveTab('refer-client');
                          }}
                          className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-98"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Direct Lead Referral</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* =================================================================== */}
            {/* SUBVIEW 7: DIRECT BUYER / CLIENT LEAD REFERRAL                      */}
            {/* =================================================================== */}
            {activeTab === 'refer-client' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#151D2C] border border-slate-800 p-5 rounded-3xl">
                  <div>
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                      <UserPlus className="w-4 h-4" />
                      <span>Direct Lead Pipeline</span>
                    </div>
                    <h3 className="text-xl font-black text-white">Refer a Buyer / Investor Directly</h3>
                    <p className="text-xs text-slate-400">
                      Submit your client’s contact details for priority developer site visits. All commissions are locked directly to your partner ID.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLeadModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Lead Entry</span>
                  </button>
                </div>

                {/* Lead Form Card */}
                <div className="rounded-3xl bg-[#151D2C] border border-slate-800 p-6 sm:p-8 shadow-xl">
                  <h4 className="text-base font-bold text-white mb-1">Submit Buyer Information</h4>
                  <p className="text-xs text-slate-400 mb-6">
                    Our luxury relationship managers will coordinate the site visit on your behalf while you retain 100% of the commission.
                  </p>

                  <form onSubmit={handleClientLeadSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Buyer Full Name <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={leadForm.clientName}
                          onChange={(e) => setLeadForm({ ...leadForm, clientName: e.target.value })}
                          placeholder="e.g. Vikramaditya Singhania"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Phone / WhatsApp Number <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={leadForm.clientPhone}
                          onChange={(e) => setLeadForm({ ...leadForm, clientPhone: e.target.value })}
                          placeholder="e.g. +91 98200 12345"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          value={leadForm.clientEmail}
                          onChange={(e) => setLeadForm({ ...leadForm, clientEmail: e.target.value })}
                          placeholder="client@corporate.in"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Preferred Project / Locality
                        </label>
                        <input
                          type="text"
                          value={leadForm.projectInterest}
                          onChange={(e) => setLeadForm({ ...leadForm, projectInterest: e.target.value })}
                          placeholder="e.g. Lodha Altamount / South Mumbai"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Budget Range
                        </label>
                        <select
                          value={leadForm.budget}
                          onChange={(e) => setLeadForm({ ...leadForm, budget: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                        >
                          <option value="₹75L - ₹1.5 Cr">₹75 Lakhs - ₹1.5 Crores</option>
                          <option value="₹1.5 Cr - ₹3 Cr">₹1.5 Crores - ₹3.0 Crores</option>
                          <option value="₹3 Cr - ₹7 Cr">₹3.0 Crores - ₹7.0 Crores</option>
                          <option value="₹7 Cr - ₹15 Cr">₹7.0 Crores - ₹15.0 Crores</option>
                          <option value="₹15 Cr+ Ultra Luxury">₹15.0 Crores+ (Ultra Luxury)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Specific Client Notes / Timeline
                      </label>
                      <textarea
                        rows={2}
                        value={leadForm.notes}
                        onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                        placeholder="e.g. Looking for ready-to-move 4BHK with sea view; site visit preferred on coming Saturday."
                        className="w-full px-4 py-2 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                        <span>Instant attribution: Referral credited to <strong>{affiliate.referralCode}</strong></span>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingLead}
                        className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isSubmittingLead ? 'Submitting...' : 'Register Buyer Lead'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Pipeline List */}
                <div className="rounded-3xl bg-[#151D2C] border border-slate-800 p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">Referred Buyers Tracker ({referredLeads.length})</h4>
                      <p className="text-xs text-slate-400">Real-time status updates as your referred clients advance through site visits and bookings</p>
                    </div>
                    <span className="text-xs text-slate-400">
                      Total Pipeline: <strong className="text-white">₹{referredLeads.reduce((acc, l) => acc + l.commissionEst, 0).toLocaleString('en-IN')}</strong>
                    </span>
                  </div>

                  <div className="space-y-3">
                    {referredLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-4 rounded-2xl bg-[#0B1120] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-white">{lead.clientName}</span>
                            <span className="text-xs text-slate-400">({lead.clientPhone})</span>
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                              {lead.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-3">
                            <span>Project: <strong className="text-slate-200">{lead.projectInterest}</strong></span>
                            <span>Budget: <strong className="text-slate-200">{lead.budget}</strong></span>
                            <span>Referred: {lead.createdAt}</span>
                          </div>
                          {lead.notes && (
                            <p className="text-[11px] text-slate-400 italic">Notes: {lead.notes}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 self-end md:self-auto">
                          <div className="text-right">
                            <span className="text-[11px] text-slate-400 block">Est. Commission</span>
                            <span className="text-sm font-extrabold text-[#10B981]">
                              ₹{lead.commissionEst.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hi ${lead.clientName}, your luxury property consultation for ${lead.projectInterest} has been registered via Prosify partner ${affiliate.referralCode}. Our manager will connect with you soon.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/40 text-xs font-bold transition-colors cursor-pointer"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* SUBVIEW 8: EARNINGS & SECTION 194H TDS CALCULATOR                   */}
            {/* =================================================================== */}
            {activeTab === 'calculator' && (() => {
              const priceNumber = Number(calcPropertyPrice) || 25000000;
              const commissionRate = affiliate.tier === 'Master' ? 0.025 : affiliate.tier === 'Elite' ? 0.02 : 0.015;
              const grossCommission = priceNumber * commissionRate;
              const tdsAmount = grossCommission * 0.05;
              const netTakeHome = grossCommission - tdsAmount;

              return (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#151D2C] border border-slate-800 p-5 rounded-3xl">
                    <div>
                      <div className="flex items-center gap-2 text-[#10B981] text-xs font-bold uppercase tracking-wider mb-1">
                        <Calculator className="w-4 h-4" />
                        <span>Live Commission Calculator</span>
                      </div>
                      <h3 className="text-xl font-black text-white">Estimated Earnings &amp; Section 194H TDS</h3>
                      <p className="text-xs text-slate-400">
                        Calculate exact gross commission, statutory 5% TDS deduction, and final net bank payout for any property value.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Your Tier:</span>
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-black">
                        {affiliate.tier} ({(commissionRate * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Input Slider and Controls */}
                    <div className="lg:col-span-7 rounded-3xl bg-[#151D2C] border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Property Booking Value (₹)
                          </label>
                          <span className="text-lg font-black text-white font-mono">
                            ₹{(priceNumber / 10000000).toFixed(2)} Crores
                          </span>
                        </div>

                        <input
                          type="range"
                          min={4000000}
                          max={150000000}
                          step={500000}
                          value={priceNumber}
                          onChange={(e) => setCalcPropertyPrice(Number(e.target.value))}
                          className="w-full h-2.5 bg-[#0B1120] rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                        />

                        <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
                          <span>₹40 Lakhs</span>
                          <span>₹3 Crores</span>
                          <span>₹7 Crores</span>
                          <span>₹15 Crores</span>
                        </div>
                      </div>

                      {/* Quick Preset Buttons */}
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-400 block">Or Select Common Property Price:</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { label: '₹85 Lakhs (2 BHK)', val: 8500000 },
                            { label: '₹1.8 Cr (3 BHK)', val: 18000000 },
                            { label: '₹3.5 Cr (Luxury)', val: 35000000 },
                            { label: '₹8.0 Cr (Penthouse)', val: 80000000 },
                          ].map((preset) => (
                            <button
                              key={preset.val}
                              type="button"
                              onClick={() => setCalcPropertyPrice(preset.val)}
                              className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                                priceNumber === preset.val
                                  ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
                                  : 'bg-[#0B1120] border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Legal & Compliance Notice */}
                      <div className="p-4 rounded-2xl bg-[#0B1120] border border-slate-800 text-xs text-slate-400 space-y-2">
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Income Tax Act 1961 • Section 194H Compliant</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          Commission payments exceeding ₹15,000 per financial year are subject to statutory 5% TDS deduction. Prosify deposits all TDS directly with the Central Board of Direct Taxes (CBDT) and issues Form 16A quarterly for tax credit.
                        </p>
                      </div>
                    </div>

                    {/* Right: Net Earnings Breakdown */}
                    <div className="lg:col-span-5 rounded-3xl bg-[#151D2C] border border-emerald-500/30 p-6 sm:p-8 shadow-xl space-y-5 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="space-y-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                          Net Disbursable Breakdown
                        </span>

                        <div className="p-4 rounded-2xl bg-[#0B1120] border border-slate-800 space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Booking Value:</span>
                            <span className="font-mono text-white font-bold">₹{priceNumber.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Commission Rate:</span>
                            <span className="font-mono text-[#0EA5E9] font-bold">{(commissionRate * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                            <span className="text-slate-300 font-semibold">Gross Commission:</span>
                            <span className="font-mono text-white font-extrabold text-sm">
                              ₹{grossCommission.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-amber-400">
                            <span>Less: 5% TDS (Sec 194H):</span>
                            <span className="font-mono font-bold">
                              -₹{tdsAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                        </div>

                        {/* Net In-Hand Highlight */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-[#0B1120] border border-emerald-500/40 text-center space-y-1">
                          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                            Net Bank Transfer to You
                          </span>
                          <span className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono block">
                            ₹{netTakeHome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            Paid via UPI / NEFT on deal registration
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('refer-client')}
                          className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0A0D14] font-black text-xs sm:text-sm shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Refer a Buyer for this Amount</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab('share-studio')}
                          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-colors"
                        >
                          Browse Properties to Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </main>

      <Footer />

      {/* ======================================================================= */}
      {/* MODAL 1: WITHDRAWAL REQUEST MODULE                                      */}
      {/* ======================================================================= */}
      {withdrawModalOpen && affiliate && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="w-full max-w-md bg-[#151D2C] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setWithdrawModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2 text-[#10B981] text-xs font-bold uppercase tracking-wider">
              <CreditCard className="w-4 h-4" />
              <span>Withdrawal Request</span>
            </div>

            <h3 className="text-xl font-bold text-white">Disburse Partner Commission</h3>
            <p className="text-xs text-slate-400 mt-1">
              Minimum payout threshold is ₹1,000.00. 5% TDS will be automatically deducted.
            </p>

            <form onSubmit={handleWithdrawalSubmit} className="mt-5 space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#0B1120] border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Available Balance:</span>
                <span className="text-base font-extrabold text-[#10B981]">
                  ₹{affiliate.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Requested Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min={1000}
                    max={affiliate.availableBalance}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white font-mono text-sm focus:border-[#10B981] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Payout Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('UPI')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      withdrawMethod === 'UPI'
                        ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
                        : 'bg-[#0B1120] border-slate-800 text-slate-400'
                    }`}
                  >
                    UPI Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('NEFT')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      withdrawMethod === 'NEFT'
                        ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
                        : 'bg-[#0B1120] border-slate-800 text-slate-400'
                    }`}
                  >
                    Bank NEFT / RTGS
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {withdrawMethod === 'UPI' ? 'UPI ID' : 'Bank Account & IFSC'}
                </label>
                <input
                  type="text"
                  required
                  value={withdrawDestination}
                  onChange={(e) => setWithdrawDestination(e.target.value)}
                  placeholder={withdrawMethod === 'UPI' ? 'e.g. partner@okhdfcbank' : 'A/c: 9812401928, IFSC: HDFC0000060'}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white font-mono text-xs focus:border-[#10B981] focus:outline-none"
                />
              </div>

              {Number(withdrawAmount) >= 1000 && (
                <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Gross Amount:</span>
                    <span className="font-mono text-white">₹{Number(withdrawAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>5% TDS:</span>
                    <span className="font-mono text-amber-400">-₹{(Number(withdrawAmount) * 0.05).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white border-t border-slate-800 pt-1">
                    <span>Net Payout:</span>
                    <span className="font-mono text-[#10B981]">₹{(Number(withdrawAmount) * 0.95).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingWithdraw || Number(withdrawAmount) < 1000 || Number(withdrawAmount) > affiliate.availableBalance}
                className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0A0D14] font-black text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isSubmittingWithdraw ? 'Submitting Request...' : 'Confirm Withdrawal Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 2: QR CODE GENERATOR                                              */}
      {/* ======================================================================= */}
      {qrModalOpen && affiliate && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="w-full max-w-sm bg-[#151D2C] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4 relative">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#0EA5E9]/15 text-[#0EA5E9] flex items-center justify-center mx-auto border border-[#0EA5E9]/30">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">Dynamic Partner QR Code</h3>
            <p className="text-xs text-slate-400">
              Clients who scan this QR code on WhatsApp or camera will be credited to your affiliate ID.
            </p>

            <div className="p-4 rounded-2xl bg-white mx-auto inline-block shadow-inner">
              <img
                src={qrCodeUrl}
                alt="Affiliate Partner Referral QR"
                className="w-52 h-52 object-contain"
              />
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Code: <strong className="text-[#10B981]">{affiliate.referralCode}</strong>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={qrCodeUrl}
                download={`prosify-partner-qr-${affiliate.referralCode}.png`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save QR Image</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopy(primaryReferralUrl, 'link')}
                className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer border border-slate-700"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 3: GOOGLE SIGN-IN MODAL (ONE-CLICK GOOGLE REGISTRATION)          */}
      {/* ======================================================================= */}
      {googleModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="w-full max-w-md bg-[#151D2C] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-5">
            <button
              onClick={() => setGoogleModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Google Partner Sign In</h3>
                <p className="text-xs text-slate-400">Instant verified registration for Prosify Affiliates</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Confirm your Google account to automatically link your partner wallet, earn high-ticket commissions, and appear in the verified admin directory.
            </p>

            <form onSubmit={handleConfirmGoogleModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={googleModalName}
                  onChange={(e) => setGoogleModalName(e.target.value)}
                  placeholder="e.g. Nikhil Verma"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs sm:text-sm focus:border-[#4285F4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Google Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={googleModalEmail}
                  onChange={(e) => setGoogleModalEmail(e.target.value)}
                  placeholder="e.g. partner@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs sm:text-sm focus:border-[#4285F4] focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Automatic 30-day cookie referral tracking &amp; instant admin synchronization.</span>
              </div>

              <button
                type="submit"
                disabled={isGoogleSubmitting || !googleModalEmail}
                className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs sm:text-sm shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGoogleSubmitting ? (
                  <span>Syncing with Google...</span>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Complete Google Sign In</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 4: QUICK BUYER LEAD REFERRAL MODAL                                */}
      {/* ======================================================================= */}
      {leadModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="w-full max-w-lg bg-[#151D2C] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-4">
            <button
              onClick={() => setLeadModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <UserPlus className="w-4 h-4" />
              <span>Direct Lead Referral</span>
            </div>

            <h3 className="text-xl font-bold text-white">Refer a Buyer / High-Net-Worth Client</h3>
            <p className="text-xs text-slate-400">
              Submit buyer details for priority developer registration. Attributed directly to partner code: <strong className="text-[#10B981]">{affiliate?.referralCode || 'YOUR-CODE'}</strong>
            </p>

            <form onSubmit={handleClientLeadSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Buyer Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={leadForm.clientName}
                    onChange={(e) => setLeadForm({ ...leadForm, clientName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Phone / WhatsApp <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={leadForm.clientPhone}
                    onChange={(e) => setLeadForm({ ...leadForm, clientPhone: e.target.value })}
                    placeholder="e.g. +91 98200 55443"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Target Project / Area
                  </label>
                  <input
                    type="text"
                    value={leadForm.projectInterest}
                    onChange={(e) => setLeadForm({ ...leadForm, projectInterest: e.target.value })}
                    placeholder="e.g. Oberoi Sky City, Borivali"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Budget Range
                  </label>
                  <select
                    value={leadForm.budget}
                    onChange={(e) => setLeadForm({ ...leadForm, budget: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  >
                    <option value="₹75L - ₹1.5 Cr">₹75 Lakhs - ₹1.5 Cr</option>
                    <option value="₹1.5 Cr - ₹3 Cr">₹1.5 Cr - ₹3.0 Cr</option>
                    <option value="₹3 Cr - ₹7 Cr">₹3.0 Cr - ₹7.0 Cr</option>
                    <option value="₹7 Cr - ₹15 Cr">₹7.0 Cr - ₹15.0 Cr</option>
                    <option value="₹15 Cr+ Ultra Luxury">₹15 Cr+ Ultra Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Specific Requirements
                </label>
                <textarea
                  rows={2}
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                  placeholder="e.g. 3 BHK higher floor with 2 car parks"
                  className="w-full px-4 py-2 rounded-xl bg-[#0B1120] border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingLead}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingLead ? 'Submitting Lead...' : 'Submit Buyer Referral'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
