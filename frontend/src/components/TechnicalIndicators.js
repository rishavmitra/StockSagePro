import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import Chart from 'chart.js/auto';
import { fetchTechnicalIndicators } from '../utils/api';

const TechnicalIndicators = ({ symbol, timeframe, onIndicatorsLoaded }) => {
  const [selectedIndicators, setSelectedIndicators] = useState(['sma', 'ema']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { darkMode } = useContext(ThemeContext);
  
  const availableIndicators = [
    { id: 'sma', name: 'Simple Moving Average (SMA)', description: 'Average price over a period of time' },
    { id: 'ema', name: 'Exponential Moving Average (EMA)', description: 'Weighted moving average giving more importance to recent prices' },
    { id: 'rsi', name: 'Relative Strength Index (RSI)', description: 'Momentum oscillator measuring speed and change of price movements' },
    { id: 'macd', name: 'Moving Average Convergence Divergence (MACD)', description: 'Trend-following momentum indicator' },
    { id: 'bollinger_bands', name: 'Bollinger Bands', description: 'Volatility bands placed above and below a moving average' },
  ];
  
  const handleIndicatorChange = (indicatorId) => {
    setSelectedIndicators(prevSelected => {
      if (prevSelected.includes(indicatorId)) {
        return prevSelected.filter(id => id !== indicatorId);
      } else {
        return [...prevSelected, indicatorId];
      }
    });
  };
  
  const loadIndicators = async () => {
    if (!symbol) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchTechnicalIndicators(symbol, timeframe, selectedIndicators);
      onIndicatorsLoaded(data.indicators);
    } catch (err) {
      setError('Failed to load technical indicators. Please try again.');
      console.error('Error loading indicators:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="technical-indicators mb-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="m-0">Technical Indicators</h5>
          <button 
            className="btn btn-sm btn-primary" 
            onClick={loadIndicators}
            disabled={!symbol || isLoading || selectedIndicators.length === 0}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
              </>
            ) : (
              <>Apply Indicators</>
            )}
          </button>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <div className="mb-3">
            <p className="text-muted">Select indicators to apply to the chart:</p>
            
            <div className="row">
              {availableIndicators.map((indicator) => (
                <div key={indicator.id} className="col-md-6 mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`indicator-${indicator.id}`}
                      checked={selectedIndicators.includes(indicator.id)}
                      onChange={() => handleIndicatorChange(indicator.id)}
                    />
                    <label className="form-check-label" htmlFor={`indicator-${indicator.id}`}>
                      <strong>{indicator.name}</strong>
                      <p className="text-muted small mb-0">{indicator.description}</p>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="alert alert-info">
            <i className="fas fa-info-circle me-2"></i>
            Technical indicators help analyze stock price movements and identify potential trends.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalIndicators;
