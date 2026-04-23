import os
import dj_database_url
from .base import *

# 🔒 Segurança
DEBUG = False

SECRET_KEY = os.environ['SECRET_KEY']

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '*').split(',')

# 🗄️ Banco de dados (Railway)
DATABASES = {
    'default': dj_database_url.parse(os.environ['DATABASE_URL'])
}

# 🌐 CORS (liberado por enquanto)
CORS_ALLOW_ALL_ORIGINS = True

# 🔐 Segurança adicional
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True