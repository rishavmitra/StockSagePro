"""
Service for calculating technical indicators for stock data.
"""
import pandas as pd
import numpy as np

def calculate_sma(data, window=20):
    """
    Calculate Simple Moving Average.
    
    Args:
        data (pandas.DataFrame): DataFrame containing stock price data.
        window (int): Window size for the moving average.
    
    Returns:
        pandas.Series: Series containing the SMA values.
    """
    result = data['Close'].rolling(window=window).mean()
    print(type(result))
    return result

def calculate_ema(data, window=20):
    """
    Calculate Exponential Moving Average.
    
    Args:
        data (pandas.DataFrame): DataFrame containing stock price data.
        window (int): Window size for the moving average.
    
    Returns:
        pandas.Series: Series containing the EMA values.
    """
    return data['Close'].ewm(span=window, adjust=False).mean()

def calculate_rsi(data, window=14):
    """
    Calculate Relative Strength Index.
    
    Args:
        data (pandas.DataFrame): DataFrame containing stock price data.
        window (int): Window size for RSI calculation.
    
    Returns:
        pandas.Series: Series containing the RSI values.
    """
    delta = data['Close'].diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    
    avg_gain = gain.rolling(window=window).mean()
    avg_loss = loss.rolling(window=window).mean()
    
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    
    return rsi

def calculate_macd(data, fast_window=12, slow_window=26, signal_window=9):
    """
    Calculate Moving Average Convergence Divergence (MACD).
    
    Args:
        data (pandas.DataFrame): DataFrame containing stock price data.
        fast_window (int): Window size for the fast EMA.
        slow_window (int): Window size for the slow EMA.
        signal_window (int): Window size for the signal line.
    
    Returns:
        tuple: (macd, signal, histogram) - Series containing MACD components.
    """
    fast_ema = data['Close'].ewm(span=fast_window, adjust=False).mean()
    slow_ema = data['Close'].ewm(span=slow_window, adjust=False).mean()
    
    macd = fast_ema - slow_ema
    signal = macd.ewm(span=signal_window, adjust=False).mean()
    histogram = macd - signal
    
    return macd, signal, histogram

def calculate_bollinger_bands(data, window=20, num_std=2):
    """
    Calculate Bollinger Bands.
    
    Args:
        data (pandas.DataFrame): DataFrame containing stock price data.
        window (int): Window size for the moving average.
        num_std (int): Number of standard deviations for the bands.
    
    Returns:
        tuple: (upper_band, middle_band, lower_band) - Series containing the bands.
    """
    middle_band = data['Close'].rolling(window=window).mean()
    std_dev = data['Close'].rolling(window=window).std()
    
    upper_band = middle_band + (std_dev * num_std)
    lower_band = middle_band - (std_dev * num_std)
    
    return upper_band, middle_band, lower_band

def calculate_technical_indicators(data, indicators=None):
    """
    Calculate various technical indicators for the given stock data.
    
    Args:
        data (pandas.DataFrame): DataFrame containing stock price data.
        indicators (list): List of indicators to calculate.
    
    Returns:
        pandas.DataFrame: DataFrame containing all calculated indicators.
    """
    if indicators is None:
        indicators = ['sma', 'ema', 'rsi', 'macd', 'bollinger_bands']
    
    result = {}
    
    for indicator in indicators:
        if indicator.lower() == 'sma':
            result['SMA_20'] = calculate_sma(data, 20)
            result['SMA_50'] = calculate_sma(data, 50)
            result['SMA_200'] = calculate_sma(data, 200)
            result['Date'] = data['Date']
            
        elif indicator.lower() == 'ema':
            result['EMA_12'] = calculate_ema(data, 12)
            result['EMA_26'] = calculate_ema(data, 26)
            result['Date'] = data['Date']
            
        elif indicator.lower() == 'rsi':
            result['RSI'] = calculate_rsi(data)
            result['Date'] = data['Date']
            
        elif indicator.lower() == 'macd':
            macd, signal, histogram = calculate_macd(data)
            result['MACD'] = macd
            result['MACD_Signal'] = signal
            result['MACD_Histogram'] = histogram
            result['Date'] = data['Date']
            
        elif indicator.lower() == 'bollinger_bands':
            upper, middle, lower = calculate_bollinger_bands(data)
            result['BB_Upper'] = upper
            result['BB_Middle'] = middle
            result['BB_Lower'] = lower
            result['Date'] = data['Date']
    
    return result
