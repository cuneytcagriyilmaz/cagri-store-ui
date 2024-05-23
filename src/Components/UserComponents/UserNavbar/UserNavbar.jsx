import React from 'react';
import { Link } from 'react-router-dom';
import './UserNavbar.css';

function UserNavbar() {
  const handleLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('userEmail');

    window.location.href = '/';
  };
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">CagriStore</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/user">Shop</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>

      </ul>
    </nav>
  );
}

export default UserNavbar;
