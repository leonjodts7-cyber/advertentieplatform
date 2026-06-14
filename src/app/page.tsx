import Link from "next/link";
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
    { data: vandaagRaw },
    { data: alleStedenRaw },
  ] = await Promise.all([
    supabase
      .from("advertenties")
      .select("*")
      .eq("status", "actief")
      .eq("beschikbaar", true)
      .order("bijgewerkt_op", { ascending: false })
      .limit(8),
    supabase
      .from("advertenties")
      .select("*")
      .eq("status", "actief")
      .eq("beschikbaar", true)
      .order("aangemaakt_op", { ascending: false })
      .limit(8),
    supabase.from("advertenties").select("stad").eq("status", "actief"),
  ]);

  const nuOnline = (nuOnlineRaw ?? []) as Advertentie[];
  const vandaagBeschikbaar = (vandaagRaw ?? []) as Advertentie[];
  const alleSteden = (alleStedenRaw ?? []) as Pick<Advertentie, "stad">[];

  const allIds = [
    ...new Set([
      ...nuOnline.map((a) => a.id),
      ...vandaagBeschikbaar.map((a) => a.id),
    ]),
  ];
  const fotos = await haalEersteFotos(supabase, allIds);

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
        viewAllHref="/zoeken?beschikbaar=true"
        showSkeleton={nuOnline.length === 0}
      />

      <HomeAdSection
        title="Vandaag beschikbaar"
        subtitle="Profielen die vandaag een afspraak kunnen inplannen"
        advertenties={vandaagBeschikbaar}
        fotos={fotos}
        viewAllHref="/zoeken?beschikbaar=true"
        emptyState={
          <div className="discovery-empty-inline mt-5">
            <p className="font-display text-lg text-[#24191f]">
              Geen profielen beschikbaar vandaag
            </p>
            <p className="mt-2 text-sm text-[#74665f]">
              Probeer een andere stad of bekijk alle profielen.
            </p>
            <Link
              href="/zoeken"
              className="mt-4 inline-flex text-sm font-medium text-[#7b2f49] hover:underline"
            >
              Alle profielen bekijken →
            </Link>
          </div>
        }
      />

      <CategoryDiscovery counts={categoryCounts} />
      <CityDiscovery counts={cityCounts} />
      <WhyVelouraDiscovery />
      <AiLoungeTeaser />
    </div>
  );
}
