# AAGAM — QR Token Lifecycle & Replay Protection Design (P0-7, P0-8)

## 1. Overview
At the mandi entry gates, physical barrier booms and weighbridges operate based on digital tokens scanned from farmers' smart devices or printed physical slips. The gate entry system must prevent:
- Gate pass spoofing or forgery.
- Replay attacks (using the same QR pass for multiple truck entries).
- Unauthorized entry at the wrong procurement center.
- Premature entry on wrong or future dates.
- Simultaneous double-scanning race conditions.

---

## 2. Authoritative QR Generation (P0-7)

### Generation Timing
Authoritative QR tokens are created exclusively by the Django REST backend during the database transaction committing the slot booking.

### Token Construction
```python
token_string = f"OCT26{secrets.randbelow(900000) + 100000}"
opaque_payload = f"{booking.uuid}:{center.code}:{token_string}"
opaque_signature = hmac.new(
    settings.SECRET_KEY.encode(),
    opaque_payload.encode(),
    hashlib.sha256
).hexdigest()
```

### Zero PII Specification
The QR token contains no sensitive personally identifiable information:
- ❌ NO Aadhaar number
- ❌ NO bank account or IFSC details
- ❌ NO PAN details
- ❌ NO voter ID or home address
- ✅ Contains only opaque reference: `{ "token": token_string, "sig": opaque_signature, "booking_id": booking.uuid }`

---

## 3. QR Token State Machine (P0-8)

```text
       ┌──────────────┐
       │   ISSUED     │  ◄── Created atomically on slot booking commit
       └──────┬───────┘
              │
              │  Operator scans at entry barrier
              ▼
       ┌──────────────┐
       │   SCANNED    │  ◄── Verified by gate operator (Temporary state)
       └──────┬───────┘
              │
              │  Barrier opens / Truck crosses boom
              ▼
       ┌──────────────┐
       │    USED      │  ◄── Entry recorded in GateEntry ledger
       └──────────────┘
              │
              ▼  Subsequent scans of same token
       ┌──────────────┐
       │ ACCESS       │  ◄── HTTP 409 Conflict: Already used!
       │ DENIED (409) │
       └──────────────┘

Terminal States:
- CANCELLED: Farmer cancelled booking prior to arrival.
- EXPIRED: Arrival window closed without gate scan.
```

---

## 4. Atomic Scan Verification Algorithm

Endpoint: `POST /api/tokens/scan/`

```python
with transaction.atomic():
    # Lock the QRToken row against concurrent scanner requests
    token = QRToken.objects.select_for_update().filter(
        token_string=token_string
    ).first()

    if not token:
        return HTTP 404 Not Found ("Invalid token string")

    # 1. State Check: Reject already used
    if token.status == 'USED':
        return HTTP 409 Conflict ("Token has already been used for gate entry")

    # 2. State Check: Reject cancelled or expired
    if token.status in ('CANCELLED', 'EXPIRED'):
        return HTTP 400 Bad Request (f"Token is {token.status}")

    # 3. Center Validation: Restrict to operator's assigned center
    if operator.mandi and token.center.name != operator.mandi:
        return HTTP 403 Forbidden ("Token is designated for a different center")

    # 4. Date Validation: Reject future arrivals
    if token.date > timezone.localdate():
        return HTTP 400 Bad Request ("Token is scheduled for a future date")

    # 5. Atomic State Transition
    token.status = 'USED'
    token.is_used = True
    token.used_at = timezone.now()
    token.save()

    # 6. Immutable Ledger Entry
    GateEntry.objects.create(
        center=token.center,
        farmer_name=token.farmer_name,
        token_string=token.token_string,
        crop_name=token.crop_name,
        quantity_quintals=token.quantity_quintals,
        vehicle_number=vehicle_number,
        entry_status='ADMITTED',
        gate_operator=operator
    )

    return HTTP 200 OK ("Gate entry authorized")
```

---

## 5. Simultaneous Duplicate Scan Race Condition Protection

When two gate operators scan the same physical pass simultaneously:
1. Operator A's request enters `transaction.atomic()` and executes `select_for_update()`, acquiring the database row-level lock on the `QRToken`.
2. Operator B's request reaches `select_for_update()` and blocks, waiting for Operator A's transaction to commit or abort.
3. Operator A reads `status == 'ISSUED'`, updates `status = 'USED'`, commits the transaction, releases the lock, and receives `HTTP 200 OK`.
4. Operator B's lock request unblocks and reads the freshly committed row: `status == 'USED'`.
5. Operator B immediately triggers the check: `if token.status == 'USED'` and returns **`HTTP 409 Conflict` (ACCESS DENIED)**.
6. **Result:** Only 1 truck is admitted. Dual entry is physically impossible.
