import PosterCard from './PosterCard';
import { TMDBItem } from '@/lib/tmdb';

interface CarouselProps {
  title: string;
  badge: string;
  items: TMDBItem[];
  type: 'movie' | 'tv';
}

export default function Carousel({ title, badge, items, type }: CarouselProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-12 relative w-full max-w-[100vw] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-4 flex items-center gap-3">
        <h2 className="text-xl md:text-2xl font-display font-bold text-white/90">{title}</h2>
        <span className="px-2 py-0.5 rounded text-xs font-bold bg-white/10 text-white/70 uppercase tracking-wider">
          {badge}
        </span>
      </div>
      
      <div className="flex overflow-x-auto gap-4 px-6 md:px-12 pb-8 pt-2 hide-scrollbar snap-x-mandatory scroll-smooth w-full">
        {/* Spacer for proper alignment on the left edge inside the scrolling container */}
        <div className="w-0 md:w-[calc((100vw-80rem)/2)] shrink-0 hidden lg:block"></div>
        
        {items.map((item) => (
          <PosterCard key={item.id} item={item} type={type} />
        ))}
        
        {/* Spacer for right edge */}
        <div className="w-6 shrink-0"></div>
      </div>
    </section>
  );
}
