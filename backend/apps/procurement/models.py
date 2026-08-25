import uuid
from django.db import models
from apps.accounts.models import User

class MandiCenter(models.Model):
    id = models.CharField(max_length=50, primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    name_hi = models.CharField(max_length=150, blank=True, null=True)
    code = models.CharField(max_length=30, unique=True)
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    daily_capacity_mt = models.DecimalField(max_digits=10, decimal_places=2, default=2500.00)
    operating_hours = models.CharField(max_length=50, default='08:00 AM - 07:00 PM')
    contact_phone = models.CharField(max_length=20, default='1800-180-1551')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.district}, {self.state}) - {self.code}"


class SlotStatus(models.TextChoices):
    BOOKED = 'BOOKED', 'Booked'
    EN_ROUTE = 'EN_ROUTE', 'En Route'
    ARRIVED = 'ARRIVED', 'Arrived at Mandi Gate'
    WEIGHMENT = 'WEIGHMENT', 'At Weighbridge'
    INSPECTION = 'INSPECTION', 'Quality Assay'
    UNLOADING = 'UNLOADING', 'Unloading at Silo'
    COMPLETED = 'COMPLETED', 'Completed & Discharged'
    CANCELLED = 'CANCELLED', 'Cancelled'


class SlotBooking(models.Model):
    token_no = models.CharField(max_length=50, primary_key=True)
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='slot_bookings', null=True, blank=True)
    farmer_name = models.CharField(max_length=150, default='Sardar Harpreet Singh')
    farmer_phone = models.CharField(max_length=20, default='+91 98765 43210')
    mandi_center = models.ForeignKey(MandiCenter, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    mandi_name = models.CharField(max_length=150, default='Karnal Central Grain Yard')
    state = models.CharField(max_length=100, default='Haryana')
    district = models.CharField(max_length=100, default='Karnal')
    commodity = models.CharField(max_length=150, default='Wheat (Sharbati)')
    custom_commodity = models.CharField(max_length=150, blank=True, null=True)
    is_custom_crop = models.BooleanField(default=False)
    estimated_qty_quintals = models.DecimalField(max_digits=10, decimal_places=2, default=180.00)
    actual_qty_quintals = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    booking_date = models.DateField()
    time_slot = models.CharField(max_length=50, default='09:00 AM - 11:00 AM')
    lane = models.CharField(max_length=100, default='Lane 04 - Weighbridge A')
    status = models.CharField(max_length=30, choices=SlotStatus.choices, default=SlotStatus.BOOKED)
    vehicle_number = models.CharField(max_length=30, default='HR-05-AB-7821')
    driver_name = models.CharField(max_length=100, default='Harpreet Singh')
    qr_code_data = models.TextField(blank=True, null=True)
    gate_entry_time = models.DateTimeField(null=True, blank=True)
    completed_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.token_no:
            self.token_no = f"AGM-TK-{uuid.uuid4().hex[:6].upper()}"
        if not self.qr_code_data:
            self.qr_code_data = f"AAGAM-GATE-PASS|TOKEN:{self.token_no}|MANDI:{self.mandi_name}|CROP:{self.commodity}|QTY:{self.estimated_qty_quintals}QTL|DATE:{self.booking_date}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.token_no} - {self.farmer_name} - {self.commodity} ({self.status})"


class PriorityVehicleQueue(models.Model):
    PRIORITY_CHOICES = [
        ('NORMAL', 'Normal Farmer Queue'),
        ('FAST_TRACK', 'Pre-Booked Fast Track'),
        ('PERISHABLE', 'Perishable / Priority Crop'),
    ]

    slot_booking = models.OneToOneField(SlotBooking, on_delete=models.CASCADE, related_name='queue_entry')
    queue_number = models.PositiveIntegerField(default=1)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='FAST_TRACK')
    weighbridge_assigned = models.CharField(max_length=50, default='WB-01')
    entry_scanned_at = models.DateTimeField(auto_now_add=True)
    estimated_wait_minutes = models.PositiveIntegerField(default=12)

    def __str__(self):
        return f"Q#{self.queue_number} - {self.slot_booking.token_no} ({self.priority})"


class DailyProcurementQuota(models.Model):
    mandi_center = models.ForeignKey(MandiCenter, on_delete=models.CASCADE, related_name='daily_quotas')
    date = models.DateField()
    commodity = models.CharField(max_length=100, default='Wheat')
    total_capacity_mt = models.DecimalField(max_digits=10, decimal_places=2, default=3000.00)
    booked_mt = models.DecimalField(max_digits=10, decimal_places=2, default=1840.00)
    procured_today_mt = models.DecimalField(max_digits=10, decimal_places=2, default=1250.00)

    class Meta:
        unique_together = ('mandi_center', 'date', 'commodity')

    def __str__(self):
        return f"{self.mandi_center.name} - {self.commodity} ({self.date}): {self.procured_today_mt}/{self.total_capacity_mt} MT"
