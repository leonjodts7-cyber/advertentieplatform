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
        <div className="category-nav__inner">
          <p className="category-nav__title">Populaire categorieën</p>
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

  const hasFilters =
    !!stad?.trim() ||
    !!categorie ||
    isTruthyFilter(beschikbaar) ||
    isTruthyFilter(geverifieerd);

  return (
    <div>
      <div className="zoek-page-header">
        <div className="container">
          <h1 className="section-title text-xl sm:text-2xl">Profielen zoeken</h1>
          <p className="section-subtitle mt-1 max-w-lg">
            Vind discrete profielen in jouw regio. Filter op stad, categorie en
            beschikbaarheid.
          </p>
        </div>
      </div>

      <CategoryNav activeSlug={categorie} />

      <div className="section-light">
        <div className="container py-5 sm:py-6">
          <Suspense
            fallback={
              <div className="filter-panel-light mb-5 h-40 animate-pulse rounded-2xl bg-[#f8f0e8]" />
            }
          >
            <div className="zoek-filters mb-5">
              <ZoekFilterBar />
            </div>
          </Suspense>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <p className="results-count">
              <strong>{advertenties.length}</strong>{" "}
              {advertenties.length === 1 ? "profiel" : "profielen"} gevonden
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
              <h3 className="font-display text-lg sm:text-xl">
                Geen profielen gevonden
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#74665f]">
                Pas je filters aan of plaats zelf een profiel als aanbieder.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
                {hasFilters && (
                  <Button asChild variant="secondary-light" size="md">
                    <Link href="/zoeken">Filters wissen</Link>
                  </Button>
                )}
                <Button asChild size="md">
                  <Link href="/dashboard/advertenties/nieuw">
                    Plaats advertentie
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
