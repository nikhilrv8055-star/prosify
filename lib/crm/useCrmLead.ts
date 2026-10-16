'use client';

import { useState, useCallback, useEffect } from 'react';

export interface UseCrmLeadOptions {
  onSuccess?: (leadId: string) => void;
  onError?: (error: string) => void;
  resetOnSuccess?: boolean;
}

export interface LeadSubmissionData {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  inquiryType?: string;
  message?: string;
  leadTag?: string;
  affiliateId?: string;
  propertyTitle?: string;
  projectId?: string;
  budget?: string;
  _hp?: string; // Honeypot field
}

export function useCrmLead(options: UseCrmLeadOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});

  // Capture UTM parameters from URL automatically on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const utm: Record<string, string> = {};
      
      const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'aff'];
      keys.forEach((k) => {
        const val = searchParams.get(k);
        if (val) utm[k] = val;
      });

      setUtmParams(utm);
    }
  }, []);

  const submitLead = useCallback(
    async (formData: LeadSubmissionData) => {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);

      try {
        const payload = {
          ...formData,
          sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
          utmSource: utmParams.utm_source || utmParams.ref || 'website_direct',
          utmMedium: utmParams.utm_medium || '',
          utmCampaign: utmParams.utm_campaign || '',
          utmTerm: utmParams.utm_term || '',
          utmContent: utmParams.utm_content || '',
          affiliateId: formData.affiliateId || utmParams.aff || utmParams.ref || undefined,
        };

        const res = await fetch('/api/crm/lead-capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          const errMsg = data.error || 'Failed to submit inquiry. Please try again.';
          setError(errMsg);
          if (options.onError) options.onError(errMsg);
          return { success: false, error: errMsg };
        }

        setSuccess(true);
        if (options.onSuccess) options.onSuccess(data.leadId);

        return {
          success: true,
          leadId: data.leadId,
          crmSyncStatus: data.crmSyncStatus,
          message: data.message || 'Thank you! Our representative will contact you shortly.',
        };
      } catch (err: any) {
        const errMsg = err.message || 'Network error. Please check your connection and try again.';
        setError(errMsg);
        if (options.onError) options.onError(errMsg);
        return { success: false, error: errMsg };
      } finally {
        setIsSubmitting(false);
      }
    },
    [options, utmParams]
  );

  const resetState = useCallback(() => {
    setIsSubmitting(false);
    setSuccess(false);
    setError(null);
  }, []);

  return {
    submitLead,
    isSubmitting,
    success,
    error,
    resetState,
    utmParams,
  };
}
