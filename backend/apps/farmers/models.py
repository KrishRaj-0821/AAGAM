import uuid
from django.db import models
from apps.accounts.models import User

class FarmerProfile(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farmer_details')
    kisan_credit_card = models.CharField(max_length=50, blank=True, null=True, default='KCC-HR-998241')
    total_land_acres = models.DecimalField(max_digits=6, decimal_places=2, default=5.5)
    soil_health_card_id = models.CharField(max_length=50, blank=True, null=True, default='SHC-2025-4120')
    bank_account_no = models.CharField(max_length=30, default='982100341829')
    bank_ifsc = models.CharField(max_length=20, default='PUNB0021400')
    bank_name = models.CharField(max_length=100, default='Punjab National Bank')
    dbt_linked = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Farmer: {self.user.full_name}"


class LandRecord(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='land_records')
    khasra_number = models.CharField(max_length=50, default='412/18')
    khatauni_number = models.CharField(max_length=50, default='094-KH')
    village = models.CharField(max_length=100, default='Gharaunda')
    tehsil = models.CharField(max_length=100, default='Karnal')
    district = models.CharField(max_length=100, default='Karnal')
    state = models.CharField(max_length=100, default='Haryana')
    area_acres = models.DecimalField(max_digits=6, decimal_places=2, default=3.2)
    soil_type = models.CharField(max_length=50, default='Alluvial Loam')
    irrigation_source = models.CharField(max_length=50, default='Tube Well & Canal')
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Khasra {self.khasra_number} - {self.village}, {self.district} ({self.area_acres} Acres)"
