import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SeeMovieSchedule.css"

interface Showtime {
  id: number;
  movie_id: number;
  hall_id: number;
  hall_name: string;
  theater_id: number;
  theater_name: string;
  start_time: string;
  end_time: string;
  price_amount: number;
  status: string;
  created_at: string;
}

interface ApiResponse {
  movieName: string;
  data: Showtime[];
}

const MovieSchedule: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movieName, setMovieName] = useState<string>("");

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const res = await fetch(`https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/api/v6/movies/${id}/showtimes`);
        const data: ApiResponse = await res.json();

        setShowtimes(data.data || []);
        setMovieName(data.movieName || "Movie");
      } catch (err) {
        console.error("Error fetching showtimes:", err);
      }
    };

    fetchShowtimes();
  }, [id]);

  return (
    <div className="schedule-container">
      <h1 className="schedule-title">Showtimes for: {movieName}</h1>

      {showtimes.length === 0 ? (
        <p className="no-showtimes">No showtimes assigned yet.</p>
      ) : (
        <div className="schedule-list">
          {showtimes.map((s) => (
            <div key={s.id} className="schedule-card">
              <h3>
                {s.theater_name} — {s.hall_name}
              </h3>

              <p>
                <strong>Start:</strong>{" "}
                {new Date(s.start_time).toLocaleString()}
              </p>

              <p>
                <strong>End:</strong>{" "}
                {new Date(s.end_time).toLocaleString()}
              </p>

              <p>
                <strong>Price:</strong> ${s.price_amount}
              </p>

              <p>
                <strong>Status:</strong> {s.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieSchedule;
