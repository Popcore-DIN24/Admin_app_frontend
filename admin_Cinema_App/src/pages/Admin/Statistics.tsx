import { useState, useEffect } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import LoginFooter from "../Auth/LoginFooter";
import "./Statistics.css";
import api from "../../api/axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Theater {
  id: number;
  name: string;
}

interface Hall {
  id: number;
  name: string;
}

interface StatsResponse {
  total_tickets: number;
  total_revenue: number;
  data_points: {
    day: string;
    tickets_sold: number;
    revenue: number;
  }[];
}

export default function TicketStatistics() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);

  const [selectedTheater, setSelectedTheater] = useState<number | null>(null);
  const [selectedHall, setSelectedHall] = useState<number | null>(null);

  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "custom">("today");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");

  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch theaters on mount
  useEffect(() => {
    async function loadTheaters() {
      try {
        const res = await api.get("/api/v6/theaters");
        const data = await res.data();
        setTheaters(data.data);
        if (data.data.length > 0) setSelectedTheater(data.data[0].id);
      } catch (err) {
        console.error("Error fetching theaters:", err);
      }
    }
    loadTheaters();
  }, []);

  // Fetch halls whenever selectedTheater changes
  useEffect(() => {
    if (!selectedTheater) return;
    async function loadHalls() {
      try {
        const res = await api.get(`/api/v6/theaters/${selectedTheater}/halls`);
        const data = await res.data();
        setHalls(data.data);
        if (data.data.length > 0) setSelectedHall(data.data[0].id);
      } catch (err) {
        console.error("Error fetching halls:", err);
      }
    }
    loadHalls();
  }, [selectedTheater]);

  // Fetch stats whenever theater, hall, or date filter changes
  useEffect(() => {
    if (!selectedTheater || !selectedHall) return;

    async function loadStats() {
      setLoading(true);

      let query = 'https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/api/v6/reports/tickets?theater_id=${selectedTheater}&hall_id=${selectedHall}';

      if (dateFilter === "today") {
        query += "&filter=today";
      } else if (dateFilter === "week") {
        query += "&filter=week";
      } else if (dateFilter === "month") {
        query += "&filter=month";
      } else if (dateFilter === "custom" && customStart && customEnd) {
        query += `&start_date=${customStart}&end_date=${customEnd}`;
      }

      try {
        const res = await fetch(query);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching ticket stats:", err);
      }

      setLoading(false);
    }

    loadStats();
  }, [selectedTheater, selectedHall, dateFilter, customStart, customEnd]);

  return (
    <div>
      <AdminNavbar />
      <div className="stats-container">

        <h2 className="stats-title">Ticket Sales & Revenue Report</h2>

        {/* Theater & Hall Selection */}
        <div className="row-2">
          <div className="field">
            <label>Select Theater</label>
            <select
              value={selectedTheater ?? ""}
              onChange={(e) => setSelectedTheater(Number(e.target.value))}
            >
              {theaters.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Select Hall</label>
            <select
              value={selectedHall ?? ""}
              onChange={(e) => setSelectedHall(Number(e.target.value))}
            >
              {halls.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Filter */}
        <div className="date-filter">
          <button
            className={dateFilter === "today" ? "btn active" : "btn"}
            onClick={() => setDateFilter("today")}
          >
            Today
          </button>

          <button
            className={dateFilter === "week" ? "btn active" : "btn"}
            onClick={() => setDateFilter("week")}
          >
            This Week
          </button>

          <button
            className={dateFilter === "month" ? "btn active" : "btn"}
            onClick={() => setDateFilter("month")}
          >
            This Month
          </button>

          <button
            className={dateFilter === "custom" ? "btn active" : "btn"}
            onClick={() => setDateFilter("custom")}
          >
            Custom
          </button>
        </div>

        {dateFilter === "custom" && (
          <div className="row-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
          </div>
        )}

        {/* Stats Display */}
        {loading ? (
          <p>Loading statistics...</p>
        ) : !stats ? (
          <p>No data available.</p>
        ) : (
          <>
            <div className="row-2 stats-box-row">

              <div className="stats-box">
                <p>Total Tickets Sold</p>
                <h3>{stats.total_tickets}</h3>
              </div>

              <div className="stats-box">
                <p>Total Revenue</p>
                <h3>£{stats.total_revenue.toLocaleString()}</h3>
              </div>

            </div>

            {/* Graph */}
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={stats.data_points}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="tickets_sold" stroke="#8884d8" name="Tickets Sold" />
                  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue (£)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      <LoginFooter />
    </div>
  );
}
