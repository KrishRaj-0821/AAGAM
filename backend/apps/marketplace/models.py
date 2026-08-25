import uuid
from django.db import models
from apps.accounts.models import User

class Listing(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Active Listing'),
        ('IN_AUCTION', 'Live in E-Auction'),
        ('RESERVED', 'Offer Accepted / Reserved'),
        ('SOLD', 'Sold & Completed'),
    ]

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='marketplace_listings')
    farmer_name = models.CharField(max_length=150, default='Sardar Harpreet Singh')
    farmer_phone = models.CharField(max_length=20, default='+91 98765 43210')
    crop_name = models.CharField(max_length=150, default='Wheat (Sharbati)')
    crop_name_hi = models.CharField(max_length=150, blank=True, null=True, default='गेहूं (सरबती)')
    variety = models.CharField(max_length=150, default='HD-3086 Premium')
    quantity_quintals = models.DecimalField(max_digits=10, decimal_places=2, default=240.00)
    expected_price_per_qtl = models.DecimalField(max_digits=10, decimal_places=2, default=2650.00)
    msp_rate = models.DecimalField(max_digits=10, decimal_places=2, default=2425.00)
    quality_grade = models.CharField(max_length=50, default='Grade A')
    moisture_pct = models.DecimalField(max_digits=5, decimal_places=2, default=11.2)
    foreign_matter_pct = models.DecimalField(max_digits=5, decimal_places=2, default=0.8)
    mandi_location = models.CharField(max_length=150, default='Karnal Central APMC')
    district = models.CharField(max_length=100, default='Karnal')
    state = models.CharField(max_length=100, default='Haryana')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='ACTIVE')
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.crop_name} ({self.quantity_quintals} Qtl) by {self.farmer_name}"


class BuyerOffer(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Farmer Review'),
        ('ACCEPTED', 'Accepted by Farmer'),
        ('REJECTED', 'Rejected'),
        ('EXPIRED', 'Expired'),
    ]

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='offers')
    buyer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='offers_made')
    buyer_name = models.CharField(max_length=150, default='ITC Agri Division')
    buyer_company = models.CharField(max_length=150, default='ITC Agri Ltd')
    buyer_phone = models.CharField(max_length=20, default='+91 99887 76655')
    offered_price_per_qtl = models.DecimalField(max_digits=10, decimal_places=2)
    requested_qty_quintals = models.DecimalField(max_digits=10, decimal_places=2)
    total_offer_value = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING')
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.total_offer_value and self.offered_price_per_qtl and self.requested_qty_quintals:
            self.total_offer_value = self.offered_price_per_qtl * self.requested_qty_quintals
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Offer ₹{self.offered_price_per_qtl}/Qtl on {self.listing.crop_name} by {self.buyer_name}"
