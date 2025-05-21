from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
import pandas as pd

from .models import StockSymbol, PredictionModel
from .serializers import (StockSymbolSerializer, PredictionModelSerializer,
                          StockDataSerializer, TechnicalIndicatorSerializer,
                          PredictionRequestSerializer)
from .services.data_service import get_stock_data, get_nse_indices
from .services.prediction_service import (predict_with_linear_regression,
                                          predict_with_random_forest,
                                          predict_with_svm, predict_with_lstm)
from .services.technical_indicators import calculate_technical_indicators


class StockSymbolList(generics.ListAPIView):
    """API view to retrieve list of stock symbols."""
    queryset = StockSymbol.objects.all()
    serializer_class = StockSymbolSerializer

    def get_queryset(self):
        """Filter the queryset based on exchange parameter if provided."""
        queryset = StockSymbol.objects.all()
        exchange = self.request.query_params.get('exchange', None)

        if exchange:
            queryset = queryset.filter(exchange=exchange.upper())

        return queryset


class StockDataView(APIView):
    """API view to retrieve stock data."""

    def get(self, request, symbol):
        """Get stock data for a specific symbol."""
        timeframe = request.query_params.get('timeframe', '1y')

        try:
            # Call the data service to get the stock data
            data = get_stock_data(symbol, timeframe)
            data = data.to_dict(orient='records')
            
            data2 = []
            for items in data:
                clean_data={}
                for k,v in items.items():
                    clean_data[k[0]] = v
                data2.append(clean_data)

                

            # Convert DataFrame to dictionary format for response
            result = {'symbol': symbol, 'data': data2}

            return Response(result)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)


class TechnicalIndicatorView(APIView):
    """API view to calculate technical indicators."""

    def post(self, request):
        """Calculate technical indicators for a specific stock."""
        serializer = TechnicalIndicatorSerializer(data=request.data)
        if serializer.is_valid():
            symbol = serializer.validated_data['symbol']
            timeframe = serializer.validated_data['timeframe']
            indicators = serializer.validated_data['indicators']

            try:
                # Get the stock data
                data = get_stock_data(symbol, timeframe)

                if data is None or data.empty:
                    return Response(
                        {"error": f"No data available for {symbol}"},
                        status=status.HTTP_404_NOT_FOUND)

                # Calculate the requested technical indicators
                result = calculate_technical_indicators(data, indicators)

                # Convert DataFrame to dictionary format for response
                response_data = {
                    'symbol': symbol,
                    'indicators': {
                        indicator: result[indicator].dropna().to_dict()
                        for indicator in result.keys()
                    }
                }

                return Response(response_data)

            except Exception as e:
                return Response({"error": str(e)},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PredictionModelList(generics.ListAPIView):
    """API view to retrieve list of prediction models."""
    queryset = PredictionModel.objects.all()
    serializer_class = PredictionModelSerializer


class PredictionView(APIView):
    """API view to make stock price predictions."""

    def post(self, request):
        """Make predictions for a specific stock using the specified model."""
        serializer = PredictionRequestSerializer(data=request.data)
        if serializer.is_valid():
            symbol = serializer.validated_data['symbol']
            model_type = serializer.validated_data['model_type']
            days_to_predict = serializer.validated_data['days_to_predict']
            features = serializer.validated_data.get('features', None)

            try:
                # Get historical data for training
                data = get_stock_data(symbol,
                                      '2y')  # Get 2 years of data for training

                if data is None or data.empty:
                    return Response(
                        {"error": f"No data available for {symbol}"},
                        status=status.HTTP_404_NOT_FOUND)

                # Calculate technical indicators for features
                tech_indicators = [
                    'sma', 'ema', 'rsi', 'macd', 'bollinger_bands'
                ]
                data_with_indicators = calculate_technical_indicators(
                    data, tech_indicators)

                # Make predictions based on the model type
                result = None
                if model_type == 'linear':
                    result = predict_with_linear_regression(
                        data_with_indicators, days_to_predict, features)
                elif model_type == 'random_forest':
                    result = predict_with_random_forest(
                        data_with_indicators, days_to_predict, features)
                elif model_type == 'svm':
                    result = predict_with_svm(data_with_indicators,
                                              days_to_predict, features)
                elif model_type == 'lstm':
                    result = predict_with_lstm(data_with_indicators,
                                               days_to_predict)
                else:
                    return Response(
                        {"error": f"Unknown model type: {model_type}"},
                        status=status.HTTP_400_BAD_REQUEST)

                if result is None:
                    return Response(
                        {
                            "error":
                            "Could not generate prediction. Not enough data."
                        },
                        status=status.HTTP_400_BAD_REQUEST)

                # Prepare response data
                response_data = {
                    'symbol': symbol,
                    'model_type': model_type,
                    'days_predicted': days_to_predict,
                    'predictions': result.to_dict(orient='records')
                }

                return Response(response_data)

            except Exception as e:
                return Response({"error": str(e)},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MarketOverviewView(APIView):
    """API view to get market overview data."""

    def get(self, request):
        """Get overview of the Indian market indices."""
        try:
            # Get the major indices data
            indices_data = get_nse_indices()

            if indices_data is None or indices_data.empty:
                return Response(
                    {"error": "Failed to retrieve market overview data"},
                    status=status.HTTP_404_NOT_FOUND)

            # Convert DataFrame to dictionary format for response
            result = {
                'indices': indices_data.to_dict(orient='records'),
                'last_updated': datetime.now().isoformat()
            }

            return Response(result)

        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)


class SearchStocksView(APIView):
    """API view to search for stocks by name or symbol."""

    def get(self, request):
        """Search for stocks based on a query parameter."""
        from .services.data_service import search_indian_stocks

        query = request.query_params.get('q', '')

        if query and len(query) < 2:
            return Response(
                {"error": "Search query must be at least 2 characters"},
                status=status.HTTP_400_BAD_REQUEST)

        # Use our search function instead of database query
        matching_stocks = search_indian_stocks(query)

        # Transform the data to match our serializer's expected format
        formatted_stocks = [
            {
                'symbol': stock['symbol'].replace('.NS',
                                                  ''),  # Remove .NS suffix
                'company_name': stock['name'],
                'exchange': stock['exchange'],
                'sector': stock.get('sector', '')
            } for stock in matching_stocks
        ]

        return Response(formatted_stocks)
