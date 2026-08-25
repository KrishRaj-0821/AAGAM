from django.contrib import admin
from .models import LogisticsProviderProfile, Driver, Vehicle, TransportRequest, TransportBooking

@admin.register(LogisticsProviderProfile)
class LogisticsProviderProfileAdmin(admin.ModelAdmin):
    list_display = ('fleet_name', 'user', 'fleet_size', 'license_number', 'rating')

@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'license_number', 'is_available')

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('vehicle_number', 'vehicle_type', 'capacity_mt', 'driver', 'is_available')

@admin.register(TransportRequest)
class TransportRequestAdmin(admin.ModelAdmin):
    list_display = ('request_code', 'commodity', 'quantity_mt', 'pickup_location', 'destination', 'status')
    list_filter = ('status',)

@admin.register(TransportBooking)
class TransportBookingAdmin(admin.ModelAdmin):
    list_display = ('booking_code', 'request', 'vehicle', 'driver', 'delivery_eta')
