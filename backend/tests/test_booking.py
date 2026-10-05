import uuid
import threading
from decimal import Decimal
from datetime import timedelta
from django.test import TransactionTestCase
from django.utils import timezone
from django.db import connection, close_old_connections
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from apps.accounts.models import UserRole
from apps.centers.models import ProcurementCenter
from apps.slots.models import Slot, SlotBooking, SlotBookingStatus

User = get_user_model()

class SlotBookingConcurrencyTests(TransactionTestCase):
    """
    Concurrency and capacity safety tests using TransactionTestCase.
    Tests atomic locking (select_for_update), idempotency, and capacity constraints.
    """
    def setUp(self):
        self.farmer = User.objects.create_user(
            email="farmer_booking@aagam.gov.in",
            password="testpassword123",
            full_name="Harpreet Singh",
            phone="+91 98765 43210",
            role=UserRole.FARMER
        )
        self.farmer_client = APIClient()
        self.farmer_client.force_authenticate(user=self.farmer)

        self.center = ProcurementCenter.objects.create(
            name="Karnal Test Yard Hub",
            code="MND-TEST-001",
            state="Haryana",
            district="Karnal",
            daily_capacity_mt=Decimal("1000.00"),
            operational_status="ACTIVE"
        )
        self.tomorrow = timezone.now().date() + timedelta(days=1)
        self.time_slot = "09:00 AM - 11:00 AM"

    def test_booking_exceeding_capacity_rejected(self):
        """Booking that exceeds remaining capacity is rejected with 400 Bad Request."""
        slot = Slot.objects.create(
            center=self.center,
            date=self.tomorrow,
            time_slot=self.time_slot,
            max_capacity_quintals=Decimal("50.00"),
            booked_quintals=Decimal("40.00"),
            is_available=True
        )

        # Attempt to book 20 QTL when only 10 QTL remaining
        res = self.farmer_client.post('/api/slots/book/', {
            'center_id': self.center.code,
            'booking_date': str(self.tomorrow),
            'time_slot': self.time_slot,
            'quantity_quintals': '20.00',
            'commodity': 'Wheat',
            'vehicle_number': 'HR-05-AB-1234'
        })
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Insufficient slot capacity', res.data['message'])

        slot.refresh_from_db()
        self.assertEqual(slot.booked_quintals, Decimal("40.00"))

    def test_idempotent_network_retry(self):
        """Repeated identical requests with the same Idempotency-Key return the existing booking."""
        idempotency_key = str(uuid.uuid4())

        payload = {
            'center_id': self.center.code,
            'booking_date': str(self.tomorrow),
            'time_slot': self.time_slot,
            'quantity_quintals': '25.00',
            'commodity': 'Wheat',
            'vehicle_number': 'HR-05-AB-1234'
        }

        # Request 1
        res1 = self.farmer_client.post(
            '/api/slots/book/',
            payload,
            format='json',
            HTTP_IDEMPOTENCY_KEY=idempotency_key
        )
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        booking1_id = res1.data['data']['uuid']

        # Request 2 (Network retry with identical idempotency key)
        res2 = self.farmer_client.post(
            '/api/slots/book/',
            payload,
            format='json',
            HTTP_IDEMPOTENCY_KEY=idempotency_key
        )
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        booking2_id = res2.data['data']['uuid']

        # Must return identical booking and never duplicate allocation
        self.assertEqual(booking1_id, booking2_id)
        self.assertEqual(SlotBooking.objects.filter(farmer=self.farmer).count(), 1)

    def test_cancelled_booking_returns_capacity(self):
        """Cancelling a booking atomically returns capacity to the slot."""
        slot = Slot.objects.create(
            center=self.center,
            date=self.tomorrow,
            time_slot=self.time_slot,
            max_capacity_quintals=Decimal("100.00"),
            booked_quintals=Decimal("0.00"),
            is_available=True
        )

        # Book 40 QTL
        res_book = self.farmer_client.post('/api/slots/book/', {
            'center_id': self.center.code,
            'booking_date': str(self.tomorrow),
            'time_slot': self.time_slot,
            'quantity_quintals': '40.00',
            'commodity': 'Wheat',
            'vehicle_number': 'HR-05-AB-1234'
        })
        self.assertEqual(res_book.status_code, status.HTTP_201_CREATED)
        booking_id = res_book.data['data']['uuid']

        slot.refresh_from_db()
        self.assertEqual(slot.booked_quintals, Decimal("40.00"))

        # Cancel the booking
        res_cancel = self.farmer_client.post(f'/api/slots/{booking_id}/cancel/')
        self.assertEqual(res_cancel.status_code, status.HTTP_200_OK)

        slot.refresh_from_db()
        self.assertEqual(slot.booked_quintals, Decimal("0.00"))
        self.assertTrue(slot.is_available)

    def test_past_date_booking_rejected(self):
        """Attempting to book a slot for a past date is rejected with 400 Bad Request."""
        yesterday = timezone.now().date() - timedelta(days=1)
        res = self.farmer_client.post('/api/slots/book/', {
            'center_id': self.center.code,
            'booking_date': str(yesterday),
            'time_slot': self.time_slot,
            'quantity_quintals': '20.00',
            'commodity': 'Wheat',
            'vehicle_number': 'HR-05-AB-1234'
        })
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('past date', res.data['message'].lower())

    def test_closed_procurement_center_rejected(self):
        """Attempting to book at a non-active/closed procurement center is rejected."""
        self.center.operational_status = "MAINTENANCE"
        self.center.save()

        res = self.farmer_client.post('/api/slots/book/', {
            'center_id': self.center.code,
            'booking_date': str(self.tomorrow),
            'time_slot': self.time_slot,
            'quantity_quintals': '20.00',
            'commodity': 'Wheat',
            'vehicle_number': 'HR-05-AB-1234'
        })
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('not accepting bookings', res.data['message'].lower())

    def test_two_simultaneous_requests_for_last_slot(self):
        """
        Two simultaneous requests competing for the last 20 QTL remaining capacity:
        Request A = 15 QTL
        Request B = 10 QTL
        Only one can commit. Total booked must never exceed capacity.
        """
        print("EXISTING SLOTS:", list(Slot.objects.filter(center=self.center, date=self.tomorrow).values('pk', 'time_slot', 'booked_quintals', 'max_capacity_quintals')))
        slot = Slot.objects.create(
            center=self.center,
            date=self.tomorrow,
            time_slot="03:00 PM - 05:00 PM",
            max_capacity_quintals=Decimal("100.00"),
            booked_quintals=Decimal("80.00"), # 20 QTL remaining
            is_available=True
        )

        farmer_b = User.objects.create_user(
            email="farmer_b@aagam.gov.in",
            password="testpassword123",
            full_name="Balwant Singh",
            phone="+91 98111 22233",
            role=UserRole.FARMER
        )

        results = {}

        def make_booking(user, qty, label):
            close_old_connections()
            client = APIClient()
            client.force_authenticate(user=user)
            import time
            idem_key = f"idem-{label}-{user.uuid}"
            for attempt in range(12):
                try:
                    res = client.post('/api/slots/book/', {
                        'center_id': self.center.code,
                        'booking_date': str(self.tomorrow),
                        'time_slot': "03:00 PM - 05:00 PM",
                        'quantity_quintals': str(qty),
                        'commodity': 'Wheat',
                        'vehicle_number': 'HR-05-AB-1234'
                    }, HTTP_IDEMPOTENCY_KEY=idem_key)
                    results[label] = (res.status_code, getattr(res, 'data', None))
                    break
                except Exception as e:
                    if "locked" in str(e).lower() and attempt < 11:
                        time.sleep(0.08 * (attempt + 1))
                        continue
                    raise
            close_old_connections()

        thread_a = threading.Thread(target=make_booking, args=(self.farmer, Decimal("15.00"), "A"))
        thread_b = threading.Thread(target=make_booking, args=(farmer_b, Decimal("10.00"), "B"))

        thread_a.start()
        import time
        time.sleep(0.04)
        thread_b.start()
        thread_a.join()
        thread_b.join()

        slot.refresh_from_db()
        status_codes = [r[0] for r in results.values()]
        if status.HTTP_201_CREATED not in status_codes:
            print("DIAGNOSTIC RESULTS:", results)
        self.assertIn(status.HTTP_201_CREATED, status_codes)
        self.assertIn(status.HTTP_400_BAD_REQUEST, status_codes)
        # Total capacity must never be exceeded
        self.assertLessEqual(slot.booked_quintals, slot.max_capacity_quintals)

    def test_ten_concurrent_requests_capacity_boundary(self):
        """
        Ten concurrent requests each requesting 20 QTL against a 100 QTL slot.
        Total requested = 200 QTL.
        Capacity = 100 QTL.
        Exactly 5 requests must commit (100 QTL) and 5 must be rejected.
        """
        slot = Slot.objects.create(
            center=self.center,
            date=self.tomorrow,
            time_slot="01:00 PM - 03:00 PM",
            max_capacity_quintals=Decimal("100.00"),
            booked_quintals=Decimal("0.00"),
            is_available=True
        )
        print("INITIAL SLOT IN TEST:", slot.pk, "booked:", slot.booked_quintals, "max:", slot.max_capacity_quintals)
        print("ALL SLOTS FOR CENTER/DATE/SLOT:", list(Slot.objects.filter(center=self.center, date=self.tomorrow, time_slot="01:00 PM - 03:00 PM").values('pk', 'booked_quintals', 'max_capacity_quintals')))

        threads = []
        outcomes = []
        lock = threading.Lock()

        farmers = [
            User.objects.create_user(
                email=f"farmer_concurrent_{i}@aagam.gov.in",
                password="pass",
                full_name=f"Farmer {i}",
                phone=f"+91 98000 000{i:02d}",
                role=UserRole.FARMER
            ) for i in range(10)
        ]

        def book_worker(farmer):
            close_old_connections()
            client = APIClient()
            client.force_authenticate(user=farmer)
            import time
            farmer_idem = f"idem-{farmer.uuid}"
            for attempt in range(15):
                try:
                    res = client.post('/api/slots/book/', {
                        'center_id': self.center.code,
                        'booking_date': str(self.tomorrow),
                        'time_slot': "01:00 PM - 03:00 PM",
                        'quantity_quintals': '20.00',
                        'commodity': 'Wheat',
                        'vehicle_number': f'HR-05-XY-{uuid.uuid4().hex[:4].upper()}'
                    }, HTTP_IDEMPOTENCY_KEY=farmer_idem)
                    with lock:
                        outcomes.append((res.status_code, getattr(res, 'data', None)))
                    break
                except Exception as e:
                    if "locked" in str(e).lower() and attempt < 14:
                        time.sleep(0.15 * (attempt + 1))
                        continue
                    raise
            close_old_connections()

        for f in farmers:
            t = threading.Thread(target=book_worker, args=(f,))
            threads.append(t)
            t.start()
            import time
            time.sleep(0.08)

        for t in threads:
            t.join()

        slot.refresh_from_db()
        bookings = list(SlotBooking.objects.filter(slot=slot).values('farmer__email', 'quantity_quintals'))
        print("ACTUAL BOOKINGS IN DB:", len(bookings), bookings)
        print("FINAL SLOT BOOKED:", slot.booked_quintals)
        status_list = [o[0] for o in outcomes]
        success_count = status_list.count(status.HTTP_201_CREATED)
        rejected_count = status_list.count(status.HTTP_400_BAD_REQUEST)
        print(f"OUTCOMES SUMMARY: 201 count = {success_count}, 400 count = {rejected_count}, total outcomes = {len(outcomes)}")
        self.assertEqual(success_count, 5)
        self.assertEqual(rejected_count, 5)
        self.assertEqual(slot.booked_quintals, Decimal("100.00"))
        self.assertFalse(slot.is_available)
