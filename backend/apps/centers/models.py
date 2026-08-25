import uuid
from django.db import models
from apps.accounts.models import User

class ProcurementCenter(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    name_hi = models.CharField(max_length=150, blank=True, null=True)
    code = models.CharField(max_length=50, unique=True)
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    address = models.TextField(default='Main APMC Yard')
    officer_in_charge = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_centers')
    daily_capacity_mt = models.DecimalField(max_digits=10, decimal_places=2, default=2500.00)
    operational_status = models.CharField(max_length=30, default='ACTIVE', choices=[('ACTIVE', 'Active & Procuring'), ('MAINTENANCE', 'Under Maintenance'), ('FULL', 'Capacity Full')])
    contact_phone = models.CharField(max_length=20, default='1800-180-1551')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, default=29.6857)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, default=76.9905)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.district}, {self.state}) - {self.code}"


class CenterCapacity(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    center = models.ForeignKey(ProcurementCenter, on_delete=models.CASCADE, related_name='daily_capacities')
    date = models.DateField()
    commodity = models.CharField(max_length=100, default='Wheat')
    total_quota_mt = models.DecimalField(max_digits=10, decimal_places=2, default=3000.00)
    booked_quota_mt = models.DecimalField(max_digits=10, decimal_places=2, default=1840.00)
    procured_today_mt = models.DecimalField(max_digits=10, decimal_places=2, default=1250.00)
    available_slots = models.PositiveIntegerField(default=45)

    def __str__(self):
        return f"{self.center.name} - {self.commodity} ({self.date}): {self.procured_today_mt}/{self.total_quota_mt} MT"
