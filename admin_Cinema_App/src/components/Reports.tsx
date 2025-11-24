import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Theater } from '../types/index';

interface Report {
  date: string;
  total_tickets: number;
  total_revenue: number;
}

interface Props {
  theater: Theater;
}

const Reports: React.FC<Props> = ({ theater }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const params: any = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        const res = await api.get(`/api/v6/theaters/${theater.id}/reports`, { params });
        setReports(res.data.data || []);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setReports([]);
      }
    };

    fetchReports();
  }, [theater, startDate, endDate]);

  return (
    <div>
      <h3>Reports for {theater.name}</h3>

      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />

        <label>End Date:</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Total Tickets</th>
            <th>Total Revenue (€)</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, idx) => (
            <tr key={idx}>
              <td>{r.date}</td>
              <td>{r.total_tickets}</td>
              <td>{r.total_revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
