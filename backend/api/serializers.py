from rest_framework import serializers
from .models import StockSymbol, PredictionModel

class StockSymbolSerializer(serializers.ModelSerializer):
    """Serializer for stock symbols."""
    class Meta:
        model = StockSymbol
        fields = ['symbol', 'company_name', 'exchange', 'sector']

class PredictionModelSerializer(serializers.ModelSerializer):
    """Serializer for prediction models."""
    class Meta:
        model = PredictionModel
        fields = ['id', 'model_type', 'description', 'parameters', 'created_at']

class StockDataSerializer(serializers.Serializer):
    """Serializer for stock data."""
    symbol = serializers.CharField(max_length=20)
    timeframe = serializers.CharField(max_length=20)
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)

class TechnicalIndicatorSerializer(serializers.Serializer):
    """Serializer for technical indicators."""
    symbol = serializers.CharField(max_length=20)
    timeframe = serializers.CharField(max_length=20)
    indicators = serializers.ListField(
        child=serializers.CharField(max_length=50)
    )
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)

class PredictionRequestSerializer(serializers.Serializer):
    """Serializer for prediction requests."""
    symbol = serializers.CharField(max_length=20)
    model_type = serializers.CharField(max_length=20)
    days_to_predict = serializers.IntegerField(min_value=1, max_value=365)
    features = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
