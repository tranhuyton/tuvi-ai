import type { MetadataRoute } from 'next';
import { SEO_ARTICLES } from '@/lib/seoArticles';
import { FUNNEL_PAGES } from '@/lib/funnelPages';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseUrl = 'https://www.tuvithayton.vn';

  const funnelUrls: MetadataRoute.Sitemap = FUNNEL_PAGES.filter((p) => p.slug !== '').map((p) => ({
    url: `${baseUrl}${p.url}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: ['P1', 'P2', 'P3', 'DV1', 'TR', 'C1', 'B1'].includes(p.code) ? 0.95 : 0.9,
  }));

  const articleUrls: MetadataRoute.Sitemap = SEO_ARTICLES.map((art) => ({
    url: `${baseUrl}/bai-viet/${art.slug}`,
    lastModified: new Date(art.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/khoa-hoc`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.98,
    },
    ...funnelUrls,
    {
      url: `${baseUrl}/bai-viet`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
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
