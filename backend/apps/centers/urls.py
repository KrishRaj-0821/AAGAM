from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProcurementCenterViewSet, CenterCapacityViewSet

router = DefaultRouter()
router.register(r'capacities', CenterCapacityViewSet, basename='capacity')
router.register(r'', ProcurementCenterViewSet, basename='center')

urlpatterns = [
    path('', include(router.urls)),
]
