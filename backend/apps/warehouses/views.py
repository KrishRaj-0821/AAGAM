from rest_framework import viewsets, permissions, status
from common.responses import success_response, error_response
from .models import Warehouse, Inventory, StockMovement
from .serializers import WarehouseSerializer, InventorySerializer, StockMovementSerializer

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all().order_by('-total_capacity_mt')
    serializer_class = WarehouseSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)


class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [permissions.AllowAny]


class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all().order_by('-timestamp')
    serializer_class = StockMovementSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Invalid stock movement data", errors=serializer.errors)
        movement = serializer.save()
        return success_response(StockMovementSerializer(movement).data, message="Stock movement recorded", status_code=status.HTTP_201_CREATED)
