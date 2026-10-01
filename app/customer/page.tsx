'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Home,
  FileCheck2,
  Receipt,
  PhoneCall,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Shield,
  AlertCircle,
  LogOut,
  Sparkles,
  MapPin,
  Building,
  User,
  CreditCard,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  PortalUser,
  authenticatePortalUser,
  getPortalSession,
  setPortalSession,
  clearPortalSession,
} from '@/lib/auth/portalUsers';

interface ConstructionMilestone {
  stage: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
  percentage: number;
  date: string;
}

const MILESTONES: ConstructionMilestone[] = [
  { stage: 'Excavation & Substructure', status: 'COMPLETED', percentage: 100, date: 'Completed Dec 2024' },
  { stage: 'Plinth Level & Foundation', status: 'COMPLETED', percentage: 100, date: 'Completed Mar 2025' },
  { stage: '14th Floor RCC Slab Casting', status: 'COMPLETED', percentage: 100, date: 'Completed Jun 2025' },
  { stage: 'Brickwork & Internal Plastering', status: 'IN_PROGRESS', percentage: 65, date: 'Target: Nov 2025' },
  { stage: 'Flooring, Plumbing & Electrical', status: 'UPCOMING', percentage: 0, date: 'Target: Mar 2026' },
  { stage: 'Final Painting, Lift & OC Handover', status: 'UPCOMING', percentage: 0, date: 'Target: Dec 2026' },
];

export default function CustomerPortalPage() {
  const [session, setSession] = useState<PortalUser | null>(() => getPortalSession('CUSTOMER'));
  const [authChecked, setAuthChecked] = useState(true);

  // Login form state
  const [usernameInput, setUsernameInput] = useState('customer@eni.com');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Portal tab state
  const [activeTab, setActiveTab] = useState<'timeline' | 'payments' | 'documents' | 'support' | 'profile'>('timeline');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    const result = authenticatePortalUser(usernameInput, passwordInput, 'CUSTOMER');
    if (result.success && result.user) {
      setPortalSession('CUSTOMER', result.user);
      setSession(result.user);
    } else {
      setLoginError(result.error || 'Authentication failed. Please verify credentials set in Admin Panel.');
    }
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    clearPortalSession('CUSTOMER');
    setSession(null);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // LOGIN SCREEN
  if (!session) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#0EA5E9]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl bg-[#1E293B] border border-slate-700 p-2 flex items-center justify-center shadow-xl">
              <Image
                src="https://mkblktzjrmjktfdnmtql.supabase.co/storage/v1/object/public/eni%20ai%20logo/eni%20ai%20robot%20model.png"
                alt="ENI AI Mascot"
                width={52}
                height={52}
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <h2 className="text-center text-2xl font-black tracking-tight text-white">
            ENI CUSTOMER & CLIENT PORTAL
          </h2>
          <p className="mt-1 text-center text-xs text-slate-400">
            Exclusive Buyer Suite: Bookings, Milestones & Official Documents
          </p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
          <div className="bg-[#1E293B]/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl border border-slate-700">
            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Customer Email or Registered Phone
                </label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="customer@eni.com"
                  className="w-full px-3.5 py-2.5 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Password (Managed via Admin Panel)
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Controlled Credentials</span>
                </div>
                <p>
                  Passwords for all customer accounts are set and managed directly inside the <strong>Admin Panel (/admin)</strong>.
                </p>
                <p className="text-slate-500">
                  Pre-configured demo: <code className="text-slate-300 font-mono">customer@eni.com</code> / <code className="text-slate-300 font-mono">password123</code>
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#10B981] to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-98 cursor-pointer"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In to Customer Suite'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Have an inquiry?</span>
              {/* WhatsApp rule: button text MUST ONLY say "WhatsApp" */}
              <a
                href="https://wa.me/919326303244"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CUSTOMER DASHBOARD
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-200 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-slate-700 p-1 flex items-center justify-center">
              <Image
                src="https://mkblktzjrmjktfdnmtql.supabase.co/storage/v1/object/public/eni%20ai%20logo/eni%20ai%20robot%20model.png"
                alt="ENI AI Mascot"
                width={32}
                height={32}
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-sm tracking-wide">ENI CLIENT SUITE</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                  {session.assignedCode || 'CUST-ACTIVE'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{session.name} • {session.companyOrProject}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* WhatsApp Support: button text MUST ONLY say "WhatsApp" */}
            <a
              href="https://wa.me/919326303244"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all"
            >
              <span>WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Booking Highlight Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1E293B] via-[#1E293B]/95 to-slate-900 border border-slate-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">CONFIRMED ALLOTMENT</span>
            <h2 className="text-xl font-black text-white mt-0.5">Lodha Crown Tower A - Unit 1402</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300 font-semibold">
                <Building className="w-3.5 h-3.5 text-[#10B981]" /> 2 BHK Premium
              </span>
              <span>•</span>
              <span>Carpet Area: <strong>685 sq.ft</strong></span>
              <span>•</span>
              <span className="font-bold text-[#10B981]">Agreement Value: ₹84,50,000</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Overall Construction</span>
            <span className="text-2xl font-black text-emerald-400">72% Completed</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Target Possession: Dec 2026</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'timeline', label: 'Construction Progress', icon: Layers },
            { id: 'payments', label: 'Payment Schedule', icon: Receipt },
            { id: 'documents', label: 'Documents & Deeds', icon: FileCheck2 },
            { id: 'support', label: 'Relationship Manager', icon: PhoneCall },
            { id: 'profile', label: 'Buyer Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#10B981] text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-[#1E293B]/60 text-slate-300 hover:bg-[#1E293B] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Construction Timeline */}
        {activeTab === 'timeline' && (
          <div className="rounded-2xl bg-[#1E293B]/90 border border-slate-700 p-6 space-y-6">
            <div>
              <h3 className="font-bold text-white text-base">Verified Site Construction Milestones</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every milestone is inspected and certified by registered structural engineers and RERA compliance auditors.
              </p>
            </div>

            <div className="space-y-4">
              {MILESTONES.map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        m.status === 'COMPLETED'
                          ? 'bg-emerald-500 text-slate-950'
                          : m.status === 'IN_PROGRESS'
                          ? 'bg-[#0EA5E9] text-slate-950 animate-pulse'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {m.status === 'COMPLETED' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-[11px] font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{m.stage}</div>
                      <div className="text-[11px] text-slate-400">{m.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:text-right">
                    <div className="w-32 bg-slate-800 h-2.5 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="bg-gradient-to-r from-[#10B981] to-emerald-400 h-full rounded-full transition-all"
                        style={{ width: `${m.percentage}%` }}
                      />
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        m.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : m.status === 'IN_PROGRESS'
                          ? 'bg-[#0EA5E9]/20 text-[#0EA5E9] border-[#0EA5E9]/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Payment Schedule */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#1E293B] border border-slate-700">
                <span className="text-[11px] text-slate-400 block font-semibold">Total Paid to Date</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">₹59,15,000</span>
                <span className="text-[11px] text-slate-400">70% of Total Agreement</span>
              </div>
              <div className="p-4 rounded-xl bg-[#1E293B] border border-slate-700">
                <span className="text-[11px] text-slate-400 block font-semibold">Next Demand Notice</span>
                <span className="text-2xl font-black text-amber-300 mt-1 block">₹8,45,000</span>
                <span className="text-[11px] text-amber-400">Due upon Brickwork completion</span>
              </div>
              <div className="p-4 rounded-xl bg-[#1E293B] border border-slate-700">
                <span className="text-[11px] text-slate-400 block font-semibold">Balance on Possession</span>
                <span className="text-2xl font-black text-white mt-1 block">₹16,90,000</span>
                <span className="text-[11px] text-slate-400">Key Handover & Registration</span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#1E293B]/90 border border-slate-700 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Milestone Demand</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment Receipt</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-white">Booking Token & Agreement Registration</td>
                    <td className="py-3.5 px-4">20%</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">₹16,90,000</td>
                    <td className="py-3.5 px-4 text-[#0EA5E9] font-mono">RCT-LOD-2024-0019</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">PAID</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-white">Completion of Plinth Level</td>
                    <td className="py-3.5 px-4">20%</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">₹16,90,000</td>
                    <td className="py-3.5 px-4 text-[#0EA5E9] font-mono">RCT-LOD-2025-0142</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">PAID</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-white">Completion of 14th Slab</td>
                    <td className="py-3.5 px-4">30%</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">₹25,35,000</td>
                    <td className="py-3.5 px-4 text-[#0EA5E9] font-mono">RCT-LOD-2025-0810</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">PAID</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-white">Completion of Brickwork & Plaster</td>
                    <td className="py-3.5 px-4">10%</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-300">₹8,45,000</td>
                    <td className="py-3.5 px-4 text-slate-400">Demand Letter Pending</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">UPCOMING</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Documents & Deeds */}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: 'Registered Agreement for Sale (Index II)',
                date: 'Executed on 12 Jan 2025',
                number: 'Registration: BDR-4-00192-2025',
              },
              {
                title: 'Official Allotment Letter',
                date: 'Issued on 02 Jan 2025',
                number: 'Ref: LODHA-CRN-1402',
              },
              {
                title: 'MahaRERA Project Certification & Layout Sanctions',
                date: 'Certified Valid till Dec 2027',
                number: 'RERA: P51700016302',
              },
              {
                title: 'Structural Stability & Fire NOC Certificates',
                date: 'Approved by Thane Municipal Corp',
                number: 'TMC-NOC-7781-B',
              },
            ].map((doc, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#1E293B]/90 border border-slate-700 flex flex-col justify-between gap-3">
                <div>
                  <h4 className="font-bold text-white text-sm">{doc.title}</h4>
                  <div className="text-[11px] text-slate-400 mt-1">{doc.date}</div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-0.5">{doc.number}</div>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Downloading verified copy of: ${doc.title}`)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Download Digital Copy</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: Relationship Manager */}
        {activeTab === 'support' && (
          <div className="max-w-xl rounded-2xl bg-[#1E293B]/90 border border-slate-700 p-6 space-y-4 text-xs">
            <h3 className="font-bold text-white text-base">Your Dedicated Relationship Executive</h3>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg">
                AS
              </div>
              <div>
                <div className="font-bold text-white text-sm">Amit Sharma</div>
                <div className="text-slate-400 text-xs">Senior Relationship Director • Lodha Projects</div>
                <div className="text-emerald-400 text-[11px] font-mono">Direct Desk: +91 93263 03244</div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-slate-400 text-xs leading-relaxed">
                Need to schedule a guided site inspection, request interior customisations, or check home loan disbursement status?
              </p>
              {/* WhatsApp rule: button text MUST ONLY say "WhatsApp" */}
              <a
                href="https://wa.me/919326303244"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* TAB 5: Profile */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl rounded-2xl bg-[#1E293B]/90 border border-slate-700 p-6 space-y-4 text-xs">
            <h3 className="font-bold text-white text-base">Registered Buyer Profile</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 text-[11px] block">Primary Applicant</span>
                <strong className="text-white text-sm">{session.name}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Co-Applicant</span>
                <strong className="text-white text-sm">Ananya Singhania</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Login Username</span>
                <span className="font-mono text-slate-300">{session.username}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Password Control</span>
                <span className="text-amber-400 font-semibold">Managed exclusively via Admin Panel</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
