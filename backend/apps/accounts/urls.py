from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView,
    RegisterView,
    LogoutView,
    ProfileView,
    ChangePasswordView,
    RequestPasswordResetView,
    ResetPasswordView,
    CheckRegistrationView,
    RequestOtpView,
    VerifyOtpView,
    DemoLoginView,
    OtpLoginView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='auth_profile'),
    path('change-password/', ChangePasswordView.as_view(), name='auth_change_password'),
    
    # Secure Password Reset Flow (P0-11)
    path('forgot-password/', RequestPasswordResetView.as_view(), name='auth_forgot_password'),
    path('request-password-reset/', RequestPasswordResetView.as_view(), name='auth_request_password_reset'),
    path('reset-password/', ResetPasswordView.as_view(), name='auth_reset_password'),
    
    # Authoritative Backend OTP Authentication (P0-1)
    path('check-registration/', CheckRegistrationView.as_view(), name='auth_check_registration'),
    path('request-otp/', RequestOtpView.as_view(), name='auth_request_otp'),
    path('verify-otp/', VerifyOtpView.as_view(), name='auth_verify_otp'),
    path('demo-login/', DemoLoginView.as_view(), name='auth_demo_login'),
    path('otp-login/', OtpLoginView.as_view(), name='auth_otp_login'),
]
