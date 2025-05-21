"""
WSGI config for stockpredict project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stockpredict.settings')

application = get_wsgi_application()
