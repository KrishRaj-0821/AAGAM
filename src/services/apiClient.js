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
  /**
   * @param {string} message
   * @param {number} status HTTP status, or 0 when no HTTP response was received
   * @param {object|null} errors Field-level errors from the server
   * @param {object} context Error classification
   * @param {boolean} [context.isOffline] Device is genuinely offline (network error + navigator.onLine === false)
   * @param {boolean} [context.isCorsDenied] Request blocked before a response, while the browser is online (likely CORS)
   * @param {boolean} [context.isHttpError] Server returned an HTTP error response
   * @param {boolean} [context.isNetworkError] fetch() threw before any response was received
   */
  constructor(message, status, errors = null, context = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.isOffline = Boolean(context.isOffline);
    this.isCorsDenied = Boolean(context.isCorsDenied);
    this.isHttpError = Boolean(context.isHttpError);
    this.isNetworkError = Boolean(context.isNetworkError);
  }
}

/**
 * True only when the device is offline AND the error is a network-level failure
 * (no HTTP response). HTTP errors (400, 401, 403, 409, 429, 500, 503, ...) are
 * server responses and never count as offline.
 */
export function isGenuinelyOffline(error) {
  if (typeof navigator === 'undefined' || navigator.onLine !== false) {
    return false;
  }
  if (error instanceof ApiError) {
    return error.isNetworkError === true && !error.isHttpError;
  }
  return error instanceof TypeError;
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

  let res;
  try {
    res = await fetch(url, config);
  } catch (error) {
    // fetch() threw: no HTTP response was received.
    const offline = isGenuinelyOffline(error) || (typeof navigator !== 'undefined' && navigator.onLine === false);
    if (offline) {
      throw new ApiError(
        'You appear to be offline. Please check your connection.',
        0,
        null,
        { isOffline: true, isNetworkError: true }
      );
    }
    // Browser reports online: the failure is a CORS rejection, DNS failure, or unreachable server.
    // Browsers do not expose CORS failures distinctly, so flag it for a configuration/connectivity message.
    throw new ApiError(
      'Unable to reach the AAGAM server. This may be a server configuration (CORS) or connectivity issue, not an offline condition.',
      0,
      null,
      { isOffline: false, isCorsDenied: true, isNetworkError: true }
    );
  }

  try {
    const contentType = res.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const responseData = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const errMsg = (isJson && responseData.message) || responseData.detail || `Request failed with status ${res.status}`;
      const errErrors = (isJson && responseData.errors) || null;
      throw new ApiError(errMsg, res.status, errErrors, { isHttpError: true });
    }

    return responseData;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Failure while reading/parsing the response body: the server did respond, so not offline.
    throw new ApiError(
      error.message || 'Unable to read response from AAGAM Backend Server',
      res.status,
      null,
      { isHttpError: !res.ok }
    );
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
  isGenuinelyOffline,
  API_BASE
};
