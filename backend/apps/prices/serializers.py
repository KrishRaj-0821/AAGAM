from rest_framework import serializers
from .models import MSPPrice, MarketPrice, PriceHistory

class MSPPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MSPPrice
        fields = '__all__'


class MarketPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketPrice
        fields = '__all__'


class PriceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceHistory
        fields = '__all__'
