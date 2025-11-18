import { useParams } from "react-router-dom";
import React, { useState } from "react";
import "./AssignSchedule.css";

const AssignSchedule: React.FC = () => {
  const { id: movieId } = useParams();

  const [hallId, setHallId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("scheduled");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    setSuccessMsg("");
    setErrorMsg("");

    const res = await fetch(
      `https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies/${movieId}/showtimes`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hall_id: Number(hallId),
          start_time: new Date(startTime).toISOString(),
          end_time: new Date(endTime).toISOString(),
          price_amount: Number(price),
          status
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setErrorMsg(data.error || "Failed to create showtime");
      return;
    }

    setSuccessMsg(`Showtime created for: ${data.movie_title}`);
  };

  return (
    <div className="assign-container">
      <h2>Assign Showtime for Movie ID: {movieId}</h2>

      <div className="form-grid">
        <div>
          <label>Hall ID</label>
          <input type="number" value={hallId} onChange={(e) => setHallId(e.target.value)} />
        </div>

        <div>
          <label>Start Time</label>
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>

        <div>
          <label>End Time</label>
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>

        <div>
          <label>Ticket Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="scheduled">Scheduled</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <button onClick={handleSubmit} className="submit-btn">Create Showtime</button>

      {errorMsg && <p className="error">{errorMsg}</p>}
      {successMsg && <p className="success">{successMsg}</p>}
    </div>
  );
};

export default AssignSchedule;
