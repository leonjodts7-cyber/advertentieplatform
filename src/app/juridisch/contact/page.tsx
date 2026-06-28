import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Neem contact op met Veloura.",
};

export default function ContactPage() {
  return (
    <div className="container py-10 sm:py-14">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-champagne-light"
      >
        ← Terug naar Veloura
      </Link>
      <h1 className="section-title mt-4">Contact</h1>
      <div className="glass-panel mt-6 max-w-lg space-y-4 p-6 sm:p-8">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Heb je een vraag over je account, advertentie of credits? We helpen je
          graag verder.
        </p>
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Algemeen: </span>
            <a
              href="mailto:support@veloura.be"
              className="font-medium text-champagne-light hover:underline"
            >
              support@veloura.be
            </a>
          </p>
          <p>
            <span className="text-muted-foreground">Privacy: </span>
            <a
              href="mailto:privacy@veloura.be"
              className="font-medium text-champagne-light hover:underline"
            >
              privacy@veloura.be
            </a>
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          We reageren doorgaans binnen 2 werkdagen.
        </p>
      </div>
    </div>
  );
}
