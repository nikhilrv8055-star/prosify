'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth/authContext';
import { ToastProvider } from '@/components/ui/toast';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  );
}
