from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    """View to render the API documentation page at the root URL."""
    return render(request, 'api/index.html')