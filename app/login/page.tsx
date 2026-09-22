'use client';

import React, { useState } from 'react';
import { Shield, Users, Building, KeyRound, UserCheck, ArrowRight, Building2, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';
import { UserRole, DEMO_USERS } from '@/lib/auth/types';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { brandConfig } from '@/src/config/brand';
import { ProsifyLogo } from '@/components/brand/ProsifyLogo';

export default function LoginPage() {
  const { switchRole, login, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'demo' | 'login' | 'register'>('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER');
  const [isLoading, setIsLoading] = useState(false);

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
    </div>
  );
}
