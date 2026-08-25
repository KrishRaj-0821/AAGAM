from rest_framework import serializers
from .models import QRToken, GatePass

class GatePassSerializer(serializers.ModelSerializer):
    class Meta:
        model = GatePass
        fields = '__all__'
        read_only_fields = ['uuid', 'gate_pass_number', 'entry_time']


class QRTokenSerializer(serializers.ModelSerializer):
    gate_pass = GatePassSerializer(read_only=True)

    class Meta:
        model = QRToken
        fields = '__all__'
        read_only_fields = ['uuid', 'token_string', 'qr_image_base64', 'created_at']
