import type { MetadataRoute } from 'next';
import { SEO_ARTICLES_INDEX } from '@/lib/seoArticlesIndex';
import { FUNNEL_PAGES_INDEX } from '@/lib/funnelPagesIndex';

const SITE_LAST_MODIFIED = new Date('2026-11-23');

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.tuvithayton.vn';

  const funnelUrls: MetadataRoute.Sitemap = FUNNEL_PAGES_INDEX.filter((p) => p.slug !== '').map((p) => ({
    url: `${baseUrl}${p.url}`,
    lastModified: SITE_LAST_MODIFIED,
    changeFrequency: 'weekly',
    priority: ['P1', 'P2', 'P3', 'DV1', 'TR', 'C1', 'B1'].includes(p.code) ? 0.95 : 0.9,
  }));

  const articleUrls: MetadataRoute.Sitemap = SEO_ARTICLES_INDEX.map((art) => ({
    url: `${baseUrl}/bai-viet/${art.slug}`,
    lastModified: new Date(art.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/khoa-hoc`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.98,
    },
    {
      url: `${baseUrl}/van-han`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.96,
    },
    ...funnelUrls,
    {
      url: `${baseUrl}/bai-viet`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...articleUrls,
  ];
}
