import type { User } from "@supabase/supabase-js";
import { HeaderClient } from "@/components/header-client";
import { resolveUserRole } from "@/lib/user-role-server";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_ROLE } from "@/lib/user-role";

interface HeaderProps {
  user: User | null;
}

export async function Header({ user }: HeaderProps) {
  let role = DEFAULT_ROLE;
  if (user) {
    const supabase = await createClient();
    role = await resolveUserRole(supabase, user);
  }

  return <HeaderClient user={user} role={role} />;
}
