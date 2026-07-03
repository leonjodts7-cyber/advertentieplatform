import { redirect } from "next/navigation";
import { DashboardSettingsContent } from "@/components/dashboard-settings-content";
import { createClient } from "@/lib/supabase/server";
import { zorgProfielBestaat } from "@/lib/profiel";
import { buildPageMetadata } from "@/lib/metadata-i18n";

export async function generateMetadata() {
  return buildPageMetadata("pages.settings.title", "pages.settings.description", {
    path: "/dashboard/instellingen",
  });
}

export default async function DashboardInstellingenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await zorgProfielBestaat(user.id, user.email ?? "");

  return (
    <DashboardSettingsContent
      email={user.email ?? "—"}
      emailConfirmed={Boolean(user.email_confirmed_at)}
    />
  );
}
