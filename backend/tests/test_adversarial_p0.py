import json
import uuid
from decimal import Decimal
from datetime import timedelta
from unittest.mock import patch

from django.test import TestCase
from django.utils import timezone
from django.conf import settings
from rest_framework.test import APIClient
from rest_framework import status

from apps.accounts.models import User, UserRole, PhoneOTP
from apps.centers.models import ProcurementCenter
from apps.slots.models import Slot, SlotBooking, SlotBookingStatus
from apps.tokens.models import QRToken, QRTokenStatus, generate_opaque_signature
from common.sms import SMSDeliveryError, send_sms_otp


class IdempotencyAdversarialTests(TestCase):
    """
    Requirement 3: Idempotency Adversarial Test
    - Request A: Idempotency-Key = XYZ, quantity = 10 -> 201 Created
    - Request B: Idempotency-Key = XYZ, quantity = 10 -> 200 OK, same booking returned
    - Request C: Idempotency-Key = XYZ, quantity = 50 -> 409 Conflict,
      reason: IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST
    """
    def setUp(self):
        self.farmer = User.objects.create_user(
            email="farmer_idem@example.com",
            phone="+919876543210",
            role=UserRole.FARMER,
            full_name="Ramesh Kumar"
        )
        self.center = ProcurementCenter.objects.create(
            name="Ambala City Yard",
            code="AMB-01",
            state="Haryana",
            district="Ambala",
            daily_capacity_mt=Decimal("500.00"),
            operational_status="ACTIVE"
        )
        self.target_date = timezone.localdate() + timedelta(days=2)
        self.client = APIClient()
        self.client.force_authenticate(user=self.farmer)

    def test_idempotency_payload_integrity(self):
        idem_key = f"IDEM-KEY-{uuid.uuid4()}"
        base_payload = {
            "center_id": str(self.center.uuid),
            "booking_date": str(self.target_date),
            "commodity": "Wheat (Sharbati)",
            "time_slot": "09:00 AM - 11:00 AM",
            "lane": "Lane 01",
            "quantity_quintals": "10.00",
            "vehicle_number": "HR-01-AB-1234",
            "driver_name": "Ramesh Kumar"
        }

        # Request A: Initial booking
        res_a = self.client.post(
            "/api/slots/book/",
            base_payload,
            format="json",
            HTTP_IDEMPOTENCY_KEY=idem_key
        )
        self.assertEqual(res_a.status_code, status.HTTP_201_CREATED, res_a.data)
        booking_id_a = res_a.data['data']['uuid']

        # Request B: Identical replay with same Idempotency-Key and same quantity = 10
        res_b = self.client.post(
            "/api/slots/book/",
            base_payload,
            format="json",
            HTTP_IDEMPOTENCY_KEY=idem_key
        )
        self.assertEqual(res_b.status_code, status.HTTP_200_OK, res_b.data)
        self.assertEqual(res_b.data['data']['uuid'], booking_id_a)
        self.assertIn("Idempotent request", res_b.data.get('message', ''))

        # Request C: Tampered replay with same Idempotency-Key but different quantity = 50
        tampered_payload = dict(base_payload)
        tampered_payload["quantity_quintals"] = "50.00"
        res_c = self.client.post(
            "/api/slots/book/",
            tampered_payload,
            format="json",
            HTTP_IDEMPOTENCY_KEY=idem_key
        )
        self.assertEqual(res_c.status_code, status.HTTP_409_CONFLICT, res_c.data)
        self.assertEqual(res_c.data.get('code'), "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST")


class SameFarmerMultiDeviceTests(TestCase):
    """
    Requirement 4: Same Farmer Multi-Device Test
    A farmer must not receive two active bookings for the same procurement date & commodity.
    - Device A: Farmer F, Slot S, Idempotency-Key A -> 201 Created
    - Device B: Farmer F, Slot S, Idempotency-Key B -> 409 Conflict
    - Cancellation allows re-booking.
    """
    def setUp(self):
        self.farmer = User.objects.create_user(
            email="farmer_md@example.com",
            phone="+919876543211",
            role=UserRole.FARMER,
            full_name="Sukhbir Singh"
        )
        self.center = ProcurementCenter.objects.create(
            name="Karnal Main Yard",
            code="KAR-01",
            state="Haryana",
            district="Karnal",
            daily_capacity_mt=Decimal("500.00"),
            operational_status="ACTIVE"
        )
        self.target_date = timezone.localdate() + timedelta(days=3)
        self.client_a = APIClient()
        self.client_a.force_authenticate(user=self.farmer)
        self.client_b = APIClient()
        self.client_b.force_authenticate(user=self.farmer)

    def test_same_farmer_concurrent_devices_prevent_double_booking(self):
        payload_a = {
            "center_id": str(self.center.uuid),
            "booking_date": str(self.target_date),
            "commodity": "Paddy (Basmati)",
            "time_slot": "09:00 AM - 11:00 AM",
            "quantity_quintals": "25.00"
        }
        payload_b = {
            "center_id": str(self.center.uuid),
            "booking_date": str(self.target_date),
            "commodity": "Paddy (Basmati)",
            "time_slot": "11:00 AM - 01:00 PM",
            "quantity_quintals": "30.00"
        }

        # Device A books
        res_a = self.client_a.post(
            "/api/slots/book/",
            payload_a,
            format="json",
            HTTP_IDEMPOTENCY_KEY=f"DEVICE-A-{uuid.uuid4()}"
        )
        self.assertEqual(res_a.status_code, status.HTTP_201_CREATED, res_a.data)
        booking_a_uuid = res_a.data['data']['uuid']

        # Device B attempts second active booking for same date and commodity
        res_b = self.client_b.post(
            "/api/slots/book/",
            payload_b,
            format="json",
            HTTP_IDEMPOTENCY_KEY=f"DEVICE-B-{uuid.uuid4()}"
        )
        self.assertEqual(res_b.status_code, status.HTTP_409_CONFLICT, res_b.data)
        self.assertEqual(res_b.data.get('code'), "DUPLICATE_ACTIVE_BOOKING_NOT_PERMITTED")

        # Now cancel Booking A
        res_cancel = self.client_a.post(f"/api/slots/{booking_a_uuid}/cancel/")
        self.assertEqual(res_cancel.status_code, status.HTTP_200_OK)

        # Device B retries booking now that prior is CANCELLED: must succeed
        res_retry = self.client_b.post(
            "/api/slots/book/",
            payload_b,
            format="json",
            HTTP_IDEMPOTENCY_KEY=f"DEVICE-B-RETRY-{uuid.uuid4()}"
        )
        self.assertEqual(res_retry.status_code, status.HTTP_201_CREATED, res_retry.data)


class QRAdversarialTests(TestCase):
    """
    Requirement 5: QR Adversarial Test
    A. valid QR -> 200 OK
    B. QR already used -> 409 Conflict
    C. QR expired -> 400 Bad Request
    D. QR cancelled -> 400 Bad Request
    E. QR modified / tampered signature -> 400 Bad Request
    F. QR wrong center -> 403 Forbidden
    G. QR wrong date -> 400 Bad Request
    """
    def setUp(self):
        self.farmer = User.objects.create_user(
            email="farmer_qr@example.com",
            phone="+919876543212",
            role=UserRole.FARMER,
            full_name="Gurnam Singh"
        )
        self.center_a = ProcurementCenter.objects.create(
            name="Rohtak Mandi Yard",
            code="ROH-01",
            state="Haryana",
            district="Rohtak",
            operational_status="ACTIVE"
        )
        self.center_b = ProcurementCenter.objects.create(
            name="Panipat Mandi Yard",
            code="PAN-01",
            state="Haryana",
            district="Panipat",
            operational_status="ACTIVE"
        )
        self.operator_rohtak = User.objects.create_user(
            email="op_rohtak@example.com",
            role=UserRole.CENTER_OPERATOR,
            mandi="Rohtak Mandi Yard"
        )
        self.operator_panipat = User.objects.create_user(
            email="op_panipat@example.com",
            role=UserRole.CENTER_OPERATOR,
            mandi="Panipat Mandi Yard"
        )
        self.today = timezone.localdate()
        self.client_rohtak = APIClient()
        self.client_rohtak.force_authenticate(user=self.operator_rohtak)
        self.client_panipat = APIClient()
        self.client_panipat.force_authenticate(user=self.operator_panipat)

    def _create_token(self, center=None, target_date=None, status_val=QRTokenStatus.ISSUED, commodity="Wheat"):
        cnt = center or self.center_a
        dt = target_date or self.today
        booking = SlotBooking.objects.create(
            farmer=self.farmer,
            center=cnt,
            mandi_name=cnt.name,
            commodity=commodity,
            quantity_quintals=Decimal("40.00"),
            booking_date=dt,
            time_slot="09:00 AM - 11:00 AM",
            status=SlotBookingStatus.CONFIRMED if status_val != QRTokenStatus.CANCELLED else SlotBookingStatus.CANCELLED
        )
        tok = QRToken.objects.create(
            slot_booking=booking,
            center=cnt,
            farmer_name="Gurnam Singh",
            mandi_name=cnt.name,
            crop_name=commodity,
            quantity_quintals=Decimal("40.00"),
            date=dt,
            time_slot="09:00 AM - 11:00 AM",
            status=status_val
        )
        return tok

    def test_a_valid_qr_succeeds(self):
        token = self._create_token(commodity="Barley")
        res = self.client_rohtak.post("/api/tokens/scan/", {"token": token.token_string})
        self.assertEqual(res.status_code, status.HTTP_200_OK, res.data)
        token.refresh_from_db()
        self.assertEqual(token.status, QRTokenStatus.USED)
        self.assertTrue(token.is_used)

    def test_b_already_used_qr_rejected(self):
        token = self._create_token(commodity="Gram")
        token.status = QRTokenStatus.USED
        token.is_used = True
        token.save()

        res = self.client_rohtak.post("/api/tokens/scan/", {"token": token.token_string})
        self.assertEqual(res.status_code, status.HTTP_409_CONFLICT, res.data)
        self.assertIn("already been used", res.data.get('message', ''))

    def test_c_expired_qr_rejected(self):
        past_date = self.today - timedelta(days=2)
        token = self._create_token(target_date=past_date, commodity="Mustard")
        res = self.client_rohtak.post("/api/tokens/scan/", {"token": token.token_string})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST, res.data)
        self.assertIn("EXPIRED", str(res.data))

    def test_d_cancelled_qr_rejected(self):
        token = self._create_token(status_val=QRTokenStatus.CANCELLED, commodity="Moong")
        res = self.client_rohtak.post("/api/tokens/scan/", {"token": token.token_string})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST, res.data)
        self.assertIn("CANCELLED", str(res.data))

    def test_e_modified_qr_tampered_signature_rejected(self):
        token = self._create_token(commodity="Bajra")
        # QR payload with tampered signature
        tampered_qr_payload = json.dumps({
            "v": "1.0",
            "tid": str(token.uuid),
            "tok": token.token_string,
            "sig": "TAMPERED_FORGED_SIGNATURE_XYZ12345",
            "dt": str(token.date)
        })
        res = self.client_rohtak.post("/api/tokens/scan/", {"token": tampered_qr_payload})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST, res.data)
        self.assertIn("signature", str(res.data).lower())

    def test_f_wrong_center_rejected(self):
        # Token designated for Rohtak Yard, scanned by Panipat operator
        token = self._create_token(center=self.center_a, commodity="Arhar")
        res = self.client_panipat.post("/api/tokens/scan/", {"token": token.token_string})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN, res.data)
        self.assertIn("designated for center", res.data.get('message', ''))

    def test_g_wrong_future_date_rejected(self):
        future_date = self.today + timedelta(days=5)
        token = self._create_token(target_date=future_date, commodity="Cotton")
        res = self.client_rohtak.post("/api/tokens/scan/", {"token": token.token_string})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST, res.data)
        self.assertIn("future date", res.data.get('message', ''))


class SMSFailureBehaviorTests(TestCase):
    """
    Requirement 6: SMS Failure Behavior Separation
    - DEMO_AUTH_MODE: returns demo simulation flag and helpful info
    - PRODUCTION_AUTH_MODE: provider failure raises SMSDeliveryError and returns 502 Bad Gateway
    """
    def setUp(self):
        self.farmer = User.objects.create_user(
            email="farmer_sms@example.com",
            phone="+919876543299",
            role=UserRole.FARMER,
            full_name="Kuldeep Singh"
        )
        self.client = APIClient()

    def test_demo_auth_mode_visibly_simulates(self):
        with self.settings(DEMO_AUTH_MODE=True):
            res = self.client.post("/api/auth/request-otp/", {"phone": "9876543299"})
            self.assertEqual(res.status_code, status.HTTP_200_OK, res.data)
            self.assertTrue(res.data['data']['demo_mode'])
            self.assertIn("demo_otp", res.data['data'])

    def test_production_mode_sms_failure_returns_502(self):
        with self.settings(DEMO_AUTH_MODE=False, FAST2SMS_API_KEY=""):
            res = self.client.post("/api/auth/request-otp/", {"phone": "9876543299"})
            # Must return 502 Bad Gateway and NOT claim OTP was dispatched
            self.assertEqual(res.status_code, status.HTTP_502_BAD_GATEWAY, res.data)
            self.assertEqual(res.data.get('code'), "SMS_DELIVERY_FAILED")
            self.assertFalse(res.data.get('success', True))
