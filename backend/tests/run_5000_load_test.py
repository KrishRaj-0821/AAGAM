import os
import sys
import time
import json
import uuid
import random
import asyncio
from decimal import Decimal
from datetime import timedelta

# Set up Django environment
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.utils import timezone
from django.db import connection
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import User, UserRole
from apps.centers.models import ProcurementCenter
from apps.slots.models import Slot, SlotBooking, SlotBookingStatus
from apps.tokens.models import QRToken

import aiohttp


API_URL = "http://127.0.0.1:8000/api/slots/book/"
NUM_REQUESTS = 5000
CONCURRENCY = 40  # Concurrent HTTP workers
SLOT_CAPACITY = Decimal("100.00")


def seed_test_data():
    print("=" * 60)
    print("STAGE 1: Seeding PostgreSQL for 5000-Request Load Test")
    print("=" * 60)

    # 1. Clean previous load test data
    ProcurementCenter.objects.filter(code="LOAD-TEST-01").delete()
    User.objects.filter(email__startswith="farmer_load_").delete()

    # 2. Create Load Test Procurement Center
    center = ProcurementCenter.objects.create(
        name="Karnal Load-Testing Grain Mandi",
        code="LOAD-TEST-01",
        state="Haryana",
        district="Karnal",
        daily_capacity_mt=Decimal("100.00"),
        operational_status="ACTIVE"
    )
    print(f"Created ProcurementCenter: {center.name} ({center.code})")

    # 3. Create Target Slot (Strictly 100.00 QTL Capacity)
    target_date = timezone.localdate() + timedelta(days=7)
    time_slot = "10:00 AM - 12:00 PM"

    slot = Slot.objects.create(
        center=center,
        date=target_date,
        time_slot=time_slot,
        lane="Lane 01 - Load Test",
        max_capacity_quintals=SLOT_CAPACITY,
        booked_quintals=Decimal("0.00"),
        is_available=True
    )
    print(f"Created Slot: {slot.pk} on {target_date} [{time_slot}], Max Capacity = {slot.max_capacity_quintals} QTL")

    # 4. Create Pool of Authenticated Farmers with JWT Tokens
    num_farmers = 80
    farmers = []
    farmer_tokens = []
    print(f"Generating {num_farmers} authenticated farmer personas and JWT tokens...")

    for i in range(num_farmers):
        email = f"farmer_load_{i:03d}@aagam.gov.in"
        user = User.objects.create_user(
            email=email,
            password="LoadTestPassword123!",
            role=UserRole.FARMER,
            full_name=f"Farmer {i:03d}",
            phone=f"+9198{i:08d}"
        )
        farmers.append(user)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        farmer_tokens.append({
            "user": user,
            "token": access_token
        })

    print(f"Generated {len(farmer_tokens)} farmer credentials successfully.")
    return center, slot, target_date, time_slot, farmer_tokens


def generate_request_plan(center, slot, target_date, time_slot, farmer_tokens):
    print("=" * 60)
    print(f"STAGE 2: Generating {NUM_REQUESTS} Test Request Payloads")
    print("=" * 60)

    requests_plan = []
    
    # Track some keys for deliberate idempotency tests
    planned_idempotent_keys = []

    for req_idx in range(NUM_REQUESTS):
        # Pick farmer
        f_idx = req_idx % len(farmer_tokens)
        farmer_meta = farmer_tokens[f_idx]

        # Different scenarios:
        # First 20 requests: create initial idempotency keys to replay later
        if req_idx < 30:
            key = f"IDEM-LOAD-{req_idx:04d}-{uuid.uuid4().hex[:8]}"
            qty = "10.00"
            planned_idempotent_keys.append({"key": key, "farmer_meta": farmer_meta, "qty": qty})
            payload = {
                "center_id": str(center.uuid),
                "booking_date": str(target_date),
                "commodity": f"Wheat-{req_idx}",  # distinct commodity to test multi-device & capacity cleanly
                "time_slot": time_slot,
                "quantity_quintals": qty,
                "lane": "Lane 01 - Load Test"
            }
            requests_plan.append({
                "type": "standard",
                "key": key,
                "token": farmer_meta["token"],
                "payload": payload
            })
        elif req_idx < 60 and (req_idx - 30) < len(planned_idempotent_keys):
            # Deliberate Identical Replay (Requirement 3: same key, same payload -> 200 OK)
            orig = planned_idempotent_keys[req_idx - 30]
            payload = {
                "center_id": str(center.uuid),
                "booking_date": str(target_date),
                "commodity": f"Wheat-{req_idx - 30}",
                "time_slot": time_slot,
                "quantity_quintals": orig["qty"],
                "lane": "Lane 01 - Load Test"
            }
            requests_plan.append({
                "type": "idempotent_replay_identical",
                "key": orig["key"],
                "token": orig["farmer_meta"]["token"],
                "payload": payload
            })
        elif req_idx < 80 and (req_idx - 60) < len(planned_idempotent_keys):
            # Deliberate Tampered Replay (Requirement 3: same key, different payload -> 409 Conflict)
            orig = planned_idempotent_keys[req_idx - 60]
            payload = {
                "center_id": str(center.uuid),
                "booking_date": str(target_date),
                "commodity": f"Wheat-{req_idx - 60}",
                "time_slot": time_slot,
                "quantity_quintals": "50.00",  # Changed from 10.00
                "lane": "Lane 01 - Load Test"
            }
            requests_plan.append({
                "type": "idempotent_replay_tampered",
                "key": orig["key"],
                "token": orig["farmer_meta"]["token"],
                "payload": payload
            })
        else:
            # High-velocity booking attempts competing for remaining capacity
            # Quantities between 5.00 and 15.00 QTL
            qty = f"{random.choice([5, 8, 10, 12, 15, 20])}.00"
            key = f"IDEM-STRESS-{req_idx:05d}-{uuid.uuid4().hex[:8]}"
            # Some reuse commodity on same date for same farmer to test multi-device double booking prevention
            is_duplicate_attempt = (req_idx % 15 == 0)
            comm = "Wheat" if is_duplicate_attempt else f"Crop-{f_idx}-{req_idx % 5}"
            payload = {
                "center_id": str(center.uuid),
                "booking_date": str(target_date),
                "commodity": comm,
                "time_slot": time_slot,
                "quantity_quintals": qty,
                "lane": "Lane 01 - Load Test"
            }
            requests_plan.append({
                "type": "stress_attempt",
                "key": key,
                "token": farmer_meta["token"],
                "payload": payload
            })

    # Shuffle the requests (except initial ones) to simulate realistic concurrent arrivals
    prefix = requests_plan[:80]
    rest = requests_plan[80:]
    random.shuffle(rest)
    final_plan = prefix + rest
    print(f"Prepared {len(final_plan)} total request payloads.")
    return final_plan


async def send_booking_request(session, req_meta, semaphore, results):
    headers = {
        "Authorization": f"Bearer {req_meta['token']}",
        "Content-Type": "application/json",
        "Idempotency-Key": req_meta["key"]
    }
    async with semaphore:
        t0 = time.perf_counter()
        try:
            async with session.post(API_URL, json=req_meta["payload"], headers=headers, timeout=aiohttp.ClientTimeout(total=20)) as resp:
                elapsed_ms = (time.perf_counter() - t0) * 1000.0
                status_code = resp.status
                try:
                    body = await resp.json()
                except Exception:
                    body = await resp.text()

                results.append({
                    "status_code": status_code,
                    "elapsed_ms": elapsed_ms,
                    "type": req_meta["type"],
                    "body": body
                })
        except Exception as e:
            elapsed_ms = (time.perf_counter() - t0) * 1000.0
            results.append({
                "status_code": 0,
                "elapsed_ms": elapsed_ms,
                "type": req_meta["type"],
                "error": str(e)
            })


async def run_http_load_test(requests_plan):
    print("=" * 60)
    print(f"STAGE 3: Executing Real HTTP Load Test ({NUM_REQUESTS} Requests, Concurrency = {CONCURRENCY})")
    print("=" * 60)

    semaphore = asyncio.Semaphore(CONCURRENCY)
    connector = aiohttp.TCPConnector(limit=CONCURRENCY * 2, keepalive_timeout=30)
    results = []

    start_wall_clock = time.time()
    start_cpu = time.perf_counter()

    async with aiohttp.ClientSession(connector=connector) as session:
        # Progress logger
        async def progress_reporter():
            while len(results) < len(requests_plan):
                await asyncio.sleep(2)
                done = len(results)
                pct = (done / len(requests_plan)) * 100.0
                print(f"  [Progress] {done}/{len(requests_plan)} requests completed ({pct:.1f}%)...")

        reporter_task = asyncio.create_task(progress_reporter())
        tasks = [send_booking_request(session, r, semaphore, results) for r in requests_plan]
        await asyncio.gather(*tasks)
        reporter_task.cancel()

    total_duration_sec = time.perf_counter() - start_cpu
    print(f"\nAll {len(results)} HTTP requests finished in {total_duration_sec:.2f} seconds ({len(results)/total_duration_sec:.1f} req/sec).")
    return results, total_duration_sec


def analyze_and_verify(slot_id, results, total_duration_sec):
    print("=" * 60)
    print("STAGE 4: Verifying Invariants and Calculating Concurrency Metrics")
    print("=" * 60)

    # 1. Inspect PostgreSQL Database Directly
    slot = Slot.objects.get(pk=slot_id)
    confirmed_bookings = SlotBooking.objects.filter(slot=slot, status=SlotBookingStatus.CONFIRMED)
    total_booked_qty = sum(b.quantity_quintals for b in confirmed_bookings)

    print(f"\n--- DATABASE VERIFICATION (PostgreSQL 18) ---")
    print(f"Slot ID: {slot.pk}")
    print(f"Configured Max Capacity: {slot.max_capacity_quintals} QTL")
    print(f"Slot Recorded Booked Qty: {slot.booked_quintals} QTL")
    print(f"Sum of Confirmed Bookings: {total_booked_qty} QTL")
    print(f"Total Confirmed Booking Rows: {confirmed_bookings.count()}")

    # INVARIANT CHECK
    invariant_passed = (total_booked_qty <= slot.max_capacity_quintals) and (total_booked_qty == slot.booked_quintals)
    print(f"\nCRITICAL INVARIANT CHECK: total_booked ({total_booked_qty}) <= max_capacity ({slot.max_capacity_quintals})")
    if invariant_passed:
        print(">>> INVARIANT SATISFIED: Capacity was strictly respected. ZERO OVERSUBSCRIPTION! <<<")
    else:
        print(">>> FATAL INVARIANT VIOLATION: Capacity exceeded or DB desynchronization! <<<")

    # 2. HTTP Metrics Analysis
    status_counts = {}
    latencies = []
    error_count = 0
    replay_identical_success = 0
    replay_tampered_rejected = 0

    for r in results:
        code = r["status_code"]
        status_counts[code] = status_counts.get(code, 0) + 1
        latencies.append(r["elapsed_ms"])
        if code == 0:
            error_count += 1

        if r["type"] == "idempotent_replay_identical" and code == 200:
            replay_identical_success += 1
        if r["type"] == "idempotent_replay_tampered" and code == 409:
            replay_tampered_rejected += 1

    latencies.sort()
    avg_latency = sum(latencies) / len(latencies) if latencies else 0
    p50_latency = latencies[int(len(latencies) * 0.50)] if latencies else 0
    p90_latency = latencies[int(len(latencies) * 0.90)] if latencies else 0
    p95_latency = latencies[int(len(latencies) * 0.95)] if latencies else 0
    p99_latency = latencies[int(len(latencies) * 0.99)] if latencies else 0

    print(f"\n--- HTTP RESPONSE CODE BREAKDOWN ---")
    for code, count in sorted(status_counts.items()):
        status_name = {
            201: "Created (New Booking Confirmed)",
            200: "OK (Idempotent Cached Return)",
            400: "Bad Request (Capacity Full / Past Date)",
            409: "Conflict (Duplicate Active / Tampered Idempotency Key)",
            429: "Too Many Requests (Rate Limited)",
            500: "Internal Server Error",
            0: "Network Connection Error"
        }.get(code, "Other")
        print(f"  HTTP {code:3d} [{status_name}]: {count:5d} requests ({count/len(results)*100:.2f}%)")

    print(f"\n--- LATENCY PERFORMANCE (N = {len(results)}) ---")
    print(f"  Total Duration:     {total_duration_sec:.2f} s")
    print(f"  Throughput:         {len(results) / total_duration_sec:.1f} requests/sec")
    print(f"  Average Latency:    {avg_latency:.2f} ms")
    print(f"  Median (p50):       {p50_latency:.2f} ms")
    print(f"  p90 Latency:        {p90_latency:.2f} ms")
    print(f"  p95 Latency:        {p95_latency:.2f} ms")
    print(f"  p99 Latency:        {p99_latency:.2f} ms")
    print(f"  Max Latency:        {max(latencies):.2f} ms")
    print(f"  Min Latency:        {min(latencies):.2f} ms")

    print(f"\n--- ADVERSARIAL VALIDATION OUTCOMES ---")
    print(f"  Identical Idempotent Replays: {replay_identical_success} succeeded with HTTP 200")
    print(f"  Tampered Idempotent Replays:  {replay_tampered_rejected} rejected with HTTP 409")

    # Compile report data structure
    report = {
        "test_timestamp": timezone.now().isoformat(),
        "database": "PostgreSQL 18.6",
        "concurrency_tool": "aiohttp asynchronous load client",
        "total_requests": len(results),
        "concurrency_workers": CONCURRENCY,
        "total_duration_seconds": round(total_duration_sec, 2),
        "throughput_rps": round(len(results) / total_duration_sec, 2),
        "slot_capacity_quintals": float(slot.max_capacity_quintals),
        "final_booked_quintals": float(total_booked_qty),
        "confirmed_booking_rows": confirmed_bookings.count(),
        "invariant_satisfied": invariant_passed,
        "response_code_counts": status_counts,
        "latency_ms": {
            "avg": round(avg_latency, 2),
            "p50": round(p50_latency, 2),
            "p90": round(p90_latency, 2),
            "p95": round(p95_latency, 2),
            "p99": round(p99_latency, 2),
            "min": round(min(latencies), 2),
            "max": round(max(latencies), 2)
        },
        "adversarial_checks": {
            "replay_identical_200_count": replay_identical_success,
            "replay_tampered_409_count": replay_tampered_rejected
        }
    }

    out_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "load_test_results.json")
    with open(out_file, "w") as f:
        json.dump(report, f, indent=2)
    print(f"\nDetailed metrics saved to: {out_file}")

    return report


def main():
    center, slot, target_date, time_slot, farmer_tokens = seed_test_data()
    requests_plan = generate_request_plan(center, slot, target_date, time_slot, farmer_tokens)
    results, duration = asyncio.run(run_http_load_test(requests_plan))
    analyze_and_verify(slot.pk, results, duration)


if __name__ == "__main__":
    main()
