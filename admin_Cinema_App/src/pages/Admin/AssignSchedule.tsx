// ...existing code...
import { useParams } from "react-router-dom";
import React, { useState } from "react";
import "./AssignSchedule.css";
import api from "../../api/axios";

const AssignSchedule: React.FC = () => {
  const { id: movieId } = useParams();

  const [hallId, setHallId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("scheduled");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!movieId) {
      setErrorMsg("Missing movie id");
      return;
    }

    if (!hallId || !startTime || !endTime || !price) {
      setErrorMsg("Please fill all required fields");
      return;
    }

    const payload = {
      hall_id: Number(hallId),
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      price_amount: Number(price),
      status,
    };

    try {
      setLoading(true);

      // Use axios instance 'api'. Adjust endpoint if your api instance has a baseURL set.
      const res = await api.post(`/api/v6/movies/${movieId}/showtimes`, payload);

      const data = res.data;

      // handle successful response (adjust keys according to your API)
      setSuccessMsg(
        data?.movie_title
          ? `Showtime created for: ${data.movie_title}`
          : "Showtime created successfully"
      );
    } catch (err: any) {
      // axios error handling
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create showtime";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assign-container">
      <h2>Assign Showtime for Movie ID: {movieId}</h2>

      <form onSubmit={handleSubmit} className="form-grid">
        <div>
          <label>Hall ID</label>
          <input
            type="number"
            value={hallId}
            onChange={(e) => setHallId(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label>End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Ticket Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="scheduled">Scheduled</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Showtime"}
          </button>
        </div>
      </form>

      {errorMsg && <p className="error">{errorMsg}</p>}
      {successMsg && <p className="success">{successMsg}</p>}
    </div>
  );
};

export default AssignSchedule;
// ...existing code...