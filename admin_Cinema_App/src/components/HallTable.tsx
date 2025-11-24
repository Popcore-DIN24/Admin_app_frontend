import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Hall, Theater } from '../types';

interface Props {
  theater: Theater;
  onManageHall: (hall: Hall) => void;
}

const HallTable: React.FC<Props> = ({ theater, onManageHall }) => {
  const [halls, setHalls] = useState<Hall[]>([]);

  useEffect(() => {
    const fetchHalls = async () => {
      if (!theater) return;
      try {
        const res = await api.get(`/api/v6/theaters/${theater.id}/halls`);
        setHalls(res.data.data || []);
      } catch (err) {
        console.error('Error fetching halls:', err);
        setHalls([]);
      }
    };
    fetchHalls();
  }, [theater]);

  if (!theater) return null;

  return (
    <div>
      <h2>{theater.name} Halls</h2>
      <table>
        <thead>
          <tr>
            <th>Hall Name</th>
            <th>Capacity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {halls.map(h => (
            <tr key={h.id}>
              <td>{h.name}</td>
              <td>{h.capacity}</td>
              <td>
                <button className="cinema-btn" onClick={() => onManageHall(h)}>
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HallTable;
