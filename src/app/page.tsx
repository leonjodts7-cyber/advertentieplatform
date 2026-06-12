import Link from "next/link";
import { AdvertentieCard } from "@/components/advertentie-card";
import { MarketplaceHeroSearch } from "@/components/marketplace-hero-search";
import { Button } from "@/components/ui/button";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

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

const POPULAIRE_ZOEKOPDRACHTEN = [
  { label: "Escort Antwerpen", href: "/zoeken?stad=Antwerpen&categorie=escort" },
  { label: "Privé ontvangst Gent", href: "/zoeken?stad=Gent&categorie=prive-ontvangst" },
  { label: "Massage Brussel", href: "/zoeken?stad=Brussel&categorie=massage" },
  { label: "Video afspraak", href: "/zoeken?categorie=video" },
  { label: "Beschikbaar vandaag", href: "/zoeken?beschikbaar=true" },
  { label: "Geverifieerde profielen", href: "/zoeken?geverifieerd=true" },
] as const;

const LOCATIE_CARDS = [
  {
    slug: "prive-huizen",
    label: "Privéhuizen",
    beschrijving: "Discrete privélocaties voor ontmoetingen in jouw regio.",
  },
  {
    slug: "massagesalons",
    label: "Massagesalons",
    beschrijving: "Professionele massagesalons en wellness-adressen.",
  },
  {
    slug: "rendez-vous-hotels",
    label: "Rendez-vous hotels",
    beschrijving: "Hotels en suites voor discrete afspraken.",
  },
  {
    slug: "prive-saunas",
    label: "Privé sauna's",
    beschrijving: "Privé sauna's en wellness met discrete sfeer.",
  },
  {
    slug: "bars-priveclubs",
    label: "Bars & privéclubs",
    beschrijving: "Stijlvolle bars en privéclubs voor avondbezoek.",
  },
  {
    slug: "parenclubs",
    label: "Parenclubs",
    beschrijving: "Clubs en locaties voor koppels en swingers.",
  },
] as const;

const WAAROM_VELOURA = [
  {
    titel: "Discreet zoeken",
    tekst: "Zoek op stad en categorie zonder opdringerige uitstraling. Jij bepaalt wat je deelt.",
  },
  {
    titel: "Direct contact",
    tekst: "Neem rechtstreeks contact op met aanbieders. Geen tussenpersonen, geen gedoe.",
  },
  {
    titel: "Geverifieerde profielen",
    tekst: "Herken betrouwbare aanbieders via verificatie en duidelijke profielinformatie.",
  },
  {
    titel: "Mobiel-first ervaring",
    tekst: "Veloura is gebouwd voor je telefoon — snel browsen, duidelijke profielkaarten.",
  },
];

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

export default async function HomePage() {
  const supabase = await createClient();

  const { data: advertentiesRaw } = await supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .order("aangemaakt_op", { ascending: false })
    .limit(8);

  const advertenties = (advertentiesRaw ?? []) as Advertentie[];
  const fotos = await haalEersteFotos(
    supabase,
    advertenties.map((a) => a.id)
  );

  return (
    <div>
      {/* 1. Hero */}
      <section className="section-dark hero-section border-b border-white/10">
        <div className="container">
          <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-8">
            <div className="order-2 lg:order-1 animate-fade-in">
              <p className="trustline-text text-[0.625rem] font-medium uppercase sm:text-[0.6875rem]">
                Alleen 18+ · Discreet · Geverifieerd · Direct contact
              </p>

              <h1 className="font-display mt-2.5 text-[1.75rem] font-medium leading-[1.1] sm:text-4xl lg:text-[2.375rem]">
                Vind discrete profielen in jouw regio
              </h1>

              <p className="mt-2.5 max-w-lg text-sm leading-relaxed sm:text-base">
                Zoek privé ontvangst, escort, video en meer. Direct contact met
                zelfstandige aanbieders, discreet en mobiel-first.
              </p>

              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/zoeken">Zoek profielen</Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Link href="/dashboard/advertenties/nieuw">
                    Plaats advertentie
                  </Link>
                </Button>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="hero-search-panel glass-card p-4 sm:p-5">
                <MarketplaceHeroSearch />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Premium dark categoriebalk */}
      <CategoryNav />

      {/* 3. Nieuwste advertenties — alleen Supabase */}
      <section className="section-light marketplace-section">
        <div className="container">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="section-title">Nieuwste advertenties</h2>
              <p className="section-subtitle mt-1">Actieve profielen op Veloura</p>
            </div>
            {advertenties.length > 0 && (
              <Link
                href="/zoeken"
                className="hidden text-sm font-medium hover:underline sm:inline"
                style={{ color: "var(--wine)" }}
              >
                Alles bekijken →
              </Link>
            )}
          </div>

          {advertenties.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <div className="empty-state-card mt-5">
              <h3 className="font-display text-xl sm:text-2xl">
                Nog geen actieve advertenties
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed">
                Plaats jouw profiel en word als eerste zichtbaar op Veloura.
              </p>
              <Button asChild size="lg" className="mt-6">
                <Link href="/dashboard/advertenties/nieuw">
                  Plaats advertentie
                </Link>
              </Button>
            </div>
          )}

          {advertenties.length > 0 && (
            <div className="mt-4 text-center sm:hidden">
              <Link
                href="/zoeken"
                className="text-sm font-medium"
                style={{ color: "var(--wine)" }}
              >
                Alles bekijken →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* A. Populaire zoekopdrachten */}
      <section className="section-dark marketplace-section border-t border-white/10">
        <div className="container">
          <h2 className="section-title text-lg sm:text-xl">
            Populaire zoekopdrachten
          </h2>
          <p className="section-subtitle mt-1">
            Snel naar veelgezochte combinaties
          </p>
          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAIRE_ZOEKOPDRACHTEN.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="search-link-card"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* B. Populaire locaties */}
      <section className="section-light marketplace-section border-t border-[#e6d8cf]">
        <div className="container">
          <h2 className="section-title text-lg sm:text-xl">
            Populaire locaties
          </h2>
          <p className="section-subtitle mt-1">
            Ontdek adressen en diensten per categorie
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LOCATIE_CARDS.map((loc) => (
              <Link
                key={loc.slug}
                href={`/zoeken?categorie=${loc.slug}`}
                className="location-card group"
              >
                <p className="location-card__title">{loc.label}</p>
                <p className="location-card__desc">{loc.beschrijving}</p>
                <span className="location-card__cta">Bekijk →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* C. Waarom Veloura */}
      <section className="section-dark marketplace-section border-t border-white/10">
        <div className="container">
          <h2 className="section-title">Waarom Veloura?</h2>
          <p className="section-subtitle mt-1 max-w-lg">
            Premium marketplace voor volwassenen die discretie en kwaliteit
            waarderen.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WAAROM_VELOURA.map((v) => (
              <div key={v.titel} className="trust-card-dark p-4 sm:p-5">
                <h3 className="font-display text-base font-medium sm:text-lg">
                  {v.titel}
                </h3>
                <p className="mt-2 text-sm leading-relaxed">{v.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* D. Voor aanbieders */}
      <section className="section-darker marketplace-section border-t border-white/10">
        <div className="container">
          <div className="provider-cta-card mx-auto max-w-2xl p-8 text-center sm:p-10">
            <h2 className="font-display text-xl sm:text-2xl">
              Word zichtbaar bij bezoekers in jouw regio
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed sm:text-base">
              Plaats jouw advertentie, beheer je profiel en bereik sneller
              geïnteresseerde bezoekers.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
