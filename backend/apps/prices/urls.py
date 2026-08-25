from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PriceListViewSet,
    PriceCompareView,
    PriceHistoryView,
    MSPMasterListView
)

router = DefaultRouter()
router.register(r'', PriceListViewSet, basename='price')

urlpatterns = [
    path('compare/', PriceCompareView.as_view(), name='price_compare'),
    path('history/', PriceHistoryView.as_view(), name='price_history'),
    path('msp-master/', MSPMasterListView.as_view(), name='price_msp_master'),
    path('', include(router.urls)),
]
