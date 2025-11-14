import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-logo">
      <Link to="/">InterviewPrep</Link>
    </div>
    <ul className="navbar-links">
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li><Link to="/practice">Practice</Link></li>
      <li><Link to="/leaderboard">Leaderboard</Link></li>
      <li><Link to="/chatbot">Chatbot</Link></li>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/register">Register</Link></li>
    </ul>
  </nav>
);

export default Navbar;
