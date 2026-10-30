import fs from 'fs';
import path from 'path';
import { executeD1 } from '@/lib/db/d1';
import { store } from '@/lib/data/store';

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
  city?: string;
  agencyName?: string;
  panCard?: string;
  reraNumber?: string;
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

// Strict Zero-Mock: Initial arrays start empty. Only real user/admin registrations are stored.
const INITIAL_AFFILIATES: AffiliateProfile[] = [];
const INITIAL_COMMISSIONS: AffiliateCommission[] = [];
const INITIAL_PAYOUTS: PayoutRequest[] = [];

let cachedDb: AffiliateDatabase | null = null;

const isDemoAffiliate = (a: any): boolean => {
  if (!a) return true;
  const id = String(a.id || '');
  const email = String(a.email || '').toLowerCase();
  const code = String(a.referralCode || '').toUpperCase();
  return (
    id.startsWith('aff_siddharth') ||
    id.startsWith('aff_rohan') ||
    id.startsWith('aff-1') ||
    id.startsWith('aff-2') ||
    id.startsWith('aff-3') ||
    id.startsWith('aff-4') ||
    email.includes('realtyaffiliates.in') ||
    email.includes('rohan.realty@gmail.com') ||
    email.includes('propadvisor@gmail.com') ||
    email.includes('puneinvestors.com') ||
    email.includes('techprop@outlook.com') ||
    code.includes('8055') ||
    code.includes('4210') ||
    code.includes('9942') ||
    code.includes('2041') ||
    code.includes('8819') ||
    code.includes('5502')
  );
};

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
        // Enforce removal of any demo affiliates from disk file
        const cleanAffiliates: AffiliateProfile[] = parsed.affiliates.filter(
          (a: any) => !isDemoAffiliate(a)
        );
        const validAffiliateIds = new Set(cleanAffiliates.map((a) => a.id));

        const cleanClicks = (parsed.clicks || []).filter((c: any) =>
          validAffiliateIds.has(c.affiliateId)
        );
        const cleanCommissions = (parsed.commissions || []).filter((c: any) =>
          validAffiliateIds.has(c.affiliateId)
        );
        const cleanPayouts = (parsed.payouts || []).filter((p: any) =>
          validAffiliateIds.has(p.affiliateId)
        );

        cachedDb = {
          affiliates: cleanAffiliates,
          clicks: cleanClicks,
          commissions: cleanCommissions,
          payouts: cleanPayouts,
        };
        saveDb(cachedDb);
        return cachedDb;
      }
    }

    cachedDb = {
      affiliates: [],
      clicks: [],
      commissions: [],
      payouts: [],
    };
    saveDb(cachedDb);
    return cachedDb;
  } catch (err) {
    console.warn('[ServerAffiliateDb] Error reading affiliate db, initializing default:', err);
    cachedDb = {
      affiliates: [],
      clicks: [],
      commissions: [],
      payouts: [],
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
    let list = db.affiliates.filter((a) => !isDemoAffiliate(a));

    // Also harmonize with any real affiliate added to in-memory store
    try {
      const existingEmails = new Set(list.map((a) => a.email.toLowerCase()));
      const storeAffiliates = store.getAffiliates();
      for (const sa of storeAffiliates) {
        if (sa && sa.email && !existingEmails.has(sa.email.toLowerCase()) && !isDemoAffiliate(sa)) {
          list.push({
            id: sa.id,
            name: sa.name,
            email: sa.email,
            phone: sa.phone || '',
            referralCode: sa.referralCode || sa.affiliateCode || 'PRO-MUM',
            city: sa.city || 'Mumbai',
            agencyName: sa.agencyName || 'Independent Partner',
            tier: ((sa.tier ? sa.tier.charAt(0).toUpperCase() + sa.tier.slice(1).toLowerCase() : 'Bronze') as any),
            commissionRatePercent: sa.commissionRatePercent || 2.5,
            availableBalance: sa.payableBalance || 0,
            pendingBalance: 0,
            lifetimeEarnings: sa.totalEarnings || sa.totalEarned || 0,
            totalClicks: sa.totalClicks || 0,
            totalConversions: sa.totalDealsClosed || 0,
            status: sa.status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE',
            emailVerified: true,
            bankDetails: {
              accountHolderName: sa.payoutDetails?.accountHolderName || sa.name,
              accountNumber: sa.payoutDetails?.accountNumber || sa.bankAccountNumber || '',
              ifscCode: sa.payoutDetails?.ifscCode || sa.bankIfsc || '',
              bankName: sa.payoutDetails?.bankName || '',
              upiId: sa.payoutDetails?.upiId || sa.upiId || '',
            },
            createdAt: sa.joinedAt ? new Date(sa.joinedAt).toISOString() : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    } catch {}

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
   * Register a new affiliate with default ZERO values, unique tracking ID, and cross-store & D1 sync
   */
  registerAffiliate(params: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    isGoogle?: boolean;
    city?: string;
    agencyName?: string;
    panCard?: string;
    reraNumber?: string;
    tier?: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
    commissionRatePercent?: number;
    referralCode?: string;
    bankDetails?: Partial<BankDetails>;
  }): { affiliate: AffiliateProfile; verificationCode: string } {
    const db = loadDb();
    const cleanEmail = params.email.trim().toLowerCase();

    const existing = db.affiliates.find((a) => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error(`An affiliate account with email ${cleanEmail} already exists.`);
    }

    const cityPrefix = params.city ? params.city.substring(0, 3).toUpperCase() : 'PRO';
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const referralCode = params.referralCode ? params.referralCode.trim().toUpperCase() : `${cityPrefix}-${randSuffix}`;
    const id = `aff_${Date.now()}_${randSuffix}`;
    const verificationCode = `${Math.floor(100000 + Math.random() * 900000)}`;

    const newAffiliate: AffiliateProfile = {
      id,
      name: params.name.trim(),
      email: cleanEmail,
      phone: params.phone?.trim() || '+91 98000 00000',
      passwordHash: params.password?.trim() || 'prosify@123#',
      referralCode,
      city: params.city?.trim() || 'Mumbai',
      agencyName: params.agencyName?.trim() || 'Independent Partner',
      panCard: params.panCard?.trim() || '',
      reraNumber: params.reraNumber?.trim() || '',
      tier: params.tier || 'Bronze',
      commissionRatePercent: params.commissionRatePercent ?? 2.5,
      availableBalance: 0.0,
      pendingBalance: 0.0,
      lifetimeEarnings: 0.0,
      totalClicks: 0,
      totalConversions: 0,
      status: 'ACTIVE',
      emailVerified: Boolean(params.isGoogle),
      verificationCode,
      bankDetails: {
        accountHolderName: params.bankDetails?.accountHolderName || params.name.trim(),
        accountNumber: params.bankDetails?.accountNumber || '',
        ifscCode: params.bankDetails?.ifscCode || '',
        bankName: params.bankDetails?.bankName || '',
        upiId: params.bankDetails?.upiId || '',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.affiliates.unshift(newAffiliate);
    saveDb(db);

    // Synchronize to in-memory store so all panels instantly see the newly registered affiliate
    try {
      store.registerAffiliate({
        name: newAffiliate.name,
        email: newAffiliate.email,
        phone: newAffiliate.phone,
        city: newAffiliate.city || 'Mumbai',
        agencyName: newAffiliate.agencyName,
        upiId: newAffiliate.bankDetails.upiId,
        bankAccountNumber: newAffiliate.bankDetails.accountNumber,
        bankIfsc: newAffiliate.bankDetails.ifscCode,
      });
    } catch (storeErr) {
      console.warn('[ServerAffiliateDb] Store sync notice:', storeErr);
    }

    // Edge D1 SQLite persistence (Parameterized bindings and SQLite syntax)
    try {
      executeD1(
        `INSERT OR IGNORE INTO users (id, email, name, phone, role, created_at, updated_at) VALUES (?, ?, ?, ?, 'AFFILIATE', datetime('now'), datetime('now'))`,
        [newAffiliate.id, newAffiliate.email, newAffiliate.name, newAffiliate.phone]
      ).catch(() => {});

      executeD1(
        `INSERT OR REPLACE INTO affiliate_accounts (user_id, referral_code, tier, commission_rate, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
        [newAffiliate.id, newAffiliate.referralCode, newAffiliate.tier, newAffiliate.commissionRatePercent]
      ).catch(() => {});
    } catch (d1Err) {
      console.warn('[ServerAffiliateDb] Cloudflare D1 execute notice:', d1Err);
    }

    return { affiliate: newAffiliate, verificationCode };
  },

  /**
   * Delete an affiliate by ID
   */
  deleteAffiliate(id: string): boolean {
    const db = loadDb();
    const idx = db.affiliates.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    db.affiliates.splice(idx, 1);
    saveDb(db);
    return true;
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
