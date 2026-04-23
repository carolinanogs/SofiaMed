import os
import dj_database_url
from .base import *

DEBUG = False

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '*').split(',')

SECRET_KEY = os.environ['SECRET_KEY']

DATABASE_URL = os.environ.get('DATABASE_URL')

if not DATABASE_URL:
    raise Exception("DATABASE_URL não encontrada no Railway")

DATABASES = {
    'default': dj_database_url.parse(DATABASE_URL)
}

CORS_ALLOW_ALL_ORIGINS = True