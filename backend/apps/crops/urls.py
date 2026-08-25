from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CropCategoryViewSet, CropViewSet

router = DefaultRouter()
router.register(r'categories', CropCategoryViewSet, basename='crop_category')
router.register(r'', CropViewSet, basename='crop')

urlpatterns = [
    path('', include(router.urls)),
]
