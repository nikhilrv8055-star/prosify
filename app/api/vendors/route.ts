import { NextResponse } from 'next/server';

export async function GET() {
  const defaultVendors = [
    {
      id: 'vnd-1',
      companyName: 'BuildTech Smart Materials & Engineering',
      contactPerson: 'Rahul Sharma',
      email: 'vendor@eni.com',
      phone: '+91 98201 55678',
      category: 'MATERIAL_SUPPLIER',
      grade: 'GRADE_A',
      status: 'VERIFIED',
      projectsCount: 12,
      propertiesCount: 45,
    },
    {
      id: 'vnd-2',
      companyName: 'Prestige Infrastructure & Urban Realty',
      contactPerson: 'Irfan Razack',
      email: 'prestige@prosify.in',
      phone: '+91 80 2559 1080',
      category: 'DEVELOPER',
      grade: 'PREMIUM',
      status: 'VERIFIED',
      projectsCount: 8,
      propertiesCount: 120,
    },
  ];

  return NextResponse.json({
    success: true,
    vendors: defaultVendors,
  });
}
