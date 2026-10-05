# 🌐 Live Multi-Tier End-to-End (E2E) Deployment & Flow Validation

**AAGAM P0 Hardening & Live Flow Verification**  
**Document:** `/docs/LIVE-E2E-TEST.md`  
**Execution Timestamp:** 2026-10-05T08:58:49Z  
**Architecture:** Frontend Client → Django REST API → PostgreSQL 18  
**Verification Harness:** `backend/tests/run_live_e2e_flow.py`  

---

## 1. Live Multi-Tier Architecture

```text
┌─────────────────────────────────┐
│   Public Frontend Client        │
│   (GitHub Pages / Vite PWA)     │
│   Config: VITE_API_BASE_URL     │
└───────────────┬─────────────────┘
                │ HTTPS / REST (JSON)
                ▼
┌─────────────────────────────────┐
│   Authoritative Backend API     │
│   (Django 5.1 + SimpleJWT)      │
│   Server: Waitress WSGI         │
└───────────────┬─────────────────┘
                │ psycopg2 (Port 5433)
                ▼
┌─────────────────────────────────┐
│   Authoritative Database        │
│   (PostgreSQL 18.6 ACID Engine) │
│   Row Locks (select_for_update) │
└─────────────────────────────────┘
```

---

## 2. Configuration & Frontend Connection

In production deployments, the frontend connects to the backend through the environment variable:

```bash
# Frontend environment (.env / GitHub Actions Secrets)
VITE_API_BASE_URL=https://api.aagam.gov.in
```

For local validation, the frontend connects to `http://127.0.0.1:8000` where the Django API is served by Waitress connected to PostgreSQL 18.

---

## 3. Real 11-Step End-to-End Pipeline Execution Log

The entire farmer-to-mandi-gate workflow was executed sequentially against the live backend API. Every step produced authoritative database state changes:

### Step 1: Production Health Check
- **Endpoint:** `GET /api/health/`
- **HTTP Status:** `200 OK`
- **Output:**
```json
{
  "status": "HEALTHY",
  "database": "CONNECTED",
  "service": "AAGAM National Agricultural Grain & Allocation Management Backend",
  "engine": "Django 4.2 REST Framework"
}
```

### Step 2: Farmer Registration
- **Endpoint:** `POST /api/auth/register/`
- **HTTP Status:** `201 Created`
- **Persona:** Balwinder Singh (Mobile: `+91 9876543201`, Role: `FARMER`, Mandi: Karnal Central Yard)

### Step 3: Farmer Request OTP (Authoritative Backend Generation)
- **Endpoint:** `POST /api/auth/request-otp/`
- **HTTP Status:** `200 OK`
- **Output:**
```json
{
  "phone": "+91 9876543201",
  "expires_in_seconds": 300,
  "dispatched": true,
  "demo_mode": true
}
```

### Step 4: Farmer Verify OTP & Obtain Authoritative SimpleJWT
- **Endpoint:** `POST /api/auth/verify-otp/`
- **HTTP Status:** `200 OK`
- **Output:** JWT access token issued. Hash verified, single-use OTP consumed and marked used.

### Step 5: Center Selection
- **Endpoint:** `GET /api/centers/`
- **HTTP Status:** `200 OK`
- **Selection:** `LOAD-TEST-01` (Karnal Load-Testing Grain Mandi, District: Karnal, Status: ACTIVE)

### Step 6: Query Center Slot Availability
- **Endpoint:** `GET /api/slots/available/?center_id=...&date=2026-10-20`
- **HTTP Status:** `200 OK`
- **Output:** 1 slot active and accepting allocations.

### Step 7: Authoritative Slot Booking with Idempotency-Key
- **Endpoint:** `POST /api/slots/book/`
- **Header:** `Idempotency-Key: E2E-IDEM-05f3...`
- **HTTP Status:** `201 Created`
- **Output:**
```json
{
  "booking_uuid": "026c9fec-bc15-45c1-b374-d0ae5156f27f",
  "token_number": "OCT261033285",
  "status": "CONFIRMED",
  "quantity_quintals": "35.00",
  "commodity": "Wheat (Kalyansona)",
  "mandi_name": "Karnal Load-Testing Grain Mandi"
}
```

### Step 8: Farmer QR Token & Cryptographic Signature Verification
- **Endpoint:** `GET /api/tokens/`
- **HTTP Status:** `200 OK`
- **Output:**
```json
{
  "token_string": "OCT261033285",
  "status": "ISSUED",
  "opaque_signature": "e32301988e714eaf4198...",
  "has_qr_image_base64": true
}
```

### Step 9: Authenticate Mandi Center Operator
- **Endpoint:** `POST /api/auth/register/` (or `/api/auth/login/`)
- **HTTP Status:** `201 Created`
- **Persona:** Suresh Inspector (Role: `CENTER_OPERATOR`, Mandi: Karnal Load-Testing Grain Mandi)
- **Output:** Operator JWT token issued.

### Step 10: Center Operator Gate Scan & Token Verification
- **Endpoint:** `POST /api/tokens/scan/`
- **HTTP Status:** `200 OK`
- **Output:**
```json
{
  "access_granted": true,
  "token_status_after_scan": "USED",
  "gate_pass_number": "GP-MND-AF3F42",
  "gate_entry_number": "GEN-3EDC41"
}
```

### Step 11: Farmer Booking Arrival & Yard State Machine Update
- **Endpoint:** `GET /api/slots/my-bookings/`
- **HTTP Status:** `200 OK`
- **Output:**
```json
{
  "booking_uuid": "026c9fec-bc15-45c1-b374-d0ae5156f27f",
  "token_number": "OCT261033285",
  "final_status": "ARRIVED"
}
```
State machine transition confirmed: `CONFIRMED` → `ARRIVED`.

---

## 4. Summary & Verification Verdict

The complete end-to-end user journey — from unauthenticated farmer mobile input to gate admission and gate pass generation — was executed through the live REST API against PostgreSQL 18 with 100% success.
