from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QualityInspectionViewSet, AIQualityAnalysisViewSet

router = DefaultRouter()
router.register(r'inspections', QualityInspectionViewSet, basename='quality_inspection')
router.register(r'ai-analysis', AIQualityAnalysisViewSet, basename='ai_analysis')

urlpatterns = [
    path('', include(router.urls)),
]
