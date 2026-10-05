/**
 * AAGAM Unified API Client
 * Coordinates HTTP requests between React Frontend and Django REST Backend
 * Enforces production backend configuration (P0-15) and authentic JWT transport.
 */

// Production API base URL check (P0-15, TASK 3)
const rawBase = import.meta.env.VITE_API_BASE_URL;

if (import.meta.env.PROD && (!rawBase || rawBase.trim() === '' || rawBase.trim() === '/api')) {
  throw new Error(
    'CRITICAL: VITE_API_BASE_URL must be specified for production build. Static GitHub Pages cannot proxy /api'
  );
}

// Normalize: ensure no trailing slash, and ensure it ends with /api if a domain is provided
let normalizedBase = (rawBase || '/api').trim().replace(/\/+$/, '');
if (normalizedBase.startsWith('http') && !normalizedBase.endsWith('/api')) {
  normalizedBase = `${normalizedBase}/api`;
}

export const API_BASE = normalizedBase;

export class ApiError extends Error {
  constructor(message, status, errors = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export async function request(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE}${cleanEndpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  // Attach JWT Bearer token if present
  const token = localStorage.getItem('aagam_access_token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(url, config);

    const contentType = res.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const responseData = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const errMsg = (isJson && responseData.message) || responseData.detail || `Request failed with status ${res.status}`;
      const errErrors = (isJson && responseData.errors) || null;
      throw new ApiError(errMsg, res.status, errErrors);
    }

    return responseData;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or connectivity error
    throw new ApiError(error.message || 'Unable to connect to AAGAM Backend Server', 0);
  }
}

export const get = (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' });
export const post = (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body });
export const put = (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body });
export const patch = (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body });
export const del = (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' });

export default {
  get,
  post,
  put,
  patch,
  del,
  request,
  ApiError,
  API_BASE
};
