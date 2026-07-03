import { redirect } from "next/navigation";
import { DashboardBoostsContent } from "@/components/dashboard-boosts-content";
import { buildPageMetadata } from "@/lib/metadata-i18n";

export async function generateMetadata() {
  return buildPageMetadata("pages.boosts.title", "pages.boosts.description", {
    path: "/dashboard/boosts",
  });
}

export default async function DashboardBoostsPage() {
  const { createClient } = await import("@/lib/supabase/server");
  const { isProviderRole } = await import("@/lib/user-role");
  const { resolveUserRole } = await import("@/lib/user-role-server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/dashboard/boosts");

  const role = await resolveUserRole(supabase, user);
  if (!isProviderRole(role)) redirect("/zoeken");

  return <DashboardBoostsContent />;
}
