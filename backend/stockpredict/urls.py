"""
URL configuration for stockpredict project.
"""

from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from api.views_index import index

urlpatterns = [
    path('', index, name='index'),  # Root URL shows API documentation
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
