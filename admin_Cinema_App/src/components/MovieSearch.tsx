// ...existing code...
import React, { useMemo, useState } from "react";
import "./MovieSearch.css";

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
  // API may return strings or objects like { id, name }
  genres?: Array<string | GenreObject>;
  // poster fields may vary by API
  posterUrl?: string;
  posterPath?: string;
  poster?: any;
  images?: any;
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
    anyMovie.data?.poster, // defensive
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return "";
};

const buildPosterUrl = (movie?: MovieDetails) => {
  const raw = extractPosterRaw(movie);
  if (!raw) return FALLBACK_POSTER;
  // Already absolute
  if (/^https?:\/\//i.test(raw)) return raw;
  // TMDB style or bare path -> ensure leading slash
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

// --- NEW: helpers & state for saving
const extractPosterPathFromRaw = (raw?: string): string | null => {
  if (!raw) return null;
  // If TMDB absolute url, remove base to get poster_path
  try {
    const trimmed = raw.trim();
    if (trimmed.startsWith(TMDB_BASE)) {
      return trimmed.slice(TMDB_BASE.length) || null;
    }
    // if it's a full URL that contains '/t/p/w' pattern, try to extract trailing path
    const tMatch = trimmed.match(/\/t\/p\/w\d+\/(.*)$/);
    if (tMatch && tMatch[1]) return `/${tMatch[1]}`;
    // if it's already a path like '/abc.jpg' or 'abc.jpg'
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  } catch {
    return null;
  }
};
// ...existing code...
const MovieSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<MovieDetails |undefined>(undefined);
  const [error, setError] = useState("");
  const [matchType, setMatchType] = useState("");

  // saving states
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [savedMovie, setSavedMovie] = useState<any>(null);

  const posterSrc = useMemo(() => buildPosterUrl(movie), [movie]);
  const genreList = useMemo(() => normalizeGenres(movie?.genres), [movie?.genres]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setMovie(undefined);
    setMatchType("");

    try {
      const response = await fetch(
        "https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/movies/search",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movieName: query }),
        }
      );

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();

      if (!data.success || !data.movie) {
        setError("No matching movie found.");
        return;
      }

      // store movie raw; helpers will handle poster and genres variations
      setMovie(data.movie);
      setMatchType(data.matchType ?? "");
    } catch (err) {
      setError("Could not fetch movies.");
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: Save movie to backend
  const handleSave = async () => {
    if (!movie) return;
    setSaving(true);
    setSaveMessage("");
    setSavedMovie(null);

    // Build TMDB-like payload expected by backend
    const posterRaw = extractPosterRaw(movie);
    const poster_path = extractPosterPathFromRaw(posterRaw);

    const genresPayload = (movie.genres || []).map((g) =>
      typeof g === "string" ? { name: g } : (g as GenreObject)
    );

    const payloadMovie = {
      original_title: (movie as any).original_title ?? movie.title,
      overview: movie.overview,
      runtime: movie.runtime,
      release_date: (movie as any).release_date ?? movie.releaseDate,
      genres: genresPayload,
      poster_path: poster_path,
    };

    try {
      const res = await fetch("https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/movies/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie: payloadMovie,
          employee_id: null,
          added_by_employee_id: null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setSaveMessage(data.error ?? "Save failed");
      } else {
        setSaveMessage(data.message ?? "Saved successfully");
        setSavedMovie(data.saved ?? data);
      }
    } catch (err) {
      setSaveMessage("Could not save movie.");
    } finally {
      setSaving(false);
    }
  };
  // ...existing code...
  return (
    <div className="search-container" role="region" aria-label="Movie search">
      <h2 className="search-title">Search Movies</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter movie name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          aria-label="Movie name"
        />
        <button onClick={handleSearch} className="search-button" aria-label="Search">
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
        <div className="movie-card" aria-live="polite">
          <img
            src={posterSrc}
            alt={movie.title ?? "Movie poster"}
            className="movie-poster"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              // avoid infinite loops if fallback missing
              if (target.src !== FALLBACK_POSTER) {
                target.onerror = null;
                target.src = FALLBACK_POSTER;
              }
            }}
          />

          <div className="movie-info">
            <h3>{movie.title}</h3>
            <p className="date">
              {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : "Unknown"}
            </p>
            <p className="overview">{movie.overview}</p>

            {genreList.length > 0 && (
              <p className="genres">
                <strong>Genres:</strong> {genreList.join(", ")}
              </p>
            )}

            {movie.runtime != null && (
              <p className="runtime">
                <strong>Runtime:</strong> {movie.runtime} min
              </p>
            )}

            {/* NEW: Save button + status */}
            <div style={{ marginTop: 12 }}>
              <button
                onClick={handleSave}
                className="search-button"
                disabled={saving}
                aria-label="Save movie"
                title="Save this movie to database"
              >
                {saving ? "Saving..." : "Save Movie"}
              </button>
              {saveMessage && <span style={{ marginLeft: 10 }}>{saveMessage}</span>}
            </div>

            {savedMovie && (
              <pre style={{ marginTop: 10, maxHeight: 200, overflow: "auto" }}>
                {JSON.stringify(savedMovie, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieSearch;
