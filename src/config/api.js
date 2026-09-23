// src/config/api.js

export const PROD_API_URL = 'https://socialsense-backend-irhr.onrender.com';
export const DEV_API_URL = 'http://localhost:5000';

/**
 * Centralized API base URL resolver.
 * Priority:
 * 1. localStorage override (from Settings backend switcher)
 * 2. import.meta.env.VITE_API_URL (explicit environment override from .env or CI)
 * 3. import.meta.env.PROD ? PROD_API_URL (default to live Render backend in production builds)
 * 4. DEV_API_URL (default to localhost:5000 in local development)
 */
export function getApiBaseUrl() {
  const stored = typeof localStorage !== 'undefined'
    ? localStorage.getItem('ss_api_url')
    : null;
  return (
    stored ||
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? PROD_API_URL : DEV_API_URL)
  ).replace(/\/+$/, '');
}

export const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;

// ── Service Helpers ───────────────────────────────────────────

/**
 * Check if backend is reachable. Returns { ok, latencyMs, serverUrl }.
 */
export async function checkBackendHealth(serverUrl) {
  const url = (serverUrl || getApiBaseUrl()).replace(/\/+$/, '');
  const t0 = Date.now();
  try {
    const res = await fetch(`${url}/api/health`, {
      signal: AbortSignal.timeout(5000),
    });
    const latencyMs = Date.now() - t0;
    if (res.ok) {
      return { ok: true, latencyMs, serverUrl: url };
    }
    return { ok: false, latencyMs, serverUrl: url, error: `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, latencyMs: Date.now() - t0, serverUrl: url, error: err.message };
  }
}

/**
 * Analyze text with the AI sentiment service.
 * POST /api/sentiment/analyze
 * Returns { sentiment, topic, keywords, fallback? }
 */
export async function analyzeSentimentText({ text, platform, save = false } = {}) {
  const url = getApiBaseUrl();
  const res = await fetch(`${url}/api/sentiment/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, platform, save }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Sentiment analyze API returned ${res.status}: ${errBody}`);
  }
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'AI analysis failed');
  return json.data;
}

/**
 * Trigger Telegram bot sync.
 * POST /api/telegram/sync
 */
export async function syncTelegramUpdates() {
  const url = getApiBaseUrl();
  const res = await fetch(`${url}/api/telegram/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(30000),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Telegram sync failed');
  return json.data;
}

/**
 * Trigger Twitter dataset import.
 * POST /api/datasets/twitter/import
 */
export async function importTwitterDataset() {
  const url = getApiBaseUrl();
  const res = await fetch(`${url}/api/datasets/twitter/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(60000),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Dataset import failed');
  return json.data;
}
