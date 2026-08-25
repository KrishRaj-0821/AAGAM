from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuctionViewSet

router = DefaultRouter()
router.register(r'', AuctionViewSet, basename='auction')

urlpatterns = [
    path('', include(router.urls)),
]
