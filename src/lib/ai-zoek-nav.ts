import type { ParsedZoekFilters } from "@/lib/zoek-filters";
import { parsedFiltersToParams } from "@/lib/zoek-filters";

export async function fetchAiZoekParams(query: string): Promise<URLSearchParams> {
  const trimmed = query.trim();
  const fallback = new URLSearchParams();
  fallback.set("ai", "1");
  if (trimmed) fallback.set("q", trimmed);

  if (!trimmed) return fallback;

  try {
    const res = await fetch("/api/ai/zoek", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: trimmed }),
    });
    if (!res.ok) return fallback;
    const data = (await res.json()) as { filters?: ParsedZoekFilters };
    const params = parsedFiltersToParams(data.filters ?? {});
    params.set("ai", "1");
    if (trimmed && !params.get("q")) params.set("q", trimmed);
    return params;
  } catch {
    return fallback;
  }
}
