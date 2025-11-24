import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import MultiDatePicker from "./MultiDatePicker";
import Select from "react-select";
import "./AdminSchedule.css";
import AdminNavbar from "../../components/AdminNavbar";
import LoginFooter from "../Auth/LoginFooter";

interface Theater { id: number; name: string; }
interface Hall { id: number; name: string; }
interface Movie { id: number; title: string; }

// --- helper for building selection key ---
const makeSelectionKey = (date: string, slot: string) => `${date}||${slot}`;
const parseSelectionKey = (key: string) => {
  const [date, slot] = key.split("||");
  return { date, slot };
};

const AdminSchedule: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);

  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<number | null>(null);

  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedHall, setSelectedHall] = useState<number | null>(null);

  // dates: ["2025-11-23","2025-11-24", ...]
  const [dates, setDates] = useState<string[]>([]);

  // timeSlotsByDate: { "2025-11-23": ["10:00 - 12:00", ...], ... }
  const [timeSlotsByDate, setTimeSlotsByDate] = useState<Record<string, string[]>>({});
  // selectedTimes: ["2025-11-23||10:00 - 12:00", ...]
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const [price, setPrice] = useState<number>(10);

  // --- Custom styles for react-select ---
  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.isSelected ? "white" : "#181141ff",
      backgroundColor: state.isSelected ? "#040b4bff" : "white",
      padding: 10,
    }),
    singleValue: (provided: any) => ({ ...provided, color: "#181141ff" }),
    placeholder: (provided: any) => ({ ...provided, color: "#999" }),
    control: (provided: any) => ({ ...provided, borderRadius: 8, borderColor: "#ccc", padding: 2 }),
  };

  // --- Fetch Movies ---
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get("/api/v6/movies");
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

  // --- Fetch Halls for selected theater ---
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

  // --- Generate Time Slots per date, considering existing showtimes in the chosen hall ---
  useEffect(() => {
    // reset if no hall or no dates
    if (!selectedHall || dates.length === 0) {
      setTimeSlotsByDate({});
      setSelectedTimes([]); // clear selections when hall/dates change
      return;
    }

    const fetchOccupiedAndBuildSlots = async () => {
      try {
        const res = await api.get("/api/v6/movies/scheduled");
        const allScheduled = res.data || [];

        // Get all showtimes that belong to the selected hall
        const hallShowtimes = allScheduled
          .flatMap((m: any) => m.showtimes || [])
          .filter((s: any) => s.hall_id === selectedHall)
          // map to normalized start/end Date objects for faster checks
          .map((s: any) => ({
            start: new Date(s.start_time),
            end: new Date(s.end_time),
          }));

        // slot params
        const startHour = 10;
        const endHour = 22;
        const interval = 2;

        const result: Record<string, string[]> = {};

        for (const date of dates) {
          const slotsForDate: string[] = [];

          for (let h = startHour; h < endHour; h += interval) {
            const slotStart = new Date(date);
            slotStart.setHours(h, 0, 0, 0);
            const slotEnd = new Date(date);
            slotEnd.setHours(h + interval, 0, 0, 0);

            // if any scheduled showtime overlaps this slot => conflict
            const conflict = hallShowtimes.some((st: { start: Date; end: Date }) => {
              // overlap if NOT (slotEnd <= st.start OR slotStart >= st.end)
              return !(slotEnd <= st.start || slotStart >= st.end);
            });

            if (!conflict) {
              slotsForDate.push(`${slotStart.getHours().toString().padStart(2, "0")}:00 - ${slotEnd.getHours().toString().padStart(2, "0")}:00`);
            }
          }

          result[date] = slotsForDate;
        }

        setTimeSlotsByDate(result);
        // clear previously selected times because dates/hall changed
        setSelectedTimes([]);
      } catch (err) {
        console.error("Error fetching scheduled showtimes:", err);
        setTimeSlotsByDate({});
      }
    };

    fetchOccupiedAndBuildSlots();
  }, [selectedHall, dates]);

  // --- Toggle a single date+slot selection ---
  const toggleTime = (date: string, slot: string) => {
    const key = makeSelectionKey(date, slot);
    setSelectedTimes(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // --- Submit Showtimes ---
  const handleSubmit = async () => {
    if (!selectedMovie || !selectedHall || dates.length === 0 || selectedTimes.length === 0) {
      alert("Please select movie, hall, at least one date, and at least one time.");
      return;
    }

    try {
      // group selectedTimes by date to make requests predictable
      // selectedTimes items look like "2025-11-23||10:00 - 12:00"
      const grouped: Record<string, string[]> = {};
      selectedTimes.forEach(k => {
        const { date, slot } = parseSelectionKey(k);
        grouped[date] = grouped[date] || [];
        grouped[date].push(slot);
      });

      for (const date of Object.keys(grouped)) {
        const slots = grouped[date];
        for (const slot of slots) {
          const [startHour, endHour] = slot.split(" - ").map(t => parseInt(t.split(":")[0], 10));
          const start = new Date(date); start.setHours(startHour, 0, 0, 0);
          const end = new Date(date); end.setHours(endHour, 0, 0, 0);

          const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          if (diffHours <= 0 || diffHours > 6) {
            alert(`Invalid time range: ${slot}. Max duration allowed is 6 hours.`);
            return;
          }

          try {
            await api.post(`api/v6/movies/${selectedMovie}/showtimes`, {
              hall_id: selectedHall,
              start_time: start.toISOString(),
              end_time: end.toISOString(),
              price_amount: price
            });
          } catch (err: any) {
            console.error("Showtime creation error:", err);
            if (err.response?.status === 409) {
              const conflict = err.response.data.conflict?.[0];
              alert(
                `⛔ Overlapping showtime!\nHall: ${selectedHall}\nExisting showtime:\nStart: ${new Date(conflict.start_time).toLocaleString()}\nEnd: ${new Date(conflict.end_time).toLocaleString()}`
              );
            } else {
              alert("Unknown error creating showtime.");
            }
            return;
          }
        }
      }

      alert("Showtimes added successfully!");
      // reset form
      setDates([]);
      setSelectedTimes([]);
      setSelectedMovie(null);
      setSelectedHall(null);
      setSelectedTheater(null);
      setTimeSlotsByDate({});
    } catch (err) {
      console.error(err);
      alert("Error adding showtime.");
    }
  };

  // auth check
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) window.location.href = "/admin/login";
  }, []);

  return (
    <div className="admin-schedule-page">
      <AdminNavbar />
      <div className="admin-schedule-container">
        <h2 className="admin-schedule-title">🎬 Schedule Movie</h2>

        {/* Movie */}
        <div className="admin-schedule-form-group">
          <label>Movie:</label>
          <Select
            options={movies.map(m => ({ value: m.id, label: m.title }))}
            value={selectedMovie ? { value: selectedMovie, label: movies.find(m => m.id === selectedMovie)?.title } : null}
            onChange={option => setSelectedMovie(option?.value || null)}
            isClearable
            placeholder="Search and select movie..."
            styles={customStyles}
          />
        </div>

        {/* Price */}
        <div className="admin-schedule-form-group">
          <label>Price (€):</label>
          <input type="number" min={0} value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Enter ticket price" />
        </div>

        {/* Theater */}
        <div className="admin-schedule-form-group">
          <label>Theater:</label>
          <Select
            options={theaters.map(t => ({ value: t.id, label: t.name }))}
            value={selectedTheater ? { value: selectedTheater, label: theaters.find(t => t.id === selectedTheater)?.name } : null}
            onChange={option => setSelectedTheater(option?.value || null)}
            isClearable
            placeholder="Select theater..."
            styles={customStyles}
          />
        </div>

        {/* Hall */}
        <div className="admin-schedule-form-group">
          <label>Hall:</label>
          <Select
            options={halls.map(h => ({ value: h.id, label: h.name }))}
            value={selectedHall ? { value: selectedHall, label: halls.find(h => h.id === selectedHall)?.name } : null}
            onChange={option => setSelectedHall(option?.value || null)}
            isClearable
            placeholder="Select hall..."
            styles={customStyles}
          />
        </div>

        {/* Dates */}
        <div className="admin-schedule-form-group">
          <label>Select Dates:</label>
          <MultiDatePicker onChange={setDates} />
        </div>

        {/* Time slots per date */}
        <div className="admin-schedule-form-group">
          <label>Select Time Slots:</label>

          {dates.length === 0 && <p style={{ color: "#666" }}>Please pick one or more dates to show available slots.</p>}

          <div>
            {dates.map(date => {
              const slots = timeSlotsByDate[date] || [];
              return (
                <div key={date} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>{new Date(date).toLocaleDateString()}</div>
                  <div className="admin-schedule-time-grid">
                    {slots.length === 0 && <div style={{ color: "#999" }}>No available slots for this date</div>}
                    {slots.map((slot) => {
                      const selKey = makeSelectionKey(date, slot);
                      const isActive = selectedTimes.includes(selKey);
                      return (
                        <button
                          key={`${date}--${slot}`} // unique key: date + slot
                          className={`admin-schedule-time-btn ${isActive ? "active" : ""}`}
                          onClick={() => toggleTime(date, slot)}
                          type="button"
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button className="admin-schedule-submit-btn" onClick={handleSubmit}>Add Showtimes</button>
      </div>
      <LoginFooter />
    </div>
  );
};

export default AdminSchedule;
