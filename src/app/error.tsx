"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        Er ging iets mis
      </p>
      <h1 className="font-display mt-3 text-2xl text-foreground">
        Pagina kon niet worden geladen
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Probeer het opnieuw of ga terug naar de homepage.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={reset}>
          Opnieuw proberen
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">Naar home</Link>
        </Button>
      </div>
    </div>
  );
}
