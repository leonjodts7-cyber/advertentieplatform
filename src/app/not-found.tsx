import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        404
      </p>
      <h1 className="font-display mt-3 text-3xl text-foreground">
        Pagina niet gevonden
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        De pagina die je zoekt bestaat niet of is niet meer beschikbaar.
      </p>
      <Button asChild className="mt-8" size="lg">
        <Link href="/zoeken">Naar advertenties</Link>
      </Button>
    </div>
  );
}
