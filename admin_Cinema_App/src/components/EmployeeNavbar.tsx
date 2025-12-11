// LoginNavbar.tsx
import { useNavigate } from "react-router-dom";
import logo from '../../src/assets/logo.png';
import navbarBg from '../../src/assets/navbar-bg.jpg';
import './EmployeeNavbar.css';

export default function EmployeeNavbar() {
 const navigate = useNavigate();

  return (
    <div className="login-navbar" style={{ backgroundImage: `url(${navbarBg})` }}>
      <div className="login-navbar-left">
        <img 
          src={logo} 
          alt="Cinema Logo" 
          className="logo" 
          style={{ cursor: "pointer" }} 
          onClick={() => navigate("/admin/dashboard")} 
        />
        <span className="brand-text">NORTH STAR</span>
      </div>

      <div className="login-navbar-center">
        <button onClick={() => navigate("/employee/movies/add")} className="nav-btn">Add Movie</button>
        <button onClick={() => navigate("/employee/movies/list")} className="nav-btn">Assign Movie Schedule</button>
        <button onClick={() => navigate("/employee/movies/edit")} className="nav-btn">Edit Movies</button>
        <button onClick={() => navigate("/employee/movies/delete")} className="nav-btn">Delete Movies</button>
      </div>

      <div className="login-navbar-right">
        <select>
          <option value="en">EN</option>
          <option value="fi">FI</option>
        </select>
      </div>
    </div>
  );
}
