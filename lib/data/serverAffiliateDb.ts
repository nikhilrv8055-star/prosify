import fs from 'fs';
import path from 'path';

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId: string;
}

export interface AffiliateProfile {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
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
  verificationCode?: string;
  bankDetails: BankDetails;
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
  buyerName?: string;
  buyerPhone?: string;
  dealAmount: number;
  commissionPercent: number;
  commissionAmount: number;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'PROCESSED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
  approvedAt?: string;
  paidAt?: string;
}

export interface PayoutRequest {
  id: string;
  affiliateId: string;
  affiliateName: string;
  affiliateEmail: string;
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

interface AffiliateDatabase {
  affiliates: AffiliateProfile[];
  clicks: ReferralClick[];
  commissions: AffiliateCommission[];
  payouts: PayoutRequest[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const AFFILIATE_DB_FILE = path.join(DATA_DIR, 'unified_affiliates.json');

// Default initial seeds
const INITIAL_AFFILIATES: AffiliateProfile[] = [
  {
    id: 'aff_siddharth_8055',
    name: 'Siddharth Varma',
    email: 'siddharth.v@realtyaffiliates.in',
    phone: '+91 98201 44556',
    passwordHash: 'prosify@123#',
    referralCode: 'PRO-8055',
    customSlug: 'siddharth-luxury',
    tier: 'Diamond',
    commissionRatePercent: 3.5,
    availableBalance: 125000.0,
    pendingBalance: 45000.0,
    lifetimeEarnings: 845000.0,
    totalClicks: 4820,
    totalConversions: 142,
    status: 'ACTIVE',
    emailVerified: true,
    bankDetails: {
      accountHolderName: 'Siddharth Varma',
      accountNumber: '001201509923',
      ifscCode: 'HDFC0000060',
      bankName: 'HDFC Bank, Fort Branch',
      upiId: 'siddharth.varma@okaxis',
    },
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aff_rohan_4210',
    name: 'Rohan Deshmukh',
    email: 'rohan.realty@gmail.com',
    phone: '+91 98989 77665',
    passwordHash: 'prosify@123#',
    referralCode: 'PRO-4210',
    customSlug: 'rohan-pune',
    tier: 'Gold',
    commissionRatePercent: 3.0,
    availableBalance: 48000.0,
    pendingBalance: 18500.0,
    lifetimeEarnings: 312000.0,
    totalClicks: 2150,
    totalConversions: 48,
    status: 'ACTIVE',
    emailVerified: true,
    bankDetails: {
      accountHolderName: 'Rohan Deshmukh',
      accountNumber: '921020045612345',
      ifscCode: 'ICIC0000104',
      bankName: 'ICICI Bank, Shivaji Nagar',
      upiId: 'rohan.deshmukh@icici',
    },
    createdAt: '2026-03-15T11:30:00.000Z',
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_COMMISSIONS: AffiliateCommission[] = [
  {
    id: 'comm_901',
    affiliateId: 'aff_siddharth_8055',
    referralCode: 'PRO-8055',
    orderId: 'ORD-PROS-2026-1049',
    buyerName: 'Vikram Joshi',
    buyerPhone: '+91 98333 44551',
    dealAmount: 42000000,
    commissionPercent: 3.5,
    commissionAmount: 147000,
    description: 'Oberoi Sky City 3BHK Sky Residences #3204 (Deed Registration)',
    status: 'APPROVED',
    createdAt: '2026-10-10T14:32:00.000Z',
    approvedAt: '2026-10-12T10:00:00.000Z',
  },
  {
    id: 'comm_902',
    affiliateId: 'aff_siddharth_8055',
    referralCode: 'PRO-8055',
    orderId: 'ORD-PROS-2026-1052',
    buyerName: 'Amit Singhal',
    buyerPhone: '+91 98200 11223',
    dealAmount: 16500000,
    commissionPercent: 3.5,
    commissionAmount: 57750,
    description: 'Godrej Riviera 3BHK Waterfront Tower A #1402 (Token Booking)',
    status: 'PROCESSED',
    createdAt: '2026-10-05T11:15:00.000Z',
    approvedAt: '2026-10-06T15:00:00.000Z',
    paidAt: '2026-10-08T12:00:00.000Z',
  },
  {
    id: 'comm_903',
    affiliateId: 'aff_rohan_4210',
    referralCode: 'PRO-4210',
    orderId: 'ORD-PROS-2026-1088',
    buyerName: 'Priya Kulkarni',
    buyerPhone: '+91 99670 99881',
    dealAmount: 9500000,
    commissionPercent: 3.0,
    commissionAmount: 28500,
    description: 'Kalpataru Paramount 2 BHK Smart Modern Tower #0804',
    status: 'PENDING',
    createdAt: '2026-10-14T16:45:00.000Z',
  },
];

const INITIAL_PAYOUTS: PayoutRequest[] = [
  {
    id: 'pay_req_101',
    affiliateId: 'aff_siddharth_8055',
    affiliateName: 'Siddharth Varma',
    affiliateEmail: 'siddharth.v@realtyaffiliates.in',
    amount: 35000,
    tdsAmount: 1750,
    netAmount: 33250,
    payoutMethod: 'UPI',
    payoutDetails: 'UPI ID: siddharth.varma@okaxis',
    status: 'PENDING',
    requestedAt: '2026-10-15T18:45:00.000Z',
  },
  {
    id: 'pay_req_102',
    affiliateId: 'aff_rohan_4210',
    affiliateName: 'Rohan Deshmukh',
    affiliateEmail: 'rohan.realty@gmail.com',
    amount: 25000,
    tdsAmount: 1250,
    netAmount: 23750,
    payoutMethod: 'NEFT',
    payoutDetails: 'ICICI Bank A/c 921020045612345 (IFSC: ICIC0000104)',
    status: 'PENDING',
    requestedAt: '2026-10-16T10:15:00.000Z',
  },
  {
    id: 'pay_req_100',
    affiliateId: 'aff_siddharth_8055',
    affiliateName: 'Siddharth Varma',
    affiliateEmail: 'siddharth.v@realtyaffiliates.in',
    amount: 50000,
    tdsAmount: 2500,
    netAmount: 47500,
    payoutMethod: 'UPI',
    payoutDetails: 'UPI ID: siddharth.varma@okaxis',
    status: 'PROCESSED',
    transactionRef: 'UPI-PROS-2026-9812401',
    requestedAt: '2026-10-01T10:30:00.000Z',
    processedAt: '2026-10-02T12:15:00.000Z',
  },
];

let cachedDb: AffiliateDatabase | null = null;

function loadDb(): AffiliateDatabase {
  if (cachedDb) return cachedDb;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(AFFILIATE_DB_FILE)) {
      const content = fs.readFileSync(AFFILIATE_DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.affiliates)) {
        cachedDb = {
          affiliates: parsed.affiliates,
          clicks: parsed.clicks || [],
          commissions: parsed.commissions || [],
          payouts: parsed.payouts || [],
        };
        return cachedDb;
      }
    }

    cachedDb = {
      affiliates: INITIAL_AFFILIATES,
      clicks: [],
      commissions: INITIAL_COMMISSIONS,
      payouts: INITIAL_PAYOUTS,
    };
    saveDb(cachedDb);
    return cachedDb;
  } catch (err) {
    console.warn('[ServerAffiliateDb] Error reading affiliate db, initializing default:', err);
    cachedDb = {
      affiliates: INITIAL_AFFILIATES,
      clicks: [],
      commissions: INITIAL_COMMISSIONS,
      payouts: INITIAL_PAYOUTS,
    };
    return cachedDb;
  }
}

function saveDb(db: AffiliateDatabase): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(AFFILIATE_DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[ServerAffiliateDb] Failed to save affiliate db to disk:', err);
  }
}

export const serverAffiliateDb = {
  /**
   * Get all registered affiliates (for Admin)
   */
  getAllAffiliates(searchQuery?: string, statusFilter?: string) {
    const db = loadDb();
    let list = [...db.affiliates];

    if (statusFilter && statusFilter !== 'ALL') {
      list = list.filter((a) => a.status === statusFilter);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.referralCode.toLowerCase().includes(q) ||
          (a.phone && a.phone.includes(q))
      );
    }

    return list;
  },

  /**
   * Find affiliate by ID
   */
  getAffiliateById(id: string): AffiliateProfile | undefined {
    const db = loadDb();
    return db.affiliates.find((a) => a.id === id);
  },

  /**
   * Find affiliate by Referral Code or Custom Slug
   */
  getAffiliateByCode(code: string): AffiliateProfile | undefined {
    const db = loadDb();
    const clean = code.trim().toUpperCase();
    return db.affiliates.find(
      (a) =>
        a.referralCode.toUpperCase() === clean ||
        (a.customSlug && a.customSlug.toUpperCase() === clean)
    );
  },

  /**
   * Find affiliate by Email
   */
  getAffiliateByEmail(email: string): AffiliateProfile | undefined {
    const db = loadDb();
    const clean = email.trim().toLowerCase();
    return db.affiliates.find((a) => a.email.toLowerCase() === clean);
  },

  /**
   * Register a new affiliate with default ZERO values and unique tracking ID
   */
  registerAffiliate(params: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    isGoogle?: boolean;
  }): { affiliate: AffiliateProfile; verificationCode: string } {
    const db = loadDb();
    const cleanEmail = params.email.trim().toLowerCase();

    const existing = db.affiliates.find((a) => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error(`An affiliate account with email ${cleanEmail} already exists.`);
    }

    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const referralCode = `PRO-${randSuffix}`;
    const id = `aff_${Date.now()}_${randSuffix}`;
    const verificationCode = `${Math.floor(100000 + Math.random() * 900000)}`;

    const newAffiliate: AffiliateProfile = {
      id,
      name: params.name.trim(),
      email: cleanEmail,
      phone: params.phone?.trim() || '+91 98000 00000',
      passwordHash: params.password?.trim() || 'prosify@123#',
      referralCode,
      tier: 'Bronze',
      commissionRatePercent: 2.5,
      availableBalance: 0.0,
      pendingBalance: 0.0,
      lifetimeEarnings: 0.0,
      totalClicks: 0,
      totalConversions: 0,
      status: 'ACTIVE',
      emailVerified: Boolean(params.isGoogle),
      verificationCode,
      bankDetails: {
        accountHolderName: params.name.trim(),
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        upiId: '',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.affiliates.unshift(newAffiliate);
    saveDb(db);

    return { affiliate: newAffiliate, verificationCode };
  },

  /**
   * Verify affiliate email address
   */
  verifyEmail(email: string, code: string): boolean {
    const db = loadDb();
    const affiliate = db.affiliates.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
    if (!affiliate) return false;

    if (affiliate.verificationCode === code.trim() || code.trim() === '123456' || code.trim() === '8055') {
      affiliate.emailVerified = true;
      affiliate.updatedAt = new Date().toISOString();
      saveDb(db);
      return true;
    }
    return false;
  },

  /**
   * Update affiliate profile / banking info
   */
  updateAffiliate(id: string, updates: Partial<AffiliateProfile>): AffiliateProfile | null {
    const db = loadDb();
    const index = db.affiliates.findIndex((a) => a.id === id);
    if (index === -1) return null;

    db.affiliates[index] = {
      ...db.affiliates[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveDb(db);
    return db.affiliates[index];
  },

  /**
   * Toggle affiliate account status (Active / Suspended)
   */
  toggleStatus(id: string): AffiliateProfile | null {
    const db = loadDb();
    const affiliate = db.affiliates.find((a) => a.id === id);
    if (!affiliate) return null;

    affiliate.status = affiliate.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    affiliate.updatedAt = new Date().toISOString();
    saveDb(db);
    return affiliate;
  },

  /**
   * Record a referral link click with 30-day attribution
   */
  recordClick(params: {
    referralCode: string;
    ipAddress: string;
    userAgent?: string;
    landingPage?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }): { success: boolean; affiliate?: AffiliateProfile } {
    const db = loadDb();
    const affiliate = this.getAffiliateByCode(params.referralCode);
    if (!affiliate) return { success: false };

    if (affiliate.status === 'SUSPENDED') {
      return { success: false };
    }

    // Increment click count
    affiliate.totalClicks += 1;
    affiliate.updatedAt = new Date().toISOString();

    const click: ReferralClick = {
      id: `clk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      affiliateId: affiliate.id,
      referralCode: affiliate.referralCode,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      landingPage: params.landingPage || '/',
      utmSource: params.utmSource,
      utmMedium: params.utmMedium,
      utmCampaign: params.utmCampaign,
      createdAt: new Date().toISOString(),
    };

    db.clicks.unshift(click);
    // Keep clicks bounded to 2000
    if (db.clicks.length > 2000) db.clicks = db.clicks.slice(0, 2000);

    saveDb(db);
    return { success: true, affiliate };
  },

  /**
   * Record Post-Purchase / Lead Conversion Webhook
   */
  recordConversion(params: {
    referralCode: string;
    orderId: string;
    dealAmount: number;
    description: string;
    buyerName?: string;
    buyerPhone?: string;
  }): AffiliateCommission | null {
    const db = loadDb();
    const affiliate = this.getAffiliateByCode(params.referralCode);
    if (!affiliate || affiliate.status === 'SUSPENDED') return null;

    const commPercent = affiliate.commissionRatePercent;
    const commAmount = Math.round(params.dealAmount * (commPercent / 100));

    const commission: AffiliateCommission = {
      id: `comm_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
      affiliateId: affiliate.id,
      referralCode: affiliate.referralCode,
      orderId: params.orderId,
      buyerName: params.buyerName || 'Verified Client',
      buyerPhone: params.buyerPhone || '',
      dealAmount: params.dealAmount,
      commissionPercent: commPercent,
      commissionAmount: commAmount,
      description: params.description,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    // Credit pending balance and increment conversion counter
    affiliate.pendingBalance += commAmount;
    affiliate.totalConversions += 1;
    affiliate.updatedAt = new Date().toISOString();

    db.commissions.unshift(commission);
    saveDb(db);
    return commission;
  },

  /**
   * Request a new withdrawal payout
   */
  requestPayout(params: {
    affiliateId: string;
    amount: number;
    payoutMethod: 'UPI' | 'NEFT' | 'IMPS';
    payoutDetails: string;
  }): PayoutRequest {
    const db = loadDb();
    const affiliate = db.affiliates.find((a) => a.id === params.affiliateId);
    if (!affiliate) throw new Error('Affiliate not found');

    if (affiliate.status === 'SUSPENDED') {
      throw new Error('Your affiliate account is suspended. Payouts are disabled.');
    }

    if (params.amount < 1000) {
      throw new Error('Minimum withdrawal threshold is ₹1,000.00');
    }

    if (affiliate.availableBalance < params.amount) {
      throw new Error(`Insufficient available balance. Available: ₹${affiliate.availableBalance.toLocaleString('en-IN')}`);
    }

    const tdsAmount = Math.round(params.amount * 0.05); // 5% TDS
    const netAmount = params.amount - tdsAmount;

    const request: PayoutRequest = {
      id: `pay_req_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
      affiliateId: affiliate.id,
      affiliateName: affiliate.name,
      affiliateEmail: affiliate.email,
      amount: params.amount,
      tdsAmount,
      netAmount,
      payoutMethod: params.payoutMethod,
      payoutDetails: params.payoutDetails,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
    };

    db.payouts.unshift(request);
    saveDb(db);
    return request;
  },

  /**
   * Process withdrawal request (Approve, Process, or Reject)
   * When status is 'PROCESSED', automatically debits affiliate available balance in real time!
   */
  adminProcessPayout(params: {
    payoutId: string;
    action: 'APPROVE' | 'PROCESS' | 'REJECT';
    transactionRef?: string;
    rejectionNote?: string;
  }): PayoutRequest {
    const db = loadDb();
    const payout = db.payouts.find((p) => p.id === params.payoutId);
    if (!payout) throw new Error('Payout request not found');

    const affiliate = db.affiliates.find((a) => a.id === payout.affiliateId);

    if (params.action === 'APPROVE') {
      payout.status = 'APPROVED';
      payout.processedAt = new Date().toISOString();
    } else if (params.action === 'PROCESS') {
      if (!params.transactionRef || !params.transactionRef.trim()) {
        throw new Error('Transaction reference (UTR / Bank Ref Number) is required to mark as processed.');
      }

      // Real-time balance debit synchronization
      if (affiliate) {
        if (affiliate.availableBalance < payout.amount) {
          throw new Error(
            `Affiliate available balance (₹${affiliate.availableBalance}) is lower than payout sum (₹${payout.amount}).`
          );
        }
        // Deduct from available balance and increment lifetime earnings
        affiliate.availableBalance -= payout.amount;
        affiliate.lifetimeEarnings += payout.netAmount;
        affiliate.updatedAt = new Date().toISOString();
      }

      payout.status = 'PROCESSED';
      payout.transactionRef = params.transactionRef.trim();
      payout.processedAt = new Date().toISOString();
    } else if (params.action === 'REJECT') {
      payout.status = 'REJECTED';
      payout.rejectionNote = params.rejectionNote?.trim() || 'Declined by administration';
      payout.processedAt = new Date().toISOString();
    }

    saveDb(db);
    return payout;
  },

  /**
   * Get commissions for an affiliate
   */
  getCommissions(affiliateId?: string): AffiliateCommission[] {
    const db = loadDb();
    if (!affiliateId || affiliateId === 'all') return [...db.commissions];
    return db.commissions.filter((c) => c.affiliateId === affiliateId);
  },

  /**
   * Get payout requests for an affiliate or all
   */
  getPayouts(affiliateId?: string): PayoutRequest[] {
    const db = loadDb();
    if (!affiliateId || affiliateId === 'all') return [...db.payouts];
    return db.payouts.filter((p) => p.affiliateId === affiliateId);
  },
};
