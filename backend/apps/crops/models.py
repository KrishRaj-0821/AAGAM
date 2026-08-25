import uuid
from django.db import models
from apps.accounts.models import User

class CropCategory(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    name_hi = models.CharField(max_length=100, blank=True, null=True)
    season = models.CharField(max_length=50, default='Rabi', choices=[('Rabi', 'Rabi'), ('Kharif', 'Kharif'), ('Commercial', 'Commercial'), ('Zaid', 'Zaid')])
    icon = models.CharField(max_length=50, default='Wheat')

    def __str__(self):
        return f"{self.name} ({self.season})"


class Crop(models.Model):
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available for Sale'),
        ('IN_AUCTION', 'In Live Auction'),
        ('RESERVED', 'Reserved'),
        ('SOLD', 'Sold'),
    ]

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crops_declared', null=True, blank=True)
    farmer_name = models.CharField(max_length=150, default='Sardar Harpreet Singh')
    farmer_phone = models.CharField(max_length=20, default='+91 98765 43210')
    category = models.ForeignKey(CropCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='crops')
    crop_name = models.CharField(max_length=150, default='Wheat (Sharbati)')
    crop_hi = models.CharField(max_length=150, blank=True, null=True, default='गेहूं (सरबती)')
    variety = models.CharField(max_length=150, default='HD-3086 Certified')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=180.00)
    unit = models.CharField(max_length=20, default='Quintal')
    expected_price = models.DecimalField(max_digits=10, decimal_places=2, default=2580.00)
    harvest_date = models.DateField(null=True, blank=True)
    available_date = models.DateField(null=True, blank=True)
    quality_grade = models.CharField(max_length=50, default='Grade A')
    moisture_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=11.2)
    location = models.CharField(max_length=150, default='Karnal Central Mandi, Haryana')
    description = models.TextField(blank=True, null=True, default='High-protein certified Sharbati wheat, optical NIR assayed.')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='AVAILABLE')
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.crop_name} - {self.quantity} {self.unit} @ ₹{self.expected_price}"


class CropImage(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='crop_photos/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
