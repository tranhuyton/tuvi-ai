import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: 'https://tuvithayton.vn',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://tuvithayton.vn/ctv',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];
}
