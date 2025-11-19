import { useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import LoginFooter from "../Auth/LoginFooter";
import "./CreateMovies.css";
import MovieSearch from "../../components/MovieSearch";

export default function CreateMovies() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: [] as string[],
    duration_minutes: "",
    release_date: "",
    poster_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const genres = [
    "action","comedy","drama","horror","romance","scifi","fantasy",
    "thriller","animation","adventure","documentary"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, multiple, selectedOptions } = e.target as HTMLSelectElement;
    if (multiple) {
      const values = Array.from(selectedOptions, (option) => option.value);
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const fillFormFromResult = (movie: any) => {
    setFormData({
      title: movie.title || "",
      description: movie.overview || "",
      genre: movie.genres ? movie.genres.map((g: any) => (typeof g === "string" ? g : g.name)) : [],
      duration_minutes: movie.runtime || "",
      release_date: movie.releaseDate || "",
      poster_url: movie.posterUrl || movie.posterPath || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.description || formData.genre.length === 0) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    if (isNaN(Number(formData.duration_minutes))) {
      setErrorMessage("Duration must be a number.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        setSuccessMessage("🎬 Movie added successfully!");
        setFormData({
          title: "",
          description: "",
          genre: [],
          duration_minutes: "",
          release_date: "",
          poster_url: "",
        });
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Failed to add movie. Please try again.");
      }
    } catch (error) {
      console.error("Error adding movie:", error);
      setErrorMessage("An error occurred while adding the movie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <AdminNavbar />

      <div className="create-main">
        <form className="create-form" onSubmit={handleSubmit}>
          <h2>Create New Movie</h2>

          {successMessage && <div className="message success">{successMessage}</div>}
          {errorMessage && <div className="message error">{errorMessage}</div>}

          <label>Title</label>
          <input type="text" name="title" value={formData.title}
            onChange={handleChange} required />

          <label>Description</label>
          <input type="text" name="description" value={formData.description}
            onChange={handleChange} required />

          <label>Genres</label>
          <select name="genre" multiple value={formData.genre} onChange={handleChange} required>
            {genres.map((g) => (
              <option key={g} value={g}>{g.toUpperCase()}</option>
            ))}
          </select>

          <label>Duration (minutes)</label>
          <input type="text" name="duration_minutes"
            value={formData.duration_minutes} onChange={handleChange} />

          <label>Release Date</label>
          <input type="date" name="release_date"
            value={formData.release_date} onChange={handleChange} />

          <label>Poster URL</label>
          <input type="text" name="poster_url"
            value={formData.poster_url} onChange={handleChange} />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Create Movie"}
          </button>
        </form>

        <MovieSearch onSelectMovie={fillFormFromResult} />
      </div>

      <LoginFooter />
    </div>
  );
}
