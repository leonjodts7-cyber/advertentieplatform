"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/lib/helpers";
import type { Advertentie } from "@/lib/types";

interface BewerkAdvertentieFormProps {
  advertentie: Advertentie;
}

export function BewerkAdvertentieForm({ advertentie }: BewerkAdvertentieFormProps) {
  const router = useRouter();
  const [laden, setLaden] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  const [titel, setTitel] = useState(advertentie.titel);
  const [beschrijving, setBeschrijving] = useState(advertentie.beschrijving);
  const [stad, setStad] = useState(advertentie.stad);
  const [leeftijd, setLeeftijd] = useState(String(advertentie.leeftijd));
  const [prijsVanaf, setPrijsVanaf] = useState(String(advertentie.prijs_vanaf));
  const [telefoon, setTelefoon] = useState(advertentie.telefoon ?? "");
  const [beschikbaar, setBeschikbaar] = useState(advertentie.beschikbaar);
  const [status, setStatus] = useState(advertentie.status);

  async function handleOpslaan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFout(null);

    const leeftijdNummer = parseInt(leeftijd, 10);
    const prijsNummer = parseFloat(prijsVanaf);

    if (isNaN(leeftijdNummer) || leeftijdNummer < 18) {
      setFout("Je moet minimaal 18 jaar zijn.");
      return;
    }

    if (isNaN(prijsNummer) || prijsNummer < 0) {
      setFout("Voer een geldige prijs in.");
      return;
    }

    setLaden(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("advertenties")
      .update({
        titel: titel.trim(),
        beschrijving: beschrijving.trim(),
        stad: stad.trim(),
        leeftijd: leeftijdNummer,
        prijs_vanaf: prijsNummer,
        telefoon: telefoon.trim() || null,
        beschikbaar,
      })
      .eq("id", advertentie.id);

    setLaden(false);

    if (error) {
      setFout(error.message);
      return;
    }

    router.refresh();
  }

  async function handlePublicatieAanvragen() {
    setFout(null);
    setLaden(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("advertenties")
      .update({ status: "in_review" })
      .eq("id", advertentie.id);

    setLaden(false);

    if (error) {
      setFout(error.message);
      return;
    }

    setStatus("in_review");
    router.refresh();
  }

  async function handleVerwijderen() {
    const bevestigd = window.confirm(
      "Weet je zeker dat je deze advertentie wilt verwijderen? Dit kan niet ongedaan worden gemaakt."
    );

    if (!bevestigd) return;

    setFout(null);
    setLaden(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("advertenties")
      .delete()
      .eq("id", advertentie.id);

    if (error) {
      setLaden(false);
      setFout(error.message);
      return;
    }

    router.push("/dashboard/advertenties");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Status:</span>
        <Badge variant={status === "actief" ? "success" : "warning"}>
          {statusLabel(status)}
        </Badge>
      </div>

      <form onSubmit={handleOpslaan} className="space-y-5">
        <div>
          <label htmlFor="titel" className="form-label">
            Titel
          </label>
          <Input
            id="titel"
            required
            value={titel}
            onChange={(e) => setTitel(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="beschrijving" className="form-label">
            Beschrijving
          </label>
          <Textarea
            id="beschrijving"
            required
            value={beschrijving}
            onChange={(e) => setBeschrijving(e.target.value)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="stad" className="form-label">
              Stad
            </label>
            <Input
              id="stad"
              required
              value={stad}
              onChange={(e) => setStad(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="leeftijd" className="form-label">
              Leeftijd (min. 18)
            </label>
            <Input
              id="leeftijd"
              type="number"
              min={18}
              required
              value={leeftijd}
              onChange={(e) => setLeeftijd(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="prijs_vanaf" className="form-label">
              Prijs vanaf (€)
            </label>
            <Input
              id="prijs_vanaf"
              type="number"
              min={0}
              step="1"
              required
              value={prijsVanaf}
              onChange={(e) => setPrijsVanaf(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="telefoon" className="form-label">
              Telefoon (optioneel)
            </label>
            <Input
              id="telefoon"
              type="tel"
              value={telefoon}
              onChange={(e) => setTelefoon(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="beschikbaar"
            type="checkbox"
            checked={beschikbaar}
            onChange={(e) => setBeschikbaar(e.target.checked)}
            className="h-4 w-4 rounded border-border bg-card text-primary focus:ring-2 focus:ring-ring"
          />
          <label htmlFor="beschikbaar" className="text-sm">
            Momenteel beschikbaar
          </label>
        </div>

        {fout && (
          <p className="text-sm text-destructive" role="alert">
            {fout}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button type="submit" disabled={laden}>
            {laden ? "Opslaan..." : "Wijzigingen opslaan"}
          </Button>
          {status !== "in_review" && status !== "actief" && (
            <Button
              type="button"
              variant="secondary"
              disabled={laden}
              onClick={handlePublicatieAanvragen}
            >
              Publicatie aanvragen
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/dashboard/advertenties">Terug</Link>
          </Button>
        </div>
      </form>

      <div className="border-t border-border pt-6">
        <h2 className="text-sm font-medium text-destructive">Gevarenzone</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Verwijder deze advertentie permanent.
        </p>
        <Button
          type="button"
          variant="destructive"
          className="mt-3"
          disabled={laden}
          onClick={handleVerwijderen}
        >
          Advertentie verwijderen
        </Button>
      </div>
    </div>
  );
}
