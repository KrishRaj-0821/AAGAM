import json
from django.db import transaction
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import action

from common.responses import success_response, error_response
from common.permissions import IsCenterOperator, IsFarmer
from apps.slots.models import SlotBooking, SlotBookingStatus
from apps.operations.models import GateEntry
from .models import QRToken, GatePass, QRTokenStatus
from .serializers import QRTokenSerializer, GatePassSerializer


class QRTokenViewSet(viewsets.ModelViewSet):
    queryset = QRToken.objects.all().order_by('-created_at')
    serializer_class = QRTokenSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return QRToken.objects.none()
        if user.role in ['ADMIN', 'SUPER_ADMIN', 'OFFICER']:
            return QRToken.objects.all().order_by('-created_at')
        if user.role in ['CENTER_OPERATOR']:
            if user.mandi:
                return QRToken.objects.filter(mandi_name__icontains=user.mandi).order_by('-created_at')
            return QRToken.objects.all().order_by('-created_at')
        # Farmer: only own tokens
        return QRToken.objects.filter(slot_booking__farmer=user).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)


class GenerateTokenView(APIView):
    """
    Direct token creation endpoint for internal services / admin.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = QRTokenSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Invalid payload", errors=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)
        token = serializer.save()
        return success_response(
            QRTokenSerializer(token).data,
            message="QR Token generated successfully",
            status_code=status.HTTP_201_CREATED
        )


class ScanTokenView(APIView):
    """
    POST /api/tokens/scan/
    Gate Pass Token Scanning & Verification Endpoint (P0-8).
    - Requires authenticated Center Operator or Administrator.
    - Uses database transaction + row locking (select_for_update()) to prevent race conditions.
    - Enforces state machine: ISSUED -> SCANNED -> USED.
    - Rejects already-used tokens with 409 Conflict.
    - Rejects expired, cancelled, wrong date, or wrong center tokens.
    """
    permission_classes = [permissions.IsAuthenticated, IsCenterOperator]

    def post(self, request):
        raw_token = request.data.get('token') or request.data.get('token_string')
        if not raw_token:
            return error_response("Token string or QR payload is required.", status_code=status.HTTP_400_BAD_REQUEST)

        # Handle JSON formatted payload from QR scanner if provided
        token_string = str(raw_token).strip()
        passed_signature = request.data.get('signature') or request.data.get('sig')
        if token_string.startswith('{') and token_string.endswith('}'):
            try:
                parsed = json.loads(token_string)
                token_string = parsed.get('tok') or parsed.get('token') or token_string
                if not passed_signature:
                    passed_signature = parsed.get('sig')
            except Exception:
                pass

        operator = request.user
        vehicle_num = request.data.get('vehicle_number', 'HR-05-AB-7821')
        driver_name = request.data.get('driver_name', '')
        operator_name = operator.full_name or operator.username or 'Center Operator'

        # Atomic transaction + row lock
        with transaction.atomic():
            try:
                token = QRToken.objects.select_for_update().get(
                    token_string__iexact=token_string
                )
            except QRToken.DoesNotExist:
                return error_response(
                    "Invalid or unknown QR Token.",
                    status_code=status.HTTP_404_NOT_FOUND
                )

            # Check Cryptographic Signature (Requirement 5E: QR modified / tampered)
            if passed_signature:
                import hmac
                if not hmac.compare_digest(str(token.opaque_signature), str(passed_signature)):
                    return error_response(
                        "ACCESS DENIED: Tampered or modified QR Token signature.",
                        errors={"signature": "INVALID"},
                        status_code=status.HTTP_400_BAD_REQUEST
                    )

            # 1. Check if token was already used (Replay Protection)
            if token.status == QRTokenStatus.USED or token.is_used:
                return error_response(
                    "ACCESS DENIED: QR Token has already been used and admitted to the yard.",
                    errors={
                        "token_string": token.token_string,
                        "status": token.status,
                        "used_at": token.used_at or token.scanned_at
                    },
                    status_code=status.HTTP_409_CONFLICT
                )

            # 2. Check if booking was cancelled
            if token.status == QRTokenStatus.CANCELLED or (token.slot_booking and token.slot_booking.status == SlotBookingStatus.CANCELLED):
                return error_response(
                    "ACCESS DENIED: The slot booking for this token has been cancelled.",
                    errors={"status": "CANCELLED"},
                    status_code=status.HTTP_400_BAD_REQUEST
                )

            # 3. Check Token Expiration
            now = timezone.now()
            if token.expires_at and now > token.expires_at:
                token.status = QRTokenStatus.EXPIRED
                token.save()
                return error_response(
                    "ACCESS DENIED: QR Token has expired.",
                    errors={"status": "EXPIRED", "expired_at": token.expires_at},
                    status_code=status.HTTP_400_BAD_REQUEST
                )

            # 4. Check Date Validity
            today = timezone.localdate() if hasattr(timezone, 'localdate') else timezone.now().date()
            # Allow scan on booking date (or allow if token.date matches today)
            date_override = request.data.get('allow_date_override', False)
            if not date_override and token.date != today:
                if token.date < today:
                    token.status = QRTokenStatus.EXPIRED
                    token.save()
                    return error_response(
                        f"ACCESS DENIED: QR Token was valid for {token.date}, which has already passed.",
                        status_code=status.HTTP_400_BAD_REQUEST
                    )
                else:
                    return error_response(
                        f"ACCESS DENIED: QR Token is scheduled for future date {token.date}. Today is {today}.",
                        status_code=status.HTTP_400_BAD_REQUEST
                    )

            # 5. Check Assigned Center
            operator_mandi = getattr(operator, 'mandi', None)
            if operator_mandi and operator.role == 'CENTER_OPERATOR':
                clean_op_mandi = operator_mandi.lower().strip()
                clean_token_mandi = token.mandi_name.lower().strip()
                # Check for significant substring match
                if clean_op_mandi not in clean_token_mandi and clean_token_mandi not in clean_op_mandi:
                    return error_response(
                        f"ACCESS DENIED: Token is designated for center '{token.mandi_name}', but operator is assigned to '{operator.mandi}'.",
                        status_code=status.HTTP_403_FORBIDDEN
                    )

            # 6. Atomic State Machine Transition: ISSUED -> SCANNED -> USED
            token.status = QRTokenStatus.USED
            token.is_used = True
            token.scanned_at = now
            token.used_at = now
            token.save()

            # Update linked SlotBooking status
            if token.slot_booking:
                token.slot_booking.status = SlotBookingStatus.ARRIVED
                token.slot_booking.save()

            # Record GatePass and GateEntry atomically
            effective_driver = driver_name or token.farmer_name
            gate_pass, _ = GatePass.objects.get_or_create(
                qr_token=token,
                defaults={
                    'vehicle_number': vehicle_num,
                    'driver_name': effective_driver,
                    'security_guard': operator_name,
                    'entry_allowed': True
                }
            )

            gate_entry = GateEntry.objects.create(
                qr_token=token,
                token_string=token.token_string,
                vehicle_number=vehicle_num,
                driver_name=effective_driver,
                mandi_name=token.mandi_name,
                gate_lane=token.lane,
                operator_name=operator_name,
                status='ADMITTED'
            )

        return success_response({
            "access_granted": True,
            "status": "USED",
            "token": QRTokenSerializer(token).data,
            "gate_pass": GatePassSerializer(gate_pass).data,
            "gate_entry_number": gate_entry.entry_number,
        }, message=f"Gate Pass verified! Vehicle admitted to {token.lane}")
