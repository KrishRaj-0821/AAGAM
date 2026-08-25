from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GateEntryViewSet, WeighmentSlipViewSet

router = DefaultRouter()
router.register(r'gate-entries', GateEntryViewSet, basename='gate_entry')
router.register(r'weighments', WeighmentSlipViewSet, basename='weighment_slip')

urlpatterns = [
    path('', include(router.urls)),
]
