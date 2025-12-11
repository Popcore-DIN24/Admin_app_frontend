import logo from '../../assets/logo.png';
import navbarBg from '../../assets/navbar-bg.jpg';

import './NavbarLogin.css'

export default function LoginNavbar() {
  return (
    <div className="login-navbar" style={{ backgroundImage: `url(${navbarBg})` }}>
      <div className="login-navbar-left">
        <img src={logo} alt="Cinema Logo" className="logo" />
        <span className="brand-text">NORTH STAR</span>
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
