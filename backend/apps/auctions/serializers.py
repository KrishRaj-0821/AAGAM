from rest_framework import serializers
from .models import Auction, Bid

class BidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = '__all__'
        read_only_fields = ['uuid', 'is_winning', 'created_at']


class AuctionSerializer(serializers.ModelSerializer):
    bids = BidSerializer(many=True, read_only=True)

    class Meta:
        model = Auction
        fields = '__all__'
        read_only_fields = ['uuid', 'total_bids_count', 'created_at']
