const SAVED_KEY = "veloura_saved_searches";
const MAX_SAVED = 8;

export interface SavedSearch {
  id: string;
  label: string;
  href: string;
  savedAt: string;
}

function loadAll(): SavedSearch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as SavedSearch[]) : [];
  } catch {
    return [];
  }
}

function persist(items: SavedSearch[]) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(items.slice(0, MAX_SAVED)));
}

export function getSavedSearches(): SavedSearch[] {
  return loadAll();
}

export function saveSearch(label: string, href: string): SavedSearch[] {
  const trimmed = label.trim();
  if (!trimmed || !href) return loadAll();

  const item: SavedSearch = {
    id: crypto.randomUUID(),
    label: trimmed,
    href,
    savedAt: new Date().toISOString(),
  };

  const prev = loadAll().filter((s) => s.href !== href);
  const next = [item, ...prev].slice(0, MAX_SAVED);
  persist(next);
  return next;
}

export function removeSavedSearch(id: string): SavedSearch[] {
  const next = loadAll().filter((s) => s.id !== id);
  persist(next);
  return next;
}

export function buildSearchLabel(params: URLSearchParams, fallback: string): string {
  const parts: string[] = [];
  const q = params.get("q");
  const stad = params.get("stad");
  const categorie = params.get("categorie");
  if (q) parts.push(q);
  if (stad) parts.push(stad);
  if (categorie) parts.push(categorie);
  return parts.length > 0 ? parts.join(" · ") : fallback;
}
