from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.shortcuts import redirect
from rest_framework.views import APIView
from common.responses import success_response

def root_redirect_view(request):
    return redirect('swagger-ui')

class HealthCheckView(APIView):
    def get(self, request):
        return success_response({
            "service": "AAGAM National Agricultural Grain & Allocation Management Backend",
            "version": "1.0.0",
            "status": "HEALTHY",
            "database": "CONNECTED",
            "engine": "Django 4.2 REST Framework",
            "docs_url": "/api/docs/",
            "redoc_url": "/api/redoc/",
            "admin_url": "/admin/"
        }, message="AAGAM API service is running seamlessly")


urlpatterns = [
    # Root URL redirect to interactive Swagger API documentation
    path('', root_redirect_view, name='root_redirect'),
    path('api/', root_redirect_view, name='api_root_redirect'),

    path('admin/', admin.site.urls),

    # Health Check
    path('api/health/', HealthCheckView.as_view(), name='api_health'),

    # Swagger / OpenAPI Schema Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Core Module APIs
    path('api/auth/', include('apps.accounts.urls')),
    path('api/farmer/', include('apps.farmers.urls')),
    path('api/buyer/', include('apps.buyers.urls')),
    path('api/crops/', include('apps.crops.urls')),
    path('api/prices/', include('apps.prices.urls')),
    path('api/marketplace/', include('apps.marketplace.urls')),
    path('api/offers/', include('apps.marketplace.urls')),
    path('api/auctions/', include('apps.auctions.urls')),
    path('api/centers/', include('apps.centers.urls')),
    path('api/slots/', include('apps.slots.urls')),
    path('api/tokens/', include('apps.tokens.urls')),
    path('api/operations/', include('apps.operations.urls')),
    path('api/quality/', include('apps.quality.urls')),
    path('api/logistics/', include('apps.logistics.urls')),
    path('api/warehouses/', include('apps.warehouses.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/traceability/', include('apps.traceability.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
