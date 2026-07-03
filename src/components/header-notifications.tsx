"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  NotificationCenter,
  type AppNotification,
} from "@/components/notification-center";
import { useTranslation } from "@/contexts/locale-context";
import { isProviderRole, type UserRole } from "@/lib/user-role";

const STORAGE_KEY = "veloura_notifications_read";

const NOTIFICATION_TYPE_KEYS: Record<string, string> = {
  newFavorite: "notifications.newFavorite",
  premiumExpiring: "notifications.premiumExpiring",
  boostExpiring: "notifications.boostExpiring",
  favoriteAvailable: "notifications.favoriteAvailable",
  newPremium: "notifications.newPremium",
};

interface ApiNotification {
  id: string;
  type: string;
  body?: string;
  href?: string;
  read: boolean;
  createdAt: string;
}

interface HeaderNotificationsProps {
  user: User;
  role: UserRole;
}

function mapNotification(t: (k: string) => string, n: ApiNotification): AppNotification {
  const key = NOTIFICATION_TYPE_KEYS[n.type] ?? "notifications.title";
  return {
    id: n.id,
    title: t(key),
    body: n.body,
    href: n.href,
    read: n.read,
    createdAt: n.createdAt,
  };
}

export function HeaderNotifications({ user, role }: HeaderNotificationsProps) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setReadIds(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
  }, []);

  const persistRead = useCallback((ids: Set<string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const items: AppNotification[] = [];

      if (isProviderRole(role)) {
        try {
          const res = await fetch("/api/notifications");
          if (res.ok) {
            const data = (await res.json()) as ApiNotification[];
            items.push(...data.map((n) => mapNotification(t, n)));
          }
        } catch {
          /* optional API */
        }
      } else {
        try {
          const favRes = await fetch("/api/favorieten");
          if (favRes.ok) {
            const favData = (await favRes.json()) as { ids?: string[] };
            if ((favData.ids?.length ?? 0) > 0) {
              items.push({
                id: "fav-tip",
                title: t("notifications.favoriteAvailable"),
                body: t("favorites.subtitle"),
                href: "/favorieten",
                read: readIds.has("fav-tip"),
                createdAt: new Date().toISOString(),
              });
            }
          }
        } catch {
          /* ignore */
        }

        items.push({
          id: "premium-new",
          title: t("notifications.newPremium"),
          href: "/zoeken?premium_profiel=true",
          read: readIds.has("premium-new"),
          createdAt: new Date().toISOString(),
        });
      }

      if (!cancelled) {
        setNotifications(
          items.map((n) => ({ ...n, read: n.read || readIds.has(n.id) }))
        );
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [user.id, role, t, readIds]);

  function markRead(id: string) {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      persistRead(next);
      return next;
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllRead() {
    const allIds = new Set(notifications.map((n) => n.id));
    setReadIds(allIds);
    persistRead(allIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <NotificationCenter
      notifications={notifications}
      onMarkRead={markRead}
      onMarkAllRead={markAllRead}
    />
  );
}
