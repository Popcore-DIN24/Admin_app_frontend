import React, { useEffect, useState } from "react";
import api from "./axios";
import MultiDatePicker from "./MultiDatePicker";
import Select from "react-select";
import "./AdminSchedule.css";
import AdminNavbar from "../../components/AdminNavbar";
import LoginFooter from "../Auth/LoginFooter";

interface Theater { id: number; name: string; }
interface Hall { id: number; name: string; }
interface Movie { id: number; title: string; } 

const AdminSchedule: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);

  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<number | null>(null);

  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedHall, setSelectedHall] = useState<number | null>(null);

  const [dates, setDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  // --- Fetch Movies ---
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get("/api/v6/movies");
        // backend returns { data: Movie[], page, totalPages } when paginated
        setMovies(res.data.data || res.data || []);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };
    fetchMovies();
  }, []);

  // --- Fetch Theaters ---
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const res = await api.get("/api/v6/theaters");
        setTheaters(res.data.data || []);
      } catch (err) {
        console.error("Error fetching theaters:", err);
      }
    };
    fetchTheaters();
  }, []);

  // --- Fetch Halls ---
  useEffect(() => {
    const fetchHalls = async () => {
      if (!selectedTheater) {
        setHalls([]);
        setSelectedHall(null);
        return;
      }
      try {
        const res = await api.get(`/api/v6/theaters/${selectedTheater}/halls`);
        setHalls(res.data.data || []);
      } catch (err) {
        console.error("Error fetching halls:", err);
        setHalls([]);
      }
      setSelectedHall(null);
    };
    fetchHalls();
  }, [selectedTheater]);

  // --- Generate Time Slots ---
  useEffect(() => {
    if (!selectedHall) {
      setTimeSlots([]);
      return;
    }
    const slots: string[] = [];
    const startHour = 10;
    const endHour = 22;
    const interval = 2;

    for (let h = startHour; h < endHour; h += interval) {
      slots.push(`${h.toString().padStart(2, "0")}:00 - ${(h + interval).toString().padStart(2, "0")}:00`);
    }
    setTimeSlots(slots);
  }, [selectedHall]);

  // --- Toggle Time Slot ---
  const toggleTime = (slot: string) => {
    setSelectedTimes(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  // --- Submit Showtimes ---
  const handleSubmit = async () => {
    if (!selectedMovie || !selectedHall || dates.length === 0 || selectedTimes.length === 0) {
      alert("Please select movie, hall, at least one date, and at least one time.");
      return;
    }

    try {
      for (const date of dates) {
        for (const slot of selectedTimes) {
          const [startHour, endHour] = slot.split(" - ").map(t => parseInt(t.split(":")[0], 10));

          const start = new Date(date);
          start.setHours(startHour, 0, 0, 0);

          const end = new Date(date);
          end.setHours(endHour, 0, 0, 0);

          await api.post(`/api/v6/movies/${selectedMovie}/showtimes`, {
            hall_id: selectedHall,
            start_time: start.toISOString(),
            end_time: end.toISOString(),
            price_amount: 10
          });
        }
      }
      alert("Showtimes added successfully!");
      // Reset selections
      setDates([]);
      setSelectedTimes([]);
      setSelectedMovie(null);
      setSelectedHall(null);
      setSelectedTheater(null);
    } catch (err) {
      console.error(err);
      alert("Error adding showtime.");
    }
  };

  return (

      <div className="admin-page">
        {/* Navbar */}
        <AdminNavbar />

        {/* Main content */}
        <div className="admin-container">
          <h2 className="title">🎬 Schedule Movie</h2>

          {/* Movie */}
          <div className="form-group">
            <label>Movie:</label>
            <Select
              options={movies.map(m => ({ value: m.id, label: m.title }))}
              value={
                selectedMovie
                  ? { value: selectedMovie, label: movies.find(m => m.id === selectedMovie)?.title }
                  : null
              }
              onChange={option => setSelectedMovie(option?.value || null)}
              isClearable
              placeholder="Search and select movie..."
            />
          </div>

          {/* Theater */}
          <div className="form-group">
            <label>Theater:</label>
            <select value={selectedTheater ?? ""} onChange={e => setSelectedTheater(Number(e.target.value))}>
              <option value="">Select theater</option>
              {theaters.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Hall */}
          <div className="form-group">
            <label>Hall:</label>
            <select value={selectedHall ?? ""} onChange={e => setSelectedHall(Number(e.target.value))}>
              <option value="">Select hall</option>
              {halls.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          {/* Multi-Date Picker */}
          <div className="form-group">
            <label>Select Dates:</label>
            <MultiDatePicker onChange={setDates} />
          </div>

          {/* Time slots */}
          <div className="form-group">
            <label>Select Time Slots:</label>
            <div className="time-grid">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  className={`time-btn ${selectedTimes.includes(slot) ? "active" : ""}`}
                  onClick={() => toggleTime(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-submit" onClick={handleSubmit}>
            Add Showtimes
          </button>
        </div>

        {/* Footer */}
        <LoginFooter />
      </div>

  );
};

export default AdminSchedule;
