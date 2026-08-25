from django.contrib import admin
from .models import Auction, Bid

@admin.register(Auction)
class AuctionAdmin(admin.ModelAdmin):
    list_display = ('auction_code', 'crop_name', 'quantity_mt', 'current_highest_bid', 'status', 'total_bids_count')
    list_filter = ('status',)

@admin.register(Bid)
class BidAdmin(admin.ModelAdmin):
    list_display = ('auction', 'bidder_name', 'bid_amount', 'is_winning', 'created_at')
