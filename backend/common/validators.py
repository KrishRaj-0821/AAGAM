"""
Verhoeff Algorithm & UIDAI Aadhaar Validation for Django Models & Serializers
"""
from django.core.exceptions import ValidationError

# Dihedral Group D5 multiplication table (10x10)
D_TABLE = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
]

# Permutation table (8x10) based on digit index mod 8
P_TABLE = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
]

# Inverse table in D5
INV_TABLE = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9]


def validate_aadhaar_verhoeff(value: str) -> None:
    """
    Django model validator for 12-digit Aadhaar number.
    Rejects any value that:
    - Is not 12 digits
    - Starts with 0 or 1 (per UIDAI rules)
    - Fails Verhoeff checksum calculation (checksum != 0)
    """
    if not value:
        raise ValidationError("Aadhaar number cannot be blank.")

    digits_only = "".join(filter(str.isdigit, str(value)))

    if len(digits_only) != 12:
        raise ValidationError(
            f"Aadhaar number must contain exactly 12 digits (found {len(digits_only)} digits)."
        )

    if digits_only[0] in ("0", "1"):
        raise ValidationError(
            "Invalid Aadhaar number: UIDAI specification dictates Aadhaar cannot begin with 0 or 1."
        )

    checksum = 0
    reversed_digits = [int(d) for d in reversed(digits_only)]

    for i, digit in enumerate(reversed_digits):
        checksum = D_TABLE[checksum][P_TABLE[i % 8][digit]]

    if checksum != 0:
        raise ValidationError(
            "Invalid Aadhaar number: Failed UIDAI Verhoeff checksum validation."
        )


def calculate_aadhaar_checksum(eleven_digit_str: str) -> int:
    """Calculates the 12th Verhoeff checksum digit for 11 digits."""
    digits = [int(d) for d in reversed(eleven_digit_str) if d.isdigit()]
    if len(digits) != 11:
        raise ValueError("Must provide exactly 11 digits.")

    checksum = 0
    for i, digit in enumerate(digits):
        checksum = D_TABLE[checksum][P_TABLE[(i + 1) % 8][digit]]

    return INV_TABLE[checksum]
