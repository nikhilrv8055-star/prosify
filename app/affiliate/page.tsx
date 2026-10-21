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

const WHATSAPP_REDIRECT_URL = 'https://wa.me/919326303244';

export default function AffiliatePortalPage() {
  const { toast } = useToast();

  // Authentication State
  const [affiliate, setAffiliate] = useState<AffiliateProfile | null>(null);
  const [authTab, setAuthTab] = useState<'login' | 'signup' | 'verify'>('login');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

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
  const [activeTab, setActiveTab] = useState<'overview' | 'commissions' | 'payouts' | 'links' | 'settings'>('overview');

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
        onError: async () => {
          // If One-Tap prompt is skipped or blocked, redirect directly via Google OAuth 2.0
          try {
            const { getGoogleOAuthUrl } = await import('@/lib/auth/google');
            window.location.href = getGoogleOAuthUrl('/affiliate');
          } catch {
            const fallbackEmail = prompt('Enter your Google email for OAuth sign-in:', 'partner@prosify.in');
            if (fallbackEmail) {
              const res = await fetch('/api/affiliate/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: fallbackEmail,
                  name: fallbackEmail.split('@')[0],
                }),
              });
              const data = await res.json();
              if (data.success && data.affiliate) {
                setAffiliate(data.affiliate);
                refreshData();
              }
            }
          }
          setIsAuthLoading(false);
        },
      });
    } catch (err: any) {
      setAuthError(err.message || 'Google OAuth error');
      setIsAuthLoading(false);
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
      <section className="border-b border-slate-800/80 bg-linear-to-b from-[#111827] to-[#0A0D14] px-4 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified Partner Network • MahaRERA Compliant</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Prosify Affiliate Partner Program
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Monetize your network with India’s premier verified luxury real estate and developer platform.
              Earn up to 3.5% commission on closed sales, enjoy automated 30-day cookie attribution, and receive weekly payouts via UPI & NEFT.
            </p>
          </div>

          {affiliate ? (
            <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
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
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAuthTab('signup')}
                className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0A0D14] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
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

            {/* Metric Cards (Required 4 Cards + Slabs) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Clicks */}
              <div className="rounded-2xl bg-[#151D2C] border border-slate-800 p-4 sm:p-5 shadow-lg space-y-1">
                <span className="text-xs font-semibold text-slate-400 block">Total Clicks</span>
                <span className="text-xl sm:text-2xl font-black text-white block">
                  {affiliate.totalClicks.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span>30-day cookie window tracking</span>
                </span>
              </div>

              {/* Card 2: Unique Conversions */}
              <div className="rounded-2xl bg-[#151D2C] border border-slate-800 p-4 sm:p-5 shadow-lg space-y-1">
                <span className="text-xs font-semibold text-slate-400 block">Unique Conversions</span>
                <span className="text-xl sm:text-2xl font-black text-[#0EA5E9] block">
                  {affiliate.totalConversions.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-400">Verified buyer site visits & deals</span>
              </div>

              {/* Card 3: Total Commission Earned */}
              <div className="rounded-2xl bg-[#151D2C] border border-slate-800 p-4 sm:p-5 shadow-lg space-y-1">
                <span className="text-xs font-semibold text-slate-400 block">Total Commission Earned</span>
                <span className="text-xl sm:text-2xl font-black text-[#10B981] block">
                  ₹{affiliate.lifetimeEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Cumulative lifetime payouts</span>
                </span>
              </div>

              {/* Card 4: Available Balance */}
              <div className="rounded-2xl bg-[#151D2C] border border-emerald-500/30 p-4 sm:p-5 shadow-lg space-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                <span className="text-xs font-semibold text-slate-400 block">Available Balance</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 block">
                  ₹{affiliate.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-emerald-300 font-semibold">Ready for immediate withdrawal</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
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
    </div>
  );
}
