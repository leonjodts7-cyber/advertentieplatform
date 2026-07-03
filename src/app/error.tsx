"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/locale-context";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {t("errors.errorTitle")}
      </p>
      <h1 className="font-display mt-3 text-2xl text-foreground">{t("errors.errorTitle")}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("errors.errorText")}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={reset}>
          {t("errors.errorCta")}
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">{t("errors.goHome")}</Link>
        </Button>
      </div>
    </div>
  );
}
