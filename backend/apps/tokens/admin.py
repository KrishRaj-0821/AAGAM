from django.contrib import admin
from .models import QRToken, GatePass

@admin.register(QRToken)
class QRTokenAdmin(admin.ModelAdmin):
    list_display = ('token_string', 'farmer_name', 'mandi_name', 'crop_name', 'date', 'is_used')
    list_filter = ('is_used', 'date')

@admin.register(GatePass)
class GatePassAdmin(admin.ModelAdmin):
    list_display = ('gate_pass_number', 'vehicle_number', 'driver_name', 'entry_time', 'entry_allowed')
