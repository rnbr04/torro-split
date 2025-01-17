// TODO
// FIX
// Bootstrap integration causes custom CSS failure

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap only for this component

function Nav() {
    return (
        <nav className="navbar navbar-light bg-light">
            <a className="navbar-brand" href="#">
                <img src="../assets/react.svg" width="50" height="50" className="d-inline-block align-top" alt="Logo"/>
                Torro Split 
            </a>
        </nav>

    );
}

export default Nav;


