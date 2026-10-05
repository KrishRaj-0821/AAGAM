from rest_framework import permissions

class IsFarmer(permissions.BasePermission):
    """Allows access only to authenticated Farmers or Administrators."""
    def has_permission(self, request, view):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and request.user.role in ['FARMER', 'Farmer', 'ADMIN', 'SUPER_ADMIN']
        )


class IsBuyer(permissions.BasePermission):
    """Allows access only to authenticated Buyers."""
    def has_permission(self, request, view):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and request.user.role in ['BUYER', 'Private Buyer', 'Buyer', 'ADMIN', 'SUPER_ADMIN']
        )


class IsOfficer(permissions.BasePermission):
    """Allows access only to Procurement Officers and Admins."""
    def has_permission(self, request, view):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and request.user.role in ['OFFICER', 'Procurement Officer', 'Officer', 'ADMIN', 'SUPER_ADMIN']
        )


class IsCenterOperator(permissions.BasePermission):
    """Allows access only to Mandi Center Operators and Admins."""
    def has_permission(self, request, view):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and request.user.role in ['CENTER_OPERATOR', 'Center Operator', 'Mandi Operator', 'ADMIN', 'SUPER_ADMIN']
        )


class IsQualityInspector(permissions.BasePermission):
    """Allows access only to Quality Inspectors and Admins."""
    def has_permission(self, request, view):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and request.user.role in ['QUALITY_INSPECTOR', 'Quality Inspector', 'ADMIN', 'SUPER_ADMIN']
        )


class IsLogisticsProvider(permissions.BasePermission):
    """Allows access only to Logistics Providers and Admins."""
    def has_permission(self, request, view):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and request.user.role in ['LOGISTICS_PROVIDER', 'Logistics Provider', 'ADMIN', 'SUPER_ADMIN']
        )


class IsWarehouseManager(permissions.BasePermission):
    """Allows access only to Warehouse Managers and Admins."""
    def has_permission(self, request, view):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and request.user.role in ['WAREHOUSE_MANAGER', 'Warehouse Manager', 'ADMIN', 'SUPER_ADMIN']
        )


class IsAdminUserOrReadOnly(permissions.BasePermission):
    """Read-only for public/authenticated, write only for system administrators."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user 
            and request.user.is_authenticated 
            and (request.user.is_staff or request.user.role in ['ADMIN', 'SUPER_ADMIN', 'System Administrator'])
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """Object-level permission allowing only the owner of the object or an Admin to access/modify."""
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role in ['ADMIN', 'SUPER_ADMIN']:
            return True
        owner = getattr(obj, 'farmer', None) or getattr(obj, 'user', None)
        return owner == request.user
