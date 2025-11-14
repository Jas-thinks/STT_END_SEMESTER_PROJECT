import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700">
              InterviewPrep
            </Link>
          </div>
          
          <ul className="flex items-center space-x-6">
            <li>
              <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Home
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/practice" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    Practice
                  </Link>
                </li>
                <li>
                  <Link to="/leaderboard" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link to="/chatbot" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    Chatbot
                  </Link>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    Hi, {user?.name || 'User'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/leaderboard" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
