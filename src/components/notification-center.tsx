"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useTranslation } from "@/contexts/locale-context";
import { cn } from "@/lib/utils";

export interface AppNotification {
  id: string;
  title: string;
  body?: string;
  href?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationCenterProps {
  notifications: AppNotification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
}

export function NotificationCenter({
  notifications,
  onMarkRead,
  onMarkAllRead,
}: NotificationCenterProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="notification-center" ref={ref}>
      <button
        type="button"
        className="notification-center__trigger"
        aria-expanded={open}
        aria-label={t("notifications.title")}
        onClick={() => setOpen((o) => !o)}
      >
        <Bell className="h-4 w-4" aria-hidden />
        {unread > 0 && (
          <span className="notification-center__badge" aria-hidden>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-center__panel" role="dialog" aria-label={t("notifications.title")}>
          <div className="notification-center__head">
            <h2 className="notification-center__title">{t("notifications.title")}</h2>
            {unread > 0 && onMarkAllRead && (
              <button type="button" className="notification-center__mark-all" onClick={onMarkAllRead}>
                {t("notifications.markAllRead")}
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="notification-center__empty">{t("notifications.empty")}</p>
          ) : (
            <ul className="notification-center__list">
              {notifications.map((n) => (
                <li key={n.id}>
                  {n.href ? (
                    <Link
                      href={n.href}
                      className={cn(
                        "notification-center__item",
                        !n.read && "notification-center__item--unread"
                      )}
                      onClick={() => {
                        onMarkRead?.(n.id);
                        setOpen(false);
                      }}
                    >
                      <span className="notification-center__item-title">{n.title}</span>
                      {n.body && <span className="notification-center__item-body">{n.body}</span>}
                    </Link>
                  ) : (
                    <div
                      className={cn(
                        "notification-center__item",
                        !n.read && "notification-center__item--unread"
                      )}
                    >
                      <span className="notification-center__item-title">{n.title}</span>
                      {n.body && <span className="notification-center__item-body">{n.body}</span>}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
