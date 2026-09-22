'use client';

import React from 'react';
import { Bell, X, CheckCircle, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface MobileNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'launch' | 'price' | 'rera' | 'service';
  link?: string;
  unread: boolean;
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'New Launch: Godrej Riviera Phase 2',
    desc: 'Pre-launch bookings opened with introductory 2% spot discount & guaranteed rental yield in Kalyan.',
    time: '10m ago',
    type: 'launch',
    link: '/projects/godrej-riviera',
    unread: true,
  },
  {
    id: 'n2',
    title: 'MahaRERA Registration Approved',
    desc: 'Lodha Palava Lakeshore Green Phase 4 updated with new completion certificate.',
    time: '2h ago',
    type: 'rera',
    link: '/projects/lodha-palava-city',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Price Adjustment Alert',
    desc: 'Luxury 3 BHK in Oberoi Sky City, Borivali East updated to direct developer price of ₹3.90 Cr.',
    time: 'Yesterday',
    type: 'price',
    link: '/properties',
    unread: false,
  },
  {
    id: 'n4',
    title: 'Free Home Loan Consultation',
    desc: 'Exclusive 8.35% SBI & HDFC home loan rates available for verified Prosify homebuyers.',
    time: '2 days ago',
    type: 'service',
    unread: false,
  },
];

export function MobileNotificationsModal({ isOpen, onClose }: MobileNotificationsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#D4A017]/20 border border-[#D4A017]/40 flex items-center justify-center text-[#D4A017]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Notifications & Alerts</h3>
              <p className="text-[11px] text-neutral-400">Prosify Real Estate Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 p-2">
          {SAMPLE_NOTIFICATIONS.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl transition-colors ${
                item.unread ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#D4A017] shrink-0" />
                  )}
                  <h4 className="text-xs font-bold text-neutral-950 line-clamp-1">{item.title}</h4>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono shrink-0">{item.time}</span>
              </div>
              <p className="text-[11px] text-neutral-600 leading-relaxed mb-2.5">{item.desc}</p>
              {item.link && (
                <Link
                  href={item.link}
                  onClick={onClose}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D4A017] hover:text-[#B8860B]"
                >
                  <span>View Update</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">2 unread alerts</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
