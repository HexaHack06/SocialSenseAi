// src/config/api.js

export const PROD_API_URL = 'https://socialsense-backend-irhr.onrender.com';
export const DEV_API_URL = 'http://localhost:5000';

/**
 * Centralized API base URL resolver.
 * Priority:
 * 1. import.meta.env.VITE_API_URL (explicit environment override from .env or CI)
 * 2. import.meta.env.PROD ? PROD_API_URL (default to live Render backend in production builds)
 * 3. DEV_API_URL (default to localhost:5000 in local development)
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? PROD_API_URL : DEV_API_URL)
).replace(/\/+$/, '');

export default API_BASE_URL;
