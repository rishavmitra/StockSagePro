import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { searchStocks } from '../utils/api';

const StockSearch = ({ onSelectStock }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  
  const popular_stocks = [
    { symbol: 'RELIANCE.NS', company_name: 'Reliance Industries Ltd.', exchange: 'NSE' },
    { symbol: 'TCS.NS', company_name: 'Tata Consultancy Services Ltd.', exchange: 'NSE' },
    { symbol: 'HDFCBANK.NS', company_name: 'HDFC Bank Ltd.', exchange: 'NSE' },
    { symbol: 'INFY.NS', company_name: 'Infosys Ltd.', exchange: 'NSE' },
    { symbol: 'ICICIBANK.NS', company_name: 'ICICI Bank Ltd.', exchange: 'NSE' }
  ];
  
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const delayDebounce = setTimeout(() => {
        handleSearch();
      }, 500);
      
      return () => clearTimeout(delayDebounce);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);
  
  const handleSearch = async () => {
    if (searchQuery.length < 2) return;
    
    setIsLoading(true);
    setShowDropdown(true);
    
    try {
      const results = await searchStocks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching stocks:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectStock = (stock) => {
    onSelectStock(stock);
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };
  
  const handlePopularStock = (stock) => {
    onSelectStock(stock);
  };
  
  return (
    <div className="stock-search mb-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="m-0">Search Indian Stocks</h5>
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter stock name or symbol (e.g., RELIANCE, TCS)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
            />
          </div>
          
          {showDropdown && searchQuery.length >= 2 && (
            <div className={`dropdown-menu w-100 ${showDropdown ? 'show' : ''}`} style={{ position: 'static', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
              {isLoading && (
                <div className="dropdown-item text-center">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span className="ms-2">Searching...</span>
                </div>
              )}
              
              {!isLoading && searchResults.length === 0 && (
                <div className="dropdown-item text-muted">No results found</div>
              )}
              
              {!isLoading && searchResults.map((stock) => (
                <button
                  key={stock.symbol}
                  className="dropdown-item d-flex justify-content-between align-items-center"
                  onClick={() => handleSelectStock(stock)}
                >
                  <div>
                    <strong>{stock.symbol}</strong>
                    <br />
                    <small>{stock.company_name}</small>
                  </div>
                  <span className="badge bg-primary">{stock.exchange}</span>
                </button>
              ))}
            </div>
          )}
          
          <div className="mt-3">
            <h6>Popular Stocks:</h6>
            <div className="d-flex flex-wrap gap-2">
              {popular_stocks.map((stock) => (
                <button
                  key={stock.symbol}
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => handlePopularStock(stock)}
                >
                  {stock.symbol.replace('.NS', '')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockSearch;
