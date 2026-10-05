import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from common.validators import validate_aadhaar_verhoeff

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'SUPER_ADMIN')
        return self.create_user(email, password, **extra_fields)


class UserRole(models.TextChoices):
    FARMER = 'FARMER', 'Farmer'
    BUYER = 'BUYER', 'Buyer'
    OFFICER = 'OFFICER', 'Procurement Officer'
    CENTER_OPERATOR = 'CENTER_OPERATOR', 'Center Operator'
    QUALITY_INSPECTOR = 'QUALITY_INSPECTOR', 'Quality Inspector'
    LOGISTICS_PROVIDER = 'LOGISTICS_PROVIDER', 'Logistics Provider'
    WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER', 'Warehouse Manager'
    ADMIN = 'ADMIN', 'Administrator'
    SUPER_ADMIN = 'SUPER_ADMIN', 'Super Administrator'


class User(AbstractUser):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=50, choices=UserRole.choices, default=UserRole.FARMER)
    is_verified = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    state = models.CharField(max_length=100, default='Haryana')
    district = models.CharField(max_length=100, default='Karnal')
    mandi = models.CharField(max_length=150, blank=True, null=True)
    aadhaar_number = models.CharField(
        max_length=20, 
        blank=True, 
        null=True, 
        validators=[validate_aadhaar_verhoeff],
        help_text="12-digit UIDAI Aadhaar number validated with Verhoeff algorithm"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects = UserManager()

    def clean(self):
        super().clean()
        if self.aadhaar_number:
            validate_aadhaar_verhoeff(self.aadhaar_number)

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        if not self.full_name and self.first_name:
            self.full_name = f"{self.first_name} {self.last_name}".strip()
        if self.aadhaar_number:
            self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} ({self.email}) - {self.role}"


class PhoneOTP(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(max_length=20, db_index=True)
    otp_hash = models.CharField(max_length=128)
    salt = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    attempts = models.PositiveIntegerField(default=0)
    max_attempts = models.PositiveIntegerField(default=3)
    is_verified = models.BooleanField(default=False)
    is_consumed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    @classmethod
    def create_otp(cls, phone, expiry_minutes=5):
        import secrets
        import hashlib
        from datetime import timedelta
        from django.utils import timezone

        # Invalidate any existing unconsumed OTPs for this phone
        cls.objects.filter(phone=phone, is_consumed=False).update(is_consumed=True)

        raw_otp = f"{secrets.randbelow(900000) + 100000:06d}"
        salt = secrets.token_hex(16)
        hasher = hashlib.sha256()
        hasher.update(f"{raw_otp}{salt}".encode('utf-8'))
        otp_hash = hasher.hexdigest()

        instance = cls.objects.create(
            phone=phone,
            otp_hash=otp_hash,
            salt=salt,
            expires_at=timezone.now() + timedelta(minutes=expiry_minutes),
            max_attempts=3
        )
        return instance, raw_otp

    def verify(self, candidate_otp):
        import secrets
        import hashlib
        from django.utils import timezone

        if self.is_consumed:
            return False, "OTP has already been used or invalidated."
        if timezone.now() > self.expires_at:
            self.is_consumed = True
            self.save(update_fields=['is_consumed'])
            return False, "OTP has expired. Please request a new OTP."
        if self.attempts >= self.max_attempts:
            self.is_consumed = True
            self.save(update_fields=['is_consumed'])
            return False, "Maximum verification attempts exceeded. Please request a new OTP."

        self.attempts += 1

        hasher = hashlib.sha256()
        hasher.update(f"{candidate_otp}{self.salt}".encode('utf-8'))
        computed_hash = hasher.hexdigest()

        if secrets.compare_digest(computed_hash, self.otp_hash):
            self.is_verified = True
            self.is_consumed = True
            self.save(update_fields=['attempts', 'is_verified', 'is_consumed'])
            return True, "OTP verified successfully."
        else:
            self.save(update_fields=['attempts'])
            remaining = max(0, self.max_attempts - self.attempts)
            return False, f"Invalid OTP. {remaining} attempt(s) remaining."
