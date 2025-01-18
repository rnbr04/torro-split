import React from 'react';
import './nav.css';

function Nav() {
  return (
    <nav className="navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src="./src/assets/gadget_labs.svg"
            alt="Brand Logo"
            width="40"
            height="40  "
            className="d-inline-block align-top"
          />
          <span className="brand-text unselectable">Torro Split</span>
        </a>
        <div className="navbar-buttons">
          <button className="btn btn-outline-success">HOME</button>
          <button className="btn btn-outline-success">ABOUT</button>
          {/* <button className="btn btn-outline-success">HELP</button> */}
          <button className="btn btn-outline-success">CONTACT</button>
        </div>
      </div>
    </nav>
  );
}

export default Nav;