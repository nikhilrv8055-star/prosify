import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { dispatchLeadToCrm } from '@/lib/crm/dispatcher';
import { StandardLeadPayload, getCrmConfig } from '@/lib/crm/config';

// In-memory IP rate limiter: max 15 submissions per IP per 60 seconds
const ipSubmissionTracker = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipSubmissionTracker.get(ip);

  if (!record || now > record.resetAt) {
    ipSubmissionTracker.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (record.count >= 15) {
    return false;
  }

  record.count += 1;
  return true;
}

// Phone validator: Indian standard 10-digit mobile number, with optional +91, 0, or spaces/dashes
function validateIndianPhoneNumber(phone: string): { isValid: boolean; normalized: string } {
  if (!phone) return { isValid: false, normalized: '' };
  
  // Strip non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  let tenDigit = '';
  if (digitsOnly.length === 10) {
    tenDigit = digitsOnly;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    tenDigit = digitsOnly.substring(1);
  } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    tenDigit = digitsOnly.substring(2);
  } else if (digitsOnly.length === 13 && digitsOnly.startsWith('091')) {
    tenDigit = digitsOnly.substring(3);
  }

  // Indian mobile numbers start with 6, 7, 8, or 9
  const isValid = /^[6-9]\d{9}$/.test(tenDigit);
  const normalized = isValid ? `+91 ${tenDigit.slice(0, 5)} ${tenDigit.slice(5)}` : phone;

  return { isValid, normalized };
}

// Basic RFC 5322 compatible email regex
function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    // 1. Rate Limiting Check
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait a minute before submitting again.',
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Honeypot Anti-Spam Check: Bot fields like _hp or honeypot should be empty
    if (body._hp || body.honeypot || body.website_url) {
      // Return 200 to trick bots while silently dropping the spam
      return NextResponse.json({
        success: true,
        message: 'Inquiry received. Thank you.',
        spamDetected: true,
      });
    }

    const {
      name,
      email,
      phone,
      city,
      inquiryType,
      message,
      leadTag,
      affiliateId,
      propertyTitle,
      projectId,
      budget,
      sourceUrl: clientSourceUrl,
      utmSource: clientUtmSource,
      utmMedium: clientUtmMedium,
      utmCampaign: clientUtmCampaign,
      utmTerm: clientUtmTerm,
      utmContent: clientUtmContent,
    } = body;

    // 3. Validation: Full Name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please provide your full name (minimum 2 characters).' },
        { status: 400 }
      );
    }

    // 4. Validation: 10-digit Indian Mobile Number
    const { isValid: isPhoneValid, normalized: normalizedPhone } = validateIndianPhoneNumber(phone);
    if (!isPhoneValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid 10-digit Indian mobile number (e.g., 98200 12345).',
        },
        { status: 400 }
      );
    }

    // 5. Validation: Email Address (mandatory for lead capture, or validated if provided)
    if (email && !validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // 6. Metadata Extraction
    const referer = req.headers.get('referer') || '';
    const userAgent = req.headers.get('user-agent') || 'Browser Client';
    const timestamp = new Date().toISOString();

    const finalLeadTag = leadTag || 'Contact_Inquiry';

    // 7. Fail-Safe Local Persistence (Create Lead in Local DB / Store with PENDING status)
    const localLead = store.createLead({
      name: name.trim(),
      email: (email || '').trim().toLowerCase(),
      phone: normalizedPhone,
      city: city ? city.trim() : 'Mumbai',
      source: 'WEBSITE',
      requirement: message || inquiryType || 'CRM Lead Submission',
      budget: budget || 'Flexible',
      location: city || 'Mumbai MMR',
      propertyTitle: propertyTitle || undefined,
      projectId: projectId || undefined,
      affiliateId: affiliateId || undefined,
      utmSource: clientUtmSource || 'direct',
      utmMedium: clientUtmMedium || '',
      utmCampaign: clientUtmCampaign || '',
      status: 'NEW',
    });

    // 8. Prepare Structured Payload for External CRM
    const standardPayload: StandardLeadPayload = {
      name: name.trim(),
      email: (email || '').trim().toLowerCase(),
      phone: normalizedPhone,
      city: city || 'Mumbai',
      inquiryType: inquiryType || 'General Inquiry',
      message: message || '',
      sourceUrl: clientSourceUrl || referer || '',
      timestamp,
      utmSource: clientUtmSource || 'direct',
      utmMedium: clientUtmMedium || '',
      utmCampaign: clientUtmCampaign || '',
      utmTerm: clientUtmTerm || '',
      utmContent: clientUtmContent || '',
      ipAddress: clientIp,
      userAgent,
      leadTag: finalLeadTag,
      affiliateId: affiliateId || undefined,
      propertyTitle: propertyTitle || undefined,
      projectId: projectId || undefined,
      budget: budget || undefined,
    };

    // 9. Dispatch to Configured CRM Webhook/REST API with Retry Logic
    const dispatchResult = await dispatchLeadToCrm(standardPayload);

    // 10. Update Local Lead with Sync Result & Store Audit Log
    const syncStatus = dispatchResult.status === 'SYNCED' ? 'SYNCED' : 'FAILED';
    store.updateLeadCrmSyncStatus(
      localLead.id,
      syncStatus,
      dispatchResult.externalLeadId,
      dispatchResult.errorMessage
    );

    // Log to CRM Sync History
    store.addCrmSyncLog({
      id: `crm-log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      leadId: localLead.id,
      leadName: localLead.name,
      leadPhone: localLead.phone,
      crmProvider: (getCrmConfig().provider.toUpperCase() as any) || 'WEBHOOK',
      requestPayload: dispatchResult.requestPayload,
      responsePayload: dispatchResult.responsePayload || { message: dispatchResult.errorMessage },
      statusCode: dispatchResult.httpStatus || (dispatchResult.success ? 200 : 500),
      errorMessage: dispatchResult.errorMessage,
      syncTimestamp: dispatchResult.lastAttemptAt,
      syncStatus: syncStatus,
      idempotencyKey: `lead_${localLead.id}_${Date.now()}`,
    });

    // 11. Return Clean Client Response
    return NextResponse.json({
      success: true,
      leadId: localLead.id,
      crmSyncStatus: syncStatus,
      externalLeadId: dispatchResult.externalLeadId,
      message: 'Thank you! Our representative will contact you shortly.',
      warning:
        dispatchResult.status === 'PENDING_CONFIG'
          ? 'Lead stored locally. External CRM endpoint is awaiting configuration in .env'
          : undefined,
    });
  } catch (error: any) {
    console.error('CRM Lead Capture Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error while capturing lead.',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Returns CRM configuration status and recent lead sync summary for admin/monitoring
  const config = getCrmConfig();
  const leads = store.getLeads();
  const logs = store.getCrmSyncLogs();

  const syncedCount = leads.filter((l) => l.crmSyncStatus === 'SYNCED').length;
  const pendingCount = leads.filter((l) => l.crmSyncStatus === 'PENDING' || !l.crmSyncStatus).length;
  const failedCount = leads.filter((l) => l.crmSyncStatus === 'FAILED').length;

  return NextResponse.json({
    success: true,
    provider: config.provider,
    isEndpointConfigured: Boolean(config.apiEndpoint && config.apiEndpoint.length > 0),
    apiEndpointMasked: config.apiEndpoint
      ? `${config.apiEndpoint.slice(0, 15)}...${config.apiEndpoint.slice(-8)}`
      : 'Not configured',
    stats: {
      totalLeads: leads.length,
      syncedCount,
      pendingCount,
      failedCount,
    },
    recentLogs: logs.slice(0, 10),
  });
}
