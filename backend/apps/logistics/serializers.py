from rest_framework import serializers
from .models import LogisticsProviderProfile, Driver, Vehicle, TransportRequest, TransportBooking

class LogisticsProviderProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogisticsProviderProfile
        fields = '__all__'


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'


class VehicleSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source='driver.name', read_only=True)

    class Meta:
        model = Vehicle
        fields = '__all__'


class TransportBookingSerializer(serializers.ModelSerializer):
    vehicle_details = VehicleSerializer(source='vehicle', read_only=True)
    driver_details = DriverSerializer(source='driver', read_only=True)

    class Meta:
        model = TransportBooking
        fields = '__all__'
        read_only_fields = ['uuid', 'booking_code', 'created_at']


class TransportRequestSerializer(serializers.ModelSerializer):
    booking = TransportBookingSerializer(read_only=True)

    class Meta:
        model = TransportRequest
        fields = '__all__'
        read_only_fields = ['uuid', 'request_code', 'created_at']
