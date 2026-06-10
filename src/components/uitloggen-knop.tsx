"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UitloggenKnop() {
  const router = useRouter();
  const [laden, setLaden] = useState(false);

  async function handleUitloggen() {
    setLaden(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleUitloggen}
      disabled={laden}
    >
      {laden ? "Bezig..." : "Uitloggen"}
    </Button>
  );
}
