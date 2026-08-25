from django.contrib import admin
from .models import GateEntry, WeighmentSlip

@admin.register(GateEntry)
class GateEntryAdmin(admin.ModelAdmin):
    list_display = ('entry_number', 'vehicle_number', 'driver_name', 'mandi_name', 'status', 'entry_timestamp')

@admin.register(WeighmentSlip)
class WeighmentSlipAdmin(admin.ModelAdmin):
    list_display = ('tola_parchi_number', 'farmer_name', 'commodity', 'vehicle_number', 'net_weight_quintals', 'gross_time')
