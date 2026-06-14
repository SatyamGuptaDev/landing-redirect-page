import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchDetails } from '@/lib/tmdb';
import { Play } from 'lucide-react';
import BackButton from '@/components/BackButton';
import TrailerButton from '@/components/TrailerButton';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const tmdbId = resolvedParams.id.split('-')[0];
  const tv = await fetchDetails(tmdbId, 'tv');
  
  if (!tv) return { title: 'Not Found' };
  
  const title = `${tv.name} - Watch Free on ZivoxTV`;
  const description = tv.overview.substring(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [`https://image.tmdb.org/t/p/w1280${tv.backdrop_path}`],
      url: `https://zivoxtv.live/tv/${tv.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://image.tmdb.org/t/p/w1280${tv.backdrop_path}`],
    }
  };
}

export default async function TVPage({ params }: Props) {
  const resolvedParams = await params;
  const tmdbId = resolvedParams.id.split('-')[0];
  const tv = await fetchDetails(tmdbId, 'tv');

  if (!tv) {
    notFound();
  }

  const trailer = tv.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const cast = tv.credits?.cast?.slice(0, 10) || [];
  const year = tv.first_air_date?.split('-')[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: tv.name,
    image: `https://image.tmdb.org/t/p/w1280${tv.backdrop_path}`,
    description: tv.overview,
    dateCreated: tv.first_air_date,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tv.vote_average,
      bestRating: '10',
      worstRating: '1',
    },
    actor: cast.map(actor => ({
      '@type': 'Person',
      name: actor.name,
    })),
  };

  return (
    <main className="min-h-screen bg-zivox-bg pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BackButton />
      {/* Hero Backdrop */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-zivox-bg via-zivox-bg/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-zivox-bg via-zivox-bg/40 to-transparent z-10" />
        {tv.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
            alt={tv.name || 'Backdrop'}
            fill
            priority
            className="object-cover opacity-60"
          />
        )}
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 w-full z-20 pb-12 pt-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-8 items-end">
            {/* Poster */}
            <div className="relative w-40 md:w-56 lg:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black flex-shrink-0 border border-white/10 hidden sm:block">
              {tv.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                  alt={tv.name || 'Poster'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-900" />
              )}
            </div>

            {/* Meta */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {tv.genres?.map(g => (
                  <span key={g.id} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-white/80">
                    {g.name}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-foreground mb-4 drop-shadow-lg">
                {tv.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-foreground/80 mb-6">
                <span className="flex items-center gap-1 text-zivox-gold font-bold">
                  ⭐ {tv.vote_average?.toFixed(1)}
                </span>
                <span className="text-foreground/50">•</span>
                <span>{year}</span>
                {tv.number_of_seasons && (
                  <>
                    <span className="text-foreground/50">•</span>
                    <span>{tv.number_of_seasons} Season{tv.number_of_seasons > 1 ? 's' : ''}</span>
                  </>
                )}
              </div>
              <p className="max-w-3xl text-foreground/70 text-sm md:text-base leading-relaxed mb-8 drop-shadow-md">
                {tv.overview}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link 
                  href="https://zivoxtv.live"
                  className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:scale-105 transition-all"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Watch Free on Zivox
                </Link>
                {trailer && (
                  <TrailerButton trailerKey={trailer.key} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {cast.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16">
          <h2 className="text-2xl font-display font-bold text-foreground/90 mb-6">Top Cast</h2>
          <div className="flex overflow-x-auto gap-4 pb-8 hide-scrollbar snap-x-mandatory">
            {cast.map(actor => (
              <div key={actor.id} className="flex-none w-32 md:w-40 snap-start">
                <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-zinc-900 border border-black/5 dark:border-white/5 shadow-md">
                  {actor.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                      alt={actor.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-xs text-center p-2">No Image</div>
                  )}
                </div>
                <h4 className="font-medium text-foreground text-sm truncate">{actor.name}</h4>
                <p className="text-xs text-foreground/50 truncate">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
