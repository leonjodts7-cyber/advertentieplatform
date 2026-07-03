"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/locale-context";

export function NotFoundContent() {
  const { t } = useTranslation();

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">404</p>
      <h1 className="font-display mt-3 text-3xl text-foreground">{t("errors.notFoundTitle")}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">{t("errors.notFoundText")}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">{t("errors.goHome")}</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/zoeken">{t("nav.search")}</Link>
        </Button>
      </div>
    </div>
  );
}
