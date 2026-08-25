from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from common.responses import success_response, error_response
from .models import BuyerProfile, BuyerPurchase
from .serializers import BuyerProfileSerializer, BuyerPurchaseSerializer

class BuyerDashboardView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return success_response({
            "statistics": {
                "active_bids_count": 4,
                "won_auctions_count": 8,
                "total_procured_mt": 1420.5,
                "escrow_wallet_balance": 4820000.0,
                "active_shipments_in_transit": 3
            },
            "recent_purchases": [
                {"order_id": "ORD-2026-9942", "crop": "Wheat (Sharbati HD-3086)", "qty": "50 MT", "amount": "₹13,40,000", "mandi": "Karnal APMC", "status": "IN_TRANSIT"},
                {"order_id": "ORD-2026-8812", "crop": "Paddy (Basmati 1121)", "qty": "80 MT", "amount": "₹33,44,000", "mandi": "Khanna Mandi", "status": "DELIVERED"}
            ],
            "live_market_alerts": [
                {"crop": "Wheat (Sharbati)", "mandi": "Karnal", "modal_rate": "₹2,590", "trend": "up", "arrivals": "1,420 MT"},
                {"crop": "Mustard (Bold Seed)", "mandi": "Bharatpur", "modal_rate": "₹6,340", "trend": "up", "arrivals": "980 MT"}
            ]
        }, message="Buyer dashboard data loaded")


class BuyerProfileView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            profile, _ = BuyerProfile.objects.get_or_create(user=request.user)
            serializer = BuyerProfileSerializer(profile)
            return success_response(serializer.data)
        return success_response({
            "company_name": "Adani Agri Logistics Ltd",
            "gstin": "06AAACA1234B1Z5",
            "enam_license_no": "ENAM-LIC-2025-882",
            "wallet_balance": 5000000.00,
            "verified_buyer": True,
            "full_name": "Rajesh Singhania (Chief Procurement Manager)"
        })

    def put(self, request):
        if not request.user.is_authenticated:
            return error_response("Authentication required", status_code=status.HTTP_401_UNAUTHORIZED)
        profile, _ = BuyerProfile.objects.get_or_create(user=request.user)
        serializer = BuyerProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return success_response(serializer.data, message="Buyer profile updated")
        return error_response("Update failed", errors=serializer.errors)


class BuyerPurchasesView(generics.ListAPIView):
    serializer_class = BuyerPurchaseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return BuyerPurchase.objects.filter(buyer=self.request.user)
        return BuyerPurchase.objects.all()

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)
