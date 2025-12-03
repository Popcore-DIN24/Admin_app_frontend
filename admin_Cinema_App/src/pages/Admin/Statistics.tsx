import { useState, useEffect } from "react";
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
        const res = await fetch("https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/theaters");
        const data = await res.json();
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
        const res = await fetch(`https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/theaters/${selectedTheater}/halls`);
        const data = await res.json();
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

      let query = `https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/reports/tickets?theater_id=${selectedTheater}&hall_id=${selectedHall}`;

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
    <div className="p-6 bg-white shadow rounded-2xl space-y-6">
      <h2 className="text-2xl font-bold">Ticket Sales & Revenue Report</h2>

      {/* Theater & Hall Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Select Theater</label>
          <select
            className="w-full border rounded p-2"
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

        <div>
          <label className="block text-sm text-gray-600 mb-1">Select Hall</label>
          <select
            className="w-full border rounded p-2"
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
      <div className="grid grid-cols-4 gap-4 mt-2">
        <button
          className={`p-2 rounded ${dateFilter === "today" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          onClick={() => setDateFilter("today")}
        >
          Today
        </button>
        <button
          className={`p-2 rounded ${dateFilter === "week" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          onClick={() => setDateFilter("week")}
        >
          This Week
        </button>
        <button
          className={`p-2 rounded ${dateFilter === "month" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          onClick={() => setDateFilter("month")}
        >
          This Month
        </button>
        <button
          className={`p-2 rounded ${dateFilter === "custom" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
          onClick={() => setDateFilter("custom")}
        >
          Custom
        </button>
      </div>

      {dateFilter === "custom" && (
        <div className="grid grid-cols-2 gap-4 mt-2">
          <input
            type="date"
            className="border rounded p-2"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
          />
          <input
            type="date"
            className="border rounded p-2"
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
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-gray-100 rounded-xl">
              <p className="text-gray-600">Total Tickets Sold</p>
              <p className="text-3xl font-bold">{stats.total_tickets}</p>
            </div>

            <div className="p-4 bg-gray-100 rounded-xl">
              <p className="text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold">
                £{stats.total_revenue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Graph */}
            <div className="mt-4">
                <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={stats.data_points}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tickets_sold" stroke="#8884d8" name="Tickets Sold" />
                    <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue (₦)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

        </>
      )}
    </div>
  );
}
