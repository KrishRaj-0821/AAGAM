from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from django.utils import timezone
from common.responses import success_response, error_response
from .models import QRToken, GatePass
from .serializers import QRTokenSerializer, GatePassSerializer

class QRTokenViewSet(viewsets.ModelViewSet):
    queryset = QRToken.objects.all().order_by('-created_at')
    serializer_class = QRTokenSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)


class GenerateTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = QRTokenSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Invalid payload", errors=serializer.errors)
        token = serializer.save()
        return success_response(
            QRTokenSerializer(token).data,
            message="QR Token generated successfully",
            status_code=status.HTTP_201_CREATED
        )


class ScanTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token_string = request.data.get('token')
        if not token_string:
            return error_response("Token string is required")

        try:
            token = QRToken.objects.get(token_string=token_string)
            token.is_used = True
            token.scanned_at = timezone.now()
            token.save()

            gate_pass, _ = GatePass.objects.get_or_create(
                qr_token=token,
                defaults={
                    'vehicle_number': request.data.get('vehicle_number', 'HR-05-AB-7821'),
                    'driver_name': request.data.get('driver_name', token.farmer_name),
                    'security_guard': 'Gate Operator 01'
                }
            )

            return success_response({
                "token": QRTokenSerializer(token).data,
                "gate_pass": GatePassSerializer(gate_pass).data,
                "access_granted": True
            }, message=f"Gate Pass verified! Vehicle admitted to {token.lane}")
        except QRToken.DoesNotExist:
            return error_response("Invalid or unknown QR Token", status_code=404)
