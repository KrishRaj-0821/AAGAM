from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ForecastViewSet,
    CongestionAlertViewSet,
    DashboardAnalyticsView
)

router = DefaultRouter()
router.register(r'forecasts', ForecastViewSet, basename='forecast')
router.register(r'alerts', CongestionAlertViewSet, basename='alert')

urlpatterns = [
    path('dashboards/<str:role_name>/', DashboardAnalyticsView.as_view(), name='role_dashboard'),
    path('dashboards/', DashboardAnalyticsView.as_view(), name='generic_dashboard'),
    path('', include(router.urls)),
]
