from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import MandiCenter, SlotBooking, PriorityVehicleQueue, DailyProcurementQuota, SlotStatus
from .serializers import (
    MandiCenterSerializer,
    SlotBookingSerializer,
    PriorityVehicleQueueSerializer,
    DailyProcurementQuotaSerializer
)

class MandiCenterViewSet(viewsets.ModelViewSet):
    queryset = MandiCenter.objects.filter(is_active=True)
    serializer_class = MandiCenterSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        state = self.request.query_params.get('state')
        district = self.request.query_params.get('district')
        if state:
            qs = qs.filter(state__iexact=state)
        if district:
            qs = qs.filter(district__iexact=district)
        return qs


class SlotBookingViewSet(viewsets.ModelViewSet):
    queryset = SlotBooking.objects.all().order_by('-created_at')
    serializer_class = SlotBookingSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        farmer_id = self.request.query_params.get('farmer')
        status_filter = self.request.query_params.get('status')
        mandi = self.request.query_params.get('mandi')
        token = self.request.query_params.get('token')

        if farmer_id:
            qs = qs.filter(farmer_id=farmer_id)
        if status_filter:
            qs = qs.filter(status=status_filter)
        if mandi:
            qs = qs.filter(mandi_name__icontains=mandi)
        if token:
            qs = qs.filter(token_no=token)
        return qs

    @action(detail=True, methods=['post'])
    def scan_gate_entry(self, request, pk=None):
        slot = self.get_object()
        slot.status = SlotStatus.ARRIVED
        slot.gate_entry_time = timezone.now()
        slot.save()

        # Create or update queue entry
        queue_count = PriorityVehicleQueue.objects.count() + 1
        queue, _ = PriorityVehicleQueue.objects.get_or_create(
            slot_booking=slot,
            defaults={
                'queue_number': queue_count,
                'priority': 'FAST_TRACK',
                'weighbridge_assigned': 'WB-01'
            }
        )
        return Response({
            'message': f"Gate pass {slot.token_no} verified and added to queue",
            'slot': SlotBookingSerializer(slot).data,
            'queue': PriorityVehicleQueueSerializer(queue).data
        })

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        slot = self.get_object()
        new_status = request.data.get('status')
        if new_status in SlotStatus.values:
            slot.status = new_status
            if new_status == SlotStatus.COMPLETED:
                slot.completed_time = timezone.now()
            slot.save()
            return Response(SlotBookingSerializer(slot).data)
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)


class VehicleQueueViewSet(viewsets.ModelViewSet):
    queryset = PriorityVehicleQueue.objects.all().order_by('queue_number')
    serializer_class = PriorityVehicleQueueSerializer
    permission_classes = [permissions.AllowAny]


class DailyProcurementQuotaViewSet(viewsets.ModelViewSet):
    queryset = DailyProcurementQuota.objects.all().order_by('-date')
    serializer_class = DailyProcurementQuotaSerializer
    permission_classes = [permissions.AllowAny]
