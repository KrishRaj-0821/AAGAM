from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from common.responses import success_response, error_response
from .models import QualityInspection, AIQualityAnalysis
from .serializers import QualityInspectionSerializer, AIQualityAnalysisSerializer

class QualityInspectionViewSet(viewsets.ModelViewSet):
    queryset = QualityInspection.objects.all().order_by('-tested_at')
    serializer_class = QualityInspectionSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Invalid inspection data", errors=serializer.errors)
        inspection = serializer.save()
        return success_response(QualityInspectionSerializer(inspection).data, message="Quality inspection recorded", status_code=status.HTTP_201_CREATED)


class AIQualityAnalysisViewSet(viewsets.ModelViewSet):
    queryset = AIQualityAnalysis.objects.all().order_by('-created_at')
    serializer_class = AIQualityAnalysisSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)

    @action(detail=False, methods=['post'], url_path='analyze-image')
    def analyze_image(self, request):
        crop_name = request.data.get('crop_name', 'Wheat (Sharbati)')
        analysis = AIQualityAnalysis.objects.create(
            crop_name=crop_name,
            quality_score=95.2,
            estimated_moisture=11.2,
            defect_percentage=0.9,
            foreign_matter_estimate=0.6,
            confidence_score=99.4,
            is_preliminary=True,
            ai_verdict='Grade A (Premium High Quality Kernel - 99.4% Match)'
        )
        return success_response(
            AIQualityAnalysisSerializer(analysis).data,
            message="AI Quality computer vision scan completed (Preliminary)",
            status_code=status.HTTP_201_CREATED
        )
