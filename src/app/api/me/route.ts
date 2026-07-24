import { NextResponse } from "next/server";
import { getCachedUser } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/server";
import { resolveUserRole } from "@/lib/user-role-server";

export async function GET() {
  const user = await getCachedUser();
  if (!user) {
    return NextResponse.json({ user: null, role: "visitor", displayName: null });
  }

  const supabase = await createClient();
  const role = await resolveUserRole(supabase, user);

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    null;

  return NextResponse.json({
    user: { id: user.id, email: user.email },
    role,
    displayName,
  });
}
