import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacybeleid",
  description: "Privacybeleid van Veloura.",
};

export default function PrivacyPage() {
  return (
    <div className="container py-10 sm:py-14">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-champagne-light"
      >
        ← Terug naar Veloura
      </Link>
      <h1 className="section-title mt-4">Privacybeleid</h1>
      <div className="prose prose-invert mt-6 max-w-2xl space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Veloura respecteert je privacy. We verwerken alleen gegevens die nodig
          zijn voor het platform: accountgegevens, advertentie-inhoud, betalingen
          via Stripe en AI Lounge-gesprekken.
        </p>
        <p>
          Gegevens worden opgeslagen bij Supabase (EU-regio waar van toepassing).
          Je kan je account en advertenties beheren via het dashboard. Voor
          vragen over je gegevens:{" "}
          <a
            href="mailto:privacy@veloura.be"
            className="text-champagne-light hover:underline"
          >
            privacy@veloura.be
          </a>
          .
        </p>
        <p className="text-xs">
          Laatste update: {new Date().getFullYear()}. Alleen 18+.
        </p>
      </div>
    </div>
  );
}
