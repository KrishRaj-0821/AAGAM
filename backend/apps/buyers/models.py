import uuid
from django.db import models
from apps.accounts.models import User

class BuyerProfile(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='buyer_details')
    company_name = models.CharField(max_length=150, default='Adani Agri Logistics Ltd')
    gstin = models.CharField(max_length=20, default='06AAACA1234B1Z5')
    enam_license_no = models.CharField(max_length=50, default='ENAM-LIC-2025-882')
    wallet_balance = models.DecimalField(max_digits=12, decimal_places=2, default=5000000.00)
    verified_buyer = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company_name} ({self.user.full_name})"


class BuyerPurchase(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    order_id = models.CharField(max_length=50, default='ORD-2026-9942')
    crop_name = models.CharField(max_length=150, default='Wheat (Sharbati)')
    seller_name = models.CharField(max_length=150, default='Sardar Balwinder Singh')
    mandi_source = models.CharField(max_length=150, default='Karnal Central APMC')
    quantity_quintals = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    rate_per_qtl = models.DecimalField(max_digits=10, decimal_places=2, default=2680.00)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=1340000.00)
    status = models.CharField(max_length=30, default='IN_TRANSIT', choices=[
        ('PAYMENT_HELD', 'Escrow Payment Deposited'),
        ('IN_TRANSIT', 'Freight In Transit'),
        ('DELIVERED', 'Delivered at Buyer Silo'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order_id} - {self.crop_name} (₹{self.total_amount})"
