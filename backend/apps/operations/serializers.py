from rest_framework import serializers
from .models import GateEntry, WeighmentSlip

class GateEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = GateEntry
        fields = '__all__'
        read_only_fields = ['uuid', 'entry_number', 'entry_timestamp']


class WeighmentSlipSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeighmentSlip
        fields = '__all__'
        read_only_fields = ['uuid', 'tola_parchi_number', 'net_weight_kg', 'net_weight_quintals', 'gross_time']
