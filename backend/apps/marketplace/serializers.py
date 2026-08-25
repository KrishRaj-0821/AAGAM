from rest_framework import serializers
from .models import Listing, BuyerOffer

class BuyerOfferSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='listing.crop_name', read_only=True)

    class Meta:
        model = BuyerOffer
        fields = '__all__'
        read_only_fields = ['uuid', 'total_offer_value', 'created_at']


class ListingSerializer(serializers.ModelSerializer):
    offers = BuyerOfferSerializer(many=True, read_only=True)

    class Meta:
        model = Listing
        fields = '__all__'
        read_only_fields = ['uuid', 'created_at', 'updated_at']
