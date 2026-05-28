import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
    : '?';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to={user ? '/dashboard' : '/'} className="nav-logo">
          <span className="logo-mark">◆</span>
          <span className="grad-text">SNIP</span>
        </Link>

        {user ? (
          <div className="nav-actions">
            <Link to="/dashboard" className={`nav-link ${location.pathname==='/dashboard'?'active':''}`}>Dashboard</Link>
            <Link to="/profile" className="nav-avatar" title={user.name}>
              {initials}
            </Link>
          </div>
        ) : (
          <div className="nav-actions">
            <Link to="/login"  className="nav-link">Login</Link>
            <Link to="/signup" className="nav-btn">Get Started</Link>
          </div>
        )}

        <button className="hamburger" onClick={() => setMenuOpen(s => !s)} aria-label="Menu">
          <span className={menuOpen ? 'open' : ''}/><span className={menuOpen ? 'open' : ''}/><span className={menuOpen ? 'open' : ''}/>
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu animate-fade-in">
          {user ? (
            <>
              <div className="mobile-user">
                <div className="mobile-avatar">{initials}</div>
                <div>
                  <div className="mobile-name">{user.name}</div>
                  <div className="mobile-email">{user.email}</div>
                </div>
              </div>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout} className="mobile-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
