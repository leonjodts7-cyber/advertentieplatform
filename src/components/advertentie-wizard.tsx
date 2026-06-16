"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ADRES_TYPE_OPTIES,
  DEFAULT_WERKTIJDEN,
  MOGELIJKHEDEN_OPTIES,
  parseAdvertentieBeschrijving,
  serialiseerBeschrijving,
  type AdvertentieMetadata,
  type AdvertentiePakket,
  type WerktijdDag,
} from "@/lib/advertentie-metadata";
import {
  replaceFotoRecords,
  saveFotoRecords,
  uploadAdvertentieMedia,
} from "@/lib/advertentie-media";
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";
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
  "Werktijden",
  "Publiceren",
] as const;

const TAAL_OPTIES = ["Nederlands", "Frans", "Engels", "Duits", "Spaans"];

interface MediaPreview {
  file?: File;
  url: string;
  isVideo?: boolean;
  bestaand?: boolean;
}

interface AdvertentieWizardProps {
  aanbiederId: string;
  advertentie?: Advertentie;
  bestaandeFotoUrls?: string[];
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
    parsed.meta.pakket ?? (advertentie?.premium ? "premium" : "basis")
  );
  const [titel, setTitel] = useState(advertentie?.titel ?? "");
  const [beschrijving, setBeschrijving] = useState(parsed.tekst);
  const [categorie, setCategorie] = useState(parsed.meta.categorie ?? "");
  const [stad, setStad] = useState(advertentie?.stad ?? "");
  const [leeftijd, setLeeftijd] = useState(String(advertentie?.leeftijd ?? ""));
  const [prijsVanaf, setPrijsVanaf] = useState(String(advertentie?.prijs_vanaf ?? ""));
  const [telefoon, setTelefoon] = useState(advertentie?.telefoon ?? "");
  const [whatsapp, setWhatsapp] = useState(parsed.meta.whatsapp ?? "");
  const [adresTypes, setAdresTypes] = useState<string[]>(parsed.meta.adresTypes ?? []);

  const [geslacht, setGeslacht] = useState(parsed.meta.geslacht ?? "");
  const [haarkleur, setHaarkleur] = useState(parsed.meta.haarkleur ?? "");
  const [oogkleur, setOogkleur] = useState(parsed.meta.oogkleur ?? "");
  const [lengteCm, setLengteCm] = useState(String(parsed.meta.lengteCm ?? ""));
  const [cupmaat, setCupmaat] = useState(parsed.meta.cupmaat ?? "");
  const [nationaliteit, setNationaliteit] = useState(parsed.meta.nationaliteit ?? "");
  const [talen, setTalen] = useState<string[]>(parsed.meta.talen ?? []);
  const [roker, setRoker] = useState(parsed.meta.roker ?? false);
  const [tattoos, setTattoos] = useState(parsed.meta.tattoos ?? false);
  const [piercings, setPiercings] = useState(parsed.meta.piercings ?? false);

  const [mogelijkheden, setMogelijkheden] = useState<string[]>(
    parsed.meta.mogelijkheden ?? []
  );
  const [werktijden, setWerktijden] = useState<WerktijdDag[]>(
    parsed.meta.werktijden ?? DEFAULT_WERKTIJDEN
  );

  const [media, setMedia] = useState<MediaPreview[]>(
    bestaandeFotoUrls.map((url) => ({ url, bestaand: true }))
  );
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState(parsed.meta.videoUrl ?? "");

  const maxFotos = pakket === "premium" ? 10 : 3;
  const maxVideo = pakket === "premium" ? 1 : 0;
  const fotoCount = media.filter((m) => !m.isVideo).length;

  const meta: AdvertentieMetadata = useMemo(
    () => ({
      pakket,
      categorie,
      whatsapp: whatsapp.trim() || undefined,
      adresTypes,
      geslacht: geslacht || undefined,
      haarkleur: haarkleur || undefined,
      oogkleur: oogkleur || undefined,
      lengteCm: lengteCm ? Number(lengteCm) : undefined,
      cupmaat: cupmaat || undefined,
      nationaliteit: nationaliteit || undefined,
      talen,
      roker,
      tattoos,
      piercings,
      mogelijkheden,
      werktijden,
      videoUrl: videoUrl || undefined,
    }),
    [
      pakket, categorie, whatsapp, adresTypes, geslacht, haarkleur, oogkleur,
      lengteCm, cupmaat, nationaliteit, talen, roker, tattoos, piercings,
      mogelijkheden, werktijden, videoUrl,
    ]
  );

  function toggleArrayItem(list: string[], value: string) {
    return list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
  }

  function handleFotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const remaining = maxFotos - fotoCount;
    const toAdd = files.slice(0, remaining).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isVideo: false,
    }));
    setMedia((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  }

  function removeMedia(index: number) {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadMedia(advertentieId: string) {
    const fotoUrls: string[] = [];
    let newVideoUrl = videoUrl;

    for (let i = 0; i < media.length; i++) {
      const item = media[i];
      if (item.bestaand && !item.file) {
        fotoUrls.push(item.url);
        continue;
      }
      if (!item.file) continue;
      const result = await uploadAdvertentieMedia(
        createClient(),
        advertentieId,
        item.file,
        i
      );
      if (!result.ok) return { error: result.error, fotoUrls: [] as string[] };
      fotoUrls.push(result.url);
    }

    if (videoFile && maxVideo > 0) {
      const result = await uploadAdvertentieMedia(
        createClient(),
        advertentieId,
        videoFile,
        99
      );
      if (!result.ok) return { error: result.error, fotoUrls };
      newVideoUrl = result.url;
    }

    return { error: null, fotoUrls, newVideoUrl };
  }

  async function saveAdvertentie(status: Advertentie["status"]) {
    setFout(null);
    const leeftijdNummer = parseInt(leeftijd, 10);
    const prijsNummer = parseFloat(prijsVanaf);

    if (!titel.trim() || !beschrijving.trim() || !stad.trim()) {
      setFout("Vul titel, beschrijving en stad in.");
      return;
    }
    if (isNaN(leeftijdNummer) || leeftijdNummer < 18) {
      setFout("Leeftijd moet minimaal 18 zijn.");
      return;
    }
    if (isNaN(prijsNummer) || prijsNummer < 0) {
      setFout("Voer een geldige prijs in.");
      return;
    }

    setLaden(true);
    const supabase = createClient();
    const finalMeta = { ...meta, videoUrl: videoUrl || undefined };
    const beschrijvingVolledig = serialiseerBeschrijving(beschrijving, finalMeta);

    const payload = {
      titel: titel.trim(),
      beschrijving: beschrijvingVolledig,
      stad: stad.trim(),
      leeftijd: leeftijdNummer,
      prijs_vanaf: prijsNummer,
      telefoon: telefoon.trim() || null,
      premium: pakket === "premium",
      status,
    };

    let advertentieId = advertentie?.id;

    if (isEdit && advertentieId) {
      const { error } = await supabase
        .from("advertenties")
        .update(payload)
        .eq("id", advertentieId);
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

    if (uploadResult.newVideoUrl) {
      finalMeta.videoUrl = uploadResult.newVideoUrl;
      await supabase
        .from("advertenties")
        .update({
          beschrijving: serialiseerBeschrijving(beschrijving, {
            ...finalMeta,
            videoUrl: uploadResult.newVideoUrl,
          }),
        })
        .eq("id", advertentieId);
    }

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

  return (
    <div className="wizard">
      <div className="wizard__steps">
        {STAPPEN.map((label, i) => (
          <button
            key={label}
            type="button"
            className={cn("wizard__step", i === stap && "wizard__step--active", i < stap && "wizard__step--done")}
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
              className={cn("wizard-pakket-card", pakket === "basis" && "wizard-pakket-card--active")}
              onClick={() => setPakket("basis")}
            >
              <p className="wizard-pakket-card__name">Basis</p>
              <p className="wizard-pakket-card__price">Gratis / standaard</p>
              <ul className="wizard-pakket-card__list">
                <li>3 foto&apos;s</li>
                <li>Geen video</li>
                <li>Normale positie</li>
              </ul>
            </button>
            <button
              type="button"
              className={cn("wizard-pakket-card wizard-pakket-card--premium", pakket === "premium" && "wizard-pakket-card--active")}
              onClick={() => setPakket("premium")}
            >
              <p className="wizard-pakket-card__name">Premium</p>
              <p className="wizard-pakket-card__price">Hogere zichtbaarheid</p>
              <ul className="wizard-pakket-card__list">
                <li>10 foto&apos;s + 1 video</li>
                <li>Premium badge</li>
                <li>Premium advertenties sectie</li>
              </ul>
            </button>
          </div>
          {pakket === "premium" && (
            <p className="wizard__note mt-3">
              Betaling wordt later gekoppeld. Premium wordt nu alvast ingesteld.
            </p>
          )}
        </div>
      )}

      {stap === 1 && (
        <div className="wizard__panel space-y-4">
          <h2 className="wizard__title">Basisgegevens</h2>
          <div>
            <label className="form-label">Titel</label>
            <Input variant="dark" value={titel} onChange={(e) => setTitel(e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Beschrijving</label>
            <Textarea variant="dark" value={beschrijving} onChange={(e) => setBeschrijving(e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Categorie</label>
            <select className="filter-select filter-select--compact w-full" value={categorie} onChange={(e) => setCategorie(e.target.value)}>
              <option value="">Kies categorie</option>
              {MARKETPLACE_CATEGORIEEN.map((c) => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Stad</label>
              <Input variant="dark" value={stad} onChange={(e) => setStad(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">Leeftijd (min. 18)</label>
              <Input variant="dark" type="number" min={18} value={leeftijd} onChange={(e) => setLeeftijd(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label">Prijs vanaf (€)</label>
              <Input variant="dark" type="number" min={0} value={prijsVanaf} onChange={(e) => setPrijsVanaf(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Telefoon</label>
              <Input variant="dark" value={telefoon} onChange={(e) => setTelefoon(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="form-label">WhatsApp</label>
            <Input variant="dark" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Optioneel" />
          </div>
          <div>
            <p className="form-label">Adres type</p>
            <div className="wizard-check-grid">
              {ADRES_TYPE_OPTIES.map((opt) => (
                <label key={opt.value} className="wizard-check">
                  <input type="checkbox" checked={adresTypes.includes(opt.value)} onChange={() => setAdresTypes(toggleArrayItem(adresTypes, opt.value))} />
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
              <Input variant="dark" value={geslacht} onChange={(e) => setGeslacht(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Haarkleur</label>
              <Input variant="dark" value={haarkleur} onChange={(e) => setHaarkleur(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Oogkleur</label>
              <Input variant="dark" value={oogkleur} onChange={(e) => setOogkleur(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Lengte (cm)</label>
              <Input variant="dark" type="number" value={lengteCm} onChange={(e) => setLengteCm(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Cupmaat</label>
              <Input variant="dark" value={cupmaat} onChange={(e) => setCupmaat(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Nationaliteit</label>
              <Input variant="dark" value={nationaliteit} onChange={(e) => setNationaliteit(e.target.value)} />
            </div>
          </div>
          <div>
            <p className="form-label">Talen</p>
            <div className="wizard-check-grid">
              {TAAL_OPTIES.map((taal) => (
                <label key={taal} className="wizard-check">
                  <input type="checkbox" checked={talen.includes(taal)} onChange={() => setTalen(toggleArrayItem(talen, taal))} />
                  {taal}
                </label>
              ))}
            </div>
          </div>
          <div className="wizard-check-grid">
            <label className="wizard-check"><input type="checkbox" checked={roker} onChange={(e) => setRoker(e.target.checked)} /> Roker</label>
            <label className="wizard-check"><input type="checkbox" checked={tattoos} onChange={(e) => setTattoos(e.target.checked)} /> Tattoos</label>
            <label className="wizard-check"><input type="checkbox" checked={piercings} onChange={(e) => setPiercings(e.target.checked)} /> Piercings</label>
          </div>
        </div>
      )}

      {stap === 3 && (
        <div className="wizard__panel">
          <h2 className="wizard__title">Mogelijkheden</h2>
          <div className="wizard-check-grid mt-3">
            {MOGELIJKHEDEN_OPTIES.map((opt) => (
              <label key={opt.value} className="wizard-check">
                <input type="checkbox" checked={mogelijkheden.includes(opt.value)} onChange={() => setMogelijkheden(toggleArrayItem(mogelijkheden, opt.value))} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {stap === 4 && (
        <div className="wizard__panel space-y-4">
          <h2 className="wizard__title">Media</h2>
          <p className="text-sm text-muted-foreground">
            {pakket === "premium" ? "Max 10 foto's + 1 video" : "Max 3 foto's"}
          </p>
          <input type="file" accept="image/*" multiple onChange={handleFotoSelect} disabled={fotoCount >= maxFotos} />
          {maxVideo > 0 && (
            <div>
              <label className="form-label">Video (max 1)</label>
              <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)} />
            </div>
          )}
          <div className="wizard-media-grid">
            {media.map((item, i) => (
              <div key={item.url + i} className="wizard-media-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt="" className="h-full w-full object-cover" />
                <button type="button" className="wizard-media-item__remove" onClick={() => removeMedia(i)}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {stap === 5 && (
        <div className="wizard__panel space-y-3">
          <h2 className="wizard__title">Werktijden</h2>
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
              <Input variant="dark" size="compact" type="time" value={dag.van} disabled={!dag.actief} onChange={(e) => { const next = [...werktijden]; next[i] = { ...dag, van: e.target.value }; setWerktijden(next); }} />
              <Input variant="dark" size="compact" type="time" value={dag.tot} disabled={!dag.actief} onChange={(e) => { const next = [...werktijden]; next[i] = { ...dag, tot: e.target.value }; setWerktijden(next); }} />
            </div>
          ))}
        </div>
      )}

      {stap === 6 && (
        <div className="wizard__panel space-y-4">
          <h2 className="wizard__title">Samenvatting</h2>
          <dl className="wizard-summary">
            <div><dt>Pakket</dt><dd>{pakket === "premium" ? "Premium" : "Basis"}</dd></div>
            <div><dt>Titel</dt><dd>{titel || "—"}</dd></div>
            <div><dt>Stad</dt><dd>{stad || "—"}</dd></div>
            <div><dt>Prijs vanaf</dt><dd>{prijsVanaf ? `€${prijsVanaf}` : "—"}</dd></div>
            <div><dt>Media</dt><dd>{fotoCount} foto&apos;s{videoFile || videoUrl ? " + video" : ""}</dd></div>
          </dl>
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
            <Button type="button" disabled={laden} onClick={() => saveAdvertentie("in_review")}>
              {laden ? "Bezig…" : "Publicatie aanvragen"}
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
