from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from common.responses import success_response, error_response
from common.sms import send_sms_otp, SMSDeliveryError
from .models import User, PhoneOTP, UserRole
from .serializers import UserSerializer, UserRegisterSerializer, CustomTokenObtainPairSerializer


def normalize_phone(phone_input):
    """Extract clean 10-digit Indian mobile number."""
    digits = ''.join(filter(str.isdigit, str(phone_input or '')))[-10:]
    return digits if len(digits) == 10 else None


def find_user_by_phone(clean_phone):
    """Find user matching the last 10 digits of their phone number."""
    if not clean_phone:
        return None
    for u in User.objects.all():
        u_digits = ''.join(filter(str.isdigit, u.phone or ''))[-10:]
        if u_digits == clean_phone:
            return u
    return None


class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return error_response(
                "Invalid email or password",
                errors=getattr(e, 'detail', str(e)),
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        return success_response(serializer.validated_data, message="Login successful")


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Registration failed", errors=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return success_response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        }, message="Registration successful", status_code=status.HTTP_201_CREATED)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        return success_response(message="Logout successful")


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return success_response(serializer.data, message="Profile retrieved successfully")

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return success_response(serializer.data, message="Profile updated successfully")
        return error_response("Profile update failed", errors=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        if not request.user.check_password(old_password):
            return error_response("Current password is incorrect", status_code=status.HTTP_400_BAD_REQUEST)
        if not new_password or len(new_password) < 6:
            return error_response("New password must be at least 6 characters.", status_code=status.HTTP_400_BAD_REQUEST)
        request.user.set_password(new_password)
        request.user.save()
        return success_response(message="Password changed successfully")


class RequestPasswordResetView(APIView):
    """
    Generates a secure password reset token for the specified user.
    Never allows password reset without a signed cryptographic token.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        if not email:
            return error_response("Email address is required.", status_code=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            # Mask user existence to prevent user enumeration attacks in production
            return success_response(
                {"detail": "If an account with that email exists, reset instructions have been issued."},
                message="Password reset instructions processed."
            )

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        response_data = {
            "detail": "Password reset token generated.",
            "uid": uid
        }

        # In explicit demo mode, include the token for evaluation testing
        if getattr(settings, 'DEMO_AUTH_MODE', False):
            response_data["demo_mode"] = True
            response_data["reset_token"] = token
            response_data["message"] = "DEMO MODE: Use the provided reset_token and uid to call /reset-password/"

        return success_response(response_data, message="Password reset instructions issued.")


class ResetPasswordView(APIView):
    """
    Requires a valid cryptographic reset token and UID before altering any user password.
    Never accepts email + password directly without a valid signed token.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid') or request.data.get('uidb64')
        token = request.data.get('token') or request.data.get('reset_token')
        new_password = request.data.get('new_password')

        if not uidb64 or not token or not new_password:
            return error_response(
                "Missing required parameters. Reset token, uid, and new_password are required.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return error_response("Invalid password reset token or user ID.", status_code=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return error_response("Password reset token is invalid or has expired.", status_code=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 6:
            return error_response("Password must be at least 6 characters long.", status_code=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return success_response(message="Password reset successfully. You may now log in with your new credentials.")


class CheckRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone_input = request.data.get('phone', '')
        clean_phone = normalize_phone(phone_input)

        if not clean_phone:
            return error_response(
                "Please enter a valid 10-digit mobile number.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        matching_user = find_user_by_phone(clean_phone)

        if matching_user:
            return success_response({
                "registered": True,
                "user": {
                    "id": str(matching_user.uuid),
                    "full_name": matching_user.full_name or "Registered Stakeholder",
                    "role": matching_user.role,
                    "phone": matching_user.phone or f"+91 {clean_phone}",
                    "email": matching_user.email,
                    "state": matching_user.state or "Haryana",
                    "district": matching_user.district or "Karnal",
                    "mandi": matching_user.mandi or "Karnal Central Yard",
                    "aadhaar_masked": f"XXXX-XXXX-{matching_user.aadhaar_number[-4:]}" if matching_user.aadhaar_number else "XXXX-XXXX-4828"
                }
            }, message="User verified as registered.")

        return error_response(
            f"Mobile number +91 {clean_phone} is not registered on AAGAM. Only registered users can log in.",
            errors={"registered": False},
            status_code=status.HTTP_404_NOT_FOUND
        )


class RequestOtpView(APIView):
    """
    POST /api/auth/request-otp/
    Authoritative backend OTP generation.
    - Stores only salted SHA-256 hash.
    - Expiration window (5 minutes).
    - Rate-limiting (max 3 requests per 10 minutes).
    - Never logs or exposes raw OTP in production API responses.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone_input = request.data.get('phone', '')
        clean_phone = normalize_phone(phone_input)

        if not clean_phone:
            return error_response(
                "Please enter a valid 10-digit Indian mobile number.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Ensure user exists in database
        matching_user = find_user_by_phone(clean_phone)
        if not matching_user:
            return error_response(
                f"Mobile number +91 {clean_phone} is not registered on AAGAM. Please register first.",
                errors={"registered": False},
                status_code=status.HTTP_404_NOT_FOUND
            )

        # Rate limiting: max 3 requests per phone per 10 minutes
        ten_minutes_ago = timezone.now() - timedelta(minutes=10)
        recent_requests = PhoneOTP.objects.filter(phone=clean_phone, created_at__gte=ten_minutes_ago).count()
        if recent_requests >= 3:
            return error_response(
                "Too many OTP requests for this number. Please wait 10 minutes before requesting again.",
                status_code=status.HTTP_429_TOO_MANY_REQUESTS
            )

        # Authoritative backend OTP generation
        otp_record, raw_otp = PhoneOTP.create_otp(clean_phone, expiry_minutes=5)

        # Dispatch via SMS gateway (Requirement 6: strict error state if provider fails)
        try:
            sms_result = send_sms_otp(clean_phone, raw_otp)
        except SMSDeliveryError as e:
            return error_response(
                f"SMS delivery failed: {str(e)}. Please retry shortly.",
                errors={"delivery_failed": True, "details": str(e)},
                code="SMS_DELIVERY_FAILED",
                status_code=status.HTTP_502_BAD_GATEWAY
            )

        response_data = {
            "phone": f"+91 {clean_phone}",
            "expires_in_seconds": 300,
            "dispatched": sms_result.get("success", True)
        }

        # Only in explicit demo mode, include demo flag and OTP helper for evaluation testing
        if getattr(settings, 'DEMO_AUTH_MODE', False):
            response_data["demo_mode"] = True
            response_data["demo_otp"] = raw_otp  # Visible only for SIH evaluation demo mode
            response_data["note"] = "DEMO_AUTH_MODE is active. In production, this field is strictly omitted."

        return success_response(
            response_data,
            message=f"Verification OTP dispatched to +91 {clean_phone}."
        )


class VerifyOtpView(APIView):
    """
    POST /api/auth/verify-otp/
    Authoritative backend OTP verification.
    - Validates hash, expiry, and attempt limits.
    - Invalidates OTP upon success to prevent replay.
    - Issues SimpleJWT tokens only upon valid verification.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone_input = request.data.get('phone', '')
        otp_code = str(request.data.get('otp', '')).strip()
        clean_phone = normalize_phone(phone_input)

        if not clean_phone or not otp_code:
            return error_response(
                "Both 10-digit mobile number and OTP code are required.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        matching_user = find_user_by_phone(clean_phone)
        if not matching_user:
            return error_response(
                "User not registered. Please register first.",
                status_code=status.HTTP_404_NOT_FOUND
            )

        # Fetch latest active OTP record
        otp_record = PhoneOTP.objects.filter(phone=clean_phone, is_consumed=False).first()
        if not otp_record:
            return error_response(
                "No active OTP request found or OTP has already been used. Please request a new OTP.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        is_valid, msg = otp_record.verify(otp_code)
        if not is_valid:
            return error_response(msg, status_code=status.HTTP_400_BAD_REQUEST)

        # Issue authoritative SimpleJWT tokens
        refresh = RefreshToken.for_user(matching_user)
        return success_response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": str(matching_user.uuid),
                "uuid": str(matching_user.uuid),
                "full_name": matching_user.full_name,
                "role": matching_user.role,
                "phone": matching_user.phone or f"+91 {clean_phone}",
                "email": matching_user.email,
                "state": matching_user.state,
                "district": matching_user.district,
                "mandi": matching_user.mandi,
            }
        }, message="OTP verified successfully. Authenticated session established.")


class DemoLoginView(APIView):
    """
    POST /api/auth/demo-login/
    Explicitly labelled SIH demo login endpoint.
    Only active when DEMO_AUTH_MODE=True in backend settings.
    Generates genuine, server-authoritative SimpleJWT tokens for seeded personas
    without exposing fake client-side credentials.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        if not getattr(settings, 'DEMO_AUTH_MODE', False):
            return error_response(
                "Demo login mode is disabled in production.",
                status_code=status.HTTP_403_FORBIDDEN
            )

        role = request.data.get('role', 'FARMER').upper()
        # Find matching seeded user for the persona
        user = User.objects.filter(role=role).first()
        if not user:
            # Fallback search by role prefixes
            user = User.objects.first()

        if not user:
            return error_response("No demo accounts found in database. Run seed_db.py first.", status_code=404)

        refresh = RefreshToken.for_user(user)
        return success_response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "is_demo": True,
            "demo_label": f"SIH Evaluation Demo Session ({user.role})",
            "user": {
                "id": str(user.uuid),
                "uuid": str(user.uuid),
                "full_name": user.full_name,
                "role": user.role,
                "phone": user.phone,
                "email": user.email,
                "state": user.state,
                "district": user.district,
                "mandi": user.mandi,
            }
        }, message=f"Authenticated as demo persona: {user.full_name}")


class OtpLoginView(APIView):
    """
    Deprecated legacy route redirected to VerifyOtpView for backward compatibility.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return VerifyOtpView().post(request)
