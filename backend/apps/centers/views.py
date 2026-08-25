from rest_framework import viewsets, permissions
from common.responses import success_response
from .models import ProcurementCenter, CenterCapacity
from .serializers import ProcurementCenterSerializer, CenterCapacitySerializer

class ProcurementCenterViewSet(viewsets.ModelViewSet):
    queryset = ProcurementCenter.objects.all().order_by('name')
    serializer_class = ProcurementCenterSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        state = self.request.query_params.get('state')
        district = self.request.query_params.get('district')
        status_param = self.request.query_params.get('status')
        if state:
            qs = qs.filter(state__iexact=state)
        if district:
            qs = qs.filter(district__iexact=district)
        if status_param:
            qs = qs.filter(operational_status__iexact=status_param)
        return qs

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)


class CenterCapacityViewSet(viewsets.ModelViewSet):
    queryset = CenterCapacity.objects.all().order_by('-date')
    serializer_class = CenterCapacitySerializer
    permission_classes = [permissions.AllowAny]
