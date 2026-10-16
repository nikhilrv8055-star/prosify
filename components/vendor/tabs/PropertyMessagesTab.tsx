'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Phone,
  Mail,
  ExternalLink,
  Send,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
} from 'lucide-react';
import { PropertyMessageItem } from '../types';

interface PropertyMessagesTabProps {
  messages: PropertyMessageItem[];
  onReplyMessage: (id: string, replyText: string) => void;
}

export function PropertyMessagesTab({ messages, onReplyMessage }: PropertyMessagesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMsgId, setSelectedMsgId] = useState<string>(messages[0]?.id || '');
  const [replyInput, setReplyInput] = useState('');
  const [replySuccess, setReplySuccess] = useState<string | null>(null);

  const filtered = messages.filter(
    (m) =>
      m.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMsg = messages.find((m) => m.id === selectedMsgId) || messages[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeMsg) return;

    onReplyMessage(activeMsg.id, replyInput);
    setReplySuccess(`Reply sent to ${activeMsg.senderName}!`);
    setReplyInput('');
    setTimeout(() => setReplySuccess(null), 3500);
  };

  const handleQuickTemplate = (text: string) => {
    setReplyInput(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-400" />
          <span>Property Messages & Buyer Inquiries</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Respond directly to verified buyers, schedule site-visits, and provide price quotations.
        </p>
      </div>

      {replySuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{replySuccess}</span>
        </div>
      )}

      {/* Two-Column Messenger Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 rounded-2xl bg-[#1E293B]/80 border border-slate-700 overflow-hidden shadow-2xl min-h-[580px]">
        {/* Messages List (Left column - 5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-800 p-4 space-y-3 flex flex-col">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sender, property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">No inquiries found.</div>
            ) : (
              filtered.map((msg) => {
                const isSelected = activeMsg?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMsgId(msg.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-slate-800/90 border-amber-500/60 shadow-md'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <strong className={`font-semibold ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                        {msg.senderName}
                      </strong>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    <p className="text-[11px] text-sky-300 font-medium truncate flex items-center gap-1">
                      <Building2 className="w-3 h-3 shrink-0" />
                      <span>{msg.propertyTitle}</span>
                    </p>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="pt-1 flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          msg.status === 'NEW'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : msg.status === 'SITE_VISIT_REQUESTED'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {msg.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message Thread Detail & Reply Composer (Right column - 7 cols) */}
        {activeMsg ? (
          <div className="lg:col-span-7 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Inquirer Header */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{activeMsg.senderName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-normal">
                      Verified Buyer
                    </span>
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1 font-mono text-cyan-300">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>{activeMsg.senderPhone}</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span>{activeMsg.senderEmail}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://wa.me/919167991679"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1"
                  >
                    <span>WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Property Inquired */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Inquiring about: <strong className="text-white">{activeMsg.propertyTitle}</strong></span>
              </div>

              {/* Message Bubble */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-500 font-mono block">Received: {activeMsg.timestamp}</span>
                <p className="text-xs text-slate-200 leading-relaxed">{activeMsg.message}</p>
              </div>

              {/* Quick Reply Templates */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Quick Reply Shortcuts
                </span>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickTemplate(
                        'Thank you for your inquiry. I would be pleased to host you for a private site-visit this Saturday at 11 AM.'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    Confirm Saturday Site Visit
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickTemplate(
                        'I have attached the verified RERA floor plans and exclusive all-inclusive pricing schedule for this unit.'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    Share Price & Brochure
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickTemplate(
                        'Our senior relationship manager will call you directly in 15 minutes to answer any financial questions.'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    Callback in 15 mins
                  </button>
                </div>
              </div>
            </div>

            {/* Reply Composer Form */}
            <form onSubmit={handleSendReply} className="space-y-2 pt-2 border-t border-slate-800">
              <textarea
                rows={3}
                placeholder="Type your official reply to this buyer..."
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Replies will be delivered to buyer via email & SMS</span>
                <button
                  type="submit"
                  disabled={!replyInput.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-7 flex items-center justify-center text-slate-500 text-xs">
            Select a message from the list to view and reply.
          </div>
        )}
      </div>
    </div>
  );
}
