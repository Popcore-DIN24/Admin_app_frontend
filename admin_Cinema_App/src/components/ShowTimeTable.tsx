import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Hall } from '../types/index';

interface ShowTime {
  id: number;
  movie_title: string;
  start_time: string;
  end_time: string;
  price_amount: number;
}

interface Props {
  hall: Hall;
  date?: string; 
}

const ShowTimeTable: React.FC<Props> = ({ hall, date }) => {
  const [showtimes, setShowtimes] = useState<ShowTime[]>([]);
  const [startDate, setStartDate] = useState<string>(date || '');
  const [endDate, setEndDate] = useState<string>(date || '');

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const params: any = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        const res = await api.get(`/api/v6/halls/${hall.id}/showtimes`, { params });
        setShowtimes(res.data.data || []);` `
      } catch (err) {
        console.error('Error fetching showtimes:', err);
        setShowtimes([]);
      }
    };
    fetchShowtimes();
  }, [hall, startDate, endDate]);

  return (
    <div >
      <h3>Showtimes for {hall.name}</h3>

      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />

        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Movie</th>
            <th>Start</th>
            <th>End</th>
            <th>Price (€)</th>
          </tr>
        </thead>
        <tbody>
          {showtimes.map(st => (
            <tr key={st.id}>
              <td>{st.movie_title}</td>
              <td>{new Date(st.start_time).toLocaleString()}</td>
              <td>{new Date(st.end_time).toLocaleString()}</td>
              <td>{st.price_amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowTimeTable;
