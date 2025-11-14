import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart, Sparkles } from 'lucide-react';

const Footer = () => (
  <>
    <style>{`
      .footer-link:hover {
        background: linear-gradient(to right, #a855f7, #ec4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .social-icon:hover {
        transform: translateY(-4px);
        background: linear-gradient(135deg, #a855f7, #ec4899);
      }
    `}</style>

    <footer style={{ 
      background: 'rgba(15, 23, 42, 0.95)', 
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(168, 85, 247, 0.2)',
      marginTop: '4rem'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem 2rem' }}>
        
        {/* Main Footer Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Brand Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', background: 'linear-gradient(135deg, #a855f7, #ec4899)', borderRadius: '0.75rem' }}>
                <Sparkles style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                InterviewPrep
              </span>
            </div>
            <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Master your interview skills with our comprehensive platform. Practice, learn, and succeed.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '0.75rem', border: '1px solid rgba(168, 85, 247, 0.3)', transition: 'all 0.3s ease', textDecoration: 'none' }}>
                <Github style={{ width: '1.25rem', height: '1.25rem', color: '#c084fc' }} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '0.75rem', border: '1px solid rgba(168, 85, 247, 0.3)', transition: 'all 0.3s ease', textDecoration: 'none' }}>
                <Twitter style={{ width: '1.25rem', height: '1.25rem', color: '#c084fc' }} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '0.75rem', border: '1px solid rgba(168, 85, 247, 0.3)', transition: 'all 0.3s ease', textDecoration: 'none' }}>
                <Linkedin style={{ width: '1.25rem', height: '1.25rem', color: '#c084fc' }} />
              </a>
              <a href="mailto:contact@interviewprep.com" className="social-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '0.75rem', border: '1px solid rgba(168, 85, 247, 0.3)', transition: 'all 0.3s ease', textDecoration: 'none' }}>
                <Mail style={{ width: '1.25rem', height: '1.25rem', color: '#c084fc' }} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'white', marginBottom: '1.5rem' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/" className="footer-link" style={{ color: '#94a3b8', fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="footer-link" style={{ color: '#94a3b8', fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/practice" className="footer-link" style={{ color: '#94a3b8', fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                  Practice
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="footer-link" style={{ color: '#94a3b8', fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="footer-link" style={{ color: '#94a3b8', fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                  Chatbot
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'white', marginBottom: '1.5rem' }}>Resources</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <a href="#" className="footer-link" style={{ color: '#94a3b8', fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="footer-link" style={{ color: '#94a3b8', fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="footer-link" style={{ color: '#94a3b8', fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="footer-link" style={{ color: '#94a3b8', fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="footer-link" style={{ color: '#94a3b8', fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'white', marginBottom: '1.5rem' }}>Legal</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <a href="#" className="footer-link" style={{ color: '#94a3b8', fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="footer-link" style={{ color: '#94a3b8', fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="footer-link" style={{ color: '#94a3b8', fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="footer-link" style={{ color: '#94a3b8', fontSize: '0.95rem', textDecoration: 'none', transition: 'all 0.3s ease' }}>
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          paddingTop: '2rem', 
          borderTop: '1px solid rgba(168, 85, 247, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span>&copy; {new Date().getFullYear()} Interview Prep Platform. All rights reserved.</span>
          </p>
          <p style={{ color: '#64748b', fontSize: '0.875rem', textAlign: 'center', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Made with <Heart style={{ width: '1rem', height: '1rem', color: '#ec4899', fill: '#ec4899' }} /> for aspiring developers
          </p>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;
