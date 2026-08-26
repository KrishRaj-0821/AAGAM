// src/services/otpService.js
// Fast2SMS Official Indian Gateway Integration

const FAST2SMS_API_KEY = "sSZHqtaTv1nXbD0ReCliAUjBFuGPJw6WV8chQy7zo2x53YrOLglxfMG5Hi2VIwATdE1FzhNJc98vq3uK";

/**
 * Sends a real 4-6 digit OTP SMS to an Indian mobile number via Fast2SMS API
 * @param {string|number} phoneNumber - 10-digit Indian Mobile Number
 * @param {string|number} otpCode - 4-6 digit numeric OTP
 * @returns {Promise<{success: boolean, data: any}>}
 */
export const sendAuthOtp = async (phoneNumber, otpCode) => {
  // Extract clean 10-digit Indian mobile number
  let cleanNumber = String(phoneNumber).replace(/[^0-9]/g, '');
  if (cleanNumber.length > 10) {
    cleanNumber = cleanNumber.slice(-10);
  }

  if (cleanNumber.length !== 10) {
    throw new Error("Invalid 10-digit mobile number provided.");
  }

  try {
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": FAST2SMS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        route: "otp",
        variables_values: String(otpCode), // e.g. "4821"
        numbers: cleanNumber
      })
    });

    const data = await response.json();
    return { 
      success: data.return === true, 
      data,
      message: data.message ? data.message[0] : 'OTP sent successfully'
    };
  } catch (error) {
    console.error("Fast2SMS OTP Dispatch Error:", error);
    throw error;
  }
};
