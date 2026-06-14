import { fetchTrending, fetchDetails } from '@/lib/tmdb';
import MoviePage from '@/components/MoviePage';
import { Metadata } from 'next';

export const dynamicParams = false; // Forces 404 for un-generated routes, triggering our smart fallback

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  // Fetch top trending movies to pre-build their pages for perfect SEO and Zero Compute
  const trending = await fetchTrending('movie');
  if (!trending?.results) return [];

  return trending.results.slice(0, 100).map((movie) => {
    const safeTitle = movie.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return {
      id: `${movie.id}-${safeTitle}`,
    };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const tmdbId = resolvedParams.id.split('-')[0];
  
  if (!tmdbId) return { title: 'Not Found' };
  
  const movie = await fetchDetails(tmdbId, 'movie');
  if (!movie) return { title: 'Not Found' };

  const title = `${movie.title} - Watch Free on ZivoxTV`;
  const description = movie.overview || `Watch ${movie.title} in HD for free on ZivoxTV.`;
  const url = `https://zivoxtv.live/movie/${resolvedParams.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'video.movie',
      images: movie.backdrop_path ? [{ url: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: movie.backdrop_path ? [`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const tmdbId = resolvedParams.id.split('-')[0];

  return <MoviePage id={tmdbId} />;
}
