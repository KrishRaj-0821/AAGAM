import uuid
from django.db import models
from apps.accounts.models import User

class AuctionStatus(models.TextChoices):
    UPCOMING = 'UPCOMING', 'Upcoming'
    LIVE = 'LIVE', 'Live'
    COMPLETED = 'COMPLETED', 'Completed'
    CANCELLED = 'CANCELLED', 'Cancelled'


class Auction(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    auction_code = models.CharField(max_length=50, default='LOT-2026-8812')
    crop_name = models.CharField(max_length=150, default='Wheat (Sharbati HD-3086)')
    crop_name_hi = models.CharField(max_length=150, blank=True, null=True, default='गेहूं (सरबती एचडी-3086)')
    variety = models.CharField(max_length=100, default='HD-3086 Certified')
    quality_grade = models.CharField(max_length=50, default='Grade A (Assayed)')
    moisture_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=11.4)
    quantity_mt = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    reserve_price = models.DecimalField(max_digits=10, decimal_places=2, default=2450.00)
    current_highest_bid = models.DecimalField(max_digits=10, decimal_places=2, default=2680.00)
    min_increment = models.DecimalField(max_digits=10, decimal_places=2, default=20.00)
    seller = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='auctions_created')
    seller_name = models.CharField(max_length=150, default='Sardar Balwinder Singh')
    mandi_location = models.CharField(max_length=150, default='Karnal Central APMC')
    district = models.CharField(max_length=100, default='Karnal')
    state = models.CharField(max_length=100, default='Haryana')
    status = models.CharField(max_length=30, choices=AuctionStatus.choices, default=AuctionStatus.LIVE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    total_bids_count = models.PositiveIntegerField(default=14)
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='auctions_won')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.auction_code}: {self.crop_name} ({self.quantity_mt} MT) - ₹{self.current_highest_bid}/Qtl"


class Bid(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    auction = models.ForeignKey(Auction, on_delete=models.CASCADE, related_name='bids')
    bidder = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='placed_bids')
    bidder_name = models.CharField(max_length=150, default='Adani Agri Logistics')
    bidder_company = models.CharField(max_length=150, default='Adani Agri Logistics Ltd')
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_winning = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"₹{self.bid_amount}/Qtl on {self.auction.auction_code} by {self.bidder_name}"
