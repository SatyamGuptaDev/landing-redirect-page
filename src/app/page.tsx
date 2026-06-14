import { fetchTrending, discoverRegional } from '@/lib/tmdb';
import Carousel from '@/components/Carousel';
import Link from 'next/link';

export default async function Home() {
  const [
    trendingMovies,
    trendingTv,
    hindiHits,
    koreanHits,
    animeHits,
    spanishHits
  ] = await Promise.all([
    fetchTrending('movie'),
    fetchTrending('tv'),
    discoverRegional('movie', 'hi'),
    discoverRegional('tv', 'ko'),
    discoverRegional('tv', 'ja', '16'), // 16 is Animation genre in TMDB
    discoverRegional('movie', 'es')
  ]);

  return (
    <main className="min-h-screen bg-zivox-bg flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-20 px-6 flex flex-col items-center text-center">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-6 tracking-tight z-10 relative">
          Your Free Streaming<br />Era Begins.
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 z-10 relative">
          Zivox has evolved. The cinematic universe is now ad-free, uninterrupted, and better than ever. Unlock your premium pass to infinite entertainment below.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center z-10 relative">
          <div className="glass-card px-6 py-4 rounded-full flex items-center gap-3">
            <span className="text-white/40">https://</span>
            <span className="font-semibold text-white">zivoxtv.live</span>
          </div>
          <Link 
            href="https://zivoxtv.live"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:scale-105 transition-all"
          >
            Enter ZivoxTV Now
          </Link>
        </div>
      </section>

      {/* Catalog Section */}
      <div className="w-full mt-10">
        <Carousel title="Trending Movies" badge="Top 15 Today" items={trendingMovies?.results || []} type="movie" />
        <Carousel title="Trending TV Shows" badge="Binge-Worthy" items={trendingTv?.results || []} type="tv" />
        <Carousel title="Hindi & Indian Hits" badge="Bollywood & More" items={hindiHits?.results || []} type="movie" />
        <Carousel title="K-Dramas & Asian Hits" badge="Global Phenomenon" items={koreanHits?.results || []} type="tv" />
        <Carousel title="Anime & Japanese Cinema" badge="Top Rated" items={animeHits?.results || []} type="tv" />
        <Carousel title="Spanish & Latin Hits" badge="Blockbusters" items={spanishHits?.results || []} type="movie" />
      </div>

      {/* SEO Blocks */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20">
        <h2 className="sr-only">Explore Top Movie and TV Genres on ZivoxTV</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl hover:bg-white/[0.08] transition-colors">
            <h3 className="text-xl font-display font-bold text-white mb-2">Action & Adventure</h3>
            <p className="text-white/60 text-sm mb-4">Stream explosive blockbusters, superhero sagas, and epic adventures. Watch top action movies in 4K UHD without interruptions.</p>
            <div className="flex gap-2 flex-wrap"><span className="text-xs px-2 py-1 bg-white/10 rounded text-white/80">Marvel</span><span className="text-xs px-2 py-1 bg-white/10 rounded text-white/80">DC</span></div>
          </div>
          <div className="glass-card p-6 rounded-2xl hover:bg-white/[0.08] transition-colors">
            <h3 className="text-xl font-display font-bold text-white mb-2">K-Dramas & Asian Cinema</h3>
            <p className="text-white/60 text-sm mb-4">Dive into the world of Korean dramas, Japanese cinema, and Asian hits. Stream full episodes and movies with subtitles.</p>
            <div className="flex gap-2 flex-wrap"><span className="text-xs px-2 py-1 bg-white/10 rounded text-white/80">Squid Game</span><span className="text-xs px-2 py-1 bg-white/10 rounded text-white/80">K-Drama</span></div>
          </div>
          <div className="glass-card p-6 rounded-2xl hover:bg-white/[0.08] transition-colors">
            <h3 className="text-xl font-display font-bold text-white mb-2">Anime & Manga Adaptations</h3>
            <p className="text-white/60 text-sm mb-4">Watch the latest and most popular anime series. High-quality streams of your favorite Japanese animation.</p>
            <div className="flex gap-2 flex-wrap"><span className="text-xs px-2 py-1 bg-white/10 rounded text-white/80">Attack on Titan</span><span className="text-xs px-2 py-1 bg-white/10 rounded text-white/80">One Piece</span></div>
          </div>
        </div>
      </section>

    </main>
  );
}
