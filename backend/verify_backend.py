import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
from apps.accounts.models import User, UserRole
from apps.prices.models import MSPPrice, MarketPrice
from apps.marketplace.models import Listing
from apps.auctions.models import Auction
from apps.centers.models import ProcurementCenter
from apps.slots.models import SlotBooking
from apps.tokens.models import QRToken
from apps.payments.models import Payment

def test_all_endpoints():
    client = Client()
    print("=== Testing AAGAM Django REST API Endpoints ===")

    # 1. Health check
    res = client.get('/api/health/')
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    print("[PASS] GET /api/health/ ->", res.json()['data']['status'])

    # 2. Auth Login
    res = client.post('/api/auth/login/', {'email': 'farmer@aagam.gov.in', 'password': 'aagam@2026'}, content_type='application/json')
    assert res.status_code == 200, f"Login failed: {res.status_code} {res.content}"
    access_token = res.json()['data']['access']
    auth_header = {'HTTP_AUTHORIZATION': f'Bearer {access_token}'}
    print("[PASS] POST /api/auth/login/ -> Access Token received for", res.json()['data']['user']['full_name'])

    # 3. Farmer Dashboard
    res = client.get('/api/farmer/dashboard/', **auth_header)
    assert res.status_code == 200
    print("[PASS] GET /api/farmer/dashboard/ ->", res.json()['data']['statistics'])

    # 4. Prices & MSP
    res = client.get('/api/prices/')
    assert res.status_code == 200
    print(f"[PASS] GET /api/prices/ -> {len(res.json()['data'])} mandi rates loaded")

    # 5. Marketplace Listings
    res = client.get('/api/marketplace/listings/')
    assert res.status_code == 200
    print(f"[PASS] GET /api/marketplace/listings/ -> {len(res.json()['data'])} listings loaded")

    # 6. Live Auctions
    res = client.get('/api/auctions/')
    assert res.status_code == 200
    print(f"[PASS] GET /api/auctions/ -> {len(res.json()['data'])} auctions loaded")

    # 7. Procurement Centers & Slots
    res = client.get('/api/centers/')
    assert res.status_code == 200
    print(f"[PASS] GET /api/centers/ -> {len(res.json()['data'])} centers loaded")

    # 8. Slot Bookings
    res = client.get('/api/slots/')
    assert res.status_code == 200
    print(f"[PASS] GET /api/slots/ -> {len(res.json()['data'])} slot bookings loaded")

    # 9. DBT Payments
    res = client.get('/api/payments/')
    assert res.status_code == 200
    print(f"[PASS] GET /api/payments/ -> {len(res.json()['data'])} payment records loaded")

    # 10. Analytics Persona Dashboards
    for role in ['farmer', 'buyer', 'officer', 'center_operator', 'quality_inspector', 'logistics', 'warehouse', 'admin']:
        res = client.get(f'/api/analytics/dashboards/{role}/')
        assert res.status_code == 200
        print(f"[PASS] GET /api/analytics/dashboards/{role}/ -> {res.json()['data']['role']} metrics verified")

    print("\n ALL AAGAM DJANGO BACKEND TESTS PASSED PERFECTLY!")

if __name__ == '__main__':
    test_all_endpoints()
