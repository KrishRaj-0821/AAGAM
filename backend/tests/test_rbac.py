from decimal import Decimal
from datetime import timedelta
from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from apps.accounts.models import UserRole
from apps.centers.models import ProcurementCenter
from apps.slots.models import SlotBooking, SlotBookingStatus
from apps.tokens.models import QRToken, QRTokenStatus

User = get_user_model()

class RoleBasedAccessControlTests(TestCase):
    """
    Test suite for server-enforced Role-Based Access Control (P0-9).
    Never relies on frontend role claims; strictly validates authenticated JWT & user record.
    """
    def setUp(self):
        self.today = timezone.localdate() if hasattr(timezone, 'localdate') else timezone.now().date()

        self.center_a = ProcurementCenter.objects.create(
            name="Karnal APMC Hub",
            code="MND-A",
            state="Haryana",
            district="Karnal",
            operational_status="ACTIVE"
        )
        self.center_b = ProcurementCenter.objects.create(
            name="Khanna Grain Yard",
            code="MND-B",
            state="Punjab",
            district="Ludhiana",
            operational_status="ACTIVE"
        )

        # Farmer A
        self.farmer_a = User.objects.create_user(
            email="farmer_a@aagam.gov.in",
            password="password",
            full_name="Farmer A",
            phone="+91 98000 11111",
            role=UserRole.FARMER
        )
        self.client_farmer_a = APIClient()
        self.client_farmer_a.force_authenticate(user=self.farmer_a)

        # Farmer B
        self.farmer_b = User.objects.create_user(
            email="farmer_b@aagam.gov.in",
            password="password",
            full_name="Farmer B",
            phone="+91 98000 22222",
            role=UserRole.FARMER
        )
        self.client_farmer_b = APIClient()
        self.client_farmer_b.force_authenticate(user=self.farmer_b)

        # Operator A
        self.operator_a = User.objects.create_user(
            email="op_a@aagam.gov.in",
            password="password",
            full_name="Operator A",
            phone="+91 98000 33333",
            role=UserRole.CENTER_OPERATOR,
            mandi="Karnal APMC Hub"
        )
        self.client_operator_a = APIClient()
        self.client_operator_a.force_authenticate(user=self.operator_a)

        # Booking for Farmer B
        self.booking_b = SlotBooking.objects.create(
            token_number="TK-FARM-B-01",
            farmer=self.farmer_b,
            farmer_name="Farmer B",
            farmer_phone="+91 98000 22222",
            center=self.center_b,
            mandi_name=self.center_b.name,
            commodity="Wheat",
            quantity_quintals=Decimal("30.00"),
            booking_date=self.today,
            status=SlotBookingStatus.CONFIRMED
        )
        self.token_b = QRToken.objects.create(
            token_string="TK-FARM-B-01",
            slot_booking=self.booking_b,
            center=self.center_b,
            farmer_name="Farmer B",
            mandi_name=self.center_b.name,
            crop_name="Wheat",
            quantity_quintals=Decimal("30.00"),
            date=self.today,
            status=QRTokenStatus.ISSUED
        )

    def test_unauthenticated_booking_rejected(self):
        """Anonymous / unauthenticated users cannot book slots."""
        anonymous_client = APIClient()
        res = anonymous_client.post('/api/slots/book/', {
            'center_id': self.center_a.code,
            'booking_date': str(self.today + timedelta(days=1)),
            'quantity_quintals': '10.00'
        })
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_qr_scanning_rejected(self):
        """Anonymous / unauthenticated users cannot scan QR tokens."""
        anonymous_client = APIClient()
        res = anonymous_client.post('/api/tokens/scan/', {'token': self.token_b.token_string})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_farmer_cannot_call_operator_endpoint(self):
        """A Farmer account attempting to call Center Operator scan endpoint is denied with 403."""
        res = self.client_farmer_a.post('/api/tokens/scan/', {'token': self.token_b.token_string})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_farmer_cannot_cancel_another_farmer_booking(self):
        """Farmer A cannot cancel Farmer B's booking."""
        res = self.client_farmer_a.post(f'/api/slots/{self.booking_b.pk}/cancel/')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_farmer_cannot_view_another_farmer_bookings(self):
        """Farmer A querying bookings only sees their own, never Farmer B's."""
        res = self.client_farmer_a.get('/api/slots/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # Should contain 0 items since Farmer A has no bookings
        self.assertEqual(len(res.data['data']), 0)

    def test_operator_cannot_scan_unassigned_center_token(self):
        """Operator A (assigned to Karnal APMC Hub) cannot scan Token B (designated for Khanna Grain Yard)."""
        res = self.client_operator_a.post('/api/tokens/scan/', {'token': self.token_b.token_string})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('designated for center', res.data['message'])
