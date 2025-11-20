import React from 'react';
import { useParams } from 'react-router-dom';
import AdminSchedule from './AdminSchedule';

const ScheduleMovieWrapper: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  if (!id) return <p>Invalid movie id</p>;

  // cast AdminSchedule to a component type that accepts the movieId prop
  const AdminScheduleComponent = AdminSchedule as React.ComponentType<{ movieId: number }>;

  return <AdminScheduleComponent movieId={parseInt(id, 10)} />;
};

export default ScheduleMovieWrapper;