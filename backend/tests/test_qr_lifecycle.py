import threading
from decimal import Decimal
from datetime import timedelta
from django.test import TransactionTestCase
from django.utils import timezone
from django.db import close_old_connections
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from apps.accounts.models import UserRole
from apps.centers.models import ProcurementCenter
from apps.slots.models import SlotBooking, SlotBookingStatus
from apps.tokens.models import QRToken, QRTokenStatus, GatePass
from apps.operations.models import GateEntry

User = get_user_model()

class QRLifecycleAndReplayTests(TransactionTestCase):
    """
    Test suite for QR Token lifecycle state machine and replay attack protection (P0-8).
    State machine: ISSUED -> SCANNED -> USED.
    Duplicate/replay scans must strictly yield 409 Conflict.
    """
    def setUp(self):
        self.today = timezone.localdate() if hasattr(timezone, 'localdate') else timezone.now().date()
        
        # Procurement Center
        self.center = ProcurementCenter.objects.create(
            name="Karnal Central APMC",
            code="MND-HR-001",
            state="Haryana",
            district="Karnal",
            operational_status="ACTIVE"
        )
        self.other_center = ProcurementCenter.objects.create(
            name="Khanna Grain Market Yard A",
            code="MND-PB-002",
            state="Punjab",
            district="Ludhiana",
            operational_status="ACTIVE"
        )

        # Center Operator
        self.operator = User.objects.create_user(
            email="operator_test@aagam.gov.in",
            password="testpassword123",
            full_name="Amit Kumar",
            phone="+91 98230 44918",
            role=UserRole.CENTER_OPERATOR,
            mandi="Karnal Central APMC"
        )
        self.operator_client = APIClient()
        self.operator_client.force_authenticate(user=self.operator)

        # Farmer
        self.farmer = User.objects.create_user(
            email="farmer_qr@aagam.gov.in",
            password="testpassword123",
            full_name="Harpreet Singh",
            phone="+91 98765 43210",
            role=UserRole.FARMER
        )

        # Valid Booking & QR Token
        self.booking = SlotBooking.objects.create(
            token_number="AGM-TK-TEST01",
            farmer=self.farmer,
            farmer_name="Harpreet Singh",
            farmer_phone="+91 98765 43210",
            center=self.center,
            mandi_name=self.center.name,
            commodity="Wheat",
            quantity_quintals=Decimal("50.00"),
            booking_date=self.today,
            time_slot="09:00 AM - 11:00 AM",
            lane="Lane 01",
            vehicle_number="HR-05-AB-7821",
            status=SlotBookingStatus.CONFIRMED
        )
        self.qr_token = QRToken.objects.create(
            token_string="AGM-TK-TEST01",
            slot_booking=self.booking,
            center=self.center,
            farmer_name="Harpreet Singh",
            mandi_name=self.center.name,
            crop_name="Wheat",
            quantity_quintals=Decimal("50.00"),
            date=self.today,
            time_slot="09:00 AM - 11:00 AM",
            lane="Lane 01",
            status=QRTokenStatus.ISSUED
        )

    def test_valid_token_scan_grants_access(self):
        """First scan of a valid token transitions state to USED and grants entry."""
        response = self.operator_client.post('/api/tokens/scan/', {
            'token': self.qr_token.token_string,
            'vehicle_number': 'HR-05-AB-7821'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['data']['access_granted'])
        self.assertEqual(response.data['data']['status'], 'USED')

        # Verify database state machine transition: ISSUED -> USED
        self.qr_token.refresh_from_db()
        self.assertEqual(self.qr_token.status, QRTokenStatus.USED)
        self.assertTrue(self.qr_token.is_used)
        self.assertIsNotNone(self.qr_token.used_at)

        # Verify GatePass and GateEntry created
        self.assertTrue(GatePass.objects.filter(qr_token=self.qr_token).exists())
        self.assertTrue(GateEntry.objects.filter(qr_token=self.qr_token, status='ADMITTED').exists())

    def test_already_used_token_rejected_with_409_conflict(self):
        """Scanning a token that has already been used must result in 409 Conflict."""
        # First scan
        res1 = self.operator_client.post('/api/tokens/scan/', {'token': self.qr_token.token_string})
        self.assertEqual(res1.status_code, status.HTTP_200_OK)

        # Second scan attempt (Replay attack or duplicate entry)
        res2 = self.operator_client.post('/api/tokens/scan/', {'token': self.qr_token.token_string})
        self.assertEqual(res2.status_code, status.HTTP_409_CONFLICT)
        self.assertIn('already been used', res2.data['message'])

    def test_expired_token_rejected(self):
        """Scanning an expired token is rejected with 400 Bad Request."""
        self.qr_token.expires_at = timezone.now() - timedelta(minutes=10)
        self.qr_token.save()

        response = self.operator_client.post('/api/tokens/scan/', {'token': self.qr_token.token_string})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('expired', response.data['message'].lower())

    def test_cancelled_booking_token_rejected(self):
        """Scanning a token whose slot booking was cancelled is rejected."""
        self.booking.status = SlotBookingStatus.CANCELLED
        self.booking.save()
        self.qr_token.status = QRTokenStatus.CANCELLED
        self.qr_token.save()

        response = self.operator_client.post('/api/tokens/scan/', {'token': self.qr_token.token_string})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('cancelled', response.data['message'].lower())

    def test_wrong_center_scan_rejected(self):
        """Operator assigned to Karnal cannot admit tokens designated for Khanna."""
        khanna_token = QRToken.objects.create(
            token_string="AGM-TK-KHANNA-99",
            center=self.other_center,
            farmer_name="Baljit Singh",
            mandi_name=self.other_center.name,
            crop_name="Wheat",
            quantity_quintals=Decimal("50.00"),
            date=self.today,
            status=QRTokenStatus.ISSUED
        )

        response = self.operator_client.post('/api/tokens/scan/', {'token': khanna_token.token_string})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('designated for center', response.data['message'])

    def test_wrong_date_future_scan_rejected(self):
        """Tokens scheduled for future dates cannot be admitted today."""
        future_token = QRToken.objects.create(
            token_string="AGM-TK-FUTURE-01",
            center=self.center,
            farmer_name="Harpreet Singh",
            mandi_name=self.center.name,
            crop_name="Wheat",
            quantity_quintals=Decimal("50.00"),
            date=self.today + timedelta(days=2),
            status=QRTokenStatus.ISSUED
        )

        response = self.operator_client.post('/api/tokens/scan/', {'token': future_token.token_string})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('future date', response.data['message'].lower())

    def test_invalid_token_string_rejected(self):
        """Supplying a non-existent token string returns 404 Not Found."""
        response = self.operator_client.post('/api/tokens/scan/', {'token': 'INVALID-NON-EXISTENT'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_simultaneous_duplicate_scan_race_condition(self):
        """
        Two operators scanning the exact same token at the exact same moment:
        Row lock (select_for_update) inside atomic transaction guarantees
        exactly one receives 200 OK and entry allowed, while the other receives 409 Conflict.
        """
        race_booking = SlotBooking.objects.create(
            token_number="AGM-TK-RACE-01",
            farmer=self.farmer,
            farmer_name="Harpreet Singh",
            farmer_phone="+91 98765 43210",
            center=self.center,
            mandi_name=self.center.name,
            commodity="Mustard",
            quantity_quintals=Decimal("50.00"),
            booking_date=self.today,
            time_slot="09:00 AM - 11:00 AM",
            lane="Lane 01",
            vehicle_number="HR-05-AB-7821",
            status=SlotBookingStatus.CONFIRMED
        )
        race_token = QRToken.objects.create(
            token_string="AGM-TK-RACE-01",
            slot_booking=race_booking,
            center=self.center,
            farmer_name="Harpreet Singh",
            mandi_name=self.center.name,
            crop_name="Wheat",
            quantity_quintals=Decimal("50.00"),
            date=self.today,
            time_slot="09:00 AM - 11:00 AM",
            lane="Lane 01",
            status=QRTokenStatus.ISSUED
        )

        results = []
        lock = threading.Lock()

        def scan_worker(worker_id):
            close_old_connections()
            client = APIClient()
            client.force_authenticate(user=self.operator)
            import time
            for attempt in range(15):
                try:
                    res = client.post('/api/tokens/scan/', {'token': race_token.token_string})
                    with lock:
                        results.append(res.status_code)
                    break
                except Exception as e:
                    if "locked" in str(e).lower() and attempt < 14:
                        time.sleep(0.06 * (attempt + 1))
                        continue
                    raise
            close_old_connections()

        t1 = threading.Thread(target=scan_worker, args=(1,))
        t2 = threading.Thread(target=scan_worker, args=(2,))

        t1.start()
        import time
        time.sleep(0.04)
        t2.start()
        t1.join()
        t2.join()

        self.assertIn(status.HTTP_200_OK, results)
        self.assertIn(status.HTTP_409_CONFLICT, results)
        self.assertEqual(len(results), 2)
