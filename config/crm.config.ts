/**
 * CRM Integration Configuration
 * Supports generic Webhooks (Zapier, Make, n8n, custom webhooks),
 * Zoho CRM, HubSpot, LeadSquared, and Realatic CRM.
 */

export type CrmProviderType = 'webhook' | 'zoho' | 'hubspot' | 'leadsquared' | 'realatic';

export interface CrmConfig {
  provider: CrmProviderType;
  apiEndpoint: string;
  apiKey: string;
  webhookSecret?: string;
  retryAttempts: number;
  timeoutMs: number;
  rateLimitPerMinute: number;
}

export const crmConfig: CrmConfig = {
  // Provider can be set via env, defaults to 'webhook'
  provider: (process.env.CRM_PROVIDER as CrmProviderType) || 'webhook',
  
  // Endpoint URL for webhook or CRM REST API
  apiEndpoint: process.env.CRM_API_ENDPOINT || process.env.REALATIC_API_URL || '',
  
  // Bearer Token or API Key
  apiKey: process.env.CRM_API_KEY || process.env.REALATIC_API_KEY || '',
  
  // Optional webhook signature secret
  webhookSecret: process.env.CRM_WEBHOOK_SECRET || '',
  
  // Resilience & retry configuration
  retryAttempts: 3,
  timeoutMs: 8000,
  rateLimitPerMinute: 15,
};

/**
 * Checks whether external CRM endpoint is configured in environment
 */
export function isCrmConfigured(): boolean {
  return !!(crmConfig.apiEndpoint && crmConfig.apiEndpoint.trim().length > 0);
}

/**
 * Formats lead payload based on the selected CRM provider
 */
export function formatCrmPayload(leadData: {
  leadId: string;
  timestamp: string;
  name: string;
  email?: string;
  phone: string;
  city?: string;
  inquiryType?: string;
  message?: string;
  leadTag?: string;
  sourceUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  ipAddress?: string;
  highIntentAction?: string;
  propertyTitle?: string;
  dealValue?: number;
}): Record<string, any> {
  const provider = crmConfig.provider.toLowerCase();

  switch (provider) {
    case 'zoho':
      return {
        data: [
          {
            Last_Name: leadData.name,
            First_Name: '',
            Email: leadData.email || '',
            Phone: leadData.phone,
            Mobile: leadData.phone,
            City: leadData.city || 'Mumbai',
            Lead_Source: leadData.utmSource || 'Website',
            Description: `Inquiry Type: ${leadData.inquiryType || 'General'} | Action: ${leadData.highIntentAction || 'None'} | Message: ${leadData.message || 'N/A'} | Property: ${leadData.propertyTitle || 'N/A'}`,
            Tag: [{ name: leadData.leadTag || 'Website_Lead' }],
            UTM_Source: leadData.utmSource || '',
            UTM_Medium: leadData.utmMedium || '',
            UTM_Campaign: leadData.utmCampaign || '',
            Source_URL: leadData.sourceUrl || '',
          },
        ],
      };

    case 'hubspot':
      return {
        properties: {
          firstname: leadData.name.split(' ')[0] || leadData.name,
          lastname: leadData.name.split(' ').slice(1).join(' ') || '.',
          email: leadData.email || '',
          phone: leadData.phone,
          city: leadData.city || 'Mumbai',
          message: leadData.message || '',
          hs_lead_status: 'NEW',
          lead_tag: leadData.leadTag || 'Website_Lead',
          utm_source: leadData.utmSource || '',
          utm_medium: leadData.utmMedium || '',
          utm_campaign: leadData.utmCampaign || '',
          source_url: leadData.sourceUrl || '',
        },
      };

    case 'leadsquared':
      return [
        { Attribute: 'FirstName', Value: leadData.name },
        { Attribute: 'EmailAddress', Value: leadData.email || '' },
        { Attribute: 'Phone', Value: leadData.phone },
        { Attribute: 'City', Value: leadData.city || 'Mumbai' },
        { Attribute: 'Source', Value: leadData.utmSource || 'Website' },
        { Attribute: 'Notes', Value: leadData.message || '' },
        { Attribute: 'ProspectStage', Value: 'Prospect' },
      ];

    case 'webhook':
    default:
      // Standard Enterprise Webhook Payload (compatible with Zapier, Make, n8n, Custom webhook)
      return {
        event: 'lead.captured',
        leadId: leadData.leadId,
        timestamp: leadData.timestamp,
        leadTag: leadData.leadTag || 'Contact_Inquiry',
        contact: {
          fullName: leadData.name,
          email: leadData.email || '',
          phone: leadData.phone,
          city: leadData.city || 'Mumbai',
        },
        inquiry: {
          inquiryType: leadData.inquiryType || 'GENERAL_INQUIRY',
          message: leadData.message || '',
          highIntentAction: leadData.highIntentAction || null,
          propertyTitle: leadData.propertyTitle || null,
          dealValue: leadData.dealValue || null,
        },
        attribution: {
          source: 'WEBSITE',
          sourceUrl: leadData.sourceUrl || '',
          utmSource: leadData.utmSource || '',
          utmMedium: leadData.utmMedium || '',
          utmCampaign: leadData.utmCampaign || '',
          ipAddress: leadData.ipAddress || '127.0.0.1',
        },
      };
  }
}
