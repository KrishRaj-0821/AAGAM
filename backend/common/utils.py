import io
import qrcode
import base64
import datetime
import random

def generate_random_token(date_obj=None) -> str:
    """
    Generate randomized AAGAM token:
    - First 3 character = month name (e.g. AUG)
    - 2 digit year = (e.g. 26)
    - 2 digit month = (e.g. 08)
    - 5 digit slot no = (e.g. 48291)
    Example: AUG260848291
    """
    if not date_obj:
        date_obj = datetime.date.today()
    month_name = date_obj.strftime('%b').upper()[:3]
    year_2 = date_obj.strftime('%y')
    month_2 = date_obj.strftime('%m')
    slot_5 = f"{random.randint(10000, 99999)}"
    return f"{month_name}{year_2}{month_2}{slot_5}"

def generate_qr_code_base64(data_string: str) -> str:
    """Generate a base64 encoded PNG of a QR code."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=2,
    )
    qr.add_data(data_string)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
    return f"data:image/png;base64,{img_str}"
