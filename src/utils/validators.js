/**
 * Universal Form Field Validator for AAGAM Stakeholder Registration
 * Includes UIDAI Aadhaar Verhoeff Checksum Verification (Dihedral Group D5)
 */

// Dihedral Group D5 multiplication table (10 x 10)
const D_TABLE = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

// Permutation table (8 x 10) applied based on digit position mod 8
const P_TABLE = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

/**
 * Validates 12-digit Aadhaar number using UIDAI Verhoeff algorithm.
 */
export function validateAadhaar(raw) {
  const digits = (raw || '').toString().replace(/\D/g, '').slice(0, 12);
  const count = digits.length;

  if (count === 0) {
    return {
      isValid: false,
      status: 'empty',
      errorEn: 'Please input a valid 12-digit Aadhaar number.',
      errorHi: 'कृपया 12-अंकों का वैध आधार नंबर दर्ज करें।'
    };
  }

  // UIDAI specification: Aadhaar numbers cannot start with 0 or 1
  if (digits.startsWith('0') || digits.startsWith('1')) {
    return {
      isValid: false,
      status: 'invalid',
      errorEn: 'Invalid Aadhaar: Cannot start with 0 or 1. Please input a valid Aadhaar number.',
      errorHi: 'अमान्य आधार: 0 या 1 से शुरू नहीं हो सकता। कृपया वैध आधार नंबर दर्ज करें।'
    };
  }

  if (count < 12) {
    return {
      isValid: false,
      status: 'incomplete',
      errorEn: `Entered ${count}/12 digits. Please input a valid 12-digit Aadhaar number.`,
      errorHi: `${count}/12 अंक दर्ज किए गए। कृपया 12-अंकों का वैध आधार नंबर दर्ज करें।`
    };
  }

  // 12-digit Verhoeff Checksum Verification
  let checksum = 0;
  const reversedDigits = digits.split('').reverse().map(Number);
  for (let i = 0; i < reversedDigits.length; i++) {
    checksum = D_TABLE[checksum][P_TABLE[i % 8][reversedDigits[i]]];
  }

  if (checksum === 0) {
    return {
      isValid: true,
      status: 'valid',
      messageEn: 'Aadhaar is valid and good to go ✓',
      messageHi: 'आधार वैध है और आगे बढ़ने के लिए तैयार है ✓'
    };
  }

  return {
    isValid: false,
    status: 'invalid',
    errorEn: 'Invalid Aadhaar: Verhoeff checksum failed. Please input a valid Aadhaar number.',
    errorHi: 'अमान्य आधार: वेरहोफ चेकसम विफल। कृपया एक वैध आधार नंबर दर्ज करें।'
  };
}

/**
 * Universal Form Field Validator for AAGAM Stakeholder Registration
 */
export function validateField(name, value, allValues = {}, role = 'Farmer') {
  const val = (value !== undefined && value !== null ? value : '').toString().trim();

  switch (name) {
    case 'fullName':
      if (!val) {
        return { isValid: false, errorEn: 'Full Name is required.', errorHi: 'पूरा नाम आवश्यक है।' };
      }
      if (val.length < 3) {
        return { isValid: false, errorEn: 'Full Name must be at least 3 characters.', errorHi: 'पूरा नाम कम से कम 3 अक्षरों का होना चाहिए।' };
      }
      if (!/^[a-zA-Z\s.]+$/.test(val)) {
        return { isValid: false, errorEn: 'Full Name should contain only letters and spaces.', errorHi: 'नाम में केवल अक्षर होने चाहिए।' };
      }
      return { isValid: true, messageEn: 'Good to go ✓', messageHi: 'सही है ✓' };

    case 'fatherName':
      if (!val) {
        return { isValid: false, errorEn: "Father's / Spouse's Name is required.", errorHi: 'पिता/पति का नाम आवश्यक है।' };
      }
      if (val.length < 3) {
        return { isValid: false, errorEn: 'Name must be at least 3 characters.', errorHi: 'नाम कम से कम 3 अक्षरों का होना चाहिए।' };
      }
      return { isValid: true, messageEn: 'Good to go ✓', messageHi: 'सही है ✓' };

    case 'mobile': {
      const cleanMob = val.replace(/\D/g, '');
      const mob10 = (cleanMob.length === 12 && cleanMob.startsWith('91')) ? cleanMob.slice(2) : cleanMob;
      if (!mob10) {
        return { isValid: false, errorEn: 'Mobile number is required for OTP.', errorHi: 'ओटीपी के लिए मोबाइल नंबर आवश्यक है।' };
      }
      if (mob10.length !== 10 || !/^[6-9]/.test(mob10)) {
        return { isValid: false, errorEn: 'Enter a valid 10-digit mobile number starting with 6-9.', errorHi: 'कृपया 6-9 से शुरू होने वाला 10-अंकीय मोबाइल नंबर दर्ज करें।' };
      }
      return { isValid: true, messageEn: 'Good to go ✓', messageHi: 'सही है ✓' };
    }

    case 'aadhaar': {
      const res = validateAadhaar(val);
      if (!res.isValid) {
        return {
          isValid: false,
          status: res.status,
          errorEn: res.errorEn || 'Invalid Aadhaar number. Please input a valid 12-digit Aadhaar number.',
          errorHi: res.errorHi || 'अमान्य आधार नंबर। कृपया एक वैध 12-अंकीय आधार नंबर दर्ज करें।'
        };
      }
      return {
        isValid: true,
        status: 'valid',
        messageEn: 'Good to go ✓ (Valid Aadhaar)',
        messageHi: 'आगे बढ़ें ✓ (वैध आधार)'
      };
    }

    case 'state':
      if (!val) {
        return { isValid: false, errorEn: 'State is required.', errorHi: 'राज्य का नाम आवश्यक है।' };
      }
      if (val.length < 2) {
        return { isValid: false, errorEn: 'State name is too short.', errorHi: 'राज्य का नाम बहुत छोटा है।' };
      }
      return { isValid: true, messageEn: 'Good to go ✓', messageHi: 'सही है ✓' };

    case 'district':
      if (!val) {
        return { isValid: false, errorEn: 'District is required.', errorHi: 'जिले का नाम आवश्यक है।' };
      }
      if (val.length < 2) {
        return { isValid: false, errorEn: 'District name is too short.', errorHi: 'जिले का नाम बहुत छोटा है।' };
      }
      return { isValid: true, messageEn: 'Good to go ✓', messageHi: 'सही है ✓' };

    case 'mandi':
      if (!val) {
        return { isValid: false, errorEn: 'Assigned Mandi Yard is required.', errorHi: 'संबंधित मंडी यार्ड आवश्यक है।' };
      }
      if (val.length < 3) {
        return { isValid: false, errorEn: 'Mandi Yard name must be at least 3 characters.', errorHi: 'मंडी यार्ड का नाम कम से कम 3 अक्षर होना चाहिए।' };
      }
      return { isValid: true, messageEn: 'Good to go ✓', messageHi: 'सही है ✓' };

    case 'landKhasra':
      if (role === 'Farmer') {
        if (!val) {
          return { isValid: false, errorEn: 'Land Khasra / Murabba number is required.', errorHi: 'खसरा / मुरब्बा नंबर आवश्यक है।' };
        }
        if (val.length < 2) {
          return { isValid: false, errorEn: 'Invalid Khasra number.', errorHi: 'अमान्य खसरा नंबर।' };
        }
      }
      return { isValid: true, messageEn: 'Good to go ✓', messageHi: 'सही है ✓' };

    case 'vehicleNo':
      if (role === 'Transporter') {
        const cleanV = val.replace(/[\s-]/g, '').toUpperCase();
        if (!cleanV) {
          return { isValid: false, errorEn: 'Vehicle registration number is required.', errorHi: 'वाहन पंजीकरण नंबर आवश्यक है।' };
        }
        if (cleanV.length < 7 || cleanV.length > 12) {
          return { isValid: false, errorEn: 'Enter a valid vehicle reg number (e.g., PB-10-CZ-4829).', errorHi: 'वैध वाहन नंबर दर्ज करें (उदा. PB-10-CZ-4829)।' };
        }
      }
      return { isValid: true, messageEn: 'Good to go ✓', messageHi: 'सही है ✓' };

    case 'mandiLicense':
      if (role !== 'Farmer' && role !== 'Transporter') {
        if (!val) {
          return { isValid: false, errorEn: 'APMC Trade License number is required.', errorHi: 'व्यापार लाइसेंस नंबर आवश्यक है।' };
        }
        if (val.length < 4) {
          return { isValid: false, errorEn: 'License number must be at least 4 characters.', errorHi: 'लाइसेंस नंबर कम से कम 4 अक्षर होना चाहिए।' };
        }
      }
      return { isValid: true, messageEn: 'Good to go ✓', messageHi: 'सही है ✓' };

    case 'bankAccount': {
      const cleanAcc = val.replace(/\D/g, '');
      if (!cleanAcc) {
        return { isValid: false, errorEn: 'Bank account number is required.', errorHi: 'बैंक खाता संख्या आवश्यक है।' };
      }
      if (cleanAcc.length < 9 || cleanAcc.length > 18) {
        return { isValid: false, errorEn: 'Bank account number must be between 9 and 18 digits.', errorHi: 'बैंक खाता संख्या 9 से 18 अंकों के बीच होनी चाहिए।' };
      }
      return { isValid: true, messageEn: 'Good to go ✓', messageHi: 'सही है ✓' };
    }

    case 'ifsc': {
      const cleanIfsc = val.toUpperCase().replace(/\s/g, '');
      if (!cleanIfsc) {
        return { isValid: false, errorEn: 'Bank IFSC code is required.', errorHi: 'बैंक आईएफएससी कोड आवश्यक है।' };
      }
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
        return { isValid: false, errorEn: 'Enter a valid 11-character IFSC (e.g., SBIN0004829).', errorHi: 'वैध 11-अक्षरीय IFSC कोड दर्ज करें (उदा. SBIN0004829)।' };
      }
      return { isValid: true, messageEn: 'Good to go ✓', messageHi: 'सही है ✓' };
    }

    case 'declaration':
      if (!value) {
        return { isValid: false, errorEn: 'Aadhaar e-KYC consent declaration is required.', errorHi: 'सहमति देना अनिवार्य है।' };
      }
      return { isValid: true, messageEn: 'Good to go ✓', messageHi: 'सही है ✓' };

    default:
      return { isValid: true };
  }
}

/**
 * Validates all fields for a given registration step.
 */
export function validateStep(step, formData, role) {
  const errors = {};
  let fieldsToValidate = [];

  if (step === 2) {
    fieldsToValidate = ['fullName', 'fatherName', 'mobile', 'aadhaar'];
  } else if (step === 3) {
    fieldsToValidate = ['state', 'district', 'mandi'];
    if (role === 'Farmer') fieldsToValidate.push('landKhasra');
    else if (role === 'Transporter') fieldsToValidate.push('vehicleNo');
    else fieldsToValidate.push('mandiLicense');
  } else if (step === 4) {
    fieldsToValidate = ['bankAccount', 'ifsc', 'declaration'];
  }

  for (const field of fieldsToValidate) {
    const res = validateField(field, formData[field], formData, role);
    if (!res.isValid) {
      errors[field] = res;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
