// Utility helpers and constants for auth context (moved out of AuthContext to keep that file export-clean)

export const TOKEN_KEY = 'access_token';
export const USER_KEY = 'auth_user';
export const MUST_CHANGE_KEY = 'must_change_password';
export const JUST_LOGGED_IN_SESSION = 'justLoggedIn';

export function safeParse<T>(json: string | null): T | null {
  if (!json) return null;
  try { return JSON.parse(json) as T; } catch { return null; }
}

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1];
    // atob is available in browser env; keep same behaviour
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as Record<string, unknown>;
  } catch { return null; }
}

export function strOr(payload: Record<string, unknown> | null, key: string, fallback = ''): string {
  const v = payload?.[key];
  return typeof v === 'string' ? v : fallback;
}

export function strOrMulti(payload: Record<string, unknown> | null, keys: string[], fallback = ''): string {
  if (!payload) return fallback;
  for (const k of keys) {
    const v = payload[k];
    if (typeof v === 'string' && v.trim().length) return v;
  }
  return fallback;
}
