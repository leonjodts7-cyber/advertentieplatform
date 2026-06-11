import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-champagne">
        404
      </p>
      <h1 className="font-display mt-4 text-3xl font-medium text-foreground sm:text-4xl">
        Pagina niet gevonden
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        De pagina die je zoekt bestaat niet of is niet meer beschikbaar.
      </p>
      <Button asChild className="mt-8" size="lg">
        <Link href="/zoeken">Naar advertenties</Link>
      </Button>
    </div>
  );
}
