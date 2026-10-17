import fs from 'fs';
import path from 'path';
import { RbacUser, UserRole, AccountStatus, VendorProfileData, AgentProfileData } from './rbacStore';

const DATA_DIR = path.join(process.cwd(), 'data');
const UNIFIED_USERS_FILE = path.join(DATA_DIR, 'unified_users.json');
const LEGACY_PORTAL_USERS_FILE = path.join(DATA_DIR, 'cloud_portal_users.json');

// Standard default accounts for enterprise demonstration and testing
export const DEFAULT_UNIFIED_USERS: RbacUser[] = [
  {
    id: 'user-admin-root',
    secureId: 'ADM-0001',
    assignedCode: 'ADM-001',
    username: 'admin@prosify.in',
    email: 'admin@prosify.in',
    name: 'Prosify Central Security Administrator',
    phone: '+91 91679 91679',
    role: 'ADMIN',
    passwordHash: 'prosify@123#',
    password: 'prosify@123#',
    status: 'ACTIVE',
    requirePasswordChangeOnFirstLogin: false,
    portalUrl: '/admin',
    companyOrProject: 'Prosify Technologies HQ',
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLoginAt: '2026-10-16T12:00:00.000Z',
  },
  {
    id: 'user-vendor-8921',
    secureId: 'VEN-8921',
    assignedCode: 'VEN-8921',
    username: 'ven-8921@prosify.in',
    email: 'buildtech.supplies@prosify.in',
    name: 'Rajesh Singhal',
    phone: '+91 98201 55678',
    role: 'VENDOR',
    passwordHash: 'Ven#8921!Secure',
    password: 'Ven#8921!Secure',
    status: 'ACTIVE',
    requirePasswordChangeOnFirstLogin: false,
    portalUrl: '/vendor',
    companyOrProject: 'BuildTech Smart Materials & Engineering',
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
    id: 'user-vendor-1',
    secureId: 'VND-402',
    assignedCode: 'VND-402',
    username: 'vendor@eni.com',
    email: 'vendor@eni.com',
    name: 'BuildTech Smart Materials & Engineering',
    phone: '+91 98201 55678',
    role: 'VENDOR',
    passwordHash: 'password123',
    password: 'password123',
    status: 'ACTIVE',
    requirePasswordChangeOnFirstLogin: false,
    portalUrl: '/vendor',
    companyOrProject: 'BuildTech Materials Ltd (GSTIN: 27AABCB1234F1Z5)',
    createdAt: '2026-02-15T00:00:00.000Z',
    lastLoginAt: '2026-10-15T14:20:00.000Z',
    vendorProfile: {
      businessName: 'BuildTech Materials Ltd',
      gstNumber: '27AABCB1234F1Z5',
      category: 'Building Materials & Engineering',
      territory: 'Mumbai MMR',
      totalSettledAmount: 1845000,
      pendingClearance: 240000,
      activeListingsCount: 14,
    },
  },
  {
    id: 'user-vendor-8922',
    secureId: 'VEN-8922',
    assignedCode: 'VEN-8922',
    username: 'ven-8922@prosify.in',
    email: 'decor.prime@prosify.in',
    name: 'Pooja Oberoi',
    phone: '+91 98111 22334',
    role: 'VENDOR',
    passwordHash: 'Ven#8922!Temp',
    password: 'Ven#8922!Temp',
    status: 'PENDING_FIRST_LOGIN',
    requirePasswordChangeOnFirstLogin: true,
    portalUrl: '/vendor',
    companyOrProject: 'PrimeDecor Luxury Interiors',
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
    assignedCode: 'AGT-4310',
    username: 'agt-4310@prosify.in',
    email: 'suresh.patil@prosify.in',
    name: 'Suresh Patil',
    phone: '+91 97654 32109',
    role: 'AGENT',
    passwordHash: 'Agt#4310!Secure',
    password: 'Agt#4310!Secure',
    status: 'ACTIVE',
    requirePasswordChangeOnFirstLogin: false,
    portalUrl: '/agent',
    companyOrProject: 'Patil Realty Consultants (RERA: A51900018742)',
    createdAt: '2026-02-15T00:00:00.000Z',
    lastLoginAt: '2026-10-16T08:15:00.000Z',
    agentProfile: {
      agencyName: 'Patil Realty Consultants',
      reraNumber: 'A51900018742',
      territory: 'Bandra-Khar & Western Express Highway',
      monthlyTargetInr: 25000000,
      achievedVolumeInr: 18500000,
      closedDealsCount: 4,
      commissionRatePercent: 2.2,
      totalCommissionEarned: 407000,
      pendingCommission: 98000,
    },
  },
  {
    id: 'user-agent-1',
    secureId: 'AGT-882',
    assignedCode: 'AGT-882',
    username: 'agent@eni.com',
    email: 'agent@eni.com',
    name: 'Suresh Patil (Senior Channel Partner)',
    phone: '+91 97654 32109',
    role: 'AGENT',
    passwordHash: 'password123',
    password: 'password123',
    status: 'ACTIVE',
    requirePasswordChangeOnFirstLogin: false,
    portalUrl: '/agent',
    companyOrProject: 'Patil Realty Consultants (RERA: A51900018742)',
    createdAt: '2026-03-10T00:00:00.000Z',
    lastLoginAt: '2026-10-16T07:15:00.000Z',
    agentProfile: {
      agencyName: 'Patil Realty Advisory & Channel Partners',
      reraNumber: 'A51900018742',
      territory: 'Mumbai MMR & Pune',
      monthlyTargetInr: 25000000,
      achievedVolumeInr: 18500000,
      closedDealsCount: 4,
      commissionRatePercent: 2.2,
      totalCommissionEarned: 407000,
      pendingCommission: 98000,
    },
  },
  {
    id: 'user-agent-4311',
    secureId: 'AGT-4311',
    assignedCode: 'AGT-4311',
    username: 'agt-4311@prosify.in',
    email: 'priya.sharma@prosify.in',
    name: 'Priya Sharma',
    phone: '+91 98989 11223',
    role: 'AGENT',
    passwordHash: 'Agt#4311!Temp',
    password: 'Agt#4311!Temp',
    status: 'PENDING_FIRST_LOGIN',
    requirePasswordChangeOnFirstLogin: true,
    portalUrl: '/agent',
    companyOrProject: 'Sharma Estate Associates',
    createdAt: '2026-10-15T15:30:00.000Z',
    agentProfile: {
      agencyName: 'Sharma Estate Associates',
      reraNumber: 'A51700024981',
      territory: 'Thane West & Ghodbunder Road',
      monthlyTargetInr: 20000000,
      achievedVolumeInr: 6500000,
      closedDealsCount: 1,
      commissionRatePercent: 2.0,
      totalCommissionEarned: 130000,
      pendingCommission: 0,
    },
  },
  {
    id: 'user-customer-1',
    secureId: 'CUST-1049',
    assignedCode: 'CUST-1049',
    username: 'customer@eni.com',
    email: 'customer@eni.com',
    name: 'Vikram & Ananya Singhania',
    phone: '+91 98200 11223',
    role: 'CUSTOMER',
    passwordHash: 'password123',
    password: 'password123',
    status: 'ACTIVE',
    requirePasswordChangeOnFirstLogin: false,
    portalUrl: '/customer',
    companyOrProject: 'Booking: Lodha Crown Tower A - Unit 1402',
    createdAt: '2026-04-01T00:00:00.000Z',
    lastLoginAt: '2026-10-14T18:45:00.000Z',
  },
];

let inMemoryUsers: RbacUser[] | null = null;

/**
 * Ensure database file exists on disk and load it into cache
 */
function loadUsersFromDisk(): RbacUser[] {
  if (inMemoryUsers) return inMemoryUsers;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(UNIFIED_USERS_FILE)) {
      const data = fs.readFileSync(UNIFIED_USERS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Normalize fields for all loaded users
        inMemoryUsers = parsed.map(normalizeUserFields);
        return inMemoryUsers;
      }
    }

    // Fallback: check legacy cloud_portal_users.json
    if (fs.existsSync(LEGACY_PORTAL_USERS_FILE)) {
      try {
        const legacyData = fs.readFileSync(LEGACY_PORTAL_USERS_FILE, 'utf-8');
        const legacyUsers = JSON.parse(legacyData);
        if (Array.isArray(legacyUsers) && legacyUsers.length > 0) {
          const merged = [...DEFAULT_UNIFIED_USERS];
          for (const lu of legacyUsers) {
            const exists = merged.some(
              (m) =>
                m.id === lu.id ||
                m.username.toLowerCase() === lu.username.toLowerCase() ||
                (lu.assignedCode && m.secureId.toLowerCase() === lu.assignedCode.toLowerCase())
            );
            if (!exists) {
              merged.push(normalizeUserFields(lu));
            }
          }
          inMemoryUsers = merged;
          saveUsersToDisk(inMemoryUsers);
          return inMemoryUsers;
        }
      } catch (e) {
        console.warn('Error reading legacy portal users file:', e);
      }
    }

    // Initialize with defaults and write to disk
    inMemoryUsers = [...DEFAULT_UNIFIED_USERS];
    saveUsersToDisk(inMemoryUsers);
    return inMemoryUsers;
  } catch (err) {
    console.warn('[ServerUserDb] Error loading users from disk, using fallback defaults:', err);
    inMemoryUsers = [...DEFAULT_UNIFIED_USERS];
    return inMemoryUsers;
  }
}

/**
 * Normalizes user record so all credential variants and IDs are populated
 */
function normalizeUserFields(user: any): RbacUser {
  const role = (user.role || 'VENDOR').toUpperCase() as UserRole;
  const secureId = user.secureId || user.assignedCode || (role === 'VENDOR' ? 'VEN-1000' : 'AGT-1000');
  const assignedCode = user.assignedCode || secureId;
  const password = user.password || user.passwordHash || 'Prosify#Secure123!';
  const passwordHash = user.passwordHash || password;
  const username = (user.username || user.email || `${secureId.toLowerCase()}@prosify.in`).toLowerCase();
  const email = (user.email || (username.includes('@') ? username : `${username}@prosify.in`)).toLowerCase();

  return {
    id: user.id || `user-${role.toLowerCase()}-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    secureId,
    assignedCode,
    username,
    email,
    name: user.name || 'Portal Partner',
    phone: user.phone || '+91 98000 00000',
    role,
    passwordHash,
    password,
    status: user.status === 'PENDING' ? 'PENDING_FIRST_LOGIN' : user.status || 'ACTIVE',
    requirePasswordChangeOnFirstLogin:
      user.requirePasswordChangeOnFirstLogin !== undefined
        ? user.requirePasswordChangeOnFirstLogin
        : user.status === 'PENDING_FIRST_LOGIN',
    portalUrl: user.portalUrl || (role === 'VENDOR' ? '/vendor' : role === 'AGENT' ? '/agent' : '/admin'),
    companyOrProject: user.companyOrProject || user.businessOrAgencyName || '',
    createdAt: user.createdAt || new Date().toISOString(),
    lastLoginAt: user.lastLoginAt || user.lastLogin,
    lastLoginIp: user.lastLoginIp,
    vendorProfile: user.vendorProfile,
    agentProfile: user.agentProfile,
  };
}

/**
 * Persists current user list synchronously to disk
 */
function saveUsersToDisk(users: RbacUser[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(UNIFIED_USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    // Also update legacy file so old readers continue to work
    try {
      fs.writeFileSync(LEGACY_PORTAL_USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    } catch {}
  } catch (err) {
    console.error('[ServerUserDb] Failed to write users to disk:', err);
  }
}

export const serverUserDb = {
  /**
   * Retrieves all users, optionally filtered by role
   */
  getAllUsers(role?: string): RbacUser[] {
    const users = loadUsersFromDisk();
    if (!role || role === 'ALL') return [...users];
    const upper = role.toUpperCase();
    return users.filter((u) => u.role.toUpperCase() === upper);
  },

  /**
   * Finds user by internal ID or secureId
   */
  findUserById(id: string): RbacUser | undefined {
    const users = loadUsersFromDisk();
    const clean = id.trim().toLowerCase();
    return users.find(
      (u) =>
        u.id.toLowerCase() === clean ||
        u.secureId.toLowerCase() === clean ||
        (u.assignedCode && u.assignedCode.toLowerCase() === clean)
    );
  },

  /**
   * Universal Login Matcher: finds user by Vendor ID, Agent ID, Email, Phone, or Username
   */
  findUserByLogin(identifier: string): RbacUser | undefined {
    if (!identifier) return undefined;
    const users = loadUsersFromDisk();
    const clean = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    return users.find((u) => {
      // 1. Check exact secureId / assignedCode (e.g. VEN-8921, VND-402, AGT-4310)
      if (u.secureId && u.secureId.toLowerCase() === clean) return true;
      if (u.assignedCode && u.assignedCode.toLowerCase() === clean) return true;

      // 2. Check username
      if (u.username && u.username.toLowerCase() === clean) return true;

      // 3. Check email
      if (u.email && u.email.toLowerCase() === clean) return true;

      // 4. Check phone number (if 10+ digits match)
      if (cleanDigits.length >= 10 && u.phone) {
        const uPhoneDigits = u.phone.replace(/\D/g, '');
        if (uPhoneDigits.endsWith(cleanDigits) || cleanDigits.endsWith(uPhoneDigits)) return true;
      }

      // 5. Check ID
      if (u.id.toLowerCase() === clean) return true;

      return false;
    });
  },

  /**
   * Upserts a user and immediately saves to disk
   */
  saveUser(userData: Partial<RbacUser>): RbacUser {
    const users = loadUsersFromDisk();
    const normalized = normalizeUserFields(userData);

    const existingIndex = users.findIndex(
      (u) =>
        u.id === normalized.id ||
        (normalized.secureId && u.secureId.toLowerCase() === normalized.secureId.toLowerCase()) ||
        (normalized.username && u.username.toLowerCase() === normalized.username.toLowerCase())
    );

    if (existingIndex >= 0) {
      users[existingIndex] = {
        ...users[existingIndex],
        ...normalized,
        // Preserve creation timestamp
        createdAt: users[existingIndex].createdAt || normalized.createdAt,
      };
      inMemoryUsers = users;
      saveUsersToDisk(users);
      return users[existingIndex];
    } else {
      users.unshift(normalized);
      inMemoryUsers = users;
      saveUsersToDisk(users);
      return normalized;
    }
  },

  /**
   * Updates password and saves to disk
   */
  updatePassword(userId: string, newPassword: string): boolean {
    const users = loadUsersFromDisk();
    const user = this.findUserById(userId) || this.findUserByLogin(userId);
    if (!user) return false;

    const trimmed = newPassword.trim();
    user.password = trimmed;
    user.passwordHash = trimmed;
    user.requirePasswordChangeOnFirstLogin = false;
    if (user.status === 'PENDING_FIRST_LOGIN') {
      user.status = 'ACTIVE';
    }

    inMemoryUsers = users;
    saveUsersToDisk(users);
    return true;
  },

  /**
   * Updates account status
   */
  updateStatus(userId: string, status: AccountStatus): boolean {
    const users = loadUsersFromDisk();
    const user = this.findUserById(userId) || this.findUserByLogin(userId);
    if (!user) return false;

    user.status = status;
    inMemoryUsers = users;
    saveUsersToDisk(users);
    return true;
  },

  /**
   * Records successful login timestamp & IP
   */
  recordLogin(userId: string, ip?: string): void {
    const users = loadUsersFromDisk();
    const user = this.findUserById(userId) || this.findUserByLogin(userId);
    if (user) {
      user.lastLoginAt = new Date().toISOString();
      if (ip) user.lastLoginIp = ip;
      inMemoryUsers = users;
      saveUsersToDisk(users);
    }
  },

  /**
   * Deletes user from disk and memory
   */
  deleteUser(userIdOrCode: string): boolean {
    const users = loadUsersFromDisk();
    const clean = userIdOrCode.trim().toLowerCase();
    const beforeLen = users.length;

    inMemoryUsers = users.filter(
      (u) =>
        u.id.toLowerCase() !== clean &&
        u.secureId.toLowerCase() !== clean &&
        (!u.assignedCode || u.assignedCode.toLowerCase() !== clean) &&
        u.username.toLowerCase() !== clean
    );

    if (inMemoryUsers.length < beforeLen) {
      saveUsersToDisk(inMemoryUsers);
      return true;
    }
    return false;
  },
};
