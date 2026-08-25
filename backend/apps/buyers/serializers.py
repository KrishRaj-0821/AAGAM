from rest_framework import serializers
from .models import BuyerProfile, BuyerPurchase

class BuyerProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = BuyerProfile
        fields = '__all__'
        read_only_fields = ['uuid', 'user', 'created_at', 'updated_at']


class BuyerPurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerPurchase
        fields = '__all__'
        read_only_fields = ['uuid', 'created_at']
