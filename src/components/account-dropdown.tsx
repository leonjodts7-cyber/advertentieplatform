"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, User as UserIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { UitloggenKnop } from "@/components/uitloggen-knop";
import { useTranslation } from "@/contexts/locale-context";
import { isProviderRole, type UserRole } from "@/lib/user-role";
import { cn } from "@/lib/utils";

interface AccountDropdownProps {
  user: User;
  role: UserRole;
  displayName?: string | null;
}

function roleLabel(t: (k: string) => string, role: UserRole): string {
  if (role === "admin") return t("account.roleAdmin");
  if (isProviderRole(role)) return t("account.roleProvider");
  return t("account.roleVisitor");
}

export function AccountDropdown({ user, role, displayName }: AccountDropdownProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const provider = isProviderRole(role);
  const email = user.email ?? "";
  const name = displayName?.trim() || email.split("@")[0] || t("account.menu");
  const initial = name.charAt(0).toUpperCase();

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
        className="account-dropdown__trigger account-dropdown__trigger--avatar"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="account-dropdown__avatar" aria-hidden>
          {initial}
        </span>
        <span className="account-dropdown__label account-dropdown__label--hide-mobile">
          {t("account.menu")}
        </span>
        <ChevronDown
          className={cn("account-dropdown__chevron", open && "account-dropdown__chevron--open")}
          aria-hidden
        />
      </button>

      {open && (
        <div className="account-dropdown__panel account-dropdown__panel--rich" role="menu">
          <div className="account-dropdown__profile">
            <span className="account-dropdown__avatar account-dropdown__avatar--lg" aria-hidden>
              {initial}
            </span>
            <div className="account-dropdown__profile-text">
              <p className="account-dropdown__name">{name}</p>
              <p className="account-dropdown__email" title={email}>
                {email}
              </p>
              <p className="account-dropdown__role">{roleLabel(t, role)}</p>
            </div>
          </div>
          <div className="account-dropdown__divider" />
          {provider && (
            <Link
              href="/dashboard"
              className="account-dropdown__item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <UserIcon className="h-4 w-4 opacity-60" aria-hidden />
              {t("nav.dashboard")}
            </Link>
          )}
          <Link
            href="/dashboard/instellingen"
            className="account-dropdown__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
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
