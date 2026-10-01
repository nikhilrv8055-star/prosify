'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Building,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Zap,
  Lock,
  IndianRupee,
  RefreshCw,
  QrCode,
} from 'lucide-react';

interface GatewayItem {
  id: string;
  name: string;
  type: 'ONLINE' | 'OFFLINE';
  provider: 'RAZORPAY' | 'STRIPE' | 'CASHFREE' | 'UPI_QR' | 'BANK_RTGS' | 'CHEQUE';
  isEnabled: boolean;
  isSandbox: boolean;
  currencies: string[];
  description: string;
  credentials: Record<string, string>;
}

const INITIAL_GATEWAYS: GatewayItem[] = [
  {
    id: 'gw-1',
    name: 'Razorpay Enterprise Auto-Capture',
    type: 'ONLINE',
    provider: 'RAZORPAY',
    isEnabled: true,
    isSandbox: false,
    currencies: ['INR'],
    description: 'Instant UPI, Netbanking, Credit/Debit cards & EMI with automated GST split invoice.',
    credentials: {
      keyId: 'rzp_live_9a87f2e1b4c3',
      keySecret: '••••••••••••••••••••••••',
      webhookSecret: 'whsec_9942a781b',
    },
  },
  {
    id: 'gw-2',
    name: 'Cashfree Payments Gateway',
    type: 'ONLINE',
    provider: 'CASHFREE',
    isEnabled: true,
    isSandbox: false,
    currencies: ['INR'],
    description: 'Instant RTGS/NEFT Virtual Account issuance for high-value token booking deposits.',
    credentials: {
      appId: 'cf_live_enterprise_019',
      secretKey: '••••••••••••••••••••••••',
    },
  },
  {
    id: 'gw-3',
    name: 'Stripe International Card Processing',
    type: 'ONLINE',
    provider: 'STRIPE',
    isEnabled: false,
    isSandbox: true,
    currencies: ['USD', 'AED', 'SGD', 'GBP', 'EUR'],
    description: 'Direct overseas foreign exchange remittance processing for NRI property buyers.',
    credentials: {
      publishableKey: 'pk_test_51Mz990...',
      secretKey: '••••••••••••••••••••••••',
    },
  },
  {
    id: 'gw-4',
    name: 'Dynamic Bharat Dynamic UPI QR Gateway',
    type: 'ONLINE',
    provider: 'UPI_QR',
    isEnabled: true,
    isSandbox: false,
    currencies: ['INR'],
    description: 'Zero transaction surcharge NPCI compliant Bharat QR generation for token amounts up to ₹1,00,000.',
    credentials: {
      vpaId: 'prosify.tech@icici',
      merchantName: 'Prosify Technologies Private Limited',
    },
  },
  {
    id: 'gw-5',
    name: 'Corporate Escrow Bank RTGS / NEFT Transfer',
    type: 'OFFLINE',
    provider: 'BANK_RTGS',
    isEnabled: true,
    isSandbox: false,
    currencies: ['INR'],
    description: 'Direct RERA-designated escrow current account bank remittance with UTR verification.',
    credentials: {
      bankName: 'HDFC Bank Ltd - Corporate Banking Branch',
      accountNumber: '50200088991122',
      ifscCode: 'HDFC0000060',
      beneficiaryName: 'Prosify Technologies Escrow Account',
      branch: 'Fort, Mumbai MMR',
    },
  },
  {
    id: 'gw-6',
    name: 'Banker’s Demand Draft / Pay Order',
    type: 'OFFLINE',
    provider: 'CHEQUE',
    isEnabled: true,
    isSandbox: false,
    currencies: ['INR'],
    description: 'Physical presentation of Banker’s Cheque at executive office with receipt acknowledgement.',
    credentials: {
      payableAt: 'Mumbai',
      inFavourOf: 'Prosify Technologies Pvt Ltd',
      submissionOffice: 'Floor 18, Maker Chambers IV, Nariman Point, Mumbai 400021',
    },
  },
];

export function PaymentGatewaysView({ subview = 'gateway-online' }: { subview?: string }) {
  const [gateways, setGateways] = useState<GatewayItem[]>(INITIAL_GATEWAYS);
  const [activeTab, setActiveTab] = useState<'online' | 'offline'>(
    subview === 'gateway-offline' ? 'offline' : 'online'
  );
  const [toast, setToast] = useState<string | null>(null);
  const [selectedGw, setSelectedGw] = useState<GatewayItem | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleGateway = (id: string) => {
    setGateways(
      gateways.map((g) => (g.id === id ? { ...g, isEnabled: !g.isEnabled } : g))
    );
    showToast('Payment gateway state updated.');
  };

  const handleToggleSandbox = (id: string) => {
    setGateways(
      gateways.map((g) => (g.id === id ? { ...g, isSandbox: !g.isSandbox } : g))
    );
    showToast('Environment mode toggled (Production / Sandbox).');
  };

  const currentGateways = gateways.filter((g) =>
    activeTab === 'online' ? g.type === 'ONLINE' : g.type === 'OFFLINE'
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <span>Payment Gateways & Financial Settlement</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure online payment processors (Razorpay, Cashfree, UPI) and offline RERA escrow bank accounts.
          </p>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('online')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'online' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Online Gateways ({gateways.filter((g) => g.type === 'ONLINE').length})
          </button>
          <button
            onClick={() => setActiveTab('offline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'offline' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Offline Escrow Accounts ({gateways.filter((g) => g.type === 'OFFLINE').length})
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* GATEWAY CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentGateways.map((gw) => (
          <div
            key={gw.id}
            className={`p-5 rounded-2xl bg-[#1E293B]/80 border transition-all flex flex-col justify-between ${
              gw.isEnabled ? 'border-emerald-500/40 bg-slate-900/90' : 'border-slate-800 opacity-75'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    {gw.type === 'ONLINE' ? <Zap className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{gw.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{gw.provider}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {gw.type === 'ONLINE' && (
                    <button
                      onClick={() => handleToggleSandbox(gw.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                        gw.isSandbox
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {gw.isSandbox ? 'SANDBOX' : 'PRODUCTION'}
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleGateway(gw.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      gw.isEnabled
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {gw.isEnabled ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">{gw.description}</p>

              {/* CREDENTIALS PREVIEW */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 font-mono text-[11px]">
                {Object.entries(gw.credentials).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-slate-400">
                    <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-slate-200 font-semibold truncate max-w-[200px]">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                onClick={() => setSelectedGw(gw)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Configure Keys</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CONFIGURATION MODAL */}
      {selectedGw && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Configure {selectedGw.name}</span>
            </h3>

            <div className="space-y-3 text-xs">
              {Object.entries(selectedGw.credentials).map(([k, v]) => (
                <div key={k}>
                  <label className="block text-slate-300 font-medium mb-1 capitalize">
                    {k.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    defaultValue={v}
                    className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-mono"
                  />
                </div>
              ))}

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedGw(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGw(null);
                    showToast(`API credentials updated for ${selectedGw.name}`);
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl"
                >
                  Save Credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
