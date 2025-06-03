import axios from 'axios';
import type { AuthResponse } from '../types/auth';
import { ENDPOINTS, STORAGE_KEYS, CLIENT_CONFIG } from '../config/api';

export const login = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', username);
  params.append('password', password);
  params.append('client_id', CLIENT_CONFIG.AUTH_CLIENT_ID);

  const response = await axios.post<AuthResponse>(
    ENDPOINTS.AUTH.TOKEN,
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  // Save the tokens and expiry time
  if (response.data) {
    const { access_token, refresh_token, expires_in } = response.data;
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setTokenExpiry(Date.now() + expires_in * 1000);
  }

  return response.data;
};

export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);
  params.append('client_id', CLIENT_CONFIG.AUTH_CLIENT_ID);

  const response = await axios.post<AuthResponse>(
    ENDPOINTS.AUTH.TOKEN,
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  // Save the new tokens and expiry time
  if (response.data) {
    const { access_token, refresh_token, expires_in } = response.data;
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setTokenExpiry(Date.now() + expires_in * 1000);
    return access_token;
  }
  
  throw new Error('Failed to refresh token');
};

// Store token in localStorage for persistence
export const setAccessToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const getAccessToken = (): string => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || '';
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

export const getRefreshToken = (): string => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || '';
};

export const setTokenExpiry = (expiryTime: number): void => {
  localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
};

export const getTokenExpiry = (): number => {
  const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
  return expiry ? parseInt(expiry, 10) : 0;
};

export const isTokenExpired = (): boolean => {
  const expiry = getTokenExpiry();
  // Return true if token expires in less than configured buffer time
  return Date.now() > expiry - CLIENT_CONFIG.TOKEN_EXPIRY_BUFFER;
};

export const clearTokens = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
};

/**
 * Set a user-provided access token manually
 * This bypasses the login flow and directly sets the token
 */
export const setUserProvidedToken = (accessToken: string): void => {
  // Clear any existing tokens first
  clearTokens();
  
  // Set the provided token
  setAccessToken(accessToken);
  
  // Set a generous expiry time (24 hours from now)
  // Since we don't know the actual expiry, we'll assume it's valid for a day
  setTokenExpiry(Date.now() + 24 * 60 * 60 * 1000);
  
  console.log('User-provided access token set successfully');
};

/**
 * Validate if the current token works by making a test API call
 */
export const validateCurrentToken = async (): Promise<boolean> => {
  const token = getAccessToken();
  if (!token) {
    return false;
  }

  try {
    // Make a simple test request to validate the token
    // We'll use the STT API models endpoint as a test
    const response = await axios.get(ENDPOINTS.STT.MODELS, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};

/**
 * Check if we have any stored token (regardless of validity)
 */
export const hasStoredToken = (): boolean => {
  return !!getAccessToken();
};

// Get a valid token, refreshing if necessary
export const getValidToken = async (): Promise<string> => {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('No access token available. Please provide a valid token.');
  }

  // If token is expired and we have a refresh token, try to refresh
  if (isTokenExpired() && getRefreshToken()) {
    try {
      return await refreshAccessToken();
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // Clear invalid tokens
      clearTokens();
      throw new Error('Token refresh failed. Please provide a new access token.');
    }
  }
  
  return token;
};
