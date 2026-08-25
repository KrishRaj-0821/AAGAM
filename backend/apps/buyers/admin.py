from django.contrib import admin
from .models import BuyerProfile, BuyerPurchase

@admin.register(BuyerProfile)
class BuyerProfileAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'user', 'gstin', 'enam_license_no', 'wallet_balance', 'verified_buyer')

@admin.register(BuyerPurchase)
class BuyerPurchaseAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'buyer', 'crop_name', 'quantity_quintals', 'rate_per_qtl', 'total_amount', 'status')
