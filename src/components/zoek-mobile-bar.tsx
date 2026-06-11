"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { ZoekFilterBar } from "@/components/zoek-filter-bar";
import { Search } from "lucide-react";

export function ZoekMobileBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [stad, setStad] = useState(searchParams.get("stad") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = stad.trim();
    if (trimmed) params.set("stad", trimmed);
    else params.delete("stad");
    startTransition(() => {
      router.push(`/zoeken?${params.toString()}`);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <form onSubmit={handleSubmit} className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Zoek op stad..."
          value={stad}
          onChange={(e) => setStad(e.target.value)}
          className="pl-9"
          disabled={isPending}
        />
      </form>
      <ZoekFilterBar variant="drawer" />
    </div>
  );
}
