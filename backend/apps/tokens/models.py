import uuid
from django.db import models
from apps.accounts.models import User
from apps.slots.models import SlotBooking
from common.utils import generate_qr_code_base64

class QRToken(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    token_string = models.CharField(max_length=50, unique=True)
    slot_booking = models.ForeignKey(SlotBooking, on_delete=models.SET_NULL, null=True, blank=True, related_name='qr_tokens')
    farmer_name = models.CharField(max_length=150, default='Sardar Harpreet Singh')
    mandi_name = models.CharField(max_length=150, default='Karnal Central APMC')
    crop_name = models.CharField(max_length=150, default='Wheat (Sharbati)')
    quantity_quintals = models.DecimalField(max_digits=10, decimal_places=2, default=180.00)
    date = models.DateField()
    time_slot = models.CharField(max_length=50, default='09:00 AM - 11:00 AM')
    lane = models.CharField(max_length=100, default='Lane 04 - Weighbridge A')
    qr_image_base64 = models.TextField(blank=True, null=True)
    is_used = models.BooleanField(default=False)
    scanned_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.token_string:
            self.token_string = f"AGM-TK-{uuid.uuid4().hex[:6].upper()}"
        if not self.qr_image_base64:
            payload = f"AAGAM-QR|{self.token_string}|{self.farmer_name}|{self.mandi_name}|{self.crop_name}|{self.quantity_quintals}QTL|{self.date}"
            self.qr_image_base64 = generate_qr_code_base64(payload)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Token: {self.token_string} ({self.farmer_name})"


class GatePass(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    gate_pass_number = models.CharField(max_length=50, unique=True)
    qr_token = models.OneToOneField(QRToken, on_delete=models.CASCADE, related_name='gate_pass')
    vehicle_number = models.CharField(max_length=30, default='HR-05-AB-7821')
    driver_name = models.CharField(max_length=100, default='Harpreet Singh')
    security_guard = models.CharField(max_length=100, default='Balwant Singh (Gate 01)')
    entry_allowed = models.BooleanField(default=True)
    entry_time = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.gate_pass_number:
            self.gate_pass_number = f"GP-MND-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.gate_pass_number} - {self.vehicle_number}"
