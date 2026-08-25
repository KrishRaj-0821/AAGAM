from rest_framework import viewsets, permissions, status
from common.responses import success_response, error_response
from .models import GateEntry, WeighmentSlip
from .serializers import GateEntrySerializer, WeighmentSlipSerializer

class GateEntryViewSet(viewsets.ModelViewSet):
    queryset = GateEntry.objects.all().order_by('-entry_timestamp')
    serializer_class = GateEntrySerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)


class WeighmentSlipViewSet(viewsets.ModelViewSet):
    queryset = WeighmentSlip.objects.all().order_by('-gross_time')
    serializer_class = WeighmentSlipSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Invalid weighment data", errors=serializer.errors)
        slip = serializer.save()
        return success_response(WeighmentSlipSerializer(slip).data, message="Tola Parchi weighment slip issued successfully", status_code=status.HTTP_201_CREATED)
