import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FavorietenPageContent } from "@/components/favorieten-page-content";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import {
  fetchActieveAdvertenties,
  fetchPremiumAdvertenties,
} from "@/lib/advertentie-queries";
import { haalFavorietAdvertenties } from "@/lib/favorieten-queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mijn favorieten",
  description: "Je opgeslagen advertenties op Veloura.",
};

export default async function FavorietenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/favorieten");
  }

  const [advertenties, fallbackPremium, fallbackLatest] = await Promise.all([
    haalFavorietAdvertenties(supabase, user.id),
    fetchPremiumAdvertenties(supabase, 12),
    fetchActieveAdvertenties(supabase, { limit: 12 }),
  ]);

  const fotos = await haalEersteFotos(
    supabase,
    advertenties.map((a) => a.id)
  );

  const fallbackIds = [
    ...fallbackPremium.map((a) => a.id),
    ...fallbackLatest.map((a) => a.id),
  ];
  const fallbackFotos = await haalEersteFotos(supabase, [...new Set(fallbackIds)]);

  return (
    <FavorietenPageContent
      advertenties={advertenties}
      fotos={fotos}
      fallbackPremium={fallbackPremium}
      fallbackLatest={fallbackLatest}
      fallbackFotos={fallbackFotos}
    />
  );
}
