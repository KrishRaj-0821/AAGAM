# AAGAM — P0 Verification Test Matrix

**Total Tests:** 33 Automated Backend Tests  
**Execution Command:** `python manage.py test tests`  
**Overall Status:** 100% PASSED (0 Failures, 0 Errors)

---

## 1. Authentication Test Suite (`backend/tests/test_auth.py`)

| Test Case | Scenario / Attack Vector | Expected Result | Status |
|---|---|---|---|
| `test_request_otp_success` | Valid 10-digit mobile number requests OTP | Salted SHA-256 hash created, raw OTP not exposed | PASSED |
| `test_verify_otp_success` | Correct 6-digit OTP submitted within 5 mins | Valid JWT access/refresh issued, OTP marked consumed | PASSED |
| `test_wrong_otp_rejected` | Incorrect OTP submitted | HTTP 400 Bad Request, attempt counter incremented | PASSED |
| `test_expired_otp_rejected` | Valid OTP submitted after 5-minute expiry window | HTTP 400 Bad Request ("expired") | PASSED |
| `test_reused_otp_rejected` | Replay attack using previously verified OTP | HTTP 400 Bad Request ("already used / consumed") | PASSED |
| `test_otp_bruteforce_attempts_lockout` | 3 consecutive incorrect OTP submissions | 4th attempt rejected, token invalidated | PASSED |
| `test_otp_rate_limiting` | 4 OTP requests within a 10-minute window | 4th request rejected with HTTP 429 Too Many Requests | PASSED |
| `test_demo_login_flow` | Seeded persona quick-login under `DEMO_AUTH_MODE=True` | Authentic signed JWT issued for persona | PASSED |

---

## 2. Slot Booking & Concurrency Suite (`backend/tests/test_booking.py`)

| Test Case | Scenario / Attack Vector | Expected Result | Status |
|---|---|---|---|
| `test_booking_exceeding_capacity_rejected` | Single request for 20 QTL against a slot with 10 QTL remaining | HTTP 400 Bad Request ("Insufficient capacity") | PASSED |
| `test_closed_procurement_center_rejected` | Booking against inactive/closed procurement yard | HTTP 400 Bad Request ("not accepting bookings") | PASSED |
| `test_two_simultaneous_requests_for_last_slot` | 2 concurrent threads: Request A (15 QTL) & Request B (10 QTL) against 20 QTL remaining | Exactly one succeeds (201 Created), other rejected (400 Bad Request). Capacity never exceeded. | PASSED |
| `test_ten_concurrent_requests_capacity_boundary` | 10 concurrent threads each requesting 20 QTL against a 100 QTL slot (200 QTL requested) | Exactly 5 commit (100 QTL total), exactly 5 rejected (400 Bad Request). Slot marked unavailable. | PASSED |
| `test_repeated_identical_request_idempotent` | Farmer retries request with same `Idempotency-Key` | Existing booking returned with HTTP 200 OK. No double-capacity deduction. | PASSED |
| `test_cancelled_booking_returns_capacity` | Farmer cancels a confirmed 30 QTL booking | Status updated to CANCELLED, exactly 30 QTL restored to slot | PASSED |
| `test_expired_booking_rejected` | Booking requested for a past date | HTTP 400 Bad Request ("Cannot book slots for a past date") | PASSED |

---

## 3. QR Token Lifecycle & Replay Suite (`backend/tests/test_qr_lifecycle.py`)

| Test Case | Scenario / Attack Vector | Expected Result | Status |
|---|---|---|---|
| `test_valid_token_scan_grants_access` | First scan of a valid issued token on arrival day | HTTP 200 OK, transitions to USED, GateEntry ledger record created | PASSED |
| `test_already_used_token_scan_rejected` | Replay scan of an already-used gate pass | HTTP 409 Conflict ("already been used for gate entry") | PASSED |
| `test_expired_token_scan_rejected` | Scan of an expired token | HTTP 400 Bad Request ("expired") | PASSED |
| `test_cancelled_booking_token_scan_rejected` | Scan of a pass associated with a cancelled booking | HTTP 400 Bad Request ("cancelled") | PASSED |
| `test_wrong_center_scan_rejected` | Token presented at a different procurement center | HTTP 403 Forbidden ("designated for a different center") | PASSED |
| `test_wrong_date_future_scan_rejected` | Token presented before the scheduled arrival date | HTTP 400 Bad Request ("future date") | PASSED |
| `test_invalid_token_string_rejected` | Non-existent or forged token string presented | HTTP 404 Not Found | PASSED |
| `test_simultaneous_duplicate_scan_race_condition` | Two gate operators scanning the exact same token at the exact same moment | Exactly one receives 200 OK, other receives 409 Conflict | PASSED |

---

## 4. Role-Based Access Control (RBAC) Suite (`backend/tests/test_rbac.py`)

| Test Case | Scenario / Attack Vector | Expected Result | Status |
|---|---|---|---|
| `test_unauthenticated_booking_rejected` | Anonymous client attempting to book slot | HTTP 401 Unauthorized | PASSED |
| `test_unauthenticated_qr_scan_rejected` | Anonymous client attempting to scan gate token | HTTP 401 Unauthorized | PASSED |
| `test_farmer_accessing_another_farmer_booking` | Farmer A querying Farmer B's booking record | HTTP 403 Forbidden | PASSED |
| `test_farmer_calling_operator_endpoint` | Farmer attempting to record gate entry | HTTP 403 Forbidden | PASSED |
| `test_operator_accessing_another_center` | Operator assigned to Mandi A attempting to record gate entry at Mandi B | HTTP 403 Forbidden | PASSED |
| `test_server_determines_role_from_jwt` | Attacker passing spoofed `role: 'ADMIN'` in payload | Server evaluates role strictly from authenticated JWT token | PASSED |

---

## 5. Deployment & Configuration Suite (`backend/tests/test_deployment.py`)

| Test Case | Scenario / Attack Vector | Expected Result | Status |
|---|---|---|---|
| `test_health_check_endpoint` | Public health monitor pinging database connectivity | HTTP 200 OK with `database: "connected"` | PASSED |
| `test_unauthorized_request_rejected_by_default` | Any unspecified business endpoint invoked anonymously | HTTP 401 Unauthorized (`DEFAULT_PERMISSION_CLASSES` enforced) | PASSED |
| `test_debug_mode_disabled_by_default` | Default production settings check | `DEBUG is False` unless env explicitly overrides | PASSED |
| `test_cors_wildcard_disabled` | Inspecting CORS security settings | `CORS_ALLOW_ALL_ORIGINS is False` | PASSED |
