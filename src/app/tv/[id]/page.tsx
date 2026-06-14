import { fetchTrending, fetchDetails } from '@/lib/tmdb';
import TVPage from '@/components/TVPage';
import { Metadata } from 'next';

export const dynamicParams = false;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const trending = await fetchTrending('tv');
  if (!trending?.results) return [];

  return trending.results.slice(0, 100).map((tv) => {
    const safeTitle = tv.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return {
      id: `${tv.id}-${safeTitle}`,
    };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const tmdbId = resolvedParams.id.split('-')[0];
  
  if (!tmdbId) return { title: 'Not Found' };
  
  const tv = await fetchDetails(tmdbId, 'tv');
  if (!tv) return { title: 'Not Found' };

  const title = `${tv.name} - Watch Free on ZivoxTV`;
  const description = tv.overview || `Watch ${tv.name} in HD for free on ZivoxTV.`;
  const url = `https://zivoxtv.live/tv/${resolvedParams.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'video.tv_show',
      images: tv.backdrop_path ? [{ url: `https://image.tmdb.org/t/p/w1280${tv.backdrop_path}` }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: tv.backdrop_path ? [`https://image.tmdb.org/t/p/w1280${tv.backdrop_path}`] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const tmdbId = resolvedParams.id.split('-')[0];

  return <TVPage id={tmdbId} />;
}
