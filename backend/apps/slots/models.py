import uuid
from django.db import models
from apps.accounts.models import User
from apps.centers.models import ProcurementCenter

class SlotBookingStatus(models.TextChoices):
    BOOKED = 'BOOKED', 'Booked'
    CONFIRMED = 'CONFIRMED', 'Confirmed'
    EN_ROUTE = 'EN_ROUTE', 'En Route'
    ARRIVED = 'ARRIVED', 'Arrived at Gate'
    WEIGHMENT = 'WEIGHMENT', 'At Weighbridge'
    INSPECTION = 'INSPECTION', 'Quality Inspection'
    UNLOADING = 'UNLOADING', 'Unloading'
    COMPLETED = 'COMPLETED', 'Completed'
    CANCELLED = 'CANCELLED', 'Cancelled'


class Slot(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    center = models.ForeignKey(ProcurementCenter, on_delete=models.CASCADE, related_name='slots')
    date = models.DateField()
    time_slot = models.CharField(max_length=50, default='09:00 AM - 11:00 AM')
    lane = models.CharField(max_length=100, default='Lane 04 - Weighbridge A')
    max_capacity_quintals = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    booked_quintals = models.DecimalField(max_digits=10, decimal_places=2, default=180.00)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.center.name} ({self.date} {self.time_slot}) - {self.lane}"


class SlotBooking(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    token_number = models.CharField(max_length=50, unique=True)
    farmer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='slot_bookings_made')
    farmer_name = models.CharField(max_length=150, default='Sardar Harpreet Singh')
    farmer_phone = models.CharField(max_length=20, default='+91 98765 43210')
    center = models.ForeignKey(ProcurementCenter, on_delete=models.SET_NULL, null=True, blank=True, related_name='center_bookings')
    mandi_name = models.CharField(max_length=150, default='Karnal Central Grain Yard')
    state = models.CharField(max_length=100, default='Haryana')
    district = models.CharField(max_length=100, default='Karnal')
    commodity = models.CharField(max_length=150, default='Wheat (Sharbati)')
    custom_commodity = models.CharField(max_length=150, blank=True, null=True)
    is_custom_crop = models.BooleanField(default=False)
    quantity_quintals = models.DecimalField(max_digits=10, decimal_places=2, default=180.00)
    booking_date = models.DateField()
    time_slot = models.CharField(max_length=50, default='09:00 AM - 11:00 AM')
    lane = models.CharField(max_length=100, default='Lane 04 - Weighbridge A')
    vehicle_number = models.CharField(max_length=30, default='HR-05-AB-7821')
    driver_name = models.CharField(max_length=100, default='Harpreet Singh')
    status = models.CharField(max_length=30, choices=SlotBookingStatus.choices, default=SlotBookingStatus.BOOKED)
    qr_code_data = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.token_number:
            self.token_number = f"AGM-TK-{uuid.uuid4().hex[:6].upper()}"
        if not self.qr_code_data:
            self.qr_code_data = f"AAGAM-PASS|{self.token_number}|{self.mandi_name}|{self.commodity}|{self.quantity_quintals}QTL|{self.booking_date}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.token_number} - {self.farmer_name} - {self.commodity} ({self.status})"
