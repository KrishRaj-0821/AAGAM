from django.test import TestCase
from django.conf import settings
from rest_framework.test import APIClient
from rest_framework import status

class DeploymentAndHardeningTests(TestCase):
    """
    Test suite for production settings, health check, and default deny security posture.
    """
    def setUp(self):
        self.client = APIClient()

    def test_health_check_operational(self):
        """Production health check responds with HEALTHY and database status."""
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['status'], 'HEALTHY')
        self.assertEqual(response.data['data']['database'], 'CONNECTED')
        self.assertIn('timestamp', response.data['data'])

    def test_cors_wildcard_strictly_disabled(self):
        """Wildcard CORS is strictly disabled in production configuration."""
        self.assertFalse(
            getattr(settings, 'CORS_ALLOW_ALL_ORIGINS', False),
            "CORS_ALLOW_ALL_ORIGINS must be False."
        )

    def test_default_permission_is_authenticated(self):
        """Default permission class is IsAuthenticated (Zero Trust posture)."""
        default_permissions = settings.REST_FRAMEWORK.get('DEFAULT_PERMISSION_CLASSES', ())
        self.assertIn('rest_framework.permissions.IsAuthenticated', default_permissions)

    def test_unauthenticated_request_to_business_api_rejected(self):
        """Unauthenticated requests to business APIs are rejected by default with 401."""
        res_payments = self.client.get('/api/payments/')
        self.assertEqual(res_payments.status_code, status.HTTP_401_UNAUTHORIZED)

        res_operations = self.client.get('/api/operations/gate-entries/')
        self.assertEqual(res_operations.status_code, status.HTTP_401_UNAUTHORIZED)
