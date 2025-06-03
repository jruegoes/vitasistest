/**
 * API Configuration
 * Centralized configuration for all API endpoints and URLs
 */

// Base API URLs
export const API_CONFIG = {
  // Main API base URL
  STT_BASE_URL: 'https://playground-api.true-bar.si/api',
  
  // Auth endpoints (using proxy URLs to avoid CORS issues)
  AUTH_BASE_URL: '/auth',
  
  // WebSocket endpoints
  WEBSOCKET_BASE_URL: 'wss://playground-api.true-bar.si/api',
} as const;

// Specific API endpoints
export const ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    TOKEN: `${API_CONFIG.AUTH_BASE_URL}/realms/truebar/protocol/openid-connect/token`,
  },
  
  // STT API endpoints  
  STT: {
    MODELS: '/stt/v1/models',
    PIPELINE_STAGES: `${API_CONFIG.STT_BASE_URL}/pipelines/stages`,
    WEBSOCKET_STREAM: `${API_CONFIG.WEBSOCKET_BASE_URL}/pipelines/stream`,
  },
} as const;

// Storage keys for tokens and configuration
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'truebar_access_token',
  REFRESH_TOKEN: 'truebar_refresh_token',
  TOKEN_EXPIRY: 'truebar_token_expiry',
} as const;

// Client configuration
export const CLIENT_CONFIG = {
  AUTH_CLIENT_ID: 'truebar-client',
  TOKEN_EXPIRY_BUFFER: 60000, // 60 seconds buffer for token expiry check
  AUTO_PUNCTUATION_DELAY: 2000, // 2 seconds delay for auto punctuation
} as const;

/**
 * Get full URL for an endpoint
 * @param endpoint - The endpoint path
 * @param baseUrl - Optional base URL override
 */
export const getApiUrl = (endpoint: string, baseUrl?: string): string => {
  if (endpoint.startsWith('http') || endpoint.startsWith('/')) {
    return endpoint;
  }
  
  const base = baseUrl || API_CONFIG.STT_BASE_URL;
  return `${base}/${endpoint}`;
};

/**
 * Get WebSocket URL for streaming
 * @param endpoint - The WebSocket endpoint
 */
export const getWebSocketUrl = (endpoint: string): string => {
  if (endpoint.startsWith('ws')) {
    return endpoint;
  }
  
  return `${API_CONFIG.WEBSOCKET_BASE_URL}/${endpoint}`;
}; 