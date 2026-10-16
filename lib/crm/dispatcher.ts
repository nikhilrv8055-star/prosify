/**
 * CRM Webhook & REST API Dispatcher with Exponential Backoff
 * 
 * Ensures no lead is lost if the target CRM webhook is slow, throttled, or temporarily down.
 * Local fallback logging is automatically updated.
 */

import { getCrmConfig, formatPayloadForProvider, StandardLeadPayload } from './config';

export interface DispatchResult {
  success: boolean;
  status: 'SYNCED' | 'FAILED' | 'PENDING_CONFIG';
  httpStatus?: number;
  attempts: number;
  externalLeadId?: string;
  errorMessage?: string;
  lastAttemptAt: string;
  durationMs: number;
  requestPayload: any;
  responsePayload?: any;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function dispatchLeadToCrm(lead: StandardLeadPayload): Promise<DispatchResult> {
  const config = getCrmConfig();
  const startTime = Date.now();
  const formattedPayload = formatPayloadForProvider(config.provider, lead);

  // If endpoint is not configured, flag as PENDING_CONFIG (safe fallback stored locally)
  if (!config.apiEndpoint || config.apiEndpoint.trim() === '') {
    return {
      success: false,
      status: 'PENDING_CONFIG',
      attempts: 0,
      errorMessage: 'CRM_API_ENDPOINT not configured in environment variables. Lead safely saved to local database.',
      lastAttemptAt: new Date().toISOString(),
      durationMs: Date.now() - startTime,
      requestPayload: formattedPayload,
    };
  }

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'Prosify-CRM-Dispatcher/1.0',
    'X-Lead-Timestamp': lead.timestamp,
  };

  if (config.bearerToken) {
    headers['Authorization'] = `Bearer ${config.bearerToken}`;
  } else if (config.apiKey) {
    if (config.provider === 'leadsquared') {
      headers['X-Access-Key'] = config.apiKey;
    } else {
      headers['x-api-key'] = config.apiKey;
    }
  }

  let attempts = 0;
  let lastError = '';
  let lastHttpStatus: number | undefined;
  let lastResponseData: any;

  while (attempts < config.maxRetries) {
    attempts++;
    const attemptStart = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      lastHttpStatus = response.status;

      let responseBody: any = null;
      try {
        responseBody = await response.json();
      } catch {
        try {
          responseBody = await response.text();
        } catch {
          responseBody = null;
        }
      }
      lastResponseData = responseBody;

      // 2xx indicates success
      if (response.ok) {
        // Try to extract external ID if provided by provider
        let externalId: string | undefined;
        if (responseBody) {
          if (responseBody.id) externalId = String(responseBody.id);
          else if (responseBody.leadId) externalId = String(responseBody.leadId);
          else if (responseBody.data?.[0]?.details?.id) externalId = String(responseBody.data[0].details.id);
          else if (responseBody.Status === 'Success' && responseBody.Message?.Id) externalId = String(responseBody.Message.Id);
        }

        return {
          success: true,
          status: 'SYNCED',
          httpStatus: response.status,
          attempts,
          externalLeadId: externalId,
          lastAttemptAt: new Date().toISOString(),
          durationMs: Date.now() - startTime,
          requestPayload: formattedPayload,
          responsePayload: responseBody,
        };
      }

      // Check if client error (4xx except 429) - no point retrying bad requests
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        lastError = `CRM API returned client error HTTP ${response.status}: ${
          typeof responseBody === 'object' ? JSON.stringify(responseBody) : responseBody
        }`;
        break; // Do not retry fatal 4xx errors (e.g. invalid auth or bad schema)
      }

      // 429 (Rate limited) or 5xx (Server Error) -> retry with backoff
      lastError = `CRM API returned HTTP ${response.status} on attempt ${attempts}.`;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        lastError = `CRM API timed out after ${config.timeoutMs}ms on attempt ${attempts}.`;
      } else {
        lastError = `Network error on attempt ${attempts}: ${err.message || 'Unknown network error'}`;
      }
    }

    // Exponential Backoff if more attempts remain
    if (attempts < config.maxRetries) {
      const delay = Math.min(
        config.initialBackoffMs * Math.pow(2, attempts - 1) + Math.random() * 200,
        config.maxBackoffMs
      );
      await sleep(delay);
    }
  }

  // All retries exhausted or non-retryable error
  return {
    success: false,
    status: 'FAILED',
    httpStatus: lastHttpStatus,
    attempts,
    errorMessage: lastError,
    lastAttemptAt: new Date().toISOString(),
    durationMs: Date.now() - startTime,
    requestPayload: formattedPayload,
    responsePayload: lastResponseData,
  };
}
