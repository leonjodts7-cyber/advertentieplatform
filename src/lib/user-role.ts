import type { User } from "@supabase/supabase-js";

export type UserRole = "visitor" | "provider" | "admin";

export const DEFAULT_ROLE: UserRole = "visitor";

export function isUserRole(value: unknown): value is UserRole {
  return value === "visitor" || value === "provider" || value === "admin";
}

export function getRoleFromUser(user: User | null | undefined): UserRole {
  if (!user) return DEFAULT_ROLE;
  const metaRole = user.user_metadata?.role;
  if (isUserRole(metaRole)) return metaRole;
  return DEFAULT_ROLE;
}

export function isProviderRole(role: UserRole): boolean {
  return role === "provider" || role === "admin";
}

export function buildLoginHref(options?: {
  redirect?: string;
  intent?: "provider";
  tab?: "registreren";
}): string {
  const params = new URLSearchParams();
  if (options?.redirect) params.set("redirect", options.redirect);
  if (options?.intent) params.set("intent", options.intent);
  if (options?.tab === "registreren") params.set("tab", "registreren");
  const qs = params.toString();
  return qs ? `/login?${qs}` : "/login";
}

export function needsRoleChoice(user: User): boolean {
  const meta = user.user_metadata;
  if (meta?.role_chosen === true) return false;
  if (isUserRole(meta?.role)) return false;
  return true;
}

export function buildPlaatsAdvertentieHref(isLoggedIn: boolean): string {
  if (isLoggedIn) return "/dashboard/advertenties/nieuw";
  return buildLoginHref({
    redirect: "/dashboard/advertenties/nieuw",
    intent: "provider",
  });
}
