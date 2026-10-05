import jwt
from rest_framework import authentication, exceptions
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import User, UserRole

class FirebaseOrSimpleJWTAuthentication(authentication.BaseAuthentication):
    """
    Dual-mode JWT Authentication backend:
    1. First attempts standard Django SimpleJWT validation.
    2. If token is a Firebase ID Token (JWT), decodes claims and authenticates/maps to Django User.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.simple_jwt_auth = JWTAuthentication()

    def authenticate(self, request):
        header = self.simple_jwt_auth.get_header(request)
        if header is None:
            return None

        raw_token = self.simple_jwt_auth.get_raw_token(header)
        if raw_token is None:
            return None

        # 1. Try standard Django SimpleJWT first
        try:
            validated_token = self.simple_jwt_auth.get_validated_token(raw_token)
            user = self.simple_jwt_auth.get_user(validated_token)
            return (user, validated_token)
        except Exception:
            pass

        # 2. Try Firebase ID Token (JWT)
        try:
            token_str = raw_token.decode('utf-8') if isinstance(raw_token, bytes) else str(raw_token)
            payload = jwt.decode(token_str, options={"verify_signature": False})
            
            firebase_uid = payload.get('sub') or payload.get('user_id')
            email = payload.get('email')
            phone = payload.get('phone_number')
            name = payload.get('name')

            if not firebase_uid and not email and not phone:
                return None

            user = None
            if email:
                user = User.objects.filter(email__iexact=email).first()
            if not user and phone:
                from .views import normalize_phone, find_user_by_phone
                clean_p = normalize_phone(phone)
                if clean_p:
                    user = find_user_by_phone(clean_p)

            if not user:
                fallback_email = email or f"user_{firebase_uid[:8]}@aagam.gov.in"
                user = User.objects.create(
                    email=fallback_email,
                    username=fallback_email,
                    full_name=name or fallback_email.split('@')[0],
                    phone=phone or '',
                    role=UserRole.FARMER,
                    is_active=True,
                    is_verified=True,
                    aadhaar_number='994820194828'
                )
                user.set_unusable_password()
                user.save()

            return (user, token_str)
        except Exception:
            return None
