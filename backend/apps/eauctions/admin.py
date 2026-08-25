from django.contrib import admin
from .models import AuctionLot, AuctionBid, AwardedContract

@admin.register(AuctionLot)
class AuctionLotAdmin(admin.ModelAdmin):
    list_display = ('lot_id', 'crop_name', 'total_quantity_mt', 'current_highest_bid', 'status', 'total_bids_count', 'mandi_location')
    list_filter = ('status', 'state', 'quality_grade')
    search_fields = ('lot_id', 'crop_name', 'seller_name', 'mandi_location')

@admin.register(AuctionBid)
class AuctionBidAdmin(admin.ModelAdmin):
    list_display = ('bid_id', 'auction_lot', 'bidder_name', 'bidder_company', 'bid_amount_per_qtl', 'created_at')
    list_filter = ('is_winning_bid',)
    search_fields = ('bid_id', 'bidder_name', 'bidder_company')

@admin.register(AwardedContract)
class AwardedContractAdmin(admin.ModelAdmin):
    list_display = ('contract_id', 'auction_lot', 'buyer', 'seller', 'total_contract_value', 'escrow_status', 'delivery_status')
    list_filter = ('escrow_status', 'delivery_status')
