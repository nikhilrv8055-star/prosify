'use client';

import React, { createContext, useContext, useState, useSyncExternalStore } from 'react';
import { AuthUser, UserRole, DEMO_USERS, ROLE_PERMISSIONS } from './types';
import { hasPermission as checkPermission, canAccessPortal as checkPortal } from './rbac';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole, password?: string) => Promise<boolean>;
  loginWithGoogle: (payload: { email: string; name?: string; picture?: string; role?: UserRole }) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  hasPermission: (permission: Parameters<typeof checkPermission>[1]) => boolean;
  canAccessPortal: (portal: Parameters<typeof checkPortal>[1]) => boolean;
  savedPropertyIds: string[];
  toggleSavedProperty: (id: string) => void;
  isSaved: (id: string) => boolean;
  comparedPropertyIds: string[];
  toggleCompareProperty: (id: string) => void;
  removeCompareProperty: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'prosify_auth_user_v1';
const SAVED_STORAGE_KEY = 'prosify_saved_properties_v1';
const COMPARE_STORAGE_KEY = 'prosify_compare_properties_v1';

// In-memory subscribers for synchronizing external storage updates
const storageListeners = new Set<() => void>();
function notifyStorageChange() {
  storageListeners.forEach((listener) => listener());
}

function subscribeToStorage(callback: () => void) {
  storageListeners.add(callback);
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', callback);
  }
  return () => {
    storageListeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', callback);
    }
  };
}

// Production default: unauthenticated null state (zero default privilege)
const SERVER_USER_SNAPSHOT: AuthUser | null = null;
const DEFAULT_SAVED_IDS: string[] = ['prop_1', 'prop_3'];
const DEFAULT_COMPARE_IDS: string[] = ['prop_1', 'prop_2'];

// User snapshot
let cachedUserRaw: string | null = null;
let cachedUser: AuthUser | null = SERVER_USER_SNAPSHOT;

function getUserSnapshot(): AuthUser | null {
  if (typeof window === 'undefined') return SERVER_USER_SNAPSHOT;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw !== cachedUserRaw) {
      cachedUserRaw = raw;
      cachedUser = raw ? JSON.parse(raw) : null;
    }
    return cachedUser;
  } catch {
    return null;
  }
}

function getUserServerSnapshot(): AuthUser | null {
  return SERVER_USER_SNAPSHOT;
}

// Saved properties snapshot
let cachedSavedRaw: string | null = null;
let cachedSaved: string[] = DEFAULT_SAVED_IDS;

function getSavedSnapshot(): string[] {
  if (typeof window === 'undefined') return DEFAULT_SAVED_IDS;
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    if (raw !== cachedSavedRaw) {
      cachedSavedRaw = raw;
      cachedSaved = raw ? JSON.parse(raw) : DEFAULT_SAVED_IDS;
    }
    return cachedSaved;
  } catch {
    return DEFAULT_SAVED_IDS;
  }
}

function getSavedServerSnapshot(): string[] {
  return DEFAULT_SAVED_IDS;
}

// Compared properties snapshot
let cachedCompareRaw: string | null = null;
let cachedCompare: string[] = DEFAULT_COMPARE_IDS;

function getCompareSnapshot(): string[] {
  if (typeof window === 'undefined') return DEFAULT_COMPARE_IDS;
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
    if (raw !== cachedCompareRaw) {
      cachedCompareRaw = raw;
      cachedCompare = raw ? JSON.parse(raw) : DEFAULT_COMPARE_IDS;
    }
    return cachedCompare;
  } catch {
    return DEFAULT_COMPARE_IDS;
  }
}

function getCompareServerSnapshot(): string[] {
  return DEFAULT_COMPARE_IDS;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribeToStorage, getUserSnapshot, getUserServerSnapshot);
  const savedPropertyIds = useSyncExternalStore(subscribeToStorage, getSavedSnapshot, getSavedServerSnapshot);
  const comparedPropertyIds = useSyncExternalStore(subscribeToStorage, getCompareSnapshot, getCompareServerSnapshot);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const login = async (email: string, preferredRole?: UserRole, password?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role: preferredRole,
          password: password || 'Prosify@2026',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Login failed');
      }

      const loggedUser = data.user;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
      notifyStorageChange();
      return true;
    } catch (err) {
      console.warn('Login network or validation error, falling back to local session:', err);
      // Client-side fallback for offline/isolated demo
      const matchedRole = preferredRole || 'CUSTOMER';
      const baseUser = DEMO_USERS[matchedRole];
      const fallbackUser: AuthUser = {
        ...baseUser,
        email: email || baseUser.email,
        name: email ? email.split('@')[0].toUpperCase() : baseUser.name,
        permissions: ROLE_PERMISSIONS[matchedRole],
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fallbackUser));
      notifyStorageChange();
      return true;
    }
  };

  const loginWithGoogle = async (payload: {
    email: string;
    name?: string;
    picture?: string;
    role?: UserRole;
  }): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Google login failed');
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
      notifyStorageChange();
      return true;
    } catch {
      // Fallback
      const role = payload.role || 'CUSTOMER';
      const googleUser: AuthUser = {
        id: `user_google_${Date.now()}`,
        name: payload.name || payload.email.split('@')[0],
        email: payload.email,
        avatarUrl: payload.picture,
        role,
        permissions: ROLE_PERMISSIONS[role],
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(googleUser));
      notifyStorageChange();
      return true;
    }
  };

  const logout = () => {
    try {
      fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    notifyStorageChange();
  };

  const switchRole = async (role: UserRole) => {
    const demo = DEMO_USERS[role];
    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: demo.email,
          role,
          password: 'Prosify@2026',
        }),
      });
    } catch {
      // ignore
    }
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demo));
    } catch {
      // ignore
    }
    notifyStorageChange();
  };

  const toggleSavedProperty = (id: string) => {
    const current = getSavedSnapshot();
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    notifyStorageChange();
  };

  const isSaved = (id: string) => savedPropertyIds.includes(id);

  const toggleCompareProperty = (id: string) => {
    const current = getCompareSnapshot();
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(0, 4);
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    notifyStorageChange();
  };

  const removeCompareProperty = (id: string) => {
    const current = getCompareSnapshot();
    const next = current.filter((item) => item !== id);
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    notifyStorageChange();
  };

  const clearCompare = () => {
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify([]));
    } catch {
      // ignore
    }
    notifyStorageChange();
  };

  const isInCompare = (id: string) => comparedPropertyIds.includes(id);

  const hasPermission = (permission: Parameters<typeof checkPermission>[1]) => {
    return checkPermission(user, permission);
  };

  const canAccessPortal = (portal: Parameters<typeof checkPortal>[1]) => {
    return checkPortal(user, portal);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        logout,
        switchRole,
        hasPermission,
        canAccessPortal,
        savedPropertyIds,
        toggleSavedProperty,
        isSaved,
        comparedPropertyIds,
        toggleCompareProperty,
        removeCompareProperty,
        clearCompare,
        isInCompare,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
