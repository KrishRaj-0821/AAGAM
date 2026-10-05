import os
from pathlib import Path
from datetime import timedelta
import dotenv
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables
dotenv.load_dotenv(os.path.join(BASE_DIR, '.env'))

SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'False').lower() in ('true', '1', 'yes')

if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = 'django-insecure-dev-aagam-test-key-do-not-use-in-production'
    else:
        from django.core.exceptions import ImproperlyConfigured
        raise ImproperlyConfigured("SECRET_KEY environment variable must be set when DEBUG is False.")

# Allowed Hosts - Explicit whitelist + Railway domains
raw_hosts = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1,.trycloudflare.com,.railway.app,.up.railway.app')
ALLOWED_HOSTS = [h.strip() for h in raw_hosts.split(',') if h.strip()]
for default_host in ['.trycloudflare.com', '.railway.app', '.up.railway.app']:
    if default_host not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(default_host)

# CSRF Trusted Origins for Railway & local development
raw_csrf = os.getenv('CSRF_TRUSTED_ORIGINS', 'https://*.railway.app,https://*.up.railway.app,http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000')
CSRF_TRUSTED_ORIGINS = [c.strip() for c in raw_csrf.split(',') if c.strip()]

# Demo & SMS Gateways Configuration
DEMO_AUTH_MODE = os.getenv('DEMO_AUTH_MODE', 'True').lower() in ('true', '1', 'yes')
FAST2SMS_API_KEY = os.getenv('FAST2SMS_API_KEY', '')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'django_filters',
    'drf_spectacular',

    # AAGAM Modular Apps
    'apps.accounts',
    'apps.farmers',
    'apps.buyers',
    'apps.crops',
    'apps.prices',
    'apps.marketplace',
    'apps.auctions',
    'apps.centers',
    'apps.slots',
    'apps.tokens',
    'apps.operations',
    'apps.quality',
    'apps.logistics',
    'apps.warehouses',
    'apps.payments',
    'apps.notifications',
    'apps.traceability',
    'apps.analytics',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database Configuration with DATABASE_URL (Railway) / PostgreSQL / SQLite fallback
database_url = os.getenv('DATABASE_URL')
USE_POSTGRES = os.getenv('USE_POSTGRES', 'False').lower() in ('true', '1')

if database_url:
    DATABASES = {
        'default': dj_database_url.config(
            default=database_url,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
elif USE_POSTGRES:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DATABASE_NAME', 'aagam_db'),
            'USER': os.getenv('DATABASE_USER', 'postgres'),
            'PASSWORD': os.getenv('DATABASE_PASSWORD', 'postgres'),
            'HOST': os.getenv('DATABASE_HOST', 'localhost'),
            'PORT': os.getenv('DATABASE_PORT', '5432'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'aagam_db.sqlite3',
            'OPTIONS': {
                'timeout': 30,
            },
        }
    }

AUTH_USER_MODEL = 'accounts.User'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS - Configurable via env
CORS_ALLOW_ALL_ORIGINS = os.getenv('CORS_ALLOW_ALL_ORIGINS', 'False').lower() in ('true', '1')
raw_cors = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000,https://krishraj-0821.github.io')
CORS_ALLOWED_ORIGINS = [o.strip() for o in raw_cors.split(',') if o.strip()]
if 'https://krishraj-0821.github.io' not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append('https://krishraj-0821.github.io')
CORS_ALLOW_CREDENTIALS = True

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'common.pagination.StandardResultsSetPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'EXCEPTION_HANDLER': 'common.responses.custom_exception_handler',
}

# SimpleJWT
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'uuid',
    'USER_ID_CLAIM': 'user_id',
}

# DRF Spectacular OpenAPI
SPECTACULAR_SETTINGS = {
    'TITLE': 'AAGAM National Agricultural API',
    'DESCRIPTION': 'Automated Agricultural Grain & Allocation Management Backend REST API',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}
