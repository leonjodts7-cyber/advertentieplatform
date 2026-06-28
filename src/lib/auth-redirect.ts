export function getAuthCallbackUrl(origin: string) {
  return `${origin}/auth/callback?next=${encodeURIComponent("/login?confirmed=1")}`;
}

/** Alleen interne paden — voorkom open redirects. */
export function getSafeRedirectPath(
  path: string | null | undefined,
  fallback = "/dashboard"
): string {
  if (!path) return fallback;
  const trimmed = path.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  if (trimmed.startsWith("/login")) return fallback;
  return trimmed;
}
