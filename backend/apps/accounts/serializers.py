from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, UserRole

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'uuid', 'full_name', 'email', 'phone', 'aadhaar_number', 'role',
            'is_verified', 'is_active', 'state', 'district', 'mandi',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['uuid', 'created_at', 'updated_at']


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, default='aagam@2026')

    class Meta:
        model = User
        fields = ['full_name', 'email', 'phone', 'password', 'role', 'state', 'district', 'mandi', 'aadhaar_number']

    def create(self, validated_data):
        password = validated_data.pop('password', 'aagam@2026')
        email = validated_data.pop('email')
        user = User.objects.create_user(
            email=email,
            password=password,
            **validated_data
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        return {
            "access": data['access'],
            "refresh": data['refresh'],
            "user": {
                "uuid": str(self.user.uuid),
                "full_name": self.user.full_name or self.user.username,
                "email": self.user.email,
                "phone": self.user.phone,
                "role": self.user.role,
                "state": self.user.state,
                "district": self.user.district,
                "mandi": self.user.mandi
            }
        }
