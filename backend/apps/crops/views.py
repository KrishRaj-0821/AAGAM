from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from common.responses import success_response, error_response
from .models import CropCategory, Crop, CropImage
from .serializers import CropCategorySerializer, CropSerializer, CropImageSerializer

class CropCategoryViewSet(viewsets.ModelViewSet):
    queryset = CropCategory.objects.all()
    serializer_class = CropCategorySerializer
    permission_classes = [permissions.AllowAny]


class CropViewSet(viewsets.ModelViewSet):
    queryset = Crop.objects.all().order_by('-created_at')
    serializer_class = CropSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        category = self.request.query_params.get('category')
        crop_name = self.request.query_params.get('crop_name')
        grade = self.request.query_params.get('grade')
        search = self.request.query_params.get('search')

        if status_param:
            qs = qs.filter(status__iexact=status_param)
        if category:
            qs = qs.filter(category__name__icontains=category)
        if crop_name:
            qs = qs.filter(crop_name__icontains=crop_name)
        if grade:
            qs = qs.filter(quality_grade__iexact=grade)
        if search:
            qs = qs.filter(crop_name__icontains=search) | qs.filter(variety__icontains=search) | qs.filter(location__icontains=search)
        return qs

    def list(self, request, *args, **kwargs):
        qs = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return success_response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", errors=serializer.errors)
        farmer = request.user if request.user.is_authenticated else None
        crop = serializer.save(farmer=farmer)
        return success_response(CropSerializer(crop).data, message="Crop registered successfully", status_code=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return error_response("Update failed", errors=serializer.errors)
        serializer.save()
        return success_response(serializer.data, message="Crop updated successfully")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return success_response(message="Crop deleted successfully")

    @action(detail=False, methods=['get'], url_path='my-crops')
    def my_crops(self, request):
        if request.user.is_authenticated:
            qs = Crop.objects.filter(farmer=request.user)
        else:
            qs = Crop.objects.all()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)
