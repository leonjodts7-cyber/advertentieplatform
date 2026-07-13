const SIGNALS_KEY = "veloura_interest_signals";

export interface InterestSignals {
  categories: Record<string, number>;
  cities: Record<string, number>;
  lastViewedAt: string | null;
}

const EMPTY: InterestSignals = {
  categories: {},
  cities: {},
  lastViewedAt: null,
};

function load(): InterestSignals {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(SIGNALS_KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as InterestSignals) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function persist(signals: InterestSignals) {
  localStorage.setItem(SIGNALS_KEY, JSON.stringify(signals));
}

export function recordListingInterest(input: {
  categorie?: string | null;
  stad?: string | null;
}) {
  const current = load();
  if (input.categorie) {
    current.categories[input.categorie] = (current.categories[input.categorie] ?? 0) + 1;
  }
  if (input.stad) {
    current.cities[input.stad] = (current.cities[input.stad] ?? 0) + 1;
  }
  current.lastViewedAt = new Date().toISOString();
  persist(current);
}

export function getTopInterestCategory(): string | null {
  const entries = Object.entries(load().categories);
  if (entries.length === 0) return null;
  return entries.sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export function getTopInterestCity(): string | null {
  const entries = Object.entries(load().cities);
  if (entries.length === 0) return null;
  return entries.sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export function getInterestSignals(): InterestSignals {
  return load();
}
