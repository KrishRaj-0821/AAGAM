import uuid
from django.db import models
from apps.accounts.models import User
from apps.procurement.models import SlotBooking

class QualityGrade(models.TextChoices):
    GRADE_A = 'Grade A', 'Grade A (MSP Premium + Bonus)'
    GRADE_B = 'Grade B', 'Grade B (Standard Fair Average Quality - FAQ)'
    GRADE_C = 'Grade C', 'Grade C (Deductions Applied)'
    REJECTED = 'Rejected', 'Rejected (Exceeds Tolerance Limits)'


class QualityInspection(models.Model):
    inspection_id = models.CharField(max_length=50, primary_key=True)
    slot_booking = models.ForeignKey(SlotBooking, on_delete=models.SET_NULL, null=True, blank=True, related_name='inspections')
    token_no = models.CharField(max_length=50, default='AGM-TK-99482')
    farmer_name = models.CharField(max_length=150, default='Sardar Harpreet Singh')
    crop_name = models.CharField(max_length=150, default='Wheat (Sharbati)')
    mandi_name = models.CharField(max_length=150, default='Karnal Central Yard')

    # Physical & Chemical NIR Lab Parameters
    moisture_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=11.2)
    foreign_matter_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.75)
    broken_grains_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=1.20)
    damaged_weevilled_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.40)
    shriveled_immature_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=1.10)

    # AI Computer Vision & NIR Sensor Metrics
    ai_moisture_estimate = models.DecimalField(max_digits=5, decimal_places=2, default=11.1)
    ai_confidence_score = models.DecimalField(max_digits=5, decimal_places=2, default=99.2)
    ai_grade_prediction = models.CharField(max_length=50, default='Grade A')

    # Final Assay Verdict
    final_grade = models.CharField(max_length=50, choices=QualityGrade.choices, default=QualityGrade.GRADE_A)
    status = models.CharField(max_length=20, default='PASSED', choices=[('PASSED', 'Passed & Certified'), ('REJECTED', 'Rejected'), ('PENDING', 'Under Testing')])
    inspector = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='inspections_performed')
    inspector_name = models.CharField(max_length=150, default='Dr. R. K. Sharma (Senior Quality Chemist)')
    lab_device_id = models.CharField(max_length=50, default='NIR-SPEC-LAB-04')
    remarks = models.TextField(blank=True, null=True, default='Optimal dry grain sample, zero pest infestation detected.')
    tested_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.inspection_id:
            self.inspection_id = f"QA-RPT-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.inspection_id} - {self.crop_name} ({self.farmer_name}): {self.final_grade}"


class TolaParchiWeighment(models.Model):
    parchi_no = models.CharField(max_length=50, primary_key=True)
    slot_booking = models.ForeignKey(SlotBooking, on_delete=models.SET_NULL, null=True, blank=True, related_name='weighments')
    token_no = models.CharField(max_length=50, default='AGM-TK-99482')
    vehicle_number = models.CharField(max_length=30, default='HR-05-AB-7821')
    farmer_name = models.CharField(max_length=150, default='Sardar Harpreet Singh')
    crop_name = models.CharField(max_length=150, default='Wheat (Sharbati)')
    weighbridge_id = models.CharField(max_length=50, default='Dharam Kanta WB-01')
    weighbridge_operator = models.CharField(max_length=150, default='Sunil Kumar (Karnal APMC)')

    gross_weight_kg = models.DecimalField(max_digits=10, decimal_places=2, default=24580.00)
    tare_weight_kg = models.DecimalField(max_digits=10, decimal_places=2, default=6580.00)
    net_weight_kg = models.DecimalField(max_digits=10, decimal_places=2, default=18000.00)
    net_weight_quintals = models.DecimalField(max_digits=10, decimal_places=2, default=180.00)

    gross_time = models.DateTimeField(auto_now_add=True)
    tare_time = models.DateTimeField(null=True, blank=True)
    digital_signature = models.CharField(max_length=100, default='DIGI-SIG-KARNAL-APMC-9942')

    def save(self, *args, **kwargs):
        if not self.parchi_no:
            self.parchi_no = f"TP-WB-{uuid.uuid4().hex[:6].upper()}"
        if self.gross_weight_kg and self.tare_weight_kg:
            self.net_weight_kg = self.gross_weight_kg - self.tare_weight_kg
            self.net_weight_quintals = self.net_weight_kg / 100
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.parchi_no}: Net {self.net_weight_quintals} Qtl ({self.vehicle_number})"


class QualityCertificate(models.Model):
    certificate_id = models.CharField(max_length=50, primary_key=True)
    inspection = models.OneToOneField(QualityInspection, on_delete=models.CASCADE, related_name='certificate')
    qr_hash = models.CharField(max_length=150, default='AAGAM-CERT-VERIFY-882199')
    issued_by = models.CharField(max_length=150, default='Govt of India Agri Quality Directorate')
    issued_date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.certificate_id:
            self.certificate_id = f"CERT-QA-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.certificate_id} for {self.inspection_id}"
