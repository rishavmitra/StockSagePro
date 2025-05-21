import React, { useState, useEffect } from 'react';
import StockSearch from './StockSearch';
import TimeframeSelector from './TimeframeSelector';
import StockChart from './StockChart';
import TechnicalIndicators from './TechnicalIndicators';
import PredictionChart from './PredictionChart';
import { getStockData, predictStockPrice } from '../utils/api';

const Dashboard = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [timeframe, setTimeframe] = useState('1y');
  const [stockData, setStockData] = useState([]);
  const [indicators, setIndicators] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState(null);
  
  // Prediction state
  const [predictionModel, setPredictionModel] = useState('linear');
  const [daysToPredict, setDaysToPredict] = useState(30);
  const [predictionData, setPredictionData] = useState(null);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  const [predictionError, setPredictionError] = useState(null);
  
  useEffect(() => {
    if (selectedStock) {
      loadStockData();
    }
  }, [selectedStock, timeframe]);
  
  const loadStockData = async () => {
    if (!selectedStock) return;
    
    setIsLoadingData(true);
    setDataError(null);
    setIndicators(null); // Clear indicators when loading new data
    
    try {
      const data = await getStockData(selectedStock.symbol, timeframe);
      setStockData(data.data);
    } catch (error) {
      console.error('Error loading stock data:', error);
      setDataError(`Failed to load data for ${selectedStock.symbol}. ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoadingData(false);
    }
  };
  
  const handleSelectStock = (stock) => {
    setSelectedStock(stock);
    setPredictionData(null);
    setPredictionError(null);
  };
  
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };
  
  const handleIndicatorsLoaded = (indicatorsData) => {
    setIndicators(indicatorsData);
  };
  
  const handlePrediction = async () => {
    if (!selectedStock || stockData.length === 0) return;
    
    setIsLoadingPrediction(true);
    setPredictionError(null);
    
    try {
      const data = await predictStockPrice(selectedStock.symbol, predictionModel, daysToPredict);
      setPredictionData(data.predictions);
    } catch (error) {
      console.error('Error making prediction:', error);
      setPredictionError(`Failed to generate prediction. ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoadingPrediction(false);
    }
  };
  
  return (
    <div className="container">
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-3">
          <StockSearch onSelectStock={handleSelectStock} />
          
          {selectedStock && (
            <>
              <TimeframeSelector 
                timeframe={timeframe} 
                onTimeframeChange={handleTimeframeChange} 
              />
              
              <TechnicalIndicators 
                symbol={selectedStock?.symbol}
                timeframe={timeframe}
                onIndicatorsLoaded={handleIndicatorsLoaded}
              />
            </>
          )}
        </div>
        
        {/* Main content */}
        <div className="col-lg-9">
          {!selectedStock && (
            <div className="card mb-4">
              <div className="card-body text-center py-5">
                <img 
                  src="https://pixabay.com/get/g16237e3a8c767f68ad5b1e2d511feaedc628d1c3165adebd6ae4fd4f011994a53186981f7b7be9aa6b9c5b174e7ca0d1fc925381854d4e6bbf5969a1cbc3f8f4_1280.jpg" 
                  alt="Indian Stock Market" 
                  className="img-fluid mb-4" 
                  style={{ maxHeight: '300px', borderRadius: '8px' }} 
                />
                <h3>Welcome to StockSage</h3>
                <p className="text-muted">
                  Start by searching for an Indian stock symbol in the sidebar.
                </p>
                <p>
                  <strong>Features:</strong>
                </p>
                <div className="row mt-3">
                  <div className="col-md-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <i className="fas fa-chart-line fa-3x mb-3 text-primary"></i>
                        <h5>Stock Visualization</h5>
                        <p className="small text-muted">View historical price data with technical indicators</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <i className="fas fa-brain fa-3x mb-3 text-primary"></i>
                        <h5>Price Prediction</h5>
                        <p className="small text-muted">Machine learning models to forecast future prices</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <i className="fas fa-calculator fa-3x mb-3 text-primary"></i>
                        <h5>Technical Analysis</h5>
                        <p className="small text-muted">Apply indicators to identify trends and patterns</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {selectedStock && (
            <>
              {/* Stock Info Card */}
              <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="m-0">
                    {selectedStock.company_name} ({selectedStock.symbol.replace(/\.(NS|BO)$/, '')})
                    <span className="badge bg-primary ms-2">{selectedStock.exchange}</span>
                  </h5>
                  <button className="btn btn-sm btn-outline-primary" onClick={loadStockData}>
                    <i className="fas fa-sync-alt me-1"></i> Refresh
                  </button>
                </div>
                <div className="card-body">
                  {dataError && (
                    <div className="alert alert-danger">{dataError}</div>
                  )}
                  
                  {isLoadingData ? (
                    <div className="loading-spinner">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    stockData.length > 0 && (
                      <>
                        {/* Price overview */}
                        <div className="row mb-4">
                          <div className="col-md-3">
                            <div className="price-info">
                              <h6 className="text-muted">Current Price</h6>
                              <h3>₹{stockData[stockData.length - 1]['Close'].toFixed(2)}</h3>
                              
                              {stockData.length > 1 && (
                                <div className={stockData[stockData.length - 1]['Close'] > stockData[stockData.length - 2]['Close'] ? 'price-up' : 'price-down'}>
                                  <i className={`fas fa-caret-${stockData[stockData.length - 1]['Close'] > stockData[stockData.length - 2]['Close'] ? 'up' : 'down'} me-1`}></i>
                                  {Math.abs(stockData[stockData.length - 1]['Close'] - stockData[stockData.length - 2]['Close']).toFixed(2)} 
                                  ({Math.abs((stockData[stockData.length - 1]['Close'] / stockData[stockData.length - 2]['Close'] - 1) * 100).toFixed(2)}%)
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="col-md-3">
                            <h6 className="text-muted">Trading Range</h6>
                            <div>High: ₹{stockData[stockData.length - 1]['High'].toFixed(2)}</div>
                            <div>Low: ₹{stockData[stockData.length - 1]['Low'].toFixed(2)}</div>
                            <div className="mt-1">
                              <small className="text-muted">Volume: {stockData[stockData.length - 1]['Volume'].toLocaleString()}</small>
                            </div>
                          </div>
                          
                          <div className="col-md-3">
                            <h6 className="text-muted">Performance</h6>
                            <div className={stockData[stockData.length - 1]['Cumulative Returns'] >= 0 ? 'price-up' : 'price-down'}>
                              <i className={`fas fa-caret-${stockData[stockData.length - 1]['Cumulative Returns'] >= 0 ? 'up' : 'down'} me-1`}></i>
                              {(stockData[stockData.length - 1]['Cumulative Returns'] * 100).toFixed(2)}%
                            </div>
                            <div className="mt-1">
                              <small className="text-muted">Over selected period</small>
                            </div>
                          </div>
                          
                          <div className="col-md-3">
                            <h6 className="text-muted">Last Updated</h6>
                            <div>{new Date(stockData[stockData.length - 1]['Date']).toLocaleDateString()}</div>
                            <div className="mt-1">
                              <small className="text-muted">Data source: Yahoo Finance</small>
                            </div>
                          </div>
                        </div>
                        
                        {/* Stock chart */}
                        <StockChart 
                          stockData={stockData} 
                          symbol={selectedStock.symbol.replace(/\.(NS|BO)$/, '')} 
                          indicators={indicators}
                        />
                      </>
                    )
                  )}
                </div>
              </div>
              
              {/* Prediction Card */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="m-0">Stock Price Prediction</h5>
                </div>
                <div className="card-body">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label">Prediction Model</label>
                      <div className="prediction-methods">
                        <div 
                          className={`prediction-method ${predictionModel === 'linear' ? 'active' : ''}`}
                          onClick={() => setPredictionModel('linear')}
                        >
                          <i className="fas fa-chart-line me-2"></i>
                          Linear Regression
                        </div>
                        <div 
                          className={`prediction-method ${predictionModel === 'random_forest' ? 'active' : ''}`}
                          onClick={() => setPredictionModel('random_forest')}
                        >
                          <i className="fas fa-tree me-2"></i>
                          Random Forest
                        </div>
                        <div 
                          className={`prediction-method ${predictionModel === 'svm' ? 'active' : ''}`}
                          onClick={() => setPredictionModel('svm')}
                        >
                          <i className="fas fa-vector-square me-2"></i>
                          SVM
                        </div>
                        <div 
                          className={`prediction-method ${predictionModel === 'lstm' ? 'active' : ''}`}
                          onClick={() => setPredictionModel('lstm')}
                        >
                          <i className="fas fa-brain me-2"></i>
                          LSTM
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="days-to-predict" className="form-label">Days to Predict</label>
                      <div className="d-flex align-items-center">
                        <input
                          type="range"
                          className="form-range flex-grow-1 me-2"
                          id="days-to-predict"
                          min="7"
                          max="90"
                          value={daysToPredict}
                          onChange={(e) => setDaysToPredict(parseInt(e.target.value))}
                        />
                        <span className="badge bg-primary">{daysToPredict} days</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
                    <button 
                      className="btn btn-primary" 
                      onClick={handlePrediction}
                      disabled={isLoadingPrediction || !selectedStock || stockData.length === 0}
                    >
                      {isLoadingPrediction ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Generating Prediction...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-magic me-2"></i>
                          Generate Prediction
                        </>
                      )}
                    </button>
                  </div>
                  
                  {predictionError && (
                    <div className="alert alert-danger">{predictionError}</div>
                  )}
                  
                  {predictionData && (
                    <div className="prediction-results">
                      <h6>Prediction Results</h6>
                      <PredictionChart 
                        historicalData={stockData}
                        predictionData={predictionData}
                        symbol={selectedStock.symbol.replace(/\.(NS|BO)$/, '')}
                        modelType={predictionModel}
                      />
                      
                      <div className="alert alert-warning mt-3">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        <strong>Disclaimer:</strong> Predictions are estimates based on historical data and may not accurately reflect future market performance. Always conduct your own research before making investment decisions.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
