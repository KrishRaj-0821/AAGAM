from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import AuctionLot, AuctionBid, AwardedContract, AuctionStatus
from .serializers import AuctionLotSerializer, AuctionBidSerializer, AwardedContractSerializer

class AuctionLotViewSet(viewsets.ModelViewSet):
    queryset = AuctionLot.objects.all().order_by('-created_at')
    serializer_class = AuctionLotSerializer
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

    @action(detail=True, methods=['post'])
    def place_bid(self, request, pk=None):
        lot = self.get_object()

        if lot.status != AuctionStatus.LIVE:
            return Response({'error': 'Bids can only be placed on active LIVE auctions'}, status=status.HTTP_400_BAD_REQUEST)

        bid_amount = request.data.get('bid_amount')
        bidder_name = request.data.get('bidder_name', 'Verified Buyer')
        bidder_company = request.data.get('bidder_company', 'Agri Trade Co')

        if not bid_amount:
            return Response({'error': 'Bid amount is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            bid_amount = float(bid_amount)
        except ValueError:
            return Response({'error': 'Invalid bid amount number'}, status=status.HTTP_400_BAD_REQUEST)

        min_required = float(lot.current_highest_bid) + float(lot.min_increment)
        if bid_amount < min_required:
            return Response({
                'error': f"Bid must be at least ₹{min_required} (Current ₹{lot.current_highest_bid} + Min Increment ₹{lot.min_increment})"
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create the new bid
        bid = AuctionBid.objects.create(
            auction_lot=lot,
            bidder=request.user if request.user.is_authenticated else None,
            bidder_name=bidder_name,
            bidder_company=bidder_company,
            bid_amount_per_qtl=bid_amount
        )

        lot.current_highest_bid = bid_amount
        lot.total_bids_count += 1
        lot.save()

        return Response({
            'message': f"Bid of ₹{bid_amount}/Qtl placed successfully for Lot {lot.lot_id}",
            'bid': AuctionBidSerializer(bid).data,
            'lot': AuctionLotSerializer(lot).data
        }, status=status.HTTP_201_CREATED)


class AuctionBidViewSet(viewsets.ModelViewSet):
    queryset = AuctionBid.objects.all().order_by('-created_at')
    serializer_class = AuctionBidSerializer
    permission_classes = [permissions.AllowAny]


class AwardedContractViewSet(viewsets.ModelViewSet):
    queryset = AwardedContract.objects.all().order_by('-contract_date')
    serializer_class = AwardedContractSerializer
    permission_classes = [permissions.AllowAny]
