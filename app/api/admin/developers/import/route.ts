import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/data/store';
import { Developer } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const developersList = Array.isArray(body) ? body : [body];

    let importedCount = 0;
    let updatedCount = 0;

    for (const dev of developersList) {
      if (!dev.name) continue;
      const existing = store.getDevelopers().find(
        (d) => d.name.toLowerCase() === dev.name.toLowerCase() || (dev.id && d.id === dev.id)
      );

      if (existing) {
        store.updateDeveloper(existing.id, dev);
        updatedCount++;
      } else {
        const slug = dev.slug || dev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        store.createDeveloper({
          name: dev.name,
          slug,
          logoUrl: dev.logoUrl || 'https://picsum.photos/seed/builder/200/200',
          about: dev.about || `${dev.name} is a leading real estate developer with a legacy of on-time delivery and RERA compliant projects.`,
          establishedYr: dev.establishedYr || dev.establishedYear || 2010,
          website: dev.website || `https://www.${slug}.com`,
          contactEmail: dev.contactEmail || dev.email || `contact@${slug}.com`,
          contactPhone: dev.contactPhone || dev.phone || '+91 98200 00000',
          isVerified: dev.isVerified ?? true,
          totalProjects: dev.totalProjects || 1,
          completedProjects: dev.completedProjects || 0,
          ongoingProjects: dev.ongoingProjects || 1,
          upcomingProjects: dev.upcomingProjects || 0,
          headquarters: dev.headquarters || 'Mumbai, Maharashtra',
        });
        importedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        importedCount,
        updatedCount,
        totalProcessed: developersList.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to import developers' },
      { status: 400 }
    );
  }
}
