/**
 * validate-image-url.ts
 *
 * Checks whether an external image URL is reachable before persisting it.
 * Used at write time on all routes that accept user- or admin-submitted imageUrl fields.
 */

export type UrlCheckResult =
  | { ok: true; status: number }
  | { ok: false; status: number; reason: "not_found" | "rate_limited" | "server_error" | "unreachable" }

/**
 * Sends a HEAD request to `url` (follows redirects) and returns whether it is
 * reachable and returns a successful response.
 *
 * Timeout: 8 seconds. Never throws — errors are captured and returned as
 * `{ ok: false, status: 0, reason: "unreachable" }`.
 */
export async function validateImageUrl(url: string): Promise<UrlCheckResult> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(8_000),
      headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (url-validation)" },
    });

    if (response.ok) {
      return { ok: true, status: response.status };
    }

    const status = response.status;
    if (status === 404) return { ok: false, status, reason: "not_found" };
    if (status === 429) return { ok: false, status, reason: "rate_limited" };
    return { ok: false, status, reason: "server_error" };
  } catch {
    return { ok: false, status: 0, reason: "unreachable" };
  }
}
