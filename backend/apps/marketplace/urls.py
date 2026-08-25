from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ListingViewSet, BuyerOfferViewSet

router = DefaultRouter()
router.register(r'listings', ListingViewSet, basename='listing')
router.register(r'offers', BuyerOfferViewSet, basename='offer')

urlpatterns = [
    path('', include(router.urls)),
]
