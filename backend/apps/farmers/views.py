from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from common.responses import success_response, error_response
from .models import FarmerProfile, LandRecord
from .serializers import FarmerProfileSerializer, LandRecordSerializer

class FarmerDashboardView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return success_response({
            "statistics": {
                "active_slot_bookings": 2,
                "total_harvest_declared_qtl": 420.0,
                "total_msp_payout_received": 1018500.0,
                "active_auction_bids": 3,
                "verified_land_acres": 8.7,
                "dbt_linked_account": "XXXX-XXXX-1829"
            },
            "recent_activities": [
                {"id": 1, "title": "DBT MSP Payment Disbursed", "amount": "₹4,36,500", "utr": "RBI056984210", "date": "2026-08-24", "status": "COMPLETED"},
                {"id": 2, "title": "QR Gate Pass Token Issued", "token": "AGM-TK-99482", "mandi": "Karnal Central APMC", "date": "2026-08-28", "status": "ACTIVE"},
                {"id": 3, "title": "Live E-Auction Bid Received", "crop": "Wheat (Sharbati)", "bid": "₹2,680/Qtl", "buyer": "Adani Agri Logistics", "date": "2026-08-25", "status": "WINNING"}
            ],
            "price_alerts": [
                {"crop": "Wheat (Sharbati)", "msp": 2425, "current_rate": 2590, "change": "+6.8%", "trend": "up"},
                {"crop": "Paddy (Basmati 1121)", "msp": 2300, "current_rate": 4180, "change": "+81.7%", "trend": "up"}
            ]
        }, message="Farmer dashboard statistics loaded")


class FarmerProfileView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            profile, _ = FarmerProfile.objects.get_or_create(user=request.user)
            serializer = FarmerProfileSerializer(profile)
            return success_response(serializer.data)
        # Default mock farmer profile for unauthenticated exploratory view
        return success_response({
            "full_name": "Sardar Harpreet Singh",
            "phone": "+91 98765 43210",
            "kisan_credit_card": "KCC-HR-998241",
            "total_land_acres": 8.7,
            "soil_health_card_id": "SHC-2025-4120",
            "bank_account_no": "982100341829",
            "bank_ifsc": "PUNB0021400",
            "bank_name": "Punjab National Bank",
            "dbt_linked": True,
            "state": "Haryana",
            "district": "Karnal"
        })

    def put(self, request):
        if not request.user.is_authenticated:
            return error_response("Authentication required", status_code=status.HTTP_401_UNAUTHORIZED)
        profile, _ = FarmerProfile.objects.get_or_create(user=request.user)
        serializer = FarmerProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return success_response(serializer.data, message="Farmer profile updated")
        return error_response("Update failed", errors=serializer.errors)


class FarmerLandsView(generics.ListCreateAPIView):
    serializer_class = LandRecordSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return LandRecord.objects.filter(farmer=self.request.user)
        return LandRecord.objects.all()

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)

    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return error_response("Authentication required", status_code=401)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(farmer=request.user)
            return success_response(serializer.data, message="Land record added successfully", status_code=201)
        return error_response("Failed to add land record", errors=serializer.errors)


class FarmerCropsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Connected to crops app
        from apps.crops.models import Crop
        from apps.crops.serializers import CropSerializer
        crops = Crop.objects.all()
        serializer = CropSerializer(crops, many=True)
        return success_response(serializer.data)


class FarmerPaymentsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        from apps.payments.models import Payment
        from apps.payments.serializers import PaymentSerializer
        payments = Payment.objects.all().order_by('-created_at')
        serializer = PaymentSerializer(payments, many=True)
        return success_response(serializer.data)
