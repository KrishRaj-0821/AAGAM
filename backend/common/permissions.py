from rest_framework import permissions

class IsFarmer(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['FARMER', 'Farmer'])


class IsBuyer(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['BUYER', 'Private Buyer', 'Buyer'])


class IsOfficer(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['OFFICER', 'Procurement Officer', 'Officer', 'ADMIN', 'SUPER_ADMIN'])


class IsCenterOperator(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['CENTER_OPERATOR', 'Mandi Operator', 'ADMIN', 'SUPER_ADMIN'])


class IsQualityInspector(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['QUALITY_INSPECTOR', 'Quality Inspector', 'ADMIN', 'SUPER_ADMIN'])


class IsLogisticsProvider(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['LOGISTICS_PROVIDER', 'Logistics Provider', 'ADMIN', 'SUPER_ADMIN'])


class IsWarehouseManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['WAREHOUSE_MANAGER', 'Warehouse Manager', 'ADMIN', 'SUPER_ADMIN'])


class IsAdminUserOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and (request.user.is_staff or request.user.role in ['ADMIN', 'SUPER_ADMIN', 'System Administrator']))
