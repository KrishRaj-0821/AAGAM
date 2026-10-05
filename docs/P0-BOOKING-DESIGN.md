# AAGAM — Concurrency-Safe Slot Booking & Capacity Design (P0-4, P0-5, P0-6)

## 1. Overview
The AAGAM procurement platform manages agricultural grain intake across government procurement centers (APMC mandis, FCI depots, state agency yards). During peak harvesting seasons (e.g. Rabi Wheat or Kharif Paddy arrival windows), thousands of farmers attempt to reserve limited daily weighbridge and unloader slots.

This document details the engineering design ensuring that slot booking is **server-authoritative, concurrency-safe, idempotent, and tamper-proof**.

---

## 2. Canonical Booking Endpoint

```http
POST /api/slots/book/
Content-Type: application/json
Authorization: Bearer <JWT_ACCESS_TOKEN>
Idempotency-Key: <UUIDv4>
```

### Request Payload
```json
{
  "center_id": "MND-HR-001",
  "booking_date": "2026-10-06",
  "time_slot": "09:00 AM - 11:00 AM",
  "quantity_quintals": "40.00",
  "commodity": "Wheat (Sharbati)",
  "vehicle_number": "HR-05-XY-8821",
  "lane": "Lane 04 - Weighbridge A"
}
```

### Response Payload (`HTTP 201 Created`)
```json
{
  "success": true,
  "message": "Slot and authoritative QR token successfully booked.",
  "data": {
    "uuid": "45d1667b-2321-4f93-b684-25e1a3bc3220",
    "token_number": "OCT261089015",
    "idempotency_key": "c7a652a2-3f82-411a-8e2b-2a2155e8a1bc",
    "farmer_name": "Harpreet Singh",
    "farmer_phone": "+91 98765 43210",
    "mandi_name": "Karnal Central APMC",
    "commodity": "Wheat (Sharbati)",
    "quantity_quintals": "40.00",
    "booking_date": "2026-10-06",
    "time_slot": "09:00 AM - 11:00 AM",
    "lane": "Lane 04 - Weighbridge A",
    "vehicle_number": "HR-05-XY-8821",
    "status": "CONFIRMED",
    "qr_token": {
      "uuid": "7960ac54-890d-446b-967c-8101a683396b",
      "token_string": "OCT261089015",
      "opaque_signature": "f224e34225dd4a6e824456365a3a1b41",
      "status": "ISSUED",
      "expires_at": "2026-10-06T23:59:59+05:30",
      "qr_image_base64": "data:image/png;base64,..."
    }
  }
}
```

---

## 3. Concurrency-Safe Capacity Architecture (P0-5)

### Problem Statement
In a naive implementation:
```text
Farmer A reads: Remaining = 20 QTL
Farmer B reads: Remaining = 20 QTL
Farmer A requests 15 QTL -> commits -> remaining becomes 5 QTL
Farmer B requests 10 QTL -> commits -> remaining becomes -5 QTL (OVERFLOW!)
```

### AAGAM Transaction Pipeline
```text
Client Request
      │
      ▼
Check Idempotency-Key
      │ (Existing? -> Return existing booking HTTP 200 OK)
      ▼
Validate Center ACTIVE status & Date (Reject past dates HTTP 400)
      │
      ▼
BEGIN DATABASE TRANSACTION (transaction.atomic())
      │
      ▼
SELECT * FROM slots_slot WHERE center_id = ... AND date = ... AND time_slot = ...
FOR UPDATE (select_for_update())
      │  ◄── Locks the physical DB row. Other concurrent requests must wait.
      ▼
Evaluate Server-Side Capacity:
remaining = slot.max_capacity_quintals - slot.booked_quintals
      │
      ├── IF quantity > remaining:
      │         ROLLBACK TRANSACTION
      │         RETURN HTTP 400 BAD REQUEST ("Insufficient slot capacity")
      │
      └── IF quantity <= remaining:
                slot.booked_quintals += quantity
                IF slot.booked_quintals >= slot.max_capacity_quintals:
                    slot.is_available = False
                slot.save()
                
                Create SlotBooking record
                Create authoritative QRToken with HMAC signature
                
COMMIT TRANSACTION ──► Row Lock Released
```

### Database Constraints
In `backend/apps/slots/models.py`:
```python
class Meta:
    constraints = [
        models.CheckConstraint(
            condition=models.Q(booked_quintals__lte=models.F('max_capacity_quintals')),
            name='check_slot_capacity_not_exceeded'
        ),
        models.CheckConstraint(
            condition=models.Q(booked_quintals__gte=0),
            name='check_slot_booked_non_negative'
        ),
    ]
```

---

## 4. Idempotency & Network Retry Protection (P0-6)

### Mechanism
1. Every client booking request generates a client-side UUID (`Idempotency-Key` header).
2. The database stores `idempotency_key` on `SlotBooking` with a unique index.
3. If a network interruption occurs and the client retries the request with the identical key:
   - The server queries `SlotBooking.objects.filter(farmer=user, idempotency_key=idempotency_key).first()`.
   - If found, the server immediately returns the previously committed booking with `HTTP 200 OK` and a header indicating an idempotent replay.
   - **Zero additional capacity is deducted.**

---

## 5. Booking Cancellation & Capacity Restoration

When a booking is cancelled via `POST /api/slots/<id>/cancel/`:
1. Atomic transaction begins with row lock on the associated `Slot` row.
2. Booking status transitions from `CONFIRMED` to `CANCELLED`.
3. Associated `QRToken` status transitions to `CANCELLED`.
4. The cancelled quantity is deducted: `slot.booked_quintals = max(0, slot.booked_quintals - booking.quantity_quintals)`.
5. `slot.is_available` is re-enabled if capacity drops below maximum.
6. Transaction commits and restored capacity is immediately available to other farmers.
