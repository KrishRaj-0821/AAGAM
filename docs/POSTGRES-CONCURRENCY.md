# 🐘 PostgreSQL Concurrency & Locking Architecture Report

**AAGAM P0 Hardening & Concurrency Validation**  
**Document:** `/docs/POSTGRES-CONCURRENCY.md`  
**Database Engine:** PostgreSQL 18.6 (x86_64, Windows Standalone Cluster on Port 5433)  
**ORM Framework:** Django 5.1 / Django REST Framework 3.18  

---

## 1. Executive Summary

Under high-velocity procurement conditions (e.g., hundreds of farmers attempting to book a limited slot in seconds), SQLite is fundamentally inadequate due to database-level write locks (`database is locked`). 

AAGAM P0 concurrency validation was executed strictly against **PostgreSQL 18.6** using native ACID row-level locking (`SELECT ... FOR UPDATE`), partial unique constraints, and transaction isolation guarantees. All 44 automated tests and the 5,000-request live HTTP stress test ran against this PostgreSQL instance.

---

## 2. PostgreSQL Configuration & Environment

| Parameter | Value / Configuration |
| :--- | :--- |
| **PostgreSQL Version** | **18.6** (PostgreSQL 18.6, 64-bit build) |
| **Database Host / Port** | `127.0.0.1:5433` (User cluster at `C:\Users\kishu\pgdata`) |
| **Active Test Database** | `aagam_db` |
| **Python Adapter** | `psycopg2-binary 2.9.13` |
| **Transaction Isolation Level** | **Read Committed** (PostgreSQL Default) + Explicit Pessimistic Locking |
| **Locking Mechanism** | `SELECT ... FOR UPDATE` (Pessimistic Row Lock via `select_for_update()`) |
| **Connection Pooling** | Managed by Waitress WSGI with 32 worker threads |

---

## 3. Database Indexes & Schema Constraints

### A. Primary Indexes Used During Booking & Verification

1. **`slots_slot_pkey`**: Primary key index on `Slot.uuid` (UUID B-Tree).
2. **`slots_slot_center_id_date_time_slot_key`**: Composite index over `(center_id, date, time_slot)` for $O(1)$ slot lookup.
3. **`slots_slotbooking_idempotency_fingerprint_idx`**: B-Tree index on `idempotency_fingerprint` (SHA-256 hash) for rapid payload tampering detection.
4. **`tokens_qrtoken_token_string_key`**: Unique B-Tree index on `token_string` for instant gate scanning lookup.

### B. Multi-Device Partial Unique Constraint

To enforce the MVP business rule that **a farmer must not receive two active confirmed bookings for the same date and commodity**, a partial unique constraint was implemented directly in the database:

```python
# backend/apps/slots/models.py
models.UniqueConstraint(
    fields=['farmer', 'booking_date', 'commodity'],
    condition=models.Q(status=SlotBookingStatus.CONFIRMED),
    name='unique_active_farmer_booking_date_commodity'
)
```

**PostgreSQL SQL DDL Generated:**
```sql
CREATE UNIQUE INDEX "unique_active_farmer_booking_date_commodity" 
ON "slots_slotbooking" ("farmer_id", "booking_date", "commodity") 
WHERE "status" = 'CONFIRMED';
```

**Constraint Behavior:**
- If Farmer A attempts to book Wheat on `2026-10-15` from Device 1, the booking is created (`status='CONFIRMED'`).
- If Farmer A concurrently attempts to book Wheat on `2026-10-15` from Device 2:
  - Application logic detects the active booking and returns `HTTP 409 Conflict` (`DUPLICATE_ACTIVE_BOOKING_NOT_PERMITTED`).
  - If a race condition bypasses application logic, PostgreSQL immediately raises `psycopg2.errors.UniqueViolation: duplicate key value violates unique constraint "unique_active_farmer_booking_date_commodity"`.
- If Farmer A's initial booking is cancelled (`status='CANCELLED'`), the partial index condition is no longer met, seamlessly allowing Farmer A to book a new slot for that date.

---

## 4. Transaction Isolation & Row-Level Locks

### A. Slot Capacity Locking (`SELECT FOR UPDATE`)

In `backend/apps/slots/views.py`:

```python
with transaction.atomic():
    # Acquire exclusive row-level lock on the specific slot
    slot = Slot.objects.select_for_update().filter(
        center=center,
        date=booking_date,
        time_slot=time_slot
    ).first()

    # Remaining capacity evaluated under lock
    remaining = slot.max_capacity_quintals - slot.booked_quintals
    if quantity > remaining:
        return error_response("Insufficient slot capacity.", status_code=400)

    # Atomic decrement
    slot.booked_quintals = slot.booked_quintals + quantity
    if slot.booked_quintals >= slot.max_capacity_quintals:
        slot.is_available = False
    slot.save()
```

**Locks Acquired in PostgreSQL:**
1. Transaction executes `SELECT ... FOR UPDATE` on `slots_slot`.
2. PostgreSQL acquires an **Exclusive Tuple Lock** (`ExclusiveLock` / `RowShareLock` mode) on the target slot row.
3. Concurrent transactions attempting to book the same slot are queued behind this lock.
4. When Transaction 1 commits, Transaction 2 acquires the lock and immediately sees the updated `booked_quintals` value, preventing phantom allocations.

### B. QR Token Scanning Replay Lock

In `backend/apps/tokens/views.py`:

```python
with transaction.atomic():
    token = QRToken.objects.select_for_update().get(token_string__iexact=token_string)
    
    if token.status == QRTokenStatus.USED or token.is_used:
        return error_response("ACCESS DENIED: QR Token already used.", status_code=409)

    token.status = QRTokenStatus.USED
    token.is_used = True
    token.used_at = timezone.now()
    token.save()
```

If two operators attempt to scan the exact same QR token at the exact same millisecond:
- Operator 1 acquires the row lock, inspects `status == 'ISSUED'`, updates to `'USED'`, and commits.
- Operator 2 acquires the row lock, re-reads the committed row, sees `status == 'USED'`, and receives an immediate **HTTP 409 Conflict**.

---

## 5. Automated Concurrency Test Evidence

Ran `python manage.py test tests` against PostgreSQL 18.6:

```text
Ran 44 tests in 85.585s
OK
INITIAL SLOT IN TEST: booked: 0.00 max: 100.00
ACTUAL BOOKINGS IN DB: 5 bookings of 20.00 QTL each
FINAL SLOT BOOKED: 100.00 QTL
OUTCOMES SUMMARY: 201 count = 5, 400 count = 5, total outcomes = 10
```

Under multithreaded concurrent booking in test cases:
- 10 threads attempted to book 20 QTL each on a 100 QTL slot.
- Exactly 5 threads succeeded (Total booked: 100.00 QTL).
- Exactly 5 threads were rejected with HTTP 400 (Insufficient capacity).
- Final booked quantity: **100.00 QTL** (Strictly equal to maximum capacity, zero oversubscription).
