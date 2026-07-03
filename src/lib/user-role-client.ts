"use client";

import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/user-role";

export async function setUserRole(role: UserRole): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    data: { role, role_chosen: true },
  });
  return { error: error?.message ?? null };
}
