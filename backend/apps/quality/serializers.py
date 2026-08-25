from rest_framework import serializers
from .models import QualityInspection, AIQualityAnalysis

class QualityInspectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualityInspection
        fields = '__all__'
        read_only_fields = ['uuid', 'inspection_code', 'tested_at']


class AIQualityAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIQualityAnalysis
        fields = '__all__'
        read_only_fields = ['uuid', 'analysis_code', 'created_at']
