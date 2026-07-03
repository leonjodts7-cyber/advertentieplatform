import { redirect } from "next/navigation";
import { DashboardOverview } from "@/components/dashboard-overview";
import type { Advertentie } from "@/lib/types";
import { haalAiLoungeStats } from "@/lib/ai/queries";
import { fetchProviderAnalytics } from "@/lib/analytics/queries";
import { createClient } from "@/lib/supabase/server";
import { zorgProfielBestaat } from "@/lib/profiel";
import { parseAdvertentieBeschrijving } from "@/lib/advertentie-metadata";
import { boostActief } from "@/lib/advertentie-boost";
import { isProviderRole } from "@/lib/user-role";
import { resolveUserRole } from "@/lib/user-role-server";
import { buildPageMetadata } from "@/lib/metadata-i18n";

function telActieveBoosts(ads: Pick<Advertentie, "beschrijving" | "status">[]): number {
  return ads.filter((a) => {
    if (a.status !== "actief") return false;
    const { meta } = parseAdvertentieBeschrijving(a.beschrijving ?? "");
    return boostActief(meta);
  }).length;
}

export async function generateMetadata() {
  return buildPageMetadata("pages.dashboard.title", "pages.dashboard.description", {
    path: "/dashboard",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/dashboard");

  const role = await resolveUserRole(supabase, user);
  if (!isProviderRole(role)) redirect("/zoeken");

  await zorgProfielBestaat(user.id, user.email ?? "");

  const [{ data: advertentiesRaw }, aiStats, initialAnalytics] = await Promise.all([
    supabase
      .from("advertenties")
      .select("id, titel, status, premium, beschrijving, premium_tot")
      .eq("aanbieder_id", user.id),
    haalAiLoungeStats(user.id),
    fetchProviderAnalytics(supabase, user.id, 7),
  ]);

  const advertenties = (advertentiesRaw ?? []) as Pick<
    Advertentie,
    "id" | "titel" | "status" | "premium" | "beschrijving" | "premium_tot"
  >[];

  const adIds = advertenties.map((a) => a.id);
  let listingFavorites = 0;
  if (adIds.length > 0) {
    const { count } = await supabase
      .from("favorieten")
      .select("id", { count: "exact", head: true })
      .in("advertentie_id", adIds);
    listingFavorites = count ?? 0;
  }

  const actief = advertenties.filter((a) => a.status === "actief").length;
  const concept = advertenties.filter((a) => a.status === "concept").length;
  const premiumActief = advertenties.filter((a) => {
    if (a.status !== "actief") return false;
    if (a.premium) return true;
    const { meta } = parseAdvertentieBeschrijving(a.beschrijving ?? "");
    return boostActief(meta);
  }).length;

  const actieveBoosts = telActieveBoosts(advertenties);
  const premiumDagen = advertenties.reduce((max, a) => {
    if (!a.premium_tot) return max;
    const diff = Math.ceil(
      (new Date(a.premium_tot).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(max, diff > 0 ? diff : 0);
  }, 0);

  const activity: Array<{
    id: string;
    messageKey: string;
    detail?: string;
    href?: string;
  }> = [];

  if (listingFavorites > 0) {
    activity.push({
      id: "fav",
      messageKey: "dashboardInsights.activityNewFavorite",
      detail: String(listingFavorites),
      href: "/dashboard",
    });
  }

  for (const ad of advertenties) {
    if (ad.premium_tot) {
      const diff = Math.ceil(
        (new Date(ad.premium_tot).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (diff > 0 && diff <= 7) {
        activity.push({
          id: `premium-${ad.id}`,
          messageKey: "dashboardInsights.activityPremiumExpiring",
          detail: ad.titel,
          href: "/dashboard/boosts",
        });
      }
    }
    const { meta } = parseAdvertentieBeschrijving(ad.beschrijving ?? "");
    if (boostActief(meta) && meta.boostEindigtOp) {
      const diff = Math.ceil(
        (new Date(meta.boostEindigtOp).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (diff <= 0) {
        activity.push({
          id: `boost-exp-${ad.id}`,
          messageKey: "dashboardInsights.activityBoostExpired",
          detail: ad.titel,
          href: "/dashboard/boosts",
        });
      }
    }
  }

  return (
    <DashboardOverview
      totaal={advertenties.length}
      actief={actief}
      concept={concept}
      premiumActief={premiumActief}
      actieveBoosts={actieveBoosts}
      premiumDagen={premiumDagen}
      listingFavorites={listingFavorites}
      aiCredits={aiStats.resterendeCredits}
      activity={activity.slice(0, 8)}
      initialAnalytics={initialAnalytics}
    />
  );
}
