from django.contrib import admin
from .models import Slot, SlotBooking

@admin.register(Slot)
class SlotAdmin(admin.ModelAdmin):
    list_display = ('center', 'date', 'time_slot', 'lane', 'booked_quintals', 'is_available')

@admin.register(SlotBooking)
class SlotBookingAdmin(admin.ModelAdmin):
    list_display = ('token_number', 'farmer_name', 'commodity', 'mandi_name', 'booking_date', 'status')
    list_filter = ('status', 'booking_date')
