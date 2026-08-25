from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from common.responses import success_response, error_response
from .models import User
from .serializers import UserSerializer, UserRegisterSerializer, CustomTokenObtainPairSerializer

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return error_response("Invalid email or password", errors=getattr(e, 'detail', str(e)), status_code=status.HTTP_401_UNAUTHORIZED)
        return success_response(serializer.validated_data, message="Login successful")


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Registration failed", errors=serializer.errors)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return success_response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        }, message="Registration successful", status_code=status.HTTP_201_CREATED)


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

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
        return error_response("Profile update failed", errors=serializer.errors)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        if not request.user.check_password(old_password):
            return error_response("Current password is incorrect")
        request.user.set_password(new_password)
        request.user.save()
        return success_response(message="Password changed successfully")


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        return success_response({
            "email": email,
            "reset_token": "DEMO-RESET-TOKEN-8842"
        }, message="Password reset instructions sent to email / mobile")


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')
        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            return success_response(message="Password reset successfully")
        except User.DoesNotExist:
            return error_response("User not found")
