import os
import django
from datetime import date, timedelta
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from apps.accounts.models import User, UserRole
from apps.farmers.models import FarmerProfile, LandRecord
from apps.prices.models import MSPPrice, MarketPrice
from apps.marketplace.models import Listing
from apps.auctions.models import Auction, AuctionStatus
from apps.centers.models import ProcurementCenter, CenterCapacity
from apps.slots.models import SlotBooking, SlotBookingStatus
from apps.tokens.models import QRToken
from apps.payments.models import Payment, PaymentStatus, PaymentMethod

def seed_database():
    print("=== [AAGAM] Seeding PostgreSQL / SQLite Database... ===")

    # 1. Seed Default Users with valid Verhoeff Aadhaar
    users_data = [
        {
            "email": "farmer@aagam.gov.in",
            "full_name": "Sardar Harpreet Singh",
            "role": UserRole.FARMER,
            "phone": "+91 98765 43210",
            "aadhaar_number": "994820194828",
            "state": "Punjab",
            "district": "Ludhiana",
            "mandi": "Khanna Grain Market",
        },
        {
            "email": "buyer@aagam.gov.in",
            "full_name": "Rajesh Agarwal",
            "role": UserRole.BUYER,
            "phone": "+91 98110 88391",
            "aadhaar_number": "994820194828",
            "state": "Delhi",
            "district": "Delhi",
            "mandi": "Azadpur Mandi",
        },
        {
            "email": "officer@aagam.gov.in",
            "full_name": "Dr. Suresh Verma, IAS",
            "role": UserRole.OFFICER,
            "phone": "+91 94120 55012",
            "aadhaar_number": "994820194828",
            "state": "National",
            "district": "New Delhi",
            "mandi": "FCI Zonal HQ",
        },
        {
            "email": "operator@aagam.gov.in",
            "full_name": "Amit Kumar",
            "role": UserRole.CENTER_OPERATOR,
            "phone": "+91 98230 44918",
            "aadhaar_number": "994820194828",
            "state": "Haryana",
            "district": "Karnal",
            "mandi": "Karnal Central APMC",
        },
        {
            "email": "quality@aagam.gov.in",
            "full_name": "Dr. Anita Roy",
            "role": UserRole.QUALITY_INSPECTOR,
            "phone": "+91 98711 00291",
            "aadhaar_number": "994820194828",
            "state": "Haryana",
            "district": "Karnal",
            "mandi": "Karnal Central APMC",
        },
        {
            "email": "warehouse@aagam.gov.in",
            "full_name": "Sanjay Deshmukh",
            "role": UserRole.WAREHOUSE_MANAGER,
            "phone": "+91 98100 11029",
            "aadhaar_number": "994820194828",
            "state": "Haryana",
            "district": "Karnal",
            "mandi": "CWC Silo Complex #4",
        },
        {
            "email": "admin@aagam.gov.in",
            "full_name": "Vikramaditya Rao, Admin",
            "role": UserRole.ADMIN,
            "phone": "+91 99999 00001",
            "aadhaar_number": "994820194828",
            "state": "National Root",
            "district": "New Delhi",
            "mandi": "Ministry HQ",
        },
    ]

    created_users = {}
    for udata in users_data:
        user, created = User.objects.get_or_create(
            email=udata["email"],
            defaults={
                "username": udata["email"],
                "full_name": udata["full_name"],
                "role": udata["role"],
                "phone": udata["phone"],
                "aadhaar_number": udata["aadhaar_number"],
                "state": udata["state"],
                "district": udata["district"],
                "mandi": udata["mandi"],
                "is_verified": True,
                "is_active": True
            }
        )
        if udata["role"] == UserRole.ADMIN:
            user.is_staff = True
            user.is_superuser = True
        user.set_password("aagam@2026")
        user.save()
        created_users[udata["email"]] = user
        status_txt = "Created" if created else "Updated"
        print(f"  [User] {status_txt}: {user.full_name} ({user.email}) -> Role: {user.role}")

    # Farmer Profile & Land Record
    farmer_user = created_users.get("farmer@aagam.gov.in")
    if farmer_user:
        f_prof, _ = FarmerProfile.objects.get_or_create(
            user=farmer_user,
            defaults={
                "aadhaar_number": "994820194828",
                "kisan_credit_card": "KCC-PB-994821",
                "total_land_acres": Decimal("8.50"),
                "bank_account_no": "394820194827",
                "bank_ifsc": "SBIN0004829",
                "bank_name": "State Bank of India",
                "dbt_linked": True
            }
        )
        LandRecord.objects.get_or_create(
            farmer=farmer_user,
            khasra_number="42/18-A",
            defaults={
                "khatauni_number": "KH-882",
                "village": "Khanna",
                "tehsil": "Khanna",
                "district": "Ludhiana",
                "state": "Punjab",
                "area_acres": Decimal("4.25"),
                "soil_type": "Alluvial Loam",
                "is_verified": True
            }
        )
        print("  [FarmerProfile] Verified Sardar Harpreet Singh profile & land records.")

    # 2. Seed MSP Prices
    msp_data = [
        {"crop_code": "WHEAT-2026", "crop_name": "Wheat (FAQ Sharbati)", "crop_name_hi": "गेहूं", "season": "Rabi", "msp_rate": Decimal("2425.00"), "bonus_rate": Decimal("50.00")},
        {"crop_code": "PADDY-COMM-2026", "crop_name": "Paddy (Common)", "crop_name_hi": "धान (सामान्य)", "season": "Kharif", "msp_rate": Decimal("2300.00"), "bonus_rate": Decimal("0.00")},
        {"crop_code": "PADDY-GRDA-2026", "crop_name": "Paddy (Grade A)", "crop_name_hi": "धान (ग्रेड-ए)", "season": "Kharif", "msp_rate": Decimal("2320.00"), "bonus_rate": Decimal("25.00")},
        {"crop_code": "MUSTARD-2026", "crop_name": "Mustard / Rapeseed", "crop_name_hi": "सरसों / राई", "season": "Rabi", "msp_rate": Decimal("5950.00"), "bonus_rate": Decimal("100.00")},
        {"crop_code": "CHANA-2026", "crop_name": "Gram / Chana", "crop_name_hi": "चना", "season": "Rabi", "msp_rate": Decimal("5650.00"), "bonus_rate": Decimal("0.00")},
        {"crop_code": "MAIZE-2026", "crop_name": "Maize (Corn)", "crop_name_hi": "मक्का", "season": "Kharif", "msp_rate": Decimal("2225.00"), "bonus_rate": Decimal("0.00")},
        {"crop_code": "SOYBEAN-2026", "crop_name": "Soybean (Yellow)", "crop_name_hi": "सोयाबीन (पीला)", "season": "Kharif", "msp_rate": Decimal("4892.00"), "bonus_rate": Decimal("50.00")},
    ]

    for m in msp_data:
        MSPPrice.objects.update_or_create(
            crop_code=m["crop_code"],
            defaults=m
        )
    print(f"  [MSP] Seeded {len(msp_data)} Government MSP Price benchmarks.")

    # 3. Seed Market Mandi Rates
    market_rates = [
        {"crop_name": "Wheat (Sharbati)", "crop_name_hi": "गेहूं", "mandi_name": "Khanna Grain Market", "district": "Ludhiana", "state": "Punjab", "msp_price": Decimal("2425.00"), "min_rate": Decimal("2400.00"), "max_rate": Decimal("2680.00"), "modal_rate": Decimal("2580.00"), "open_market_rate": Decimal("2590.00"), "highest_offer": Decimal("2680.00"), "recommended_price": Decimal("2580.00"), "status_tag": "ABOVE MSP (+6.4%)", "trend": "up"},
        {"crop_name": "Paddy (Basmati PB-1121)", "crop_name_hi": "बासमती धान", "mandi_name": "Karnal Central APMC", "district": "Karnal", "state": "Haryana", "msp_price": Decimal("2320.00"), "min_rate": Decimal("3800.00"), "max_rate": Decimal("4350.00"), "modal_rate": Decimal("4120.00"), "open_market_rate": Decimal("4150.00"), "highest_offer": Decimal("4350.00"), "recommended_price": Decimal("4120.00"), "status_tag": "PREMIUM (+77.5%)", "trend": "up"},
        {"crop_name": "Mustard (Black Bold)", "crop_name_hi": "सरसों", "mandi_name": "Bharatpur Yard", "district": "Bharatpur", "state": "Rajasthan", "msp_price": Decimal("5950.00"), "min_rate": Decimal("5800.00"), "max_rate": Decimal("6250.00"), "modal_rate": Decimal("6120.00"), "open_market_rate": Decimal("6100.00"), "highest_offer": Decimal("6250.00"), "recommended_price": Decimal("6120.00"), "status_tag": "ABOVE MSP (+2.8%)", "trend": "up"},
        {"crop_name": "Chana (Desi)", "crop_name_hi": "चना", "mandi_name": "Latur APMC", "district": "Latur", "state": "Maharashtra", "msp_price": Decimal("5650.00"), "min_rate": Decimal("5550.00"), "max_rate": Decimal("5850.00"), "modal_rate": Decimal("5720.00"), "open_market_rate": Decimal("5700.00"), "highest_offer": Decimal("5850.00"), "recommended_price": Decimal("5720.00"), "status_tag": "STABLE", "trend": "stable"},
    ]

    for mr in market_rates:
        MarketPrice.objects.get_or_create(
            crop_name=mr["crop_name"],
            mandi_name=mr["mandi_name"],
            defaults=mr
        )
    print(f"  [MarketPrice] Seeded {len(market_rates)} Live Mandi Market rates.")

    # 4. Seed Procurement Centers
    center_1, _ = ProcurementCenter.objects.get_or_create(
        code="MND-HR-001",
        defaults={
            "name": "Karnal Central APMC Procurement Hub",
            "name_hi": "करनाल केंद्रीय एपीएमसी खरीद केंद्र",
            "state": "Haryana",
            "district": "Karnal",
            "address": "Sector 38, GT Road, Karnal",
            "officer_in_charge": created_users.get("officer@aagam.gov.in"),
            "daily_capacity_mt": Decimal("3500.00"),
            "operational_status": "ACTIVE",
            "contact_phone": "0184-2284918",
            "latitude": Decimal("29.685700"),
            "longitude": Decimal("76.990500"),
        }
    )

    center_2, _ = ProcurementCenter.objects.get_or_create(
        code="MND-PB-002",
        defaults={
            "name": "Khanna Grain Market Yard A",
            "name_hi": "खन्ना अनाज मंडी यार्ड ए",
            "state": "Punjab",
            "district": "Ludhiana",
            "address": "Asia's Largest Grain Market, Khanna",
            "officer_in_charge": created_users.get("officer@aagam.gov.in"),
            "daily_capacity_mt": Decimal("6000.00"),
            "operational_status": "ACTIVE",
            "contact_phone": "01628-220194",
            "latitude": Decimal("30.704600"),
            "longitude": Decimal("76.216300"),
        }
    )
    print("  [Centers] Seeded Karnal and Khanna procurement centers.")

    # 5. Seed Marketplace Listings
    listing_1, _ = Listing.objects.get_or_create(
        farmer=farmer_user,
        crop_name="Wheat (Sharbati HD-3086)",
        defaults={
            "farmer_name": "Sardar Harpreet Singh",
            "farmer_phone": "+91 98765 43210",
            "crop_name_hi": "गेहूं (शरबती)",
            "variety": "HD-3086 Certified FAQ",
            "quantity_quintals": Decimal("350.00"),
            "expected_price_per_qtl": Decimal("2650.00"),
            "msp_rate": Decimal("2425.00"),
            "quality_grade": "Grade A",
            "moisture_pct": Decimal("10.8"),
            "foreign_matter_pct": Decimal("0.4"),
            "mandi_location": "Khanna Grain Market",
            "district": "Ludhiana",
            "state": "Punjab",
            "status": "ACTIVE"
        }
    )
    print("  [Marketplace] Seeded active crop listings.")

    # 6. Seed Live E-Auctions
    now = timezone.now()
    auction_1, _ = Auction.objects.get_or_create(
        auction_code="AUC-PB-2026-0048",
        defaults={
            "crop_name": "Wheat (Sharbati FAQ Grade A)",
            "crop_name_hi": "गेहूं शरबती",
            "variety": "HD-3086 High Luster",
            "quality_grade": "Grade A (Assayed)",
            "moisture_percentage": Decimal("11.1"),
            "quantity_mt": Decimal("65.00"),
            "reserve_price": Decimal("2450.00"),
            "current_highest_bid": Decimal("2690.00"),
            "min_increment": Decimal("20.00"),
            "seller": farmer_user,
            "seller_name": "Sardar Harpreet Singh",
            "mandi_location": "Khanna Grain Market",
            "district": "Ludhiana",
            "state": "Punjab",
            "status": AuctionStatus.LIVE,
            "start_time": now - timedelta(minutes=45),
            "end_time": now + timedelta(minutes=75),
            "total_bids_count": 18
        }
    )
    print("  [Auctions] Seeded live auction room AUC-PB-2026-0048.")

    # 7. Seed Slot Bookings & QR Token
    booking_1, _ = SlotBooking.objects.get_or_create(
        token_number="AGM-TK-994821",
        defaults={
            "farmer": farmer_user,
            "farmer_name": "Sardar Harpreet Singh",
            "farmer_phone": "+91 98765 43210",
            "center": center_2,
            "mandi_name": "Khanna Grain Market Yard A",
            "state": "Punjab",
            "district": "Ludhiana",
            "commodity": "Wheat (Sharbati)",
            "quantity_quintals": Decimal("220.00"),
            "booking_date": date.today(),
            "time_slot": "10:00 AM - 12:00 PM",
            "lane": "Lane 02 - Weighbridge Gate 1",
            "vehicle_number": "PB-10-CZ-4829",
            "driver_name": "Gurdeep Singh",
            "status": SlotBookingStatus.CONFIRMED,
        }
    )

    QRToken.objects.get_or_create(
        token_string="AGM-TK-994821",
        defaults={
            "slot_booking": booking_1,
            "farmer_name": "Sardar Harpreet Singh",
            "mandi_name": "Khanna Grain Market Yard A",
            "crop_name": "Wheat (Sharbati)",
            "quantity_quintals": Decimal("220.00"),
            "date": date.today(),
            "time_slot": "10:00 AM - 12:00 PM",
            "lane": "Lane 02 - Weighbridge Gate 1",
            "is_used": False
        }
    )
    print("  [Slots & Tokens] Seeded confirmed slot booking & QR token AGM-TK-994821.")

    # 8. Seed Completed DBT Payment
    Payment.objects.get_or_create(
        payment_id="DBT-PAY-PB-2026-0941",
        defaults={
            "recipient": farmer_user,
            "recipient_name": "Sardar Harpreet Singh",
            "recipient_phone": "+91 98765 43210",
            "recipient_aadhaar": "9948-2019-4828",
            "bank_account": "394820194827",
            "bank_ifsc": "SBIN0004829",
            "bank_name": "State Bank of India",
            "commodity": "Wheat (Sharbati FAQ Grade A)",
            "quantity_quintals": Decimal("220.00"),
            "rate_per_qtl": Decimal("2425.00"),
            "gross_amount": Decimal("533500.00"),
            "deductions": Decimal("0.00"),
            "net_payout_amount": Decimal("533500.00"),
            "payment_method": PaymentMethod.DBT,
            "status": PaymentStatus.COMPLETED,
            "utr_number": "SBIN059482019284",
            "pfms_ref_no": "PFMS-GOI-AGRI-2026-00941"
        }
    )
    print("  [Payments] Seeded verified DBT payment record.")

    print("[SUCCESS] [AAGAM] Database seeding completed successfully!")

if __name__ == '__main__':
    seed_database()
