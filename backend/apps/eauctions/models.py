import uuid
from django.db import models
from apps.accounts.models import User

class AuctionStatus(models.TextChoices):
    UPCOMING = 'UPCOMING', 'Upcoming Auction'
    LIVE = 'LIVE', 'Live Active Bidding'
    AWARDED = 'AWARDED', 'Awarded to Highest Bidder'
    EXPIRED = 'EXPIRED', 'Expired / Reserve Not Met'
    CANCELLED = 'CANCELLED', 'Cancelled'


class AuctionLot(models.Model):
    lot_id = models.CharField(max_length=50, primary_key=True)
    crop_name = models.CharField(max_length=150, default='Wheat (Sharbati HD-3086)')
    crop_hi = models.CharField(max_length=150, blank=True, null=True, default='गेहूं (सरबती एचडी-3086)')
    variety = models.CharField(max_length=100, default='HD-3086 Certified')
    quality_grade = models.CharField(max_length=50, default='Grade A (Assayed)')
    moisture_pct = models.DecimalField(max_digits=5, decimal_places=2, default=11.4)
    total_quantity_mt = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    reserve_price_per_qtl = models.DecimalField(max_digits=10, decimal_places=2, default=2450.00)
    current_highest_bid = models.DecimalField(max_digits=10, decimal_places=2, default=2680.00)
    min_increment = models.DecimalField(max_digits=10, decimal_places=2, default=20.00)
    seller = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='auction_lots')
    seller_name = models.CharField(max_length=150, default='Sardar Balwinder Singh')
    mandi_location = models.CharField(max_length=150, default='Karnal Central APMC')
    district = models.CharField(max_length=100, default='Karnal')
    state = models.CharField(max_length=100, default='Haryana')
    status = models.CharField(max_length=30, choices=AuctionStatus.choices, default=AuctionStatus.LIVE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    total_bids_count = models.PositiveIntegerField(default=0)
    winning_bidder = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_auctions')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.lot_id:
            self.lot_id = f"LOT-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.lot_id}: {self.crop_name} ({self.total_quantity_mt} MT) - ₹{self.current_highest_bid}/Qtl [{self.status}]"


class AuctionBid(models.Model):
    bid_id = models.CharField(max_length=50, primary_key=True)
    auction_lot = models.ForeignKey(AuctionLot, on_delete=models.CASCADE, related_name='bids')
    bidder = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bids_placed', null=True, blank=True)
    bidder_name = models.CharField(max_length=150, default='Adani Agri Logistics')
    bidder_company = models.CharField(max_length=150, default='Adani Agri Logistics Ltd')
    bid_amount_per_qtl = models.DecimalField(max_digits=10, decimal_places=2)
    is_winning_bid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.bid_id:
            self.bid_id = f"BID-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.bid_id} - Lot: {self.auction_lot_id} - ₹{self.bid_amount_per_qtl}/Qtl by {self.bidder_name}"


class AwardedContract(models.Model):
    contract_id = models.CharField(max_length=50, primary_key=True)
    auction_lot = models.OneToOneField(AuctionLot, on_delete=models.CASCADE, related_name='contract')
    winning_bid = models.ForeignKey(AuctionBid, on_delete=models.CASCADE)
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contracts_as_buyer')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contracts_as_seller')
    total_quantity_mt = models.DecimalField(max_digits=10, decimal_places=2)
    final_rate_per_qtl = models.DecimalField(max_digits=10, decimal_places=2)
    total_contract_value = models.DecimalField(max_digits=12, decimal_places=2)
    escrow_status = models.CharField(max_length=30, default='HELD', choices=[
        ('HELD', 'Escrow Payment Deposited & Held'),
        ('DISBURSED', 'Disbursed to Farmer'),
        ('REFUNDED', 'Refunded'),
    ])
    delivery_status = models.CharField(max_length=30, default='PENDING', choices=[
        ('PENDING', 'Pending Mandi Pickup'),
        ('IN_TRANSIT', 'In Transit via AAGAM Freight'),
        ('DELIVERED', 'Delivered at Buyer Warehouse'),
    ])
    contract_date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.contract_id:
            self.contract_id = f"CTR-{uuid.uuid4().hex[:6].upper()}"
        if not self.total_contract_value and self.total_quantity_mt and self.final_rate_per_qtl:
            # 1 MT = 10 Quintals
            self.total_contract_value = self.total_quantity_mt * 10 * self.final_rate_per_qtl
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.contract_id} - {self.auction_lot.crop_name} - ₹{self.total_contract_value}"
