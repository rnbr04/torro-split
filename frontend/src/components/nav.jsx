import React, {useState, useEffect} from 'react';
import './nav.css';

function Nav({isDarkMode, toggleDarkMode}) {

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
          <button className={`btn btn-outline ${isDarkMode ? 'dark-mode' : ''}`}>HOME</button>
          <button className={`btn btn-outline ${isDarkMode ? 'dark-mode' : ''}`}>ABOUT</button>
          <button className={`btn btn-outline ${isDarkMode ? 'dark-mode' : ''}`}>CONTACT</button>
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