from django.urls import path
from . import views

urlpatterns = [
    # Stock data endpoints
    path('stock-symbols/', views.StockSymbolList.as_view(), name='stock-symbols'),
    path('stock-data/<str:symbol>/', views.StockDataView.as_view(), name='stock-data'),
    
    # Technical indicators
    path('technical-indicators/', views.TechnicalIndicatorView.as_view(), name='technical-indicators'),
    
    # Prediction endpoints
    path('prediction-models/', views.PredictionModelList.as_view(), name='prediction-models'),
    path('predict/', views.PredictionView.as_view(), name='predict'),
    
    # Market Overview
    path('market-overview/', views.MarketOverviewView.as_view(), name='market-overview'),
    
    # Search
    path('search-stocks/', views.SearchStocksView.as_view(), name='search-stocks'),
]
