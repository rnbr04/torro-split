import React, { useState, useEffect } from 'react';
import './nav.css';

function Nav({ isDarkMode, toggleDarkMode }) {

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src="./src/assets/gadget_labs.svg"
            alt="Brand Logo"
            width="40"
            height="40"
            className="d-inline-block align-top"
          />
          <span className={`brand-text ${isDarkMode ? 'dark-mode' : ''} unselectable`}>Torro Split</span>
        </a>
        <div className="navbar-buttons">
          <a href="/home" className={`btn btn-outline ${isDarkMode ? 'dark-mode' : ''}`}>
            HOME
          </a>
          <a href="/about" className={`btn btn-outline ${isDarkMode ? 'dark-mode' : ''}`}>
            ABOUT
          </a>
          <a href="/contact" className={`btn btn-outline ${isDarkMode ? 'dark-mode' : ''}`}>
            CONTACT US
          </a>
          <a href="/signup" className={`btn btn-outline ${isDarkMode ? 'dark-mode' : ''}`}>
            SIGN UP
          </a>
          {/* Dark Mode Toggle */}
          <div className="dark-mode-toggle">
            <label className="switch">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={toggleDarkMode}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;