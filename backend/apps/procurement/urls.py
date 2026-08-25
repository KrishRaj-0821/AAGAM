from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MandiCenterViewSet,
    SlotBookingViewSet,
    VehicleQueueViewSet,
    DailyProcurementQuotaViewSet
)

router = DefaultRouter()
router.register(r'mandis', MandiCenterViewSet, basename='mandi')
router.register(r'slots', SlotBookingViewSet, basename='slot')
router.register(r'queues', VehicleQueueViewSet, basename='queue')
router.register(r'quotas', DailyProcurementQuotaViewSet, basename='quota')

urlpatterns = [
    path('', include(router.urls)),
]
