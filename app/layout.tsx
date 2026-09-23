import type { Metadata, Viewport } from 'next';
import './globals.css';
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
  title: `${brandConfig.name} - ${brandConfig.tagline}`,
  description: `${brandConfig.name} is India's trusted real-estate marketplace, project directory, inventory management, CRM, and channel partner platform for Maharashtra properties.`,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Prosify',
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: `${brandConfig.name} - ${brandConfig.tagline}`,
    description: `${brandConfig.name} is India's trusted real-estate marketplace, project directory, inventory management, CRM, and channel partner platform for Maharashtra properties.`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brandConfig.name} - ${brandConfig.tagline}`,
    description: `${brandConfig.name} is India's trusted real-estate marketplace, project directory, inventory management, CRM, and channel partner platform for Maharashtra properties.`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 antialiased selection:bg-[#D4A017]/30 selection:text-neutral-900">
        <ServiceWorkerRegister />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
