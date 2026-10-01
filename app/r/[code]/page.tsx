import { redirect } from 'next/navigation';
import { store } from '@/lib/data/store';
import { INITIAL_AFFILIATE_MEMBERS } from '@/lib/data/affiliateStore';

interface ShortRedirectProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShortRedirectPage({ params, searchParams }: ShortRedirectProps) {
  const { code } = await params;
  const sParams = await searchParams;

  // Lookup tracking link or partner
  const link = store.getTrackingLinks().find((tl) => tl.code.toUpperCase() === code.toUpperCase());
  let targetUrl = link?.targetUrl || '/';
  let partnerCode = link?.partnerCode;

  if (!partnerCode) {
    const partner = store.getChannelPartners().find((p) => p.code.toUpperCase() === code.toUpperCase());
    if (partner) {
      partnerCode = partner.code;
    }
  }

  // Also check affiliate members (referralCode or customSlug)
  if (!partnerCode) {
    const affiliate = INITIAL_AFFILIATE_MEMBERS.find(
      (a) =>
        (a.referralCode && a.referralCode.toUpperCase() === code.toUpperCase()) ||
        (a.customSlug && a.customSlug.toUpperCase() === code.toUpperCase())
    );
    if (affiliate && affiliate.referralCode) {
      partnerCode = affiliate.referralCode;
    }
  }

  // Record click event in store
  if (partnerCode) {
    store.recordTrackingEvent(partnerCode, targetUrl, 'CLICK', link?.code);
  }

  // Construct forward search query
  const query = new URLSearchParams();
  if (partnerCode) {
    query.set('partner', partnerCode);
    query.set('ref', partnerCode);
  }
  if (link?.utmSource) query.set('utm_source', link.utmSource);
  if (link?.utmMedium) query.set('utm_medium', link.utmMedium);
  if (link?.utmCampaign) query.set('utm_campaign', link.utmCampaign);

  // Pass any additional query params from visitor
  for (const [k, v] of Object.entries(sParams)) {
    if (typeof v === 'string' && !query.has(k)) {
      query.set(k, v);
    }
  }

  const destination = targetUrl.includes('?')
    ? `${targetUrl}&${query.toString()}`
    : `${targetUrl}?${query.toString()}`;

  redirect(destination);
}
