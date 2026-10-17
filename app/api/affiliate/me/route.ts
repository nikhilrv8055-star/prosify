import { NextRequest, NextResponse } from 'next/server';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';

export const AFFILIATE_COOKIE_NAME = 'prosify_affiliate_session';

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get(AFFILIATE_COOKIE_NAME)?.value;
    const { searchParams } = new URL(req.url);
    const queryEmail = searchParams.get('email');
    const queryId = searchParams.get('id');

    let identifier: { email?: string; id?: string } = {};

    if (cookie) {
      try {
        const decoded = JSON.parse(Buffer.from(cookie, 'base64').toString('utf-8'));
        identifier = { id: decoded.id, email: decoded.email };
      } catch {}
    }

    if (queryId) identifier.id = queryId;
    if (queryEmail) identifier.email = queryEmail;

    if (!identifier.id && !identifier.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated as an affiliate' },
        { status: 401 }
      );
    }

    const affiliate =
      (identifier.id && serverAffiliateDb.getAffiliateById(identifier.id)) ||
      (identifier.email && serverAffiliateDb.getAffiliateByEmail(identifier.email));

    if (!affiliate) {
      return NextResponse.json(
        { success: false, error: 'Affiliate profile not found' },
        { status: 404 }
      );
    }

    const commissions = serverAffiliateDb.getCommissions(affiliate.id);
    const payouts = serverAffiliateDb.getPayouts(affiliate.id);
    const referralUrl = `https://prosify.in/?ref=${affiliate.referralCode}`;

    return NextResponse.json({
      success: true,
      affiliate: {
        ...affiliate,
        referralUrl,
      },
      commissions,
      payouts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch affiliate profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, bankDetails, customSlug } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Affiliate ID is required' }, { status: 400 });
    }

    const updated = serverAffiliateDb.updateAffiliate(id, {
      bankDetails: bankDetails || undefined,
      customSlug: customSlug || undefined,
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Affiliate not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Banking & profile settings updated successfully',
      affiliate: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
