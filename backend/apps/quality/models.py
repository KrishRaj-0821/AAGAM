import uuid
from django.db import models
from apps.accounts.models import User

class QualityResult(models.TextChoices):
    PASS = 'PASS', 'Pass & Approved for Mandi Procurement'
    FAIL = 'FAIL', 'Fail (Exceeds Tolerance Limits)'
    CONDITIONAL = 'CONDITIONAL', 'Conditional (Price Deduction Applicable)'


class QualityInspection(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inspection_code = models.CharField(max_length=50, unique=True)
    token_number = models.CharField(max_length=50, default='AGM-TK-99482')
    farmer_name = models.CharField(max_length=150, default='Sardar Harpreet Singh')
    crop_name = models.CharField(max_length=150, default='Wheat (Sharbati)')
    mandi_name = models.CharField(max_length=150, default='Karnal Central APMC')

    moisture_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=11.2)
    impurity_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.75)
    foreign_matter_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.60)
    broken_grains_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=1.10)
    quality_grade = models.CharField(max_length=50, default='Grade A')

    result = models.CharField(max_length=30, choices=QualityResult.choices, default=QualityResult.PASS)
    remarks = models.TextField(default='Sample exceeds FAQ standard specifications. Optimal luster and dry weight.')
    inspector = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='quality_inspections')
    inspector_name = models.CharField(max_length=150, default='Dr. R. K. Sharma (Chief Quality Assayer)')
    lab_equipment_id = models.CharField(max_length=50, default='NIR-OPTICAL-LAB-04')
    tested_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.inspection_code:
            self.inspection_code = f"QA-CERT-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.inspection_code} - {self.crop_name} ({self.farmer_name}): {self.result} [{self.quality_grade}]"


class AIQualityAnalysis(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    analysis_code = models.CharField(max_length=50, unique=True)
    crop_image = models.ImageField(upload_to='ai_quality_scans/', blank=True, null=True)
    crop_image_url = models.URLField(blank=True, null=True)
    crop_name = models.CharField(max_length=150, default='Wheat (Sharbati)')
    quality_score = models.DecimalField(max_digits=5, decimal_places=2, default=94.50)
    estimated_moisture = models.DecimalField(max_digits=5, decimal_places=2, default=11.10)
    defect_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=1.20)
    foreign_matter_estimate = models.DecimalField(max_digits=5, decimal_places=2, default=0.70)
    confidence_score = models.DecimalField(max_digits=5, decimal_places=2, default=99.20)
    is_preliminary = models.BooleanField(default=True)
    ai_verdict = models.CharField(max_length=100, default='Preliminary Grade A (Optimal Dry Kernel Density)')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.analysis_code:
            self.analysis_code = f"AI-SCAN-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.analysis_code} - Score: {self.quality_score}% (Confidence: {self.confidence_score}%)"
