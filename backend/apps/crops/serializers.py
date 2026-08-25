from rest_framework import serializers
from .models import CropCategory, Crop, CropImage

class CropCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CropCategory
        fields = '__all__'


class CropImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropImage
        fields = '__all__'


class CropSerializer(serializers.ModelSerializer):
    category_details = CropCategorySerializer(source='category', read_only=True)
    images = CropImageSerializer(many=True, read_only=True)

    class Meta:
        model = Crop
        fields = '__all__'
        read_only_fields = ['uuid', 'created_at', 'updated_at']
