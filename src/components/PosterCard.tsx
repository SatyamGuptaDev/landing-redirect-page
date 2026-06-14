'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { TMDBItem } from '@/lib/tmdb';

interface PosterCardProps {
  item: TMDBItem;
  type: 'movie' | 'tv';
}

export default function PosterCard({ item, type }: PosterCardProps) {
  const title = item.title || item.name;
  const rawDate = item.release_date || item.first_air_date || '';
  const year = rawDate ? rawDate.split('-')[0] : '2024';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : '8.0';

  const generateSlug = (id: number, rawTitle: string) => {
    const safeTitle = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return `${id}-${safeTitle}`;
  };

  const slug = generateSlug(item.id, title || 'unknown');

  return (
    <a href={`/${type}/${slug}`}>
      <div 
        className="relative flex-none w-36 sm:w-44 md:w-56 aspect-[2/3] rounded-xl overflow-hidden cursor-pointer group shadow-lg snap-center bg-zinc-900 transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 will-change-transform"
      >
        {item.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={title || 'Poster'}
            fill
            sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 224px"
            className="object-cover transition-opacity duration-300 group-hover:opacity-60"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-center p-2 text-sm text-foreground/50">
            {title}
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-foreground shadow-xl shadow-black/50">
            <Play className="w-6 h-6 ml-1 fill-white" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 pt-12 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300 z-10">
          <h3 className="font-display font-bold text-sm sm:text-base text-white truncate drop-shadow-md">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-white/80 mt-1">
            <span className="flex items-center gap-1 text-zivox-gold">
              ⭐ {rating}
            </span>
            <span>•</span>
            <span>{year}</span>
          </div>
        </div>
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 rounded-xl transition-colors duration-300 z-20 pointer-events-none"></div>
      </div>
    </a>
  );
}
