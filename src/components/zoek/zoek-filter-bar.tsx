"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CategoryChip } from "@/components/ui/category-chip";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import {
  AFSTAND_OPTIES,
  MARKETPLACE_CATEGORIEEN,
  TYPE_AFSPRAAK_OPTIES,
} from "@/lib/marketplace";
import {
  ALLE_CATEGORIE_OPTIES,
  buildFilterParams,
  HAARKLEUR_OPTIES,
  OOGKLEUR_OPTIES,
  TAAL_OPTIES,
  type ZoekFilterValues,
} from "@/lib/zoek-filters";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/contexts/locale-context";
import { fetchAiZoekParams } from "@/lib/ai-zoek-nav";

const AI_VOORBEELDEN = [
  "Blonde escort in Antwerpen onder €200",
  "Massage in Gent",
  "Video afspraak in het Nederlands",
  "Geverifieerd profiel in Brussel",
];

function boolFromParam(value: string | null) {
  return value === "true" || value === "1";
}

export function ZoekFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [extendedOpen, setExtendedOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(searchParams.get("ai") === "1");

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [stad, setStad] = useState(searchParams.get("stad") ?? "");
  const [categorie, setCategorie] = useState<string | null>(
    searchParams.get("categorie")
  );
  const [afstand, setAfstand] = useState(searchParams.get("afstand") ?? "");
  const [typeAfspraak, setTypeAfspraak] = useState(
    searchParams.get("type_afspraak") ?? ""
  );
  const [extCategorie, setExtCategorie] = useState(
    searchParams.get("categorie") ?? ""
  );
  const [leeftijdVan, setLeeftijdVan] = useState(searchParams.get("leeftijd_van") ?? "");
  const [leeftijdTot, setLeeftijdTot] = useState(searchParams.get("leeftijd_tot") ?? "");
  const [prijsMin, setPrijsMin] = useState(searchParams.get("prijs_min") ?? "");
  const [prijsMax, setPrijsMax] = useState(searchParams.get("prijs_max") ?? "");
  const [lengteVan, setLengteVan] = useState(searchParams.get("lengte_van") ?? "");
  const [lengteTot, setLengteTot] = useState(searchParams.get("lengte_tot") ?? "");
  const [haarkleur, setHaarkleur] = useState(searchParams.get("haarkleur") ?? "");
  const [oogkleur, setOogkleur] = useState(searchParams.get("oogkleur") ?? "");
  const [taal, setTaal] = useState(searchParams.get("taal") ?? "");
  const [geverifieerd, setGeverifieerd] = useState(
    boolFromParam(searchParams.get("geverifieerd"))
  );
  const [beschikbaar, setBeschikbaar] = useState(
    boolFromParam(searchParams.get("beschikbaar"))
  );
  const [hotelMogelijk, setHotelMogelijk] = useState(
    boolFromParam(searchParams.get("hotel_mogelijk"))
  );
  const [thuisOntvangen, setThuisOntvangen] = useState(
    boolFromParam(searchParams.get("thuis_ontvangen"))
  );
  const [videoMogelijk, setVideoMogelijk] = useState(
    boolFromParam(searchParams.get("video_mogelijk"))
  );
  const [discreetContact, setDiscreetContact] = useState(
    boolFromParam(searchParams.get("discreet_contact"))
  );
  const [nieuwProfiel, setNieuwProfiel] = useState(
    boolFromParam(searchParams.get("nieuw_profiel"))
  );
  const [premiumProfiel, setPremiumProfiel] = useState(
    boolFromParam(searchParams.get("premium_profiel"))
  );
  const [verplaatsingMogelijk, setVerplaatsingMogelijk] = useState(
    boolFromParam(searchParams.get("verplaatsing_mogelijk"))
  );
  const [koppelsWelkom, setKoppelsWelkom] = useState(
    boolFromParam(searchParams.get("koppels_welkom"))
  );
  const [aiQuery, setAiQuery] = useState(
    searchParams.get("ai") === "1" ? searchParams.get("q") ?? "" : ""
  );
  const [aiLaden, setAiLaden] = useState(false);

  function getValues(): ZoekFilterValues {
    const activeCategorie = categorie ?? (extCategorie || null);
    return {
      q,
      stad,
      afstand,
      categorie: activeCategorie,
      typeAfspraak,
      leeftijdVan,
      leeftijdTot,
      prijsMin,
      prijsMax,
      lengteVan,
      lengteTot,
      haarkleur,
      oogkleur,
      taal,
      geverifieerd,
      beschikbaar,
      hotelMogelijk,
      thuisOntvangen,
      videoMogelijk,
      discreetContact,
      nieuwProfiel,
      premiumProfiel,
      verplaatsingMogelijk,
      koppelsWelkom,
    };
  }

  function navigate(params: URLSearchParams) {
    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `/zoeken?${qs}` : "/zoeken");
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(buildFilterParams(getValues()));
  }

  async function handleAiSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAiLaden(true);
    try {
      const params = await fetchAiZoekParams(aiQuery);
      startTransition(() => {
        router.push(`/zoeken?${params}`);
      });
    } finally {
      setAiLaden(false);
    }
  }

  function handleClear() {
    setQ("");
    setStad("");
    setCategorie(null);
    setAfstand("");
    setTypeAfspraak("");
    setExtCategorie("");
    setLeeftijdVan("");
    setLeeftijdTot("");
    setPrijsMin("");
    setPrijsMax("");
    setLengteVan("");
    setLengteTot("");
    setHaarkleur("");
    setOogkleur("");
    setTaal("");
    setGeverifieerd(false);
    setBeschikbaar(false);
    setHotelMogelijk(false);
    setThuisOntvangen(false);
    setVideoMogelijk(false);
    setDiscreetContact(false);
    setNieuwProfiel(false);
    setPremiumProfiel(false);
    setVerplaatsingMogelijk(false);
    setKoppelsWelkom(false);
    setAiQuery("");
    setExtendedOpen(false);
    setAiOpen(false);
    navigate(new URLSearchParams());
  }

  const hasFilters = Array.from(searchParams.keys()).some(
    (k) => k !== "ai" && searchParams.get(k)
  );

  return (
    <div className="zoek-filter-bar">
      {aiOpen ? (
        <form onSubmit={handleAiSubmit} className="zoek-filter-bar__ai">
          <div className="zoek-filter-bar__ai-header">
            <button
              type="button"
              className="zoek-filter-bar__back"
              onClick={() => setAiOpen(false)}
            >
              {t("search.backQuick")}
            </button>
            <span className="zoek-filter-bar__ai-title">
              <Sparkles className="h-4 w-4" aria-hidden />
              {t("search.aiSearch")}
            </span>
          </div>
          <label htmlFor="zoek-ai" className="filter-label">
            Beschrijf wat je zoekt…
          </label>
          <Textarea
            id="zoek-ai"
            variant="light"
            placeholder="Beschrijf wat je zoekt…"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="min-h-[96px]"
          />
          <div className="popular-chip-grid mt-2">
            {AI_VOORBEELDEN.map((ex) => (
              <button
                key={ex}
                type="button"
                className="popular-chip"
                onClick={() => setAiQuery(ex)}
              >
                {ex}
              </button>
            ))}
          </div>
          <Button
            type="submit"
            size="md"
            disabled={isPending || aiLaden}
            className="mt-3 w-full gap-2 sm:w-auto"
          >
            <Sparkles className="h-4 w-4" />
            {aiLaden ? "AI analyseert…" : "Zoek met AI"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="zoek-filter-bar__compact">
          <div className="zoek-filter-bar__row">
            <div className="zoek-filter-bar__field zoek-filter-bar__field--grow">
              <label htmlFor="zoek-q" className="filter-label">
                Zoeken
              </label>
              <Input
                id="zoek-q"
                variant="light"
                size="compact"
                placeholder="Zoek op stad, naam of trefwoord…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="zoek-filter-bar__field zoek-filter-bar__field--grow">
              <label htmlFor="zoek-stad" className="filter-label">
                Stad / regio
              </label>
              <Input
                id="zoek-stad"
                variant="light"
                size="compact"
                placeholder="Bijv. Antwerpen"
                value={stad}
                onChange={(e) => setStad(e.target.value)}
              />
            </div>
            <div className="zoek-filter-bar__field zoek-filter-bar__field--btn">
              <Button type="submit" size="md" disabled={isPending} className="w-full">
                {t("search.showProfiles")}
              </Button>
            </div>
          </div>

          <div className="zoek-filter-bar__chips">
            <p className="filter-label">Categorie</p>
            <div className="category-chip-scroll no-scrollbar">
              {MARKETPLACE_CATEGORIEEN.map((cat) => (
                <CategoryChip
                  key={cat.slug}
                  label={cat.label}
                  active={categorie === cat.slug}
                  onClick={() => {
                    const next = categorie === cat.slug ? null : cat.slug;
                    setCategorie(next);
                    setExtCategorie(next ?? "");
                  }}
                />
              ))}
            </div>
          </div>

          <div className="zoek-filter-bar__meta">
            <button
              type="button"
              className={cn(
                "zoek-filter-bar__extend-btn",
                extendedOpen && "zoek-filter-bar__extend-btn--active"
              )}
              onClick={() => setExtendedOpen(true)}
            >
              {t("search.filters")}
            </button>
            <button
              type="button"
              className={cn(
                "zoek-filter-bar__ai-link",
                aiOpen && "zoek-filter-bar__ai-link--active"
              )}
              onClick={() => setAiOpen(true)}
            >
              {t("search.aiSearch")}
            </button>
            {hasFilters && (
              <button
                type="button"
                className="zoek-filter-bar__clear"
                onClick={handleClear}
              >
                {t("search.clearFiltersBtn")}
              </button>
            )}
          </div>
        </form>
      )}

      {extendedOpen && (
        <>
          <button
            type="button"
            className="zoek-filter-drawer__backdrop"
            aria-label="Sluit filters"
            onClick={() => setExtendedOpen(false)}
          />
          <aside className="zoek-filter-drawer" aria-label="Uitgebreide filters">
            <div className="zoek-filter-drawer__head">
              <h2 className="zoek-filter-drawer__title">{t("search.filters")}</h2>
              <button
                type="button"
                className="zoek-filter-drawer__close"
                onClick={() => setExtendedOpen(false)}
              >
                {t("nav.close")}
              </button>
            </div>
            <div className="zoek-filter-drawer__body">
              <p className="zoek-filter-bar__section-label">Basis</p>
              <div className="zoek-filter-bar__extended-grid">
                <div>
                  <label htmlFor="afstand" className="filter-label">Afstand</label>
                  <select id="afstand" className="filter-select filter-select--compact" value={afstand} onChange={(e) => setAfstand(e.target.value)}>
                    {AFSTAND_OPTIES.map((o) => (
                      <option key={o.value || "all"} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="ext-categorie" className="filter-label">Categorie</label>
                  <select id="ext-categorie" className="filter-select filter-select--compact" value={extCategorie} onChange={(e) => { setExtCategorie(e.target.value); setCategorie(e.target.value || null); }}>
                    {ALLE_CATEGORIE_OPTIES.map((o) => (
                      <option key={o.value || "all"} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="type-afspraak" className="filter-label">Type afspraak</label>
                  <select id="type-afspraak" className="filter-select filter-select--compact" value={typeAfspraak} onChange={(e) => setTypeAfspraak(e.target.value)}>
                    {TYPE_AFSPRAAK_OPTIES.map((o) => (
                      <option key={o.value || "all"} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="zoek-filter-bar__section-label">Prijs</p>
              <div className="zoek-filter-bar__extended-grid zoek-filter-bar__extended-grid--2">
                <div>
                  <label htmlFor="prijs-min" className="filter-label">Prijs min €</label>
                  <Input id="prijs-min" variant="light" size="compact" type="number" min={0} placeholder="0" value={prijsMin} onChange={(e) => setPrijsMin(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="prijs-max" className="filter-label">Prijs max €</label>
                  <Input id="prijs-max" variant="light" size="compact" type="number" min={0} placeholder="500" value={prijsMax} onChange={(e) => setPrijsMax(e.target.value)} />
                </div>
              </div>

              <p className="zoek-filter-bar__section-label">Leeftijd</p>
              <div className="zoek-filter-bar__extended-grid zoek-filter-bar__extended-grid--2">
                <div>
                  <label htmlFor="leeftijd-van" className="filter-label">Vanaf</label>
                  <Input id="leeftijd-van" variant="light" size="compact" type="number" min={18} placeholder="18" value={leeftijdVan} onChange={(e) => setLeeftijdVan(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="leeftijd-tot" className="filter-label">Tot</label>
                  <Input id="leeftijd-tot" variant="light" size="compact" placeholder="65+" value={leeftijdTot} onChange={(e) => setLeeftijdTot(e.target.value)} />
                </div>
              </div>

              <p className="zoek-filter-bar__section-label">Uiterlijk</p>
              <div className="zoek-filter-bar__extended-grid">
                <div>
                  <label htmlFor="lengte-van" className="filter-label">Lengte min cm</label>
                  <Input id="lengte-van" variant="light" size="compact" type="number" placeholder="150" value={lengteVan} onChange={(e) => setLengteVan(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="lengte-tot" className="filter-label">Lengte max cm</label>
                  <Input id="lengte-tot" variant="light" size="compact" type="number" placeholder="190" value={lengteTot} onChange={(e) => setLengteTot(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="haarkleur" className="filter-label">Haarkleur</label>
                  <select id="haarkleur" className="filter-select filter-select--compact" value={haarkleur} onChange={(e) => setHaarkleur(e.target.value)}>
                    {HAARKLEUR_OPTIES.map((o) => (
                      <option key={o.value || "all"} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="oogkleur" className="filter-label">Oogkleur</label>
                  <select id="oogkleur" className="filter-select filter-select--compact" value={oogkleur} onChange={(e) => setOogkleur(e.target.value)}>
                    {OOGKLEUR_OPTIES.map((o) => (
                      <option key={o.value || "all"} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="zoek-filter-bar__section-label">Taal</p>
              <div className="zoek-filter-bar__extended-grid zoek-filter-bar__extended-grid--1">
                <div>
                  <select id="taal" className="filter-select filter-select--compact" value={taal} onChange={(e) => setTaal(e.target.value)}>
                    {TAAL_OPTIES.map((o) => (
                      <option key={o.value || "all"} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="zoek-filter-bar__section-label">Mogelijkheden</p>
              <div className="zoek-filter-bar__toggles">
                <ToggleSwitch id="geverifieerd" label="Geverifieerd" checked={geverifieerd} onChange={setGeverifieerd} />
                <ToggleSwitch id="video-mogelijk" label="Video mogelijk" checked={videoMogelijk} onChange={setVideoMogelijk} />
                <ToggleSwitch id="hotel-mogelijk" label="Hotel mogelijk" checked={hotelMogelijk} onChange={setHotelMogelijk} />
                <ToggleSwitch id="thuis-ontvangen" label="Thuis ontvangen" checked={thuisOntvangen} onChange={setThuisOntvangen} />
                <ToggleSwitch id="verplaatsing" label="Verplaatsing mogelijk" checked={verplaatsingMogelijk} onChange={setVerplaatsingMogelijk} />
                <ToggleSwitch id="koppels-welkom" label="Koppels welkom" checked={koppelsWelkom} onChange={setKoppelsWelkom} />
                <ToggleSwitch id="premium-profiel" label="Premium profiel" checked={premiumProfiel} onChange={setPremiumProfiel} />
                <ToggleSwitch id="beschikbaar" label="Nu beschikbaar" checked={beschikbaar} onChange={setBeschikbaar} />
                <ToggleSwitch id="discreet-contact" label="Discreet contact" checked={discreetContact} onChange={setDiscreetContact} />
                <ToggleSwitch id="nieuw-profiel" label="Nieuw profiel" checked={nieuwProfiel} onChange={setNieuwProfiel} />
              </div>
            </div>
            <div className="zoek-filter-drawer__foot">
              <Button
                type="button"
                size="md"
                disabled={isPending}
                className="w-full"
                onClick={() => {
                  navigate(buildFilterParams(getValues()));
                  setExtendedOpen(false);
                }}
              >
                {t("search.showProfiles")}
              </Button>
              {hasFilters && (
                <Button
                  type="button"
                  variant="secondary-light"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    handleClear();
                    setExtendedOpen(false);
                  }}
                >
                  {t("search.clearFiltersBtn")}
                </Button>
              )}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
