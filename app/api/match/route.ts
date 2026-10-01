import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET() {
  const weights = store.getMatchingWeights();
  return NextResponse.json({ success: true, weights });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const updatedWeights = store.updateMatchingWeights(body);
    return NextResponse.json({ success: true, weights: updatedWeights });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to update matching weights' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const criteria = await req.json();
    const matches = store.calculateMatches(criteria);

    // If customer submitted a requirement form
    let savedRequirement = null;
    if (criteria.saveRequirement && criteria.fullName && criteria.phone) {
      savedRequirement = store.saveBuyerRequirement({
        fullName: criteria.fullName,
        phone: criteria.phone,
        email: criteria.email,
        budgetMin: criteria.budgetMin || Math.round((criteria.budget || 10000000) * 0.75),
        budgetMax: criteria.budgetMax || criteria.budget || 15000000,
        locations: criteria.locations || (criteria.location ? [criteria.location] : ['Thane', 'Mumbai']),
        configuration: criteria.configuration || criteria.bhk || '2 BHK',
        purpose: criteria.purpose || 'Self-Use',
        possessionPreference: criteria.possessionPreference || criteria.possessionStatus || 'Immediate',
      });
    }

    // Log AI Agent Action for ProMatch
    store.logAiAgentAction({
      agentName: 'ProMatch',
      inputContext: criteria,
      modelUsed: 'ProMatch-Ranking-Engine-v2',
      outputGenerated: {
        totalMatches: matches.length,
        topScore: matches[0]?.score || 0,
        topProperty: matches[0]?.property?.title,
      },
      confidenceScore: 96,
      approvalRequired: false,
      isApproved: true,
      actionTaken: `Ranked ${matches.length} properties for buyer criteria`,
    });

    return NextResponse.json({
      success: true,
      count: matches.length,
      data: matches,
      savedRequirement,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: err.message || 'Failed to calculate matches' } },
      { status: 500 }
    );
  }
}
