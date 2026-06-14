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
      {/* Premium Silicon Valley Funnel Hero */}
      <div className="relative w-full min-h-[75vh] md:min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-24 pb-16">
        
        {/* Ambient Dark Void & Radial Glows */}
        <div className="absolute inset-0 bg-[#020202] z-0 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-zivox-violet/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Subtle Glass Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

        <div className="relative z-10 space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium tracking-widest text-foreground/80 uppercase mb-4 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            The Ultimate Cinematic Experience
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter leading-[1.1]">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/40 drop-shadow-sm">
              Your Streaming
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-zivox-violet to-blue-500 drop-shadow-sm">
              Era Begins.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-foreground/60 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
            Zivox has evolved. Ad-free, uninterrupted, and better than ever. Unlock your premium pass to infinite entertainment below.
          </p>

          <div className="pt-10 flex flex-col items-center justify-center gap-6">
            <a 
              href="https://zivoxtv.live/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 px-12 py-5 rounded-2xl bg-white text-black font-bold text-lg transition-all hover:scale-105 will-change-transform shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative z-10">Enter ZivoxTV Now</span>
              <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            
            <div className="flex items-center gap-2 text-foreground/40 font-mono text-xs md:text-sm tracking-wider">
              <span>Redirecting to:</span>
              <span className="font-bold text-foreground/80 border-b border-foreground/20 pb-0.5">https://zivoxtv.live</span>
            </div>
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
