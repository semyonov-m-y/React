import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAdmin } = useAdmin();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo-link">
          <h1>Rick and Morty Universe</h1>
        </Link>
        <p>Explore characters from the multiverse</p>

        <nav className="header-nav">
          <div className="main-nav">
            <Link to="/" className="nav-link">Characters</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/posts" className="nav-link">Posts</Link>
          </div>

          <div className="header-controls">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-greeting">Hello, {user?.username}</span>
                {isAdmin && (
                  <Link to="/admin" className="nav-link admin-link">Admin</Link>
                )}
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;