import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot', 'ClaudeBot', 'Anthropic-ai'],
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: 'https://www.tuvithayton.vn/sitemap.xml',
    host: 'https://www.tuvithayton.vn',
  };
}
