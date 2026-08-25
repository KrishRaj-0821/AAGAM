import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects = UserManager()

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        if not self.full_name and self.first_name:
            self.full_name = f"{self.first_name} {self.last_name}".strip()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} ({self.email}) - {self.role}"
