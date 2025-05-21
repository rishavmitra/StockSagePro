import axios from 'axios';

// Get the host URL dynamically based on environment
const getBaseUrl = () => {
  // If running on Replit domain
  if (window.location.hostname.includes('replit')) {
    return `${window.location.protocol}//${window.location.hostname}/api`;
  }
  // Local development
  return 'http://127.0.0.1:8000/api/';
};

const API_BASE_URL = getBaseUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handle errors globally
const handleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Response error:', error.response.data);
    throw new Error(error.response.data.error || 'An error occurred with the response');
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Request error:', error.request);
    throw new Error('No response received from server. Please check your connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error:', error.message);
    throw new Error(error.message || 'An error occurred while setting up the request');
  }
};

// API functions
export const getStockData = async (symbol, timeframe = '1y') => {
  try {
    const response = await api.get(`/stock-data/${symbol}/`, {
      params: { timeframe }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const searchStocks = async (query) => {
  try {
    const response = await api.get('/search-stocks/', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const fetchTechnicalIndicators = async (symbol, timeframe, indicators) => {
  try {
    const response = await api.post('/technical-indicators/', {
      symbol,
      timeframe,
      indicators
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const predictStockPrice = async (symbol, modelType, daysToPredict) => {
  try {
    const response = await api.post('/predict/', {
      symbol,
      model_type: modelType,
      days_to_predict: daysToPredict
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getMarketOverview = async () => {
  try {
    const response = await api.get('/market-overview/');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getPredictionModels = async () => {
  try {
    const response = await api.get('/prediction-models/');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
