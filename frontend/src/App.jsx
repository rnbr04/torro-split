import { ThemeProvider } from './components/themeContextProvider';
import Sign from './pages/homepage';
import Dashboard from './pages/dashboard'
import About from './pages/about';
import Contact from './pages/contact';
import React, {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


function App() {

  return (

   
          <>
            <Router>
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={<About/>}
                    />

                    <Route
                        path="/about"
                        element={<About />}
                    />
                    <Route
                        path="/contact"
                        element={<Contact />}
                    />

                    <Route
                        path="/signup"
                        element={<Sign/>}
                    />
                </Routes>
            </Router>
          </>

  );
}

export default App;
