"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
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
  const [laden, setLaden] = useState(false);

  async function handleUitloggen() {
    setLaden(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleUitloggen}
        disabled={laden}
        className="header-nav-link rounded-full px-2.5 py-1.5 text-[0.8125rem] font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] whitespace-nowrap shrink-0"
      >
        {laden ? "Bezig…" : "Uitloggen"}
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
      {laden ? "Bezig…" : "Uitloggen"}
    </Button>
  );
}
