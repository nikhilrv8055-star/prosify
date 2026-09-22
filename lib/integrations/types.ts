import { Lead, LeadSourceType } from '@/lib/types';

export interface CredentialFieldDef {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'password' | 'textarea';
  required: boolean;
  helpText: string;
}

export interface HandshakeResult {
  success: boolean;
  latencyMs: number;
  statusCode: number;
  message: string;
  details?: Record<string, any>;
}

export interface ParsedWebhookLead {
  name: string;
  phone: string;
  email?: string;
  source: LeadSourceType;
  budget?: string;
  location?: string;
  bhk?: string;
  propertyTitle?: string;
  notes?: string;
  campaignName?: string;
  adId?: string;
  externalLeadId?: string;
}

export interface IntegrationProviderAdapter {
  id: string;
  provider: 'META' | 'GOOGLE' | 'WHATSAPP' | '99ACRES' | 'MAGICBRICKS' | 'HOUSING';
  displayName: string;
  tagline: string;
  description: string;
  officialDocsUrl: string;
  requiresOfficialCredentials: true; // Strictly enforces no scraping
  officialPortalName: string;
  credentialFields: CredentialFieldDef[];
  defaultWebhookPath: string;
  rateLimitInfo: string;

  // Methods
  validateCredentials(credentials: Record<string, string>): { isValid: boolean; error?: string };
  testHandshake(credentials: Record<string, string>): Promise<HandshakeResult>;
  transformIncomingPayload(body: any, headers?: Record<string, string>): ParsedWebhookLead | null;
  verifyWebhookSignature?(rawBody: string, signature: string, secret: string): boolean;
}
