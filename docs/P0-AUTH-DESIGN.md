# AAGAM — Authoritative Authentication & Identity Design (P0-1, P0-2, P0-11)

## 1. Overview
Authentication in the AAGAM system serves 7 critical stakeholder personas:
- **Farmers:** Land and crop registration, slot booking, gate pass management.
- **Center Operators:** Mandi gate admission, queue management, weighment.
- **Quality Inspectors:** Physical sampling, moisture analysis, grading.
- **Procurement Officers:** Mandi capacity oversight, rescheduling, dispute resolution.
- **Buyers / Millers:** Commercial grain procurement.
- **Logistics Providers:** Farm-to-mandi and mandi-to-warehouse transport dispatch.
- **Warehouse Managers:** Silo intake and stock management.

This document details the server-authoritative authentication architecture, elimination of mock fallbacks, and the strict isolation of the demonstration authentication mode.

---

## 2. Server-Authoritative Phone OTP Architecture (P0-1)

### State Machine & Security Controls
```text
Farmer Phone Number
       │
       ▼
POST /api/auth/request-otp/
       │
       ├── Rate Limit Check (Max 3 requests / 10 min window per phone)
       ├── Invalidate any existing unused OTPs for this phone
       ├── Generate 6-digit random code via cryptographically secure RNG
       ├── Generate unique random salt
       ├── Compute salted SHA-256 hash: hashlib.sha256((otp + salt).encode()).hexdigest()
       ├── Store PhoneOTP record:
       │     - phone
       │     - otp_hash
       │     - salt
       │     - expires_at = now + 5 minutes
       │     - max_attempts = 3
       │     - attempts = 0
       │     - is_consumed = False
       ▼
Dispatch SMS via server-side Fast2SMS gateway (Never expose key to client)
Return HTTP 200 OK (Never return raw OTP in production mode)
       │
       │  Farmer enters code on React UI
       ▼
POST /api/auth/verify-otp/
       │
       ├── Lookup active PhoneOTP for phone where is_consumed = False
       │     - If not found or expired (now > expires_at): HTTP 400 Bad Request
       │     - If attempts >= max_attempts: Invalidate and return HTTP 400 Bad Request
       │
       ├── Increment attempts += 1
       ├── Compute test hash with stored salt
       │     - If test_hash != otp_hash: HTTP 400 Bad Request ("Invalid OTP code")
       │
       ├── Verification Success:
       │     - Mark is_consumed = True (Atomic replay prevention)
       │     - Lookup or create User account
       │     - Generate SimpleJWT Refresh & Access Tokens
       ▼
Return HTTP 200 OK with { access, refresh, user }
```

### Security Guarantees
1. **Never Generated on Client:** React never creates or knows the authoritative OTP.
2. **Never Stored in Plaintext:** Only the salted SHA-256 hash is committed to the database.
3. **No Credential Logging:** Raw OTPs are omitted from application logs.
4. **Brute-Force Protected:** Capped at 3 failed attempts before permanent invalidation.
5. **No Universal Bypass:** Hardcoded `849201` and client-side bypasses have been eradicated.

---

## 3. SIH Evaluation Demonstration Mode (`DEMO_AUTH_MODE`)

To support live Smart India Hackathon (SIH) jury evaluations where physical SIM SMS reception may be constrained by network conditions or jury phone numbers:
1. Controlled via backend environment variable: `DEMO_AUTH_MODE=True`.
2. Dedicated endpoint: `POST /api/auth/demo-login/` with `{ "role": "FARMER" }`.
3. Verifies that `DEMO_AUTH_MODE` is explicitly active on the backend.
4. Retrieves seeded database persona (e.g. `farmer@aagam.gov.in`).
5. Generates **genuine, cryptographically signed SimpleJWT tokens**.
6. The frontend displays an explicit badge: `[DEMO MODE AUTHENTICATION]`.
7. When `DEMO_AUTH_MODE=False` (production), this endpoint is disabled and returns `HTTP 403 Forbidden`.

---

## 4. Token-Based Password Reset (P0-11)

### Previous Vulnerability
The legacy reset endpoint accepted `email + new_password` without proof of identity, allowing arbitrary account takeovers.

### Hardened Architecture
1. **Stage 1 — Reset Request:**
   ```http
   POST /api/auth/request-password-reset/
   { "email": "farmer@aagam.gov.in" }
   ```
   Generates a one-time cryptographic token using Django's `default_token_generator.make_token(user)`. Dispatches email or returns token under demo mode.

2. **Stage 2 — Reset Verification:**
   ```http
   POST /api/auth/reset-password/
   {
     "email": "farmer@aagam.gov.in",
     "token": "<cryptographic_token>",
     "new_password": "NewSecurePassword123!"
   }
   ```
   Validates token via `default_token_generator.check_token(user, token)`. Updates password hash using PBKDF2 with SHA-256.

---

## 5. Elimination of Mock Fallbacks (P0-2, P0-13)

- **LocalStorage Isolation:** LocalStorage stores only authentic JWT access tokens (`aagam_access_token`) and non-authoritative UI preferences. It cannot establish a session without a valid backend JWT.
- **No Client SSO Claims:** All random `GOI-SSO-TOKEN-` generators were removed.
- **Fail-Closed Paradigm:** If the backend fails or returns an error, the UI displays the error. It never silently creates fake users or proceeds with mock data.
