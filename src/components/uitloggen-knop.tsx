"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/locale-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function UitloggenKnop({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [laden, setLaden] = useState(false);

  async function handleUitloggen() {
    setLaden(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const label = laden ? t("nav.logoutLoading") : t("nav.logout");

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleUitloggen}
        disabled={laden}
        className={cn("header-btn header-btn--outline", className)}
      >
        {label}
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleUitloggen}
      disabled={laden}
      className={cn("w-full sm:w-auto", className)}
    >
      {label}
    </Button>
  );
}
