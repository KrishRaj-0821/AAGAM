import uuid
from decimal import Decimal
from django.db import models
from apps.accounts.models import User
from apps.centers.models import ProcurementCenter
from common.utils import generate_random_token

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
    booked_quintals = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_available = models.BooleanField(default=True)

    class Meta:
        ordering = ['date', 'time_slot']
        constraints = [
            models.CheckConstraint(
                condition=models.Q(booked_quintals__lte=models.F('max_capacity_quintals')),
                name='slot_capacity_not_exceeded'
            ),
            models.CheckConstraint(
                condition=models.Q(booked_quintals__gte=0),
                name='slot_booked_non_negative'
            ),
        ]

    @property
    def remaining_capacity(self):
        return max(Decimal('0.00'), self.max_capacity_quintals - self.booked_quintals)

    def __str__(self):
        return f"{self.center.name} ({self.date} {self.time_slot}) - {self.lane} [{self.booked_quintals}/{self.max_capacity_quintals} QTL]"


class SlotBooking(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    token_number = models.CharField(max_length=50, unique=True, db_index=True)
    idempotency_key = models.CharField(max_length=128, unique=True, null=True, blank=True, db_index=True)
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='slot_bookings_made')
    slot = models.ForeignKey(Slot, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    farmer_name = models.CharField(max_length=150)
    farmer_phone = models.CharField(max_length=20)
    center = models.ForeignKey(ProcurementCenter, on_delete=models.SET_NULL, null=True, blank=True, related_name='center_bookings')
    mandi_name = models.CharField(max_length=150)
    state = models.CharField(max_length=100, default='Haryana')
    district = models.CharField(max_length=100, default='Karnal')
    commodity = models.CharField(max_length=150, default='Wheat (Sharbati)')
    custom_commodity = models.CharField(max_length=150, blank=True, null=True)
    is_custom_crop = models.BooleanField(default=False)
    quantity_quintals = models.DecimalField(max_digits=10, decimal_places=2)
    booking_date = models.DateField()
    time_slot = models.CharField(max_length=50, default='09:00 AM - 11:00 AM')
    lane = models.CharField(max_length=100, default='Lane 04 - Weighbridge A')
    vehicle_number = models.CharField(max_length=30)
    driver_name = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=30, choices=SlotBookingStatus.choices, default=SlotBookingStatus.BOOKED)
    idempotency_fingerprint = models.CharField(max_length=64, blank=True, null=True, db_index=True)
    qr_code_data = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['farmer', 'booking_date', 'commodity'],
                condition=models.Q(status=SlotBookingStatus.CONFIRMED),
                name='unique_active_farmer_booking_date_commodity'
            )
        ]

    def save(self, *args, **kwargs):
        if not self.token_number:
            self.token_number = generate_random_token(self.booking_date)
        if not self.driver_name and self.farmer_name:
            self.driver_name = self.farmer_name
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.token_number} - {self.farmer_name} - {self.commodity} ({self.status})"
