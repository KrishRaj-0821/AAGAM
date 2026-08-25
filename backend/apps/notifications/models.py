import uuid
from django.db import models
from apps.accounts.models import User

class NotificationType(models.TextChoices):
    SLOT = 'SLOT', 'Slot Booking'
    TOKEN = 'TOKEN', 'Gate Pass Token'
    OFFER = 'OFFER', 'Marketplace Offer'
    AUCTION = 'AUCTION', 'Live E-Auction'
    QUALITY = 'QUALITY', 'Quality Assay'
    LOGISTICS = 'LOGISTICS', 'Freight Logistics'
    PAYMENT = 'PAYMENT', 'DBT Payment'
    SYSTEM = 'SYSTEM', 'System Alert'


class Notification(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    notification_type = models.CharField(max_length=30, choices=NotificationType.choices, default=NotificationType.SYSTEM)
    title = models.CharField(max_length=200)
    title_hi = models.CharField(max_length=200, blank=True, null=True)
    message = models.TextField()
    message_hi = models.TextField(blank=True, null=True)
    link = models.CharField(max_length=200, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.notification_type}] {self.title} ({'Read' if self.is_read else 'Unread'})"
