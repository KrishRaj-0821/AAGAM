from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QRTokenViewSet, GenerateTokenView, ScanTokenView

router = DefaultRouter()
router.register(r'', QRTokenViewSet, basename='token')

urlpatterns = [
    path('generate/', GenerateTokenView.as_view(), name='token_generate'),
    path('scan/', ScanTokenView.as_view(), name='token_scan'),
    path('', include(router.urls)),
]
