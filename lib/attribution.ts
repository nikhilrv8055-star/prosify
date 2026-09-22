/**
 * Attribution & Tracking Engine for Prosify Channel Partners
 * Captures 30-day tracking cookies, UTM parameters, and partner referral codes.
 */

export interface PartnerAttribution {
  partnerId?: string;
  partnerCode: string;
  partnerName?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  landingPage?: string;
  timestamp: string;
}

const STORAGE_KEY = 'prosify_partner_attribution';
const COOKIE_NAME = 'prosify_partner_ref';

export function getStoredAttribution(): PartnerAttribution | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('swarna_partner_attribution');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Verify 30-day expiry
      const ageMs = Date.now() - new Date(parsed.timestamp).getTime();
      if (ageMs < 30 * 24 * 60 * 60 * 1000) {
        return parsed;
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // Fallback: Read cookie if localStorage empty
    const match = document.cookie.match(new RegExp(`(^| )(${COOKIE_NAME}|swarna_partner_ref)=([^;]+)`));
    if (match && match[3]) {
      return {
        partnerCode: decodeURIComponent(match[3]),
        timestamp: new Date().toISOString(),
      };
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

export function setStoredAttribution(data: PartnerAttribution): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Set 30-day cookie
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(data.partnerCode)}; expires=${expires}; path=/; SameSite=Lax`;
    window.dispatchEvent(new CustomEvent('prosify_attribution_updated', { detail: data }));
  } catch {
    // Ignore
  }
}

export function clearStoredAttribution(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    window.dispatchEvent(new CustomEvent('prosify_attribution_updated', { detail: null }));
  } catch {
    // Ignore
  }
}

export async function processUrlAttribution(
  searchParams: URLSearchParams,
  pathname: string
): Promise<PartnerAttribution | null> {
  const partnerCode =
    searchParams.get('partner') ||
    searchParams.get('ref') ||
    searchParams.get('cp') ||
    searchParams.get('partnerCode');

  const trackingCode = searchParams.get('code');
  const utmSource = searchParams.get('utm_source') || undefined;
  const utmMedium = searchParams.get('utm_medium') || undefined;
  const utmCampaign = searchParams.get('utm_campaign') || undefined;
  const utmTerm = searchParams.get('utm_term') || undefined;
  const utmContent = searchParams.get('utm_content') || undefined;

  if (!partnerCode && !trackingCode && !utmSource) {
    return null;
  }

  const effectiveCode = partnerCode || trackingCode || 'ORGANIC';

  try {
    // Send click event to backend
    const res = await fetch('/api/tracking/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partnerCode: partnerCode || undefined,
        code: trackingCode || undefined,
        targetPath: pathname,
        eventType: 'CLICK',
        utmSource,
        utmMedium,
        utmCampaign,
      }),
    });

    const data = await res.json();
    const partnerInfo = data.partner;

    const attribution: PartnerAttribution = {
      partnerId: partnerInfo?.id,
      partnerCode: partnerInfo?.code || effectiveCode,
      partnerName: partnerInfo?.companyName,
      utmSource: utmSource || (partnerCode ? 'channel_partner' : undefined),
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      landingPage: pathname,
      timestamp: new Date().toISOString(),
    };

    setStoredAttribution(attribution);
    return attribution;
  } catch {
    // Fallback local storage
    if (partnerCode) {
      const fallback: PartnerAttribution = {
        partnerCode,
        utmSource: utmSource || 'channel_partner',
        utmCampaign,
        landingPage: pathname,
        timestamp: new Date().toISOString(),
      };
      setStoredAttribution(fallback);
      return fallback;
    }
  }

  return null;
}
