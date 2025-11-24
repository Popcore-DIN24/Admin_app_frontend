import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Hall, Theater } from '../types';

interface Props {
  theater: Theater;
  onManageHall: (hall: Hall) => void;
}

const HallList: React.FC<Props> = ({ theater, onManageHall }) => {
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
      <h2>{theater.name}</h2>
      <ul>
        {halls.map(h => (
            <li key={h.id}>
                {h.name} - Capacity: {h.capacity}
                <button className="cinema-btn" onClick={() => onManageHall(h)}>Manage</button>
            </li>
        ))}

      </ul>
    </div>
  );
};

export default HallList;
