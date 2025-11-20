import { useEffect, useState } from "react";
import "./DeleteMovies.css";
import type { Movie } from "../../types/Movie";
import AdminNavbar from "../../components/AdminNavbar";
import LoginFooter from "../Auth/LoginFooter";
import api from "../../api/axios";

export default function DeleteMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/api/v6/movies?page=${page}&limit=${limit}`
        );
        const data = await res.data;

        if (Array.isArray(data)) {
          setMovies(data);
          setTotalPages(1);
        } else {
          setMovies(data.data || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        setErrorMessage("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  const handleDelete = async (movie: Movie) => {
    if (!movie) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${movie.title}"?`
    );
    if (!confirmDelete) return;

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await api.delete(
        `/api/v6/movies/${movie.id}`
      );

      if (res.status >= 200 && res.status < 300) {
        setSuccessMessage(`🗑️ "${movie.title}" deleted successfully!`);
        setMovies((prev) => prev.filter((m) => m.id !== movie.id));

        if (movies.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Failed to delete movie.");
      }
    } catch (err) {
      setErrorMessage("An error occurred while deleting the movie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="delete-container">
        <h2 className="delete-title">Delete Movies</h2>

        {successMessage && <div className="message success">{successMessage}</div>}
        {errorMessage && <div className="message error">{errorMessage}</div>}

        {loading && <p className="delete-loading-text">Loading...</p>}

        <div className="delete-movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="delete-movie-card">
              <div className="delete-poster-wrapper">
                {movie.poster_url ? (
                  <img src={movie.poster_url} alt={movie.title} className="delete-poster" />
                ) : (
                  <div className="delete-poster-placeholder">No Image</div>
                )}
              </div>

              <div className="delete-movie-info">
                <h3>{movie.title}</h3>
                <p className="delete-genre">{movie.genre}</p>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(movie)}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="delete-pagination">
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
            ⬅ Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next ➡
          </button>
        </div>
      </div>

      <LoginFooter />
    </>
  );
}
