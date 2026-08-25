from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from common.responses import success_response, error_response
from .models import Listing, BuyerOffer
from .serializers import ListingSerializer, BuyerOfferSerializer

class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all().order_by('-created_at')
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        crop = self.request.query_params.get('crop')
        state = self.request.query_params.get('state')
        grade = self.request.query_params.get('grade')
        status_param = self.request.query_params.get('status')
        if crop:
            qs = qs.filter(crop_name__icontains=crop)
        if state:
            qs = qs.filter(state__iexact=state)
        if grade:
            qs = qs.filter(quality_grade__iexact=grade)
        if status_param:
            qs = qs.filter(status__iexact=status_param)
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
            return error_response("Invalid listing data", errors=serializer.errors)
        farmer = request.user if request.user.is_authenticated else None
        listing = serializer.save(farmer=farmer)
        return success_response(ListingSerializer(listing).data, message="Crop listed in marketplace", status_code=status.HTTP_201_CREATED)


class BuyerOfferViewSet(viewsets.ModelViewSet):
    queryset = BuyerOffer.objects.all().order_by('-created_at')
    serializer_class = BuyerOfferSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Invalid offer data", errors=serializer.errors)
        buyer = request.user if request.user.is_authenticated else None
        offer = serializer.save(buyer=buyer)
        return success_response(BuyerOfferSerializer(offer).data, message="Offer submitted successfully", status_code=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='my-offers')
    def my_offers(self, request):
        if request.user.is_authenticated:
            qs = BuyerOffer.objects.filter(buyer=request.user)
        else:
            qs = BuyerOffer.objects.all()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        offer = self.get_object()
        offer.status = 'ACCEPTED'
        offer.save()
        listing = offer.listing
        listing.status = 'RESERVED'
        listing.save()
        return success_response(BuyerOfferSerializer(offer).data, message="Offer accepted by farmer")

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        offer = self.get_object()
        offer.status = 'REJECTED'
        offer.save()
        return success_response(BuyerOfferSerializer(offer).data, message="Offer rejected")
