from django.contrib import admin
from .models import FarmerProfile, LandRecord

@admin.register(FarmerProfile)
class FarmerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'kisan_credit_card', 'total_land_acres', 'bank_account_no', 'dbt_linked')

@admin.register(LandRecord)
class LandRecordAdmin(admin.ModelAdmin):
    list_display = ('khasra_number', 'farmer', 'village', 'district', 'area_acres', 'is_verified')
