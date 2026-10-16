'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  CheckCircle2,
  Send,
  Building,
} from 'lucide-react';
import { Navbar } from '@/components/marketplace/Navbar';
import { Footer } from '@/components/marketplace/Footer';
import { brandConfig } from '@/src/config/brand';
import { store } from '@/lib/data/store';
import { useBrandSettings } from '@/lib/data/useBrandSettings';
import { CrmInquiryForm } from '@/components/crm/CrmInquiryForm';

export default function ContactPage() {
  const brandSettings = useBrandSettings();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          source: 'WEBSITE',
          requirement: formData.subject,
          notes: formData.message,
          location: 'Pan-India',
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        store.ingestLead(data.data);
      } else {
        const fallbackLead = store.createLead({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          source: 'WEBSITE',
          requirement: formData.subject,
          notes: formData.message,
          location: 'Pan-India',
          budget: 'Flexible',
        });
        store.ingestLead(fallbackLead);
      }
      setSubmitted(true);
    } catch {
      const fallbackLead = store.createLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        source: 'WEBSITE',
        requirement: formData.subject,
        notes: formData.message,
        location: 'Pan-India',
        budget: 'Flexible',
      });
      store.ingestLead(fallbackLead);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50">
      <Navbar />

      {/* Header */}
      <div className="bg-[#171717] text-white py-14 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">
            24/7 Homebuyer & Partner Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Contact {brandConfig.name} Advisory
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl">
            Have questions about a property, channel partner onboarding, or site visits? Connect with our senior advisory team.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Contact Info & Offices */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-neutral-950">Corporate Headquarters</h3>
              
              <div className="space-y-3 text-xs text-neutral-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900 font-semibold">BKC Corporate Office:</strong>
                    <span>Level 8, The Capital, G Block, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900 font-semibold">Toll-Free Helpline:</strong>
                    <span>+91 1800 209 8899 / +91 98201 45890</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900 font-semibold">Email:</strong>
                    <a
                      href={`mailto:${brandSettings.contactEmail || brandSettings.supportEmail || 'hello4home@gmail.com'}`}
                      className="text-neutral-800 hover:text-amber-600 transition-colors"
                    >
                      {brandSettings.contactEmail || brandSettings.supportEmail || 'hello4home@gmail.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900 font-semibold">Operational Hours:</strong>
                    <span>Monday - Sunday: 9:00 AM – 8:00 PM IST</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100">
                <a
                  href="https://wa.me/919167991679"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Regional Branches */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-neutral-950">Regional Hubs</h4>
              <div className="space-y-2 text-xs text-neutral-600">
                <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                  <strong className="block text-neutral-900">Thane & Dombivli Hub:</strong>
                  <span>Gokhale Road, Naupada, Thane West - 400602</span>
                </div>
                <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                  <strong className="block text-neutral-900">Pune Regional Office:</strong>
                  <span>Senapati Bapat Road, Shivaji Nagar, Pune - 411016</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Robust CRM Lead Capture Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#171717] text-white p-6 sm:p-8 rounded-3xl border border-neutral-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Send className="w-5 h-5 text-[#10B981]" />
                    <span>Send Us an Inquiry / Request Callback</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    100% verified advisory with automated CRM attribution, RERA compliance, and zero brokerage.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 shrink-0 self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                  <span>CRM Webhook Connected</span>
                </div>
              </div>

              {/* Robust CRM Lead Form with 10-digit Indian validation, honeypot, UTM capture */}
              <CrmInquiryForm
                defaultInquiryType="General Advisory & Search"
                leadTag="Contact_Page_Inquiry"
                cityDefault="Mumbai"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
