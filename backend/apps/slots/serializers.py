from rest_framework import serializers
from .models import Slot, SlotBooking
from apps.tokens.serializers import QRTokenSerializer

class SlotSerializer(serializers.ModelSerializer):
    center_name = serializers.CharField(source='center.name', read_only=True)
    remaining_capacity = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Slot
        fields = '__all__'


class SlotBookingSerializer(serializers.ModelSerializer):
    qr_token = QRTokenSerializer(read_only=True)
    farmer_email = serializers.EmailField(source='farmer.email', read_only=True)

    class Meta:
        model = SlotBooking
        fields = '__all__'
        read_only_fields = ['uuid', 'token_number', 'qr_code_data', 'created_at', 'status', 'farmer']
