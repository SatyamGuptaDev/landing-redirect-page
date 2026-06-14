'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchDetails, TMDBDetails } from '@/lib/tmdb';
import BackButton from '@/components/BackButton';
import TrailerButton from '@/components/TrailerButton';
import Loading from '@/app/loading';
import ErrorComponent from '@/app/error';

export default function MoviePage({ id }: { id: string }) {
  const [movie, setMovie] = useState<TMDBDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadMovie() {
      try {
        setLoading(true);
        const data = await fetchDetails(id, 'movie');
        if (!data) throw new Error('Not found');
        setMovie(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }
    loadMovie();
  }, [id]);

  if (loading) return <Loading />;
  if (error || !movie) return <ErrorComponent error={error || new Error('Not found')} reset={() => window.location.reload()} />;

  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  const year = movie.release_date?.split('-')[0];

  return (
    <main className="min-h-screen bg-zivox-bg pb-20 relative">
      {/* Hero Backdrop - Absolute positioned with advanced gradient masking */}
      <div className="absolute top-0 left-0 w-full h-[65vh] sm:h-[80vh] lg:h-[90vh] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-zivox-bg via-zivox-bg/90 to-black/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-zivox-bg via-zivox-bg/70 to-transparent hidden md:block z-[11]" />
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt={movie.title || 'Backdrop'}
            fill
            className="object-cover object-top opacity-80"
            priority
          />
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-[20vh] sm:pt-[30vh] lg:pt-[35vh]">
        <BackButton className="mb-8" />
        
        <div className="flex flex-col md:flex-row items-end md:items-start gap-6 md:gap-12">
          {/* Poster (Glowing, Overlapping) */}
          <div className="flex-none w-32 sm:w-48 md:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] ring-1 ring-white/10 bg-zinc-900 relative z-30 transform md:-translate-y-8">
            {movie.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title || 'Poster'}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 w-full pt-4 md:pt-0">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground mb-4 drop-shadow-2xl tracking-tight leading-none">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base text-foreground/80 mb-6 font-medium">
                <span className="flex items-center gap-1 text-zivox-gold bg-zivox-gold/10 px-2 py-1 rounded-md border border-zivox-gold/20">
                  ⭐ {movie.vote_average?.toFixed(1)}
                </span>
                <span>{year}</span>
                {movie.runtime && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-foreground/30" />
                    <span>{movie.runtime} min</span>
                  </>
                )}
                <span className="w-1 h-1 rounded-full bg-foreground/30 hidden sm:block" />
                <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  {movie.genres?.map(g => (
                    <span key={g.id} className="text-xs text-foreground/60 border border-foreground/10 px-2 py-0.5 rounded-full">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="max-w-3xl text-foreground/80 text-sm sm:text-base md:text-lg leading-relaxed mb-8 drop-shadow-md">
                {movie.overview}
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8">
                <a 
                  href="https://zivoxtv.live/"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all hover:-translate-y-1"
                >
                  Watch Free on Zivox
                </a>
                {trailer && (
                  <div className="w-full sm:w-auto [&>button]:w-full [&>button]:rounded-xl [&>button]:py-4 [&>button]:px-10">
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
