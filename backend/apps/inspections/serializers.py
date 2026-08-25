from rest_framework import serializers
from .models import QualityInspection, TolaParchiWeighment, QualityCertificate

class QualityCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualityCertificate
        fields = '__all__'


class QualityInspectionSerializer(serializers.ModelSerializer):
    certificate = QualityCertificateSerializer(read_only=True)

    class Meta:
        model = QualityInspection
        fields = '__all__'
        read_only_fields = ['inspection_id', 'tested_at']


class TolaParchiWeighmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TolaParchiWeighment
        fields = '__all__'
        read_only_fields = ['parchi_no', 'net_weight_kg', 'net_weight_quintals', 'gross_time']
