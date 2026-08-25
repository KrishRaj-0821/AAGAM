from django.contrib import admin
from .models import QualityInspection, TolaParchiWeighment, QualityCertificate

@admin.register(QualityInspection)
class QualityInspectionAdmin(admin.ModelAdmin):
    list_display = ('inspection_id', 'token_no', 'farmer_name', 'crop_name', 'moisture_percentage', 'final_grade', 'status')
    list_filter = ('final_grade', 'status')
    search_fields = ('inspection_id', 'token_no', 'farmer_name')

@admin.register(TolaParchiWeighment)
class TolaParchiWeighmentAdmin(admin.ModelAdmin):
    list_display = ('parchi_no', 'token_no', 'vehicle_number', 'net_weight_quintals', 'weighbridge_id', 'gross_time')
    search_fields = ('parchi_no', 'token_no', 'vehicle_number')

@admin.register(QualityCertificate)
class QualityCertificateAdmin(admin.ModelAdmin):
    list_display = ('certificate_id', 'inspection', 'issued_by', 'issued_date')
