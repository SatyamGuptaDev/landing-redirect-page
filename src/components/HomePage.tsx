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
      {/* Static Hero Section (SEO & Redirect Focus) */}
      <div className="relative w-full min-h-[50vh] md:h-[60vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden py-12 md:py-0 mt-8">
        <div className="absolute inset-0 bg-gradient-to-b from-zivox-violet/10 via-zivox-bg to-zivox-bg z-0 pointer-events-none" />
        
        <div className="relative z-10 space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-foreground tracking-tight drop-shadow-lg leading-tight">
            Your Free Streaming <br className="hidden sm:block" /> Era Begins.
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto font-medium leading-relaxed">
            Zivox has evolved. The cinematic universe is now ad-free, uninterrupted, and better than ever. Unlock your premium pass to infinite entertainment below.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3 px-6 py-4 rounded-full bg-white/5 dark:bg-white/10 border border-foreground/10 shadow-xl text-foreground/90 font-mono text-sm">
              <span className="opacity-50">https://</span>
              <span className="font-bold text-foreground">zivoxtv.live</span>
            </div>
            
            <a 
              href="https://zivoxtv.live/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1"
            >
              Enter ZivoxTV Now
            </a>
          </div>
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
