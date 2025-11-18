import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MoviesList.css";
import AdminNavbar from "../components/AdminNavbar";

interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  duration: number;
  poster_url: string | null;
  release_date: string;
  created_at: string;
  employee_id: number | null;
}

interface PaginatedResponse {
  data: Movie[];
  page: number;
  totalPages: number;
  totalCount: number;
}

const MoviesList: React.FC = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies?page=${page}&limit=10`
      );

      const data: PaginatedResponse = await res.json();

      if (res.ok) {
        setMovies(data.data);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, [page]);

  return (
    <div className="movies-container">
        <AdminNavbar />
      <h1>Movies</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">

              <img
                src={movie.poster_url || "/placeholder.png"}
                alt={movie.title}
                className="movie-poster"
              />

              <h3>{movie.title}</h3>
              <p className="genre">{movie.genre}</p>

              <p className="description">
                {movie.description?.slice(0, 100) || "No description"}...
              </p>

              <button
                className="assign-btn"
                onClick={() => navigate(`/admin/movies/${movie.id}/schedule`)}
              >
                Assign Schedule
              </button>

               <button className="see-schedule-btn"
                 onClick={() => navigate(`/admin/movies/${movie.id}/schedule-view`)}>
                         See Schedule
              </button>
            </div>
          ))}
        </div>
      )}
  
       


      {totalPages && totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MoviesList;
