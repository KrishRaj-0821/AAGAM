from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import QualityInspection, TolaParchiWeighment, QualityCertificate
from .serializers import (
    QualityInspectionSerializer,
    TolaParchiWeighmentSerializer,
    QualityCertificateSerializer
)

class QualityInspectionViewSet(viewsets.ModelViewSet):
    queryset = QualityInspection.objects.all().order_by('-tested_at')
    serializer_class = QualityInspectionSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        token = self.request.query_params.get('token')
        grade = self.request.query_params.get('grade')
        status_param = self.request.query_params.get('status')
        if token:
            qs = qs.filter(token_no__icontains=token)
        if grade:
            qs = qs.filter(final_grade__iexact=grade)
        if status_param:
            qs = qs.filter(status__iexact=status_param)
        return qs

    @action(detail=True, methods=['post'])
    def generate_certificate(self, request, pk=None):
        inspection = self.get_object()
        cert, created = QualityCertificate.objects.get_or_create(
            inspection=inspection,
            defaults={'qr_hash': f"AAGAM-CERT-{inspection.inspection_id}"}
        )
        return Response({
            'message': 'Digital Quality Certificate issued successfully',
            'certificate': QualityCertificateSerializer(cert).data
        })


class TolaParchiWeighmentViewSet(viewsets.ModelViewSet):
    queryset = TolaParchiWeighment.objects.all().order_by('-gross_time')
    serializer_class = TolaParchiWeighmentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        token = self.request.query_params.get('token')
        vehicle = self.request.query_params.get('vehicle')
        if token:
            qs = qs.filter(token_no__icontains=token)
        if vehicle:
            qs = qs.filter(vehicle_number__icontains=vehicle)
        return qs


class QualityCertificateViewSet(viewsets.ModelViewSet):
    queryset = QualityCertificate.objects.all().order_by('-issued_date')
    serializer_class = QualityCertificateSerializer
    permission_classes = [permissions.AllowAny]
