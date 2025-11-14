import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Sparkles } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        .nav-link-hover:hover {
          background: linear-gradient(to right, #a855f7, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glass-nav {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(168, 85, 247, 0.2);
        }
      `}</style>

      <nav className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '5rem' }}>
            
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', background: 'linear-gradient(135deg, #a855f7, #ec4899)', borderRadius: '0.75rem' }}>
                <Sparkles style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                InterviewPrep
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <ul style={{ display: 'flex', alignItems: 'center', gap: '2rem', listStyle: 'none', margin: 0 }} className="hidden md:flex">
              <li>
                <Link to="/" className="nav-link-hover" style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '1rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                  Home
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/dashboard" className="nav-link-hover" style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '1rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/practice" className="nav-link-hover" style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '1rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                      Practice
                    </Link>
                  </li>
                  {/* <li>
                    <Link to="/leaderboard" className="nav-link-hover" style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '1rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                      Leaderboard
                    </Link>
                  </li> */}
                  <li>
                    <Link to="/chatbot" className="nav-link-hover" style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '1rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                      Chatbot
                    </Link>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '0.75rem', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                      <User style={{ width: '1rem', height: '1rem', color: '#c084fc' }} />
                      <span style={{ fontSize: '0.875rem', color: '#e9d5ff', fontWeight: '500' }}>
                        {user?.name || 'User'}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '0.75rem', color: '#fca5a5', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
                    >
                      <LogOut style={{ width: '1rem', height: '1rem' }} />
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/leaderboard" className="nav-link-hover" style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '1rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                      Leaderboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      style={{ padding: '0.625rem 1.5rem', color: '#e9d5ff', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'none', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#c084fc'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#e9d5ff'; }}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.5rem', background: 'linear-gradient(to right, #a855f7, #ec4899)', border: 'none', borderRadius: '0.75rem', color: 'white', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: '0 4px 20px -4px rgba(168, 85, 247, 0.4)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px -4px rgba(168, 85, 247, 0.6)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px -4px rgba(168, 85, 247, 0.4)'; }}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'block', padding: '0.5rem', color: 'white', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{ background: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(168, 85, 247, 0.2)' }} className="md:hidden">
            <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '1rem', textDecoration: 'none', padding: '0.75rem 0' }}>Home</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '1rem', textDecoration: 'none', padding: '0.75rem 0' }}>Dashboard</Link>
                  <Link to="/practice" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '1rem', textDecoration: 'none', padding: '0.75rem 0' }}>Practice</Link>
                  <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '1rem', textDecoration: 'none', padding: '0.75rem 0' }}>Leaderboard</Link>
                  <Link to="/chatbot" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '1rem', textDecoration: 'none', padding: '0.75rem 0' }}>Chatbot</Link>
                  <div style={{ padding: '0.75rem 0', color: '#c084fc', fontSize: '0.875rem' }}>Hi, {user?.name || 'User'}</div>
                  <button onClick={handleLogout} style={{ padding: '0.75rem 1.5rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '0.75rem', color: '#fca5a5', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e2e8f0', fontWeight: '500', fontSize: '1rem', textDecoration: 'none', padding: '0.75rem 0' }}>Leaderboard</Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e9d5ff', fontWeight: '500', fontSize: '1rem', textDecoration: 'none', padding: '0.75rem 0' }}>Login</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(to right, #a855f7, #ec4899)', borderRadius: '0.75rem', color: 'white', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'none' }}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
