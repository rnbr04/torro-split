import Sign from './pages/homepage';
import Dashboard from './pages/dashboard'
import About from './pages/about';
import React, {useEffect, useState} from 'react';

function App() {

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply dark or light theme to the body element
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);


  return (
    // <Sign isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>
    // <Dashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>
    <About isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>
  );
}

export default App;
