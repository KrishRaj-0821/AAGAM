import datetime
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.accounts.models import User, UserRole
from apps.farmers.models import FarmerProfile, LandRecord
from apps.buyers.models import BuyerProfile, BuyerPurchase
from apps.crops.models import CropCategory, Crop
from apps.prices.models import MSPPrice, MarketPrice, PriceHistory
from apps.marketplace.models import Listing, BuyerOffer
from apps.auctions.models import Auction, Bid, AuctionStatus
from apps.centers.models import ProcurementCenter, CenterCapacity
from apps.slots.models import SlotBooking, SlotBookingStatus
from apps.tokens.models import QRToken, GatePass
from apps.operations.models import GateEntry, WeighmentSlip
from apps.quality.models import QualityInspection, AIQualityAnalysis
from apps.logistics.models import LogisticsProviderProfile, Driver, Vehicle, TransportRequest, TransportBooking
from apps.warehouses.models import Warehouse, Inventory, StockMovement
from apps.payments.models import Payment
from apps.notifications.models import Notification
from apps.traceability.models import CropTraceability, TraceabilityStage
from apps.analytics.models import ArrivalForecast, CongestionAlert

class Command(BaseCommand):
    help = 'Seeds complete database with initial demo records matching AAGAM portal'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding AAGAM Database..."))

        # 1. Create Users for 10 personas
        users_data = [
            {"email": "farmer@aagam.gov.in", "full_name": "Sardar Harpreet Singh", "role": UserRole.FARMER, "phone": "+91 98765 43210", "state": "Haryana", "district": "Karnal", "mandi": "Karnal Central APMC"},
            {"email": "buyer@aagam.gov.in", "full_name": "Rajesh Singhania", "role": UserRole.BUYER, "phone": "+91 98111 22334", "state": "Haryana", "district": "Gurugram", "mandi": "All Mandis"},
            {"email": "officer@aagam.gov.in", "full_name": "Smt. Sunita Verma", "role": UserRole.OFFICER, "phone": "+91 94160 11223", "state": "Haryana", "district": "Karnal", "mandi": "Karnal Central Grain Yard"},
            {"email": "operator@aagam.gov.in", "full_name": "Ramesh Chand", "role": UserRole.CENTER_OPERATOR, "phone": "+91 98960 33445", "state": "Haryana", "district": "Karnal", "mandi": "Karnal Central APMC"},
            {"email": "inspector@aagam.gov.in", "full_name": "Dr. R. K. Sharma", "role": UserRole.QUALITY_INSPECTOR, "phone": "+91 97280 44556", "state": "Haryana", "district": "Karnal", "mandi": "NIR Assay Lab 04"},
            {"email": "logistics@aagam.gov.in", "full_name": "Baldev Singh", "role": UserRole.LOGISTICS_PROVIDER, "phone": "+91 94160 55421", "state": "Haryana", "district": "Karnal", "mandi": "Karnal Freight Hub"},
            {"email": "warehouse@aagam.gov.in", "full_name": "V. K. Aggarwal", "role": UserRole.WAREHOUSE_MANAGER, "phone": "+91 98120 66778", "state": "Haryana", "district": "Panipat", "mandi": "CWC Silo Complex 04"},
            {"email": "admin@aagam.gov.in", "full_name": "National System Admin", "role": UserRole.ADMIN, "phone": "+91 1800 180 1551", "state": "New Delhi", "district": "Central Delhi", "mandi": "Ministry of Agriculture"},
            {"email": "superadmin@aagam.gov.in", "full_name": "Super Administrator", "role": UserRole.SUPER_ADMIN, "phone": "+91 1800 180 9999", "state": "New Delhi", "district": "Central Delhi", "mandi": "National Agri Stack"},
        ]

        created_users = {}
        for u in users_data:
            user, created = User.objects.get_or_create(
                email=u["email"],
                defaults={
                    "full_name": u["full_name"],
                    "username": u["email"],
                    "role": u["role"],
                    "phone": u["phone"],
                    "state": u["state"],
                    "district": u["district"],
                    "mandi": u["mandi"],
                    "is_staff": u["role"] in [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OFFICER],
                    "is_superuser": u["role"] == UserRole.SUPER_ADMIN,
                }
            )
            user.set_password("aagam@2026")
            user.save()
            created_users[u["role"]] = user

        # Sub-profiles
        FarmerProfile.objects.get_or_create(
            user=created_users[UserRole.FARMER],
            defaults={
                "kisan_credit_card": "KCC-HR-998241",
                "total_land_acres": 8.7,
                "soil_health_card_id": "SHC-2025-4120",
                "bank_account_no": "982100341829",
                "bank_ifsc": "PUNB0021400",
                "bank_name": "Punjab National Bank",
                "dbt_linked": True
            }
        )

        LandRecord.objects.get_or_create(
            farmer=created_users[UserRole.FARMER],
            khasra_number="412/18",
            defaults={
                "khatauni_number": "094-KH",
                "village": "Gharaunda",
                "tehsil": "Karnal",
                "district": "Karnal",
                "state": "Haryana",
                "area_acres": 5.5,
                "soil_type": "Alluvial Loam",
                "irrigation_source": "Canal & Tube Well",
                "is_verified": True
            }
        )

        BuyerProfile.objects.get_or_create(
            user=created_users[UserRole.BUYER],
            defaults={
                "company_name": "Adani Agri Logistics Ltd",
                "gstin": "06AAACA1234B1Z5",
                "enam_license_no": "ENAM-LIC-2025-882",
                "wallet_balance": 5000000.00,
                "verified_buyer": True
            }
        )

        LogisticsProviderProfile.objects.get_or_create(
            user=created_users[UserRole.LOGISTICS_PROVIDER],
            defaults={
                "fleet_name": "Kisan Freight Carrier Network",
                "fleet_size": 45,
                "license_number": "AGRI-LOG-LIC-9982",
                "service_states": "Haryana, Punjab, Rajasthan, Uttar Pradesh",
                "contact_phone": "+91 94160 55421",
                "rating": 4.8
            }
        )

        # 2. MSP 2025-2026 Master Rates
        msp_items = [
            {"crop_code": "wheat", "crop_name": "Wheat (Sharbati / Lokwan)", "crop_name_hi": "गेहूं (सरबती / लोकवान)", "season": "Rabi", "msp_rate": 2425.0},
            {"crop_code": "paddyCommon", "crop_name": "Paddy (Common)", "crop_name_hi": "धान (सामान्य)", "season": "Kharif", "msp_rate": 2300.0},
            {"crop_code": "paddyGradeA", "crop_name": "Paddy (Grade A / Basmati)", "crop_name_hi": "धान (ग्रेड ए / बासमती)", "season": "Kharif", "msp_rate": 2320.0},
            {"crop_code": "mustard", "crop_name": "Mustard / Rapeseed", "crop_name_hi": "सरसों / तोरिया", "season": "Rabi", "msp_rate": 5950.0},
            {"crop_code": "chana", "crop_name": "Gram (Chana / Desi)", "crop_name_hi": "चना (देशी / काबुली)", "season": "Rabi", "msp_rate": 5650.0},
            {"crop_code": "cottonLong", "crop_name": "Cotton (Long Staple)", "crop_name_hi": "कपास (लंबा रेशा)", "season": "Kharif", "msp_rate": 7521.0},
            {"crop_code": "soyabean", "crop_name": "Soyabean (Yellow)", "crop_name_hi": "सोयाबीन (पीला)", "season": "Kharif", "msp_rate": 4892.0},
            {"crop_code": "maize", "crop_name": "Maize (Kharif Hybrid)", "crop_name_hi": "मक्का (हाइब्रिड)", "season": "Kharif", "msp_rate": 2225.0},
            {"crop_code": "moong", "crop_name": "Moong (Green Gram)", "crop_name_hi": "मूंग (हरा चना)", "season": "Kharif", "msp_rate": 8682.0},
            {"crop_code": "urad", "crop_name": "Urad (Black Gram)", "crop_name_hi": "उड़द (काली दाल)", "season": "Kharif", "msp_rate": 7400.0},
            {"crop_code": "tur", "crop_name": "Tur / Arhar (Red Gram)", "crop_name_hi": "अरहर / तूर", "season": "Kharif", "msp_rate": 7550.0},
        ]
        for m in msp_items:
            MSPPrice.objects.get_or_create(crop_code=m["crop_code"], defaults=m)

        # 3. Live Mandi Market Prices
        mandi_rates = [
            {"crop_name": "Wheat (Sharbati)", "crop_name_hi": "गेहूं (सरबती)", "variety": "HD-3086 / Sharbati", "mandi_name": "Karnal Central Yard", "mandi_name_hi": "करनाल केंद्रीय यार्ड", "district": "Karnal", "state": "Haryana", "msp_price": 2425, "min_rate": 2430, "max_rate": 2680, "modal_rate": 2590, "open_market_rate": 2680, "highest_offer": 2720, "recommended_price": 2650, "arrivals_today": "1,420 MT", "status_tag": "ABOVE MSP (+₹165)", "trend": "up"},
            {"crop_name": "Paddy (Basmati 1121)", "crop_name_hi": "धान (बासमती 1121)", "variety": "Pusa Basmati 1121", "mandi_name": "Tarn Taran Mandi", "mandi_name_hi": "तरनतारन मंडी", "district": "Tarn Taran", "state": "Punjab", "msp_price": 2300, "min_rate": 3800, "max_rate": 4350, "modal_rate": 4180, "open_market_rate": 4250, "highest_offer": 4300, "recommended_price": 4200, "arrivals_today": "3,120 MT", "status_tag": "PREMIUM (+₹1,880)", "trend": "up"},
            {"crop_name": "Mustard (Bold Seed)", "crop_name_hi": "सरसों (मोटा दाना)", "variety": "Giriraj Bold 52%", "mandi_name": "Bharatpur APMC", "mandi_name_hi": "भरतपुर मंडी", "district": "Bharatpur", "state": "Rajasthan", "msp_price": 5950, "min_rate": 6100, "max_rate": 6550, "modal_rate": 6340, "open_market_rate": 6400, "highest_offer": 6450, "recommended_price": 6380, "arrivals_today": "980 MT", "status_tag": "ABOVE MSP (+₹390)", "trend": "up"},
            {"crop_name": "Chana (Desi Gram)", "crop_name_hi": "चना (देशी)", "variety": "Vijay Desi Bold", "mandi_name": "Latur APMC Yard", "mandi_name_hi": "लातूर मंडी", "district": "Latur", "state": "Maharashtra", "msp_price": 5650, "min_rate": 5650, "max_rate": 5950, "modal_rate": 5820, "open_market_rate": 5850, "highest_offer": 5900, "recommended_price": 5850, "arrivals_today": "1,150 MT", "status_tag": "ABOVE MSP (+₹170)", "trend": "up"},
            {"crop_name": "Soyabean (Yellow)", "crop_name_hi": "सोयाबीन (पीला)", "variety": "JS-9560 Certified", "mandi_name": "Ujjain Grain Market", "mandi_name_hi": "उज्जैन मंडी", "district": "Ujjain", "state": "Madhya Pradesh", "msp_price": 4892, "min_rate": 4900, "max_rate": 5120, "modal_rate": 4980, "open_market_rate": 5050, "highest_offer": 5100, "recommended_price": 5000, "arrivals_today": "1,640 MT", "status_tag": "ABOVE MSP (+₹88)", "trend": "up"},
            {"crop_name": "Cotton (Long Staple)", "crop_name_hi": "कपास (लंबा रेशा)", "variety": "Shankar-6 Premium", "mandi_name": "Rajkot Main APMC", "mandi_name_hi": "राजकोट यार्ड", "district": "Rajkot", "state": "Gujarat", "msp_price": 7521, "min_rate": 7650, "max_rate": 8150, "modal_rate": 7920, "open_market_rate": 7980, "highest_offer": 8050, "recommended_price": 7950, "arrivals_today": "840 MT", "status_tag": "ABOVE MSP (+₹399)", "trend": "up"},
        ]
        for mr in mandi_rates:
            MarketPrice.objects.get_or_create(crop_name=mr["crop_name"], mandi_name=mr["mandi_name"], defaults=mr)

        # 4. Crop Categories & Crops
        cat_rabi, _ = CropCategory.objects.get_or_create(name="Rabi Crops", defaults={"name_hi": "रबी फसलें", "season": "Rabi", "icon": "Wheat"})
        cat_kharif, _ = CropCategory.objects.get_or_create(name="Kharif Crops", defaults={"name_hi": "खरीफ फसलें", "season": "Kharif", "icon": "Sprout"})

        Crop.objects.get_or_create(
            crop_name="Wheat (Sharbati HD-3086)",
            defaults={
                "farmer": created_users[UserRole.FARMER],
                "farmer_name": "Sardar Harpreet Singh",
                "category": cat_rabi,
                "variety": "HD-3086 Certified",
                "quantity": 180.0,
                "unit": "Quintal",
                "expected_price": 2580.0,
                "quality_grade": "Grade A",
                "moisture_percentage": 11.2,
                "location": "Karnal Central APMC, Haryana",
                "description": "Premium certified high-protein Sharbati wheat.",
                "status": "AVAILABLE"
            }
        )

        # 5. Marketplace Listings & Offers
        listing, _ = Listing.objects.get_or_create(
            crop_name="Wheat (Sharbati Premium HD-3086)",
            defaults={
                "farmer": created_users[UserRole.FARMER],
                "farmer_name": "Sardar Harpreet Singh",
                "variety": "HD-3086 Premium",
                "quantity_quintals": 240.0,
                "expected_price_per_qtl": 2650.0,
                "msp_rate": 2425.0,
                "quality_grade": "Grade A",
                "moisture_pct": 11.2,
                "foreign_matter_pct": 0.8,
                "mandi_location": "Karnal Central APMC",
                "district": "Karnal",
                "state": "Haryana",
                "status": "ACTIVE"
            }
        )

        BuyerOffer.objects.get_or_create(
            listing=listing,
            buyer_name="ITC Agri Division",
            defaults={
                "buyer": created_users[UserRole.BUYER],
                "buyer_company": "ITC Ltd - Agri Business",
                "offered_price_per_qtl": 2680.0,
                "requested_qty_quintals": 240.0,
                "total_offer_value": 643200.0,
                "status": "PENDING",
                "message": "Ready to pick up immediately via AAGAM logistics fleet with instant escrow settlement."
            }
        )

        # 6. Live E-Auctions & Bids
        now = timezone.now()
        auction, _ = Auction.objects.get_or_create(
            auction_code="LOT-2026-8812",
            defaults={
                "crop_name": "Wheat (Sharbati HD-3086)",
                "crop_name_hi": "गेहूं (सरबती एचडी-3086)",
                "variety": "HD-3086 Certified",
                "quality_grade": "Grade A (Assayed)",
                "moisture_percentage": 11.4,
                "quantity_mt": 50.0,
                "reserve_price": 2450.0,
                "current_highest_bid": 2680.0,
                "min_increment": 20.0,
                "seller": created_users[UserRole.FARMER],
                "seller_name": "Sardar Balwinder Singh",
                "mandi_location": "Karnal Central APMC",
                "district": "Karnal",
                "state": "Haryana",
                "status": AuctionStatus.LIVE,
                "start_time": now - datetime.timedelta(hours=2),
                "end_time": now + datetime.timedelta(hours=4),
                "total_bids_count": 14,
            }
        )

        Bid.objects.get_or_create(
            auction=auction,
            bid_amount=2680.0,
            defaults={
                "bidder": created_users[UserRole.BUYER],
                "bidder_name": "Adani Agri Logistics",
                "bidder_company": "Adani Agri Logistics Ltd",
                "is_winning": True
            }
        )

        # 7. Procurement Centers & Capacities
        center, _ = ProcurementCenter.objects.get_or_create(
            code="KRN-APMC-01",
            defaults={
                "name": "Karnal Central Grain Yard APMC",
                "name_hi": "करनाल केंद्रीय अनाज यार्ड",
                "state": "Haryana",
                "district": "Karnal",
                "daily_capacity_mt": 3000.0,
                "operational_status": "ACTIVE",
                "officer_in_charge": created_users[UserRole.OFFICER]
            }
        )

        CenterCapacity.objects.get_or_create(
            center=center,
            date=now.date(),
            commodity="Wheat",
            defaults={
                "total_quota_mt": 3000.0,
                "booked_quota_mt": 1840.0,
                "procured_today_mt": 1250.0,
                "available_slots": 45
            }
        )

        # 8. Slot Bookings & Tokens
        slot_booking, _ = SlotBooking.objects.get_or_create(
            token_number="AGM-TK-99482",
            defaults={
                "farmer": created_users[UserRole.FARMER],
                "farmer_name": "Sardar Harpreet Singh",
                "farmer_phone": "+91 98765 43210",
                "center": center,
                "mandi_name": "Karnal Central Grain Yard",
                "state": "Haryana",
                "district": "Karnal",
                "commodity": "Wheat (Sharbati)",
                "quantity_quintals": 180.0,
                "booking_date": now.date() + datetime.timedelta(days=2),
                "time_slot": "09:00 AM - 11:00 AM",
                "lane": "Lane 04 - Weighbridge A",
                "vehicle_number": "HR-05-AB-7821",
                "driver_name": "Harpreet Singh",
                "status": SlotBookingStatus.BOOKED
            }
        )

        qr_token, _ = QRToken.objects.get_or_create(
            token_string="AGM-TK-99482",
            defaults={
                "slot_booking": slot_booking,
                "farmer_name": "Sardar Harpreet Singh",
                "mandi_name": "Karnal Central Grain Yard",
                "crop_name": "Wheat (Sharbati)",
                "quantity_quintals": 180.0,
                "date": now.date() + datetime.timedelta(days=2),
                "time_slot": "09:00 AM - 11:00 AM",
                "lane": "Lane 04 - Weighbridge A"
            }
        )

        GatePass.objects.get_or_create(
            qr_token=qr_token,
            defaults={
                "vehicle_number": "HR-05-AB-7821",
                "driver_name": "Harpreet Singh",
                "entry_allowed": True
            }
        )

        # 9. Gate Entry & Weighment Slip
        gate_entry, _ = GateEntry.objects.get_or_create(
            token_string="AGM-TK-99482",
            defaults={
                "qr_token": qr_token,
                "vehicle_number": "HR-05-AB-7821",
                "driver_name": "Harpreet Singh",
                "mandi_name": "Karnal Central APMC",
                "gate_lane": "Gate 01 - Heavy Fast Track Lane",
                "operator_name": "Ramesh Chand (Gate Operator)",
                "status": "ADMITTED"
            }
        )

        WeighmentSlip.objects.get_or_create(
            token_string="AGM-TK-99482",
            defaults={
                "gate_entry": gate_entry,
                "farmer_name": "Sardar Harpreet Singh",
                "commodity": "Wheat (Sharbati)",
                "vehicle_number": "HR-05-AB-7821",
                "weighbridge_name": "Dharam Kanta WB-01 (Karnal)",
                "operator_name": "Sunil Kumar",
                "gross_weight_kg": 24580.0,
                "tare_weight_kg": 6580.0,
                "net_weight_kg": 18000.0,
                "net_weight_quintals": 180.0
            }
        )

        # 10. Quality Inspections
        QualityInspection.objects.get_or_create(
            token_number="AGM-TK-99482",
            defaults={
                "farmer_name": "Sardar Harpreet Singh",
                "crop_name": "Wheat (Sharbati)",
                "mandi_name": "Karnal Central APMC",
                "moisture_percentage": 11.2,
                "impurity_percentage": 0.75,
                "foreign_matter_percentage": 0.60,
                "broken_grains_percentage": 1.10,
                "quality_grade": "Grade A",
                "result": "PASS",
                "remarks": "Optimal dry grain sample, zero pest infestation. High protein luster Grade A certified.",
                "inspector": created_users[UserRole.QUALITY_INSPECTOR],
                "inspector_name": "Dr. R. K. Sharma (Chief Quality Assayer)"
            }
        )

        AIQualityAnalysis.objects.get_or_create(
            crop_name="Wheat (Sharbati)",
            defaults={
                "quality_score": 95.2,
                "estimated_moisture": 11.2,
                "defect_percentage": 0.9,
                "foreign_matter_estimate": 0.6,
                "confidence_score": 99.4,
                "is_preliminary": True,
                "ai_verdict": "Grade A (Optimal Dry Kernel Density - 99.4% Match)"
            }
        )

        # 11. Logistics & Vehicles
        driver, _ = Driver.objects.get_or_create(
            phone="+91 94160 55421",
            defaults={"name": "Baldev Singh", "license_number": "DL-05201948210", "is_available": True}
        )

        vehicle, _ = Vehicle.objects.get_or_create(
            vehicle_number="HR-05-AB-7821",
            defaults={
                "vehicle_type": "10-Wheeler Heavy Truck (25 MT)",
                "capacity_mt": 25.0,
                "driver": driver,
                "current_location": "Karnal GT Road",
                "is_available": True
            }
        )

        req, _ = TransportRequest.objects.get_or_create(
            commodity="Wheat (Grade A FAQ)",
            quantity_mt=25.0,
            defaults={
                "requester": created_users[UserRole.FARMER],
                "pickup_location": "Karnal Central APMC Yard",
                "destination": "Central Warehousing Corp (CWC) Silo 04, Panipat",
                "estimated_fare": 8500.0,
                "status": "IN_TRANSIT"
            }
        )

        TransportBooking.objects.get_or_create(
            request=req,
            defaults={
                "vehicle": vehicle,
                "driver": driver,
                "delivery_eta": "Today, 04:30 PM",
                "gps_status": "Moving along NH-44 towards Panipat Silo Complex"
            }
        )

        # 12. Warehouses & Silos
        wh, _ = Warehouse.objects.get_or_create(
            code="CWC-PNP-04",
            defaults={
                "name": "Central Warehousing Corp (CWC) Silo Complex 04",
                "state": "Haryana",
                "district": "Panipat",
                "manager": created_users[UserRole.WAREHOUSE_MANAGER],
                "manager_name": "V. K. Aggarwal",
                "total_capacity_mt": 50000.0,
                "current_stock_mt": 38420.0,
                "available_capacity_mt": 11580.0,
                "temperature_celsius": 21.4,
                "relative_humidity_pct": 58.2,
                "silos_count": 12
            }
        )

        Inventory.objects.get_or_create(
            warehouse=wh,
            silo_number="Silo B-03",
            defaults={
                "commodity": "Wheat (Grade A FAQ)",
                "quantity_stored_mt": 4500.0,
                "quality_grade": "Grade A",
                "moisture_percentage": 11.2
            }
        )

        StockMovement.objects.get_or_create(
            warehouse=wh,
            truck_number="HR-05-AB-7821",
            defaults={
                "movement_type": "STOCK_IN",
                "commodity": "Wheat (Grade A)",
                "quantity_mt": 25.0,
                "source_mandi_or_hub": "Karnal Central APMC",
                "destination_hub": "CWC Panipat Silo 04",
                "grn_receipt_number": "GRN-2026-99120"
            }
        )

        # 13. Payments & DBT
        Payment.objects.get_or_create(
            utr_number="RBI056984210992",
            defaults={
                "recipient": created_users[UserRole.FARMER],
                "recipient_name": "Sardar Harpreet Singh",
                "recipient_phone": "+91 98765 43210",
                "recipient_aadhaar": "XXXX-XXXX-4821",
                "bank_account": "982100341829",
                "bank_ifsc": "PUNB0021400",
                "bank_name": "Punjab National Bank",
                "commodity": "Wheat (Sharbati Grade A)",
                "quantity_quintals": 180.0,
                "rate_per_qtl": 2425.0,
                "gross_amount": 436500.0,
                "net_payout_amount": 436500.0,
                "status": "COMPLETED",
                "pfms_ref_no": "PFMS-AGRI-2026-99418"
            }
        )

        # 14. Notifications
        Notification.objects.get_or_create(
            title="DBT MSP Payment Disbursed",
            defaults={
                "user": created_users[UserRole.FARMER],
                "title_hi": "डीबीटी एमएसपी भुगतान हस्तांतरित",
                "notification_type": "PAYMENT",
                "message": "₹4,36,500 credited to your PNB account via NPCI Aadhaar Bridge (UTR: RBI056984210992)",
                "message_hi": "₹4,36,500 आपके पीएनबी खाते में एनपीसीआई आधार ब्रिज द्वारा जमा किए गए (यूटीआर: RBI056984210992)",
                "is_read": False
            }
        )

        # 15. Traceability
        CropTraceability.objects.get_or_create(
            batch_id="BATCH-WHT-2026-9912",
            stage=TraceabilityStage.PAYMENT_COMPLETED,
            defaults={
                "crop_name": "Wheat (Sharbati HD-3086)",
                "farmer_name": "Sardar Harpreet Singh",
                "location": "Karnal Central APMC / PNB Bank",
                "details": "DBT ₹4,36,500 transferred to farmer account ending in 1829. UTR: RBI056984210992",
                "verified_by": "Govt of India Agri Stack (PFMS Gateway)",
                "blockchain_hash": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
            }
        )

        # 16. Analytics AI Models
        ArrivalForecast.objects.get_or_create(
            mandi_name="Karnal Central APMC",
            predicted_arrival_date=now.date() + datetime.timedelta(days=1),
            defaults={
                "district": "Karnal",
                "state": "Haryana",
                "crop_name": "Wheat (Sharbati)",
                "predicted_volume_mt": 3200.0,
                "surge_risk_level": "HIGH",
                "confidence_score": 94.2
            }
        )

        CongestionAlert.objects.get_or_create(
            mandi_name="Karnal Central APMC",
            defaults={
                "alert_level": "YELLOW",
                "recommended_action": "Reroute non-perishable heavy trucks to Sub-Yard Lane 02 to prevent weighbridge queue.",
                "is_active": True
            }
        )

        self.stdout.write(self.style.SUCCESS("AAGAM Database successfully seeded with full initial dataset!"))
