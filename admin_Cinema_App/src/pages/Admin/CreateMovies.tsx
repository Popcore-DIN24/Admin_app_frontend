import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import LoginFooter from "../Auth/LoginFooter";
import "./CreateMovies.css";

export default function CreateMovies() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: [] as string[],
    duration_minutes: "",
    release_date: "",
    poster_url: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //const navigate = useNavigate();
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

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/imdb-search?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fillFormFromResult = (movie: any) => {
    setFormData({
      title: movie.title || "",
      description: movie.plot || "",
      genre: movie.genre ? movie.genre.split(",") : [],
      duration_minutes: movie.runtimeMinutes || "",
      release_date: movie.releaseDate || "",
      poster_url: movie.poster || "",
    });
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
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter movie title" required />

          <label>Description</label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Enter description" required />

          <label>Genres</label>
          <select name="genre" multiple value={formData.genre} onChange={handleChange} required>
            {genres.map((g) => <option key={g} value={g}>{g.charAt(0).toUpperCase()+g.slice(1)}</option>)}
          </select>
          <small>Hold Ctrl (Windows) or Cmd (Mac) to select multiple genres</small>

          <label>Duration (minutes)</label>
          <input type="text" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} placeholder="Enter duration" />

          <label>Release Date</label>
          <input type="date" name="release_date" value={formData.release_date} onChange={handleChange} />

          <label>Poster URL</label>
          <input type="text" name="poster_url" value={formData.poster_url} onChange={handleChange} placeholder="Enter image URL" />

          <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Create Movie"}</button>
        </form>

        <div className="imdb-search-panel">
          <h3>Search IMDb</h3>
          <input type="text" placeholder="Enter movie title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <button onClick={handleSearch} disabled={loading}>{loading ? "Searching..." : "Search"}</button>

          <div className="search-results">
            {searchResults.map((movie, idx) => (
              <div key={idx} className="search-item" onClick={() => fillFormFromResult(movie)}>
                {movie.poster && <img src={movie.poster} alt={movie.title} className="search-poster" />}
                <div>
                  <strong>{movie.title}</strong> ({movie.year})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <LoginFooter />
    </div>
  );
}
