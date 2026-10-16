import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const affiliateId = searchParams.get('id') || 'all';
    const period = searchParams.get('period') || 'monthly'; // 'weekly' | 'monthly' | 'custom'

    // Check if the user is a zero state profile
    const isZeroUser = affiliateId.includes('zero') || affiliateId === 'aff-new-user-zero';

    if (isZeroUser) {
      return NextResponse.json({
        success: true,
        period,
        summary: {
          totalClicks: 0,
          totalConversions: 0,
          totalCommissionEarned: 0,
          conversionRate: 0.0,
          averageCommissionPerDeal: 0,
        },
        timeSeries: [
          { label: 'Week 1', clicks: 0, conversions: 0, commission: 0 },
          { label: 'Week 2', clicks: 0, conversions: 0, commission: 0 },
          { label: 'Week 3', clicks: 0, conversions: 0, commission: 0 },
          { label: 'Week 4', clicks: 0, conversions: 0, commission: 0 },
        ],
      });
    }

    // Active partner analytics
    const timeSeriesData =
      period === 'weekly'
        ? [
            { label: 'Mon', clicks: 142, conversions: 4, commission: 45000 },
            { label: 'Tue', clicks: 188, conversions: 6, commission: 62500 },
            { label: 'Wed', clicks: 210, conversions: 8, commission: 95000 },
            { label: 'Thu', clicks: 195, conversions: 5, commission: 52000 },
            { label: 'Fri', clicks: 245, conversions: 9, commission: 110000 },
            { label: 'Sat', clicks: 320, conversions: 14, commission: 185000 },
            { label: 'Sun', clicks: 280, conversions: 11, commission: 140000 },
          ]
        : [
            { label: 'Jan', clicks: 420, conversions: 12, commission: 120000 },
            { label: 'Feb', clicks: 680, conversions: 19, commission: 195000 },
            { label: 'Mar', clicks: 940, conversions: 28, commission: 280000 },
            { label: 'Apr', clicks: 1150, conversions: 34, commission: 360000 },
            { label: 'May', clicks: 830, conversions: 24, commission: 240000 },
            { label: 'Jun', clicks: 1320, conversions: 42, commission: 485000 },
          ];

    const totalClicks = timeSeriesData.reduce((acc, curr) => acc + curr.clicks, 0);
    const totalConversions = timeSeriesData.reduce((acc, curr) => acc + curr.conversions, 0);
    const totalCommissionEarned = timeSeriesData.reduce((acc, curr) => acc + curr.commission, 0);
    const conversionRate = totalClicks > 0 ? Number(((totalConversions / totalClicks) * 100).toFixed(1)) : 0;

    return NextResponse.json({
      success: true,
      period,
      summary: {
        totalClicks,
        totalConversions,
        totalCommissionEarned,
        conversionRate,
        averageCommissionPerDeal: totalConversions > 0 ? Math.round(totalCommissionEarned / totalConversions) : 0,
      },
      timeSeries: timeSeriesData,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error fetching analytics' }, { status: 500 });
  }
}
