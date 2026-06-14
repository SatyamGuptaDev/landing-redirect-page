'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchTrending, discoverRegional, TMDBResponse } from '@/lib/tmdb';
import Carousel from '@/components/Carousel';

export default function HomePage() {
  const [data, setData] = useState<{
    trendingMovies: TMDBResponse | null;
    trendingTV: TMDBResponse | null;
    indianMovies: TMDBResponse | null;
    koreanShows: TMDBResponse | null;
    anime: TMDBResponse | null;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      const [trendingMovies, trendingTV, indianMovies, koreanShows, anime] = await Promise.all([
        fetchTrending('movie'),
        fetchTrending('tv'),
        discoverRegional('movie', 'hi'),
        discoverRegional('tv', 'ko'),
        discoverRegional('tv', 'ja', '16'), // 16 is Animation genre in TMDB
      ]);
      setData({ trendingMovies, trendingTV, indianMovies, koreanShows, anime });
    }
    loadData();
  }, []);

  const heroMovie = data?.trendingMovies?.results?.[0];
  const trendingMoviesList = data?.trendingMovies?.results?.slice(1) || [];

  return (
    <main className="min-h-screen bg-zivox-bg pb-20">
      {/* Dynamic Netflix-style Hero Section */}
      <div className="relative w-full h-[75vh] sm:h-[85vh] lg:h-[95vh] flex flex-col justify-end pb-20 px-6 md:px-12 overflow-hidden">
        {/* Backdrop Image */}
        {heroMovie?.backdrop_path && (
          <div className="absolute inset-0 z-0">
            <img 
              src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
              alt={heroMovie.title}
              className="w-full h-full object-cover opacity-90 dark:opacity-70"
            />
          </div>
        )}
        
        {/* Advanced Gradient Masks */}
        <div className="absolute inset-0 bg-gradient-to-t from-zivox-bg via-zivox-bg/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-zivox-bg via-zivox-bg/60 to-transparent z-10 hidden sm:block" />
        <div className="absolute inset-0 bg-black/20 z-[5]" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-auto">
          {heroMovie ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded">
                  #1 Trending
                </span>
                <span className="text-zivox-gold font-bold text-sm">
                  ⭐ {heroMovie.vote_average?.toFixed(1)}
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-black text-foreground tracking-tighter drop-shadow-2xl leading-none mb-6">
                {heroMovie.title}
              </h1>
              <p className="text-sm md:text-lg text-foreground/80 max-w-2xl font-medium leading-relaxed drop-shadow-md mb-8 line-clamp-3">
                {heroMovie.overview}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link 
                  href={`/movie/${heroMovie.id}-${heroMovie.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`}
                  className="w-full sm:w-auto px-10 py-4 rounded-xl bg-foreground text-background font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 text-lg shadow-xl"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  Play Now
                </Link>
                <a 
                  href="https://zivoxtv.live/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-10 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-foreground font-bold backdrop-blur-md transition-colors flex items-center justify-center shadow-lg border border-white/10"
                >
                  Enter ZivoxTV
                </a>
              </div>
            </>
          ) : (
            <div className="text-foreground/50 animate-pulse">Loading Cinematic Universe...</div>
          )}
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-[1400px] mx-auto space-y-12 relative z-20 -mt-10 md:-mt-20">
        {!data ? null : (
          <>
            <Carousel 
              title="Trending Movies" 
              items={trendingMoviesList} 
              type="movie"
              badge="TOP 15 TODAY"
            />
            
            <Carousel 
              title="Trending TV Shows" 
              items={data.trendingTV?.results || []} 
              type="tv"
              badge="BINGE-WORTHY"
            />

            <Carousel 
              title="Blockbusters from India" 
              items={data.indianMovies?.results || []} 
              type="movie"
              badge="HINDI CINEMA"
            />

            <Carousel 
              title="K-Dramas & Hits" 
              items={data.koreanShows?.results || []} 
              type="tv"
              badge="SEOUL'S BEST"
            />

            <Carousel 
              title="Top Anime Series" 
              items={data.anime?.results || []} 
              type="tv"
              badge="JAPAN"
            />
          </>
        )}
      </div>
    </main>
  );
}
