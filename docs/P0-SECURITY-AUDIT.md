# AAGAM — P0 Security & Architecture Audit Report

**System Name:** AAGAM (Automated Agricultural Grain & Allocation Management)  
**Classification:** Critical Public Procurement Infrastructure  
**Audit Scope:** Core Farmer Procurement Flow, Authentication, Slot Capacity Concurrency, QR Token Lifecycle, Authorization (RBAC), and Production Readiness.  
**Status:** REMEDIATED & HARDENED

---

## 1. Executive Summary

A comprehensive security and architecture audit of the AAGAM codebase revealed several critical architectural and security vulnerabilities that permitted unauthorized access, race-condition slot overbooking, credential exposure, QR code replay attacks, and client-side authentication bypasses.

Every vulnerability identified in the P0 mandate has been systematically eliminated. The system has been restructured such that **the Django REST backend and PostgreSQL database are the single, authoritative source of truth**. All mock authentication, client-side token generation, and silent error fallbacks have been removed.

---

## 2. Detailed Vulnerability Findings & Remediation

### 2.1 [CRITICAL] Secret Exposure: Fast2SMS API Key in React Source Code (P0-3)
* **Vulnerability:** The production Fast2SMS API key was committed directly to the frontend code in `src/services/otpService.js` (`const FAST2SMS_API_KEY = "sSZHqtaTv1nXbD0ReCliAUjBFuGPJw6WV8chQy7zo2x53YrOLglxfMG5Hi2VIwATdE1FzhNJc98vq3uK"`). Any client inspecting the JavaScript bundle could extract the key and exhaust the SMS quota or send spoofed SMS messages.
* **Remediation:**
  1. Completely deleted the API key from frontend source code, `package.json`, environment variables, and client-side modules.
  2. Routed all SMS dispatch operations through the backend architecture (`React -> Django REST Backend -> SMS Provider`).
  3. SMS credentials are now loaded strictly from backend server environment variables (`FAST2SMS_API_KEY`).
  4. Created `backend/common/sms.py` to handle outbound SMS securely without logging or exposing credentials.

---

### 2.2 [CRITICAL] Authentication Bypass: Unvalidated OTP & Fixed Demo Bypass (P0-1, P0-2)
* **Vulnerability:** 
  - Backend OTP login accepted any phone number and issued a JWT without verifying the OTP.
  - The React frontend accepted `849201` as a hardcoded demo OTP or any 6-digit code if no code was set.
  - If backend requests failed, the frontend silently fell back to generating fake `GOI-SSO-TOKEN-2026-` tokens in `localStorage`.
* **Remediation:**
  1. Implemented server-authoritative OTP models (`PhoneOTP`) in `backend/apps/accounts/models.py`.
  2. OTPs are generated strictly on the backend using `secrets.randbelow(900000) + 100000`.
  3. Only a cryptographically salted SHA-256 hash (`hashlib.sha256((otp + salt).encode()).hexdigest()`) is stored in the database.
  4. Enforced strict 5-minute expiry (`timezone.now() > expires_at`).
  5. Implemented maximum verification attempts (max 3 failed attempts before permanent invalidation).
  6. Atomic replay prevention: `is_consumed = True` immediately upon successful verification.
  7. Rate limiting: Enforced maximum 3 OTP generation requests per 10-minute window per phone number.
  8. Strictly isolated `DEMO_AUTH_MODE` for SIH demonstration (`POST /api/auth/demo-login/`), which returns genuine signed JWTs for seeded database users and is visibly labelled in the UI.

---

### 2.3 [CRITICAL] Concurrency Race Condition: Slot Capacity Overbooking (P0-4, P0-5)
* **Vulnerability:** Slot booking lacked database-level concurrency controls. Simultaneous requests could read the same available capacity and both commit, causing procurement centers to exceed physical holding and processing limits.
* **Remediation:**
  1. Made `POST /api/slots/book/` the single canonical booking endpoint.
  2. Implemented strict pessimistic row locking using `Slot.objects.select_for_update()` within `transaction.atomic()`.
  3. Server validates remaining capacity (`remaining = slot.max_capacity_quintals - slot.booked_quintals`) inside the lock before committing.
  4. Added database constraints (`CheckConstraint(condition=models.Q(booked_quintals__lte=models.F('max_capacity_quintals')))`).
  5. Atomic booking cancellation returns capacity inside a locked transaction.

---

### 2.4 [HIGH] Duplicate Bookings & Network Replay: Lack of Idempotency (P0-6)
* **Vulnerability:** Double-clicking or retrying requests on poor rural networks caused multiple distinct booking records and consumed double slot capacity.
* **Remediation:**
  1. Added `Idempotency-Key` header support to `POST /api/slots/book/`.
  2. When a farmer retries an identical request with the same idempotency key, the server returns the existing booking record (`HTTP 200 OK`) without re-booking capacity.
  3. Unique indexed database constraint on `(farmer, idempotency_key)`.

---

### 2.5 [CRITICAL] Unverifiable & Spoofable QR Tokens (P0-7)
* **Vulnerability:** The frontend generated QR tokens using client-side `Math.random()` and encoded sensitive claims (Aadhaar, contact, custom URLs) into the QR string.
* **Remediation:**
  1. Authoritative `QRToken` generation is performed strictly on the backend upon successful slot booking transaction commit.
  2. Token payload uses an opaque HMAC-SHA256 signature generated with the server's `SECRET_KEY`.
  3. Zero PII: QR payload contains no Aadhaar, PAN, bank account numbers, or unnecessary personal data.

---

### 2.6 [CRITICAL] QR Token Replay Attacks at Mandi Gate (P0-8)
* **Vulnerability:** Mandi gate scanner endpoint marked tokens as used without rejecting already-used tokens, allowing a single gate pass to be used multiple times for entry.
* **Remediation:**
  1. Implemented a strict finite state machine for `QRToken`: `ISSUED` -> `SCANNED` -> `USED` (and `CANCELLED`, `EXPIRED`).
  2. Scanning endpoint `POST /api/tokens/scan/` utilizes row-level locking (`select_for_update()`) inside `transaction.atomic()`.
  3. Already-used tokens are atomically rejected with `HTTP 409 Conflict`.
  4. Tokens for other centers or future dates are rejected with `HTTP 403 Forbidden` and `HTTP 400 Bad Request`.

---

### 2.7 [HIGH] Overly Permissive Role-Based Access Control (P0-9)
* **Vulnerability:** Backend defaulted to `AllowAny` permission class across all endpoints. Any anonymous user could invoke operational endpoints.
* **Remediation:**
  1. Configured `DEFAULT_PERMISSION_CLASSES = ('rest_framework.permissions.IsAuthenticated',)` in `backend/config/settings.py`.
  2. Implemented domain role permission classes in `backend/common/permissions.py`:
     - `IsFarmer`: Confines access to own land, crops, bookings, and gate passes.
     - `IsCenterOperator`: Restricts gate entry and weighment operations to assigned centers.
     - `IsQualityInspector`: Confines access to quality inspection and assaying.
     - `IsOfficer`: Administrative monitoring and capacity adjustment.
  3. Farmer identity is taken strictly from `request.user` (JWT), never trusted from client request body.

---

### 2.8 [MEDIUM] Unsafe Django Settings Defaults (P0-10)
* **Vulnerability:** `DEBUG = True`, hardcoded insecure `SECRET_KEY`, and wildcard `CORS_ALLOW_ALL_ORIGINS = True`.
* **Remediation:**
  1. `DEBUG` defaults to `False` unless explicitly set in environment.
  2. `SECRET_KEY` is loaded strictly from environment and validated on startup.
  3. `CORS_ALLOWED_ORIGINS` and `ALLOWED_HOSTS` require explicit configuration.
  4. `CORS_ALLOW_ALL_ORIGINS = False`.

---

### 2.9 [HIGH] Password Reset Without Token Verification (P0-11)
* **Vulnerability:** Password reset endpoint accepted `email + new_password` without requiring a verified reset token.
* **Remediation:**
  1. Replaced with two-stage tokenized password reset:
     - `POST /api/auth/request-password-reset/`: Generates cryptographic token via Django's `default_token_generator`.
     - `POST /api/auth/reset-password/`: Requires `email`, `token`, and `new_password`.
  2. Direct password resets without tokens are rejected with `HTTP 400 Bad Request`.

---

### 2.10 [LOW] Misleading Government & Integration Claims (P0-12)
* **Vulnerability:** UI displayed claims such as "GOI SSO", "Government Verified", and "UIDAI Verified" without active government integrations.
* **Remediation:**
  1. Relabeled UI claims to "Demo Authentication", "Prototype SSO", and "Aadhaar Verhoeff Checksum Passed".
  2. Clarified demonstration badges for SIH evaluation.

---

## 3. Summary of Remediated Attack Vectors

| Attack Vector | Initial State | Hardened State | Status |
|---|---|---|---|
| **SMS Quota Hijacking** | Fast2SMS key in React code | Server-side env dispatch only | FIXED |
| **Fake OTP Login** | Accepts 849201 or any 6 digits | Salted SHA-256 backend verification | FIXED |
| **Slot Double-Booking** | Concurrent race condition | `select_for_update()` + DB constraints | FIXED |
| **Network Retry Duplication** | Multiple bookings created | `Idempotency-Key` deduplication | FIXED |
| **Fake Gate Pass Creation** | `Math.random()` in React | Backend HMAC-signed opaque token | FIXED |
| **Gate Pass Replay Attack** | Re-entry allowed | Atomic `select_for_update()` -> 409 Conflict | FIXED |
| **Cross-Farmer Tampering** | Client supplied `farmer_id` | Server derives farmer from JWT claims | FIXED |
| **Unauthenticated API Access** | Default `AllowAny` | Default `IsAuthenticated` + Granular RBAC | FIXED |
| **Arbitrary Password Reset** | No token required | Cryptographic reset token required | FIXED |
