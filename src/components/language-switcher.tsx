"use client";

import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n/config";
import { useTranslation } from "@/contexts/locale-context";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  compact?: boolean;
  className?: string;
}

export function LanguageSwitcher({ compact = false, className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      className={cn(
        "lang-switcher",
        compact && "lang-switcher--compact",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className={cn(
            "lang-switcher__btn",
            locale === code && "lang-switcher__btn--active"
          )}
          onClick={() => setLocale(code as Locale)}
          aria-pressed={locale === code}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
