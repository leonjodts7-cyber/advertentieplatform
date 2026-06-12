import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { AdvertentieCard } from "@/components/advertentie-card";
import { ZoekFilterBar } from "@/components/zoek-filter-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Profielen zoeken",
  description: "Zoek discrete profielen op Veloura. Alleen 18+.",
};

const NAV_CATEGORIEEN = [
  { slug: "prive-huizen", label: "Privéhuizen" },
  { slug: "prive-ontvangst", label: "Privé ontvangst" },
  { slug: "escort", label: "Escort" },
  { slug: "massagesalons", label: "Massagesalons" },
  { slug: "bars-priveclubs", label: "Bars & privéclubs" },
  { slug: "rendez-vous-hotels", label: "Rendez-vous hotels" },
  { slug: "prive-saunas", label: "Privé sauna's" },
  { slug: "parenclubs", label: "Parenclubs" },
  { slug: "video", label: "Video" },
  { slug: "koppels", label: "Koppels" },
  { slug: "trans", label: "Trans" },
  { slug: "mannen", label: "Mannen" },
  { slug: "vrouwen", label: "Vrouwen" },
] as const;

interface ZoekenPageProps {
  searchParams: Promise<{
    stad?: string;
    categorie?: string;
    beschikbaar?: string;
    geverifieerd?: string;
  }>;
}

function isTruthyFilter(value?: string) {
  return value === "1" || value === "true";
}

function CategoryNav({ activeSlug }: { activeSlug?: string }) {
  return (
    <nav className="category-nav" aria-label="Categorieën">
      <div className="container">
        <div className="category-nav__scroll no-scrollbar">
          {NAV_CATEGORIEEN.map((cat) => (
            <Link
              key={cat.slug}
              href={`/zoeken?categorie=${cat.slug}`}
              className={cn(
                "category-nav__chip",
                activeSlug === cat.slug && "category-nav__chip--active"
              )}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default async function ZoekenPage({ searchParams }: ZoekenPageProps) {
  const { stad, categorie, beschikbaar, geverifieerd } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .order("aangemaakt_op", { ascending: false });

  if (stad?.trim()) query = query.ilike("stad", `%${stad.trim()}%`);
  if (isTruthyFilter(beschikbaar)) query = query.eq("beschikbaar", true);
  if (isTruthyFilter(geverifieerd)) query = query.eq("geverifieerd", true);

  const { data: advertentiesRaw } = await query;
  const advertenties = (advertentiesRaw ?? []) as Advertentie[];

  const categorieLabel = categorie
    ? NAV_CATEGORIEEN.find((c) => c.slug === categorie)?.label
    : null;

  const fotos = await haalEersteFotos(
    supabase,
    advertenties.map((a) => a.id)
  );

  return (
    <div>
      <div className="section-dark page-header-band border-b border-white/10">
        <div className="container">
          <h1 className="section-title text-[#fff4ec]">Profielen zoeken</h1>
          <p className="section-subtitle mt-1.5 max-w-lg text-[#b8aaa2]">
            Vind discrete profielen in jouw regio. Filter op stad, categorie en
            beschikbaarheid.
          </p>
        </div>
      </div>

      <CategoryNav activeSlug={categorie} />

      <div className="section-light">
        <div className="container py-6 sm:py-8">
          <Suspense
            fallback={
              <div className="filter-panel-light mb-6 h-48 animate-pulse bg-[#faf7f4]" />
            }
          >
            <div className="mb-6">
              <ZoekFilterBar />
            </div>
          </Suspense>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <p className="text-sm text-[#786a63]">
              <span className="font-medium text-[#24191f]">
                {advertenties.length}
              </span>{" "}
              profielen
              {stad?.trim() ? ` in ${stad.trim()}` : ""}
            </p>
            {categorieLabel && (
              <Badge variant="wine">{categorieLabel}</Badge>
            )}
            {isTruthyFilter(beschikbaar) && (
              <Badge variant="online">Beschikbaar</Badge>
            )}
            {isTruthyFilter(geverifieerd) && (
              <Badge variant="verified">Geverifieerd</Badge>
            )}
          </div>

          {advertenties.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {advertenties.map((advertentie) => (
                <AdvertentieCard
                  key={advertentie.id}
                  advertentie={advertentie}
                  afbeeldingUrl={fotos.get(advertentie.id)}
                  theme="light"
                />
              ))}
            </div>
          ) : (
            <div className="empty-state-card mx-auto max-w-md">
              <h3 className="font-display text-xl">Geen profielen gevonden</h3>
              <p className="mt-2 text-sm leading-relaxed">
                Pas je filters aan of plaats zelf een profiel als aanbieder.
              </p>
              <Button asChild variant="primary" className="mt-5">
                <Link href="/dashboard/advertenties/nieuw">
                  Plaats advertentie
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
