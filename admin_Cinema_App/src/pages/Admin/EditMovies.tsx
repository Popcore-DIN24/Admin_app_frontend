import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import "./EditMovies.css";
import type { Movie } from "../../types/Movie";
import AdminNavbar from "../../components/AdminNavbar";
import LoginFooter from "../Auth/LoginFooter";

export default function EditMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState<Movie>({
    id: 0,
    title: "",
    description: "",
    genre: "",
    duration_minutes: "",
    release_date: "",
    poster_url: "",
  });
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
        const res = await fetch(
          `https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies?page=${page}&limit=${limit}`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setMovies(data);
          setTotalPages(1);
        } else {
          setMovies(data.data || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
        setErrorMessage("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  const handleSelectMovie = (movieId: string) => {
    const movie = movies.find((m) => m.id.toString() === movieId);
    if (movie) {
      setSelectedMovie(movie);
      setFormData({
        ...movie,
        release_date: movie.release_date?.split("T")[0] || "",
      });
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMovie) return;

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(
        `https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies/${selectedMovie.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        setSuccessMessage("🎬 Movie updated successfully!");
        const updatedList = movies.map((m) =>
          m.id === selectedMovie.id ? { ...m, ...formData } : m
        );
        setMovies(updatedList);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || "Failed to update movie.");
      }
    } catch (error) {
      console.error("Error updating movie:", error);
      setErrorMessage("An error occurred while updating the movie.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMovie) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${selectedMovie.title}"?`
    );
    if (!confirmDelete) return;

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(
        `https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies/${selectedMovie.id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setSuccessMessage("🗑️ Movie deleted successfully!");
        const newList = movies.filter((m) => m.id !== selectedMovie.id);
        setMovies(newList);
        setSelectedMovie(null);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || "Failed to delete movie.");
      }
    } catch (err) {
      console.error("Error deleting movie:", err);
      setErrorMessage("An error occurred while deleting the movie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-page">
      <AdminNavbar />

      <div className="edit-container">
        <h2 className="title">Edit Movies</h2>

        {successMessage && <div className="message success">{successMessage}</div>}
        {errorMessage && <div className="message error">{errorMessage}</div>}

        <div className="form-group">
          <label>Select Movie</label>
          <select onChange={(e) => handleSelectMovie(e.target.value)}>
            <option value="">-- Choose a movie to edit --</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id.toString()}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>

        {selectedMovie && (
          <form onSubmit={handleSubmit} className="edit-form">
            {formData.poster_url && (
              <div className="poster-wrapper">
                <img src={formData.poster_url} alt="poster" className="poster" />
              </div>
            )}

            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input type="text" name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Genre</label>
              <input type="text" name="genre" value={formData.genre} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Duration (minutes)</label>
              <input type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Release Date</label>
              <input type="date" name="release_date" value={formData.release_date} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Poster URL</label>
              <input type="text" name="poster_url" value={formData.poster_url} onChange={handleChange} />
            </div>

            <button type="submit" className="update-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Movie"}
            </button>

            <button type="button" className="delete-btn" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete Movie"}
            </button>
          </form>
        )}
      </div>

      <LoginFooter />
    </div>
  );
}