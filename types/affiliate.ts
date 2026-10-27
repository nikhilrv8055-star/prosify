/**
 * Prosify Affiliate & Growth Partner Program - Core Types & Interfaces
 * Standardized across Partner Dashboard, Public Referral Funnel, and Admin Management
 */

export type AffiliateTier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond';

export type PayoutStatus = 'PENDING' | 'APPROVED' | 'PROCESSED' | 'REJECTED';
export type CommissionStatus = 'PENDING' | 'APPROVED' | 'PROCESSED' | 'REJECTED';
export type AffiliateStatus = 'ACTIVE' | 'SUSPENDED';
export type PayoutMethod = 'UPI' | 'NEFT' | 'IMPS';

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId: string;
  panNumber?: string;
  gstNumber?: string;
}

export interface AffiliateProfile {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  customSlug?: string;
  tier: AffiliateTier;
  commissionRatePercent: number; // e.g. 2.5 to 3.5%
  availableBalance: number;
  pendingBalance: number;
  lifetimeEarnings: number;
  totalClicks: number;
  totalConversions: number;
  status: AffiliateStatus;
  emailVerified: boolean;
  bankDetails: BankDetails;
  referralUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralClick {
  id: string;
  affiliateId: string;
  referralCode: string;
  ipAddress: string;
  userAgent?: string;
  landingPage: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  createdAt: string;
}

export interface AffiliateCommission {
  id: string;
  affiliateId: string;
  referralCode: string;
  orderId: string;
  dealAmount: number;
  commissionPercent: number;
  commissionAmount: number;
  description: string;
  buyerName?: string;
  buyerPhone?: string;
  propertyName?: string;
  city?: string;
  status: CommissionStatus;
  rejectionReason?: string;
  createdAt: string;
  approvedAt?: string;
  paidAt?: string;
}

export interface PayoutRecord {
  id: string;
  affiliateId: string;
  affiliateName: string;
  affiliateEmail: string;
  amount: number;
  tdsAmount: number; // 5% TDS
  netAmount: number; // amount - tdsAmount
  payoutMethod: PayoutMethod;
  payoutDetails: string;
  status: PayoutStatus;
  transactionRef?: string;
  rejectionNote?: string;
  requestedAt: string;
  processedAt?: string;
}

export interface AffiliateAnalytics {
  totalClicks: number;
  leadsGenerated: number;
  conversions: number;
  totalCommissionEarned: number;
  availableWalletBalance: number;
  pendingCommission: number;
  conversionRatePercent: number;
  averageDealSize: number;
}

export interface WithdrawalFormValues {
  amount: number;
  payoutMethod: PayoutMethod;
  upiId?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  bankName?: string;
}

export interface AffiliateDirectoryFilter {
  searchQuery?: string;
  tier?: 'ALL' | AffiliateTier;
  status?: 'ALL' | AffiliateStatus;
  page: number;
  limit: number;
}

export interface PayoutManagementAction {
  payoutId: string;
  action: 'APPROVE' | 'PROCESS' | 'REJECT';
  transactionRef?: string;
  rejectionNote?: string;
}
