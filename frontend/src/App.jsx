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
                        element={<ThemeProvider><Dashboard/></ThemeProvider>}
                    />

                    <Route
                        path="/about"
                        element={<ThemeProvider><About/></ThemeProvider>}
                    />
                    <Route
                        path="/contact"
                        element={<ThemeProvider><Contact/></ThemeProvider>}
                    />

                    <Route
                        path="/signup"
                        element={<ThemeProvider><Sign/></ThemeProvider>}
                    />
                </Routes>
            </Router>
          </>

  );
}

export default App;
