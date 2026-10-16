/**
 * CRM Integration Configuration
 * 
 * Supports Webhook (Zapier, Make, Pabbly, Custom REST), Zoho CRM, HubSpot, and LeadSquared.
 * Credentials and endpoints are pulled from process.env with safe defaults.
 */

export type CrmProviderType = 'webhook' | 'zoho' | 'hubspot' | 'leadsquared' | 'custom';

export interface CrmConfig {
  provider: CrmProviderType;
  apiEndpoint: string;
  apiKey?: string;
  bearerToken?: string;
  maxRetries: number;
  initialBackoffMs: number;
  maxBackoffMs: number;
  timeoutMs: number;
  rateLimitPerMinute: number;
  leadTagDefault: string;
}

export function getCrmConfig(): CrmConfig {
  const provider = (process.env.CRM_PROVIDER?.toLowerCase() || 'webhook') as CrmProviderType;
  
  // Endpoint resolution: check CRM_API_ENDPOINT or provider-specific endpoints
  const apiEndpoint = 
    process.env.CRM_API_ENDPOINT ||
    (provider === 'zoho' ? 'https://www.zohoapis.com/crm/v2/Leads' :
     provider === 'hubspot' ? 'https://api.hubapi.com/crm/v3/objects/contacts' :
     provider === 'leadsquared' ? 'https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture' :
     ''); // Empty string indicates webhook endpoint not yet pasted in .env

  return {
    provider,
    apiEndpoint,
    apiKey: process.env.CRM_API_KEY || process.env.LEADSQUARED_ACCESS_KEY || '',
    bearerToken: process.env.CRM_BEARER_TOKEN || process.env.HUBSPOT_ACCESS_TOKEN || process.env.ZOHO_ACCESS_TOKEN || '',
    maxRetries: parseInt(process.env.CRM_MAX_RETRIES || '3', 10),
    initialBackoffMs: parseInt(process.env.CRM_INITIAL_BACKOFF_MS || '500', 10),
    maxBackoffMs: parseInt(process.env.CRM_MAX_BACKOFF_MS || '4000', 10),
    timeoutMs: parseInt(process.env.CRM_TIMEOUT_MS || '10000', 10),
    rateLimitPerMinute: parseInt(process.env.CRM_RATE_LIMIT || '30', 10),
    leadTagDefault: 'Website_Lead',
  };
}

export interface StandardLeadPayload {
  name: string;
  email: string;
  phone: string;
  city?: string;
  inquiryType?: string;
  message?: string;
  sourceUrl?: string;
  timestamp: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  ipAddress?: string;
  userAgent?: string;
  leadTag?: string; // e.g. 'Affiliate_Partner', 'Contact_Inquiry', 'High_Intent_CTA'
  affiliateId?: string;
  propertyTitle?: string;
  projectId?: string;
  budget?: string;
  customFields?: Record<string, any>;
}

/**
 * Format payload according to the destination CRM provider standard
 */
export function formatPayloadForProvider(provider: CrmProviderType, lead: StandardLeadPayload): any {
  switch (provider) {
    case 'zoho':
      return {
        data: [
          {
            Last_Name: lead.name,
            Email: lead.email,
            Phone: lead.phone,
            City: lead.city || 'Mumbai',
            Description: `${lead.inquiryType || 'General Enquiry'}: ${lead.message || ''}`,
            Lead_Source: lead.utmSource || 'Website',
            Tag: [{ name: lead.leadTag || 'Website_Lead' }],
            UTM_Source: lead.utmSource || '',
            UTM_Medium: lead.utmMedium || '',
            UTM_Campaign: lead.utmCampaign || '',
            Affiliate_ID: lead.affiliateId || '',
            Landing_Page_URL: lead.sourceUrl || '',
          },
        ],
      };

    case 'hubspot':
      return {
        properties: {
          firstname: lead.name.split(' ')[0] || lead.name,
          lastname: lead.name.split(' ').slice(1).join(' ') || 'Partner/Lead',
          email: lead.email,
          phone: lead.phone,
          city: lead.city || 'Mumbai',
          message: lead.message || '',
          hs_lead_status: 'NEW',
          lead_source: lead.utmSource || 'Website',
          utm_source: lead.utmSource || '',
          utm_medium: lead.utmMedium || '',
          utm_campaign: lead.utmCampaign || '',
          affiliate_id: lead.affiliateId || '',
          inquiry_type: lead.inquiryType || 'General',
        },
      };

    case 'leadsquared':
      return [
        { Attribute: 'FirstName', Value: lead.name },
        { Attribute: 'EmailAddress', Value: lead.email },
        { Attribute: 'Phone', Value: lead.phone },
        { Attribute: 'City', Value: lead.city || 'Mumbai' },
        { Attribute: 'Source', Value: lead.utmSource || 'Website' },
        { Attribute: 'Notes', Value: lead.message || '' },
        { Attribute: 'mx_Affiliate_ID', Value: lead.affiliateId || '' },
        { Attribute: 'mx_Lead_Tag', Value: lead.leadTag || 'Website_Lead' },
      ];

    case 'webhook':
    case 'custom':
    default:
      // Standard JSON webhook structure compatible with Zapier, Make, Pabbly, or custom listener
      return {
        event: 'lead.captured',
        timestamp: lead.timestamp,
        lead: {
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          city: lead.city || 'Not Specified',
          inquiryType: lead.inquiryType || 'General Inquiry',
          message: lead.message || '',
          leadTag: lead.leadTag || 'Website_Lead',
          affiliateId: lead.affiliateId || null,
          propertyTitle: lead.propertyTitle || null,
          projectId: lead.projectId || null,
          budget: lead.budget || null,
        },
        attribution: {
          sourceUrl: lead.sourceUrl || '',
          utmSource: lead.utmSource || 'direct',
          utmMedium: lead.utmMedium || '',
          utmCampaign: lead.utmCampaign || '',
          utmTerm: lead.utmTerm || '',
          utmContent: lead.utmContent || '',
          ipAddress: lead.ipAddress || '',
          userAgent: lead.userAgent || '',
        },
        metadata: {
          provider: 'Prosify CRM Bridge',
          version: '1.0.0',
          environment: process.env.NODE_ENV || 'production',
        },
      };
  }
}
