from rest_framework import serializers
from .models import AuctionLot, AuctionBid, AwardedContract

class AuctionBidSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuctionBid
        fields = '__all__'
        read_only_fields = ['bid_id', 'created_at', 'is_winning_bid']


class AwardedContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = AwardedContract
        fields = '__all__'
        read_only_fields = ['contract_id', 'contract_date']


class AuctionLotSerializer(serializers.ModelSerializer):
    bids = AuctionBidSerializer(many=True, read_only=True)
    contract = AwardedContractSerializer(read_only=True)

    class Meta:
        model = AuctionLot
        fields = '__all__'
        read_only_fields = ['lot_id', 'created_at']
