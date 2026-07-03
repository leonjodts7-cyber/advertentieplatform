const STORAGE_KEY = "veloura_recent_bekeken";
const MAX_ITEMS = 20;

export function getRecentBekekenIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function addRecentBekeken(advertentieId: string): void {
  if (typeof window === "undefined" || !advertentieId) return;
  try {
    const current = getRecentBekekenIds().filter((id) => id !== advertentieId);
    const next = [advertentieId, ...current].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable
  }
}
