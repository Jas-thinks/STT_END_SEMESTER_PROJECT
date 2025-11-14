import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { authAPI } from '../../services/apiService';
import './Navbar.css';

const Navbar = () => {
  const history = useHistory();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = authAPI.isAuthenticated();
      setIsAuthenticated(auth);
      if (auth) {
        setUser(authAPI.getCurrentUser());
      }
    };

    checkAuth();
    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setUser(null);
    history.push('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to="/">
              <span className="brand-icon">🎯</span>
              Interview Prep
            </Link>
          </div>

          <button className="navbar-toggle" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
            <ul className="navbar-links">
              <li>
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/practice" onClick={() => setMenuOpen(false)}>
                  Practice
                </Link>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/leaderboard" onClick={() => setMenuOpen(false)}>
                      Leaderboard
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <div className="navbar-actions">
              {isAuthenticated ? (
                <>
                  <div className="user-menu">
                    <span className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
                    <span className="user-name">{user?.name}</span>
                  </div>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-outline btn-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;