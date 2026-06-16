"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  BOOST_PRIJZEN,
  berekenBoostEinde,
  boostLabel,
} from "@/lib/advertentie-boost";
import {
  ADRES_TYPE_OPTIES,
  BESCHIKBAARHEID_OPTIES,
  CATEGORIE_OPTIES,
  DEFAULT_WERKTIJDEN,
  MEDIA_LIMIETEN,
  MOGELIJKHEDEN_OPTIES,
  TAAL_OPTIES,
  parseAdvertentieBeschrijving,
  serialiseerBeschrijving,
  type AdvertentieMetadata,
  type AdvertentiePakket,
  type BoostType,
  type WerktijdDag,
} from "@/lib/advertentie-metadata";
import {
  replaceFotoRecords,
  saveFotoRecords,
  uploadAdvertentieMedia,
} from "@/lib/advertentie-media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Advertentie } from "@/lib/types";

const STAPPEN = [
  "Pakket",
  "Basis",
  "Profiel",
  "Mogelijkheden",
  "Media",
  "Beschikbaarheid",
  "Promotie",
  "Publiceren",
] as const;

const INPUT = "onDark" as const;

interface MediaPreview {
  file?: File;
  url: string;
  type: "foto" | "video";
  bestaand?: boolean;
  isHoofd?: boolean;
  positie: number;
}

interface AdvertentieWizardProps {
  aanbiederId: string;
  advertentie?: Advertentie;
  bestaandeFotoUrls?: string[];
}

function toggleItem(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function normaliseerPakket(p?: string): AdvertentiePakket {
  if (p === "premium") return "premium";
  return "gratis";
}

export function AdvertentieWizard({
  aanbiederId,
  advertentie,
  bestaandeFotoUrls = [],
}: AdvertentieWizardProps) {
  const router = useRouter();
  const isEdit = Boolean(advertentie);
  const parsed = advertentie
    ? parseAdvertentieBeschrijving(advertentie.beschrijving)
    : { tekst: "", meta: {} as AdvertentieMetadata };

  const [stap, setStap] = useState(0);
  const [laden, setLaden] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  const [pakket, setPakket] = useState<AdvertentiePakket>(
    normaliseerPakket(parsed.meta.pakket ?? (advertentie?.premium ? "premium" : "gratis"))
  );
  const [titel, setTitel] = useState(advertentie?.titel ?? "");
  const [beschrijving, setBeschrijving] = useState(parsed.tekst);
  const [categorie, setCategorie] = useState(parsed.meta.categorie ?? "");
  const [stad, setStad] = useState(advertentie?.stad ?? "");
  const [regio, setRegio] = useState(parsed.meta.regio ?? "");
  const [leeftijd, setLeeftijd] = useState(String(advertentie?.leeftijd ?? ""));
  const [prijsVanaf, setPrijsVanaf] = useState(String(advertentie?.prijs_vanaf ?? ""));
  const [telefoon, setTelefoon] = useState(advertentie?.telefoon ?? "");
  const [whatsapp, setWhatsapp] = useState(parsed.meta.whatsapp ?? "");
  const [website, setWebsite] = useState(parsed.meta.website ?? "");
  const [telegram, setTelegram] = useState(parsed.meta.telegram ?? "");
  const [adresTypes, setAdresTypes] = useState<string[]>(parsed.meta.adresTypes ?? []);

  const [geslacht, setGeslacht] = useState(parsed.meta.geslacht ?? "");
  const [haarkleur, setHaarkleur] = useState(parsed.meta.haarkleur ?? "");
  const [oogkleur, setOogkleur] = useState(parsed.meta.oogkleur ?? "");
  const [lengteCm, setLengteCm] = useState(String(parsed.meta.lengteCm ?? ""));
  const [gewichtKg, setGewichtKg] = useState(String(parsed.meta.gewichtKg ?? ""));
  const [cupmaat, setCupmaat] = useState(parsed.meta.cupmaat ?? "");
  const [nationaliteit, setNationaliteit] = useState(parsed.meta.nationaliteit ?? "");
  const [talen, setTalen] = useState<string[]>(parsed.meta.talen ?? []);
  const [roker, setRoker] = useState(parsed.meta.roker ?? false);
  const [tattoos, setTattoos] = useState(parsed.meta.tattoos ?? false);
  const [piercings, setPiercings] = useState(parsed.meta.piercings ?? false);

  const [mogelijkheden, setMogelijkheden] = useState<string[]>(parsed.meta.mogelijkheden ?? []);
  const [extraMogelijkheden, setExtraMogelijkheden] = useState<string[]>(
    parsed.meta.extraMogelijkheden ?? []
  );
  const [eigenMogelijkheid, setEigenMogelijkheid] = useState("");

  const initMedia = (): MediaPreview[] => {
    if (parsed.meta.mediaItems?.length) {
      return parsed.meta.mediaItems.map((m, i) => ({
        url: m.url,
        type: m.type,
        bestaand: true,
        isHoofd: m.isHoofd,
        positie: m.positie ?? i,
      }));
    }
    const fotos = bestaandeFotoUrls.map((url, i) => ({
      url,
      type: "foto" as const,
      bestaand: true,
      isHoofd: i === 0,
      positie: i,
    }));
    const videos = (parsed.meta.videoUrls ?? (parsed.meta.videoUrl ? [parsed.meta.videoUrl] : [])).map(
      (url, i) => ({
        url,
        type: "video" as const,
        bestaand: true,
        positie: fotos.length + i,
      })
    );
    return [...fotos, ...videos];
  };

  const [media, setMedia] = useState<MediaPreview[]>(initMedia);
  const [beschikbaarheid, setBeschikbaarheid] = useState<string[]>(parsed.meta.beschikbaarheid ?? []);
  const [werktijden, setWerktijden] = useState<WerktijdDag[]>(
    parsed.meta.werktijden ?? DEFAULT_WERKTIJDEN
  );

  const [boostType, setBoostType] = useState<BoostType>(parsed.meta.boostType ?? "none");
  const [boostDuur, setBoostDuur] = useState<number>(parsed.meta.boostDuurDagen ?? 7);
  const [boostStad, setBoostStad] = useState(parsed.meta.boostStad ?? stad);
  const [boostCategorie, setBoostCategorie] = useState(parsed.meta.boostCategorie ?? categorie);

  const limieten = MEDIA_LIMIETEN[pakket];
  const fotoCount = media.filter((m) => m.type === "foto").length;
  const videoCount = media.filter((m) => m.type === "video").length;

  const boostPrijs = useMemo(() => {
    if (boostType === "none") return 0;
    const tabel = BOOST_PRIJZEN[boostType];
    return tabel[boostDuur as keyof typeof tabel] ?? 0;
  }, [boostType, boostDuur]);

  const validatieFouten = useMemo(() => {
    const fouten: { stap: number; melding: string }[] = [];
    if (!titel.trim()) fouten.push({ stap: 1, melding: "Titel is verplicht" });
    if (!beschrijving.trim()) fouten.push({ stap: 1, melding: "Beschrijving is verplicht" });
    if (!categorie) fouten.push({ stap: 1, melding: "Categorie is verplicht" });
    if (!stad.trim()) fouten.push({ stap: 1, melding: "Stad is verplicht" });
    const leeftijdNum = parseInt(leeftijd, 10);
    if (isNaN(leeftijdNum) || leeftijdNum < 18) {
      fouten.push({ stap: 1, melding: "Leeftijd moet minimaal 18 zijn" });
    }
    return fouten;
  }, [titel, beschrijving, categorie, stad, leeftijd]);

  function bouwMeta(videoUrls: string[], hoofdFotoUrl?: string): AdvertentieMetadata {
    const boostActiefNu = boostType !== "none";
    return {
      pakket,
      categorie: categorie || undefined,
      regio: regio.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      website: website.trim() || undefined,
      telegram: telegram.trim() || undefined,
      adresTypes,
      geslacht: geslacht || undefined,
      haarkleur: haarkleur || undefined,
      oogkleur: oogkleur || undefined,
      lengteCm: lengteCm ? Number(lengteCm) : undefined,
      gewichtKg: gewichtKg ? Number(gewichtKg) : undefined,
      cupmaat: cupmaat || undefined,
      nationaliteit: nationaliteit || undefined,
      talen,
      roker,
      tattoos,
      piercings,
      mogelijkheden,
      extraMogelijkheden,
      beschikbaarheid,
      werktijden,
      videoUrls: videoUrls.length ? videoUrls : undefined,
      videoUrl: videoUrls[0],
      hoofdFotoUrl,
      mediaItems: media.map((m, i) => ({
        url: m.url,
        type: m.type,
        positie: i,
        isHoofd: m.isHoofd,
      })),
      boostType: boostActiefNu ? boostType : "none",
      boostStad: boostType === "stad" ? (boostStad || stad) : undefined,
      boostCategorie: boostType === "categorie" ? (boostCategorie || categorie) : undefined,
      boostStart: boostActiefNu ? new Date().toISOString() : parsed.meta.boostStart,
      boostEindigtOp: boostActiefNu ? berekenBoostEinde(boostDuur) : undefined,
      boostDuurDagen: boostActiefNu ? boostDuur : undefined,
    };
  }

  function handleMediaSelect(e: React.ChangeEvent<HTMLInputElement>, type: "foto" | "video") {
    const files = Array.from(e.target.files ?? []);
    const max = type === "foto" ? limieten.fotos - fotoCount : limieten.videos - videoCount;
    const toAdd = files.slice(0, max).map((file, i) => ({
      file,
      url: URL.createObjectURL(file),
      type,
      positie: media.length + i,
      isHoofd: type === "foto" && fotoCount === 0 && i === 0,
    }));
    setMedia((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  }

  function removeMedia(index: number) {
    setMedia((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (!next.some((m) => m.isHoofd && m.type === "foto")) {
        const firstFoto = next.findIndex((m) => m.type === "foto");
        if (firstFoto >= 0) next[firstFoto] = { ...next[firstFoto], isHoofd: true };
      }
      return next;
    });
  }

  function setHoofdfoto(index: number) {
    setMedia((prev) =>
      prev.map((m, i) => ({
        ...m,
        isHoofd: i === index && m.type === "foto",
      }))
    );
  }

  function voegEigenMogelijkheidToe() {
    const trimmed = eigenMogelijkheid.trim();
    if (!trimmed || extraMogelijkheden.includes(trimmed)) return;
    setExtraMogelijkheden((prev) => [...prev, trimmed]);
    setEigenMogelijkheid("");
  }

  async function uploadMedia(advertentieId: string) {
    const fotoUrls: string[] = [];
    const videoUrls: string[] = [];
    let hoofdFotoUrl: string | undefined;

    for (let i = 0; i < media.length; i++) {
      const item = media[i];
      let url = item.url;

      if (item.file) {
        const result = await uploadAdvertentieMedia(
          createClient(),
          advertentieId,
          item.file,
          i
        );
        if (!result.ok) return { error: result.error, fotoUrls: [] as string[], videoUrls: [] as string[] };
        url = result.url;
      }

      if (item.type === "video") {
        videoUrls.push(url);
      } else {
        fotoUrls.push(url);
        if (item.isHoofd) hoofdFotoUrl = url;
      }
    }

    if (!hoofdFotoUrl && fotoUrls.length) hoofdFotoUrl = fotoUrls[0];
    return { error: null, fotoUrls, videoUrls, hoofdFotoUrl };
  }

  async function saveAdvertentie(status: Advertentie["status"]) {
    setFout(null);
    if (validatieFouten.length > 0) {
      setFout(validatieFouten.map((f) => `Stap ${f.stap + 1}: ${f.melding}`).join(" · "));
      setStap(validatieFouten[0].stap);
      return;
    }

    const leeftijdNummer = parseInt(leeftijd, 10);
    const prijsNummer = parseFloat(prijsVanaf);
    if (isNaN(prijsNummer) || prijsNummer < 0) {
      setFout("Voer een geldige prijs in.");
      setStap(1);
      return;
    }

    setLaden(true);
    const supabase = createClient();
    const boostNu = boostType !== "none";
    const isPremium = pakket === "premium" || boostNu;

    let advertentieId = advertentie?.id;
    const placeholderMeta = bouwMeta([], undefined);
    const beschrijvingVolledig = serialiseerBeschrijving(beschrijving, placeholderMeta);

    const payload: Record<string, unknown> = {
      titel: titel.trim(),
      beschrijving: beschrijvingVolledig,
      stad: stad.trim(),
      leeftijd: leeftijdNummer,
      prijs_vanaf: prijsNummer,
      telefoon: telefoon.trim() || null,
      premium: isPremium,
      status,
    };

    if (isEdit && advertentieId) {
      const { error } = await supabase.from("advertenties").update(payload).eq("id", advertentieId);
      if (error) {
        setFout(error.message);
        setLaden(false);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("advertenties")
        .insert({ ...payload, aanbieder_id: aanbiederId, geverifieerd: false })
        .select("id")
        .single();
      if (error || !data) {
        setFout(error?.message ?? "Opslaan mislukt.");
        setLaden(false);
        return;
      }
      advertentieId = data.id;
    }

    const uploadResult = await uploadMedia(advertentieId!);
    if (uploadResult.error) {
      setFout(uploadResult.error);
      setLaden(false);
      return;
    }

    const finalMeta = bouwMeta(uploadResult.videoUrls, uploadResult.hoofdFotoUrl);
    const updatePayload: Record<string, unknown> = {
      beschrijving: serialiseerBeschrijving(beschrijving, finalMeta),
    };
    if (uploadResult.hoofdFotoUrl) {
      updatePayload.hoofd_foto_url = uploadResult.hoofdFotoUrl;
    }

    await supabase.from("advertenties").update(updatePayload).eq("id", advertentieId);

    const fotoSave = isEdit
      ? await replaceFotoRecords(supabase, advertentieId!, uploadResult.fotoUrls)
      : await saveFotoRecords(supabase, advertentieId!, uploadResult.fotoUrls);

    if (fotoSave.error) {
      setFout(fotoSave.error.message);
      setLaden(false);
      return;
    }

    setLaden(false);
    router.push("/dashboard/advertenties");
    router.refresh();
  }

  const boostOpties: Record<BoostType, number[]> = {
    none: [],
    stad: [1, 3, 7, 14, 30],
    categorie: [1, 7, 30],
    homepage: [1, 7, 30],
  };

  return (
    <div className="wizard">
      <div className="wizard__steps">
        {STAPPEN.map((label, i) => (
          <button
            key={label}
            type="button"
            className={cn(
              "wizard__step",
              i === stap && "wizard__step--active",
              i < stap && "wizard__step--done"
            )}
            onClick={() => setStap(i)}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {fout && (
        <p className="login-alert login-alert--error mt-4" role="alert">
          {fout}
        </p>
      )}

      {stap === 0 && (
        <div className="wizard__panel">
          <h2 className="wizard__title">Kies je pakket</h2>
          <div className="wizard-pakket-grid">
            <button
              type="button"
              className={cn("wizard-pakket-card", pakket === "gratis" && "wizard-pakket-card--active")}
              onClick={() => setPakket("gratis")}
            >
              <p className="wizard-pakket-card__name">Gratis</p>
              <p className="wizard-pakket-card__price">€0</p>
              <ul className="wizard-pakket-card__list">
                <li>20 foto&apos;s</li>
                <li>1 video</li>
                <li>Normale positie</li>
                <li>Basisstatistieken</li>
              </ul>
            </button>
            <button
              type="button"
              className={cn(
                "wizard-pakket-card wizard-pakket-card--premium",
                pakket === "premium" && "wizard-pakket-card--active"
              )}
              onClick={() => setPakket("premium")}
            >
              <p className="wizard-pakket-card__name">Premium</p>
              <p className="wizard-pakket-card__price">Hogere zichtbaarheid</p>
              <ul className="wizard-pakket-card__list">
                <li>100 foto&apos;s + 5 video&apos;s</li>
                <li>Premium badge</li>
                <li>Hoger in zoekresultaten</li>
                <li>Beschikbaar voor boosts</li>
              </ul>
            </button>
          </div>
          <p className="wizard__note mt-3">
            Betaling wordt later gekoppeld. Je keuze wordt nu opgeslagen.
          </p>
        </div>
      )}

      {stap === 1 && (
        <div className="wizard__panel space-y-4">
          <h2 className="wizard__title">Basisgegevens</h2>
          <div>
            <label className="form-label">Titel</label>
            <Input variant={INPUT} value={titel} onChange={(e) => setTitel(e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Beschrijving</label>
            <Textarea variant="onDark" value={beschrijving} onChange={(e) => setBeschrijving(e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Categorie</label>
            <select className="filter-select filter-select--on-dark w-full" value={categorie} onChange={(e) => setCategorie(e.target.value)}>
              <option value="">Kies categorie</option>
              {CATEGORIE_OPTIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Stad</label>
              <Input variant={INPUT} value={stad} onChange={(e) => setStad(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">Regio</label>
              <Input variant={INPUT} value={regio} onChange={(e) => setRegio(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Leeftijd (min. 18)</label>
              <Input variant={INPUT} type="number" min={18} value={leeftijd} onChange={(e) => setLeeftijd(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Prijs vanaf (€)</label>
              <Input variant={INPUT} type="number" min={0} value={prijsVanaf} onChange={(e) => setPrijsVanaf(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Telefoon</label>
              <Input variant={INPUT} value={telefoon} onChange={(e) => setTelefoon(e.target.value)} />
            </div>
            <div>
              <label className="form-label">WhatsApp</label>
              <Input variant={INPUT} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Optioneel" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Website</label>
              <Input variant={INPUT} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Optioneel" />
            </div>
            <div>
              <label className="form-label">Telegram</label>
              <Input variant={INPUT} value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="Optioneel" />
            </div>
          </div>
          <div>
            <p className="form-label">Adres type</p>
            <div className="wizard-check-grid">
              {ADRES_TYPE_OPTIES.map((opt) => (
                <label key={opt.value} className="wizard-check">
                  <input type="checkbox" checked={adresTypes.includes(opt.value)} onChange={() => setAdresTypes(toggleItem(adresTypes, opt.value))} />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {stap === 2 && (
        <div className="wizard__panel space-y-4">
          <h2 className="wizard__title">Profielgegevens</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Geslacht</label>
              <Input variant={INPUT} value={geslacht} onChange={(e) => setGeslacht(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Lengte (cm)</label>
              <Input variant={INPUT} type="number" value={lengteCm} onChange={(e) => setLengteCm(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Gewicht (kg)</label>
              <Input variant={INPUT} type="number" value={gewichtKg} onChange={(e) => setGewichtKg(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Haarkleur</label>
              <Input variant={INPUT} value={haarkleur} onChange={(e) => setHaarkleur(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Oogkleur</label>
              <Input variant={INPUT} value={oogkleur} onChange={(e) => setOogkleur(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Nationaliteit</label>
              <Input variant={INPUT} value={nationaliteit} onChange={(e) => setNationaliteit(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Cupmaat</label>
              <Input variant={INPUT} value={cupmaat} onChange={(e) => setCupmaat(e.target.value)} />
            </div>
          </div>
          <div>
            <p className="form-label">Talen</p>
            <div className="wizard-check-grid">
              {TAAL_OPTIES.map((taal) => (
                <label key={taal} className="wizard-check">
                  <input type="checkbox" checked={talen.includes(taal)} onChange={() => setTalen(toggleItem(talen, taal))} />
                  {taal}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="form-label">Kenmerken</p>
            <div className="wizard-check-grid">
              <label className="wizard-check"><input type="checkbox" checked={roker} onChange={(e) => setRoker(e.target.checked)} /> Roker</label>
              <label className="wizard-check"><input type="checkbox" checked={tattoos} onChange={(e) => setTattoos(e.target.checked)} /> Tattoos</label>
              <label className="wizard-check"><input type="checkbox" checked={piercings} onChange={(e) => setPiercings(e.target.checked)} /> Piercings</label>
            </div>
          </div>
        </div>
      )}

      {stap === 3 && (
        <div className="wizard__panel space-y-4">
          <h2 className="wizard__title">Mogelijkheden</h2>
          <div className="wizard-check-grid">
            {MOGELIJKHEDEN_OPTIES.map((opt) => (
              <label key={opt.value} className="wizard-check">
                <input type="checkbox" checked={mogelijkheden.includes(opt.value)} onChange={() => setMogelijkheden(toggleItem(mogelijkheden, opt.value))} />
                {opt.label}
              </label>
            ))}
          </div>
          <div>
            <p className="form-label">+ Eigen mogelijkheid toevoegen</p>
            <div className="flex flex-wrap gap-2">
              <Input variant={INPUT} value={eigenMogelijkheid} onChange={(e) => setEigenMogelijkheid(e.target.value)} placeholder="Eigen optie" className="max-w-xs" />
              <Button type="button" variant="secondary" size="sm" onClick={voegEigenMogelijkheidToe}>Toevoegen</Button>
            </div>
            {extraMogelijkheden.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {extraMogelijkheden.map((opt) => (
                  <span key={opt} className="wizard-chip">
                    {opt}
                    <button type="button" onClick={() => setExtraMogelijkheden(extraMogelijkheden.filter((o) => o !== opt))} aria-label={`Verwijder ${opt}`}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {stap === 4 && (
        <div className="wizard__panel space-y-4">
          <h2 className="wizard__title">Media</h2>
          <p className="text-sm text-muted-foreground">
            Max {limieten.fotos} foto&apos;s en {limieten.videos} video&apos;s ({pakket === "premium" ? "Premium" : "Gratis"})
          </p>
          <div className="flex flex-wrap gap-3">
            <label className="wizard-upload-btn">
              Foto&apos;s toevoegen
              <input type="file" accept="image/*" multiple hidden onChange={(e) => handleMediaSelect(e, "foto")} disabled={fotoCount >= limieten.fotos} />
            </label>
            {limieten.videos > 0 && (
              <label className="wizard-upload-btn">
                Video toevoegen
                <input type="file" accept="video/*" hidden onChange={(e) => handleMediaSelect(e, "video")} disabled={videoCount >= limieten.videos} />
              </label>
            )}
          </div>
          <div className="wizard-media-grid">
            {media.map((item, i) => (
              <div key={item.url + i} className={cn("wizard-media-item", item.isHoofd && "wizard-media-item--hoofd")}>
                {item.type === "video" ? (
                  <video src={item.url} className="h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt="" className="h-full w-full object-cover" />
                )}
                <div className="wizard-media-item__actions">
                  {item.type === "foto" && !item.isHoofd && (
                    <button type="button" onClick={() => setHoofdfoto(i)}>Hoofdfoto</button>
                  )}
                  {item.isHoofd && <span className="wizard-media-item__badge">Hoofd</span>}
                  <button type="button" className="wizard-media-item__remove" onClick={() => removeMedia(i)}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stap === 5 && (
        <div className="wizard__panel space-y-4">
          <h2 className="wizard__title">Beschikbaarheid</h2>
          <div className="wizard-check-grid">
            {BESCHIKBAARHEID_OPTIES.map((opt) => (
              <label key={opt.value} className="wizard-check">
                <input type="checkbox" checked={beschikbaarheid.includes(opt.value)} onChange={() => setBeschikbaarheid(toggleItem(beschikbaarheid, opt.value))} />
                {opt.label}
              </label>
            ))}
          </div>
          <h3 className="text-sm font-medium text-[var(--text-light)]">Werktijden per dag</h3>
          {werktijden.map((dag, i) => (
            <div key={dag.dag} className="wizard-werktijd-row">
              <label className="wizard-check shrink-0 capitalize">
                <input
                  type="checkbox"
                  checked={dag.actief}
                  onChange={(e) => {
                    const next = [...werktijden];
                    next[i] = { ...dag, actief: e.target.checked };
                    setWerktijden(next);
                  }}
                />
                {dag.dag}
              </label>
              <Input variant={INPUT} size="compact" type="time" value={dag.van} disabled={!dag.actief} onChange={(e) => { const next = [...werktijden]; next[i] = { ...dag, van: e.target.value }; setWerktijden(next); }} />
              <Input variant={INPUT} size="compact" type="time" value={dag.tot} disabled={!dag.actief} onChange={(e) => { const next = [...werktijden]; next[i] = { ...dag, tot: e.target.value }; setWerktijden(next); }} />
            </div>
          ))}
        </div>
      )}

      {stap === 6 && (
        <div className="wizard__panel space-y-4">
          <h2 className="wizard__title">Extra zichtbaarheid kiezen</h2>
          <div className="wizard-boost-grid">
            {(["none", "stad", "categorie", "homepage"] as BoostType[]).map((type) => (
              <button
                key={type}
                type="button"
                className={cn("wizard-boost-card", boostType === type && "wizard-boost-card--active")}
                onClick={() => {
                  setBoostType(type);
                  if (type !== "none") {
                    const opties = boostOpties[type];
                    if (!opties.includes(boostDuur)) setBoostDuur(opties[0]);
                  }
                }}
              >
                <p className="wizard-boost-card__name">
                  {type === "none" && "Geen boost"}
                  {type === "stad" && "Stad Boost"}
                  {type === "categorie" && "Categorie Boost"}
                  {type === "homepage" && "Homepage Spotlight"}
                </p>
                <p className="wizard-boost-card__desc">
                  {type === "none" && "Gratis · normale positie"}
                  {type === "stad" && "Bovenaan in gekozen stad"}
                  {type === "categorie" && "Bovenaan in gekozen categorie"}
                  {type === "homepage" && "Zichtbaar bovenaan homepage"}
                </p>
              </button>
            ))}
          </div>
          {boostType !== "none" && (
            <>
              <div className="flex flex-wrap gap-2">
                {boostOpties[boostType].map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={cn("wizard-duration-chip", boostDuur === d && "wizard-duration-chip--active")}
                    onClick={() => setBoostDuur(d)}
                  >
                    {d} dag{d > 1 ? "en" : ""}
                  </button>
                ))}
              </div>
              {boostType === "stad" && (
                <div>
                  <label className="form-label">Boost stad</label>
                  <Input variant={INPUT} value={boostStad} onChange={(e) => setBoostStad(e.target.value)} placeholder={stad || "Stad"} />
                </div>
              )}
              {boostType === "categorie" && (
                <div>
                  <label className="form-label">Boost categorie</label>
                  <select className="filter-select filter-select--on-dark w-full" value={boostCategorie} onChange={(e) => setBoostCategorie(e.target.value)}>
                    <option value="">Kies categorie</option>
                    {CATEGORIE_OPTIES.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.label}</option>
                    ))}
                  </select>
                </div>
              )}
              <p className="wizard__note">
                Prijsindicatie: €{boostPrijs.toFixed(2).replace(".", ",")} · Betaling wordt later gekoppeld.
              </p>
            </>
          )}
        </div>
      )}

      {stap === 7 && (
        <div className="wizard__panel space-y-4">
          <h2 className="wizard__title">Samenvatting</h2>
          {validatieFouten.length > 0 && (
            <div className="login-alert login-alert--error">
              <p className="font-medium">Ontbrekende velden:</p>
              <ul className="mt-1 list-disc pl-4 text-sm">
                {validatieFouten.map((f) => (
                  <li key={f.melding}>Stap {f.stap + 1}: {f.melding}</li>
                ))}
              </ul>
            </div>
          )}
          <dl className="wizard-summary">
            <div><dt>Pakket</dt><dd>{pakket === "premium" ? "Premium" : "Gratis"}</dd></div>
            <div><dt>Titel</dt><dd>{titel || "—"}</dd></div>
            <div><dt>Stad</dt><dd>{stad || "—"}</dd></div>
            <div><dt>Categorie</dt><dd>{CATEGORIE_OPTIES.find((c) => c.slug === categorie)?.label ?? "—"}</dd></div>
            <div><dt>Prijs vanaf</dt><dd>{prijsVanaf ? `€${prijsVanaf}` : "—"}</dd></div>
            <div><dt>Media</dt><dd>{fotoCount} foto&apos;s, {videoCount} video&apos;s</dd></div>
            <div><dt>Boost</dt><dd>{boostType === "none" ? "Geen" : `${boostLabel(bouwMeta([], undefined)) ?? boostType} (${boostDuur} dagen)`}</dd></div>
            <div><dt>Status</dt><dd>Concept of actief (kies hieronder)</dd></div>
          </dl>
          <p className="wizard__note text-xs">
            Na publicatie kan je profiel kort gecontroleerd worden.
          </p>
        </div>
      )}

      <div className="wizard__nav mt-6 flex flex-wrap gap-2">
        {stap > 0 && (
          <Button type="button" variant="secondary" onClick={() => setStap(stap - 1)}>
            Vorige
          </Button>
        )}
        {stap < STAPPEN.length - 1 ? (
          <Button type="button" onClick={() => setStap(stap + 1)}>
            Volgende
          </Button>
        ) : (
          <>
            <Button type="button" variant="secondary" disabled={laden} onClick={() => saveAdvertentie("concept")}>
              {laden ? "Bezig…" : "Opslaan als concept"}
            </Button>
            <Button type="button" disabled={laden} onClick={() => saveAdvertentie("actief")}>
              {laden ? "Bezig…" : "Nu publiceren"}
            </Button>
          </>
        )}
        <Button asChild variant="ghost">
          <Link href="/dashboard/advertenties">Annuleren</Link>
        </Button>
      </div>
    </div>
  );
}
