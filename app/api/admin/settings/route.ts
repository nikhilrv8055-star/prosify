import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface SystemSettingsPayload {
  agencyName: string;
  whatsappNumber: string; // e.g. 9167991679 or +91 91679 91679
  whatsappLink: string; // e.g. https://wa.me/919167991679
  contactEmail: string; // hello4home@gmail.com
  supportEmail: string; // hello4home@gmail.com
  phone: string;
  logoUrl?: string; // Custom website logo URL or data URL
  logoName?: string;
  updatedAt: string;
  published: boolean;
}

const DEFAULT_SETTINGS: SystemSettingsPayload = {
  agencyName: 'Prosify Technologies Private Limited',
  whatsappNumber: '+91 91679 91679',
  whatsappLink: 'https://wa.me/919167991679',
  contactEmail: 'hello4home@gmail.com',
  supportEmail: 'hello4home@gmail.com',
  phone: '+91 91679 91679',
  logoUrl: '',
  logoName: 'Default Prosify Monogram',
  updatedAt: new Date().toISOString(),
  published: true,
};

const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'system_settings.json');

// In-memory runtime cache
let memorySettings: SystemSettingsPayload = { ...DEFAULT_SETTINGS };

function readPersistedSettings(): SystemSettingsPayload {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      memorySettings = { ...DEFAULT_SETTINGS, ...parsed };
      return memorySettings;
    }
  } catch (err) {
    console.warn('[Settings API] Failed to read settings file, using memory:', err);
  }
  return memorySettings;
}

function writePersistedSettings(settings: SystemSettingsPayload) {
  memorySettings = { ...settings };
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Settings API] Failed to write settings file:', err);
  }
}

export async function GET() {
  const settings = readPersistedSettings();
  return NextResponse.json({
    success: true,
    settings,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = readPersistedSettings();

    // Format WhatsApp link from number
    let rawNumber = (body.whatsappNumber || current.whatsappNumber || '9167991679')
      .replace(/[^0-9]/g, '');
    if (!rawNumber.startsWith('91') && rawNumber.length === 10) {
      rawNumber = '91' + rawNumber;
    }
    const whatsappLink = `https://wa.me/${rawNumber}`;

    const updated: SystemSettingsPayload = {
      ...current,
      agencyName: body.agencyName ?? current.agencyName,
      whatsappNumber: body.whatsappNumber ?? current.whatsappNumber,
      whatsappLink,
      contactEmail: body.contactEmail || body.email || current.contactEmail,
      supportEmail: body.supportEmail || body.email || current.supportEmail,
      phone: body.phone ?? current.phone,
      logoUrl: body.logoUrl !== undefined ? body.logoUrl : current.logoUrl,
      logoName: body.logoName !== undefined ? body.logoName : current.logoName,
      updatedAt: new Date().toISOString(),
      published: true,
    };

    writePersistedSettings(updated);

    return NextResponse.json({
      success: true,
      message: 'System settings published successfully to cloud server',
      settings: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}
