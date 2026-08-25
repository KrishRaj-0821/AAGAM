import uuid
from django.db import models
from apps.accounts.models import User

class PaymentStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending Approval'
    PROCESSING = 'PROCESSING', 'Processing via PFMS'
    COMPLETED = 'COMPLETED', 'Completed & Credited'
    FAILED = 'FAILED', 'Failed'


class PaymentMethod(models.TextChoices):
    DBT = 'DBT', 'Direct Benefit Transfer (NPCI Aadhaar Bridge)'
    PFMS = 'PFMS', 'Public Financial Management System'
    BANK_TRANSFER = 'BANK_TRANSFER', 'NEFT / RTGS Bank Transfer'
    UPI = 'UPI', 'UPI Mandi Instant'


class Payment(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment_id = models.CharField(max_length=50, unique=True)
    recipient = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments_received')
    recipient_name = models.CharField(max_length=150, default='Sardar Harpreet Singh')
    recipient_phone = models.CharField(max_length=20, default='+91 98765 43210')
    recipient_aadhaar = models.CharField(max_length=20, default='XXXX-XXXX-4821')
    bank_account = models.CharField(max_length=30, default='982100341829')
    bank_ifsc = models.CharField(max_length=20, default='PUNB0021400')
    bank_name = models.CharField(max_length=100, default='Punjab National Bank')

    commodity = models.CharField(max_length=150, default='Wheat (Sharbati Grade A)')
    quantity_quintals = models.DecimalField(max_digits=10, decimal_places=2, default=180.00)
    rate_per_qtl = models.DecimalField(max_digits=10, decimal_places=2, default=2425.00)
    gross_amount = models.DecimalField(max_digits=12, decimal_places=2, default=436500.00)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    net_payout_amount = models.DecimalField(max_digits=12, decimal_places=2, default=436500.00)

    payment_method = models.CharField(max_length=30, choices=PaymentMethod.choices, default=PaymentMethod.DBT)
    status = models.CharField(max_length=30, choices=PaymentStatus.choices, default=PaymentStatus.COMPLETED)
    utr_number = models.CharField(max_length=50, default='RBI056984210992')
    pfms_ref_no = models.CharField(max_length=50, default='PFMS-AGRI-2026-99418')
    disbursed_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.payment_id:
            self.payment_id = f"DBT-PAY-{uuid.uuid4().hex[:8].upper()}"
        if not self.net_payout_amount and self.quantity_quintals and self.rate_per_qtl:
            self.gross_amount = self.quantity_quintals * self.rate_per_qtl
            self.net_payout_amount = self.gross_amount - (self.deductions or 0)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.payment_id} - ₹{self.net_payout_amount} to {self.recipient_name} ({self.status})"
