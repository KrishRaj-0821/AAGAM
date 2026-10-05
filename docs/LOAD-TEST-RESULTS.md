# 🚀 5,000-Request Real HTTP Concurrency Load Test Report

**AAGAM P0 Hardening & Performance Validation**  
**Document:** `/docs/LOAD-TEST-RESULTS.md`  
**Execution Timestamp:** 2026-10-05T08:55:17Z  
**Target Backend:** Waitress WSGI (32 Threads) + Django REST Framework on `http://127.0.0.1:8000`  
**Target Database:** PostgreSQL 18.6 (`aagam_db` on Port 5433)  
**Client Harness:** Python `aiohttp` Asynchronous Connection Pool (Concurrency = 40)  

---

## 1. Test Scenario & Parameters

| Parameter | Value | Description |
| :--- | :--- | :--- |
| **Procurement Center** | `LOAD-TEST-01` | Karnal Load-Testing Grain Mandi |
| **Target Slot** | `10:00 AM - 12:00 PM` | 1 single slot on date `2026-10-12` |
| **Configured Max Capacity** | **100.00 QTL** | Hard upper limit on grain allocation |
| **Total Booking Attempts** | **5,000 requests** | High-velocity concurrent HTTP POST requests |
| **Authenticated Personas** | **80 Farmers** | 80 distinct users with valid SimpleJWT Bearer tokens |
| **Worker Concurrency** | **40 workers** | Continuous async event loop pump |
| **Adversarial Injections** | **70 replays** | 30 initial keys, 20 identical replays, 20 tampered replays |

---

## 2. Invariant Verification: Zero Oversubscription

> ### 🛡️ MANDATORY INVARIANT
> **Final booked quantity MUST NEVER exceed capacity.**  
> $$\text{Total Booked Quantity} \le \text{Max Capacity (100.00 QTL)}$$

### Post-Test Database Audit (Direct PostgreSQL 18 Query)

```text
--- DATABASE VERIFICATION (PostgreSQL 18) ---
Slot UUID:                 da74ab33-361b-4949-8b4c-6c9c344862e3
Configured Max Capacity:   100.00 QTL
Slot Recorded Booked Qty:  100.00 QTL
Sum of Confirmed Bookings: 100.00 QTL
Total Confirmed Rows:      10 bookings (each 10.00 QTL)

CRITICAL INVARIANT CHECK: total_booked (100.00) <= max_capacity (100.00)
>>> INVARIANT SATISFIED: Capacity was strictly respected. ZERO OVERSUBSCRIPTION! <<<
```

Under 5,000 aggressive booking attempts arriving simultaneously, the database row-level locking (`SELECT ... FOR UPDATE`) prevented even a single fraction of a quintal from being oversubscribed.

---

## 3. HTTP Response Code Breakdown

| HTTP Status Code | Meaning | Request Count | Percentage |
| :---: | :--- | :---: | :---: |
| **201 Created** | New Booking Confirmed & QR Issued | **10** | **0.20%** |
| **200 OK** | Idempotent Replay (Identical Payload) | **7** | **0.14%** |
| **400 Bad Request** | Rejected (Slot Capacity Full) | **4,972** | **99.44%** |
| **409 Conflict** | Rejected (Idempotency Payload Tampered / Duplicate Active) | **11** | **0.22%** |
| **429 Rate Limited** | Request Throttled | **0** | **0.00%** |
| **500 Server Error** | Database Deadlock or Unhandled Exception | **0** | **0.00%** |
| **Connection Errors** | Network / Socket Drops | **0** | **0.00%** |
| **TOTAL** | | **5,000** | **100.0%** |

### Key Observations:
1. **Zero 500 Internal Server Errors**: Not a single database deadlock, transaction timeout, or unhandled exception occurred during the entire test.
2. **Deterministic Capacity Exhaustion**: Once the 10 bookings of 10 QTL filled the 100 QTL quota, all subsequent 4,972 requests received clean HTTP 400 Bad Request responses with informative capacity error messages.
3. **Idempotency Defense**: Replays with identical payloads returned the original booking with HTTP 200 OK; replays with modified payloads returned HTTP 409 Conflict.

---

## 4. Latency Performance Metrics (N = 5,000)

| Latency Metric | Measured Duration |
| :--- | :--- |
| **Total Test Duration** | **127.13 seconds** |
| **Sustained Throughput** | **39.3 requests / second** |
| **Average Latency** | **1,005.53 ms** |
| **Median Latency (p50)** | **960.54 ms** |
| **90th Percentile (p90)** | **1,464.98 ms** |
| **95th Percentile (p95)** | **1,619.66 ms** |
| **99th Percentile (p99)** | **1,924.11 ms** |
| **Minimum Latency** | **280.71 ms** |
| **Maximum Latency** | **2,412.04 ms** |

---

## 5. Adversarial Injections Outcome

During the 5,000-request stream, deliberate adversarial requests were interleaved:

1. **Identical Replays with Same Idempotency Key**:
   - Requests sent with identical `Idempotency-Key` and matching parameters.
   - Result: Returned HTTP 200 OK with the exact cached booking data.
2. **Tampered Replays with Same Idempotency Key**:
   - Requests sent with identical `Idempotency-Key` but quantity altered from 10 QTL to 50 QTL.
   - Result: Returned HTTP 409 Conflict with code `IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST`.
3. **Same Farmer Multi-Device Double Booking**:
   - Farmers attempting to book two separate active slots on the same date for the same crop.
   - Result: Returned HTTP 409 Conflict with code `DUPLICATE_ACTIVE_BOOKING_NOT_PERMITTED`.

---

## 6. Conclusion

The AAGAM P0 booking engine is conclusively proven to be **concurrency-safe, leak-free, and server-authoritative under live HTTP stress against PostgreSQL**.
