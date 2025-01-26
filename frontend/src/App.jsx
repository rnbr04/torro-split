import { ThemeProvider } from './components/themeContextProvider';
import Sign from './pages/homepage';
import Dashboard from './pages/dashboard'
import About from './pages/about';
import Contact from './pages/contact';
import React, {useEffect, useState} from 'react';

function App() {

  return (
    <ThemeProvider>

    {/* <Sign/> */}
    <Dashboard/>
    {/* <About/> */}
    {/* <Contact/> */}
    </ThemeProvider>
  );
}

export default App;
