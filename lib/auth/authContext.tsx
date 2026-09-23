'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'BUYER' | 'CHANNEL_PARTNER' | 'DEVELOPER' | 'ADMIN';
  partnerId?: string;
  developerId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: User['role'], customDetails?: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: 'user-default-1',
    name: 'Siddharth Roy',
    email: 'siddharth.roy@gmail.com',
    mobile: '+91 98200 88771',
    role: 'ADMIN',
  });

  const login = (role: User['role'], customDetails?: Partial<User>) => {
    setUser({
      id: `user-${Date.now()}`,
      name: customDetails?.name || 'Verified Member',
      email: customDetails?.email || 'member@prosify.in',
      mobile: customDetails?.mobile || '+91 98200 00000',
      role,
      ...customDetails,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
