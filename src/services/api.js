/**
 * AAGAM Domain-Specific Backend API Service
 * Maps frontend features directly to Django REST Framework endpoints.
 */

import { get, post, put, del } from './apiClient';

export const api = {
  // 1. System Health
  health: {
    check: () => get('/health/'),
  },

  // 2. Authentication & Stakeholder Identity
  auth: {
    checkRegistration: (phone) => post('/auth/check-registration/', { phone }),
    otpLogin: async (phone, otp) => {
      const res = await post('/auth/otp-login/', { phone, otp });
      if (res?.data?.access) {
        localStorage.setItem('aagam_access_token', res.data.access);
        if (res.data.refresh) {
          localStorage.setItem('aagam_refresh_token', res.data.refresh);
        }
        if (res.data.user) {
          localStorage.setItem('aagam_user', JSON.stringify(res.data.user));
        }
      }
      return res;
    },
    login: async (email, password) => {
      const res = await post('/auth/login/', { email, password });
      if (res?.data?.access) {
        localStorage.setItem('aagam_access_token', res.data.access);
        if (res.data.refresh) {
          localStorage.setItem('aagam_refresh_token', res.data.refresh);
        }
        if (res.data.user) {
          localStorage.setItem('aagam_user', JSON.stringify(res.data.user));
        }
      }
      return res;
    },
    register: async (userData) => {
      const res = await post('/auth/register/', userData);
      if (res?.data?.access) {
        localStorage.setItem('aagam_access_token', res.data.access);
        if (res.data.refresh) {
          localStorage.setItem('aagam_refresh_token', res.data.refresh);
        }
        if (res.data.user) {
          localStorage.setItem('aagam_user', JSON.stringify(res.data.user));
        }
      }
      return res;
    },
    getProfile: () => get('/auth/profile/'),
    updateProfile: (data) => put('/auth/profile/', data),
    logout: () => {
      localStorage.removeItem('aagam_access_token');
      localStorage.removeItem('aagam_refresh_token');
      localStorage.removeItem('aagam_user');
      return post('/auth/logout/');
    },
    refreshToken: (refresh) => post('/auth/token/refresh/', { refresh }),
  },

  // 3. Farmer Portal APIs
  farmer: {
    getDashboard: () => get('/farmer/dashboard/'),
    getLandRecords: () => get('/farmer/land-records/'),
    addLandRecord: (data) => post('/farmer/land-records/', data),
  },

  // 4. Buyer Portal APIs
  buyer: {
    getDashboard: () => get('/buyer/dashboard/'),
    getOrders: () => get('/buyer/orders/'),
  },

  // 5. Price Discovery & Mandi Intelligence
  prices: {
    getPrices: (params = '') => get(`/prices/${params ? `?${params}` : ''}`),
    getMSP: (params = '') => get(`/prices/msp/${params ? `?${params}` : ''}`),
    getHistory: (params = '') => get(`/prices/history/${params ? `?${params}` : ''}`),
  },

  // 6. Crop Marketplace & Direct Farmer Offers
  marketplace: {
    getListings: (params = '') => get(`/marketplace/listings/${params ? `?${params}` : ''}`),
    getListing: (id) => get(`/marketplace/listings/${id}/`),
    createListing: (data) => post('/marketplace/listings/', data),
    makeOffer: (data) => post('/marketplace/offers/', data),
    getOffers: (params = '') => get(`/marketplace/offers/${params ? `?${params}` : ''}`),
  },

  // 7. Live E-Auction Platform
  auctions: {
    getAuctions: (params = '') => get(`/auctions/${params ? `?${params}` : ''}`),
    getAuction: (id) => get(`/auctions/${id}/`),
    createAuction: (data) => post('/auctions/', data),
    placeBid: (auctionId, bidData) => post(`/auctions/${auctionId}/bid/`, bidData),
    getBids: (auctionId) => get(`/auctions/${auctionId}/bids/`),
  },

  // 8. Mandi & Procurement Centers
  centers: {
    getCenters: (params = '') => get(`/centers/${params ? `?${params}` : ''}`),
    getCenter: (id) => get(`/centers/${id}/`),
    getCapacities: (params = '') => get(`/centers/capacity/${params ? `?${params}` : ''}`),
  },

  // 9. Slot Booking & Queue Scheduling
  slots: {
    getBookings: (params = '') => get(`/slots/${params ? `?${params}` : ''}`),
    getBooking: (id) => get(`/slots/${id}/`),
    bookSlot: (data) => post('/slots/', data),
    getAvailableSlots: (params = '') => get(`/slots/available/${params ? `?${params}` : ''}`),
  },

  // 10. QR Tokens & Gate Pass
  tokens: {
    getTokens: (params = '') => get(`/tokens/${params ? `?${params}` : ''}`),
    getToken: (id) => get(`/tokens/${id}/`),
    generateToken: (data) => post('/tokens/', data),
    verifyToken: (tokenString) => post('/tokens/verify/', { token_string: tokenString }),
    getGatePasses: (params = '') => get(`/tokens/gate-pass/${params ? `?${params}` : ''}`),
  },

  // 11. Quality Inspection & Assaying
  quality: {
    getInspections: (params = '') => get(`/quality/inspections/${params ? `?${params}` : ''}`),
    submitInspection: (data) => post('/quality/inspections/', data),
  },

  // 12. Logistics & Transport Management
  logistics: {
    getTransports: (params = '') => get(`/logistics/${params ? `?${params}` : ''}`),
    bookTransport: (data) => post('/logistics/', data),
  },

  // 13. Warehouses & Silo Storage
  warehouses: {
    getWarehouses: (params = '') => get(`/warehouses/${params ? `?${params}` : ''}`),
    getInventory: (params = '') => get(`/warehouses/inventory/${params ? `?${params}` : ''}`),
  },

  // 14. DBT Payouts & Financial Settlements
  payments: {
    getPayments: (params = '') => get(`/payments/${params ? `?${params}` : ''}`),
    getPayment: (id) => get(`/payments/${id}/`),
    initiatePayment: (data) => post('/payments/', data),
  },

  // 15. Real-Time Analytics & Persona Dashboards
  analytics: {
    getDashboard: (role) => get(`/analytics/dashboards/${role}/`),
  },

  // 16. Blockchain Traceability & Audit
  traceability: {
    traceLot: (lotId) => get(`/traceability/lots/${lotId}/`),
  },

  // 17. Automated Notifications & n8n SMS Webhooks
  notifications: {
    sendBookingSmsWebhook: async (bookingPayload) => {
      const webhookUrl = 'https://connect-with-me247.app.n8n.cloud/webhook/aagam-sms-booking';
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingPayload),
        });
        const data = await response.json();
        return { success: true, data };
      } catch (err) {
        console.warn('n8n SMS Webhook notification error:', err);
        return { success: false, error: err.message };
      }
    }
  }
};

export default api;
