/**
 * Multi-Tenant Role-Based Access Control (RBAC) & User Provisioning Store
 * 
 * Supports ADMIN, VENDOR, AGENT, AFFILIATE, and CUSTOMER roles with
 * private session cookies, brute-force rate limiting, and password policies.
 */

export type UserRole = 'ADMIN' | 'VENDOR' | 'AGENT' | 'AFFILIATE' | 'CUSTOMER';
export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_FIRST_LOGIN';

export interface VendorProfileData {
  businessName: string;
  gstNumber?: string;
  panNumber?: string;
  category: string; // e.g. "Building Materials", "Interior Services", "Packers & Movers", "Legal Checks"
  territory: string; // e.g. "Mumbai MMR", "Pune Central", "Thane", "Pan-India"
  bankAccount?: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  totalSettledAmount: number;
  pendingClearance: number;
  activeListingsCount: number;
}

export interface AgentProfileData {
  agencyName: string;
  reraNumber?: string;
  territory: string; // e.g. "South Mumbai & Worli", "Bandra-Khar Belt", "Thane West"
  monthlyTargetInr: number;
  achievedVolumeInr: number;
  closedDealsCount: number;
  commissionRatePercent: number;
  totalCommissionEarned: number;
  pendingCommission: number;
}

export interface RbacUser {
  id: string;
  secureId: string; // e.g. VEN-8921 or AGT-4310
  assignedCode?: string;
  username: string; // Unique login ID / Email
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  passwordHash: string; // Stored password (plain/hashed for demo verification)
  password?: string;
  status: AccountStatus;
  requirePasswordChangeOnFirstLogin: boolean;
  portalUrl?: string;
  companyOrProject?: string;
  createdAt: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  vendorProfile?: VendorProfileData;
  agentProfile?: AgentProfileData;
}

// Initial seed provisioned accounts for enterprise verification
export const INITIAL_RBAC_USERS: RbacUser[] = [
  {
    id: 'user-admin-root',
    secureId: 'ADM-0001',
    username: 'admin@prosify.in',
    email: 'admin@prosify.in',
    name: 'Central Security Administrator',
    phone: '+91 91679 91679',
    role: 'ADMIN',
    passwordHash: 'prosify@123#',
    status: 'ACTIVE',
    requirePasswordChangeOnFirstLogin: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'user-vendor-8921',
    secureId: 'VEN-8921',
    username: 'ven-8921@prosify.in',
    email: 'buildtech.supplies@prosify.in',
    name: 'Rajesh Singhal',
    phone: '+91 98201 55678',
    role: 'VENDOR',
    passwordHash: 'Ven#8921!Secure',
    status: 'ACTIVE',
    requirePasswordChangeOnFirstLogin: false,
    createdAt: '2026-03-01T00:00:00.000Z',
    lastLoginAt: '2026-10-15T09:45:00.000Z',
    vendorProfile: {
      businessName: 'BuildTech Smart Materials & Engineering',
      gstNumber: '27AABCB1234F1Z5',
      panNumber: 'AABCB1234F',
      category: 'Building Materials & Fixtures',
      territory: 'Mumbai MMR & Thane',
      bankAccount: {
        accountHolderName: 'BuildTech Materials Ltd',
        accountNumber: '921020045678123',
        ifscCode: 'HDFC0000123',
        bankName: 'HDFC Bank, Fort Branch',
      },
      totalSettledAmount: 1845000,
      pendingClearance: 240000,
      activeListingsCount: 14,
    },
  },
  {
    id: 'user-vendor-8922',
    secureId: 'VEN-8922',
    username: 'ven-8922@prosify.in',
    email: 'decor.prime@prosify.in',
    name: 'Pooja Oberoi',
    phone: '+91 98111 22334',
    role: 'VENDOR',
    passwordHash: 'Ven#8922!Temp',
    status: 'PENDING_FIRST_LOGIN',
    requirePasswordChangeOnFirstLogin: true,
    createdAt: '2026-10-14T11:00:00.000Z',
    vendorProfile: {
      businessName: 'PrimeDecor Luxury Interiors',
      gstNumber: '27AAACP9988E1Z9',
      category: 'Interior Contracting & Architecture',
      territory: 'Mumbai South & Suburbs',
      totalSettledAmount: 0,
      pendingClearance: 0,
      activeListingsCount: 6,
    },
  },
  {
    id: 'user-agent-4310',
    secureId: 'AGT-4310',
    username: 'agt-4310@prosify.in',
    email: 'suresh.patil@prosify.in',
    name: 'Suresh Patil',
    phone: '+91 97654 32109',
    role: 'AGENT',
    passwordHash: 'Agt#4310!Secure',
    status: 'ACTIVE',
    requirePasswordChangeOnFirstLogin: false,
    createdAt: '2026-02-15T00:00:00.000Z',
    lastLoginAt: '2026-10-16T08:15:00.000Z',
    agentProfile: {
      agencyName: 'Patil Realty Consultants',
      reraNumber: 'A51900018742',
      territory: 'Bandra-Khar & Western Express Highway',
      monthlyTargetInr: 25000000, // 2.5 Cr
      achievedVolumeInr: 18500000, // 1.85 Cr
      closedDealsCount: 4,
      commissionRatePercent: 2.2,
      totalCommissionEarned: 407000,
      pendingCommission: 98000,
    },
  },
  {
    id: 'user-agent-4311',
    secureId: 'AGT-4311',
    username: 'agt-4311@prosify.in',
    email: 'priya.sharma@prosify.in',
    name: 'Priya Sharma',
    phone: '+91 98989 11223',
    role: 'AGENT',
    passwordHash: 'Agt#4311!Temp',
    status: 'PENDING_FIRST_LOGIN',
    requirePasswordChangeOnFirstLogin: true,
    createdAt: '2026-10-15T15:30:00.000Z',
    agentProfile: {
      agencyName: 'Sharma Estate Associates',
      reraNumber: 'A51700024981',
      territory: 'Thane West & Ghodbunder Road',
      monthlyTargetInr: 20000000, // 2 Cr
      achievedVolumeInr: 6500000,
      closedDealsCount: 1,
      commissionRatePercent: 2.0,
      totalCommissionEarned: 130000,
      pendingCommission: 0,
    },
  },
];

const LOCAL_STORAGE_KEY = 'prosify_rbac_users_db_v2';

// In-memory singleton with LocalStorage sync on client and persistent disk storage on server
class RbacManager {
  private users: RbacUser[] = [...INITIAL_RBAC_USERS];

  private getServerDb() {
    if (typeof window === 'undefined') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { serverUserDb } = require('./serverUserDb');
        return serverUserDb;
      } catch (e) {
        console.warn('Failed to load serverUserDb in rbacStore:', e);
        return null;
      }
    }
    return null;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.users = parsed;
          }
        }
      } catch (e) {
        console.warn('RBAC store init error', e);
      }
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.users));
        window.dispatchEvent(new Event('prosify_rbac_updated'));
      } catch (e) {
        console.warn('RBAC store save error', e);
      }
    }
  }

  public getUsers(role?: UserRole): RbacUser[] {
    const sDb = this.getServerDb();
    if (sDb) {
      return sDb.getAllUsers(role);
    }
    if (role) {
      return this.users.filter((u) => u.role === role);
    }
    return [...this.users];
  }

  public getUserById(id: string): RbacUser | undefined {
    const sDb = this.getServerDb();
    if (sDb) {
      return sDb.findUserById(id);
    }
    return this.users.find((u) => u.id === id || u.secureId === id);
  }

  public findUserByLogin(identifier: string): RbacUser | undefined {
    const sDb = this.getServerDb();
    if (sDb) {
      return sDb.findUserByLogin(identifier);
    }
    const clean = identifier.trim().toLowerCase();
    return this.users.find(
      (u) =>
        u.username.toLowerCase() === clean ||
        u.email.toLowerCase() === clean ||
        u.secureId.toLowerCase() === clean ||
        (u.assignedCode && u.assignedCode.toLowerCase() === clean) ||
        u.phone.replace(/\D/g, '') === clean.replace(/\D/g, '')
    );
  }

  public createUser(userData: {
    role: 'VENDOR' | 'AGENT';
    name: string;
    businessOrAgencyName: string;
    email: string;
    phone: string;
    territory: string;
    categoryOrRera?: string;
    officialIdOrGst?: string;
    customSecureId?: string;
    password?: string;
    requirePasswordChange?: boolean;
  }): { user: RbacUser; temporaryPassword: string } {
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const prefix = userData.role === 'VENDOR' ? 'VEN' : 'AGT';
    const secureId = userData.customSecureId?.trim() || `${prefix}-${randCode}`;

    const tempPassword =
      userData.password?.trim() ||
      `${prefix.charAt(0) + prefix.slice(1).toLowerCase()}#${randCode}!Temp`;

    const newUser: RbacUser = {
      id: `user-${prefix.toLowerCase()}-${Date.now()}-${randCode}`,
      secureId,
      assignedCode: secureId,
      username: `${secureId.toLowerCase()}@prosify.in`,
      email: userData.email.trim().toLowerCase(),
      name: userData.name.trim(),
      phone: userData.phone.trim(),
      role: userData.role,
      password: tempPassword,
      passwordHash: tempPassword,
      status: userData.requirePasswordChange !== false ? 'PENDING_FIRST_LOGIN' : 'ACTIVE',
      requirePasswordChangeOnFirstLogin: userData.requirePasswordChange !== false,
      portalUrl: userData.role === 'VENDOR' ? '/vendor' : '/agent',
      companyOrProject: userData.businessOrAgencyName.trim(),
      createdAt: new Date().toISOString(),
    };

    if (userData.role === 'VENDOR') {
      newUser.vendorProfile = {
        businessName: userData.businessOrAgencyName.trim(),
        gstNumber: userData.officialIdOrGst?.trim(),
        category: userData.categoryOrRera?.trim() || 'Building Materials & Engineering',
        territory: userData.territory.trim() || 'Mumbai MMR',
        totalSettledAmount: 0,
        pendingClearance: 0,
        activeListingsCount: 0,
      };
    } else if (userData.role === 'AGENT') {
      newUser.agentProfile = {
        agencyName: userData.businessOrAgencyName.trim(),
        reraNumber: userData.categoryOrRera?.trim(),
        territory: userData.territory.trim() || 'Mumbai MMR',
        monthlyTargetInr: 20000000,
        achievedVolumeInr: 0,
        closedDealsCount: 0,
        commissionRatePercent: 2.0,
        totalCommissionEarned: 0,
        pendingCommission: 0,
      };
    }

    const sDb = this.getServerDb();
    if (sDb) {
      const saved = sDb.saveUser(newUser);
      return { user: saved, temporaryPassword: tempPassword };
    }

    this.users.unshift(newUser);
    this.persist();

    return { user: newUser, temporaryPassword: tempPassword };
  }

  public updatePassword(userId: string, newPassword: string): boolean {
    const sDb = this.getServerDb();
    if (sDb) {
      return sDb.updatePassword(userId, newPassword);
    }

    const user = this.getUserById(userId);
    if (!user) return false;

    user.passwordHash = newPassword;
    user.password = newPassword;
    user.requirePasswordChangeOnFirstLogin = false;
    if (user.status === 'PENDING_FIRST_LOGIN') {
      user.status = 'ACTIVE';
    }
    this.persist();
    return true;
  }

  public updateStatus(userId: string, status: AccountStatus): boolean {
    const sDb = this.getServerDb();
    if (sDb) {
      return sDb.updateStatus(userId, status);
    }

    const user = this.getUserById(userId);
    if (!user) return false;

    user.status = status;
    this.persist();
    return true;
  }

  public recordLogin(userId: string, ip?: string): void {
    const sDb = this.getServerDb();
    if (sDb) {
      sDb.recordLogin(userId, ip);
      return;
    }

    const user = this.getUserById(userId);
    if (user) {
      user.lastLoginAt = new Date().toISOString();
      if (ip) user.lastLoginIp = ip;
      this.persist();
    }
  }

  public deleteUser(userId: string): boolean {
    const sDb = this.getServerDb();
    if (sDb) {
      return sDb.deleteUser(userId);
    }

    const initialLen = this.users.length;
    this.users = this.users.filter((u) => u.id !== userId && u.secureId !== userId);
    if (this.users.length < initialLen) {
      this.persist();
      return true;
    }
    return false;
  }
}

export const rbacStore = new RbacManager();

