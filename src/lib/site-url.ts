const DEFAULT_SITE_URL = "https://wiktorszyszkowski.pl";

/** Domena produkcyjna (env lub fallback) — m.in. publiczne URL-e obrazków dla Stripe */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  return url.replace(/\/$/, "");
}

/**
 * Bazowy URL bieżącej wizyty (localhost w dev, domena na produkcji).
 * Stripe wymaga pełnych URL-i — bierzemy host z żądania, nie sztywną domenę.
 */
export function getRequestBaseUrl(request: Request): string {
  const origin = request.headers.get("origin");
  if (origin) {
    return origin.replace(/\/$/, "");
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      /* ignore */
    }
  }

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (host) {
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const proto =
      forwardedProto ??
      (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
    return `${proto}://${host}`.replace(/\/$/, "");
  }

  return getSiteUrl();
}
