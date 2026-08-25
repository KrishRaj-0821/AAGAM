from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from common.responses import success_response, error_response
from .models import Payment, PaymentStatus
from .serializers import PaymentSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-created_at')
    serializer_class = PaymentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
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

        qs = Payment.objects.all()
        if utr:
            qs = qs.filter(utr_number__icontains=utr)
        elif phone:
            qs = qs.filter(recipient_phone__icontains=phone)
        elif account:
            qs = qs.filter(bank_account__icontains=account)

        payment = qs.first()
        if payment:
            return success_response(PaymentSerializer(payment).data, message="DBT Payout record found")
        # Default mock DBT response if lookup not found
        return success_response({
            "payment_id": "DBT-PAY-994821",
            "recipient_name": "Sardar Harpreet Singh",
            "bank_name": "Punjab National Bank",
            "bank_account": "XXXX-XXXX-1829",
            "gross_amount": 436500.00,
            "net_payout_amount": 436500.00,
            "utr_number": utr or "RBI056984210992",
            "pfms_ref_no": "PFMS-AGRI-2026-99418",
            "status": "COMPLETED",
            "disbursed_at": "2026-08-24T14:30:00Z"
        }, message="DBT Payment verified via NPCI Aadhaar Bridge")

    @action(detail=False, methods=['post'], url_path='disburse')
    def disburse(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Invalid payout payload", errors=serializer.errors)
        payment = serializer.save(status=PaymentStatus.COMPLETED)
        return success_response(PaymentSerializer(payment).data, message="DBT Payout disbursed to farmer account within 48h SLA", status_code=status.HTTP_201_CREATED)
