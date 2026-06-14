'use client';

import { useEffect, useState } from 'react';
import HomePage from '@/components/HomePage';
import MoviePage from '@/components/MoviePage';
import TVPage from '@/components/TVPage';

export default function ClientRouter() {
  const [route, setRoute] = useState<string>('');

  useEffect(() => {
    // Handle initial load and hash changes
    const handleHashChange = () => {
      setRoute(window.location.hash);
      window.scrollTo(0, 0);
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Parse the route
  // Expected format: #/movie/123-title or #/tv/123-title
  if (route.startsWith('#/movie/')) {
    const idParam = route.replace('#/movie/', '');
    const tmdbId = idParam.split('-')[0];
    if (tmdbId) {
      return <MoviePage id={tmdbId} key={tmdbId} />;
    }
  }

  if (route.startsWith('#/tv/')) {
    const idParam = route.replace('#/tv/', '');
    const tmdbId = idParam.split('-')[0];
    if (tmdbId) {
      return <TVPage id={tmdbId} key={tmdbId} />;
    }
  }

  // Default to HomePage
  return <HomePage />;
}
