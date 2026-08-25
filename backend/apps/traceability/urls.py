from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CropTraceabilityViewSet

router = DefaultRouter()
router.register(r'', CropTraceabilityViewSet, basename='traceability')

urlpatterns = [
    path('', include(router.urls)),
]
