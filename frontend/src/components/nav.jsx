import React, {useContext} from 'react';
import { ThemeContext } from './themeContextProvider';
import './nav.css';

function Nav() {

  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  
  return (
    <nav className='navbar'>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src="./src/assets/gadget_labs.svg"
            alt="Brand Logo"
            width="40"
            height="40"
            className="d-inline-block align-top unselectable"
          />
          <span className='brand-text unselectable'>Torro Split</span>
        </a>
        <div className="navbar-buttons">
          <button className='btn btn-outline unselectable'>HOME</button>
          <button className='btn btn-outline unselectable'>ABOUT</button>
          <button className='btn btn-outline unselectable'>CONTACT</button>
        {/* Dark Mode Toggle */}
        <div className="theme-toggle">
        <label className="switch">
          <input 
            type="checkbox" 
            checked={isDarkMode}
            onChange={toggleTheme}
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