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
    useEffect(() => {
        // Disable right-click
        const handleRightClick = (e) => {
          e.preventDefault();
        };
    
        const handleKeyPress = (e) => {
          if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C')) ||
            (e.ctrlKey && e.key === 'U')
          ) {
            e.preventDefault();
          }
        };
        document.addEventListener('contextmenu', handleRightClick);
        document.addEventListener('keydown', handleKeyPress);
        return () => {
          document.removeEventListener('contextmenu', handleRightClick);
          document.removeEventListener('keydown', handleKeyPress);
        };
      }, []);

  return (

   
          <>
            <Router>
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={<ThemeProvider><Sign/></ThemeProvider>}
                    />

                    <Route
                        exact
                        path="/dashboard"
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
