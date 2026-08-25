from django.contrib import admin
from .models import CropTraceability

@admin.register(CropTraceability)
class CropTraceabilityAdmin(admin.ModelAdmin):
    list_display = ('batch_id', 'crop_name', 'farmer_name', 'stage', 'location', 'timestamp')
    list_filter = ('stage',)
