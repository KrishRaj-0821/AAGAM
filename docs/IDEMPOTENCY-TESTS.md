# 🔁 Idempotency & Multi-Device Adversarial Testing Report

**AAGAM P0 Hardening & Security Validation**  
**Document:** `/docs/IDEMPOTENCY-TESTS.md`  
**Endpoints Tested:** `POST /api/slots/book/`, `POST /api/slots/{uuid}/cancel/`  
**Target Database:** PostgreSQL 18.6  
**Test Suite:** `backend/tests/test_adversarial_p0.py`  

---

## 1. Overview & Business Requirements

In rural agricultural environments, poor mobile network connectivity frequently causes dropped connections and repeated automated retries. Without robust idempotency and business constraint enforcement:
1. Retrying a timed-out request could result in **double allocations** of grain quotas.
2. A malicious or confused client could reuse an `Idempotency-Key` while changing request parameters (e.g., attempting to book 50 QTL instead of 10 QTL using a previously accepted token).
3. A farmer logging into multiple devices simultaneously could bypass allocation quotas and reserve multiple slots for the same commodity on the same procurement date.

---

## 2. Canonical Request Fingerprinting Architecture

To prevent silent data corruption or replay tampering, AAGAM generates a **deterministic SHA-256 canonical request fingerprint** over normalized request parameters:

```python
# backend/apps/slots/views.py
import hashlib
from decimal import Decimal

canonical_raw = f"{center.pk}:{booking_date}:{time_slot}:{str(commodity).strip().lower()}:{Decimal(str(quantity)).quantize(Decimal('0.01'))}"
current_fingerprint = hashlib.sha256(canonical_raw.encode('utf-8')).hexdigest()
```

### Storage:
The fingerprint is stored directly in the `SlotBooking` database row:
```python
idempotency_fingerprint = models.CharField(max_length=64, blank=True, null=True, db_index=True)
```

---

## 3. Adversarial Test 1: Idempotency Payload Tampering

### Test Sequence:

```text
Request A:
  Farmer: Ramesh Kumar
  Idempotency-Key: IDEM-KEY-7A9B...
  Quantity: 10.00 QTL
  Commodity: Wheat (Sharbati)
  --> EXPECTED: HTTP 201 Created (New booking created)

Request B (Identical Replay):
  Farmer: Ramesh Kumar
  Idempotency-Key: IDEM-KEY-7A9B...
  Quantity: 10.00 QTL
  Commodity: Wheat (Sharbati)
  --> EXPECTED: HTTP 200 OK (Returns existing booking, zero additional quota booked)

Request C (Adversarial Tampered Replay):
  Farmer: Ramesh Kumar
  Idempotency-Key: IDEM-KEY-7A9B...
  Quantity: 50.00 QTL  <-- MODIFIED
  Commodity: Wheat (Sharbati)
  --> EXPECTED: HTTP 409 Conflict
      Code: IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST
```

### Verified Response on Request C:
```json
{
  "success": false,
  "message": "Idempotency key has already been used with a different request payload.",
  "code": "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST",
  "errors": {
    "code": "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST"
  }
}
```

---

## 4. Adversarial Test 2: Same Farmer Multi-Device Double-Booking

### Business Rule:
> **A farmer must not hold two active confirmed bookings for the same procurement date and commodity unless explicitly approved.**

### Test Sequence:

```text
Device A:
  Farmer: Sukhbir Singh
  Date: 2026-10-18
  Commodity: Paddy (Basmati)
  Quantity: 25.00 QTL
  Idempotency-Key: DEVICE-A-KEY...
  --> EXPECTED: HTTP 201 Created (Booking A confirmed)

Device B:
  Farmer: Sukhbir Singh
  Date: 2026-10-18
  Commodity: Paddy (Basmati)  <-- SAME DATE & COMMODITY
  Quantity: 30.00 QTL
  Idempotency-Key: DEVICE-B-KEY...
  --> EXPECTED: HTTP 409 Conflict
      Code: DUPLICATE_ACTIVE_BOOKING_NOT_PERMITTED

Cancel Action:
  Device A calls: POST /api/slots/{booking_a_uuid}/cancel/
  --> EXPECTED: HTTP 200 OK (Booking A status transitioned to CANCELLED, quota restored)

Device B Retry:
  Device B retries booking on 2026-10-18 for Paddy (Basmati)
  --> EXPECTED: HTTP 201 Created (Allowed because previous booking is CANCELLED)
```

### Verified Response on Device B First Attempt:
```json
{
  "success": false,
  "message": "Farmer already holds an active booking for Paddy (Basmati) on 2026-10-18. Multiple active bookings for the same date and commodity are not permitted.",
  "code": "DUPLICATE_ACTIVE_BOOKING_NOT_PERMITTED",
  "errors": {
    "code": "DUPLICATE_ACTIVE_BOOKING_NOT_PERMITTED"
  }
}
```

---

## 5. PostgreSQL Constraint Backstop

Even if simultaneous requests bypass application-layer checks, PostgreSQL enforces the partial unique constraint at the storage layer:

```sql
CREATE UNIQUE INDEX "unique_active_farmer_booking_date_commodity" 
ON "slots_slotbooking" ("farmer_id", "booking_date", "commodity") 
WHERE "status" = 'CONFIRMED';
```

If a race condition occurs, PostgreSQL raises:
```text
psycopg2.errors.UniqueViolation: duplicate key value violates unique constraint "unique_active_farmer_booking_date_commodity"
DETAIL: Key (farmer_id, booking_date, commodity)=(c4e9..., 2026-10-05, Wheat) already exists.
```

---

## 6. Test Suite Evidence

Ran `python manage.py test tests.test_adversarial_p0`:

```text
Creating test database for alias 'default'...
...
----------------------------------------------------------------------
Ran 11 tests in 0.675s

OK
Destroying test database for alias 'default'...
```

Both idempotency payload tampering and multi-device double-booking scenarios were verified and passed 100% against PostgreSQL 18.
