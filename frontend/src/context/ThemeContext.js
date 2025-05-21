import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const ThemeContext = createContext();

// Create the provider component
export const ThemeProvider = ({ children }) => {
  // Check for user's preferred theme in local storage or use system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    
    // If no saved preference, check system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  
  const [darkMode, setDarkMode] = useState(getInitialTheme());
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };
  
  // Update local storage when theme changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    
    // Apply theme class to body
    if (darkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);
  
  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
      }
    };
    
    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);
  
  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
