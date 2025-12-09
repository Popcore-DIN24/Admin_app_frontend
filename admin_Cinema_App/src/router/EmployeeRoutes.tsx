//import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardEmployee from '../pages/Admin/DashboardEmployee'
import CreateMovies from "./../pages/Admin/CreateMovies";
import EditMovies from '../pages/Admin/EditMovies';
import DeleteMovies from '../pages/Admin/DeleteMovies';
import MoviesList from "../pages/Admin/MoviesList"
import AssignSchedule from '../pages/Admin/AssignSchedule';
import MovieSchedule from '../pages/Admin/MovieSchedule';
import ScheduleMovieWrapper from '../pages/Admin/ScheduleMovieWrapper';
import Cinemamanagement from '../pages/Admin/Cinemamanagement'
import CreateAdmin from '../pages/Admin/CreateNewAdmin';
import TicketStatistics from '../pages/Admin/Statistics';



export default function EmployeeRoutes() {
  return (
        <Routes>
      <Route path="/" element={<DashboardEmployee/>} />
      <Route path="dashboard" element={<DashboardEmployee />} />
      <Route path="movies/add" element={<CreateMovies />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="movies/edit" element={<EditMovies />} />
      <Route path="movies/delete" element={<DeleteMovies />} />
      <Route path="movies/list" element={<MoviesList />} />
      <Route path="movies/:id/schedule" element={<AssignSchedule />} />
      <Route path="movies/:id/schedule-view" element={<MovieSchedule />}/>
      <Route path="movies/:id/schedule-add" element={<ScheduleMovieWrapper />} />
      <Route path="halls" element={<Cinemamanagement />} />
      <Route path="creation" element={<CreateAdmin/>}/>
      <Route path="stats" element={<TicketStatistics/>}/>



    </Routes>
  )
}
