from django.contrib import admin
from .models import Listing, BuyerOffer

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('crop_name', 'farmer_name', 'quantity_quintals', 'expected_price_per_qtl', 'quality_grade', 'status')
    list_filter = ('status', 'quality_grade')

@admin.register(BuyerOffer)
class BuyerOfferAdmin(admin.ModelAdmin):
    list_display = ('listing', 'buyer_name', 'offered_price_per_qtl', 'requested_qty_quintals', 'status')
    list_filter = ('status',)
