from rest_framework import serializers
from .models import CropTraceability

class CropTraceabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CropTraceability
        fields = '__all__'
        read_only_fields = ['uuid', 'timestamp']
