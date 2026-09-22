import { IntegrationProviderAdapter, HandshakeResult, ParsedWebhookLead } from './types';
import { metaLeadAdsAdapter } from './adapters/metaLeadAds';
import { googleAdsAdapter } from './adapters/googleAds';
import { whatsappBusinessAdapter } from './adapters/whatsappBusiness';
import { ninetyNineAcresAdapter } from './adapters/ninetyNineAcres';
import { magicBricksAdapter } from './adapters/magicBricks';
import { housingComAdapter } from './adapters/housingCom';

export const OFFICIAL_ADAPTERS: Record<string, IntegrationProviderAdapter> = {
  META: metaLeadAdsAdapter,
  GOOGLE: googleAdsAdapter,
  WHATSAPP: whatsappBusinessAdapter,
  '99ACRES': ninetyNineAcresAdapter,
  MAGICBRICKS: magicBricksAdapter,
  HOUSING: housingComAdapter,
};

export class IntegrationRegistry {
  public static getAllAdapters(): IntegrationProviderAdapter[] {
    return Object.values(OFFICIAL_ADAPTERS);
  }

  public static getAdapterByProvider(provider: string): IntegrationProviderAdapter | undefined {
    return OFFICIAL_ADAPTERS[provider.toUpperCase()];
  }

  public static getAdapterById(id: string): IntegrationProviderAdapter | undefined {
    return Object.values(OFFICIAL_ADAPTERS).find((a) => a.id === id);
  }

  public static async testProviderHandshake(
    provider: string,
    credentials: Record<string, string>
  ): Promise<HandshakeResult> {
    const adapter = this.getAdapterByProvider(provider);
    if (!adapter) {
      return {
        success: false,
        latencyMs: 10,
        statusCode: 404,
        message: `Unknown integration provider adapter: ${provider}`,
      };
    }
    return adapter.testHandshake(credentials);
  }

  public static parseInboundWebhook(
    provider: string,
    body: any,
    headers?: Record<string, string>
  ): ParsedWebhookLead | null {
    const adapter = this.getAdapterByProvider(provider);
    if (!adapter) return null;
    return adapter.transformIncomingPayload(body, headers);
  }
}
