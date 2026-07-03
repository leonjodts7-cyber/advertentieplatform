"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/locale-context";
import { setUserRole } from "@/lib/user-role-client";
import { isProviderRole, type UserRole } from "@/lib/user-role";
import { cn } from "@/lib/utils";

interface RoleChoicePanelProps {
  onComplete?: () => void;
}

export function RoleChoicePanel({ onComplete }: RoleChoicePanelProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<UserRole>("visitor");
  const [laden, setLaden] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  async function handleContinue() {
    setLaden(true);
    setFout(null);
    const { error } = await setUserRole(selected);
    if (error) {
      setFout(error);
      setLaden(false);
      return;
    }
    onComplete?.();
    router.push(isProviderRole(selected) ? "/dashboard/advertenties/nieuw" : "/zoeken");
    router.refresh();
  }

  return (
    <div className="role-choice">
      <h1 className="login-card__title font-display text-2xl text-foreground">
        {t("roleChoice.title")}
      </h1>
      <p className="login-card__subtitle mt-2 text-sm text-muted-foreground">
        {t("roleChoice.subtitle")}
      </p>

      <div className="role-choice__options mt-5">
        <button
          type="button"
          className={cn("role-choice__option", selected === "visitor" && "role-choice__option--active")}
          onClick={() => setSelected("visitor")}
        >
          <span className="role-choice__option-title">{t("roleChoice.visitor")}</span>
          <span className="role-choice__option-desc">{t("roleChoice.visitorDesc")}</span>
        </button>
        <button
          type="button"
          className={cn("role-choice__option", selected === "provider" && "role-choice__option--active")}
          onClick={() => setSelected("provider")}
        >
          <span className="role-choice__option-title">{t("roleChoice.provider")}</span>
          <span className="role-choice__option-desc">{t("roleChoice.providerDesc")}</span>
        </button>
      </div>

      {fout && (
        <p className="login-alert login-alert--error mt-4" role="alert">
          {fout}
        </p>
      )}

      <Button type="button" className="mt-5 w-full" size="lg" disabled={laden} onClick={() => void handleContinue()}>
        {laden ? t("auth.loading") : t("roleChoice.continue")}
      </Button>
    </div>
  );
}
