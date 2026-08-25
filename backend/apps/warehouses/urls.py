from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WarehouseViewSet,
    InventoryViewSet,
    StockMovementViewSet
)

router = DefaultRouter()
router.register(r'inventories', InventoryViewSet, basename='inventory')
router.register(r'movements', StockMovementViewSet, basename='stock_movement')
router.register(r'', WarehouseViewSet, basename='warehouse')

urlpatterns = [
    path('', include(router.urls)),
]
