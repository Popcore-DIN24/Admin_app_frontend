 export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  duration_minutes: number | string;
  release_date: string;
  poster_url: string;
}