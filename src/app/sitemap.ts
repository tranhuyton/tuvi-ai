import type { MetadataRoute } from 'next';
import { SEO_ARTICLES } from '@/lib/seoArticles';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseUrl = 'https://www.tuvithayton.vn';

  const articleUrls: MetadataRoute.Sitemap = SEO_ARTICLES.map((art) => ({
    url: `${baseUrl}/bai-viet/${art.slug}`,
    lastModified: new Date(art.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/bai-viet`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    ...articleUrls,
    {
      url: `${baseUrl}/ctv`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];
}
