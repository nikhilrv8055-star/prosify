'use client';

export type PortalRole = 'ADMIN' | 'VENDOR' | 'AGENT' | 'CUSTOMER';

export interface PortalUser {
  id: string;
  username: string; // email or user id
  name: string;
  role: PortalRole;
  password: string;
  phone?: string;
  companyOrProject?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  createdAt: string;
  lastLogin?: string;
  portalUrl: string;
  assignedCode?: string; // e.g. AGENT-104 or VND-208
}

const STORAGE_KEY = 'eni_portal_users_store_v1';

// Seed initial users configured with default secure credentials
const DEFAULT_USERS: PortalUser[] = [
  {
    id: 'user-admin-1',
    username: 'admin@prosify.in',
    name: 'Prosify Central Administrator',
    role: 'ADMIN',
    password: 'prosify@123#',
    phone: '+91 91679 91679',
    companyOrProject: 'Prosify Technologies HQ',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLogin: '2026-09-26T08:30:00.000Z',
    portalUrl: '/admin',
    assignedCode: 'ADM-001',
  },
  {
    id: 'user-vendor-1',
    username: 'vendor@eni.com',
    name: 'BuildTech Smart Materials & Engineering',
    role: 'VENDOR',
    password: 'password123',
    phone: '+91 98201 55678',
    companyOrProject: 'BuildTech Materials Ltd (GSTIN: 27AABCB1234F1Z5)',
    status: 'ACTIVE',
    createdAt: '2026-02-15T00:00:00.000Z',
    lastLogin: '2026-09-25T14:20:00.000Z',
    portalUrl: '/vendor',
    assignedCode: 'VND-402',
  },
  {
    id: 'user-agent-1',
    username: 'agent@eni.com',
    name: 'Suresh Patil (Senior Channel Partner)',
    role: 'AGENT',
    password: 'password123',
    phone: '+91 97654 32109',
    companyOrProject: 'Patil Realty Consultants (RERA: A51900018742)',
    status: 'ACTIVE',
    createdAt: '2026-03-10T00:00:00.000Z',
    lastLogin: '2026-09-26T07:15:00.000Z',
    portalUrl: '/agent',
    assignedCode: 'AGT-882',
  },
  {
    id: 'user-customer-1',
    username: 'customer@eni.com',
    name: 'Vikram & Ananya Singhania',
    role: 'CUSTOMER',
    password: 'password123',
    phone: '+91 98200 11223',
    companyOrProject: 'Booking: Lodha Crown Tower A - Unit 1402',
    status: 'ACTIVE',
    createdAt: '2026-04-01T00:00:00.000Z',
    lastLogin: '2026-09-24T18:45:00.000Z',
    portalUrl: '/customer',
    assignedCode: 'CUST-1049',
  },
];

// Trigger background cloud sync on client initialization
if (typeof window !== 'undefined') {
  try {
    fetch('/api/admin/portal-users')
      .then((r) => r.json())
      .then((data) => {
        if (data?.users && Array.isArray(data.users) && data.users.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.users));
          window.dispatchEvent(new Event('eni_portal_users_updated'));
        }
      })
      .catch(() => {});
  } catch {}
}

export function getPortalUsers(): PortalUser[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      // Background sync from cloud
      fetch('/api/admin/portal-users')
        .then((r) => r.json())
        .then((data) => {
          if (data?.users) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.users));
            window.dispatchEvent(new Event('eni_portal_users_updated'));
          }
        })
        .catch(() => {});
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return parsed;
  } catch (err) {
    console.warn('Error reading portal users from storage:', err);
    return DEFAULT_USERS;
  }
}

export function savePortalUsers(users: PortalUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    // Dispatch custom event so all open tabs / components update live
    window.dispatchEvent(new Event('eni_portal_users_updated'));
  } catch (err) {
    console.error('Failed to save portal users:', err);
  }
}

/**
 * Fetches all registered portal users from the Cloud Database and syncs local storage
 */
export async function syncPortalUsersFromCloud(): Promise<PortalUser[]> {
  if (typeof window === 'undefined') return getPortalUsers();
  try {
    const res = await fetch('/api/admin/portal-users');
    const data = await res.json();
    if (data?.users && Array.isArray(data.users)) {
      savePortalUsers(data.users);
      return data.users;
    }
  } catch (err) {
    console.warn('[Cloud Sync Fetch Error]:', err);
  }
  return getPortalUsers();
}

/**
 * Creates portal user and immediately syncs to Cloud Database
 */
export function createPortalUser(userData: Omit<PortalUser, 'id' | 'createdAt'>): PortalUser {
  const users = getPortalUsers();
  const newUser: PortalUser = {
    ...userData,
    id: `user-${userData.role.toLowerCase()}-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  users.unshift(newUser);
  savePortalUsers(users);

  // Sync to Cloud Server API so user can access from any computer or mobile
  if (typeof window !== 'undefined') {
    fetch('/api/admin/portal-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.success) {
          console.log(`[Cloud Sync] ${userData.role} ${userData.username} synced to cloud database.`);
        }
      })
      .catch((err) => {
        console.warn('[Cloud Sync Error] Cloud sync deferred:', err);
      });
  }

  return newUser;
}

/**
 * Updates password and syncs to Cloud Database
 */
export function updatePortalUserPassword(userId: string, newPassword: string): boolean {
  const users = getPortalUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return false;
  users[idx].password = newPassword;
  savePortalUsers(users);

  if (typeof window !== 'undefined') {
    fetch('/api/admin/portal-users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, password: newPassword }),
    }).catch(() => {});
  }

  return true;
}

/**
 * Updates status and syncs to Cloud Database
 */
export function updatePortalUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'PENDING'): boolean {
  const users = getPortalUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return false;
  users[idx].status = status;
  savePortalUsers(users);

  if (typeof window !== 'undefined') {
    fetch('/api/admin/portal-users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, status }),
    }).catch(() => {});
  }

  return true;
}

/**
 * Updates profile details and syncs to Cloud Database
 */
export function updatePortalUser(userId: string, patch: Partial<PortalUser>): PortalUser | null {
  const users = getPortalUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch };
  savePortalUsers(users);

  if (typeof window !== 'undefined') {
    fetch('/api/admin/portal-users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, ...patch }),
    }).catch(() => {});
  }

  return users[idx];
}

/**
 * Deletes user and purges from Cloud Database
 */
export function deletePortalUser(userId: string): boolean {
  const users = getPortalUsers();
  const filtered = users.filter((u) => u.id !== userId);
  if (filtered.length === users.length) return false;
  savePortalUsers(filtered);

  if (typeof window !== 'undefined') {
    fetch(`/api/admin/portal-users?id=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    }).catch(() => {});
  }

  return true;
}

/**
 * Authenticate credentials against role-specific requirements.
 * Checks local cache first; if not found or password differs, validates directly with Cloud Server Database.
 */
export function authenticatePortalUser(
  username: string,
  passwordAttempt: string,
  expectedRole: PortalRole
): { success: boolean; user?: PortalUser; error?: string } {
  const cleanUser = username.trim().toLowerCase();
  const cleanPass = passwordAttempt.trim();

  const users = getPortalUsers();
  const user = users.find(
    (u) =>
      u.username.toLowerCase() === cleanUser ||
      (u.assignedCode && u.assignedCode.toLowerCase() === cleanUser)
  );

  if (!user) {
    return {
      success: false,
      error: 'Account not found. Please verify your ID or contact Administrator.',
    };
  }

  if (user.role !== expectedRole) {
    return {
      success: false,
      error: `Access Denied: This account is registered for the ${user.role} Portal, not the ${expectedRole} Portal.`,
    };
  }

  if (user.status === 'SUSPENDED') {
    return {
      success: false,
      error: 'Account is suspended. Please contact Administrator for reactivation.',
    };
  }

  if (user.password !== cleanPass) {
    return {
      success: false,
      error: 'Invalid password. Credentials are managed directly from the Admin Panel.',
    };
  }

  // Update last login
  updatePortalUser(user.id, { lastLogin: new Date().toISOString() });

  return { success: true, user };
}

/**
 * Async Cloud-authoritative authentication to allow logging in from any device or browser
 */
export async function authenticatePortalUserWithCloud(
  username: string,
  passwordAttempt: string,
  expectedRole: PortalRole
): Promise<{ success: boolean; user?: PortalUser; error?: string }> {
  // Try local first
  const localResult = authenticatePortalUser(username, passwordAttempt, expectedRole);
  if (localResult.success) return localResult;

  // Query Cloud Database
  try {
    const res = await fetch(`/api/admin/portal-users?username=${encodeURIComponent(username.trim().toLowerCase())}`);
    const data = await res.json();
    if (data?.success && data?.user) {
      const cloudUser: PortalUser = data.user;
      
      // Update local storage cache with latest cloud record
      const all = getPortalUsers();
      const existingIdx = all.findIndex((u) => u.id === cloudUser.id);
      if (existingIdx >= 0) all[existingIdx] = cloudUser;
      else all.unshift(cloudUser);
      savePortalUsers(all);

      if (cloudUser.role !== expectedRole) {
        return {
          success: false,
          error: `Access Denied: This account is registered for the ${cloudUser.role} Portal.`,
        };
      }

      if (cloudUser.status === 'SUSPENDED') {
        return {
          success: false,
          error: 'Account is suspended. Please contact Administrator for reactivation.',
        };
      }

      if (cloudUser.password !== passwordAttempt.trim()) {
        return {
          success: false,
          error: 'Invalid password. Please check your credentials.',
        };
      }

      updatePortalUser(cloudUser.id, { lastLogin: new Date().toISOString() });
      return { success: true, user: cloudUser };
    }
  } catch (err) {
    console.warn('[Cloud Auth fallback error]:', err);
  }

  return localResult;
}

// Session Helpers per role
export function getPortalSession(role: PortalRole): PortalUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(`eni_${role.toLowerCase()}_session`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setPortalSession(role: PortalRole, user: PortalUser): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(`eni_${role.toLowerCase()}_session`, JSON.stringify(user));
  } catch (err) {
    console.error('Session write error:', err);
  }
}

export function clearPortalSession(role: PortalRole): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(`eni_${role.toLowerCase()}_session`);
  } catch (err) {
    console.error('Session clear error:', err);
  }
}
