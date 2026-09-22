import { MetadataRoute } from 'next';
import { store } from '@/lib/data/store';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.PUBLIC_APP_URL || 'https://www.prosify.in';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/developers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/inventory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic property URLs
  const propertyRoutes: MetadataRoute.Sitemap = store.getProperties().map((prop) => ({
    url: `${baseUrl}/properties/${prop.slug}`,
    lastModified: new Date(prop.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic project URLs
  const projectRoutes: MetadataRoute.Sitemap = store.getProjects().map((proj) => ({
    url: `${baseUrl}/projects/${proj.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic developer URLs
  const developerRoutes: MetadataRoute.Sitemap = store.getDevelopers().map((dev) => ({
    url: `${baseUrl}/developers/${dev.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...propertyRoutes, ...projectRoutes, ...developerRoutes];
}
