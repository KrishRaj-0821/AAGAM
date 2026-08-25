from rest_framework import serializers
from .models import MandiCenter, SlotBooking, PriorityVehicleQueue, DailyProcurementQuota

class MandiCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MandiCenter
        fields = '__all__'


class PriorityVehicleQueueSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriorityVehicleQueue
        fields = '__all__'


class SlotBookingSerializer(serializers.ModelSerializer):
    queue_entry = PriorityVehicleQueueSerializer(read_only=True)

    class Meta:
        model = SlotBooking
        fields = '__all__'
        read_only_fields = ['token_no', 'qr_code_data', 'created_at']


class DailyProcurementQuotaSerializer(serializers.ModelSerializer):
    mandi_name = serializers.CharField(source='mandi_center.name', read_only=True)

    class Meta:
        model = DailyProcurementQuota
        fields = '__all__'
