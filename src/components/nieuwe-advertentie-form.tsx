"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface NieuweAdvertentieFormProps {
  aanbiederId: string;
}

export function NieuweAdvertentieForm({ aanbiederId }: NieuweAdvertentieFormProps) {
  const router = useRouter();
  const [laden, setLaden] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  const [titel, setTitel] = useState("");
  const [beschrijving, setBeschrijving] = useState("");
  const [stad, setStad] = useState("");
  const [leeftijd, setLeeftijd] = useState("");
  const [prijsVanaf, setPrijsVanaf] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [beschikbaar, setBeschikbaar] = useState(true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFout(null);

    const leeftijdNummer = parseInt(leeftijd, 10);
    const prijsNummer = parseFloat(prijsVanaf);

    if (isNaN(leeftijdNummer) || leeftijdNummer < 18) {
      setFout("Je moet minimaal 18 jaar zijn om een advertentie te plaatsen.");
      return;
    }

    if (isNaN(prijsNummer) || prijsNummer < 0) {
      setFout("Voer een geldige prijs in.");
      return;
    }

    setLaden(true);
    const supabase = createClient();

    const { error } = await supabase.from("advertenties").insert({
      aanbieder_id: aanbiederId,
      titel: titel.trim(),
      beschrijving: beschrijving.trim(),
      stad: stad.trim(),
      leeftijd: leeftijdNummer,
      prijs_vanaf: prijsNummer,
      telefoon: telefoon.trim() || null,
      beschikbaar,
      status: "concept",
      geverifieerd: false,
    });

    setLaden(false);

    if (error) {
      setFout(error.message);
      return;
    }

    router.push("/dashboard/advertenties");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="titel" className="mb-2 block text-sm font-medium">
          Titel
        </label>
        <Input
          id="titel"
          required
          value={titel}
          onChange={(e) => setTitel(e.target.value)}
          placeholder="Korte, professionele titel"
        />
      </div>

      <div>
        <label htmlFor="beschrijving" className="mb-2 block text-sm font-medium">
          Beschrijving
        </label>
        <Textarea
          id="beschrijving"
          required
          value={beschrijving}
          onChange={(e) => setBeschrijving(e.target.value)}
          placeholder="Beschrijf jouw diensten professioneel en respectvol"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="stad" className="mb-2 block text-sm font-medium">
            Stad
          </label>
          <Input
            id="stad"
            required
            value={stad}
            onChange={(e) => setStad(e.target.value)}
            placeholder="Bijv. Rotterdam"
          />
        </div>
        <div>
          <label htmlFor="leeftijd" className="mb-2 block text-sm font-medium">
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
          <label htmlFor="prijs_vanaf" className="mb-2 block text-sm font-medium">
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
          <label htmlFor="telefoon" className="mb-2 block text-sm font-medium">
            Telefoon (optioneel)
          </label>
          <Input
            id="telefoon"
            type="tel"
            value={telefoon}
            onChange={(e) => setTelefoon(e.target.value)}
            placeholder="06..."
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
        <label htmlFor="beschikbaar" className="text-sm text-foreground">
          Momenteel beschikbaar
        </label>
      </div>

      {fout && (
        <p className="text-sm text-destructive" role="alert">
          {fout}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" disabled={laden}>
          {laden ? "Opslaan..." : "Advertentie opslaan"}
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/advertenties">Annuleren</Link>
        </Button>
      </div>
    </form>
  );
}
