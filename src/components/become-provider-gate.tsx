"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setUserRole } from "@/lib/user-role-client";
import { useTranslation } from "@/contexts/locale-context";

interface BecomeProviderGateProps {
  needsUpgrade: boolean;
  children: React.ReactNode;
}

export function BecomeProviderGate({ needsUpgrade, children }: BecomeProviderGateProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!needsUpgrade) return;
    let cancelled = false;

    async function upgrade() {
      setUpgrading(true);
      const { error: err } = await setUserRole("provider");
      if (cancelled) return;
      if (err) {
        setError(err);
        setUpgrading(false);
        return;
      }
      router.refresh();
    }

    void upgrade();
    return () => {
      cancelled = true;
    };
  }, [needsUpgrade, router]);

  if (!needsUpgrade) return <>{children}</>;

  if (error) {
    return (
      <div className="become-provider-gate">
        <p className="login-alert login-alert--error">{error}</p>
      </div>
    );
  }

  return (
    <div className="become-provider-gate">
      <p className="text-sm text-[#a89a92]">
        {upgrading ? t("roleChoice.upgrading") : t("roleChoice.upgrading")}
      </p>
    </div>
  );
}
