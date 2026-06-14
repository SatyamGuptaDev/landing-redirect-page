const TMDB_PROXY = 'https://db.videasy.to/3';

export interface TMDBResponse {
  results: TMDBItem[];
}

export interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
}

export interface TMDBDetails extends TMDBItem {
  genres: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  credits: {
    cast: { id: number; name: string; profile_path: string | null; character: string }[];
  };
  videos: {
    results: { id: string; key: string; name: string; type: string; site: string }[];
  };
}

export async function fetchTrending(type: 'movie' | 'tv' = 'movie'): Promise<TMDBResponse | null> {
  try {
    const res = await fetch(`${TMDB_PROXY}/trending/${type}/day`);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function discoverRegional(type: 'movie' | 'tv', language: string, genre?: string): Promise<TMDBResponse | null> {
  try {
    let url = `${TMDB_PROXY}/discover/${type}?with_original_language=${language}&sort_by=popularity.desc`;
    if (genre) url += `&with_genres=${genre}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function fetchDetails(id: string, type: 'movie' | 'tv'): Promise<TMDBDetails | null> {
  try {
    const res = await fetch(`${TMDB_PROXY}/${type}/${id}?append_to_response=videos,credits`);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}
