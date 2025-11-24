//import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/Admin/Dashboard';
import CreateMovies from "./../pages/Admin/CreateMovies";
import EditMovies from '../pages/Admin/EditMovies';
import DeleteMovies from '../pages/Admin/DeleteMovies';
import MoviesList from "../pages/Admin/MoviesList"
import AssignSchedule from '../pages/Admin/AssignSchedule';
import MovieSchedule from '../pages/Admin/MovieSchedule';
import ScheduleMovieWrapper from '../pages/Admin/ScheduleMovieWrapper';
import CinemaManagement from "../pages/Admin/cinemamanagement";



export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="movies/add" element={<CreateMovies />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="movies/edit" element={<EditMovies />} />
      <Route path="movies/delete" element={<DeleteMovies />} />
      <Route path="movies/list" element={<MoviesList />} />
      <Route path="movies/:id/schedule" element={<AssignSchedule />} />
      <Route path="movies/:id/schedule-view" element={<MovieSchedule />}/>
      <Route path="movies/:id/schedule-add" element={<ScheduleMovieWrapper />} />
      <Route path="halls" element={<CinemaManagement />} />



    </Routes>

  );
}
