import uuid
from django.db import models

class ArrivalForecast(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mandi_name = models.CharField(max_length=150, default='Karnal Central APMC')
    district = models.CharField(max_length=100, default='Karnal')
    state = models.CharField(max_length=100, default='Haryana')
    crop_name = models.CharField(max_length=150, default='Wheat (Sharbati)')
    predicted_arrival_date = models.DateField()
    predicted_volume_mt = models.DecimalField(max_digits=10, decimal_places=2, default=3200.00)
    surge_risk_level = models.CharField(max_length=30, default='HIGH', choices=[('LOW', 'Low Risk'), ('MEDIUM', 'Moderate Flow'), ('HIGH', 'High Surge Alert'), ('CRITICAL', 'Critical Overload')])
    confidence_score = models.DecimalField(max_digits=5, decimal_places=2, default=94.2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.mandi_name} - {self.crop_name} ({self.predicted_arrival_date}): {self.predicted_volume_mt} MT [{self.surge_risk_level}]"


class CongestionAlert(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mandi_name = models.CharField(max_length=150, default='Karnal Central APMC')
    alert_level = models.CharField(max_length=30, default='YELLOW', choices=[('GREEN', 'Smooth Flow'), ('YELLOW', 'Approaching Quota'), ('RED', 'Traffic Stagnation Alert')])
    recommended_action = models.TextField(default='Reroute non-perishable truck arrivals to Gharaunda Sub-Yard Lane 02.')
    is_active = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.mandi_name}: Alert {self.alert_level}"
