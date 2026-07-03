"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { UitloggenKnop } from "@/components/uitloggen-knop";
import { useTranslation } from "@/contexts/locale-context";
import { isProviderRole, type UserRole } from "@/lib/user-role";
import { cn } from "@/lib/utils";

interface AccountDropdownProps {
  user: User;
  role: UserRole;
}

export function AccountDropdown({ user, role }: AccountDropdownProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const provider = isProviderRole(role);
  const email = user.email ?? "";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="account-dropdown" ref={ref}>
      <button
        type="button"
        className="account-dropdown__trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="account-dropdown__label">{t("account.menu")}</span>
        <ChevronDown className={cn("account-dropdown__chevron", open && "account-dropdown__chevron--open")} aria-hidden />
      </button>

      {open && (
        <div className="account-dropdown__panel" role="menu">
          <p className="account-dropdown__email" title={email}>
            {email}
          </p>
          <div className="account-dropdown__divider" />
          {provider && (
            <Link href="/dashboard" className="account-dropdown__item" role="menuitem" onClick={() => setOpen(false)}>
              {t("nav.dashboard")}
            </Link>
          )}
          {!provider && (
            <Link href="/favorieten" className="account-dropdown__item" role="menuitem" onClick={() => setOpen(false)}>
              {t("nav.favorites")}
            </Link>
          )}
          <Link href="/dashboard/instellingen" className="account-dropdown__item" role="menuitem" onClick={() => setOpen(false)}>
            {t("account.settings")}
          </Link>
          <div className="account-dropdown__logout">
            <UitloggenKnop className="w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
