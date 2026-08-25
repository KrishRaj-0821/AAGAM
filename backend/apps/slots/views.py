from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from common.responses import success_response, error_response
from .models import Slot, SlotBooking, SlotBookingStatus
from .serializers import SlotSerializer, SlotBookingSerializer

class SlotViewSet(viewsets.ModelViewSet):
    queryset = SlotBooking.objects.all().order_by('-created_at')
    serializer_class = SlotBookingSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        token = self.request.query_params.get('token')
        status_param = self.request.query_params.get('status')
        mandi = self.request.query_params.get('mandi')
        if token:
            qs = qs.filter(token_number__icontains=token)
        if status_param:
            qs = qs.filter(status__iexact=status_param)
        if mandi:
            qs = qs.filter(mandi_name__icontains=mandi)
        return qs

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)

    @action(detail=False, methods=['post'], url_path='book')
    def book_slot(self, request):
        serializer = SlotBookingSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Invalid slot booking payload", errors=serializer.errors)
        farmer = request.user if request.user.is_authenticated else None
        booking = serializer.save(farmer=farmer)
        return success_response(
            SlotBookingSerializer(booking).data,
            message="Mandi slot and QR Token booked successfully",
            status_code=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['get'], url_path='my-bookings')
    def my_bookings(self, request):
        if request.user.is_authenticated:
            qs = SlotBooking.objects.filter(farmer=request.user)
        else:
            qs = SlotBooking.objects.all()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_slot(self, request, pk=None):
        booking = self.get_object()
        booking.status = SlotBookingStatus.CANCELLED
        booking.save()
        return success_response(SlotBookingSerializer(booking).data, message="Slot booking cancelled successfully")
