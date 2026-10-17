import { NextRequest, NextResponse } from 'next/server';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';
import { dispatchLeadToCrm } from '@/lib/crm/dispatcher';
import { getCrmConfig } from '@/lib/crm/config';

export const AFFILIATE_COOKIE_NAME = 'prosify_affiliate_session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      authType, // 'google' | 'email_password' | 'phone_otp' | 'phone_password'
      email,
      phone,
      password,
      name,
    } = body;

    // 1. Google One-Click OAuth Flow
    if (authType === 'google') {
      const userEmail = email?.trim().toLowerCase();
      if (!userEmail) {
        return NextResponse.json({ success: false, error: 'Google email address is required' }, { status: 400 });
      }
      const userName = name || userEmail.split('@')[0];

      let affiliate = serverAffiliateDb.getAffiliateByEmail(userEmail);

      if (affiliate) {
        const sessionPayload = {
          id: affiliate.id,
          email: affiliate.email,
          name: affiliate.name,
          referralCode: affiliate.referralCode,
          role: 'AFFILIATE',
        };
        const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

        const response = NextResponse.json({
          success: true,
          message: `Welcome back, ${affiliate.name}!`,
          isNewUser: false,
          affiliate: {
            ...affiliate,
            referralUrl: `https://prosify.in/?ref=${affiliate.referralCode}`,
          },
          user: affiliate,
          token: sessionToken,
        });

        response.cookies.set(AFFILIATE_COOKIE_NAME, sessionToken, {
          path: '/',
          httpOnly: false,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30,
        });

        return response;
      }

      // Provision new affiliate profile with default ZERO values
      const reg = serverAffiliateDb.registerAffiliate({
        name: userName,
        email: userEmail,
        phone: phone || '+91 98000 00000',
        isGoogle: true,
      });

      affiliate = reg.affiliate;

      // Automated CRM lead capture
      const crmPayload = {
        name: userName,
        phone: phone || '+91 98000 00000',
        email: userEmail,
        affiliateId: affiliate.referralCode,
        timestamp: new Date().toISOString(),
        leadTag: 'Affiliate_Partner',
        inquiryType: 'Affiliate Partner Signup (Google OAuth)',
        message: `New partner onboarded via Google OAuth. Assigned unique affiliate ID: ${affiliate.referralCode}`,
        sourceUrl: 'https://prosify.in/affiliate',
        utmSource: 'affiliate_onboarding',
        utmMedium: 'google_oauth',
      };

      dispatchLeadToCrm(crmPayload).catch((e) => console.error('CRM sync error for affiliate partner:', e));

      const sessionPayload = {
        id: affiliate.id,
        email: affiliate.email,
        name: affiliate.name,
        referralCode: affiliate.referralCode,
        role: 'AFFILIATE',
      };
      const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

      const response = NextResponse.json({
        success: true,
        message: 'Affiliate account initialized successfully! Welcome to Prosify.',
        isNewUser: true,
        affiliate: {
          ...affiliate,
          referralUrl: `https://prosify.in/?ref=${affiliate.referralCode}`,
        },
        user: affiliate,
        token: sessionToken,
      });

      response.cookies.set(AFFILIATE_COOKIE_NAME, sessionToken, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });

      return response;
    }

    // 2. Email & Password Login / Signup
    if (authType === 'email_password' || (!authType && email && password)) {
      const cleanEmail = email?.trim().toLowerCase();
      if (!cleanEmail) {
        return NextResponse.json({ success: false, error: 'Email address is required' }, { status: 400 });
      }

      const existing = serverAffiliateDb.getAffiliateByEmail(cleanEmail);
      if (existing) {
        if (existing.passwordHash !== password.trim()) {
          return NextResponse.json({ success: false, error: 'Invalid password. Please check your credentials.' }, { status: 401 });
        }

        const sessionPayload = {
          id: existing.id,
          email: existing.email,
          name: existing.name,
          referralCode: existing.referralCode,
          role: 'AFFILIATE',
        };
        const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

        const response = NextResponse.json({
          success: true,
          message: `Welcome back, ${existing.name}!`,
          affiliate: {
            ...existing,
            referralUrl: `https://prosify.in/?ref=${existing.referralCode}`,
          },
          user: existing,
          token: sessionToken,
        });

        response.cookies.set(AFFILIATE_COOKIE_NAME, sessionToken, {
          path: '/',
          httpOnly: false,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30,
        });

        return response;
      }

      // If user doesn't exist, create new account
      const { affiliate, verificationCode } = serverAffiliateDb.registerAffiliate({
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: phone || '+91 98000 00000',
        password: password.trim(),
        isGoogle: false,
      });

      const sessionPayload = {
        id: affiliate.id,
        email: affiliate.email,
        name: affiliate.name,
        referralCode: affiliate.referralCode,
        role: 'AFFILIATE',
      };
      const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

      const response = NextResponse.json({
        success: true,
        message: 'Affiliate account created successfully! Please verify your email.',
        isNewUser: true,
        affiliate: {
          ...affiliate,
          referralUrl: `https://prosify.in/?ref=${affiliate.referralCode}`,
        },
        verificationCode,
        user: affiliate,
        token: sessionToken,
      });

      response.cookies.set(AFFILIATE_COOKIE_NAME, sessionToken, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid authentication request' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Authentication error' }, { status: 500 });
  }
}
