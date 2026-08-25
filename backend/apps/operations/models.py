import uuid
from django.db import models
from apps.tokens.models import QRToken

class GateEntry(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    entry_number = models.CharField(max_length=50, unique=True)
    qr_token = models.ForeignKey(QRToken, on_delete=models.SET_NULL, null=True, blank=True, related_name='gate_entries')
    token_string = models.CharField(max_length=50, default='AGM-TK-99482')
    vehicle_number = models.CharField(max_length=30, default='HR-05-AB-7821')
    driver_name = models.CharField(max_length=100, default='Harpreet Singh')
    mandi_name = models.CharField(max_length=150, default='Karnal Central APMC')
    gate_lane = models.CharField(max_length=50, default='Gate 01 - Heavy Lane')
    operator_name = models.CharField(max_length=100, default='Ramesh Chand (Operator)')
    status = models.CharField(max_length=30, default='ADMITTED', choices=[('ADMITTED', 'Admitted to Yard'), ('REJECTED', 'Entry Denied'), ('EXITED', 'Discharged')])
    entry_timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.entry_number:
            self.entry_number = f"GEN-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.entry_number} - {self.vehicle_number} ({self.status})"


class WeighmentSlip(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tola_parchi_number = models.CharField(max_length=50, unique=True)
    gate_entry = models.ForeignKey(GateEntry, on_delete=models.SET_NULL, null=True, blank=True, related_name='slips')
    token_string = models.CharField(max_length=50, default='AGM-TK-99482')
    farmer_name = models.CharField(max_length=150, default='Sardar Harpreet Singh')
    commodity = models.CharField(max_length=150, default='Wheat (Sharbati)')
    vehicle_number = models.CharField(max_length=30, default='HR-05-AB-7821')
    weighbridge_name = models.CharField(max_length=100, default='Dharam Kanta WB-01 (Karnal)')
    operator_name = models.CharField(max_length=100, default='Sunil Kumar')

    gross_weight_kg = models.DecimalField(max_digits=10, decimal_places=2, default=24580.00)
    tare_weight_kg = models.DecimalField(max_digits=10, decimal_places=2, default=6580.00)
    net_weight_kg = models.DecimalField(max_digits=10, decimal_places=2, default=18000.00)
    net_weight_quintals = models.DecimalField(max_digits=10, decimal_places=2, default=180.00)

    gross_time = models.DateTimeField(auto_now_add=True)
    tare_time = models.DateTimeField(null=True, blank=True)
    is_verified = models.BooleanField(default=True)
    digital_signature = models.CharField(max_length=150, default='DIGI-WEIGH-KARNAL-APMC-9942')

    def save(self, *args, **kwargs):
        if not self.tola_parchi_number:
            self.tola_parchi_number = f"TP-WB-{uuid.uuid4().hex[:6].upper()}"
        if self.gross_weight_kg and self.tare_weight_kg:
            self.net_weight_kg = self.gross_weight_kg - self.tare_weight_kg
            self.net_weight_quintals = self.net_weight_kg / 100
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.tola_parchi_number}: Net {self.net_weight_quintals} Qtl ({self.farmer_name})"
