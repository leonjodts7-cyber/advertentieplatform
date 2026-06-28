import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gebruiksvoorwaarden",
  description: "Gebruiksvoorwaarden van Veloura.",
};

export default function VoorwaardenPage() {
  return (
    <div className="container py-10 sm:py-14">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-champagne-light"
      >
        ← Terug naar Veloura
      </Link>
      <h1 className="section-title mt-4">Gebruiksvoorwaarden</h1>
      <div className="prose prose-invert mt-6 max-w-2xl space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Veloura is een platform voor volwassenen (18+). Door een account aan te
          maken ga je akkoord met deze voorwaarden en bevestig je dat je
          wettelijk meerderjarig bent.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Advertenties moeten accuraat, legaal en respectvol zijn.</li>
          <li>Geen misleidende content, spam of inbreuk op rechten van derden.</li>
          <li>AI Lounge-companions zijn fictieve personages, geen echte personen.</li>
          <li>Credits voor AI-chat zijn niet restitueerbaar na gebruik.</li>
          <li>Veloura kan accounts of advertenties modereren of verwijderen bij misbruik.</li>
        </ul>
        <p>
          Vragen? Mail naar{" "}
          <a
            href="mailto:support@veloura.be"
            className="text-champagne-light hover:underline"
          >
            support@veloura.be
          </a>
          .
        </p>
      </div>
    </div>
  );
}
