import { MetadataRoute } from 'next';
import { fetchTrending } from '@/lib/tmdb';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://zivoxtv.live';

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  try {
    const [moviesRes, tvRes] = await Promise.all([
      fetchTrending('movie'),
      fetchTrending('tv'),
    ]);

    if (moviesRes?.results) {
      moviesRes.results.slice(0, 100).forEach((movie) => {
        const safeTitle = movie.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        sitemap.push({
          url: `${baseUrl}/movie/${movie.id}-${safeTitle}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }

    if (tvRes?.results) {
      tvRes.results.slice(0, 100).forEach((tv) => {
        const safeTitle = tv.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        sitemap.push({
          url: `${baseUrl}/tv/${tv.id}-${safeTitle}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return sitemap;
}
