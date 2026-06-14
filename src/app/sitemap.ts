import { MetadataRoute } from 'next';
import { fetchTrending } from '@/lib/tmdb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [movies, tv] = await Promise.all([
    fetchTrending('movie'),
    fetchTrending('tv'),
  ]);

  const generateSlug = (id: number, rawTitle: string) => {
    const safeTitle = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return `${id}-${safeTitle}`;
  };

  const movieUrls: MetadataRoute.Sitemap = (movies?.results || []).map((movie) => ({
    url: `https://zivoxtv.live/movie/${generateSlug(movie.id, movie.title || 'unknown')}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const tvUrls: MetadataRoute.Sitemap = (tv?.results || []).map((show) => ({
    url: `https://zivoxtv.live/tv/${generateSlug(show.id, show.name || 'unknown')}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://zivoxtv.live',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    ...movieUrls,
    ...tvUrls,
  ];
}
