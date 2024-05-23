
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Components/UserComponents/UserNavbar/UserNavbar';
import Login from './Components/LoginRegister/Login';
import Register from './Components/LoginRegister/Register';
import AdminPage from './Components/AdminComponents/AdminPage';
import UserPage from './Components/UserComponents/UserPage';
import './App.css';
import AddCategory from './Components/AdminComponents/AdminCategory/AdminCategory';
import AdminProduct from './Components/AdminComponents/AdminProduct/AdminProduct';
import Cart from './Components/UserComponents/Cart/Cart';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (userType) => {
    setIsLoggedIn(true);
    setIsAdmin(userType === 'Admin');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const redirectPage = () => {
    if (isLoggedIn) {
      return isAdmin ? <Navigate to="/admin" /> : <Navigate to="/user" />;
    } else {
      return (
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      );
    }
  };


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          {/* <Route path="/" element={redirectPage()} /> */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPage onLogout={handleLogout} />} />
          <Route path="/user" element={<UserPage onLogout={handleLogout} />} />
          <Route path="/category" element={<AddCategory onLogout={handleLogout} />} />
          <Route path="/cart" element={<Cart onLogout={handleLogout} />} />
          <Route path="/product" element={<AdminProduct onLogout={handleLogout} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
