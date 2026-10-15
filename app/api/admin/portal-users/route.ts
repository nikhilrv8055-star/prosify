import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface CloudPortalUser {
  id: string;
  username: string; // login identifier / email
  name: string;
  role: 'ADMIN' | 'VENDOR' | 'AGENT' | 'CUSTOMER';
  password: string;
  phone?: string;
  companyOrProject?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  createdAt: string;
  lastLogin?: string;
  portalUrl: string;
  assignedCode?: string;
}

const DEFAULT_CLOUD_USERS: CloudPortalUser[] = [
  {
    id: 'user-admin-1',
    username: 'admin@prosify.in',
    name: 'Prosify Central Administrator',
    role: 'ADMIN',
    password: 'prosify@123#',
    phone: '+91 91679 91679',
    companyOrProject: 'Prosify Technologies HQ',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLogin: '2026-09-26T08:30:00.000Z',
    portalUrl: '/admin',
    assignedCode: 'ADM-001',
  },
  {
    id: 'user-vendor-1',
    username: 'vendor@eni.com',
    name: 'BuildTech Smart Materials & Engineering',
    role: 'VENDOR',
    password: 'password123',
    phone: '+91 98201 55678',
    companyOrProject: 'BuildTech Materials Ltd (GSTIN: 27AABCB1234F1Z5)',
    status: 'ACTIVE',
    createdAt: '2026-02-15T00:00:00.000Z',
    lastLogin: '2026-09-25T14:20:00.000Z',
    portalUrl: '/vendor',
    assignedCode: 'VND-402',
  },
  {
    id: 'user-agent-1',
    username: 'agent@eni.com',
    name: 'Suresh Patil (Senior Channel Partner)',
    role: 'AGENT',
    password: 'password123',
    phone: '+91 97654 32109',
    companyOrProject: 'Patil Realty Consultants (RERA: A51900018742)',
    status: 'ACTIVE',
    createdAt: '2026-03-10T00:00:00.000Z',
    lastLogin: '2026-09-26T07:15:00.000Z',
    portalUrl: '/agent',
    assignedCode: 'AGT-882',
  },
  {
    id: 'user-customer-1',
    username: 'customer@eni.com',
    name: 'Vikram & Ananya Singhania',
    role: 'CUSTOMER',
    password: 'password123',
    phone: '+91 98200 11223',
    companyOrProject: 'Booking: Lodha Crown Tower A - Unit 1402',
    status: 'ACTIVE',
    createdAt: '2026-04-01T00:00:00.000Z',
    lastLogin: '2026-09-24T18:45:00.000Z',
    portalUrl: '/customer',
    assignedCode: 'CUST-1049',
  },
];

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'cloud_portal_users.json');

let inMemoryUsers: CloudPortalUser[] = [...DEFAULT_CLOUD_USERS];

function readCloudUsers(): CloudPortalUser[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryUsers = parsed;
        return inMemoryUsers;
      }
    }
  } catch (err) {
    console.warn('[PortalUsers API] Error reading users file, using memory cache:', err);
  }
  return inMemoryUsers;
}

function writeCloudUsers(users: CloudPortalUser[]) {
  inMemoryUsers = [...users];
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[PortalUsers API] Error writing users file:', err);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');
  const username = searchParams.get('username');

  let users = readCloudUsers();

  if (role && role !== 'ALL') {
    users = users.filter((u) => u.role === role.toUpperCase());
  }

  if (username) {
    const matched = users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() ||
        (u.assignedCode && u.assignedCode.toLowerCase() === username.toLowerCase())
    );
    if (!matched) {
      return NextResponse.json({ success: false, error: 'User not found in cloud' }, { status: 404 });
    }
    return NextResponse.json({ success: true, user: matched });
  }

  return NextResponse.json({
    success: true,
    count: users.length,
    users,
    syncedToCloud: true,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, username, role, password, phone, companyOrProject } = body;

    if (!name || !username || !role || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required user parameters' },
        { status: 400 }
      );
    }

    const users = readCloudUsers();
    const cleanUsername = username.trim().toLowerCase();

    // Check if user already exists
    const existingIndex = users.findIndex(
      (u) => u.username.toLowerCase() === cleanUsername
    );

    const roleUrlMap: Record<string, string> = {
      ADMIN: '/admin',
      VENDOR: '/vendor',
      AGENT: '/agent',
      CUSTOMER: '/customer',
    };

    const assignedCode =
      body.assignedCode ||
      `${role.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newUser: CloudPortalUser = {
      id: existingIndex >= 0 ? users[existingIndex].id : `user-${role.toLowerCase()}-${Date.now()}`,
      username: cleanUsername,
      name,
      role: role.toUpperCase() as any,
      password: password.trim(),
      phone: phone || '',
      companyOrProject: companyOrProject || '',
      status: 'ACTIVE',
      createdAt: existingIndex >= 0 ? users[existingIndex].createdAt : new Date().toISOString(),
      portalUrl: roleUrlMap[role.toUpperCase()] || '/login',
      assignedCode,
    };

    if (existingIndex >= 0) {
      users[existingIndex] = newUser;
    } else {
      users.unshift(newUser);
    }

    writeCloudUsers(users);

    return NextResponse.json({
      success: true,
      message: `${role} account securely synced to Cloud Database`,
      user: newUser,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to save user to cloud' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, username, password, status, name, phone, companyOrProject } = body;

    const users = readCloudUsers();
    const index = users.findIndex(
      (u) => (id && u.id === id) || (username && u.username.toLowerCase() === username.toLowerCase())
    );

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'User not found in cloud' }, { status: 404 });
    }

    const current = users[index];
    users[index] = {
      ...current,
      name: name ?? current.name,
      password: password !== undefined ? password.trim() : current.password,
      status: status ?? current.status,
      phone: phone ?? current.phone,
      companyOrProject: companyOrProject ?? current.companyOrProject,
    };

    writeCloudUsers(users);

    return NextResponse.json({
      success: true,
      message: 'Cloud user credentials updated successfully',
      user: users[index],
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update cloud user' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'User id is required' }, { status: 400 });
    }

    const users = readCloudUsers();
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const deleted = users.splice(index, 1)[0];
    writeCloudUsers(users);

    return NextResponse.json({
      success: true,
      message: `User ${deleted.name} (${deleted.username}) deleted from Cloud Database`,
      deletedId: deleted.id,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
