import type { MetadataRoute } from 'next';
import { SEO_ARTICLES } from '@/lib/seoArticles';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const articleUrls: MetadataRoute.Sitemap = SEO_ARTICLES.map((art) => ({
    url: `https://tuvithayton.vn/bai-viet/${art.slug}`,
    lastModified: new Date(art.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [
    {
      url: 'https://tuvithayton.vn',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://tuvithayton.vn/bai-viet',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    ...articleUrls,
    {
      url: 'https://tuvithayton.vn/ctv',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];
}
