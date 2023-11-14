export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TV {
  name: string;
  original_name: string;
  origin_country: string[];
  vote_count: number;
  backdrop_path: string | null;
  vote_average: number;
  genre_ids: number[];
  id: number;
  original_language: string;
  overview: string;
  poster_path: string | null;
  first_air_date: string;
  popularity: number;
  media_type: string;
}

interface BaseResponse {
  page: number;
  total_results: number;
  total_pages: number;
}

export interface MovieResponse extends BaseResponse {
  results: Movie[];
}

export interface TvResponse extends BaseResponse {
  results: TV[];
}

const apiKey = process.env.EXPO_PUBLIC_API_KEY;
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

export const moviesApi = {
  trending: () =>
    fetch(`${baseUrl}/trending/movie/week?api_key=${apiKey}`).then((res) => res.json()),
  upcoming: ({ pageParam }) =>
    fetch(`${baseUrl}/movie/upcoming?api_key=${apiKey}&language=en-US&page=${pageParam}`).then(
      (res) => res.json()
    ),
  nowPlaying: () =>
    fetch(`${baseUrl}/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`).then((res) =>
      res.json()
    ),
  search: async ({ queryKey }) => {
    const [_, query] = queryKey;
    const res = await fetch(
      `${baseUrl}/search/movie?api_key=${apiKey}&language=en-US&page=1&query=${query}`
    );
    return await res.json();
  },
  detail: ({ queryKey }) => {
    const [_, id] = queryKey;
    return fetch(`${baseUrl}/movie/${id}?api_key=${apiKey}&append_to_response=videos,images`).then(
      (res) => res.json()
    );
  },
};

export const tvApi = {
  trending: () => fetch(`${baseUrl}/trending/tv/week?api_key=${apiKey}`).then((res) => res.json()),
  airingToday: () =>
    fetch(`${baseUrl}/tv/airing_today?api_key=${apiKey}`).then((res) => res.json()),
  topRated: () => fetch(`${baseUrl}/tv/top_rated?api_key=${apiKey}`).then((res) => res.json()),
  search: async ({ queryKey }) => {
    const [_, query] = queryKey;
    const res = await fetch(
      `${baseUrl}/search/tv?api_key=${apiKey}&language=en-US&page=1&query=${query}`
    );
    return await res.json();
  },
  detail: ({ queryKey }) => {
    const [_, id] = queryKey;
    return fetch(`${baseUrl}/tv/${id}?api_key=${apiKey}&append_to_response=videos,images`).then(
      (res) => res.json()
    );
  },
};
