import React from 'react';
import { useParams } from 'react-router-dom';
import AdminSchedule from './AdminSchedule';


const ScheduleMovieWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <p>Invalid movie id</p>;

  return <AdminSchedule movieId={parseInt(id, 10)} />;
};

export default ScheduleMovieWrapper;
