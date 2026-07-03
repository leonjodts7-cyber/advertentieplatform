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
  let displayName: string | null = null;

  if (user) {
    const supabase = await createClient();
    role = await resolveUserRole(supabase, user);

    const { data: profiel } = await supabase
      .from("profielen")
      .select("email")
      .eq("id", user.id)
      .maybeSingle();

    displayName =
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      profiel?.email?.split("@")[0] ??
      null;
  }

  return <HeaderClient user={user} role={role} displayName={displayName} />;
}
