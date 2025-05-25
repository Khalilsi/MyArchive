import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaBars } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);



  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          MY archive
        </Link>

        {/* Hamburger Menu */}
        <button 
          className="navbar-toggle" 
          aria-label="Toggle navigation"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navbar Links */}
        <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li 
            className="navbar-item dropdown" 
            style={{cursor: 'pointer'}}
          >
            <Link to="/actualite" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
              Actualité
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/about" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
              à propos nous
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/features" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
              FAQ
            </Link>
          </li>
          
          {/* Mobile Auth Buttons */}
          <div className="mobile-auth">
            <Link 
              to="/login" 
              className="auth-button secondary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="auth-button primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </ul>

        {/* Desktop Auth Buttons */}
        {/* <div className="desktop-auth">
          <Link to="/login" className="auth-button secondary">
            Login
          </Link>
          <Link to="/signup" className="auth-button primary">
            Sign Up
          </Link>
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;