import { NextRequest, NextResponse } from 'next/server';
import { dispatchLeadToCrm } from '@/lib/crm/dispatcher';
import { getCrmConfig } from '@/lib/crm/config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const testEndpoint = body.endpoint?.trim();

    const config = getCrmConfig();
    const targetEndpoint = testEndpoint || config.apiEndpoint;

    if (!targetEndpoint) {
      return NextResponse.json({
        success: false,
        error: 'No CRM webhook or API endpoint specified. Please enter a URL to test.',
      }, { status: 400 });
    }

    const testPayload = {
      name: 'Test Lead (CRM Verification)',
      email: 'crm-test@prosify.in',
      phone: '+91 98200 99999',
      city: 'Mumbai',
      inquiryType: 'Integration Health Check',
      message: 'This is a test lead dispatch verifying webhook handshake connectivity.',
      sourceUrl: 'https://prosify.in/admin?tab=crm-settings',
      timestamp: new Date().toISOString(),
      utmSource: 'webhook_tester',
      utmMedium: 'admin_test_ping',
      utmCampaign: 'test_connectivity',
      leadTag: 'Test_Verification_Lead',
    };

    const startTime = Date.now();
    const result = await dispatchLeadToCrm(testPayload);
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: result.success,
      status: result.status,
      httpStatus: result.httpStatus,
      latencyMs,
      attempts: result.attempts,
      targetEndpoint: targetEndpoint.replace(/\/([^/]{4})[^/]*$/, '/$1****'),
      provider: config.provider,
      message: result.success
        ? `Successfully connected to CRM webhook in ${latencyMs}ms! Received HTTP ${result.httpStatus || 200}.`
        : `Connection failed: ${result.errorMessage || `HTTP ${result.httpStatus}`}`,
      responseSample: result.responsePayload,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
