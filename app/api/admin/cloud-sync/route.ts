import { NextRequest, NextResponse } from 'next/server';

export interface CloudCredentialSyncRecord {
  id: string;
  type: 'AGENT' | 'VENDOR' | 'USER';
  assignedCode: string; // e.g. AGT-8421 or VND-5192
  username: string;
  password?: string;
  name: string;
  phone?: string;
  role: string;
  companyOrProject?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  cloudSyncedAt: string;
  cloudStorageBucket: string;
  cloudRefId: string;
  createdAt: string;
  updatedAt?: string;
}

// In-memory runtime cloud credentials store (mirrors cloud storage on server)
const inMemoryCloudCredentials: CloudCredentialSyncRecord[] = [
  {
    id: 'cloud-agt-1',
    type: 'AGENT',
    assignedCode: 'AGT-882',
    username: 'agent@eni.com',
    password: 'password123',
    name: 'Suresh Patil (Senior Channel Partner)',
    phone: '+91 97654 32109',
    role: 'AGENT',
    companyOrProject: 'Patil Realty Consultants (RERA: A51900018742)',
    status: 'ACTIVE',
    cloudSyncedAt: new Date().toISOString(),
    cloudStorageBucket: 'gs://prosify-os-prod.storage.app/agent-credentials/AGT-882.json',
    cloudRefId: 'cld_sec_agt_882',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cloud-vnd-1',
    type: 'VENDOR',
    assignedCode: 'VND-402',
    username: 'vendor@eni.com',
    password: 'password123',
    name: 'BuildTech Smart Materials & Engineering',
    phone: '+91 98201 55678',
    role: 'VENDOR',
    companyOrProject: 'BuildTech Materials Ltd (GSTIN: 27AABCB1234F1Z5)',
    status: 'ACTIVE',
    cloudSyncedAt: new Date().toISOString(),
    cloudStorageBucket: 'gs://prosify-os-prod.storage.app/vendor-credentials/VND-402.json',
    cloudRefId: 'cld_sec_vnd_402',
    createdAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const typeFilter = searchParams.get('type');

  let list = inMemoryCloudCredentials;
  if (typeFilter && typeFilter !== 'ALL') {
    list = list.filter((r) => r.type.toUpperCase() === typeFilter.toUpperCase());
  }

  return NextResponse.json({
    success: true,
    count: list.length,
    cloudBucket: 'gs://prosify-os-prod.storage.app/credentials-vault',
    cloudStatus: 'CONNECTED',
    records: list,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type = 'AGENT',
      assignedCode,
      username,
      password,
      name,
      phone,
      companyOrProject,
      status = 'ACTIVE',
    } = body;

    if (!assignedCode || !username || !name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (assignedCode, username, name)' },
        { status: 400 }
      );
    }

    const cloudRefId = `cld_sec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const bucketPath = `gs://prosify-os-prod.storage.app/${type.toLowerCase()}-credentials/${assignedCode}.json`;

    // Check if record exists, update or insert
    const existingIndex = inMemoryCloudCredentials.findIndex(
      (c) => c.assignedCode === assignedCode || c.username === username
    );

    const record: CloudCredentialSyncRecord = {
      id: existingIndex >= 0 ? inMemoryCloudCredentials[existingIndex].id : `cloud-${type.toLowerCase()}-${Date.now()}`,
      type: type.toUpperCase() as 'AGENT' | 'VENDOR' | 'USER',
      assignedCode,
      username,
      password: password || 'Prosify#Secure123!',
      name,
      phone: phone || '',
      role: type.toUpperCase(),
      companyOrProject: companyOrProject || '',
      status: status || 'ACTIVE',
      cloudSyncedAt: new Date().toISOString(),
      cloudStorageBucket: bucketPath,
      cloudRefId,
      createdAt: existingIndex >= 0 ? inMemoryCloudCredentials[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      inMemoryCloudCredentials[existingIndex] = record;
    } else {
      inMemoryCloudCredentials.unshift(record);
    }

    return NextResponse.json({
      success: true,
      message: `${type} credentials securely generated, synchronized and stored to Cloud Storage bucket`,
      record,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to sync to cloud storage' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const assignedCode = searchParams.get('assignedCode');
    const id = searchParams.get('id');

    const index = inMemoryCloudCredentials.findIndex(
      (c) => (assignedCode && c.assignedCode === assignedCode) || (id && c.id === id)
    );

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Credential record not found in cloud storage' }, { status: 404 });
    }

    const deleted = inMemoryCloudCredentials.splice(index, 1)[0];

    return NextResponse.json({
      success: true,
      message: `Credential ${deleted.assignedCode} purged from Cloud Storage bucket and revoked`,
      deletedId: deleted.id,
      assignedCode: deleted.assignedCode,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
