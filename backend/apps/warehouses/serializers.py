from rest_framework import serializers
from .models import Warehouse, Inventory, StockMovement

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = '__all__'


class StockMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMovement
        fields = '__all__'
        read_only_fields = ['uuid', 'movement_id', 'timestamp']


class WarehouseSerializer(serializers.ModelSerializer):
    inventory_items = InventorySerializer(many=True, read_only=True)

    class Meta:
        model = Warehouse
        fields = '__all__'
        read_only_fields = ['uuid', 'available_capacity_mt', 'created_at']
