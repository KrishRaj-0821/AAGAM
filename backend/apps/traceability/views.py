from rest_framework import viewsets, permissions
from common.responses import success_response
from .models import CropTraceability
from .serializers import CropTraceabilitySerializer

class CropTraceabilityViewSet(viewsets.ModelViewSet):
    queryset = CropTraceability.objects.all().order_by('timestamp')
    serializer_class = CropTraceabilitySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        batch = self.request.query_params.get('batch')
        if batch:
            qs = qs.filter(batch_id__icontains=batch)
        return qs

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)
