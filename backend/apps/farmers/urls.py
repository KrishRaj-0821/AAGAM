from django.urls import path
from .views import (
    FarmerDashboardView,
    FarmerProfileView,
    FarmerLandsView,
    FarmerCropsView,
    FarmerPaymentsView
)

urlpatterns = [
    path('dashboard/', FarmerDashboardView.as_view(), name='farmer_dashboard'),
    path('profile/', FarmerProfileView.as_view(), name='farmer_profile'),
    path('lands/', FarmerLandsView.as_view(), name='farmer_lands'),
    path('crops/', FarmerCropsView.as_view(), name='farmer_crops'),
    path('payments/', FarmerPaymentsView.as_view(), name='farmer_payments'),
]
