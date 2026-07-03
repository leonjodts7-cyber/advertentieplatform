import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchProviderAnalytics } from "@/lib/analytics/queries";
import { isProviderRole } from "@/lib/user-role";
import { resolveUserRole } from "@/lib/user-role-server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await resolveUserRole(supabase, user);
  if (!isProviderRole(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") ?? "7");
  const range = days === 30 ? 30 : days === 90 ? 90 : 7;

  const summary = await fetchProviderAnalytics(supabase, user.id, range);
  return NextResponse.json(summary);
}
