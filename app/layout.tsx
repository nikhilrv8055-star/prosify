import type { Metadata, Viewport } from 'next';
import './globals.css'; // Global styles
import { ClientProviders } from '@/components/providers/ClientProviders';
import { brandConfig } from '@/src/config/brand';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';

export const viewport: Viewport = {
  themeColor: '#171717',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Prosify - Maharashtra Real Estate Marketplace & Channel Partner Platform',
  description: 'Prosify - Premier Maharashtra real estate marketplace, project directory, inventory management, CRM, and channel partner affiliate platform across Mumbai, Pune, Nagpur, Nashik, Thane, Navi Mumbai, and Chhatrapati Sambhajinagar with MahaRERA compliance.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Prosify',
  },
  icons: {
    icon: '/pwa-192x192.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Prosify - Maharashtra Real Estate Marketplace & Channel Partner Platform',
    description: 'Premier Maharashtra real estate marketplace, project directory, inventory management, CRM, and channel partner affiliate platform across Mumbai, Pune, Nagpur, Nashik, Thane, Navi Mumbai, and Chhatrapati Sambhajinagar with MahaRERA compliance.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prosify - Maharashtra Real Estate Marketplace & Channel Partner Platform',
    description: 'Premier Maharashtra real estate marketplace, project directory, inventory management, CRM, and channel partner affiliate platform across Mumbai, Pune, Nagpur, Nashik, Thane, Navi Mumbai, and Chhatrapati Sambhajinagar with MahaRERA compliance.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const jsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: brandConfig.name,
    alternateName: brandConfig.companyLegalName,
    url: brandConfig.domains.public,
    logo: `${brandConfig.domains.public}/logo.png`,
    description: `${brandConfig.name} - ${brandConfig.tagline} MahaRERA Registered Real Estate Marketplace & Channel Partner Ingestion Engine for MMR, Thane, and Pune properties.`,
    priceRange: '₹35 Lakh - ₹25 Crore',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Prosify Chambers, Senapati Bapat Marg, Lower Parel',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400013',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 18.9953,
      longitude: 72.8258,
    },
    telephone: brandConfig.contact.phone,
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Mumbai MMR' },
      { '@type': 'AdministrativeArea', name: 'Thane' },
      { '@type': 'AdministrativeArea', name: 'Navi Mumbai' },
      { '@type': 'AdministrativeArea', name: 'Pune' },
    ],
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: brandConfig.name,
    url: brandConfig.domains.public,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${brandConfig.domains.public}/properties?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body suppressHydrationWarning>
        <ServiceWorkerRegister />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
