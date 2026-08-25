from django.contrib import admin
from .models import CropCategory, Crop, CropImage

@admin.register(CropCategory)
class CropCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'name_hi', 'season')

@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ('crop_name', 'farmer_name', 'variety', 'quantity', 'unit', 'expected_price', 'quality_grade', 'status')
    list_filter = ('status', 'quality_grade')
    search_fields = ('crop_name', 'variety', 'farmer_name', 'location')

@admin.register(CropImage)
class CropImageAdmin(admin.ModelAdmin):
    list_display = ('crop', 'uploaded_at')
