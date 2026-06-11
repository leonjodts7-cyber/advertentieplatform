"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface ZoekFormulierProps {
  standaardStad?: string;
  compact?: boolean;
  inputId?: string;
}

export function ZoekFormulier({
  standaardStad = "",
  compact = false,
  inputId = "stad",
}: ZoekFormulierProps) {
  const router = useRouter();
  const [stad, setStad] = useState(standaardStad);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (stad.trim()) {
      params.set("stad", stad.trim());
    }
    router.push(`/zoeken${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        compact
          ? "flex flex-col gap-3 sm:flex-row sm:items-stretch"
          : "flex flex-col gap-4 sm:flex-row sm:items-end"
      }
    >
      <div className={compact ? "flex-1" : "w-full sm:flex-1"}>
        {!compact && (
          <label htmlFor={inputId} className="form-label">
            Stad
          </label>
        )}
        <Input
          id={inputId}
          name="stad"
          placeholder="Bijv. Antwerpen"
          value={stad}
          onChange={(e) => setStad(e.target.value)}
        />
      </div>
      <Button type="submit" size={compact ? "md" : "lg"} className="shrink-0 sm:min-w-[120px]">
        Zoeken
      </Button>
    </form>
  );
}
