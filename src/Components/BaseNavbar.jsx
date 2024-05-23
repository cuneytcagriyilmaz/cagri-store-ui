import React from 'react';
import { Link } from 'react-router-dom';
import './BaseNavbar.css';

function BaseNavbar() {

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">CagriStore</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>

      </ul>
    </nav>
  );
}

export default BaseNavbar;
