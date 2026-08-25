from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from common.responses import success_response, error_response
from .models import LogisticsProviderProfile, Driver, Vehicle, TransportRequest, TransportBooking
from .serializers import (
    LogisticsProviderProfileSerializer,
    DriverSerializer,
    VehicleSerializer,
    TransportRequestSerializer,
    TransportBookingSerializer
)

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)


class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [permissions.AllowAny]


class TransportRequestViewSet(viewsets.ModelViewSet):
    queryset = TransportRequest.objects.all().order_by('-created_at')
    serializer_class = TransportRequestSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Invalid transport request", errors=serializer.errors)
        req = serializer.save()
        return success_response(TransportRequestSerializer(req).data, message="Freight transport request created", status_code=status.HTTP_201_CREATED)


class TransportBookingViewSet(viewsets.ModelViewSet):
    queryset = TransportBooking.objects.all().order_by('-created_at')
    serializer_class = TransportBookingSerializer
    permission_classes = [permissions.AllowAny]
