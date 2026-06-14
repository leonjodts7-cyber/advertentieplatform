import { haalEersteFotos } from "@/lib/advertentie-fotos";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { HomeHero } from "@/components/home/home-hero";
import { HomeSearchTabs } from "@/components/home/home-search-tabs";
import { DiscoveryQuickPick } from "@/components/home/discovery-quick-pick";
import { HomeAdSection } from "@/components/home/home-ad-section";
import { CategoryDiscovery } from "@/components/home/category-discovery";
import { CityDiscovery } from "@/components/home/city-discovery";
import { WhyVelouraDiscovery } from "@/components/home/why-veloura-discovery";
import { AiLoungeTeaser } from "@/components/home/ai-lounge-teaser";

const STEDEN = [
  "Antwerpen",
  "Brussel",
  "Gent",
  "Leuven",
  "Hasselt",
  "Brugge",
] as const;

function telStadCount(
  advertenties: Pick<Advertentie, "stad">[],
  stad: string
): number {
  return advertenties.filter((a) =>
    a.stad?.toLowerCase().includes(stad.toLowerCase())
  ).length;
}

export default async function HomePage() {
  const supabase = await createClient();

  const [
    { data: nuOnlineRaw },
    { data: alleStedenRaw },
  ] = await Promise.all([
    supabase
      .from("advertenties")
      .select("*")
      .eq("status", "actief")
      .eq("beschikbaar", true)
      .order("bijgewerkt_op", { ascending: false })
      .limit(8),
    supabase.from("advertenties").select("stad").eq("status", "actief"),
  ]);

  const nuOnline = (nuOnlineRaw ?? []) as Advertentie[];
  const alleSteden = (alleStedenRaw ?? []) as Pick<Advertentie, "stad">[];

  const fotos = await haalEersteFotos(
    supabase,
    nuOnline.map((a) => a.id)
  );

  const cityCounts = Object.fromEntries(
    STEDEN.map((stad) => [stad, telStadCount(alleSteden, stad)])
  );

  const categoryCounts: Record<string, number> = {};

  return (
    <div className="discovery-home">
      <HomeHero />
      <HomeSearchTabs />
      <DiscoveryQuickPick />

      <HomeAdSection
        title="Nu online"
        subtitle="Profielen die momenteel actief zijn"
        advertenties={nuOnline}
        fotos={fotos}
        viewAllHref="/zoeken"
        showSkeleton={nuOnline.length === 0}
      />

      <CategoryDiscovery counts={categoryCounts} />
      <CityDiscovery counts={cityCounts} />
      <WhyVelouraDiscovery />
      <AiLoungeTeaser />
    </div>
  );
}
