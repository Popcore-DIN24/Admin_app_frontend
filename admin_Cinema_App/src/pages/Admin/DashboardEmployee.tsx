//import React from "react";
import Calendar from "./Calendar";
import "./AdminDashboard.css";
import AdminNavbar from "../../components/AdminNavbar";
import LoginFooter from "../Auth/LoginFooter";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  // const employees = ["Minou Vahedinezhad", "John Doe", "Jack Smisth"]; 

  return (
    <div className="admin-dashboard-page">  
      {/* Navbar */}
      <AdminNavbar />

      {/* Main Dashboard */}
      <div className="dashboard-container">

        {/* LEFT SIDE */}
        <div className="left-column">
          {/* Welcome Card */}
          <div className="welcome-card">
            <div className="welcome-text">
              <h3>Hello # Super_Admin! 👋</h3>
              <p>Check today's movie schedule and sales</p>
              
            </div>
            <div className="welcome-illustration">
              {/* remember to add photo */}
            </div>
          </div>

          {/* Small Stats */}
          <div className="stats-grid">
            <Link to="/admin/movies/add" className="stat-card">
              <h2>Add</h2>
              <p>New Movie</p>
            </Link>


            <Link to="/admin/movies/edit" className="stat-card">
              <h2>Edit</h2>
              <p>Movies</p>
            </Link>

           <Link to="/admin/movies/1/schedule-add" className="stat-card">
              <h2>Schedule</h2>
              <p>Management</p>
            </Link>


            <Link to="/admin/halls" className="stat-card">
              <h2>Halls</h2>
              <p>Management</p>
            </Link>

          </div>

          

        </div> {/* left-column */}

        {/* RIGHT SIDE */}
        <div className="right-column">

          {/* Calendar */}
          <div className="calendar-box">
            <Calendar />
          </div>


        </div> {/* right-column */}

      </div> {/* dashboard-container */}

      {/* Footer */}
      <LoginFooter />

    </div> // admin-dashboard-page
  );
}
