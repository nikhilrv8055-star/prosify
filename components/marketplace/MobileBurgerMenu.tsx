'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { RightMenuDrawer } from './RightMenuDrawer';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  User,
  Home,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Truck,
  Paintbrush,
  FileCheck2,
  Gift,
  Receipt,
  Crown,
  Building2,
  Briefcase,
  Users,
  BookOpen,
  PhoneCall,
  Mail,
  CheckCircle2,
  Copy,
  ExternalLink,
  Search,
  Key,
  ShieldCheck,
  Printer,
  Send,
  MapPin,
  MessageCircle,
  LayoutGrid,
  Tag,
  Wind,
  Wrench,
  Zap,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';
import { useToast } from '@/components/ui/toast';
import { brandConfig } from '@/src/config/brand';
import { PostPropertyModal } from './PostPropertyModal';
import { PropertyRequirementModal } from './PropertyRequirementModal';
import { SmartMatcherModal } from './SmartMatcherModal';
import {
  MobileServicesModal,
  MobileBillPaymentsModal,
} from './MobileGlassModals';

interface MobileBurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMatcher?: () => void;
}

export function MobileBurgerMenu({ isOpen, onClose, onOpenMatcher }: MobileBurgerMenuProps) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { toast } = useToast();

  // Accordion state for right sidebar dropdown menu
  const [commercialPlansExpanded, setCommercialPlansExpanded] = useState(false);
  const [contactUsExpanded, setContactUsExpanded] = useState(true);

  // Active sub-modals
  const [postPropertyOpen, setPostPropertyOpen] = useState(false);
  const [requirementModalOpen, setRequirementModalOpen] = useState(false);
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [servicesInitialService, setServicesInitialService] = useState<'interiors' | 'movers' | 'loan' | 'legal'>('interiors');
  const [billsModalOpen, setBillsModalOpen] = useState(false);

  // Dedicated custom modals for the requested items
  const [referEarnOpen, setReferEarnOpen] = useState(false);
  const [careersOpen, setCareersOpen] = useState(false);
  const [corporateEnquiryOpen, setCorporateEnquiryOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const [careersForm, setCareersForm] = useState({
    name: '',
    email: '',
    role: 'Real Estate Sales Partner',
    experience: '2-4 Years',
    phone: '',
  });
  const [careersSubmitted, setCareersSubmitted] = useState(false);

  const [corporateForm, setCorporateForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    city: 'Mumbai',
    requirement: 'Commercial Office Space (5,000+ sq.ft)',
  });
  const [corporateSubmitted, setCorporateSubmitted] = useState(false);

  // Client-side mounted state for React Portal rendering without cascading renders
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [internalMatcherOpen, setInternalMatcherOpen] = useState(false);

  const handleOpenSmartMatcher = () => {
    if (onOpenMatcher) {
      onOpenMatcher();
      onClose();
    } else {
      setInternalMatcherOpen(true);
    }
  };

  const isAnySubModalOpen =
    postPropertyOpen ||
    requirementModalOpen ||
    internalMatcherOpen ||
    servicesModalOpen ||
    billsModalOpen ||
    referEarnOpen ||
    careersOpen ||
    corporateEnquiryOpen ||
    blogOpen ||
    contactOpen;

  // Lock body scroll and listen to ESC key to close
  useEffect(() => {
    if (!isOpen && !isAnySubModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAnySubModalOpen) {
          setPostPropertyOpen(false);
          setRequirementModalOpen(false);
          setServicesModalOpen(false);
          setBillsModalOpen(false);
          setReferEarnOpen(false);
          setCareersOpen(false);
          setCorporateEnquiryOpen(false);
          setBlogOpen(false);
          setContactOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isAnySubModalOpen, onClose]);

  const handleAuthClick = () => {
    if (!isAuthenticated) {
      onClose();
      openAuthModal();
    }
  };

  const handleCopyEmail = () => {
    const email = brandConfig.contact.supportEmail;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email);
    }
    toast({
      title: 'Email Copied!',
      description: `${email} copied to clipboard. Opening mail client...`,
      type: 'success',
    });
    setTimeout(() => {
      window.location.href = `mailto:${email}?subject=Inquiry%20via%20Prosify`;
    }, 600);
  };

  const handleCopyReferral = () => {
    const link = `${typeof window !== 'undefined' ? window.location.origin : 'https://prosify.in'}?referral=PROSIFY1000`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    toast({
      title: 'Referral Link Copied!',
      description: 'Share this link to earn ₹1,000 cash credit when your friends buy or list!',
      type: 'success',
    });
  };

  if ((!isOpen && !isAnySubModalOpen) || !isMounted) return null;

  return createPortal(
    <>
      {isOpen && !isAnySubModalOpen && (
        <RightMenuDrawer
          onClose={onClose}
          onOpenPostProperty={() => setPostPropertyOpen(true)}
          onOpenRequirement={() => setRequirementModalOpen(true)}
          onOpenMatcher={handleOpenSmartMatcher}
          onOpenServices={(serviceType) => {
            if (serviceType) setServicesInitialService(serviceType);
            setServicesModalOpen(true);
          }}
          onOpenReferEarn={() => setReferEarnOpen(true)}
          onOpenCareers={() => setCareersOpen(true)}
          onOpenCorporateEnquiry={() => setCorporateEnquiryOpen(true)}
          onOpenBlog={() => setBlogOpen(true)}
          onOpenSupport={() => setContactOpen(true)}
          onOpenContact={() => setContactOpen(true)}
          onCopyEmail={handleCopyEmail}
        />
      )}

      {/* =================================================================== */}
      {/* SUB-MODALS FOR ALL 16 ITEMS                                         */}
      {/* =================================================================== */}

      {/* 1. Post Property Modal */}
      <PostPropertyModal
        isOpen={postPropertyOpen}
        onClose={() => setPostPropertyOpen(false)}
      />

      {/* 2. Property Requirement Modal */}
      <PropertyRequirementModal
        isOpen={requirementModalOpen}
        onClose={() => setRequirementModalOpen(false)}
      />

      {/* 2b. AI Smart Property Matcher Modal */}
      <SmartMatcherModal
        isOpen={internalMatcherOpen}
        onClose={() => setInternalMatcherOpen(false)}
      />

      {/* 3 & 4. Painting, Cleaning, Packers and Movers */}
      <MobileServicesModal
        isOpen={servicesModalOpen}
        onClose={() => setServicesModalOpen(false)}
        initialService={servicesInitialService}
      />

      {/* 5. Refer & Earn Modal */}
      {referEarnOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 relative border border-neutral-200">
            <button
              onClick={() => setReferEarnOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Refer & Earn Rewards</h3>
                <span className="text-xs text-[#D4A017] font-semibold">Earn ₹1,000 Cash Credit Per Referral</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-neutral-600">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50/80 border border-amber-200">
                <span className="text-[11px] text-neutral-500 block">Your Available Reward Balance</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-neutral-900">₹1,500</span>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    Ready to Withdraw
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-neutral-800">Your Exclusive Referral Link:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://prosify.in?referral=PROSIFY1000"
                    className="flex-1 px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 font-mono text-[11px] text-neutral-700"
                  />
                  <button
                    type="button"
                    onClick={handleCopyReferral}
                    className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1 text-[11px]">
                <p className="font-bold text-neutral-800">How it works:</p>
                <p>1. Share your link with friends looking to buy, sell or invest.</p>
                <p>2. When they book a property or service on Prosify, both get ₹1,000.</p>
                <p>3. Instant transfer directly to your UPI / bank account.</p>
              </div>

              <button
                type="button"
                onClick={handleCopyReferral}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-neutral-950" />
                <span>Copy Link & Share on WhatsApp</span>
              </button>

              <Link
                href="/affiliate"
                onClick={() => {
                  setReferEarnOpen(false);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Open Full Affiliate & Broker Program (Earn 3%)</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 12. Careers Modal */}
      {careersOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 relative border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCareersOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Careers at {brandConfig.name}</h3>
                <span className="text-xs text-emerald-600 font-semibold">Join Our High-Growth PropTech Advisory Team</span>
              </div>
            </div>

            {!careersSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setCareersSubmitted(true);
                  toast({
                    title: 'Application Submitted!',
                    description: 'Thank you for applying. Our talent team will reach out via email.',
                    type: 'success',
                  });
                }}
                className="space-y-3 text-xs"
              >
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-900">
                  We are actively hiring <strong>Senior Property Advisors</strong>, <strong>React/Next.js Engineers</strong>, and <strong>Legal Associates</strong> in Mumbai, Bengaluru & Pune.
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={careersForm.name}
                    onChange={(e) => setCareersForm({ ...careersForm, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={careersForm.email}
                      onChange={(e) => setCareersForm({ ...careersForm, email: e.target.value })}
                      placeholder="your.name@gmail.com"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={careersForm.phone}
                      onChange={(e) => setCareersForm({ ...careersForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Position of Interest</label>
                  <select
                    value={careersForm.role}
                    onChange={(e) => setCareersForm({ ...careersForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold bg-white"
                  >
                    <option>Real Estate Senior Property Advisor</option>
                    <option>Full-Stack / Frontend Next.js Engineer</option>
                    <option>Legal & RERA Compliance Specialist</option>
                    <option>Channel Partner Growth Executive</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Candidate Profile</span>
                </button>
              </form>
            ) : (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-neutral-900">Application Received!</h4>
                <p className="text-xs text-neutral-600">
                  Our HR & Talent Team at {brandConfig.contact.supportEmail} will review your profile and reach out within 48 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setCareersOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 13. Corporate Enquiry Modal */}
      {corporateEnquiryOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 relative border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCorporateEnquiryOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center">
                <Users className="w-5 h-5 text-[#D4A017]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Corporate & Institutional Enquiry</h3>
                <span className="text-xs text-neutral-500 font-semibold">Bulk Commercial Leasing & Developer Partnerships</span>
              </div>
            </div>

            {!corporateSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setCorporateSubmitted(true);
                  toast({
                    title: 'Corporate Enquiry Logged',
                    description: 'Our Senior Director of Commercial Advisory will connect with your office today.',
                    type: 'success',
                  });
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Company / Organization Name</label>
                  <input
                    type="text"
                    required
                    value={corporateForm.companyName}
                    onChange={(e) => setCorporateForm({ ...corporateForm, companyName: e.target.value })}
                    placeholder="e.g. Acme Tech Corp"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Contact Person</label>
                    <input
                      type="text"
                      required
                      value={corporateForm.contactPerson}
                      onChange={(e) => setCorporateForm({ ...corporateForm, contactPerson: e.target.value })}
                      placeholder="Your Name / Designation"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Official Mobile / Phone</label>
                    <input
                      type="tel"
                      required
                      value={corporateForm.phone}
                      onChange={(e) => setCorporateForm({ ...corporateForm, phone: e.target.value })}
                      placeholder="+91 98200 11223"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Requirement Scope</label>
                  <select
                    value={corporateForm.requirement}
                    onChange={(e) => setCorporateForm({ ...corporateForm, requirement: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold bg-white"
                  >
                    <option>Commercial Office Space (5,000+ sq.ft)</option>
                    <option>Bulk Corporate Housing / Employee Relocation</option>
                    <option>Developer Sole Selling & Marketing Mandate</option>
                    <option>Warehousing & Logistics Hub Acquisition</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#D4A017]" />
                  <span>Submit Corporate Request</span>
                </button>
              </form>
            ) : (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#D4A017] mx-auto" />
                <h4 className="text-base font-bold text-neutral-900">Enquiry Received!</h4>
                <p className="text-xs text-neutral-600">
                  Our Corporate Advisory desk will reach out to {corporateForm.companyName || 'your office'} shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setCorporateEnquiryOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 14. Blog Modal */}
      {blogOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 relative border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setBlogOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-violet-100 text-violet-800 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">{brandConfig.name} Insights & Blog</h3>
                <span className="text-xs text-violet-600 font-semibold">Real Estate Intelligence, Trends & Legal Guides</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {[
                {
                  title: 'Mumbai MMR & Pune Property Capital Appreciation Index 2026',
                  tag: 'Market Trends',
                  date: 'Sep 2026',
                  desc: 'Analysis of metro expansion corridors, infrastructure capital appreciation in Western suburbs and high-growth investment pockets.',
                },
                {
                  title: 'How to Save ₹2 Lakhs in Taxes on Home Loan Interest (Sec 24b)',
                  tag: 'Tax Benefits',
                  date: 'Aug 2026',
                  desc: 'Everything you need to know about Section 24(b), Section 80C principal deduction, and joint home loan tax benefits for property buyers.',
                },
                {
                  title: 'Maharashtra & Karnataka RERA Compliance Checklist for Homebuyers',
                  tag: 'Legal Guide',
                  date: 'Jul 2026',
                  desc: '30-year title searches, encumbrance certificates, and how to verify approved floor plans before booking.',
                },
              ].map((post, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl border border-neutral-200 hover:border-[#D4A017] hover:bg-amber-50/30 transition-all cursor-pointer"
                  onClick={() => {
                    toast({
                      title: post.title,
                      description: 'Article opened. Full analytical report loaded.',
                      type: 'info',
                    });
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
                      {post.tag}
                    </span>
                    <span className="text-[10px] text-neutral-400">{post.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900 leading-snug">{post.title}</h4>
                  <p className="text-[11px] text-neutral-500 mt-1">{post.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 15. Contact Us Modal */}
      {contactOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 relative border border-neutral-200">
            <button
              onClick={() => setContactOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Contact {brandConfig.name} Advisory</h3>
                <span className="text-xs text-emerald-600 font-semibold">24x7 Customer Support Desk</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-neutral-600">
              <a
                href={`tel:${brandConfig.contact.phone.replace(/\s+/g, '')}`}
                className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center gap-3 hover:bg-emerald-50 hover:border-emerald-200 transition-all text-neutral-900"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-500 block">Toll-Free Phone Helpline</span>
                  <span className="font-bold text-xs">{brandConfig.contact.phone}</span>
                </div>
              </a>

              <a
                href={`https://wa.me/${brandConfig.contact.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Prosify,%20I%20have%20an%20inquiry`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center gap-3 hover:bg-emerald-50 hover:border-emerald-200 transition-all text-neutral-900"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-500 block">Instant WhatsApp Advisory</span>
                  <span className="font-bold text-xs">{brandConfig.contact.whatsapp}</span>
                </div>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-full p-3 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center gap-3 hover:bg-amber-50 hover:border-amber-200 transition-all text-left text-neutral-900"
              >
                <div className="w-9 h-9 rounded-xl bg-[#D4A017] text-neutral-950 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-500 block">Official Support Email</span>
                  <span className="font-bold text-xs">{brandConfig.contact.supportEmail}</span>
                </div>
              </button>

              <div className="p-3 rounded-2xl bg-neutral-100/70 border border-neutral-200 text-[11px] text-neutral-600 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <span>{brandConfig.contact.address}</span>
              </div>

              <Link
                href="/contact"
                onClick={() => {
                  setContactOpen(false);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all"
              >
                <span>Open Full Contact Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 9. Bill Payments & Wallet Modal */}
      <MobileBillPaymentsModal
        isOpen={billsModalOpen}
        onClose={() => setBillsModalOpen(false)}
      />
    </>,
    document.body
  );
}
