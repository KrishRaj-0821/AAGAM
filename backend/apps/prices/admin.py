from django.contrib import admin
from .models import MSPPrice, MarketPrice, PriceHistory

@admin.register(MSPPrice)
class MSPPriceAdmin(admin.ModelAdmin):
    list_display = ('crop_name', 'season', 'year', 'msp_rate', 'bonus_rate')

@admin.register(MarketPrice)
class MarketPriceAdmin(admin.ModelAdmin):
    list_display = ('crop_name', 'mandi_name', 'district', 'state', 'modal_rate', 'msp_price', 'trend')
    list_filter = ('state', 'trend')

@admin.register(PriceHistory)
class PriceHistoryAdmin(admin.ModelAdmin):
    list_display = ('crop_name', 'mandi_name', 'date', 'modal_price')
