import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import {
  DEFAULT_ROLE,
  getRoleFromUser,
  isProviderRole,
  type UserRole,
} from "@/lib/user-role";

export async function resolveUserRole(
  supabase: SupabaseClient,
  user: User
): Promise<UserRole> {
  const metaRole = getRoleFromUser(user);
  if (metaRole === "admin") return "admin";
  if (metaRole === "provider") return "provider";

  const { count } = await supabase
    .from("advertenties")
    .select("id", { count: "exact", head: true })
    .eq("aanbieder_id", user.id);

  if (count && count > 0) return "provider";
  return DEFAULT_ROLE;
}

/** Alias for resolveUserRole — gebruik in server components en routes. */
export async function getCurrentUserRole(
  supabase: SupabaseClient,
  user: User
): Promise<UserRole> {
  return resolveUserRole(supabase, user);
}

export async function requireProviderRole(
  supabase: SupabaseClient,
  user: User
): Promise<UserRole> {
  const role = await resolveUserRole(supabase, user);
  if (!isProviderRole(role)) return DEFAULT_ROLE;
  return role;
}
