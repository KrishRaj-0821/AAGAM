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

        # Trigger n8n automated SMS booking notification webhook
        try:
            import urllib.request, json
            webhook_url = "https://connect-with-me247.app.n8n.cloud/webhook/aagam-sms-booking"
            f_name = (
                (booking.farmer.get_full_name() or booking.farmer.username)
                if booking.farmer
                else request.data.get("farmer_name", "Ram Singh")
            )
            raw_phone = (
                booking.farmer.phone
                if booking.farmer and getattr(booking.farmer, "phone", None)
                else request.data.get("phone_number", "9876543210")
            )
            clean_phone = "".join(filter(str.isdigit, str(raw_phone)))[-10:] or "9876543210"
            payload = {
                "farmer_name": str(f_name),
                "phone_number": clean_phone,
                "crop_name": str(request.data.get("crop_name", getattr(booking, "commodity", "Wheat"))),
                "quantity": str(request.data.get("quantity", getattr(booking, "quantity", "40"))),
                "mandi_location": str(request.data.get("mandi_location", getattr(booking, "mandi_name", "Central Mandi"))),
                "slot_date": str(request.data.get("slot_date", "29 Aug, 10:30 AM")),
            }
            req = urllib.request.Request(
                webhook_url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json", "User-Agent": "AAGAM-Backend/2.0"},
            )
            urllib.request.urlopen(req, timeout=3)
        except Exception:
            pass

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
