'use client';

import React, { useState } from 'react';
import { Shield, Users, Building, CheckCircle2, KeyRound, UserCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/lib/../components/ui/dialog';
import { useAuth } from '@/lib/auth/authContext';
import { UserRole, DEMO_USERS } from '@/lib/auth/types';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, switchRole, login, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'demo' | 'login' | 'register'>('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleDemoSelect = (role: UserRole) => {
    switchRole(role);
    const demo = DEMO_USERS[role];
    toast({
      title: `Logged in as ${demo.name}`,
      description: `Active Role: ${role.replace('_', ' ')} with verified credentials.`,
      type: 'success',
    });
    closeAuthModal();

    // Optionally route to role portal
    if (role === 'CHANNEL_PARTNER') {
      router.push('/partner');
    } else if (role === 'DEVELOPER') {
      router.push('/developer');
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    try {
      await login(email, selectedRole);
      toast({
        title: 'Authentication Successful',
        description: `Welcome back! Signed in with role ${selectedRole}.`,
        type: 'success',
      });
      closeAuthModal();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setIsLoading(true);

    try {
      await login(email, selectedRole);
      toast({
        title: 'Registration Approved',
        description: `Account verified and initialized under ${selectedRole}.`,
        type: 'success',
      });
      closeAuthModal();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="max-w-md p-6" onClose={closeAuthModal}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#D4A017]/20 border border-[#D4A017]/40 flex items-center justify-center text-[#D4A017]">
              <KeyRound className="w-4 h-4" />
            </div>
            <DialogTitle>Platform Authentication & RBAC</DialogTitle>
          </div>
          <DialogDescription>
            Multi-role identity engine with role-based access control for Maharashtra real estate operations.
          </DialogDescription>
        </DialogHeader>

        {/* Tab switchers */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 rounded-xl mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('demo')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'demo'
                ? 'bg-white text-neutral-950 shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
            <span>Demo Roles</span>
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
            Sign In
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

        {/* Tab 1: Instant Demo Role Selector */}
        {activeTab === 'demo' && (
          <div className="space-y-2.5">
            <p className="text-xs text-neutral-500 font-medium mb-1">
              Select a verified persona to test respective permissions and portal access instantly:
            </p>

            {/* Channel Partner */}
            <button
              onClick={() => handleDemoSelect('CHANNEL_PARTNER')}
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                user?.role === 'CHANNEL_PARTNER'
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold text-neutral-900 group-hover:text-blue-700">
                    Nikhil Rane (Apex Capital)
                  </strong>
                  <span className="text-[11px] text-neutral-500">Channel Partner • Code APEX2026</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Developer */}
            <button
              onClick={() => handleDemoSelect('DEVELOPER')}
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                user?.role === 'DEVELOPER'
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold text-neutral-900 group-hover:text-emerald-700">
                    Rajesh Mehta (Lodha Group)
                  </strong>
                  <span className="text-[11px] text-neutral-500">Developer Rep • Inventory Engine</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Buyer / Customer */}
            <button
              onClick={() => handleDemoSelect('CUSTOMER')}
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                user?.role === 'CUSTOMER'
                  ? 'border-neutral-400 bg-neutral-100'
                  : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-200 text-neutral-700 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold text-neutral-900">
                    Dr. Sameer Joshi
                  </strong>
                  <span className="text-[11px] text-neutral-500">Verified Buyer • Saved Units & Site Visits</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        )}

        {/* Tab 2: Custom Sign In */}
        {activeTab === 'login' && (
          <form onSubmit={handleCustomLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
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
                Role Context
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4A017]"
              >
                <option value="CUSTOMER">Customer / Home Buyer</option>
                <option value="CHANNEL_PARTNER">Registered Channel Partner</option>
                <option value="DEVELOPER">Developer Representative</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[#D4A017] text-neutral-950 font-bold text-sm hover:bg-[#F4C430] active:scale-[0.99] transition-all shadow-xs"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Tab 3: Register */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Full Name / Agency Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full text-sm px-3 py-2 rounded-lg border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-[#D4A017]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
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
                <option value="CUSTOMER">Home Buyer / Tenant</option>
                <option value="CHANNEL_PARTNER">MahaRERA Registered Channel Partner</option>
                <option value="DEVELOPER">Real Estate Developer / Builder</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[#D4A017] text-neutral-950 font-bold text-sm hover:bg-[#F4C430] active:scale-[0.99] transition-all shadow-xs"
            >
              {isLoading ? 'Creating Account...' : 'Create Verified Account'}
            </button>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-neutral-200 text-center">
          <p className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>MahaRERA Compliant & ISO 27001 Certified Access</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
