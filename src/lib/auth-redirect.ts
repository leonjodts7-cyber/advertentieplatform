export function getAuthCallbackUrl(origin: string) {
  return `${origin}/auth/callback?next=${encodeURIComponent("/login?confirmed=1")}`;
}
