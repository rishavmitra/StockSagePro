import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  
  return (
    <div className="theme-toggle">
      <button
        className={`btn btn-sm ${darkMode ? 'btn-light' : 'btn-dark'}`}
        onClick={toggleTheme}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? (
          <><i className="fas fa-sun me-2"></i>Light Mode</>
        ) : (
          <><i className="fas fa-moon me-2"></i>Dark Mode</>
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
