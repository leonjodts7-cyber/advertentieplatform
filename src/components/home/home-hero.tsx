import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="discovery-hero">
      <div className="container">
        <div className="discovery-hero__content animate-fade-in">
          <p className="discovery-hero__eyebrow">
            Alleen 18+ · Geverifieerd · Discreet
          </p>
          <h1 className="discovery-hero__title">
            Vind jouw perfecte match in jouw regio
          </h1>
          <p className="discovery-hero__subtitle">
            Ontdek geverifieerde profielen voor privé ontvangst, escort, massage,
            video en meer.
          </p>
          <div className="discovery-hero__actions">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/zoeken">Zoek profielen</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/zoeken">Ontdek categorieën</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
