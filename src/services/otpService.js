// src/services/otpService.js
// Client-side OTP Service: Delegates entirely to server-authoritative backend (P0-1, P0-3)
// No API keys or credentials are stored or executed on the client.

import apiClient from './apiClient';

/**
 * Requests an authoritative OTP to be generated and dispatched by the backend.
 * The raw OTP is NEVER returned to the client in production mode.
 * 
 * @param {string} phone - 10-digit Indian Mobile Number
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export const sendAuthOtp = async (phone) => {
  let cleanNumber = String(phone).replace(/[^0-9]/g, '');
  if (cleanNumber.length > 10) {
    cleanNumber = cleanNumber.slice(-10);
  }

  if (cleanNumber.length !== 10) {
    throw new Error('Please enter a valid 10-digit mobile number.');
  }

  // Authoritative backend request (P0-1, P0-3)
  const response = await apiClient.post('/auth/request-otp/', { phone: cleanNumber });
  return response.data;
};

/**
 * Verifies an entered OTP on the backend and exchanges it for genuine JWT tokens.
 * 
 * @param {string} phone - 10-digit Indian Mobile Number
 * @param {string} otp - 6-digit numeric OTP entered by user
 * @returns {Promise<{success: boolean, message: string, data: {access: string, refresh: string, user: object}}>}
 */
export const verifyAuthOtp = async (phone, otp) => {
  let cleanNumber = String(phone).replace(/[^0-9]/g, '');
  if (cleanNumber.length > 10) {
    cleanNumber = cleanNumber.slice(-10);
  }

  const cleanOtp = String(otp).trim();
  if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
    throw new Error('Please enter a valid 6-digit OTP code.');
  }

  const response = await apiClient.post('/auth/verify-otp/', {
    phone: cleanNumber,
    otp: cleanOtp
  });
  return response.data;
};
