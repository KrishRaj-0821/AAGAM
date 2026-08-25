import uuid
from django.db import models

class MSPPrice(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    crop_code = models.CharField(max_length=50, unique=True)
    crop_name = models.CharField(max_length=150)
    crop_name_hi = models.CharField(max_length=150, blank=True, null=True)
    season = models.CharField(max_length=50, default='Rabi')
    year = models.CharField(max_length=20, default='2025-2026')
    msp_rate = models.DecimalField(max_digits=10, decimal_places=2)
    bonus_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    standard_moisture_limit = models.DecimalField(max_digits=5, decimal_places=2, default=12.0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.crop_name} ({self.year}) - MSP: ₹{self.msp_rate}"


class MarketPrice(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    crop_name = models.CharField(max_length=150)
    crop_name_hi = models.CharField(max_length=150, blank=True, null=True)
    variety = models.CharField(max_length=150, default='Standard FAQ')
    mandi_name = models.CharField(max_length=150)
    mandi_name_hi = models.CharField(max_length=150, blank=True, null=True)
    district = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    msp_price = models.DecimalField(max_digits=10, decimal_places=2)
    min_rate = models.DecimalField(max_digits=10, decimal_places=2)
    max_rate = models.DecimalField(max_digits=10, decimal_places=2)
    modal_rate = models.DecimalField(max_digits=10, decimal_places=2)
    open_market_rate = models.DecimalField(max_digits=10, decimal_places=2)
    highest_offer = models.DecimalField(max_digits=10, decimal_places=2)
    recommended_price = models.DecimalField(max_digits=10, decimal_places=2)
    arrivals_today = models.CharField(max_length=50, default='1,420 MT')
    status_tag = models.CharField(max_length=100, default='ABOVE MSP')
    trend = models.CharField(max_length=10, default='up', choices=[('up', 'Upward'), ('down', 'Downward'), ('stable', 'Stable')])
    date = models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.crop_name} @ {self.mandi_name}: ₹{self.modal_rate}"


class PriceHistory(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    crop_name = models.CharField(max_length=150)
    mandi_name = models.CharField(max_length=150)
    date = models.DateField()
    modal_price = models.DecimalField(max_digits=10, decimal_places=2)
    msp_price = models.DecimalField(max_digits=10, decimal_places=2)
    volume_mt = models.DecimalField(max_digits=10, decimal_places=2, default=500.0)

    def __str__(self):
        return f"{self.crop_name} on {self.date}: ₹{self.modal_price}"
