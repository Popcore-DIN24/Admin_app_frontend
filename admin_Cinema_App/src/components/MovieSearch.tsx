import React, { useMemo, useState } from "react";
import "./MovieSearch.css";
import api from "../api/axios";

interface GenreObject {
  id?: number;
  name?: string;
  [k: string]: any;
}

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  releaseDate: string;
  runtime?: number;
  genres?: Array<string | GenreObject>;
  posterUrl?: string;
  posterPath?: string;
  poster?: any;
  images?: any;
}

interface MovieSearchProps {
  onSelectMovie?: (movie: MovieDetails) => void;
}

const TMDB_BASE = "https://image.tmdb.org/t/p/w500";
const FALLBACK_POSTER = "/no-poster.png";

const extractPosterRaw = (movie?: MovieDetails): string => {
  if (!movie) return "";
  const anyMovie = movie as any;

  const candidates = [
    movie.posterUrl,
    movie.posterPath,
    anyMovie.poster?.url,
    anyMovie.poster?.file_path,
    anyMovie.poster_path,
    anyMovie.poster?.path,
    anyMovie.images?.posters?.[0]?.file_path,
    anyMovie.images?.posters?.[0]?.filePath,
    anyMovie.data?.poster,
  ];

  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return "";
};

const buildPosterUrl = (movie?: MovieDetails) => {
  const raw = extractPosterRaw(movie);
  if (!raw) return FALLBACK_POSTER;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${TMDB_BASE}${raw.startsWith("/") ? raw : `/${raw}`}`;
};

const normalizeGenres = (genres?: MovieDetails["genres"]) => {
  if (!genres || genres.length === 0) return [];
  return genres.map((g) => {
    if (typeof g === "string") return g;
    if (g && typeof g === "object") return (g as GenreObject).name ?? String(g);
    return String(g);
  });
};

const MovieSearch: React.FC<MovieSearchProps> = ({ onSelectMovie }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<MovieDetails | undefined>(undefined);
  const [error, setError] = useState("");
  const [matchType, setMatchType] = useState("");

  const posterSrc = useMemo(() => buildPosterUrl(movie), [movie]);
  const genreList = useMemo(() => normalizeGenres(movie?.genres), [movie?.genres]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setMovie(undefined);
    setMatchType("");
    const payload={ movieName: query };

    try {
      const response = await api.post(
        "/api/movies/search",
        payload
      );

      if (!response.status ) throw new Error("Search failed");

      const data = await response.data;
      if (!data.success || !data.movie) {
        setError("No matching movie found.");
        return;
      }

      setMovie(data.movie);
      setMatchType(data.matchType ?? "");
    } catch {
      setError("Could not fetch movies.");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectSave = async () => {
  if (!movie) {
    alert("No movie selected to save.");
    return;
  }

  try {
    const movieToSave = {movie};
    const response = await api.post(
      "/api/movies/save",
      movieToSave
    );

    if (!response.status) {
      const errorText = await response.data;
      throw new Error(errorText || "Failed to save movie");
    }

    alert("Movie saved successfully!");
  } catch (err: any) {
    console.error("Save movie error:", err);
    alert("Error saving movie: " + err.message);
  }
};

  return (
    <div className="search-container">
      <h2 className="search-title">Search Movies</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter movie name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {loading && <p className="loading">Searching...</p>}
      {error && <p className="error">{error}</p>}

      {matchType && movie && (
        <p className="match-info">
          Match type: <strong>{matchType.toUpperCase()}</strong>
        </p>
      )}

      {movie && (
        <div className="search-movie-card">
          <img
            src={posterSrc}
            alt={movie.title}
            className="movie-poster"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src !== FALLBACK_POSTER) {
                target.onerror = null;
                target.src = FALLBACK_POSTER;
              }
            }}
          />

          <div className="movie-info">
            <h3>{movie.title}</h3>
            <p className="date">
              {movie.releaseDate
                ? new Date(movie.releaseDate).toLocaleDateString()
                : "Unknown"}
            </p>

            <p className="overview">{movie.overview}</p>

            {genreList.length > 0 && (
              <p className="genres">
                <strong>Genres:</strong> {genreList.join(", ")}
              </p>
            )}

            {movie.runtime && (
              <p className="runtime">
                <strong>Runtime:</strong> {movie.runtime} min
              </p>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button
                className="search-button"
                onClick={() => {
                if (onSelectMovie && movie) {
                  const movieWithPoster = {
                    ...movie,
                    posterUrl: buildPosterUrl(movie) 
                  };
                  onSelectMovie(movieWithPoster);
                }
              }}
            >
                Edite this Movie
              </button>

              <button
                className="search-button"
                onClick={handleDirectSave}
              >
                Save Directly
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieSearch;
