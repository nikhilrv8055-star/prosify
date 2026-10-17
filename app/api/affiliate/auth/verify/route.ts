import { NextRequest, NextResponse } from 'next/server';
import { serverAffiliateDb } from '@/lib/data/serverAffiliateDb';

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const verified = serverAffiliateDb.verifyEmail(email, code);

    if (!verified) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code. Please check and try again.' },
        { status: 400 }
      );
    }

    const affiliate = serverAffiliateDb.getAffiliateByEmail(email);

    return NextResponse.json({
      success: true,
      message: 'Email address verified successfully!',
      affiliate,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
