from rest_framework import serializers
from .models import ArrivalForecast, CongestionAlert

class ArrivalForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArrivalForecast
        fields = '__all__'


class CongestionAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = CongestionAlert
        fields = '__all__'
