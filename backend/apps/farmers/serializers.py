from rest_framework import serializers
from .models import FarmerProfile, LandRecord

class FarmerProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    state = serializers.CharField(source='user.state', read_only=True)
    district = serializers.CharField(source='user.district', read_only=True)

    class Meta:
        model = FarmerProfile
        fields = '__all__'
        read_only_fields = ['uuid', 'user', 'created_at', 'updated_at']


class LandRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandRecord
        fields = '__all__'
        read_only_fields = ['uuid', 'farmer', 'created_at']
