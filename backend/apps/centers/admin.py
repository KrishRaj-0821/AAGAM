from django.contrib import admin
from .models import ProcurementCenter, CenterCapacity

@admin.register(ProcurementCenter)
class ProcurementCenterAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'district', 'state', 'daily_capacity_mt', 'operational_status')
    list_filter = ('state', 'operational_status')

@admin.register(CenterCapacity)
class CenterCapacityAdmin(admin.ModelAdmin):
    list_display = ('center', 'date', 'commodity', 'total_quota_mt', 'booked_quota_mt', 'procured_today_mt')
