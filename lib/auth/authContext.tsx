'use client';

import React, { createContext, useContext, useState, useSyncExternalStore } from 'react';
import { AuthUser, UserRole, DEMO_USERS, ROLE_PERMISSIONS } from './types';
import { hasPermission as checkPermission, canAccessPortal as checkPortal } from './rbac';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
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

// Cached module-level constants for snapshots to guarantee reference equality across renders
const SERVER_USER_SNAPSHOT: AuthUser = DEMO_USERS.SUPER_ADMIN;
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
      cachedUser = raw ? JSON.parse(raw) : SERVER_USER_SNAPSHOT;
    }
    return cachedUser;
  } catch {
    return SERVER_USER_SNAPSHOT;
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

  const login = async (email: string, preferredRole?: UserRole): Promise<boolean> => {
    const matchedRole =
      preferredRole ||
      (Object.keys(DEMO_USERS).find(
        (r) => DEMO_USERS[r as UserRole].email.toLowerCase() === email.toLowerCase()
      ) as UserRole) ||
      'CUSTOMER';

    const baseUser = DEMO_USERS[matchedRole];
    const loggedUser: AuthUser = {
      ...baseUser,
      email: email || baseUser.email,
      name: email ? email.split('@')[0].toUpperCase() : baseUser.name,
      permissions: ROLE_PERMISSIONS[matchedRole],
    };

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
    } catch {
      // ignore
    }
    notifyStorageChange();
    return true;
  };

  const logout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    notifyStorageChange();
  };

  const switchRole = (role: UserRole) => {
    const newUser = DEMO_USERS[role];
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
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
      localStorage.removeItem(COMPARE_STORAGE_KEY);
    } catch {
      // ignore
    }
    notifyStorageChange();
  };

  const isInCompare = (id: string) => comparedPropertyIds.includes(id);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        hasPermission: (perm) => checkPermission(user, perm),
        canAccessPortal: (portal) => checkPortal(user, portal),
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
