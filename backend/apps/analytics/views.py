from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from common.responses import success_response
from .models import ArrivalForecast, CongestionAlert
from .serializers import ArrivalForecastSerializer, CongestionAlertSerializer

class ForecastViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ArrivalForecast.objects.all().order_by('predicted_arrival_date')
    serializer_class = ArrivalForecastSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)


class CongestionAlertViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CongestionAlert.objects.filter(is_active=True).order_by('-timestamp')
    serializer_class = CongestionAlertSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        return success_response(serializer.data)


class DashboardAnalyticsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, role_name=None):
        role = (role_name or request.query_params.get('role') or 'farmer').lower()

        dashboards = {
            'farmer': {
                "role": "Farmer",
                "statistics": {
                    "active_slots": 2,
                    "declared_harvest_qtl": 420.0,
                    "dbt_payout_received": 1018500.0,
                    "active_bids": 3,
                    "land_acres": 8.7
                },
                "recent_activities": [
                    {"id": 1, "title": "DBT MSP Payout Disbursed", "amount": "₹4,36,500", "utr": "RBI056984210", "date": "2026-08-24", "status": "COMPLETED"},
                    {"id": 2, "title": "QR Token Booked", "token": "AGM-TK-99482", "mandi": "Karnal Central APMC", "date": "2026-08-28", "status": "ACTIVE"}
                ],
                "pending_actions": [
                    {"title": "Verify Weighment Slip for Slot #99482", "urgency": "High"},
                    {"title": "Review Buyer Offer from ITC Agri", "urgency": "Medium"}
                ],
                "chart_data": [
                    {"month": "Apr", "disbursed": 180000},
                    {"month": "May", "disbursed": 340000},
                    {"month": "Jun", "disbursed": 220000},
                    {"month": "Jul", "disbursed": 510000},
                    {"month": "Aug", "disbursed": 1018500}
                ]
            },
            'buyer': {
                "role": "Private Buyer",
                "statistics": {
                    "active_bids": 4,
                    "won_auctions": 8,
                    "total_procured_mt": 1420.5,
                    "wallet_balance": 4820000.0,
                    "shipments_in_transit": 3
                },
                "recent_activities": [
                    {"id": 1, "title": "Won E-Auction Lot LOT-8812", "crop": "Wheat (Sharbati)", "qty": "50 MT", "amount": "₹13,40,000"},
                    {"id": 2, "title": "Dispatched Fleet HR-05-AB-7821", "route": "Karnal to Panipat", "eta": "04:30 PM"}
                ],
                "pending_actions": [
                    {"title": "Authorize Escrow Release for Batch #9912", "urgency": "High"}
                ],
                "chart_data": [
                    {"day": "Mon", "bids": 12},
                    {"day": "Tue", "bids": 19},
                    {"day": "Wed", "bids": 24},
                    {"day": "Thu", "bids": 18},
                    {"day": "Fri", "bids": 32}
                ]
            },
            'officer': {
                "role": "Procurement Officer",
                "statistics": {
                    "center_capacity_mt": 3000.0,
                    "procured_today_mt": 1250.0,
                    "queued_trucks": 18,
                    "completed_slots": 84,
                    "rejection_rate_pct": 0.4
                },
                "recent_activities": [
                    {"id": 1, "title": "Daily Quota 42% Utilized", "commodity": "Wheat", "mandi": "Karnal Central"},
                    {"id": 2, "title": "Emergency Reroute Applied", "action": "Sub-Yard B Opened"}
                ],
                "pending_actions": [
                    {"title": "Approve Daily Procurement Summary Sheet", "urgency": "High"}
                ],
                "chart_data": [
                    {"hour": "08:00", "arrivals_mt": 120},
                    {"hour": "10:00", "arrivals_mt": 350},
                    {"hour": "12:00", "arrivals_mt": 480},
                    {"hour": "14:00", "arrivals_mt": 210},
                    {"hour": "16:00", "arrivals_mt": 90}
                ]
            },
            'center_operator': {
                "role": "Mandi Center Operator",
                "statistics": {
                    "gates_active": 4,
                    "weighbridges_online": 6,
                    "avg_turnaround_mins": 18.5,
                    "scanned_tokens_today": 142,
                    "pending_weighments": 5
                },
                "recent_activities": [
                    {"id": 1, "title": "Tola Parchi Issued", "parchi": "TP-WB-9942", "weight": "180 Qtl", "time": "10 mins ago"}
                ],
                "pending_actions": [
                    {"title": "Zero Tare Calibration on WB-02", "urgency": "Routine"}
                ],
                "chart_data": [
                    {"lane": "Lane 01", "trucks": 42},
                    {"lane": "Lane 02", "trucks": 38},
                    {"lane": "Lane 03", "trucks": 31},
                    {"lane": "Lane 04", "trucks": 31}
                ]
            },
            'quality_inspector': {
                "role": "Quality Inspector",
                "statistics": {
                    "samples_assayed_today": 89,
                    "grade_a_percentage": 92.4,
                    "grade_b_percentage": 7.2,
                    "rejected_count": 1,
                    "avg_moisture_pct": 11.2
                },
                "recent_activities": [
                    {"id": 1, "title": "NIR Assay Certified", "token": "AGM-TK-99482", "grade": "Grade A", "moisture": "11.2%"}
                ],
                "pending_actions": [
                    {"title": "Sign Lab Certificate for Sample QA-8821", "urgency": "Immediate"}
                ],
                "chart_data": [
                    {"grade": "Grade A", "count": 82},
                    {"grade": "Grade B", "count": 6},
                    {"grade": "Rejected", "count": 1}
                ]
            },
            'logistics': {
                "role": "Logistics Provider",
                "statistics": {
                    "total_fleet_size": 45,
                    "active_in_transit": 28,
                    "available_trucks": 17,
                    "total_tonnage_moved_mt": 34800.0,
                    "on_time_delivery_pct": 98.6
                },
                "recent_activities": [
                    {"id": 1, "title": "Truck HR-05-AB-7821 Arrived at CWC Panipat", "time": "5 mins ago"}
                ],
                "pending_actions": [
                    {"title": "Assign 4 Heavy Trucks to Khanna Mandi", "urgency": "High"}
                ],
                "chart_data": [
                    {"day": "Mon", "tonnage": 480},
                    {"day": "Tue", "tonnage": 620},
                    {"day": "Wed", "tonnage": 790},
                    {"day": "Thu", "tonnage": 540},
                    {"day": "Fri", "tonnage": 890}
                ]
            },
            'warehouse': {
                "role": "Warehouse Manager",
                "statistics": {
                    "total_capacity_mt": 50000.0,
                    "current_stock_mt": 38420.0,
                    "available_space_mt": 11580.0,
                    "occupancy_pct": 76.8,
                    "grain_temp_celsius": 21.4
                },
                "recent_activities": [
                    {"id": 1, "title": "GRN Stock-In 25 MT Wheat (Grade A)", "source": "Karnal Mandi", "silo": "Silo B-03"}
                ],
                "pending_actions": [
                    {"title": "Schedule Nitrogen Purge on Silo A-01", "urgency": "Medium"}
                ],
                "chart_data": [
                    {"silo": "Silo A", "utilization": 82},
                    {"silo": "Silo B", "utilization": 74},
                    {"silo": "Silo C", "utilization": 91},
                    {"silo": "Silo D", "utilization": 60}
                ]
            },
            'admin': {
                "role": "System Administrator",
                "statistics": {
                    "total_mandis_connected": 2840,
                    "registered_farmers": 12450000,
                    "verified_traders": 1840000,
                    "total_procurement_cr": 142500.0,
                    "system_uptime_pct": 99.98
                },
                "recent_activities": [
                    {"id": 1, "title": "NPCI Aadhaar Bridge Settlement Batch #418 Processed", "amount": "₹142.5 Cr"}
                ],
                "pending_actions": [
                    {"title": "Renew SSL Root Certificate for PFMS Gateway", "urgency": "Low"}
                ],
                "chart_data": [
                    {"month": "Apr", "procured_cr": 12400},
                    {"month": "May", "procured_cr": 45800},
                    {"month": "Jun", "procured_cr": 32100},
                    {"month": "Jul", "procured_cr": 28400},
                    {"month": "Aug", "procured_cr": 23800}
                ]
            }
        }

        # Match specific role or fallback to farmer
        data = dashboards.get(role, dashboards['farmer'])
        return success_response(data, message=f"{data['role']} dashboard statistics loaded")
