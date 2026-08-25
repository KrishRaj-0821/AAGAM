from django.contrib import admin
from .models import MandiCenter, SlotBooking, PriorityVehicleQueue, DailyProcurementQuota

@admin.register(MandiCenter)
class MandiCenterAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'district', 'state', 'daily_capacity_mt', 'is_active')
    list_filter = ('state', 'district', 'is_active')
    search_fields = ('name', 'code', 'district', 'state')

@admin.register(SlotBooking)
class SlotBookingAdmin(admin.ModelAdmin):
    list_display = ('token_no', 'farmer_name', 'commodity', 'mandi_name', 'booking_date', 'status', 'lane')
    list_filter = ('status', 'state', 'commodity', 'booking_date')
    search_fields = ('token_no', 'farmer_name', 'vehicle_number', 'mandi_name')

@admin.register(PriorityVehicleQueue)
class PriorityVehicleQueueAdmin(admin.ModelAdmin):
    list_display = ('queue_number', 'slot_booking', 'priority', 'weighbridge_assigned', 'entry_scanned_at')
    list_filter = ('priority', 'weighbridge_assigned')

@admin.register(DailyProcurementQuota)
class DailyProcurementQuotaAdmin(admin.ModelAdmin):
    list_display = ('mandi_center', 'date', 'commodity', 'total_capacity_mt', 'booked_mt', 'procured_today_mt')
    list_filter = ('date', 'commodity')
