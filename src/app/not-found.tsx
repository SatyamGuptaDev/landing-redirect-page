'use client';

import { useEffect, useState } from 'react';
import MoviePage from '@/components/MoviePage';
import TVPage from '@/components/TVPage';
import Link from 'next/link';

export default function NotFound() {
  const [interceptedRoute, setInterceptedRoute] = useState<{ type: 'movie' | 'tv', id: string } | null>(null);

  useEffect(() => {
    // Intercept 404s for dynamic routes that weren't pre-built
    const path = window.location.pathname;
    
    if (path.startsWith('/movie/')) {
      const parts = path.split('/movie/');
      if (parts[1]) {
        const id = parts[1].split('-')[0];
        setInterceptedRoute({ type: 'movie', id });
      }
    } else if (path.startsWith('/tv/')) {
      const parts = path.split('/tv/');
      if (parts[1]) {
        const id = parts[1].split('-')[0];
        setInterceptedRoute({ type: 'tv', id });
      }
    }
  }, []);

  if (interceptedRoute?.type === 'movie') {
    return <MoviePage id={interceptedRoute.id} />;
  }

  if (interceptedRoute?.type === 'tv') {
    return <TVPage id={interceptedRoute.id} />;
  }

  // True 404
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold mb-4 text-foreground">404 - Page Not Found</h1>
      <p className="text-foreground/70 mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors">
        Return Home
      </Link>
    </div>
  );
}
