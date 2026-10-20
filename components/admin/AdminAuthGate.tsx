'use client';

import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  Server,
  Fingerprint,
  ExternalLink,
} from 'lucide-react';
import { brandConfig } from '@/src/config/brand';
import { ProsifyAnimatedLogo } from '@/components/brand/ProsifyAnimatedLogo';

interface AdminAuthGateProps {
  onAuthenticated: (token: string, username: string) => void;
}

export function AdminAuthGate({ onAuthenticated }: AdminAuthGateProps) {
  // Empty inputs by default - no hardcoded/prefilled login id or password shown
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMessage('Admin email address is required.');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Password is required.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Primary credentials: admin@prosify.in / prosify@123#
      const isOfficialMatch =
        (cleanEmail === 'admin@prosify.in' || cleanEmail === 'admin') &&
        (cleanPassword === 'prosify@123#' || cleanPassword === 'prosify@123');

      // Also support developer credentials & eni1526 admin identity
      const isLegacyMatch =
        (cleanEmail === 'admin@prosify.local' && cleanPassword === '1234') ||
        (cleanEmail === 'eni1526' &&
          (cleanPassword === 'password123' ||
            cleanPassword === 'prosify@123#' ||
            cleanPassword === 'prosify@123' ||
            cleanPassword === 'admin123'));

      if (isOfficialMatch || isLegacyMatch) {
        const authenticatedIdentity =
          cleanEmail === 'admin' ? 'admin@prosify.in' : cleanEmail;
        const sessionToken = `prosify_adm_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 10)}`;

        try {
          sessionStorage.setItem('prosify_admin_secure_token', sessionToken);
          sessionStorage.setItem('prosify_admin_user', authenticatedIdentity);
          sessionStorage.setItem(
            'prosify_admin_auth_time',
            new Date().toISOString()
          );
        } catch (err) {
          console.error('Session storage unavailable', err);
        }

        setIsLoading(false);
        onAuthenticated(sessionToken, authenticatedIdentity);
      } else {
        setIsLoading(false);
        setErrorMessage(
          'Authentication failed. Please verify your admin credentials.'
        );
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#111622] text-neutral-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-[#D4A017] selection:text-neutral-950">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#D4A017]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#d4a017_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

      {/* Main Luxury Minimalist Card */}
      <div className="w-full max-w-md bg-neutral-900/95 backdrop-blur-xl rounded-3xl border border-neutral-800/80 p-8 shadow-2xl relative z-10">
        {/* Animated Brand Header */}
        <div className="mb-6">
          <ProsifyAnimatedLogo
            panelType="admin"
            welcomeTitle="welcome to prosify admin"
            subtitle="Marketplace Operations, Clearinghouse & Partner Settlement Plane"
          />
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Clean Login Form (No prefilled values or exposed test credentials) */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Admin Email ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email ID"
                required
                autoComplete="email"
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-neutral-300">
                Password
              </label>
              <span className="text-[10px] text-neutral-500">Secure Access</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="current-password"
                className="w-full pl-9 pr-10 py-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 px-4 rounded-xl bg-[#D4A017] hover:bg-[#F4C430] text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                Verifying Credentials...
              </span>
            ) : (
              <>
                <Fingerprint className="w-4 h-4" />
                <span>Sign In to Admin Panel</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Contact & Escalation */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 text-xs text-neutral-400 z-10">
        <span className="flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-[#D4A017]" />
          Production Route: <strong className="text-neutral-300 font-mono">admin.prosify.in</strong>
        </span>
        <span className="hidden sm:inline text-neutral-600">•</span>
        <a
          href="https://wa.me/919167991679"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors font-semibold"
        >
          <span>WhatsApp</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
