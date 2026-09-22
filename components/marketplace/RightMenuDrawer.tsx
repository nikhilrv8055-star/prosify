'use client';

import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { brandConfig } from '@/src/config/brand';

interface RightMenuDrawerProps {
  onClose: () => void;
  onOpenPostProperty: () => void;
  onOpenRentalAgreement: () => void;
  onOpenServices: () => void;
  onOpenReferEarn: () => void;
  onOpenRentReceipts: () => void;
  onOpenPlan: (type: 'tenant' | 'owner' | 'buyer' | 'seller' | 'commercial') => void;
  onOpenCareers: () => void;
  onOpenCorporateEnquiry: () => void;
  onOpenBlog: () => void;
  onOpenSupport: () => void;
  onCopyEmail: () => void;
}

export function RightMenuDrawer({
  onClose,
  onOpenPostProperty,
  onOpenRentalAgreement,
  onOpenServices,
  onOpenReferEarn,
  onOpenRentReceipts,
  onOpenPlan,
  onOpenCareers,
  onOpenCorporateEnquiry,
  onOpenBlog,
  onOpenSupport,
  onCopyEmail,
}: RightMenuDrawerProps) {
  const [commercialPlansExpanded, setCommercialPlansExpanded] = useState(false);
  const [contactUsExpanded, setContactUsExpanded] = useState(true);

  return (
    <>
      {/* Dimmed Backdrop covering background */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[0.5px] cursor-pointer animate-in fade-in duration-200"
        aria-label="Close menu backdrop"
      />

      {/* Right-Hand Vertical Dropdown Panel matching user screenshot (image.png) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Site Navigation Menu"
        className="fixed top-0 right-0 z-[9999] w-72 sm:w-[280px] h-full bg-white flex flex-col shadow-2xl border-l border-neutral-200 overflow-y-auto animate-in slide-in-from-right duration-200 select-none"
      >
        {/* Subtle Top Close Header */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-neutral-100 bg-neutral-50/60 shrink-0">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Navigation</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors cursor-pointer"
            aria-label="Close Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 16 Menu Items in EXACT order matching screenshot */}
        <div className="flex flex-col divide-y divide-neutral-100">
          {/* 1. Post Your Property */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPostProperty();
            }}
            className="w-full text-left py-3 px-6 text-[13px] font-normal text-neutral-700 hover:text-[#FD3752] hover:bg-neutral-50/70 transition-colors cursor-pointer"
          >
            <span>Post Your Property</span>
          </button>

          {/* 2. Rental Agreement */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenRentalAgreement();
            }}
            className="w-full text-left py-3 px-6 text-[13px] font-normal text-neutral-700 hover:text-[#FD3752] hover:bg-neutral-50/70 transition-colors cursor-pointer"
          >
            <span>Rental Agreement</span>
          </button>

          {/* 3. Painting & Cleaning */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenServices();
            }}
            className="w-full text-left py-3 px-6 text-[13px] font-normal text-neutral-700 hover:text-[#FD3752] hover:bg-neutral-50/70 transition-colors cursor-pointer"
          >
            <span>Painting & Cleaning</span>
          </button>

          {/* 4. Packers and Movers */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenServices();
            }}
            className="w-full text-left py-3 px-6 text-[13px] font-normal text-neutral-700 hover:text-[#FD3752] hover:bg-neutral-50/70 transition-colors cursor-pointer"
          >
            <span>Packers and Movers</span>
          </button>

          {/* 5. Refer & Earn */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenReferEarn();
            }}
            className="w-full text-left py-3 px-6 text-[13px] font-normal text-neutral-700 hover:text-[#FD3752] hover:bg-neutral-50/70 transition-colors cursor-pointer"
          >
            <span>Refer & Earn</span>
          </button>

          {/* 6. Rent Receipts */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenRentReceipts();
            }}
            className="w-full text-left py-3 px-6 text-[13px] font-normal text-neutral-700 hover:text-[#FD3752] hover:bg-neutral-50/70 transition-colors cursor-pointer"
          >
            <span>Rent Receipts</span>
          </button>

          {/* 7. Tenant Plans */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPlan('tenant');
            }}
            className="w-full text-left py-3 px-6 text-[13px] font-normal text-neutral-700 hover:text-[#FD3752] hover:bg-neutral-50/70 transition-colors cursor-pointer"
          >
            <span>Tenant Plans</span>
          </button>

          {/* 8. Owner Plans */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPlan('owner');
            }}
            className="w-full text-left py-3 px-6 text-[13px] font-normal text-neutral-700 hover:text-[#FD3752] hover:bg-neutral-50/70 transition-colors cursor-pointer"
          >
            <span>Owner Plans</span>
          </button>

          {/* 9. Buyer Plans */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPlan('buyer');
            }}
            className="w-full text-left py-3 px-6 text-[13px] font-normal text-neutral-700 hover:text-[#FD3752] hover:bg-neutral-50/70 transition-colors cursor-pointer"
          >
            <span>Buyer Plans</span>
          </button>

          {/* 10. Seller Plans */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPlan('seller');
            }}
            className="w-full text-left py-3 px-6 text-[13px] font-normal text-neutral-700 hover:text-[#FD3752] hover:bg-neutral-50/70 transition-colors cursor-pointer"
          >
            <span>Seller Plans</span>
          </button>

          {/* 11. Commercial Plans (Accordion dropdown) */}
          <div>
            <button
              type="button"
              onClick={() => setCommercialPlansExpanded(!commercialPlansExpanded)}
              className="w-full text-left py-3 px-6 text-[13px] font-normal text-neutral-700 hover:text-[#FD3752] hover:bg-neutral-50/70 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Commercial Plans</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                  commercialPlansExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
            {commercialPlansExpanded && (
              <div className="bg-neutral-50/80 px-8 py-2 border-t border-neutral-100 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPlan('commercial');
                  }}
                  className="text-left text-xs text-neutral-600 hover:text-[#FD3752] py-1 cursor-pointer transition-colors"
                >
                  Commercial Rent
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPlan('commercial');
                  }}
                  className="text-left text-xs text-neutral-600 hover:text-[#FD3752] py-1 cursor-pointer transition-colors"
                >
                  Commercial Buy
                </button>
              </div>
            )}
          </div>

          {/* 12. Careers */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCareers();
            }}
            className="w-full text-left py-3 px-6 text-[13px] font-normal text-neutral-700 hover:text-[#FD3752] hover:bg-neutral-50/70 transition-colors cursor-pointer"
          >
            <span>Careers</span>
          </button>

          {/* 13. Corporate Enquiry */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCorporateEnquiry();
            }}
            className="w-full text-left py-3 px-6 text-[13px] font-normal text-neutral-700 hover:text-[#FD3752] hover:bg-neutral-50/70 transition-colors cursor-pointer"
          >
            <span>Corporate Enquiry</span>
          </button>

          {/* 14. Blog */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenBlog();
            }}
            className="w-full text-left py-3 px-6 text-[13px] font-normal text-neutral-700 hover:text-[#FD3752] hover:bg-neutral-50/70 transition-colors cursor-pointer"
          >
            <span>Blog</span>
          </button>

          {/* 15. NoBroker Support */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSupport();
            }}
            className="w-full text-left py-3 px-6 text-[13px] font-normal text-neutral-700 hover:text-[#FD3752] hover:bg-neutral-50/70 transition-colors cursor-pointer"
          >
            <span>NoBroker Support</span>
          </button>

          {/* 16. Contact Us (Accordion dropdown, open by default in screenshot) */}
          <div>
            <button
              type="button"
              onClick={() => setContactUsExpanded(!contactUsExpanded)}
              className="w-full text-left py-3 px-6 text-[13px] font-normal text-neutral-700 hover:text-[#FD3752] hover:bg-neutral-50/70 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Contact Us</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                  contactUsExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {contactUsExpanded && (
              <div className="px-6 py-3.5 bg-neutral-50/50 flex flex-col gap-1 border-t border-neutral-100">
                <span className="text-[11px] text-neutral-400 font-normal">Email</span>
                <a
                  href={`mailto:${brandConfig.contact.supportEmail || 'assist@nobroker.in'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onCopyEmail();
                  }}
                  className="text-xs text-neutral-700 hover:text-[#FD3752] transition-colors font-medium break-all"
                >
                  {brandConfig.contact.supportEmail || 'assist@nobroker.in'}
                </a>

                {/* Social Buttons: f, t, g+ (exact match to screenshot) */}
                <div className="flex items-center gap-2.5 mt-3 pt-1">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-500 hover:text-neutral-900 transition-colors text-xs font-semibold"
                    aria-label="Facebook"
                  >
                    f
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-500 hover:text-neutral-900 transition-colors text-xs font-semibold"
                    aria-label="Twitter"
                  >
                    t
                  </a>
                  <a
                    href="https://google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-500 hover:text-neutral-900 transition-colors text-[10px] font-semibold"
                    aria-label="Google Plus"
                  >
                    g+
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
