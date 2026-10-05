import uuid
import hmac
import hashlib
import json
from datetime import datetime, time
from django.db import models
from django.conf import settings
from django.utils import timezone
from apps.accounts.models import User
from apps.centers.models import ProcurementCenter
from apps.slots.models import SlotBooking
from common.utils import generate_qr_code_base64, generate_random_token


class QRTokenStatus(models.TextChoices):
    ISSUED = 'ISSUED', 'Issued & Active'
    SCANNED = 'SCANNED', 'Scanned at Gate'
    USED = 'USED', 'Used / Entry Granted'
    CANCELLED = 'CANCELLED', 'Cancelled'
    EXPIRED = 'EXPIRED', 'Expired'


def generate_opaque_signature(token_string, booking_uuid, date_str):
    secret = (getattr(settings, 'SECRET_KEY', '') or 'aagam-secure-token-signing-key').encode('utf-8')
    payload = f"{token_string}:{booking_uuid}:{date_str}".encode('utf-8')
    return hmac.new(secret, payload, hashlib.sha256).hexdigest()[:32]


class QRToken(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    token_string = models.CharField(max_length=50, unique=True, db_index=True)
    opaque_signature = models.CharField(max_length=64, blank=True)
    status = models.CharField(max_length=20, choices=QRTokenStatus.choices, default=QRTokenStatus.ISSUED, db_index=True)
    
    slot_booking = models.OneToOneField(SlotBooking, on_delete=models.CASCADE, null=True, blank=True, related_name='qr_token')
    center = models.ForeignKey(ProcurementCenter, on_delete=models.SET_NULL, null=True, blank=True, related_name='tokens')
    
    farmer_name = models.CharField(max_length=150)
    mandi_name = models.CharField(max_length=150)
    crop_name = models.CharField(max_length=150)
    quantity_quintals = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    time_slot = models.CharField(max_length=50, default='09:00 AM - 11:00 AM')
    lane = models.CharField(max_length=100, default='Lane 04 - Weighbridge A')
    
    qr_image_base64 = models.TextField(blank=True, null=True)
    is_used = models.BooleanField(default=False)
    scanned_at = models.DateTimeField(null=True, blank=True)
    used_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.token_string:
            self.token_string = generate_random_token(self.date)
        
        booking_id = str(self.slot_booking.uuid) if self.slot_booking else str(self.uuid)
        if not self.opaque_signature:
            self.opaque_signature = generate_opaque_signature(self.token_string, booking_id, str(self.date))
        
        if not self.expires_at:
            # Token expires at end of booking date (23:59:59) in local timezone
            self.expires_at = timezone.make_aware(
                datetime.combine(self.date, time(23, 59, 59)),
                timezone.get_current_timezone()
            )

        if not self.qr_image_base64:
            # Opaque signed payload: Never include Aadhaar, bank details, or sensitive PII (P0-7)
            opaque_payload = json.dumps({
                "v": "1.0",
                "tid": str(self.uuid),
                "tok": self.token_string,
                "sig": self.opaque_signature,
                "dt": str(self.date)
            })
            self.qr_image_base64 = generate_qr_code_base64(opaque_payload)
            
        super().save(*args, **kwargs)

    def is_valid_signature(self):
        booking_id = str(self.slot_booking.uuid) if self.slot_booking else str(self.uuid)
        expected = generate_opaque_signature(self.token_string, booking_id, str(self.date))
        return hmac.compare_digest(self.opaque_signature, expected)

    def __str__(self):
        return f"Token: {self.token_string} ({self.farmer_name}) - {self.status}"


class GatePass(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    gate_pass_number = models.CharField(max_length=50, unique=True)
    qr_token = models.OneToOneField(QRToken, on_delete=models.CASCADE, related_name='gate_pass')
    vehicle_number = models.CharField(max_length=30)
    driver_name = models.CharField(max_length=100)
    security_guard = models.CharField(max_length=100, default='Gate Operator')
    entry_allowed = models.BooleanField(default=True)
    entry_time = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.gate_pass_number:
            self.gate_pass_number = f"GP-MND-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.gate_pass_number} - {self.vehicle_number}"
