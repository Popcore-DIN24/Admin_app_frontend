import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Theater } from '../types';

interface Props {
  onSelect: (theater: Theater) => void;
}

const TheaterSelect: React.FC<Props> = ({ onSelect }) => {
  const [theaters, setTheaters] = useState<Theater[]>([]);

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const res = await api.get('/api/v6/theaters');
        console.log('Fetched Theaters:', res.data.data);
        setTheaters(res.data.data || []);
      } catch (err) {
        console.error('Error fetching theaters:', err);
      }
    };
    fetchTheaters();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    if (isNaN(selectedId)) return;
    const selected = theaters.find(t => Number(t.id) === selectedId);
    if (selected) onSelect(selected);
  };

  return (
    <div>
      <h2>Choose Cinema</h2>
      <select onChange={handleChange} defaultValue="">
        <option value="">-- choose the cinema --</option>
        {theaters.map(t => (
          <option key={t.id} value={t.id}>
            {t.name} ({t.city})
          </option>
        ))}
      </select>
    </div>
  );
};

export default TheaterSelect;
