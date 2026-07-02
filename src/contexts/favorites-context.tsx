"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface FavoritesContextValue {
  isLoggedIn: boolean;
  isFavorited: (advertentieId: string) => boolean;
  isLoading: (advertentieId: string) => boolean;
  toggleFavorite: (advertentieId: string) => Promise<boolean>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

interface FavoritesProviderProps {
  children: React.ReactNode;
  initialIds?: string[];
  isLoggedIn: boolean;
}

export function FavoritesProvider({
  children,
  initialIds = [],
  isLoggedIn,
}: FavoritesProviderProps) {
  const [ids, setIds] = useState<Set<string>>(() => new Set(initialIds));
  const [loadingIds, setLoadingIds] = useState<Set<string>>(() => new Set());

  const isFavorited = useCallback(
    (advertentieId: string) => ids.has(advertentieId),
    [ids]
  );

  const isLoading = useCallback(
    (advertentieId: string) => loadingIds.has(advertentieId),
    [loadingIds]
  );

  const toggleFavorite = useCallback(
    async (advertentieId: string): Promise<boolean> => {
      if (!isLoggedIn) return false;

      const wasFavorited = ids.has(advertentieId);
      setLoadingIds((prev) => new Set(prev).add(advertentieId));
      setIds((prev) => {
        const next = new Set(prev);
        if (wasFavorited) next.delete(advertentieId);
        else next.add(advertentieId);
        return next;
      });

      try {
        const res = wasFavorited
          ? await fetch(
              `/api/favorieten?advertentie_id=${encodeURIComponent(advertentieId)}`,
              { method: "DELETE" }
            )
          : await fetch("/api/favorieten", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ advertentie_id: advertentieId }),
            });

        if (!res.ok) {
          throw new Error("Favoriet opslaan mislukt");
        }

        return !wasFavorited;
      } catch {
        setIds((prev) => {
          const next = new Set(prev);
          if (wasFavorited) next.add(advertentieId);
          else next.delete(advertentieId);
          return next;
        });
        return wasFavorited;
      } finally {
        setLoadingIds((prev) => {
          const next = new Set(prev);
          next.delete(advertentieId);
          return next;
        });
      }
    },
    [ids, isLoggedIn]
  );

  const value = useMemo(
    () => ({
      isLoggedIn,
      isFavorited,
      isLoading,
      toggleFavorite,
    }),
    [isLoggedIn, isFavorited, isLoading, toggleFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
}
