from django.contrib import admin
from .models import ArrivalForecast, CongestionAlert

@admin.register(ArrivalForecast)
class ArrivalForecastAdmin(admin.ModelAdmin):
    list_display = ('mandi_name', 'crop_name', 'predicted_arrival_date', 'predicted_volume_mt', 'surge_risk_level')
    list_filter = ('surge_risk_level',)

@admin.register(CongestionAlert)
class CongestionAlertAdmin(admin.ModelAdmin):
    list_display = ('mandi_name', 'alert_level', 'is_active', 'timestamp')
