import os
import sys
import json
import uuid
import requests
from decimal import Decimal
from datetime import timedelta

BASE_URL = "http://127.0.0.1:8000"

def run_live_e2e_pipeline():
    print("=" * 70)
    print("AAGAM P0 FULL END-TO-END VERIFICATION: BROWSER/API -> DJANGO -> POSTGRESQL")
    print("=" * 70)
    audit_trail = []

    def log_step(step_name, status_code, details):
        entry = {
            "step": step_name,
            "status_code": status_code,
            "details": details
        }
        audit_trail.append(entry)
        print(f"\n[STEP] {step_name}")
        print(f"       HTTP Status: {status_code}")
        print(f"       Details: {json.dumps(details, indent=2)}")

    # Step 1: Health check
    res_health = requests.get(f"{BASE_URL}/api/health/")
    assert res_health.status_code == 200, f"Health check failed: {res_health.text}"
    health_data = res_health.json()["data"]
    log_step("1. Production Health Check", res_health.status_code, {
        "status": health_data["status"],
        "database": health_data["database"],
        "timestamp": health_data["timestamp"]
    })

    # Step 2: Farmer Registration / Registration Check
    test_mobile = "9876543201"
    # Ensure user exists for OTP verification
    register_payload = {
        "email": f"farmer_e2e_{uuid.uuid4().hex[:6]}@aagam.gov.in",
        "phone": f"+91{test_mobile}",
        "password": "E2ETestPassword123!",
        "role": "FARMER",
        "full_name": "Balwinder Singh",
        "state": "Haryana",
        "district": "Karnal",
        "mandi": "Karnal Central Yard"
    }
    res_reg = requests.post(f"{BASE_URL}/api/auth/register/", json=register_payload)
    if res_reg.status_code not in [200, 201]:
        print(f"Registration notice: {res_reg.text}")
    farmer_user = res_reg.json().get("data", {}).get("user", {})
    log_step("2. Farmer Registration", res_reg.status_code, {
        "name": register_payload["full_name"],
        "phone": register_payload["phone"],
        "role": register_payload["role"]
    })

    # Step 3: Farmer Request OTP (Authoritative Backend OTP Generation)
    res_otp_req = requests.post(f"{BASE_URL}/api/auth/request-otp/", json={"phone": test_mobile})
    assert res_otp_req.status_code == 200, f"Request OTP failed: {res_otp_req.text}"
    otp_data = res_otp_req.json().get("data", {})
    demo_otp = otp_data.get("demo_otp")
    log_step("3. Farmer Request OTP (Backend Authoritative)", res_otp_req.status_code, {
        "phone": otp_data.get("phone"),
        "expires_in_seconds": otp_data.get("expires_in_seconds"),
        "dispatched": otp_data.get("dispatched"),
        "demo_mode": otp_data.get("demo_mode")
    })

    # Step 4: Farmer Verify OTP -> Receive SimpleJWT tokens
    res_verify = requests.post(f"{BASE_URL}/api/auth/verify-otp/", json={
        "phone": test_mobile,
        "otp": demo_otp
    })
    assert res_verify.status_code == 200, f"Verify OTP failed: {res_verify.text}"
    auth_data = res_verify.json()["data"]
    farmer_access_token = auth_data["access"]
    farmer_headers = {
        "Authorization": f"Bearer {farmer_access_token}",
        "Content-Type": "application/json"
    }
    log_step("4. Farmer Verify OTP & Obtain Authoritative JWT", res_verify.status_code, {
        "user_id": auth_data["user"]["id"],
        "full_name": auth_data["user"]["full_name"],
        "role": auth_data["user"]["role"],
        "jwt_received": bool(farmer_access_token)
    })

    # Step 5: Center Selection
    res_centers = requests.get(f"{BASE_URL}/api/centers/", headers=farmer_headers)
    assert res_centers.status_code == 200, f"Get centers failed: {res_centers.text}"
    centers_list = res_centers.json().get("data", [])
    assert len(centers_list) > 0, "No active procurement centers found."
    selected_center = centers_list[0]
    center_id = selected_center["uuid"]
    log_step("5. Center Selection from Public/Auth Directory", res_centers.status_code, {
        "selected_center_name": selected_center["name"],
        "code": selected_center["code"],
        "district": selected_center["district"],
        "status": selected_center.get("operational_status", "ACTIVE")
    })

    # Step 6: Query Available Slots
    target_date = "2026-10-20"
    res_slots = requests.get(f"{BASE_URL}/api/slots/available/?center_id={center_id}&date={target_date}", headers=farmer_headers)
    assert res_slots.status_code == 200, f"Available slots query failed: {res_slots.text}"
    log_step("6. Query Center Slot Availability", res_slots.status_code, {
        "query_date": target_date,
        "slots_found": len(res_slots.json().get("data", []))
    })

    # Step 7: Authoritative Booking Request with Idempotency-Key
    idem_key = f"E2E-IDEM-{uuid.uuid4()}"
    booking_payload = {
        "center_id": str(center_id),
        "booking_date": target_date,
        "commodity": "Wheat (Kalyansona)",
        "time_slot": "09:00 AM - 11:00 AM",
        "quantity_quintals": "35.00",
        "lane": "Lane 02 - Central Yard",
        "vehicle_number": "HR-05-CD-9901",
        "driver_name": "Balwinder Singh"
    }
    booking_headers = dict(farmer_headers)
    booking_headers["Idempotency-Key"] = idem_key

    res_book = requests.post(f"{BASE_URL}/api/slots/book/", json=booking_payload, headers=booking_headers)
    assert res_book.status_code == 201, f"Booking failed: {res_book.text}"
    booking_data = res_book.json()["data"]
    booking_uuid = booking_data["uuid"]
    token_number = booking_data["token_number"]
    log_step("7. Authoritative Slot Booking & QR Issuance", res_book.status_code, {
        "booking_uuid": booking_uuid,
        "token_number": token_number,
        "status": booking_data["status"],
        "quantity_quintals": booking_data["quantity_quintals"],
        "commodity": booking_data["commodity"],
        "mandi_name": booking_data["mandi_name"]
    })

    # Step 8: Retrieve Farmer QR Token & Cryptographic Signature
    res_my_tokens = requests.get(f"{BASE_URL}/api/tokens/", headers=farmer_headers)
    assert res_my_tokens.status_code == 200, f"Token fetch failed: {res_my_tokens.text}"
    my_tokens = res_my_tokens.json().get("data", [])
    matching_token = next((t for t in my_tokens if t["token_string"] == token_number), None)
    assert matching_token is not None, f"Issued token {token_number} not found in farmer tokens."
    log_step("8. Farmer QR Token Verification", res_my_tokens.status_code, {
        "token_string": matching_token["token_string"],
        "status": matching_token["status"],
        "has_opaque_signature": bool(matching_token.get("opaque_signature")),
        "signature_sample": matching_token.get("opaque_signature", "")[:16] + "...",
        "has_qr_image_base64": bool(matching_token.get("qr_image_base64"))
    })

    # Step 9: Create and Authenticate Center Operator Persona
    operator_email = f"operator_e2e_{uuid.uuid4().hex[:6]}@aagam.gov.in"
    res_op_reg = requests.post(f"{BASE_URL}/api/auth/register/", json={
        "email": operator_email,
        "phone": "+919876543999",
        "password": "OperatorPass123!",
        "role": "CENTER_OPERATOR",
        "full_name": "Suresh Inspector",
        "mandi": selected_center["name"]
    })
    op_tokens = res_op_reg.json().get("data", {})
    operator_access_token = op_tokens["access"]
    operator_headers = {
        "Authorization": f"Bearer {operator_access_token}",
        "Content-Type": "application/json"
    }
    log_step("9. Authenticate Mandi Center Operator", res_op_reg.status_code, {
        "operator_name": "Suresh Inspector",
        "assigned_mandi": selected_center["name"],
        "jwt_issued": bool(operator_access_token)
    })

    # Step 10: Center Operator Scans QR Token at Mandi Gate
    scan_payload = {
        "token": matching_token["token_string"],
        "signature": matching_token.get("opaque_signature"),
        "vehicle_number": "HR-05-CD-9901",
        "driver_name": "Balwinder Singh",
        "allow_date_override": True  # allows simulation across test target date
    }
    res_scan = requests.post(f"{BASE_URL}/api/tokens/scan/", json=scan_payload, headers=operator_headers)
    assert res_scan.status_code == 200, f"Operator scan failed: {res_scan.text}"
    scan_res = res_scan.json()["data"]
    log_step("10. Center Operator Gate Scan & Token Verification", res_scan.status_code, {
        "access_granted": scan_res.get("access_granted"),
        "token_status_after_scan": scan_res.get("status"),
        "gate_pass_number": scan_res.get("gate_pass", {}).get("gate_pass_number"),
        "gate_entry_number": scan_res.get("gate_entry_number")
    })

    # Step 11: Verify Authoritative Status Machine & Queue Arrival
    res_farmer_bookings = requests.get(f"{BASE_URL}/api/slots/my-bookings/", headers=farmer_headers)
    assert res_farmer_bookings.status_code == 200
    farmer_bookings = res_farmer_bookings.json().get("data", [])
    updated_booking = next((b for b in farmer_bookings if b["uuid"] == booking_uuid), None)
    assert updated_booking is not None
    assert updated_booking["status"] == "ARRIVED", f"Expected booking status ARRIVED, got: {updated_booking['status']}"

    log_step("11. Farmer Booking Arrival & Yard State Machine Update", res_farmer_bookings.status_code, {
        "booking_uuid": booking_uuid,
        "token_number": token_number,
        "final_status": updated_booking["status"],
        "state_transition": "CONFIRMED -> ARRIVED (Authoritative Yard Entry)"
    })

    # Write report
    report_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "live_e2e_results.json")
    with open(report_file, "w") as f:
        json.dump(audit_trail, f, indent=2)
    print("\n" + "=" * 70)
    print("SUCCESS: Full 11-step end-to-end verification pipeline PASSED seamlessly!")
    print(f"Audit log saved to: {report_file}")
    print("=" * 70)

if __name__ == "__main__":
    run_live_e2e_pipeline()
