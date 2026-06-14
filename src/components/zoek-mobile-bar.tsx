"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

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
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#74665f]" />
        <Input
          variant="light"
          placeholder="Zoek op stad..."
          value={stad}
          onChange={(e) => setStad(e.target.value)}
          className="pl-9"
          disabled={isPending}
        />
      </form>
      <Link
        href="/zoeken"
        className="inline-flex h-11 min-h-[44px] shrink-0 items-center justify-center rounded-xl border border-[#e6d8cf] bg-[#fffaf6] px-3 text-[#7b2f49]"
        aria-label="Filters"
      >
        <SlidersHorizontal className="h-4 w-4" />
      </Link>
    </div>
  );
}
