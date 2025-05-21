import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { getMarketOverview } from '../utils/api';

const Header = () => {
  const { darkMode } = useContext(ThemeContext);
  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const data = await getMarketOverview();
        setMarketData(data.indices);
      } catch (error) {
        console.error('Failed to fetch market overview:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarketData();
    
    // Refresh market data every 5 minutes
    const intervalId = setInterval(fetchMarketData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <header className={`header ${darkMode ? 'bg-dark' : 'bg-light'}`}>
      <div className="container">
        <div className="py-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17L9 11L13 15L21 7" stroke="#2962FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 7H21V11" stroke="#2962FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21H3V3" stroke="#2962FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h1 className="ms-2 mb-0 h3">StockSage</h1>
            </div>
            <ThemeToggle />
          </div>
          
          <div className="market-overview py-2 px-3 rounded" style={{ 
            backgroundColor: darkMode ? 'rgba(33, 37, 41, 0.8)' : 'rgba(248, 249, 250, 0.8)',
            borderLeft: '4px solid #2962ff'
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="m-0">Indian Market Overview</h6>
              <div className="small text-muted">
                Last Updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
            
            <div className="mt-2 d-flex gap-4 overflow-auto pb-2">
              {isLoading ? (
                <div className="d-flex align-items-center">
                  <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span>Loading market data...</span>
                </div>
              ) : (
                marketData.map((index) => (
                  <div key={index.symbol} className="market-index">
                    <div className="d-flex align-items-center">
                      <span className="fw-bold">{index.name}:</span>
                      <span className="ms-2">₹{index.price.toLocaleString()}</span>
                      <span className={`ms-2 ${index.change > 0 ? 'price-up' : 'price-down'}`}>
                        <i className={`fas fa-caret-${index.change > 0 ? 'up' : 'down'} me-1`}></i>
                        {Math.abs(index.change).toFixed(2)} ({Math.abs(index.change_percent).toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
