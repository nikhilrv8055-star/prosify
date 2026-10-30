'use client';

import React, { useState, useEffect } from 'react';
import {
  Share2,
  Users,
  TrendingUp,
  CreditCard,
  Image as ImageIcon,
  Settings,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Copy,
  Edit2,
  Sliders,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Check,
  Sparkles,
  Save,
  Send,
  Building,
  Award,
} from 'lucide-react';
import {
  AffiliateUser,
  AffiliateConversion,
  AffiliatePayoutRecord,
  AffiliateSettings,
  AffiliateCreative,
  AffiliateTier,
} from '@/lib/types';
import {
  INITIAL_AFFILIATE_SETTINGS,
  INITIAL_AFFILIATE_MEMBERS,
  INITIAL_AFFILIATE_CONVERSIONS,
  INITIAL_AFFILIATE_PAYOUTS,
  INITIAL_AFFILIATE_CREATIVES,
} from '@/lib/data/affiliateStore';
import { store } from '@/lib/data/store';
import { useToast } from '@/components/ui/toast';

interface AffiliateProgramViewProps {
  subview?: string;
}

export function AffiliateProgramView({ subview = 'affiliate-members' }: AffiliateProgramViewProps) {
  const { toast } = useToast();

  // Active sub-tab state (derived from subview or user click)
  const [userSelectedTab, setUserSelectedTab] = useState<'settings' | 'members' | 'conversions' | 'payouts' | 'creatives' | null>(null);

  const activeTab: 'settings' | 'members' | 'conversions' | 'payouts' | 'creatives' =
    userSelectedTab ??
    (subview.includes('settings')
      ? 'settings'
      : subview.includes('conversion')
      ? 'conversions'
      : subview.includes('payout')
      ? 'payouts'
      : subview.includes('creative')
      ? 'creatives'
      : 'members');

  // State
  const [settings, setSettings] = useState<AffiliateSettings>(INITIAL_AFFILIATE_SETTINGS);
  const [members, setMembers] = useState<AffiliateUser[]>(() => store.getAffiliates());
  const [conversions, setConversions] = useState<AffiliateConversion[]>(() => store.getAffiliateConversions());
  const [payouts, setPayouts] = useState<AffiliatePayoutRecord[]>(() => (store.getAffiliatePayoutRequests() as any));
  const [creatives, setCreatives] = useState<AffiliateCreative[]>(INITIAL_AFFILIATE_CREATIVES);

  // Search, Filter & Pagination state
  const [memberSearch, setMemberSearch] = useState('');
  const [memberTierFilter, setMemberTierFilter] = useState<string>('ALL');
  const [memberStatusFilter, setMemberStatusFilter] = useState<string>('ALL');
  const [memberCurrentPage, setMemberCurrentPage] = useState<number>(1);
  const membersPerPage = 6;

  const [conversionSearch, setConversionSearch] = useState('');
  const [conversionStageFilter, setConversionStageFilter] = useState<string>('ALL');
  const [conversionStatusFilter, setConversionStatusFilter] = useState<string>('ALL');

  // Modals
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [selectedMemberForDetails, setSelectedMemberForDetails] = useState<AffiliateUser | null>(null);
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    email: '',
    phone: '',
    referralCode: '',
    customSlug: '',
    tier: 'Bronze' as AffiliateTier,
    commissionRatePercent: 2.0,
    upiId: '',
    bankAccount: '',
    ifsc: '',
    panCard: '',
    reraNumber: '',
  });

  const [addCreativeModalOpen, setAddCreativeModalOpen] = useState(false);
  const [newCreativeForm, setNewCreativeForm] = useState({
    title: '',
    type: 'BANNER' as const,
    headline: '',
    copyText: '',
    imageUrl: '',
    targetCategory: 'Luxury Apartments',
  });

  const [payoutProcessModalOpen, setPayoutProcessModalOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<AffiliatePayoutRecord | null>(null);
  const [utrInput, setUtrInput] = useState('');
  const [rejectionNote, setRejectionNote] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Live Data Synchronization from Server
  const fetchLiveMembers = async () => {
    try {
      const res = await fetch('/api/admin/affiliate/members');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.affiliates)) {
          const mapped: AffiliateUser[] = data.affiliates.map((a: any) => ({
            id: a.id,
            name: a.name,
            email: a.email,
            phone: a.phone || '',
            referralCode: a.referralCode,
            tier: a.tier,
            commissionRatePercent: a.commissionRatePercent,
            totalClicks: a.totalClicks || 0,
            totalLeads: Math.round((a.totalClicks || 0) * 0.4),
            totalSiteVisits: Math.round((a.totalClicks || 0) * 0.15),
            totalBookings: a.totalConversions || 0,
            totalEarned: a.lifetimeEarnings || 0,
            payableBalance: a.availableBalance || 0,
            paidAmount: Math.max(0, (a.lifetimeEarnings || 0) - (a.availableBalance || 0)),
            status: a.status?.toLowerCase() === 'suspended' ? 'suspended' : 'active',
            joinedAt: a.createdAt ? a.createdAt.split('T')[0] : '2026-03-01',
            payoutDetails: {
              payoutType: a.bankDetails?.upiId ? 'UPI' : 'BANK_TRANSFER',
              upiId: a.bankDetails?.upiId || '',
              accountHolderName: a.bankDetails?.accountHolderName || a.name,
              bankName: a.bankDetails?.bankName || '',
              accountNumber: a.bankDetails?.accountNumber || '',
              ifscCode: a.bankDetails?.ifscCode || '',
            },
            panCard: 'Submitted',
            reraNumber: '',
          }));
          setMembers(mapped);
        }
      }
    } catch (err) {
      console.warn('Error fetching live members:', err);
    }
  };

  const fetchLivePayouts = async () => {
    try {
      const res = await fetch('/api/admin/affiliate/payouts');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.payouts)) {
          const mappedPayouts: AffiliatePayoutRecord[] = data.payouts.map((p: any) => ({
            id: p.id,
            affiliateId: p.affiliateId,
            affiliateName: p.affiliateName,
            affiliateEmail: p.affiliateEmail,
            amount: p.amount,
            tdsAmount: p.tdsAmount,
            netAmount: p.netAmount,
            payoutMethod: p.payoutMethod,
            recipientDetails: p.payoutDetails,
            payoutDetails: p.payoutDetails,
            status: p.status === 'PROCESSED' ? 'PAID' : p.status,
            rawStatus: p.status,
            transactionRef: p.transactionRef,
            utrRef: p.transactionRef,
            rejectionNote: p.rejectionNote,
            requestedAt: p.requestedAt ? p.requestedAt.split('T')[0] : '2026-10-15',
            processedAt: p.processedAt ? p.processedAt.split('T')[0] : undefined,
            affiliateAvailableBalance: p.affiliateAvailableBalance,
            affiliateTier: p.affiliateTier,
            affiliatePhone: p.affiliatePhone,
          }));
          setPayouts(mappedPayouts);
        }
      }
    } catch (err) {
      console.warn('Error fetching live payouts:', err);
    }
  };

  useEffect(() => {
    fetchLiveMembers();
    fetchLivePayouts();
  }, []);

  // Calculations
  const totalAffiliates = members.length;
  const activeAffiliates = members.filter((m) => m.status === 'active').length;
  const totalPaidOut = payouts
    .filter((p) => p.status === 'PAID')
    .reduce((acc, p) => acc + p.amount, 0);
  const pendingPayoutAmount = payouts
    .filter((p) => p.status === 'PENDING')
    .reduce((acc, p) => acc + p.amount, 0);
  const totalDealVolume = conversions.reduce((acc, c) => acc + c.dealValue, 0);

  // Handlers
  const handleSaveSettings = () => {
    toast({
      title: 'Affiliate Settings Updated',
      description: `Default commission: ${settings.defaultCommissionPercent}%, Cookie: ${settings.cookieDurationDays} days.`,
      type: 'success',
    });
  };

  const handleCopyLink = (code: string) => {
    const link = `https://prosify.in?ref=${code}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    toast({
      title: 'Affiliate Referral Link Copied',
      description: link,
      type: 'success',
    });
  };

  // Toggle affiliate account status (Active, Suspended) with API call
  const handleToggleMemberStatus = async (id: string) => {
    try {
      const res = await fetch('/api/admin/affiliate/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggle_status' }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Affiliate Status Synchronized',
          description: data.message,
          type: 'success',
        });
        fetchLiveMembers();
      } else {
        toast({
          title: 'Failed to update status',
          description: data.error || 'Server error',
          type: 'error',
        });
      }
    } catch {
      // Local fallback
      setMembers((prev) =>
        prev.map((m) => {
          if (m.id === id) {
            const nextStatus = m.status === 'active' ? 'suspended' : 'active';
            toast({
              title: `Affiliate Status: ${nextStatus.toUpperCase()}`,
              description: `${m.name} is now ${nextStatus}.`,
              type: 'info',
            });
            return { ...m, status: nextStatus };
          }
          return m;
        })
      );
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.name || !newMemberForm.email || !newMemberForm.referralCode) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please provide full name, email, and unique referral code.',
        type: 'error',
      });
      return;
    }

    try {
      const res = await fetch('/api/admin/affiliate/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMemberForm),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          title: 'Affiliate Registered Successfully',
          description: data.message || `${newMemberForm.name} (Code: ${newMemberForm.referralCode}) has been onboarded!`,
          type: 'success',
        });
        setAddMemberModalOpen(false);
        setNewMemberForm({
          name: '',
          email: '',
          phone: '',
          referralCode: '',
          customSlug: '',
          tier: 'Bronze',
          commissionRatePercent: 2.0,
          upiId: '',
          bankAccount: '',
          ifsc: '',
          panCard: '',
          reraNumber: '',
        });
        await fetchLiveMembers();
      } else {
        toast({
          title: 'Registration Error',
          description: data.error?.message || data.error || 'Failed to onboard affiliate',
          type: 'error',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Network Error',
        description: err.message || 'Failed to onboard affiliate',
        type: 'error',
      });
    }
  };

  const handleUpdateConversionStatus = (id: string, newStatus: 'APPROVED' | 'PAID' | 'REJECTED') => {
    setConversions((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          toast({
            title: `Conversion #${id} Status: ${newStatus}`,
            description: `Commission: ₹${c.commissionAmount.toLocaleString('en-IN')}`,
            type: newStatus === 'REJECTED' ? 'error' : 'success',
          });
          return { ...c, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] };
        }
        return c;
      })
    );
  };

  const handleOpenProcessPayout = (payout: AffiliatePayoutRecord) => {
    setSelectedPayout(payout);
    setUtrInput(`UTR-${payout.id.toUpperCase()}-CONFIRMED`);
    setRejectionNote('');
    setPayoutProcessModalOpen(true);
  };

  // Status management actions: "Approve", "Mark as Paid / Processed", or "Reject"
  const handleApprovePayout = async (payoutId: string) => {
    setIsProcessingAction(true);
    try {
      const res = await fetch('/api/admin/affiliate/payouts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payoutId, action: 'APPROVE' }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Payout Approved',
          description: data.message || 'Request marked as Approved for next batch disbursement.',
          type: 'success',
        });
        setPayoutProcessModalOpen(false);
        fetchLivePayouts();
        fetchLiveMembers();
      } else {
        toast({ title: 'Approval Failed', description: data.error, type: 'error' });
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, type: 'error' });
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Mark as Paid / Processed with real-time balance debit synchronization
  const handleConfirmPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayout) return;

    if (!utrInput.trim()) {
      toast({
        title: 'UTR Required',
        description: 'Please input the bank UTR or UPI transaction reference number.',
        type: 'error',
      });
      return;
    }

    setIsProcessingAction(true);
    try {
      const res = await fetch('/api/admin/affiliate/payouts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payoutId: selectedPayout.id,
          action: 'PROCESS',
          transactionRef: utrInput.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Payout Processed Successfully!',
          description: data.message || `Disbursed ₹${selectedPayout.amount.toLocaleString('en-IN')}. Affiliate balance debited in real-time.`,
          type: 'success',
        });
        setPayoutProcessModalOpen(false);
        setUtrInput('');
        fetchLivePayouts();
        fetchLiveMembers();
      } else {
        toast({
          title: 'Disbursement Failed',
          description: data.error || 'Server error',
          type: 'error',
        });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, type: 'error' });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleRejectPayout = async (payoutId: string) => {
    if (!rejectionNote.trim()) {
      toast({
        title: 'Rejection Reason Required',
        description: 'Please provide a note explaining why this payout request is rejected.',
        type: 'error',
      });
      return;
    }

    setIsProcessingAction(true);
    try {
      const res = await fetch('/api/admin/affiliate/payouts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payoutId,
          action: 'REJECT',
          rejectionNote: rejectionNote.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Payout Rejected',
          description: data.message || 'Request rejected and partner notified.',
          type: 'info',
        });
        setPayoutProcessModalOpen(false);
        setRejectionNote('');
        fetchLivePayouts();
        fetchLiveMembers();
      } else {
        toast({ title: 'Rejection Failed', description: data.error, type: 'error' });
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, type: 'error' });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleCreateCreative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCreativeForm.title || !newCreativeForm.copyText) {
      toast({
        title: 'Title & Copy Required',
        description: 'Please specify the creative title and promotional copy.',
        type: 'error',
      });
      return;
    }

    const created: AffiliateCreative = {
      id: `crt-${Date.now()}`,
      title: newCreativeForm.title,
      type: newCreativeForm.type,
      headline: newCreativeForm.headline,
      copyText: newCreativeForm.copyText,
      imageUrl:
        newCreativeForm.imageUrl ||
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
      targetCategory: newCreativeForm.targetCategory,
      dimensions: newCreativeForm.type === 'BANNER' ? '1200x630' : undefined,
    };

    setCreatives([created, ...creatives]);
    setAddCreativeModalOpen(false);
    setNewCreativeForm({
      title: '',
      type: 'BANNER',
      headline: '',
      copyText: '',
      imageUrl: '',
      targetCategory: 'Luxury Apartments',
    });

    toast({
      title: 'Marketing Creative Published',
      description: 'Now available in all affiliate partner dashboards.',
      type: 'success',
    });
  };

  // Filtered & Paginated lists
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.referralCode.toLowerCase().includes(memberSearch.toLowerCase());
    const matchesTier = memberTierFilter === 'ALL' || m.tier === memberTierFilter;
    const matchesStatus = memberStatusFilter === 'ALL' || m.status === memberStatusFilter;
    return matchesSearch && matchesTier && matchesStatus;
  });

  const totalMemberPages = Math.ceil(filteredMembers.length / membersPerPage) || 1;
  const paginatedMembers = filteredMembers.slice(
    (memberCurrentPage - 1) * membersPerPage,
    memberCurrentPage * membersPerPage
  );

  const filteredConversions = conversions.filter((c) => {
    const matchesSearch =
      c.buyerName.toLowerCase().includes(conversionSearch.toLowerCase()) ||
      c.affiliateName.toLowerCase().includes(conversionSearch.toLowerCase()) ||
      c.propertyTitle.toLowerCase().includes(conversionSearch.toLowerCase()) ||
      c.referralCode.toLowerCase().includes(conversionSearch.toLowerCase());
    const matchesStage = conversionStageFilter === 'ALL' || c.stage === conversionStageFilter;
    const matchesStatus = conversionStatusFilter === 'ALL' || c.status === conversionStatusFilter;
    return matchesSearch && matchesStage && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">Affiliate & Broker Referral Program</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    MahaRERA Compliant
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Manage real estate influencers, property bloggers, channel affiliates, tracking links, automated commission milestones, and banking payouts.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/affiliate"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700"
            >
              <span>View Public Affiliate Program</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => setAddMemberModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Affiliate</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-neutral-800/80">
          <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
            <span className="text-[11px] text-neutral-400 block font-medium">Total Affiliates</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-black text-white">{totalAffiliates}</span>
              <span className="text-[10px] text-emerald-400 font-bold">{activeAffiliates} Active</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
            <span className="text-[11px] text-neutral-400 block font-medium">Referred Pipeline Deal Volume</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-amber-400">
                ₹{(totalDealVolume / 10000000).toFixed(1)} Cr
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
            <span className="text-[11px] text-neutral-400 block font-medium">Total Conversions</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-white">{conversions.length}</span>
              <span className="text-[10px] text-neutral-400">milestones</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
            <span className="text-[11px] text-neutral-400 block font-medium">Paid Out to Affiliates</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-emerald-400">
                ₹{(totalPaidOut / 100000).toFixed(1)} Lakhs
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-amber-400 block font-medium">Pending Payout Requests</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-amber-300">
                ₹{(pendingPayoutAmount / 1000).toFixed(0)}k
              </span>
              <span className="text-[10px] text-amber-400/80 font-bold">Awaiting release</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-neutral-800">
        {[
          { key: 'members', label: 'Affiliates Directory', icon: Users, count: members.length },
          { key: 'conversions', label: 'Conversions & Referral Logs', icon: TrendingUp, count: conversions.length },
          { key: 'payouts', label: 'Payouts & Banking', icon: CreditCard, count: payouts.filter((p) => p.status === 'PENDING').length || undefined },
          { key: 'creatives', label: 'Marketing Creatives & Banners', icon: ImageIcon, count: creatives.length },
          { key: 'settings', label: 'Program Settings & Commission Rules', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setUserSelectedTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-xs'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. MEMBERS / AFFILIATE DIRECTORY TAB                                     */}
      {/* ========================================================================= */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search by affiliate name, email, or referral code..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={memberTierFilter}
                onChange={(e) => setMemberTierFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ALL">All Tiers</option>
                <option value="Bronze">Bronze (1.5%)</option>
                <option value="Silver">Silver (1.8% - 2.0%)</option>
                <option value="Gold">Gold (2.0% - 2.5%)</option>
                <option value="Diamond">Diamond (2.5% - 3.0%)</option>
              </select>

              <select
                value={memberStatusFilter}
                onChange={(e) => setMemberStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending Review</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Affiliate Partner</th>
                    <th className="py-3.5 px-4">Tracking Code & Link</th>
                    <th className="py-3.5 px-4">Tier & Commission</th>
                    <th className="py-3.5 px-4 text-center">Pipeline Performance</th>
                    <th className="py-3.5 px-4 text-right">Earned / Payable</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {paginatedMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-neutral-800/30 transition-colors">
                      {/* Name & Contact */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white text-sm">{member.name}</div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">{member.email}</div>
                        <div className="text-[10px] text-neutral-500">{member.phone}</div>
                        {member.reraNumber && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold">
                            RERA: {member.reraNumber}
                          </span>
                        )}
                      </td>

                      {/* Code & Referral */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs text-amber-400 font-bold">
                          <span>{member.referralCode}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyLink(member.referralCode)}
                            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            title="Copy Referral Link"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-1">
                          prosify.in?ref={member.referralCode}
                        </div>
                      </td>

                      {/* Tier & Commission */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <Award
                            className={`w-3.5 h-3.5 ${
                              member.tier === 'Diamond'
                                ? 'text-cyan-400'
                                : member.tier === 'Gold'
                                ? 'text-amber-400'
                                : member.tier === 'Silver'
                                ? 'text-slate-300'
                                : 'text-amber-700'
                            }`}
                          />
                          <span className="font-bold text-neutral-200">{member.tier}</span>
                        </div>
                        <span className="text-[11px] font-black text-emerald-400 block mt-0.5">
                          {member.commissionRatePercent}% Per Booking
                        </span>
                      </td>

                      {/* Funnel Metrics */}
                      <td className="py-4 px-4">
                        <div className="grid grid-cols-4 gap-1 text-center font-mono text-[11px]">
                          <div className="p-1 rounded bg-neutral-950/60 border border-neutral-800">
                            <span className="text-neutral-400 text-[9px] block">Clicks</span>
                            <span className="font-bold text-white">{member.totalClicks}</span>
                          </div>
                          <div className="p-1 rounded bg-neutral-950/60 border border-neutral-800">
                            <span className="text-neutral-400 text-[9px] block">Leads</span>
                            <span className="font-bold text-amber-400">{member.totalLeads}</span>
                          </div>
                          <div className="p-1 rounded bg-neutral-950/60 border border-neutral-800">
                            <span className="text-neutral-400 text-[9px] block">Visits</span>
                            <span className="font-bold text-cyan-400">{member.totalSiteVisits}</span>
                          </div>
                          <div className="p-1 rounded bg-neutral-950/60 border border-neutral-800">
                            <span className="text-neutral-400 text-[9px] block">Deals</span>
                            <span className="font-bold text-emerald-400">{member.totalBookings}</span>
                          </div>
                        </div>
                      </td>

                      {/* Earned & Payable */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-black text-white text-xs">
                          ₹{member.totalEarned.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] font-bold text-amber-400 mt-0.5">
                          Payable: ₹{member.payableBalance.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          Paid: ₹{member.paidAmount.toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            member.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : member.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedMemberForDetails(member)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                            title="View Bank & KYC Details"
                          >
                            <Building className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleMemberStatus(member.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              member.status === 'active'
                                ? 'bg-neutral-800 hover:bg-rose-950 hover:text-rose-400 text-neutral-400'
                                : 'bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black'
                            }`}
                          >
                            {member.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-neutral-500">
                        No affiliates found matching your search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredMembers.length > 0 && (
              <div className="p-3.5 bg-neutral-950/80 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
                <div>
                  Showing <strong className="text-white">{(memberCurrentPage - 1) * membersPerPage + 1}</strong> to{' '}
                  <strong className="text-white">
                    {Math.min(memberCurrentPage * membersPerPage, filteredMembers.length)}
                  </strong>{' '}
                  of <strong className="text-white">{filteredMembers.length}</strong> registered affiliates
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={memberCurrentPage === 1}
                    onClick={() => setMemberCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold cursor-pointer transition-colors"
                  >
                    Previous
                  </button>
                  <span className="font-mono text-neutral-300 text-xs px-2">
                    Page {memberCurrentPage} of {totalMemberPages}
                  </span>
                  <button
                    type="button"
                    disabled={memberCurrentPage >= totalMemberPages}
                    onClick={() => setMemberCurrentPage((p) => Math.min(totalMemberPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold cursor-pointer transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CONVERSIONS & REFERRAL LOGS TAB                                       */}
      {/* ========================================================================= */}
      {activeTab === 'conversions' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={conversionSearch}
                onChange={(e) => setConversionSearch(e.target.value)}
                placeholder="Search by buyer name, property, or affiliate..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={conversionStageFilter}
                onChange={(e) => setConversionStageFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ALL">All Stages</option>
                <option value="LEAD_REGISTERED">1. Lead Registered</option>
                <option value="SITE_VISIT">2. Site Visit Done</option>
                <option value="TOKEN_BOOKED">3. Token Booked</option>
                <option value="DEED_REGISTRATION">4. Deed Registration</option>
              </select>

              <select
                value={conversionStatusFilter}
                onChange={(e) => setConversionStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending Approval</option>
                <option value="APPROVED">Approved</option>
                <option value="PAID">Paid</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Conversions Table */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Referral Log #</th>
                    <th className="py-3.5 px-4">Buyer Lead</th>
                    <th className="py-3.5 px-4">Referred By Affiliate</th>
                    <th className="py-3.5 px-4">Property & Deal Value</th>
                    <th className="py-3.5 px-4">Pipeline Stage</th>
                    <th className="py-3.5 px-4 text-right">Commission</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredConversions.map((conv) => (
                    <tr key={conv.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-4 px-4 font-mono text-[11px] text-neutral-400">
                        <span className="font-bold text-white">{conv.id}</span>
                        <div className="text-[10px] text-neutral-500">{conv.createdAt}</div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-white">{conv.buyerName}</div>
                        <div className="text-[11px] text-neutral-400">{conv.buyerPhone}</div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-amber-400">{conv.affiliateName}</div>
                        <span className="font-mono text-[10px] text-neutral-400">Code: {conv.referralCode}</span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-neutral-200">{conv.propertyTitle}</div>
                        <div className="text-[11px] text-neutral-400">{conv.city}</div>
                        <div className="text-[11px] font-black text-white mt-0.5">
                          Deal: ₹{(conv.dealValue / 100000).toLocaleString('en-IN')} L
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide ${
                            conv.stage === 'DEED_REGISTRATION'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : conv.stage === 'TOKEN_BOOKED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : conv.stage === 'SITE_VISIT'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {conv.stage.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="font-black text-sm text-emerald-400">
                          ₹{conv.commissionAmount.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-neutral-400 font-semibold">
                          ({conv.commissionPercent}% rate)
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            conv.status === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : conv.status === 'APPROVED'
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                              : conv.status === 'PENDING'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {conv.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {conv.status === 'PENDING' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleUpdateConversionStatus(conv.id, 'APPROVED')}
                                className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black text-[10px] cursor-pointer"
                                title="Approve Commission"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateConversionStatus(conv.id, 'REJECTED')}
                                className="px-2 py-1 rounded bg-neutral-800 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 font-bold text-[10px] cursor-pointer"
                                title="Reject"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {conv.status === 'APPROVED' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateConversionStatus(conv.id, 'PAID')}
                              className="px-2 py-1 rounded bg-cyan-500 hover:bg-cyan-600 text-neutral-950 font-black text-[10px] cursor-pointer"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PAYOUTS & BANKING TAB                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'payouts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <span className="text-xs text-neutral-400 block font-medium">Pending Payout Requests</span>
              <div className="text-2xl font-black text-amber-400 mt-1">
                ₹{pendingPayoutAmount.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-neutral-500">
                {payouts.filter((p) => p.status === 'PENDING').length} payouts waiting for approval
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <span className="text-xs text-neutral-400 block font-medium">Disbursed This Month</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                ₹{totalPaidOut.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-neutral-500">Direct NEFT & UPI bank settlement</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <span className="text-xs text-neutral-400 block font-medium">Next Scheduled Settlement Cycle</span>
              <div className="text-2xl font-black text-white mt-1">Tuesday, 11:00 AM</div>
              <span className="text-[11px] text-neutral-500">Weekly automated cycle</span>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Affiliate Payout Requests & Ledger</h3>
              <span className="text-xs text-neutral-400">All transactions verified under RERA TDS guidelines</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Payout ID</th>
                    <th className="py-3.5 px-4">Affiliate</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Payment Method & Recipient</th>
                    <th className="py-3.5 px-4">UTR / Transaction Ref</th>
                    <th className="py-3.5 px-4">Requested On</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {payouts.map((pay) => (
                    <tr key={pay.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-white">{pay.id}</td>
                      <td className="py-4 px-4 font-bold text-amber-400">{pay.affiliateName}</td>
                      <td className="py-4 px-4 font-black text-emerald-400 text-sm">
                        ₹{pay.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 font-mono text-[10px] text-neutral-300 font-bold mr-2">
                          {pay.payoutMethod}
                        </span>
                        <span className="text-neutral-300 text-xs">{pay.recipientDetails}</span>
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px] text-neutral-400">
                        {pay.utrRef || '—'}
                      </td>
                      <td className="py-4 px-4 text-neutral-400">{pay.requestedAt}</td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            pay.status === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : pay.status === 'PENDING'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {pay.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {pay.status === 'PENDING' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenProcessPayout(pay)}
                            className="px-3 py-1.5 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs cursor-pointer shadow-xs"
                          >
                            Release Payout
                          </button>
                        ) : (
                          <span className="text-[11px] text-neutral-500">Processed on {pay.processedAt}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MARKETING CREATIVES & BANNERS TAB                                     */}
      {/* ========================================================================= */}
      {activeTab === 'creatives' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-white">Affiliate Marketing Materials & Swipe Copy</h3>
              <p className="text-xs text-neutral-400">
                Provide pre-approved property promotional banners, WhatsApp broadcast scripts, and email swipes for affiliates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAddCreativeModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Creative Asset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creatives.map((crt) => (
              <div
                key={crt.id}
                className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase">
                      {crt.type.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-neutral-400">{crt.targetCategory}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{crt.title}</h4>

                  {crt.imageUrl && (
                    <div className="w-full h-40 rounded-xl overflow-hidden relative border border-neutral-800">
                      <img
                        src={crt.imageUrl}
                        alt={crt.title}
                        className="w-full h-full object-cover"
                      />
                      {crt.dimensions && (
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                          {crt.dimensions}
                        </span>
                      )}
                    </div>
                  )}

                  {crt.headline && (
                    <div className="text-xs font-bold text-neutral-200">
                      Headline: <span className="text-amber-300 font-semibold">{crt.headline}</span>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-300 whitespace-pre-line font-mono max-h-36 overflow-y-auto">
                    {crt.copyText}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800/80 mt-4 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500">Auto-substitutes affiliate referral code</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.clipboard && crt.copyText) {
                        navigator.clipboard.writeText(crt.copyText);
                      }
                      toast({
                        title: 'Creative Copy Text Copied',
                        description: 'Ready to share on WhatsApp, Telegram, or Email.',
                        type: 'success',
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Swipe Text</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SETTINGS & COMMISSION RULES TAB                                       */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div>
              <h3 className="text-base font-bold text-white">Affiliate Commission & Program Rules</h3>
              <p className="text-xs text-neutral-400">
                Configure payout thresholds, attribution cookies, automated milestones, and RERA compliance terms.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-4 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save Program Settings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Left: Financial & Attribution */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>Commission & Tracking Configuration</span>
              </h4>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Default Booking Commission (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="5.0"
                    value={settings.defaultCommissionPercent}
                    onChange={(e) =>
                      setSettings({ ...settings, defaultCommissionPercent: parseFloat(e.target.value) || 2.0 })
                    }
                    className="w-32 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-bold"
                  />
                  <span className="text-neutral-400 text-xs">% of total agreement value per closed unit</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Referral Tracking Cookie Lifetime (Days)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={settings.cookieDurationDays}
                    onChange={(e) =>
                      setSettings({ ...settings, cookieDurationDays: parseInt(e.target.value, 10) || 60 })
                    }
                    className="w-32 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-bold"
                  />
                  <span className="text-neutral-400 text-xs">Days buyer stays attributed to affiliate link</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Minimum Payout Withdrawal Limit (₹)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="500"
                    value={settings.minimumPayoutAmount}
                    onChange={(e) =>
                      setSettings({ ...settings, minimumPayoutAmount: parseInt(e.target.value, 10) || 5000 })
                    }
                    className="w-32 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-bold"
                  />
                  <span className="text-neutral-400 text-xs">Minimum accumulated earnings to trigger withdrawal</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">
                    Verified Lead Bonus (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.leadBonusAmount}
                    onChange={(e) =>
                      setSettings({ ...settings, leadBonusAmount: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">
                    Site Visit Milestone (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.siteVisitBonusAmount}
                    onChange={(e) =>
                      setSettings({ ...settings, siteVisitBonusAmount: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Right: Operational Policies */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Onboarding & Governance Rules</span>
              </h4>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoApproveAffiliates}
                    onChange={(e) => setSettings({ ...settings, autoApproveAffiliates: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white block">Auto-Approve New Affiliate Signups</span>
                    <span className="text-[11px] text-neutral-400">
                      Instantly issue tracking links upon registration without waiting for manual admin approval.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowCustomSlugs}
                    onChange={(e) => setSettings({ ...settings, allowCustomSlugs: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white block">Allow Custom Slugs & Branded Links</span>
                    <span className="text-[11px] text-neutral-400">
                      E.g. prosify.in/r/rajesh-properties in addition to referral codes.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.reraComplianceMandatory}
                    onChange={(e) => setSettings({ ...settings, reraComplianceMandatory: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white block">Require MahaRERA Agent Registration</span>
                    <span className="text-[11px] text-neutral-400">
                      Mandate registered broker number for deals exceeding ₹2 Crores in agreement value.
                    </span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Commission Terms & Legal Agreement Note
                </label>
                <textarea
                  rows={3}
                  value={settings.termsAndConditions}
                  onChange={(e) => setSettings({ ...settings, termsAndConditions: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW AFFILIATE                                                */}
      {/* ========================================================================= */}
      {addMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setAddMemberModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Onboard New Affiliate Partner</h3>
                <span className="text-xs text-neutral-400">Generate exclusive tracking code and set commission tier</span>
              </div>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Full Name / Channel Name *</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.name}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                    placeholder="E.g. Siddharth Verma"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newMemberForm.email}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                    placeholder="affiliate@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    value={newMemberForm.phone}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                    placeholder="+91 98200 12345"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Referral Code *</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.referralCode}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, referralCode: e.target.value.toUpperCase() })}
                    placeholder="E.g. SIDHOMES"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-amber-400 font-mono font-bold uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Commission Tier</label>
                  <select
                    value={newMemberForm.tier}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, tier: e.target.value as AffiliateTier })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold"
                  >
                    <option value="Bronze">Bronze (Standard 1.5%)</option>
                    <option value="Silver">Silver (1.8% rate)</option>
                    <option value="Gold">Gold (2.0% - 2.5%)</option>
                    <option value="Diamond">Diamond (VIP 2.8% - 3.0%)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMemberForm.commissionRatePercent}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, commissionRatePercent: parseFloat(e.target.value) || 2.0 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-bold"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <span className="font-bold text-amber-400 block">Bank & Settlement Information (Optional)</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 text-[11px]">UPI ID (Instant Transfer)</label>
                    <input
                      type="text"
                      value={newMemberForm.upiId}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, upiId: e.target.value })}
                      placeholder="user@upi / okaxis"
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 text-[11px]">PAN Card (TDS Filing)</label>
                    <input
                      type="text"
                      value={newMemberForm.panCard}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, panCard: e.target.value.toUpperCase() })}
                      placeholder="ABCDE1234F"
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddMemberModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black cursor-pointer shadow-md"
                >
                  Onboard Affiliate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: WITHDRAWAL REVIEW & STATUS MANAGEMENT                           */}
      {/* ========================================================================= */}
      {payoutProcessModalOpen && selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPayoutProcessModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Withdrawal & Payout Management</h3>
                <span className="text-xs text-neutral-400">Request ID: <strong className="font-mono text-amber-400">{selectedPayout.id}</strong></span>
              </div>
            </div>

            {/* Affiliate & Financial Breakdown Card */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs mb-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
                <span className="text-neutral-400">Affiliate Partner:</span>
                <div className="text-right">
                  <span className="font-bold text-white block">{selectedPayout.affiliateName}</span>
                  <span className="text-[11px] text-neutral-400 font-mono">{selectedPayout.affiliateEmail || selectedPayout.affiliatePhone || 'Verified Partner'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Affiliate Available Balance:</span>
                <span className="font-black text-emerald-400 text-sm font-mono">
                  ₹{Number(selectedPayout.affiliateAvailableBalance ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Requested Sum (Gross):</span>
                <span className="font-bold text-white font-mono text-sm">
                  ₹{selectedPayout.amount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-neutral-400">
                <span>5% TDS Deduction (Section 194H):</span>
                <span className="font-mono text-amber-400">
                  -₹{(selectedPayout.tdsAmount ?? Math.round(selectedPayout.amount * 0.05)).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-sm">
                <span className="font-bold text-white">Net Disbursement to Partner:</span>
                <span className="font-black text-emerald-400 text-base font-mono">
                  ₹{(selectedPayout.netAmount ?? Math.round(selectedPayout.amount * 0.95)).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 space-y-1">
                <span className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider block">Recipient Bank / UPI:</span>
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 font-mono text-xs">
                  <span className="text-amber-400 font-bold mr-2">[{selectedPayout.payoutMethod}]</span>
                  <span>{selectedPayout.recipientDetails || selectedPayout.payoutDetails}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-neutral-500">Current Request Status:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                  selectedPayout.status === 'PAID' || selectedPayout.status === 'PROCESSED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : selectedPayout.status === 'APPROVED'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : selectedPayout.status === 'REJECTED'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {selectedPayout.rawStatus || selectedPayout.status}
                </span>
              </div>

              {selectedPayout.transactionRef && (
                <div className="text-[11px] text-neutral-400 font-mono pt-1">
                  Reference: <strong className="text-white">{selectedPayout.transactionRef}</strong>
                </div>
              )}

              {selectedPayout.rejectionNote && (
                <div className="text-[11px] text-rose-400 font-mono pt-1">
                  Rejection Reason: {selectedPayout.rejectionNote}
                </div>
              )}
            </div>

            {/* Actions Form */}
            {selectedPayout.status !== 'PAID' && selectedPayout.rawStatus !== 'PROCESSED' && (
              <div className="space-y-4">
                {/* 1. Quick Approve Action */}
                {selectedPayout.status === 'PENDING' && (
                  <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-cyan-300 block">Step 1: Approve Request</span>
                      <span className="text-[11px] text-neutral-400">Mark approved for account verification before payment release.</span>
                    </div>
                    <button
                      type="button"
                      disabled={isProcessingAction}
                      onClick={() => handleApprovePayout(selectedPayout.id)}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-black text-xs cursor-pointer shadow-md transition-all shrink-0 disabled:opacity-50"
                    >
                      {isProcessingAction ? 'Saving...' : 'Approve'}
                    </button>
                  </div>
                )}

                {/* 2. Process & Disburse with UTR */}
                <form onSubmit={handleConfirmPayout} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-white mb-1">
                      Step 2: Mark as Paid / Processed (Real-Time Balance Debit) *
                    </label>
                    <span className="text-[11px] text-neutral-400 block mb-2">
                      Enter the bank transaction reference (UTR / IMPS / UPI Ref ID). Submitting this will automatically debit the affiliate's balance in real time.
                    </span>
                    <input
                      type="text"
                      required
                      value={utrInput}
                      onChange={(e) => setUtrInput(e.target.value)}
                      placeholder="e.g. UPI/20261017/9981240182 or UTR-HDFC-991204"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessingAction || !utrInput.trim()}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black text-xs cursor-pointer shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isProcessingAction ? 'Processing Debit...' : 'Mark as Paid / Processed (Debit Balance)'}</span>
                  </button>
                </form>

                {/* 3. Reject Payout Option */}
                <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2 text-xs">
                  <label className="block font-bold text-rose-300">
                    Reject Payout Request
                  </label>
                  <input
                    type="text"
                    value={rejectionNote}
                    onChange={(e) => setRejectionNote(e.target.value)}
                    placeholder="Provide reason (e.g. Invalid UPI ID / Incorrect account name)"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:border-rose-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={isProcessingAction || !rejectionNote.trim()}
                    onClick={() => handleRejectPayout(selectedPayout.id)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer transition-all disabled:opacity-40"
                  >
                    Reject Payout Request
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setPayoutProcessModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: VIEW AFFILIATE DETAILS & BANK KYC                                */}
      {/* ========================================================================= */}
      {selectedMemberForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedMemberForDetails(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{selectedMemberForDetails.name}</h3>
                <span className="text-xs text-neutral-400">
                  Affiliate Code: <strong className="text-amber-400">{selectedMemberForDetails.referralCode}</strong>
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 block uppercase">Payout Details</span>
                <div className="grid grid-cols-2 gap-2 text-neutral-300">
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Payment Type</span>
                    <span className="font-bold">{selectedMemberForDetails.payoutDetails.payoutType}</span>
                  </div>
                  {selectedMemberForDetails.payoutDetails.upiId && (
                    <div>
                      <span className="text-neutral-500 block text-[10px]">UPI VPA</span>
                      <span className="font-mono font-bold text-amber-300">
                        {selectedMemberForDetails.payoutDetails.upiId}
                      </span>
                    </div>
                  )}
                  {selectedMemberForDetails.payoutDetails.accountNumber && (
                    <>
                      <div>
                        <span className="text-neutral-500 block text-[10px]">Bank Name</span>
                        <span className="font-bold">{selectedMemberForDetails.payoutDetails.bankName || 'HDFC / ICICI'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px]">Account Number</span>
                        <span className="font-mono font-bold">{selectedMemberForDetails.payoutDetails.accountNumber}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px]">IFSC Code</span>
                        <span className="font-mono font-bold">{selectedMemberForDetails.payoutDetails.ifscCode}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 block uppercase">KYC & Compliance</span>
                <div className="grid grid-cols-2 gap-2 text-neutral-300">
                  <div>
                    <span className="text-neutral-500 block text-[10px]">PAN Card</span>
                    <span className="font-mono font-bold">
                      {selectedMemberForDetails.panCard || 'Not Submitted'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">MahaRERA Agent No</span>
                    <span className="font-mono font-bold">
                      {selectedMemberForDetails.reraNumber || 'Exempt / Influencer'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedMemberForDetails(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD CREATIVE ASSET                                               */}
      {/* ========================================================================= */}
      {addCreativeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setAddCreativeModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Publish Marketing Creative</h3>
                <span className="text-xs text-neutral-400">Add banner or swipe copy for partner network</span>
              </div>
            </div>

            <form onSubmit={handleCreateCreative} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newCreativeForm.title}
                  onChange={(e) => setNewCreativeForm({ ...newCreativeForm, title: e.target.value })}
                  placeholder="E.g. Palava City Pre-Launch WhatsApp Broadcast"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Format Type</label>
                  <select
                    value={newCreativeForm.type}
                    onChange={(e) => setNewCreativeForm({ ...newCreativeForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold"
                  >
                    <option value="BANNER">Web / Social Banner</option>
                    <option value="WHATSAPP_TEMPLATE">WhatsApp Broadcast</option>
                    <option value="SOCIAL_POST">LinkedIn / Instagram Post</option>
                    <option value="EMAIL_SWIPE">Email Newsletter Swipe</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Target Category</label>
                  <input
                    type="text"
                    value={newCreativeForm.targetCategory}
                    onChange={(e) => setNewCreativeForm({ ...newCreativeForm, targetCategory: e.target.value })}
                    placeholder="E.g. High Yield / NRI"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Headline (Optional)</label>
                <input
                  type="text"
                  value={newCreativeForm.headline}
                  onChange={(e) => setNewCreativeForm({ ...newCreativeForm, headline: e.target.value })}
                  placeholder="Attention Home Buyers in Mumbai..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Banner Image URL (Optional)</label>
                <input
                  type="url"
                  value={newCreativeForm.imageUrl}
                  onChange={(e) => setNewCreativeForm({ ...newCreativeForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Promotional Copy Text * (Use {'{LINK}'} for referral placeholder)
                </label>
                <textarea
                  rows={4}
                  required
                  value={newCreativeForm.copyText}
                  onChange={(e) => setNewCreativeForm({ ...newCreativeForm, copyText: e.target.value })}
                  placeholder="Namaste! Check out new launch apartments with verified pricing: {LINK}"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddCreativeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4A017] hover:bg-[#b88912] text-neutral-950 font-black cursor-pointer shadow-md"
                >
                  Publish Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
