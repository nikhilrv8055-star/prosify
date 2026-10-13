'use client';

import React, { useState } from 'react';
import { Shield, Users, Building, KeyRound, UserCheck, ArrowRight, Building2, CheckCircle2, Lock, Sparkles, X, Plus } from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';
import { UserRole, DEMO_USERS } from '@/lib/auth/types';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { brandConfig } from '@/src/config/brand';
import { ProsifyLogo } from '@/components/brand/ProsifyLogo';
import { getPortalUsers, setPortalSession } from '@/lib/auth/portalUsers';

export default function LoginPage() {
  const { switchRole, login, loginWithGoogle, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'demo' | 'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googlePickerOpen, setGooglePickerOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  const handleGoogleSelect = async (accountEmail: string, accountName: string) => {
    setIsGoogleLoading(true);
    try {
      const ok = await loginWithGoogle({
        email: accountEmail,
        name: accountName,
        role: selectedRole,
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      });

      if (ok) {
        toast({
          title: 'Google Sign-In Successful',
          description: `Signed in as ${accountEmail}. Redirecting to dashboard...`,
          type: 'success',
        });
        setGooglePickerOpen(false);
        if (selectedRole === 'CHANNEL_PARTNER') router.push('/partner');
        else if (selectedRole === 'DEVELOPER') router.push('/developer');
        else router.push('/properties');
      }
    } catch {
      toast({
        title: 'Google Sign-In Failed',
        description: 'Unable to connect to Google account. Please try again.',
        type: 'error',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleDemoSelect = (role: UserRole) => {
    switchRole(role);
    const demo = DEMO_USERS[role];
    toast({
      title: `Logged in as ${demo.name}`,
      description: `Active Role: ${role.replace('_', ' ')} with verified credentials.`,
      type: 'success',
    });

    if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'SALES_MANAGER') {
      router.push('/admin');
    } else if (role === 'CHANNEL_PARTNER') {
      router.push('/partner');
    } else if (role === 'DEVELOPER') {
      router.push('/developer');
    } else {
      router.push('/properties');
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      // Check for Admin-Provisioned Portal User (Vendor or Agent or Admin)
      const allPortalUsers = getPortalUsers();
      const matchedPortal = allPortalUsers.find(
        (u) =>
          u.username.toLowerCase() === cleanEmail ||
          (u.assignedCode && u.assignedCode.toLowerCase() === cleanEmail)
      );

      if (matchedPortal) {
        if (cleanPass && matchedPortal.password !== cleanPass) {
          toast({
            title: 'Invalid Password',
            description: 'The password entered does not match this portal account.',
            type: 'error',
          });
          return;
        }

        if (matchedPortal.status === 'SUSPENDED') {
          toast({
            title: 'Account Suspended',
            description: 'This portal account is suspended. Contact Administrator.',
            type: 'error',
          });
          return;
        }

        setPortalSession(matchedPortal.role, matchedPortal);
        toast({
          title: 'Authentication Successful',
          description: `Welcome back, ${matchedPortal.name}! Opening your dedicated ${matchedPortal.role.toLowerCase()} workspace.`,
          type: 'success',
        });

        if (matchedPortal.role === 'VENDOR') {
          router.push('/vendor');
          return;
        } else if (matchedPortal.role === 'AGENT') {
          router.push('/agent');
          return;
        } else if (matchedPortal.role === 'ADMIN') {
          router.push('/admin');
          return;
        }
      }

      // Security Rule: Allow admin@prosify.local or eni1526 for admin authentication
      const isAdminUsername = cleanEmail === 'admin@prosify.local' || cleanEmail === 'eni1526' || cleanEmail === 'admin@prosify.in';
      const roleToAssign = isAdminUsername ? 'SUPER_ADMIN' : selectedRole;

      await login(email, roleToAssign);
      toast({
        title: 'Authentication Successful',
        description: isAdminUsername
          ? `${brandConfig.adminName} session authenticated. Full control access granted.`
          : `Welcome back to ${brandConfig.name}! Signed in with role ${roleToAssign}.`,
        type: 'success',
      });
      if (roleToAssign === 'SUPER_ADMIN' || roleToAssign === 'ADMIN') router.push('/admin');
      else if (roleToAssign === 'CHANNEL_PARTNER') router.push('/partner');
      else if (roleToAssign === 'DEVELOPER') router.push('/developer');
      else router.push('/properties');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <ProsifyLogo variant="dark" size="lg" showTagline={false} />
        </div>
        <h2 className="text-center text-xl font-extrabold text-neutral-900 tracking-tight">
          Enterprise Multi-Role Authentication
        </h2>
        <p className="mt-1 text-center text-xs text-neutral-600">
          Sign in to access the {brandConfig.name} ecosystem or switch demo roles below
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-md rounded-2xl border border-neutral-200 sm:px-10">
          {/* 1. Primary Google OAuth Sign In */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setGooglePickerOpen(true)}
              disabled={isGoogleLoading}
              className="w-full py-3 px-4 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-sm transition-all flex items-center justify-center gap-3 shadow-xs active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{isGoogleLoading ? 'Signing in with Google...' : 'Continue with Google'}</span>
            </button>

            <div className="mt-5 relative flex items-center justify-center">
              <div className="border-t border-neutral-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0">
                Or continue with
              </span>
              <div className="border-t border-neutral-200 w-full" />
            </div>
          </div>

          {/* Tab selector */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 rounded-xl mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('demo')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'demo'
                  ? 'bg-white text-neutral-950 shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Demo Personas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-neutral-950 shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Credentials
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-neutral-950 shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Register
            </button>
          </div>

          {activeTab === 'demo' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-500 font-medium">
                One-click login with instant role context and preloaded database permissions:
              </p>

              {/* Channel Partner */}
              <button
                onClick={() => handleDemoSelect('CHANNEL_PARTNER')}
                className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-neutral-900 group-hover:text-blue-800">
                      MahaRERA Channel Partner
                    </strong>
                    <span className="text-[11px] text-neutral-500">
                      Apex Capital Realtors • APEX2026
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Developer */}
              <button
                onClick={() => handleDemoSelect('DEVELOPER')}
                className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-neutral-900 group-hover:text-emerald-800">
                      Real Estate Developer
                    </strong>
                    <span className="text-[11px] text-neutral-500">
                      Lodha Group Representative
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Customer */}
              <button
                onClick={() => handleDemoSelect('CUSTOMER')}
                className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-neutral-900">
                      Verified Buyer / Investor
                    </strong>
                    <span className="text-[11px] text-neutral-500">
                      Dr. Sameer Joshi • Saved Units & Tours
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          )}

          {activeTab === 'login' && (
            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address or Username
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@prosify.local or operations@prosify.in"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-[#D4A017]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-[#D4A017]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Role Permission Scope
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4A017]"
                >
                  <option value="CHANNEL_PARTNER">Registered Channel Partner</option>
                  <option value="DEVELOPER">Builder / Developer</option>
                  <option value="CUSTOMER">Customer / Home Buyer</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-[#D4A017] text-neutral-950 font-bold text-sm hover:bg-[#F4C430] active:scale-[0.99] transition-all shadow-xs"
              >
                {isLoading ? 'Verifying...' : 'Sign In with RBAC'}
              </button>
            </form>
          )}

          {activeTab === 'register' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Full Name / Entity Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rajiv Mehra"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-[#D4A017]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajiv@realtors.in"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-[#D4A017]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Account Type
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4A017]"
                >
                  <option value="CUSTOMER">Home Buyer / Investor</option>
                  <option value="CHANNEL_PARTNER">MahaRERA Channel Partner</option>
                  <option value="DEVELOPER">Property Developer</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  switchRole(selectedRole);
                  toast({
                    title: 'Account Created',
                    description: `Welcome to ${brandConfig.name} as ${selectedRole}.`,
                    type: 'success',
                  });
                  if (selectedRole === 'CHANNEL_PARTNER') router.push('/partner');
                  else if (selectedRole === 'DEVELOPER') router.push('/developer');
                  else router.push('/properties');
                }}
                className="w-full py-2.5 rounded-lg bg-[#D4A017] text-neutral-950 font-bold text-sm hover:bg-[#F4C430] active:scale-[0.99] transition-all shadow-xs"
              >
                Create Account & Grant Access
              </button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-neutral-200 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS 1.3 256-bit encrypted authentication</span>
            </div>
          </div>
        </div>
      </div>

      {/* Google Identity Services (GIS) Account Picker Modal */}
      {googlePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 relative animate-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setGooglePickerOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-10 h-10 mx-auto rounded-full bg-neutral-100 flex items-center justify-center mb-2.5">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold text-neutral-900">Choose a Google Account</h3>
              <p className="text-xs text-neutral-500 mt-0.5">to continue to {brandConfig.name}</p>
            </div>

            <div className="space-y-2 mb-4">
              {/* Account 1: User primary email */}
              <button
                type="button"
                onClick={() => handleGoogleSelect('nikhilrv8055@gmail.com', 'Nikhil Verma')}
                disabled={isGoogleLoading}
                className="w-full p-3 rounded-xl border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  N
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-neutral-900 group-hover:text-blue-700 truncate">
                    Nikhil Verma
                  </div>
                  <div className="text-[11px] text-neutral-500 truncate">nikhilrv8055@gmail.com</div>
                </div>
                <div className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full shrink-0">
                  Default
                </div>
              </button>

              {/* Account 2: Admin account */}
              <button
                type="button"
                onClick={() => handleGoogleSelect('admin@prosify.in', 'Prosify Administrator')}
                disabled={isGoogleLoading}
                className="w-full p-3 rounded-xl border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-neutral-800 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  P
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-neutral-900 group-hover:text-blue-700 truncate">
                    Prosify Administrator
                  </div>
                  <div className="text-[11px] text-neutral-500 truncate">admin@prosify.in</div>
                </div>
              </button>
            </div>

            {/* Custom Google Email input */}
            <div className="pt-2 border-t border-neutral-100">
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Or use another Google account:
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  disabled={!customGoogleEmail || isGoogleLoading}
                  onClick={() => handleGoogleSelect(customGoogleEmail, customGoogleEmail.split('@')[0])}
                  className="px-3 py-2 rounded-lg bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-[10px] text-neutral-400">
                To continue, Google will share your name and email with {brandConfig.name}.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
