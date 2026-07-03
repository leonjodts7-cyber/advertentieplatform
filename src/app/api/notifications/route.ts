import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isProviderRole } from "@/lib/user-role";
import { resolveUserRole } from "@/lib/user-role-server";
import { parseAdvertentieBeschrijving } from "@/lib/advertentie-metadata";
import { boostActief } from "@/lib/advertentie-boost";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json([]);
  }

  const role = await resolveUserRole(supabase, user);
  if (!isProviderRole(role)) {
    return NextResponse.json([]);
  }

  const { data: advertenties } = await supabase
    .from("advertenties")
    .select("id, titel, premium_tot, beschrijving, status")
    .eq("aanbieder_id", user.id);

  const notifications: Array<{
    id: string;
    type: string;
    body?: string;
    href?: string;
    read: boolean;
    createdAt: string;
  }> = [];

  const adIds = (advertenties ?? []).map((a) => a.id as string);
  if (adIds.length > 0) {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentFavs } = await supabase
      .from("favorieten")
      .select("id, advertentie_id, created_at")
      .in("advertentie_id", adIds)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5);

    for (const fav of recentFavs ?? []) {
      const ad = advertenties?.find((a) => a.id === fav.advertentie_id);
      notifications.push({
        id: `fav-${fav.id}`,
        type: "newFavorite",
        body: ad?.titel as string | undefined,
        href: "/dashboard",
        read: false,
        createdAt: fav.created_at as string,
      });
    }
  }

  for (const ad of advertenties ?? []) {
    if (ad.premium_tot) {
      const diff = new Date(ad.premium_tot as string).getTime() - Date.now();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (days > 0 && days <= 7) {
        notifications.push({
          id: `premium-${ad.id}`,
          type: "premiumExpiring",
          body: ad.titel as string,
          href: "/dashboard/boosts",
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    const { meta } = parseAdvertentieBeschrijving((ad.beschrijving as string) ?? "");
    if (boostActief(meta) && meta.boostEindigtOp) {
      const diff = new Date(meta.boostEindigtOp).getTime() - Date.now();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (days > 0 && days <= 3) {
        notifications.push({
          id: `boost-${ad.id}`,
          type: "boostExpiring",
          body: ad.titel as string,
          href: "/dashboard/boosts",
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  return NextResponse.json(notifications.slice(0, 12));
}
