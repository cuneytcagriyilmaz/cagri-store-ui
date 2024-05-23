
import React from 'react';
import { Link } from 'react-router-dom';
import './AdminNavbar.css';

function AdminNavbar() {
  const handleLogout = () => {
    localStorage.removeItem('auth');

    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">CagriStore</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/category">Category</Link></li>
        <li><Link to="/product">Product</Link></li>
        <li><Link to="/order">Order</Link></li>
        <li><Link to="/admin">Admin</Link></li>
        <li><Link to="/user">User</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
}

export default AdminNavbar;
