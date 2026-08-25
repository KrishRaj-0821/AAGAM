import uuid
from django.db import models
from apps.accounts.models import User

class LogisticsProviderProfile(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='logistics_profile')
    fleet_name = models.CharField(max_length=150, default='Kisan Freight Carrier Network')
    fleet_size = models.PositiveIntegerField(default=45)
    license_number = models.CharField(max_length=50, default='AGRI-LOG-LIC-9982')
    service_states = models.CharField(max_length=200, default='Haryana, Punjab, Rajasthan, Uttar Pradesh')
    contact_phone = models.CharField(max_length=20, default='+91 94160 55421')
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.8)

    def __str__(self):
        return f"{self.fleet_name} ({self.user.full_name})"


class Driver(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150, default='Baldev Singh')
    phone = models.CharField(max_length=20, default='+91 94160 55421')
    license_number = models.CharField(max_length=50, default='DL-05201948210')
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.phone})"


class Vehicle(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle_number = models.CharField(max_length=30, unique=True, default='HR-05-AB-7821')
    vehicle_type = models.CharField(max_length=50, default='10-Wheeler Heavy Truck (25 MT)')
    capacity_mt = models.DecimalField(max_digits=8, decimal_places=2, default=25.00)
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_vehicles')
    current_location = models.CharField(max_length=150, default='Karnal GT Road')
    current_latitude = models.DecimalField(max_digits=9, decimal_places=6, default=29.6857)
    current_longitude = models.DecimalField(max_digits=9, decimal_places=6, default=76.9905)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.vehicle_number} ({self.vehicle_type})"


class TransportRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Assignment'),
        ('ASSIGNED', 'Assigned'),
        ('IN_TRANSIT', 'In Transit'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request_code = models.CharField(max_length=50, unique=True)
    requester = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='transport_requests')
    commodity = models.CharField(max_length=150, default='Wheat (Grade A FAQ)')
    quantity_mt = models.DecimalField(max_digits=10, decimal_places=2, default=25.00)
    pickup_location = models.CharField(max_length=150, default='Karnal Central APMC Yard')
    destination = models.CharField(max_length=150, default='Central Warehousing Corp (CWC) Silo 04, Panipat')
    estimated_fare = models.DecimalField(max_digits=10, decimal_places=2, default=8500.00)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='IN_TRANSIT')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.request_code:
            self.request_code = f"TRQ-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.request_code} - {self.commodity} ({self.quantity_mt} MT)"


class TransportBooking(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking_code = models.CharField(max_length=50, unique=True)
    request = models.OneToOneField(TransportRequest, on_delete=models.CASCADE, related_name='booking')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True)
    driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True, blank=True)
    pickup_time = models.DateTimeField(null=True, blank=True)
    delivery_eta = models.CharField(max_length=100, default='Today, 04:30 PM')
    gps_status = models.CharField(max_length=150, default='Moving along NH-44 towards Panipat')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.booking_code:
            self.booking_code = f"TBK-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking_code} for {self.request.request_code}"
