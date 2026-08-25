from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuctionLotViewSet,
    AuctionBidViewSet,
    AwardedContractViewSet
)

router = DefaultRouter()
router.register(r'lots', AuctionLotViewSet, basename='auction_lot')
router.register(r'bids', AuctionBidViewSet, basename='auction_bid')
router.register(r'contracts', AwardedContractViewSet, basename='contract')

urlpatterns = [
    path('', include(router.urls)),
]
