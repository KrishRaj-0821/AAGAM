from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from common.responses import success_response, error_response
from .models import MSPPrice, MarketPrice, PriceHistory
from .serializers import MSPPriceSerializer, MarketPriceSerializer, PriceHistorySerializer

class PriceListViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MarketPrice.objects.all().order_by('-date')
    serializer_class = MarketPriceSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        crop = self.request.query_params.get('crop')
        state = self.request.query_params.get('state')
        mandi = self.request.query_params.get('mandi')
        if crop:
            qs = qs.filter(crop_name__icontains=crop)
        if state:
            qs = qs.filter(state__iexact=state)
        if mandi:
            qs = qs.filter(mandi_name__icontains=mandi)
        return qs

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)


class PriceCompareView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        crop_id = request.query_params.get('crop_id', 'Wheat (Sharbati)')
        return success_response({
            "crop_name": crop_id,
            "msp_price": 2425.0,
            "mandi_modal_price": 2590.0,
            "open_market_price": 2680.0,
            "highest_offer": 2720.0,
            "recommended_price": 2650.0,
            "variance_from_msp_pct": "+6.8%",
            "best_mandi": "Karnal Central APMC (Haryana)",
            "highest_bidding_buyer": "ITC Agri AgriBusiness Ltd"
        }, message="Price comparison metrics calculated")


class PriceHistoryView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        crop_id = request.query_params.get('crop_id', 'Wheat')
        history_points = [
            {"date": "2026-08-19", "modal_price": 2510, "msp_price": 2425, "volume_mt": 1200},
            {"date": "2026-08-20", "modal_price": 2530, "msp_price": 2425, "volume_mt": 1350},
            {"date": "2026-08-21", "modal_price": 2545, "msp_price": 2425, "volume_mt": 1400},
            {"date": "2026-08-22", "modal_price": 2560, "msp_price": 2425, "volume_mt": 1450},
            {"date": "2026-08-23", "modal_price": 2575, "msp_price": 2425, "volume_mt": 1500},
            {"date": "2026-08-24", "modal_price": 2580, "msp_price": 2425, "volume_mt": 1420},
            {"date": "2026-08-25", "modal_price": 2590, "msp_price": 2425, "volume_mt": 1480},
        ]
        return success_response(history_points, message="Price trend history retrieved")


class MSPMasterListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        msps = MSPPrice.objects.all()
        serializer = MSPPriceSerializer(msps, many=True)
        return success_response(serializer.data)
