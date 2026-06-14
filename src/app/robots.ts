import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'ClaudeBot',
          'Anthropic-ai',
          'MetaExternalAgent',
          'FacebookBot',
          'PerplexityBot',
          'cohere-ai',
          'OAI-SearchBot',
          'Bytespider',
          'CCBot'
        ],
        disallow: '/',
      }
    ],
    sitemap: 'https://zivoxtv.live/sitemap.xml',
  };
}
