import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { DeveloperApiConnection } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const connections = store.getDeveloperApiConnections();
    return NextResponse.json({
      success: true,
      data: connections,
      count: connections.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch developer API connections' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.developerName) {
      return NextResponse.json(
        { success: false, error: 'developerName is required' },
        { status: 400 }
      );
    }

    const developerName = body.developerName.trim();
    const cleanSlug = developerName.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const randomHex = Math.random().toString(36).substring(2, 10);
    const inboundApiKey = body.inboundApiKey || `eni_dev_live_${cleanSlug}_${randomHex}`;

    const created = store.createDeveloperApiConnection({
      developerId: body.developerId || `dev-${Date.now()}`,
      developerName,
      apiType: body.apiType || 'INBOUND_PUSH',
      pullEndpointUrl: body.pullEndpointUrl,
      authType: body.authType || 'NONE',
      authToken: body.authToken,
      syncFrequency: body.syncFrequency || 'REALTIME',
      inboundApiKey,
      webhookSecret: `sec_wh_${cleanSlug}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'ACTIVE',
      lastSyncStatus: 'PENDING',
      lastSyncMessage: 'Connection initialized. Waiting for first API push or pull.',
      autoApproveNewProjects: body.autoApproveNewProjects ?? false,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Builder API connection configured for ${developerName}`,
        data: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create developer API connection' },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Connection ID is required' },
        { status: 400 }
      );
    }

    const updated = store.updateDeveloperApiConnection(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Connection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Developer API connection updated',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update connection' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Connection ID query parameter is required' },
        { status: 400 }
      );
    }

    const deleted = store.deleteDeveloperApiConnection(id);
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Connection deleted' : 'Connection not found',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete connection' },
      { status: 500 }
    );
  }
}
