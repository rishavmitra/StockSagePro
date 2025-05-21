import React, { useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <div className={`app ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <Header />
      <main className="main-content">
        <Dashboard />
      </main>
      <footer className="footer">
        <div className="container">
          <p className="text-center">
            &copy; {new Date().getFullYear()} StockSage - Indian Market Prediction Tool
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
