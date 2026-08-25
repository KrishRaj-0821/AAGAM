from django.contrib import admin
from .models import Warehouse, Inventory, StockMovement

@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'district', 'state', 'total_capacity_mt', 'current_stock_mt', 'available_capacity_mt')
    list_filter = ('state',)

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ('warehouse', 'commodity', 'silo_number', 'quantity_stored_mt', 'quality_grade')

@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ('movement_id', 'warehouse', 'movement_type', 'commodity', 'quantity_mt', 'timestamp')
    list_filter = ('movement_type',)
