from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payment_id', 'recipient_name', 'commodity', 'quantity_quintals', 'net_payout_amount', 'utr_number', 'status')
    list_filter = ('status', 'payment_method')
    search_fields = ('payment_id', 'recipient_name', 'utr_number', 'bank_account')
