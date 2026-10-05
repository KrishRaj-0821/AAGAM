from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from common.responses import success_response, error_response
from common.permissions import IsOfficer, IsFarmer
from .models import Payment, PaymentStatus
from .serializers import PaymentSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-created_at')
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Payment.objects.none()

        if user.role in ['ADMIN', 'SUPER_ADMIN', 'OFFICER']:
            qs = Payment.objects.all().order_by('-created_at')
        else:
            # Farmers see strictly their own payments (P0-9)
            qs = Payment.objects.filter(recipient=user).order_by('-created_at')

        utr = self.request.query_params.get('utr')
        phone = self.request.query_params.get('phone')
        status_param = self.request.query_params.get('status')
        if utr:
            qs = qs.filter(utr_number__icontains=utr)
        if phone:
            qs = qs.filter(recipient_phone__icontains=phone)
        if status_param:
            qs = qs.filter(status__iexact=status_param)
        return qs

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)

    @action(detail=False, methods=['get'], url_path='track')
    def track_dbt(self, request):
        utr = request.query_params.get('utr')
        phone = request.query_params.get('phone')
        account = request.query_params.get('account')

        qs = self.get_queryset()
        if utr:
            qs = qs.filter(utr_number__icontains=utr)
        elif phone:
            qs = qs.filter(recipient_phone__icontains=phone)
        elif account:
            qs = qs.filter(bank_account__icontains=account)

        payment = qs.first()
        if payment:
            return success_response(PaymentSerializer(payment).data, message="Payment payout record verified.")

        # Backend truth: Never return fake success when record is not found (P0-13)
        return error_response(
            "No DBT payment record found matching the provided reference criteria.",
            status_code=status.HTTP_404_NOT_FOUND
        )

    @action(detail=False, methods=['post'], url_path='disburse', permission_classes=[permissions.IsAuthenticated, IsOfficer])
    def disburse(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Invalid payout payload", errors=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)
        payment = serializer.save(status=PaymentStatus.COMPLETED)
        return success_response(
            PaymentSerializer(payment).data,
            message="Payment payout disbursed successfully.",
            status_code=status.HTTP_201_CREATED
        )
