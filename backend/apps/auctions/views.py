from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from common.responses import success_response, error_response
from .models import Auction, Bid, AuctionStatus
from .serializers import AuctionSerializer, BidSerializer

class AuctionViewSet(viewsets.ModelViewSet):
    queryset = Auction.objects.all().order_by('-created_at')
    serializer_class = AuctionSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        crop = self.request.query_params.get('crop')
        state = self.request.query_params.get('state')
        if status_param:
            qs = qs.filter(status__iexact=status_param)
        if crop:
            qs = qs.filter(crop_name__icontains=crop)
        if state:
            qs = qs.filter(state__iexact=state)
        return qs

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return success_response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Invalid auction data", errors=serializer.errors)
        seller = request.user if request.user.is_authenticated else None
        auction = serializer.save(seller=seller)
        return success_response(AuctionSerializer(auction).data, message="Auction created successfully", status_code=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def bid(self, request, pk=None):
        auction = self.get_object()
        bid_amount = request.data.get('bid_amount')
        bidder_name = request.data.get('bidder_name', 'Verified Buyer')
        bidder_company = request.data.get('bidder_company', 'Agri Corp Ltd')

        if not bid_amount:
            return error_response("Bid amount is required")

        try:
            bid_amount = float(bid_amount)
        except ValueError:
            return error_response("Invalid numeric bid amount")

        min_req = float(auction.current_highest_bid) + float(auction.min_increment)
        if bid_amount < min_req:
            return error_response(f"Bid must be at least ₹{min_req}/Qtl")

        bid = Bid.objects.create(
            auction=auction,
            bidder=request.user if request.user.is_authenticated else None,
            bidder_name=bidder_name,
            bidder_company=bidder_company,
            bid_amount=bid_amount
        )
        auction.current_highest_bid = bid_amount
        auction.total_bids_count += 1
        auction.save()

        return success_response({
            "bid": BidSerializer(bid).data,
            "auction": AuctionSerializer(auction).data
        }, message=f"Bid of ₹{bid_amount}/Qtl placed successfully", status_code=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def bids(self, request, pk=None):
        auction = self.get_object()
        bids = auction.bids.all().order_by('-created_at')
        serializer = BidSerializer(bids, many=True)
        return success_response(serializer.data)
