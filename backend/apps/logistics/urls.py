from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VehicleViewSet,
    DriverViewSet,
    TransportRequestViewSet,
    TransportBookingViewSet
)

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'drivers', DriverViewSet, basename='driver')
router.register(r'requests', TransportRequestViewSet, basename='transport_request')
router.register(r'bookings', TransportBookingViewSet, basename='transport_booking')

urlpatterns = [
    path('', include(router.urls)),
]
