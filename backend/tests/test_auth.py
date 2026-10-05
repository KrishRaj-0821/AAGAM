from datetime import timedelta
from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework.test import APIClient
from rest_framework import status

from apps.accounts.models import PhoneOTP, UserRole

User = get_user_model()

class AuthSecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.phone = "9876543210"
        self.user = User.objects.create_user(
            email="farmer_test@aagam.gov.in",
            password="testpassword123",
            full_name="Harpreet Singh",
            phone=f"+91 {self.phone}",
            role=UserRole.FARMER,
            state="Punjab",
            district="Ludhiana",
            mandi="Khanna Grain Market"
        )

    def test_successful_otp_verification_issues_jwt(self):
        """Authoritative backend OTP generation and verification issues genuine JWT."""
        otp_record, raw_otp = PhoneOTP.create_otp(self.phone, expiry_minutes=5)
        
        response = self.client.post('/api/auth/verify-otp/', {
            'phone': self.phone,
            'otp': raw_otp
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data['data'])
        self.assertIn('refresh', response.data['data'])
        self.assertEqual(response.data['data']['user']['email'], self.user.email)
        
        # Verify OTP record is marked consumed and cannot be reused
        otp_record.refresh_from_db()
        self.assertTrue(otp_record.is_verified)
        self.assertTrue(otp_record.is_consumed)

    def test_wrong_otp_rejected(self):
        """Supplying incorrect OTP fails with 400 Bad Request."""
        PhoneOTP.create_otp(self.phone, expiry_minutes=5)
        
        response = self.client.post('/api/auth/verify-otp/', {
            'phone': self.phone,
            'otp': '000000'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Invalid OTP', response.data['message'])

    def test_expired_otp_rejected(self):
        """Expired OTP cannot be verified."""
        otp_record, raw_otp = PhoneOTP.create_otp(self.phone, expiry_minutes=5)
        # Fast-forward past expiration
        otp_record.expires_at = timezone.now() - timedelta(minutes=1)
        otp_record.save()

        response = self.client.post('/api/auth/verify-otp/', {
            'phone': self.phone,
            'otp': raw_otp
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('expired', response.data['message'].lower())

    def test_reused_otp_rejected(self):
        """OTP cannot be reused after successful verification (Replay Protection)."""
        _, raw_otp = PhoneOTP.create_otp(self.phone, expiry_minutes=5)
        
        # First verification succeeds
        res1 = self.client.post('/api/auth/verify-otp/', {'phone': self.phone, 'otp': raw_otp})
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        
        # Second verification with identical OTP must fail
        res2 = self.client.post('/api/auth/verify-otp/', {'phone': self.phone, 'otp': raw_otp})
        self.assertEqual(res2.status_code, status.HTTP_400_BAD_REQUEST)

    def test_otp_bruteforce_max_attempts_lockout(self):
        """Exceeding 3 failed verification attempts locks out the OTP."""
        _, raw_otp = PhoneOTP.create_otp(self.phone, expiry_minutes=5)
        
        for i in range(3):
            res = self.client.post('/api/auth/verify-otp/', {'phone': self.phone, 'otp': '111111'})
            self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Even if 4th attempt supplies the correct OTP, it must be rejected due to lockout
        res_correct = self.client.post('/api/auth/verify-otp/', {'phone': self.phone, 'otp': raw_otp})
        self.assertEqual(res_correct.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('maximum verification attempts exceeded', res_correct.data['message'].lower())

    def test_request_otp_rate_limiting(self):
        """More than 3 requests in 10 minutes returns 429 Too Many Requests."""
        for _ in range(3):
            res = self.client.post('/api/auth/request-otp/', {'phone': self.phone})
            self.assertEqual(res.status_code, status.HTTP_200_OK)

        # 4th request must be rate limited
        res4 = self.client.post('/api/auth/request-otp/', {'phone': self.phone})
        self.assertEqual(res4.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    def test_unregistered_phone_rejected_from_request_otp(self):
        """Unregistered mobile numbers are rejected from receiving OTP."""
        response = self.client.post('/api/auth/request-otp/', {'phone': '9111111111'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_password_reset_requires_signed_token(self):
        """Password reset strictly rejects requests without a verified reset token."""
        # 1. Attempt reset with just email + password (no token) -> Rejected
        res_no_token = self.client.post('/api/auth/reset-password/', {
            'email': self.user.email,
            'new_password': 'newpassword456'
        })
        self.assertEqual(res_no_token.status_code, status.HTTP_400_BAD_REQUEST)

        # 2. Generate valid token
        token = default_token_generator.make_token(self.user)
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))

        # 3. Reset with valid token -> Accepted
        res_valid = self.client.post('/api/auth/reset-password/', {
            'uid': uid,
            'token': token,
            'new_password': 'newpassword456'
        })
        self.assertEqual(res_valid.status_code, status.HTTP_200_OK)

        # 4. Verify user can log in with new password
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword456'))
