'use client';

import { useEffect, useState } from 'react';
import { fetchTrending, discoverRegional, TMDBResponse } from '@/lib/tmdb';
import Carousel from '@/components/Carousel';
import Navbar from '@/components/Navbar';

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

  return (
    <main className="min-h-screen bg-zivox-bg pb-20">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[70vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-zivox-bg z-0 pointer-events-none" />
        
        <div className="relative z-10 space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground tracking-tight drop-shadow-lg">
            Your Free Streaming <br className="hidden md:block" /> Era Begins.
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto font-light leading-relaxed">
            Zivox has evolved. The cinematic universe is now ad-free, uninterrupted, and better than ever. Unlock your premium pass to infinite entertainment below.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3 px-6 py-4 rounded-full glass-card border border-white/5 shadow-xl text-foreground/80 font-mono text-sm">
              <span className="opacity-50">https://</span>
              <span className="font-bold text-foreground">zivoxtv.live</span>
            </div>
            
            <a 
              href="https://zivoxtv.live/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-bold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1"
            >
              Enter ZivoxTV Now
            </a>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-12 relative z-10 mt-10">
        {!data ? (
          <div className="text-center text-foreground/50 py-20 animate-pulse">Loading Cinematic Universe...</div>
        ) : (
          <>
            <Carousel 
              title="Trending Movies" 
              items={data.trendingMovies?.results || []} 
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
