from decimal import Decimal
from datetime import datetime, date
from django.db import transaction
from django.db.models import F, Q
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response

from common.responses import success_response, error_response
from common.permissions import IsFarmer, IsAdminUserOrReadOnly
from apps.centers.models import ProcurementCenter
from apps.tokens.models import QRToken, QRTokenStatus
from .models import Slot, SlotBooking, SlotBookingStatus
from .serializers import SlotSerializer, SlotBookingSerializer


class SlotViewSet(viewsets.ModelViewSet):
    """
    Server-authoritative Slot and Booking Management ViewSet.
    Enforces concurrency-safe capacity allocation and role-based access control.
    """
    queryset = SlotBooking.objects.all().order_by('-created_at')
    serializer_class = SlotBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return SlotBooking.objects.none()
        
        # System Administrators and Officers see all bookings
        if user.role in ['ADMIN', 'SUPER_ADMIN', 'OFFICER']:
            qs = SlotBooking.objects.all().order_by('-created_at')
        elif user.role in ['CENTER_OPERATOR']:
            # Operators see bookings for their assigned mandi
            qs = SlotBooking.objects.filter(mandi_name__icontains=user.mandi or '').order_by('-created_at') if user.mandi else SlotBooking.objects.all()
        else:
            # Farmers strictly see only their own bookings (P0-9)
            qs = SlotBooking.objects.filter(farmer=user).order_by('-created_at')

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

    @action(detail=False, methods=['get'], url_path='available')
    def available_slots(self, request):
        """
        Public/authenticated view of available slots for a given center and date.
        """
        center_id = request.query_params.get('center_id')
        date_str = request.query_params.get('date')
        qs = Slot.objects.filter(is_available=True)
        if center_id:
            if len(str(center_id)) == 36:
                qs = qs.filter(Q(center__uuid=center_id) | Q(center__code=center_id))
            else:
                qs = qs.filter(Q(center__code=center_id) | Q(center__name__iexact=center_id))
        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                qs = qs.filter(date=target_date)
            except ValueError:
                pass
        serializer = SlotSerializer(qs, many=True)
        return success_response(serializer.data)

    @action(detail=False, methods=['post'], url_path='book', permission_classes=[permissions.IsAuthenticated, IsFarmer])
    def book_slot(self, request):
        """
        POST /api/slots/book/
        Single canonical booking endpoint (P0-4).
        - Authenticated farmer comes strictly from JWT (request.user).
        - Concurrency-safe capacity management via select_for_update() (P0-5).
        - Idempotency-Key support to handle network retries safely (P0-6).
        - Authoritative QR token generation on the backend (P0-7).
        """
        user = request.user
        data = request.data

        # 1. Extract & Validate Parameters
        center_id = data.get('center_id') or data.get('center')
        if not center_id:
            return error_response("center_id is required.", status_code=status.HTTP_400_BAD_REQUEST)

        try:
            # Match by UUID or code or name
            center = ProcurementCenter.objects.filter(
                Q(uuid=center_id) if len(str(center_id)) == 36 else Q(code=center_id) | Q(name__iexact=center_id)
            ).first()
            if not center:
                center = ProcurementCenter.objects.get(pk=center_id)
        except Exception:
            return error_response(f"Procurement center '{center_id}' not found.", status_code=status.HTTP_404_NOT_FOUND)

        # Check Center Operational Status (P0-5 requirement #7)
        if center.operational_status != 'ACTIVE':
            return error_response(
                f"Procurement center '{center.name}' is currently {center.operational_status} and not accepting bookings.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Booking Date Validation
        booking_date_raw = data.get('booking_date') or data.get('date')
        if not booking_date_raw:
            return error_response("booking_date is required.", status_code=status.HTTP_400_BAD_REQUEST)
        try:
            booking_date = datetime.strptime(str(booking_date_raw), '%Y-%m-%d').date() if isinstance(booking_date_raw, str) else booking_date_raw
        except ValueError:
            return error_response("Invalid booking_date format. Use YYYY-MM-DD.", status_code=status.HTTP_400_BAD_REQUEST)

        # Reject past dates (P0-5 requirement #6)
        if booking_date < timezone.now().date():
            return error_response("Cannot book slots for a past date.", status_code=status.HTTP_400_BAD_REQUEST)

        # Quantity Validation
        try:
            quantity = Decimal(str(data.get('quantity_quintals', data.get('estimatedQty', '0'))))
            if quantity <= 0:
                raise ValueError()
        except (ValueError, TypeError):
            return error_response("quantity_quintals must be a positive number greater than 0.", status_code=status.HTTP_400_BAD_REQUEST)

        commodity = data.get('commodity') or data.get('crop_name') or 'Wheat (Sharbati)'
        time_slot = data.get('time_slot') or data.get('timeSlot') or '09:00 AM - 11:00 AM'
        lane = data.get('lane') or 'Lane 04 - Weighbridge A'
        vehicle_number = data.get('vehicle_number') or data.get('vehicleNumber') or 'HR-05-AB-7821'
        driver_name = data.get('driver_name') or user.full_name or 'Harpreet Singh'

        # Compute canonical payload fingerprint (Requirement 3: Idempotency Adversarial Verification)
        import hashlib
        canonical_raw = f"{center.pk}:{booking_date}:{time_slot}:{str(commodity).strip().lower()}:{Decimal(str(quantity)).quantize(Decimal('0.01'))}"
        current_fingerprint = hashlib.sha256(canonical_raw.encode('utf-8')).hexdigest()

        # 2. Idempotency Check (P0-6 & Requirement 3)
        idempotency_key = (
            request.headers.get('Idempotency-Key')
            or request.headers.get('HTTP_IDEMPOTENCY_KEY')
            or data.get('idempotency_key')
        )
        if idempotency_key:
            idempotency_key = str(idempotency_key).strip()
            existing_booking = SlotBooking.objects.filter(farmer=user, idempotency_key=idempotency_key).first()
            if existing_booking:
                # If key was already used with a different request payload, reject with HTTP 409
                if existing_booking.idempotency_fingerprint and existing_booking.idempotency_fingerprint != current_fingerprint:
                    return error_response(
                        "Idempotency key has already been used with a different request payload.",
                        code="IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST",
                        status_code=status.HTTP_409_CONFLICT
                    )
                serializer = SlotBookingSerializer(existing_booking)
                return success_response(
                    serializer.data,
                    message="Idempotent request: returning existing booking.",
                    status_code=status.HTTP_200_OK
                )

        # 3. Concurrency-Safe Capacity Validation & Atomic Booking (P0-5 & Requirement 4)
        with transaction.atomic():
            # Same Farmer Multi-Device Active Booking Check (Requirement 4)
            duplicate_active = SlotBooking.objects.select_for_update().filter(
                farmer=user,
                booking_date=booking_date,
                commodity=commodity,
                status=SlotBookingStatus.CONFIRMED
            ).exists()
            if duplicate_active:
                return error_response(
                    f"Farmer already holds an active booking for {commodity} on {booking_date}. Multiple active bookings for the same date and commodity are not permitted.",
                    code="DUPLICATE_ACTIVE_BOOKING_NOT_PERMITTED",
                    status_code=status.HTTP_409_CONFLICT
                )

            # Lock the slot row using select_for_update()
            slot = Slot.objects.select_for_update().filter(
                center=center,
                date=booking_date,
                time_slot=time_slot
            ).first()

            if not slot:
                # Provision slot record with initial capacity if not pre-seeded
                slot = Slot.objects.create(
                    center=center,
                    date=booking_date,
                    time_slot=time_slot,
                    lane=lane,
                    max_capacity_quintals=Decimal('500.00'),
                    booked_quintals=Decimal('0.00'),
                    is_available=True
                )
                # Re-lock the newly created slot
                slot = Slot.objects.select_for_update().get(pk=slot.pk)

            # Check capacity
            remaining = slot.max_capacity_quintals - slot.booked_quintals
            if quantity > remaining:
                return error_response(
                    f"Insufficient slot capacity. Requested {quantity} QTL exceeds remaining capacity of {remaining} QTL for this time slot.",
                    status_code=status.HTTP_400_BAD_REQUEST
                )

            # Atomic update of slot capacity
            slot.booked_quintals = slot.booked_quintals + quantity
            if slot.booked_quintals >= slot.max_capacity_quintals:
                slot.is_available = False
            slot.save()

            # Create authoritative booking record
            booking = SlotBooking.objects.create(
                idempotency_key=idempotency_key,
                idempotency_fingerprint=current_fingerprint,
                farmer=user,
                farmer_name=user.full_name or user.username,
                farmer_phone=user.phone or "+91 98765 43210",
                center=center,
                slot=slot,
                mandi_name=center.name,
                state=center.state,
                district=center.district,
                commodity=commodity,
                quantity_quintals=quantity,
                booking_date=booking_date,
                time_slot=time_slot,
                lane=lane,
                vehicle_number=vehicle_number,
                driver_name=driver_name,
                status=SlotBookingStatus.CONFIRMED
            )

            # Authoritatively generate QR Token (P0-7)
            qr_token = QRToken.objects.create(
                slot_booking=booking,
                token_string=booking.token_number,
                center=center,
                farmer_name=booking.farmer_name,
                mandi_name=center.name,
                crop_name=commodity,
                quantity_quintals=quantity,
                date=booking_date,
                time_slot=time_slot,
                lane=lane,
                status=QRTokenStatus.ISSUED
            )

        serializer = SlotBookingSerializer(booking)
        return success_response(
            serializer.data,
            message="Slot and authoritative QR token successfully booked.",
            status_code=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['get'], url_path='my-bookings', permission_classes=[permissions.IsAuthenticated])
    def my_bookings(self, request):
        """
        Farmer's own bookings list (P0-9).
        """
        qs = SlotBooking.objects.filter(farmer=request.user).order_by('-created_at')
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)

    @action(detail=True, methods=['post'], url_path='cancel', permission_classes=[permissions.IsAuthenticated])
    def cancel_slot(self, request, pk=None):
        """
        Cancels a booking and atomically restores capacity to the slot (P0-5 requirement #5).
        """
        with transaction.atomic():
            try:
                booking = SlotBooking.objects.select_for_update().get(pk=pk)
            except SlotBooking.DoesNotExist:
                return error_response("Booking not found.", status_code=status.HTTP_404_NOT_FOUND)

            # Check ownership (P0-9)
            if booking.farmer != request.user and request.user.role not in ['ADMIN', 'SUPER_ADMIN']:
                return error_response("You do not have permission to cancel this booking.", status_code=status.HTTP_403_FORBIDDEN)

            if booking.status == SlotBookingStatus.CANCELLED:
                return error_response("Booking is already cancelled.", status_code=status.HTTP_400_BAD_REQUEST)

            # Restore slot capacity if slot is linked
            if booking.slot:
                slot = Slot.objects.select_for_update().get(pk=booking.slot.pk)
                slot.booked_quintals = max(Decimal('0.00'), slot.booked_quintals - booking.quantity_quintals)
                slot.is_available = True
                slot.save()

            booking.status = SlotBookingStatus.CANCELLED
            booking.save()

            # Mark associated QR token as cancelled
            try:
                if hasattr(booking, 'qr_token') and booking.qr_token:
                    booking.qr_token.status = QRTokenStatus.CANCELLED
                    booking.qr_token.save()
            except Exception:
                pass

        return success_response(
            SlotBookingSerializer(booking).data,
            message="Slot booking cancelled and capacity restored successfully."
        )
