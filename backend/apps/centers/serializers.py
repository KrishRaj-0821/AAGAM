from rest_framework import serializers
from .models import ProcurementCenter, CenterCapacity

class CenterCapacitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CenterCapacity
        fields = '__all__'


class ProcurementCenterSerializer(serializers.ModelSerializer):
    daily_capacities = CenterCapacitySerializer(many=True, read_only=True)

    class Meta:
        model = ProcurementCenter
        fields = '__all__'
        read_only_fields = ['uuid', 'created_at']
