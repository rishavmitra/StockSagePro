from django.db import models

# Models for the stock prediction app
class StockSymbol(models.Model):
    """Model to store stock symbols and their details."""
    symbol = models.CharField(max_length=20, primary_key=True)
    company_name = models.CharField(max_length=200)
    exchange = models.CharField(max_length=10)  # NSE or BSE
    sector = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f"{self.symbol} - {self.company_name} ({self.exchange})"

class PredictionModel(models.Model):
    """Model to store information about ML models used for prediction."""
    MODEL_TYPES = (
        ('linear', 'Linear Regression'),
        ('random_forest', 'Random Forest'),
        ('svm', 'Support Vector Machine'),
        ('lstm', 'LSTM Neural Network'),
    )
    
    model_type = models.CharField(max_length=20, choices=MODEL_TYPES)
    description = models.TextField()
    parameters = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.get_model_type_display()} Model"
