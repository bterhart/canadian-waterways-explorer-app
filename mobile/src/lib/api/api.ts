import { fetch } from "expo/fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Response envelope type - all app routes return { data: T }
interface ApiResponse<T> {
  data: T;
}

const baseUrl = process.env.EXPO_PUBLIC_BACKEND_URL!;

// ============================================================================
// Session (admin or teacher). Single owner of the access/refresh tokens.
//
// Backend facts this relies on (backend/src/lib/jwt-utils.ts, routes/auth.ts):
//   - access token lifetime 15 min, refresh token 7 days
//   - POST /api/auth/refresh { refreshToken } -> { data: { accessToken } }
//   - POST /api/auth/logout  { refreshToken } -> blacklists the refresh token
// ============================================================================

export type SessionKind = "admin" | "teacher";

export interface Session<P = unknown> {
  kind: SessionKind;
  accessToken: string;
  refreshToken: string | null;
  profile: P;
}

const SESSION_KEY = "@waterways_session";

let session: Session | null = null;
let hydrated = false;
let hydrating: Promise<Session | null> | null = null;
let refreshing: Promise<boolean> | null = null;

type ExpiredListener = (kind: SessionKind | null) => void;
const expiredListeners = new Set<ExpiredListener>();

// Endpoints whose own 401 means "bad credentials", never "expired session".
const NO_REFRESH_PREFIXES = ["/api/auth/", "/api/admin/login", "/api/teachers/login"];

/** Persist (or clear, with null) the current session. */
export const setSession = async (next: Session | null): Promise<void> => {
  session = next;
  hydrated = true;
  try {
    if (next) {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(next));
    } else {
      await AsyncStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // Storage failures must never break the request path; memory copy still works.
  }
};

export const clearSession = (): Promise<void> => setSession(null);

/** Current in-memory session (call loadSession() once at startup to hydrate). */
export const getSession = <P = unknown>(): Session<P> | null =>
  session as Session<P> | null;

/** Hydrate the session from storage. Safe to call repeatedly; runs once. */
export const loadSession = async (): Promise<Session | null> => {
  if (hydrated) return session;
  if (!hydrating) {
    hydrating = (async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        session = raw ? (JSON.parse(raw) as Session) : null;
      } catch {
        session = null;
      }
      hydrated = true;
      return session;
    })();
  }
  return hydrating;
};

/** Subscribe to "session expired" (refresh failed). Returns an unsubscribe fn. */
export const onSessionExpired = (listener: ExpiredListener): (() => void) => {
  expiredListeners.add(listener);
  return () => {
    expiredListeners.delete(listener);
  };
};

/** Logout: blacklist the refresh token server-side (best effort), then clear. */
export const logoutSession = async (): Promise<void> => {
  const current = session;
  if (current?.refreshToken) {
    try {
      await fetch(`${baseUrl}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: current.refreshToken }),
      });
    } catch {
      // Offline logout still clears the device.
    }
  }
  await clearSession();
};

const expireSession = async (): Promise<void> => {
  const kind = session?.kind ?? null;
  await clearSession();
  expiredListeners.forEach((listener) => listener(kind));
};

/** Exchange the refresh token for a new access token. Concurrent callers share one call. */
const refreshAccessToken = (): Promise<boolean> => {
  const current = session;
  if (!current?.refreshToken) return Promise.resolve(false);
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const response = await fetch(`${baseUrl}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: current.refreshToken }),
        });
        if (!response.ok) return false;
        const json = await response.json();
        const accessToken = json?.data?.accessToken;
        if (typeof accessToken !== "string" || !accessToken) return false;
        // Session may have been cleared meanwhile (logout); don't resurrect it.
        if (!session) return false;
        await setSession({ ...session, accessToken });
        return true;
      } catch {
        return false;
      } finally {
        refreshing = null;
      }
    })();
  }
  return refreshing;
};

// ============================================================================
// Request
// ============================================================================

const request = async <T>(
  url: string,
  options: { method?: string; body?: string } = {},
  allowRefresh = true
): Promise<T> => {
  if (!hydrated) await loadSession();

  const headers: Record<string, string> = {};
  if (options.body) {
    headers["Content-Type"] = "application/json";
  }
  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  const response = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers: Object.keys(headers).length > 0 ? headers : undefined,
  });

  // Expired access token: refresh once and retry once.
  if (
    response.status === 401 &&
    allowRefresh &&
    session?.refreshToken &&
    !NO_REFRESH_PREFIXES.some((prefix) => url.startsWith(prefix))
  ) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return request<T>(url, options, false);
    }
    await expireSession();
  }

  // 1. Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  // 2. JSON responses: parse and unwrap { data }
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const json = await response.json();

    // Check for error responses
    if (!response.ok) {
      const errorMessage = json.error?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return (json as ApiResponse<T>).data;
  }

  // 3. Non-JSON error
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  // 4. Non-JSON success: return undefined
  return undefined as T;
};

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: any) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body: any) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
  patch: <T>(url: string, body: any) =>
    request<T>(url, { method: "PATCH", body: JSON.stringify(body) }),
};
