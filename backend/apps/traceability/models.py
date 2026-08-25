import uuid
from django.db import models

class TraceabilityStage(models.TextChoices):
    CROP_CREATED = 'CROP_CREATED', 'Crop Harvest Sown & Declared'
    LISTED = 'LISTED', 'Listed in Marketplace'
    OFFER_RECEIVED = 'OFFER_RECEIVED', 'Buyer Offer Received'
    OFFER_ACCEPTED = 'OFFER_ACCEPTED', 'Offer Accepted'
    AUCTION_WON = 'AUCTION_WON', 'E-Auction Won by Trader'
    TRANSPORT_BOOKED = 'TRANSPORT_BOOKED', 'Freight Truck Dispatched'
    GATE_ENTRY = 'GATE_ENTRY', 'QR Gate Pass Verified at Mandi Yard'
    WEIGHMENT = 'WEIGHMENT', 'Tola Parchi Weighment Completed'
    QUALITY_APPROVED = 'QUALITY_APPROVED', 'NIR Quality Grade A Certified'
    WAREHOUSE_STORED = 'WAREHOUSE_STORED', 'Stored in CWC Silo Complex'
    PAYMENT_INITIATED = 'PAYMENT_INITIATED', 'DBT Payment Disbursed via PFMS'
    PAYMENT_COMPLETED = 'PAYMENT_COMPLETED', 'Credited to Farmer Bank Account'


class CropTraceability(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    batch_id = models.CharField(max_length=50, default='BATCH-WHT-2026-9912')
    crop_name = models.CharField(max_length=150, default='Wheat (Sharbati HD-3086)')
    farmer_name = models.CharField(max_length=150, default='Sardar Harpreet Singh')
    stage = models.CharField(max_length=50, choices=TraceabilityStage.choices, default=TraceabilityStage.PAYMENT_COMPLETED)
    location = models.CharField(max_length=150, default='Karnal Central APMC / PNB Bank')
    details = models.TextField(default='DBT ₹4,36,500 transferred to account ending in 1829. UTR: RBI056984210992')
    verified_by = models.CharField(max_length=150, default='Govt of India Agri Stack')
    blockchain_hash = models.CharField(max_length=100, default='0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.batch_id} - {self.stage} ({self.crop_name})"
