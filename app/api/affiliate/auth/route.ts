import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { dispatchLeadToCrm } from '@/lib/crm/dispatcher';
import { getCrmConfig } from '@/lib/crm/config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      authType, // 'google' | 'phone_otp' | 'phone_password' | 'demo_switch'
      email,
      phone,
      password,
      otp,
      name,
      avatar,
      demoMode, // 'zero_state' | 'active_state'
    } = body;

    // Handle demo state switch for evaluation/testing
    if (authType === 'demo_switch') {
      if (demoMode === 'zero_state') {
        const zeroAffiliate = {
          id: 'aff-new-user-zero',
          affiliateCode: 'ENI-ZERO-0001',
          referralCode: 'ENI-ZERO-0001',
          name: name || 'Aarav Sharma (New Partner)',
          email: email || 'aarav.partner@example.com',
          phone: phone || '+91 98200 00000',
          tier: 'Bronze',
          commissionRatePercent: 2.5,
          status: 'ACTIVE',
          availableBalance: 0,
          totalEarnings: 0,
          pendingClearance: 0,
          totalClicks: 0,
          totalConversions: 0,
          conversionRate: 0.0,
          joinedAt: new Date().toISOString().split('T')[0],
          bankDetails: {
            accountHolderName: '',
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            upiId: '',
          },
          notificationPreferences: {
            emailAlerts: true,
            smsAlerts: true,
          },
        };
        return NextResponse.json({
          success: true,
          message: 'Switched to Brand New Partner (₹0 stats)',
          user: zeroAffiliate,
          token: `aff_session_${Date.now()}_zero`,
        });
      } else {
        const activePartner = store.getAffiliates()[0] || {
          id: 'aff-active-1',
          affiliateCode: 'ENI-PRO-8055',
          referralCode: 'ENI-PRO-8055',
          name: 'Siddharth Varma (Top Partner)',
          email: 'siddharth.v@realtyaffiliates.in',
          phone: '+91 98201 44556',
          tier: 'Diamond',
          commissionRatePercent: 3.5,
          status: 'ACTIVE',
          availableBalance: 125000,
          totalEarnings: 845000,
          pendingClearance: 45000,
          totalClicks: 4820,
          totalConversions: 142,
          conversionRate: 2.9,
          joinedAt: '2026-07-15',
          bankDetails: {
            accountHolderName: 'Siddharth Varma',
            accountNumber: '001201509923',
            ifscCode: 'HDFC0000060',
            bankName: 'HDFC Bank, Fort Branch',
            upiId: 'siddharth.varma@okaxis',
          },
          notificationPreferences: {
            emailAlerts: true,
            smsAlerts: true,
          },
        };
        return NextResponse.json({
          success: true,
          message: 'Switched to Active Partner (High Performer)',
          user: activePartner,
          token: `aff_session_${Date.now()}_active`,
        });
      }
    }

    // Google One-Click OAuth Flow
    if (authType === 'google') {
      const userEmail = email?.trim().toLowerCase() || 'partner@gmail.com';
      const userName = name || userEmail.split('@')[0];
      const existing = store.getAffiliates().find((a) => a.email.toLowerCase() === userEmail);

      if (existing) {
        return NextResponse.json({
          success: true,
          message: `Welcome back, ${existing.name}!`,
          isNewUser: false,
          user: {
            ...existing,
            availableBalance: existing.payableBalance || existing.unpaidEarnings || 0,
            pendingClearance: 12000,
            totalEarnings: existing.totalEarnings || existing.totalEarned || 0,
            totalClicks: existing.totalClicks || 0,
            totalConversions: existing.totalDealsClosed || existing.totalLeads || 0,
            conversionRate: existing.totalClicks ? Number(((existing.totalDealsClosed / existing.totalClicks) * 100).toFixed(1)) : 0.0,
          },
          token: `aff_oauth_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        });
      }

      // First-time Google registration: Initialize dedicated profile with default ZERO values
      const randId = Math.floor(1000 + Math.random() * 9000);
      const affCode = `AFF-ENI-${randId}`;

      const newAffiliate = store.registerAffiliate({
        name: userName,
        email: userEmail,
        phone: phone || '+91 98000 00000',
        city: 'Mumbai',
      });

      // Strict enforcement of zero initial values for new profiles
      const zeroProfile = {
        id: newAffiliate.id,
        affiliateCode: affCode,
        referralCode: affCode,
        name: userName,
        email: userEmail,
        phone: phone || '+91 98000 00000',
        avatarUrl: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        tier: 'Bronze',
        commissionRatePercent: 2.5,
        availableBalance: 0.0,
        totalEarnings: 0.0,
        pendingClearance: 0.0,
        totalClicks: 0,
        totalConversions: 0,
        conversionRate: 0.0,
        status: 'ACTIVE',
        joinedAt: new Date().toISOString().split('T')[0],
        bankDetails: {
          accountHolderName: '',
          accountNumber: '',
          ifscCode: '',
          bankName: '',
          upiId: '',
        },
        notificationPreferences: {
          emailAlerts: true,
          smsAlerts: true,
        },
      };

      // Trigger Automated CRM Lead Capture Pipeline for Affiliate Signups
      // Payload: Name, Phone, Email, Unique Affiliate ID, Registration Date, Lead Tag: Affiliate_Partner
      const crmPayload = {
        name: userName,
        phone: phone || '+91 98000 00000',
        email: userEmail,
        affiliateId: affCode,
        timestamp: new Date().toISOString(),
        leadTag: 'Affiliate_Partner',
        inquiryType: 'Affiliate Partner Signup (Google OAuth)',
        message: `New partner onboarded via Google OAuth. Assigned unique affiliate ID: ${affCode}`,
        sourceUrl: 'https://prosify.in/affiliate',
        utmSource: 'affiliate_onboarding',
        utmMedium: 'google_oauth',
      };

      // Dispatch to external CRM webhook asynchronously with fail-safe local logging
      dispatchLeadToCrm(crmPayload).then((res) => {
        store.addCrmSyncLog({
          id: `crm-aff-${Date.now()}`,
          leadId: newAffiliate.id,
          leadName: userName,
          leadPhone: phone || '+91 98000 00000',
          crmProvider: (getCrmConfig().provider.toUpperCase() as any) || 'WEBHOOK',
          requestPayload: res.requestPayload,
          responsePayload: res.responsePayload || { message: res.errorMessage },
          statusCode: res.httpStatus || (res.success ? 200 : 500),
          errorMessage: res.errorMessage,
          syncTimestamp: res.lastAttemptAt,
          syncStatus: res.status === 'SYNCED' ? 'SYNCED' : 'FAILED',
          idempotencyKey: `aff_oauth_${newAffiliate.id}`,
        });
      }).catch((e) => console.error('CRM sync error for affiliate partner:', e));

      return NextResponse.json({
        success: true,
        message: 'Affiliate Account Initialized successfully! Welcome to ENI AI BORN.',
        isNewUser: true,
        user: zeroProfile,
        token: `aff_oauth_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      });
    }

    // Mobile Number + Password / OTP Login & Registration Flow
    if (authType === 'phone_otp' || authType === 'phone_password') {
      const cleanPhone = phone?.trim();
      if (!cleanPhone || cleanPhone.length < 10) {
        return NextResponse.json({ success: false, error: 'Valid 10-digit mobile number is required' }, { status: 400 });
      }

      if (authType === 'phone_otp' && otp && otp !== '1234' && otp !== '1526' && otp !== '8055') {
        return NextResponse.json({ success: false, error: 'Invalid OTP. Please enter 1234 or request a new code.' }, { status: 400 });
      }

      const existingByPhone = store.getAffiliates().find((a) => a.phone && a.phone.includes(cleanPhone.slice(-10)));

      if (existingByPhone) {
        return NextResponse.json({
          success: true,
          message: `Welcome back, ${existingByPhone.name}!`,
          isNewUser: false,
          user: {
            ...existingByPhone,
            availableBalance: existingByPhone.payableBalance || existingByPhone.unpaidEarnings || 0,
            pendingClearance: 15000,
            totalEarnings: existingByPhone.totalEarnings || existingByPhone.totalEarned || 0,
            totalClicks: existingByPhone.totalClicks || 0,
            totalConversions: existingByPhone.totalDealsClosed || existingByPhone.totalLeads || 0,
            conversionRate: existingByPhone.totalClicks ? Number(((existingByPhone.totalDealsClosed / existingByPhone.totalClicks) * 100).toFixed(1)) : 0.0,
          },
          token: `aff_phone_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        });
      }

      // New Mobile Registration -> Initialize dedicated profile with exact ZERO values
      const randId = Math.floor(1000 + Math.random() * 9000);
      const affCode = `AFF-ENI-${randId}`;
      const partnerName = name?.trim() || `Partner ${cleanPhone.slice(-4)}`;
      const partnerEmail = email?.trim() || `partner.${cleanPhone.slice(-4)}@eniaiborn.in`;

      const newAffiliate = store.registerAffiliate({
        name: partnerName,
        email: partnerEmail,
        phone: cleanPhone,
        city: 'Mumbai',
      });

      const zeroProfile = {
        id: newAffiliate.id,
        affiliateCode: affCode,
        referralCode: affCode,
        name: partnerName,
        email: partnerEmail,
        phone: cleanPhone,
        tier: 'Bronze',
        commissionRatePercent: 2.5,
        availableBalance: 0.0,
        totalEarnings: 0.0,
        pendingClearance: 0.0,
        totalClicks: 0,
        totalConversions: 0,
        conversionRate: 0.0,
        status: 'ACTIVE',
        joinedAt: new Date().toISOString().split('T')[0],
        bankDetails: {
          accountHolderName: '',
          accountNumber: '',
          ifscCode: '',
          bankName: '',
          upiId: '',
        },
        notificationPreferences: {
          emailAlerts: true,
          smsAlerts: true,
        },
      };

      // Trigger Automated CRM Lead Capture Pipeline for Affiliate Signups (Mobile OTP / Registration)
      // Payload: Name, Phone, Email, Unique Affiliate ID, Registration Date, Lead Tag: Affiliate_Partner
      const crmMobilePayload = {
        name: partnerName,
        phone: cleanPhone,
        email: partnerEmail,
        affiliateId: affCode,
        timestamp: new Date().toISOString(),
        leadTag: 'Affiliate_Partner',
        inquiryType: 'Affiliate Partner Signup (Mobile OTP)',
        message: `New partner registered via Mobile OTP/Password. Assigned unique affiliate ID: ${affCode}`,
        sourceUrl: 'https://prosify.in/affiliate',
        utmSource: 'affiliate_onboarding',
        utmMedium: 'mobile_otp',
      };

      dispatchLeadToCrm(crmMobilePayload).then((res) => {
        store.addCrmSyncLog({
          id: `crm-aff-mob-${Date.now()}`,
          leadId: newAffiliate.id,
          leadName: partnerName,
          leadPhone: cleanPhone,
          crmProvider: (getCrmConfig().provider.toUpperCase() as any) || 'WEBHOOK',
          requestPayload: res.requestPayload,
          responsePayload: res.responsePayload || { message: res.errorMessage },
          statusCode: res.httpStatus || (res.success ? 200 : 500),
          errorMessage: res.errorMessage,
          syncTimestamp: res.lastAttemptAt,
          syncStatus: res.status === 'SYNCED' ? 'SYNCED' : 'FAILED',
          idempotencyKey: `aff_mob_${newAffiliate.id}`,
        });
      }).catch((e) => console.error('CRM sync error for mobile affiliate partner:', e));

      return NextResponse.json({
        success: true,
        message: 'Account registered successfully with default zero balance!',
        isNewUser: true,
        user: zeroProfile,
        token: `aff_phone_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      });
    }

    return NextResponse.json({ success: false, error: 'Unsupported auth type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Authentication error' }, { status: 500 });
  }
}
