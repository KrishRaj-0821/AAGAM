from rest_framework import serializers
from .models import Slot, SlotBooking

class SlotSerializer(serializers.ModelSerializer):
    center_name = serializers.CharField(source='center.name', read_only=True)

    class Meta:
        model = Slot
        fields = '__all__'


class SlotBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlotBooking
        fields = '__all__'
        read_only_fields = ['uuid', 'token_number', 'qr_code_data', 'created_at']
