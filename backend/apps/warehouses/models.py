import uuid
from django.db import models
from apps.accounts.models import User

class Warehouse(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150, default='CWC Regional Silo Complex 04')
    code = models.CharField(max_length=50, unique=True, default='CWC-PNP-04')
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_warehouses')
    manager_name = models.CharField(max_length=150, default='V. K. Aggarwal (Warehouse Superintendent)')
    state = models.CharField(max_length=100, default='Haryana')
    district = models.CharField(max_length=100, default='Panipat')
    location_address = models.TextField(default='Sector 25 Phase II, Industrial Area, Panipat')
    total_capacity_mt = models.DecimalField(max_digits=12, decimal_places=2, default=50000.00)
    current_stock_mt = models.DecimalField(max_digits=12, decimal_places=2, default=38420.00)
    available_capacity_mt = models.DecimalField(max_digits=12, decimal_places=2, default=11580.00)
    temperature_celsius = models.DecimalField(max_digits=4, decimal_places=1, default=21.4)
    relative_humidity_pct = models.DecimalField(max_digits=4, decimal_places=1, default=58.2)
    silos_count = models.PositiveIntegerField(default=12)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.total_capacity_mt and self.current_stock_mt:
            self.available_capacity_mt = self.total_capacity_mt - self.current_stock_mt
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.code}) - {self.current_stock_mt}/{self.total_capacity_mt} MT"


class Inventory(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='inventory_items')
    commodity = models.CharField(max_length=150, default='Wheat (Grade A FAQ)')
    silo_number = models.CharField(max_length=50, default='Silo B-03')
    quantity_stored_mt = models.DecimalField(max_digits=10, decimal_places=2, default=4500.00)
    quality_grade = models.CharField(max_length=50, default='Grade A')
    moisture_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=11.2)
    last_fumigation_date = models.DateField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.commodity} in {self.silo_number} ({self.quantity_stored_mt} MT)"


class StockMovement(models.Model):
    MOVEMENT_TYPES = [
        ('STOCK_IN', 'Stock In (Procurement Arrival)'),
        ('STOCK_OUT', 'Stock Out (PDS / Buyer Dispatch)'),
        ('TRANSFER', 'Inter-Warehouse Transfer'),
    ]

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    movement_id = models.CharField(max_length=50, unique=True)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='stock_movements')
    movement_type = models.CharField(max_length=30, choices=MOVEMENT_TYPES, default='STOCK_IN')
    commodity = models.CharField(max_length=150, default='Wheat (Grade A)')
    quantity_mt = models.DecimalField(max_digits=10, decimal_places=2, default=25.00)
    source_mandi_or_hub = models.CharField(max_length=150, default='Karnal Central APMC')
    destination_hub = models.CharField(max_length=150, default='CWC Panipat Silo 04')
    truck_number = models.CharField(max_length=30, default='HR-05-AB-7821')
    grn_receipt_number = models.CharField(max_length=50, default='GRN-2026-99120')
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.movement_id:
            self.movement_id = f"STK-MOV-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.movement_id}: {self.movement_type} {self.quantity_mt} MT ({self.commodity})"
