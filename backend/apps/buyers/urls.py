from django.urls import path
from .views import (
    BuyerDashboardView,
    BuyerProfileView,
    BuyerPurchasesView
)

urlpatterns = [
    path('dashboard/', BuyerDashboardView.as_view(), name='buyer_dashboard'),
    path('profile/', BuyerProfileView.as_view(), name='buyer_profile'),
    path('purchases/', BuyerPurchasesView.as_view(), name='buyer_purchases'),
]
