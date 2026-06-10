import type { AdvertentieStatus } from "@/lib/types";

export function formatPrijs(bedrag: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(bedrag);
}

export function statusLabel(status: AdvertentieStatus): string {
  const labels: Record<AdvertentieStatus, string> = {
    concept: "Concept",
    in_review: "In beoordeling",
    actief: "Actief",
    gearchiveerd: "Gearchiveerd",
  };
  return labels[status];
}

export function beschikbaarLabel(beschikbaar: boolean): string {
  return beschikbaar ? "Beschikbaar" : "Niet beschikbaar";
}
