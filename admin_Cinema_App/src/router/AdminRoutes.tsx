//import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/Admin/Dashboard';
import CreateMovies from "./../pages/Admin/CreateMovies";
import EditMovies from '../pages/Admin/EditMovies';
import DeleteMovies from '../pages/Admin/DeleteMovies';


export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="movies/add" element={<CreateMovies />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="movies/edit" element={<EditMovies />} />
      <Route path="movies/delete" element={<DeleteMovies />} />

    </Routes>

  );
}
