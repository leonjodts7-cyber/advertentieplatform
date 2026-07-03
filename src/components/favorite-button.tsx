"use client";

import { useRouter, usePathname } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { useFavorites } from "@/contexts/favorites-context";
import { useTranslation } from "@/contexts/locale-context";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  advertentieId: string;
  variant?: "card" | "inline";
  disabled?: boolean;
  className?: string;
}

export function FavoriteButton({
  advertentieId,
  variant = "card",
  disabled = false,
  className,
}: FavoriteButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { isLoggedIn, isFavorited, isLoading, toggleFavorite } = useFavorites();

  const favorited = isFavorited(advertentieId);
  const loading = isLoading(advertentieId);
  const isDisabled = disabled || loading;
  const ariaLabel = favorited ? t("listing.ariaRemove") : t("listing.ariaSave");

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (isDisabled) return;

    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    await toggleFavorite(advertentieId);
  }

  if (variant === "inline") {
    return (
      <button
        type="button"
        className={cn(
          "favorite-button favorite-button--inline",
          favorited && "favorite-button--inline-active",
          isDisabled && "favorite-button--disabled",
          className
        )}
        aria-label={ariaLabel}
        aria-pressed={favorited}
        disabled={isDisabled}
        onClick={handleClick}
      >
        {loading ? (
          <Loader2 className="favorite-button__icon animate-spin" aria-hidden />
        ) : (
          <Heart
            className="favorite-button__icon"
            fill={favorited ? "currentColor" : "none"}
            aria-hidden
          />
        )}
        <span>{favorited ? t("listing.saved") : t("listing.save")}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "carousel-listing-card__fav favorite-button favorite-button--card",
        favorited && "carousel-listing-card__fav--active",
        isDisabled && "favorite-button--disabled",
        className
      )}
      aria-label={ariaLabel}
      aria-pressed={favorited}
      disabled={isDisabled}
      onClick={handleClick}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
      ) : (
        <Heart
          className="h-3.5 w-3.5"
          fill={favorited ? "currentColor" : "none"}
          aria-hidden
        />
      )}
    </button>
  );
}
