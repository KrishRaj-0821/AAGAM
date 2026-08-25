from django.contrib import admin
from .models import QualityInspection, AIQualityAnalysis

@admin.register(QualityInspection)
class QualityInspectionAdmin(admin.ModelAdmin):
    list_display = ('inspection_code', 'farmer_name', 'crop_name', 'quality_grade', 'result', 'moisture_percentage', 'tested_at')
    list_filter = ('result', 'quality_grade')

@admin.register(AIQualityAnalysis)
class AIQualityAnalysisAdmin(admin.ModelAdmin):
    list_display = ('analysis_code', 'crop_name', 'quality_score', 'estimated_moisture', 'confidence_score', 'created_at')
