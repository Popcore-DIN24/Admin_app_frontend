//import React from "react";
import Calendar from "./Calendar";
import "./AdminDashboard.css";
import AdminNavbar from "../../components/AdminNavbar";
import LoginFooter from "../Auth/LoginFooter";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const employees = ["Minou Vahedinezhad", "John Doe", "Jack Smisth"]; 

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
              <h3>Hello #Admin! 👋</h3>
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

            <Link to="/admin/seats" className="stat-card">
              <h2>Halls</h2>
              <p>Management</p>
            </Link>

            <Link to="/admin/employees" className="stat-card">
              <h2>Team</h2>
              <p>Management</p>
            </Link>
          </div>

          {/* Admin Actions */}
          <div className="progress-card">
            <div className="progress-header">
              <h3>Quick Actions</h3>
            </div>

            <div className="progress-table">
              <div className="row"><span>View Payments</span></div>
              <div className="row"><span>Add New Movie</span></div>
              <div className="row"><span>Edit Movies</span></div>
              <div className="row"><span>Manage Halls</span></div>
              <div className="row"><span>Manage Employees</span></div>
            </div>
          </div>

        </div> {/* left-column */}

        {/* RIGHT SIDE */}
        <div className="right-column">

          {/* Calendar */}
          <div className="calendar-box">
            <Calendar />
          </div>

          {/* Employees */}
          <div className="new-applicants-box">
            <div className="na-header">
              <h3>Employees</h3>
            </div>

            {employees.map((emp, i) => (
              <div className="applicant" key={i}>
                <div className="info">
                  <h4>{emp}</h4>
                </div>
              </div>
            ))}
          </div>

        </div> {/* right-column */}

      </div> {/* dashboard-container */}

      {/* Footer */}
      <LoginFooter />

    </div> // admin-dashboard-page
  );
}
