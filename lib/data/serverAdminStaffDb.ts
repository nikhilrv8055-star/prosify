import fs from 'fs';
import path from 'path';

export type AdminRoleType =
  | 'SUPER_ADMIN'
  | 'PROPERTY_MANAGER'
  | 'CRM_SALES_MANAGER'
  | 'VENDOR_AGENT_MANAGER'
  | 'AFFILIATE_MANAGER'
  | 'CONTENT_CMS_MANAGER'
  | 'FINANCE_MANAGER'
  | 'CUSTOM';

export interface AdminAccount {
  id: string;
  name: string;
  username: string; // Login ID
  email: string;
  password: string; // Password for logging in
  role: AdminRoleType;
  roleTitle: string;
  allowedGroups: string[]; // e.g. ['grp-affiliate', 'grp-dashboard'] or ['*']
  status: 'ACTIVE' | 'SUSPENDED';
  isRoot?: boolean;
  createdAt: string;
  lastLogin?: string;
  notes?: string;
}

// Preset module mappings by role
export const ROLE_PRESET_MODULES: Record<
  AdminRoleType,
  { roleTitle: string; groups: string[]; description: string }
> = {
  SUPER_ADMIN: {
    roleTitle: 'Super Administrator',
    groups: ['*'],
    description: 'Full unconstrained access to all admin panel modules and governance tools.',
  },
  PROPERTY_MANAGER: {
    roleTitle: 'Property & Project Manager',
    groups: ['grp-dashboard', 'grp-specs', 'grp-props', 'grp-projects', 'grp-packages'],
    description: 'Manages real estate listings, builder projects, categories, specifications, and pricing requests.',
  },
  CRM_SALES_MANAGER: {
    roleTitle: 'CRM & Sales Director',
    groups: ['grp-dashboard', 'grp-crm', 'grp-tickets', 'grp-reports'],
    description: 'Manages client inquiries, CRM pipeline, site visits, buyer callbacks, and support tickets.',
  },
  VENDOR_AGENT_MANAGER: {
    roleTitle: 'Vendors & Agents Director',
    groups: ['grp-dashboard', 'grp-vendors', 'grp-agents', 'grp-users'],
    description: 'Onboards and verifies builders, registered agents, channel partners, and manages partner access.',
  },
  AFFILIATE_MANAGER: {
    roleTitle: 'Affiliate Program Manager',
    groups: ['grp-dashboard', 'grp-affiliate'],
    description: 'Manages registered affiliates, referral link tracking, conversions, payout approvals, and banner creatives.',
  },
  CONTENT_CMS_MANAGER: {
    roleTitle: 'Content & CMS Editor',
    groups: ['grp-dashboard', 'grp-home-cms', 'grp-footer-cms', 'grp-blog', 'grp-faq', 'grp-ads', 'grp-themes'],
    description: 'Edits landing pages, home page sections, footer links, blogs, FAQs, ads, and festival themes.',
  },
  FINANCE_MANAGER: {
    roleTitle: 'Finance & Payouts Officer',
    groups: ['grp-dashboard', 'grp-payments', 'grp-gateways', 'grp-affiliate'],
    description: 'Reviews payment logs, payout requests, gateway integrations, and commission disbursements.',
  },
  CUSTOM: {
    roleTitle: 'Custom Access Staff',
    groups: ['grp-dashboard'],
    description: 'Customized individual module access configured manually by Super Admin.',
  },
};

const DATA_DIR = path.join(process.cwd(), 'data');
const STAFF_DB_FILE = path.join(DATA_DIR, 'admin_staff.json');

const DEFAULT_ACCOUNTS: AdminAccount[] = [
  {
    id: 'adm_super_root',
    name: 'Super Administrator',
    username: 'admin',
    email: 'admin@prosify.in',
    password: 'prosify@123#',
    role: 'SUPER_ADMIN',
    roleTitle: 'Super Administrator (Full System Control)',
    allowedGroups: ['*'],
    status: 'ACTIVE',
    isRoot: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLogin: 'Active Now',
    notes: 'Master Super Admin credentials with unrestricted system governance',
  },
];

let cachedStaff: AdminAccount[] | null = null;

function loadStaffDb(): AdminAccount[] {
  if (cachedStaff) return cachedStaff;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(STAFF_DB_FILE)) {
      const content = fs.readFileSync(STAFF_DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure master root admin is always present
        const hasRoot = parsed.some(
          (a) => a.username.toLowerCase() === 'admin' || a.email.toLowerCase() === 'admin@prosify.in'
        );
        if (!hasRoot) {
          parsed.unshift(DEFAULT_ACCOUNTS[0]);
        }
        cachedStaff = parsed;
        return cachedStaff;
      }
    }

    cachedStaff = [...DEFAULT_ACCOUNTS];
    saveStaffDb(cachedStaff);
    return cachedStaff;
  } catch (err) {
    console.warn('[ServerAdminStaffDb] Error loading staff db:', err);
    cachedStaff = [...DEFAULT_ACCOUNTS];
    return cachedStaff;
  }
}

function saveStaffDb(accounts: AdminAccount[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STAFF_DB_FILE, JSON.stringify(accounts, null, 2), 'utf-8');
  } catch (err) {
    console.error('[ServerAdminStaffDb] Failed to save staff db:', err);
  }
}

export const serverAdminStaffDb = {
  /**
   * Get all admin user accounts
   */
  getAllAccounts(): AdminAccount[] {
    const list = loadStaffDb();
    return [...list];
  },

  /**
   * Find account by ID
   */
  getAccountById(id: string): AdminAccount | undefined {
    const list = loadStaffDb();
    return list.find((a) => a.id === id);
  },

  /**
   * Find account by Username or Email (case-insensitive)
   */
  getAccountByIdentifier(identifier: string): AdminAccount | undefined {
    const list = loadStaffDb();
    const clean = identifier.trim().toLowerCase();
    return list.find(
      (a) => a.username.toLowerCase() === clean || a.email.toLowerCase() === clean
    );
  },

  /**
   * Authenticate admin with loginId and password
   */
  authenticate(loginId: string, password: string): { success: boolean; account?: AdminAccount; error?: string } {
    const cleanId = loginId.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check hardcoded developer fallback (eni1526 / password123)
    if (cleanId === 'eni1526' && (cleanPass === 'password123' || cleanPass === 'prosify@123#' || cleanPass === 'admin123')) {
      return {
        success: true,
        account: {
          id: 'adm_eni1526',
          name: 'Lead Developer Admin (eni1526)',
          username: 'eni1526',
          email: 'eni1526@prosify.in',
          password: cleanPass,
          role: 'SUPER_ADMIN',
          roleTitle: 'Super Administrator',
          allowedGroups: ['*'],
          status: 'ACTIVE',
          isRoot: true,
          createdAt: '2026-01-01T00:00:00.000Z',
          lastLogin: new Date().toISOString(),
        },
      };
    }

    const account = this.getAccountByIdentifier(cleanId);
    if (!account) {
      return { success: false, error: 'Admin account not found. Please verify your Login ID or Email.' };
    }

    if (account.status === 'SUSPENDED') {
      return { success: false, error: 'Your admin account has been suspended by the Main Administrator.' };
    }

    if (account.password !== cleanPass) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    // Update lastLogin timestamp
    account.lastLogin = new Date().toISOString();
    const list = loadStaffDb();
    saveStaffDb(list);

    return { success: true, account };
  },

  /**
   * Create a new Admin User / Staff Member
   */
  createAccount(params: {
    name: string;
    username: string;
    email: string;
    password: string;
    role: AdminRoleType;
    roleTitle?: string;
    allowedGroups?: string[];
    notes?: string;
  }): AdminAccount {
    const list = loadStaffDb();
    const cleanUsername = params.username.trim().toLowerCase();
    const cleanEmail = params.email.trim().toLowerCase();

    const exists = list.find(
      (a) => a.username.toLowerCase() === cleanUsername || a.email.toLowerCase() === cleanEmail
    );
    if (exists) {
      throw new Error(`An admin user with username "${cleanUsername}" or email "${cleanEmail}" already exists.`);
    }

    // Determine allowed groups based on role or explicit groups
    const preset = ROLE_PRESET_MODULES[params.role] || ROLE_PRESET_MODULES.CUSTOM;
    const finalGroups = params.allowedGroups && params.allowedGroups.length > 0 ? params.allowedGroups : preset.groups;
    const finalRoleTitle = params.roleTitle?.trim() || preset.roleTitle;

    const newAccount: AdminAccount = {
      id: `adm_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
      name: params.name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      password: params.password.trim(),
      role: params.role,
      roleTitle: finalRoleTitle,
      allowedGroups: finalGroups,
      status: 'ACTIVE',
      isRoot: false,
      createdAt: new Date().toISOString(),
      lastLogin: 'Never',
      notes: params.notes?.trim() || '',
    };

    list.push(newAccount);
    saveStaffDb(list);
    return newAccount;
  },

  /**
   * Update an existing admin account
   */
  updateAccount(
    id: string,
    updates: Partial<{
      name: string;
      email: string;
      password: string;
      role: AdminRoleType;
      roleTitle: string;
      allowedGroups: string[];
      status: 'ACTIVE' | 'SUSPENDED';
      notes: string;
    }>
  ): AdminAccount {
    const list = loadStaffDb();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error('Admin user not found.');
    }

    const current = list[index];

    // Root admin protection
    if (current.isRoot && updates.status === 'SUSPENDED') {
      throw new Error('Root Super Administrator account cannot be suspended.');
    }

    list[index] = {
      ...current,
      ...updates,
    };

    saveStaffDb(list);
    return list[index];
  },

  /**
   * Delete an admin account
   */
  deleteAccount(id: string): boolean {
    const list = loadStaffDb();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) return false;

    if (list[index].isRoot) {
      throw new Error('Cannot delete the Root Super Administrator.');
    }

    list.splice(index, 1);
    saveStaffDb(list);
    return true;
  },
};
