"""
Service for making stock price predictions using different models.
"""
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def simple_prediction(data, days_to_predict):
    """
    Makes a simple prediction based on recent trend
    """
    if len(data) < 10:
        return None
    
    # Get the last 30 days of adjusted close prices
    recent_prices = data['SMA_20'].tail(30).values
    
    recent_prices = recent_prices.flatten() 
    # Calculate average daily change
    daily_changes = np.diff(recent_prices)
    avg_change = np.mean(daily_changes)
    
    # Get the last price
    last_price = recent_prices[-1]
    
    # Predict future prices based on average change
    future_dates = []
    predicted_prices = []
    last_date = data['Date'].values[-1]
    
    for i in range(1, days_to_predict + 1):
        # Calculate next date (skip weekends)
        next_date = pd.to_datetime(last_date) + timedelta(days=i)
        while next_date.weekday() > 4:  # Skip Saturday (5) and Sunday (6)
            next_date = next_date + timedelta(days=1)
            
        # Calculate predicted price
        next_price = last_price + (avg_change * i)
        
        # Make sure price doesn't go negative
        next_price = max(next_price, 0)
        
        # Add to results
        future_dates.append(next_date)
        predicted_prices.append(next_price)
    
    # Create DataFrame for predictions
    prediction_df = pd.DataFrame({
        'Date': future_dates,
        'Predicted_Price': predicted_prices
    })

    prediction_df.replace([float('inf'), float('-inf')], float('nan'), inplace=True)
    prediction_df.dropna(inplace=True)
    
    return prediction_df


def predict_with_linear_regression(df, days_to_predict, features=None):
    """Simplified linear regression prediction"""
    return simple_prediction(df, days_to_predict)

def predict_with_random_forest(df, days_to_predict, features=None):
    """Simplified random forest prediction"""
    return simple_prediction(df, days_to_predict)

def predict_with_svm(df, days_to_predict, features=None):
    """Simplified SVM prediction"""
    return simple_prediction(df, days_to_predict)

def predict_with_lstm(df, days_to_predict, target='Close', window_size=60):
    """Simplified LSTM prediction"""
    return simple_prediction(df, days_to_predict)
