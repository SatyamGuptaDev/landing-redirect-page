'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchDetails, TMDBDetails } from '@/lib/tmdb';
import BackButton from '@/components/BackButton';
import TrailerButton from '@/components/TrailerButton';
import Loading from '@/app/loading';
import ErrorComponent from '@/app/error';

export default function TVPage({ id }: { id: string }) {
  const [tv, setTv] = useState<TMDBDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadTv() {
      try {
        setLoading(true);
        const data = await fetchDetails(id, 'tv');
        if (!data) throw new Error('Not found');
        setTv(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }
    loadTv();
  }, [id]);

  if (loading) return <Loading />;
  if (error || !tv) return <ErrorComponent error={error || new Error('Not found')} reset={() => window.location.reload()} />;

  const trailer = tv.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const cast = tv.credits?.cast?.slice(0, 10) || [];
  const year = tv.first_air_date?.split('-')[0];

  return (
    <main className="min-h-screen bg-zivox-bg pb-20 relative">
      {/* Hero Backdrop - Absolute positioned behind everything */}
      <div className="absolute top-0 left-0 w-full h-[60vh] sm:h-[70vh] lg:h-[85vh] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-zivox-bg via-zivox-bg/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/40 z-[5]" />
        {tv.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w1280${tv.backdrop_path}`}
            alt={tv.name || 'Backdrop'}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-[25vh] sm:pt-[35vh] lg:pt-[45vh]">
        <BackButton className="mb-6 md:mb-10" />
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
          {/* Poster */}
          <div className="hidden sm:block flex-none w-40 md:w-56 lg:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 dark:ring-white/5 bg-zinc-900">
            {tv.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                alt={tv.name || 'Poster'}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 pt-4 md:pt-12">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-wrap gap-2 mb-4">
                {tv.genres?.map(g => (
                  <span key={g.id} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-foreground uppercase tracking-widest border border-black/5 dark:border-white/5">
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

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8">
                <a 
                  href="https://zivoxtv.live/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all hover:-translate-y-1"
                >
                  Watch Free on Zivox
                </a>
                {trailer && (
                  <div className="w-full sm:w-auto">
                    <TrailerButton trailerKey={trailer.key} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {cast.length > 0 && (
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mt-12 md:mt-16">
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground/90 mb-6">Top Cast</h2>
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
