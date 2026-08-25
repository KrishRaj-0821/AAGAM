from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    QualityInspectionViewSet,
    TolaParchiWeighmentViewSet,
    QualityCertificateViewSet
)

router = DefaultRouter()
router.register(r'assays', QualityInspectionViewSet, basename='assay')
router.register(r'weighments', TolaParchiWeighmentViewSet, basename='weighment')
router.register(r'certificates', QualityCertificateViewSet, basename='certificate')

urlpatterns = [
    path('', include(router.urls)),
]
