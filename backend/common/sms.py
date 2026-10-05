import logging
import urllib.request
import json
from django.conf import settings

logger = logging.getLogger(__name__)

class SMSDeliveryError(Exception):
    """Raised when an SMS fails to dispatch through the production gateway."""
    pass

def send_sms_otp(phone_number, otp_code):
    """
    Dispatches OTP SMS via Fast2SMS Indian gateway using backend-only credentials.
    In DEMO_AUTH_MODE: visibly logs demonstration simulation (Requirement 6).
    In PRODUCTION_MODE (DEMO_AUTH_MODE=False): requires active SMS credentials and raises SMSDeliveryError on failure.
    """
    clean_phone = ''.join(filter(str.isdigit, str(phone_number)))[-10:]
    if len(clean_phone) != 10:
        raise ValueError("Invalid 10-digit mobile number.")

    is_demo_mode = getattr(settings, 'DEMO_AUTH_MODE', False)
    api_key = getattr(settings, 'FAST2SMS_API_KEY', '') or ''

    if is_demo_mode:
        logger.info(f"[DEMO AUTH MODE] Simulated OTP delivery to +91 {clean_phone}: Code {otp_code}")
        return {
            "success": True,
            "mode": "DEMO_SIMULATED",
            "message": f"[DEMO] Simulated SMS dispatch to +91 {clean_phone}."
        }

    # Production Mode Strict Delivery
    if not api_key:
        logger.error("[PRODUCTION AUTH ERROR] FAST2SMS_API_KEY is missing while DEMO_AUTH_MODE=False.")
        raise SMSDeliveryError("Production SMS gateway configuration missing. Fast2SMS API key not set.")

    try:
        url = "https://www.fast2sms.com/dev/bulkV2"
        payload = {
            "route": "otp",
            "variables_values": str(otp_code),
            "numbers": clean_phone
        }
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "authorization": api_key,
                "Content-Type": "application/json"
            }
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            if not res_data.get('return', False):
                err_msg = res_data.get('message', ['SMS delivery was rejected by gateway'])[0] if isinstance(res_data.get('message'), list) else 'SMS delivery was rejected by gateway'
                logger.error(f"[PRODUCTION AUTH ERROR] Fast2SMS gateway rejected message: {err_msg}")
                raise SMSDeliveryError(f"SMS gateway delivery failed: {err_msg}")

            return {
                "success": True,
                "mode": "PRODUCTION",
                "message": res_data.get('message', ['OTP dispatched'])[0] if isinstance(res_data.get('message'), list) else 'OTP dispatched successfully'
            }
    except SMSDeliveryError:
        raise
    except Exception as e:
        logger.error(f"[PRODUCTION AUTH ERROR] Fast2SMS network dispatch failed: {e}")
        raise SMSDeliveryError(f"SMS network communication failure: {str(e)}")
