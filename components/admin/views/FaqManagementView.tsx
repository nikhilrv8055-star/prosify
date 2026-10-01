'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'BUYERS' | 'VENDORS' | 'BROKERS' | 'LEGAL';
  order: number;
}

const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How does Prosify guarantee 100% verified MahaRERA property pricing?',
    answer:
      'All inventory on Prosify is synced directly via secure authenticated API from Grade-A builders and audited by licensed legal professionals before publication. No phantom pricing or dummy units are allowed.',
    category: 'BUYERS',
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'What is the procedure for builders to push automated unit statuses?',
    answer:
      'Grade-A builders are issued high-security Bearer tokens and webhook endpoints (/api/developer-api/push) with IP whitelisting to push real-time unit status transitions (AVAILABLE, BLOCKED, BOOKED, SOLD).',
    category: 'VENDORS',
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'How are Channel Partner brokerage payouts and TDS handled under Indian law?',
    answer:
      'Commissions are disbursed through direct RTGS/NEFT escrow with statutory 5% Section 194H TDS deduction. Digital Form 16A certificates are automatically generated quarterly.',
    category: 'BROKERS',
    order: 3,
  },
  {
    id: 'faq-4',
    question: 'Is there any fee or hidden charge for homebuyers on Prosify?',
    answer:
      'No. Homebuyers enjoy 100% zero brokerage and direct developer pricing without any markup, transaction tax, or concierge fee.',
    category: 'BUYERS',
    order: 4,
  },
];

export function FaqManagementView() {
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [openId, setOpenId] = useState<string | null>(INITIAL_FAQS[0]?.id || null);
  const [toast, setToast] = useState<string | null>(null);

  // New FAQ Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
    category: 'BUYERS' as FaqItem['category'],
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;
    const f: FaqItem = {
      id: `faq-${Date.now()}`,
      question: newFaq.question,
      answer: newFaq.answer,
      category: newFaq.category,
      order: faqs.length + 1,
    };
    setFaqs([...faqs, f]);
    setIsModalOpen(false);
    setNewFaq({ question: '', answer: '', category: 'BUYERS' });
    showToast('FAQ successfully added to knowledge base!');
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
    showToast('FAQ removed.');
  };

  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <span>FAQ & Knowledge Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure frequently asked questions for buyers, vendor developers, and independent channel partners.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search FAQs by question keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white"
        >
          <option value="ALL">All FAQ Audiences</option>
          <option value="BUYERS">Homebuyers</option>
          <option value="VENDORS">Developers & Vendors</option>
          <option value="BROKERS">Channel Partners & Brokers</option>
          <option value="LEGAL">Legal & RERA</option>
        </select>
      </div>

      {/* ACCORDION LIST */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="rounded-2xl border border-slate-800 bg-[#1E293B]/70 overflow-hidden transition-all shadow-md"
            >
              <div
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {faq.category}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-white">{faq.question}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFaq(faq.id);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {isOpen && (
                <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-900/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CREATE FAQ MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span>Create New FAQ</span>
            </h3>

            <form onSubmit={handleAddFaq} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Audience Category</label>
                <select
                  value={newFaq.category}
                  onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                >
                  <option value="BUYERS">Homebuyers & Investors</option>
                  <option value="VENDORS">Developers & Materials Vendors</option>
                  <option value="BROKERS">Channel Partners & Brokers</option>
                  <option value="LEGAL">Legal, RERA & Tax Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What is the stamp duty rate in Maharashtra for 2026?"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Verified Answer</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed regulatory or operational answer..."
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl"
                >
                  Add FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
