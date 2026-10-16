'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  Loader2,
  Users,
} from 'lucide-react';
import { ProsifyAnimatedLogo } from '@/components/brand/ProsifyAnimatedLogo';

export default function AgentLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/agent/dashboard';
  const accessDeniedReason = searchParams.get('denied');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    accessDeniedReason === 'vendor_portal_cross_access_blocked'
      ? 'Access Denied: Your account is a Vendor role. Cross-portal access to Agent routes is strictly prohibited.'
      : null
  );

  // First Login Password Reset Modal State
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/agent/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Login failed. Please verify credentials.');
        setIsLoading(false);
        return;
      }

      // Check if user must change password on first login
      if (data.requirePasswordChange) {
        setAuthenticatedUser(data.user);
        setRequirePasswordChange(true);
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleFirstTimePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticatedUser) return;
    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setPasswordChangeLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: authenticatedUser.id,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to update password');
        setPasswordChangeLoading(false);
        return;
      }

      // Success -> proceed to dashboard
      router.push('/agent/dashboard');
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating password');
      setPasswordChangeLoading(false);
    }
  };

  const fillDemoAgent = (agtId: string, pass: string) => {
    setIdentifier(agtId);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#0C1210] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-neutral-950 font-sans">
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-emerald-950/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ProsifyAnimatedLogo size="sm" />
          <span className="hidden sm:inline-block h-4 w-px bg-emerald-900/60" />
          <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400 font-mono">
            Field &amp; Sales Agent Portal
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
            <span>Main Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Login Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md bg-neutral-900/90 border border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Emerald Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-inner">
              <Briefcase className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Agent Sales Portal Login
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Field advisors, channel partners &amp; relationship managers.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Agent ID or Registered Email
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. AGT-4310 or suresh.patil@prosify.in"
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your agent password"
                  disabled={isLoading}
                  className="w-full pl-4 pr-10 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-linear-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Access Agent Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-neutral-800 space-y-2">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Test Provisioned Accounts:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemoAgent('AGT-4310', 'Agt#4310!Secure')}
                className="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-left cursor-pointer transition-colors"
              >
                <div className="font-bold text-emerald-300 font-mono">AGT-4310</div>
                <div className="text-[10px] text-neutral-400 truncate">Suresh Patil (Active)</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAgent('AGT-4311', 'Agt#4311!Temp')}
                className="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-left cursor-pointer transition-colors"
              >
                <div className="font-bold text-amber-300 font-mono">AGT-4311</div>
                <div className="text-[10px] text-neutral-400 truncate">Priya Sharma (1st Login)</div>
              </button>
            </div>
          </div>

          {/* Notice on public registration */}
          <div className="mt-5 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 text-[11px] text-neutral-400 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Public registration disabled. Agents provisioned exclusively via Admin.</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-neutral-800/80 text-center text-xs text-neutral-500">
        <span>© {new Date().getFullYear()} Prosify Field Operations • Role-Based Access Control</span>
      </footer>

      {/* Mandatory First Time Password Change Modal */}
      {requirePasswordChange && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="w-full max-w-md bg-neutral-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-left">
            <div className="flex items-center gap-2 mb-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <KeyRound className="w-4 h-4" />
              Agent Security Policy
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Create Your New Password
            </h3>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              For security, administration requires you to replace your initial temporary password before accessing the Agent Sales Portal.
            </p>

            <form onSubmit={handleFirstTimePasswordChange} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  New Password (min 8 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter strong password"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={passwordChangeLoading}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {passwordChangeLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-neutral-950" />
                )}
                <span>Set Password &amp; Enter Dashboard</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
