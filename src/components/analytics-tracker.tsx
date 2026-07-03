"use client";

import { useEffect } from "react";

const SESSION_KEY = "veloura_analytics_session";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function trackAnalyticsEvent(
  eventType: string,
  advertentieId: string,
  metadata?: Record<string, unknown>
) {
  const sessionId = getSessionId();
  void fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, advertentieId, sessionId, metadata }),
    keepalive: true,
  }).catch(() => {
    /* silent — table may not exist yet */
  });
}

interface AnalyticsTrackerProps {
  advertentieId: string;
  eventType: string;
}

export function AnalyticsTracker({ advertentieId, eventType }: AnalyticsTrackerProps) {
  useEffect(() => {
    trackAnalyticsEvent(eventType, advertentieId);
  }, [advertentieId, eventType]);

  return null;
}

interface ContactTrackLinkProps {
  href: string;
  advertentieId: string;
  eventType: string;
  className?: string;
  children: React.ReactNode;
}

export function ContactTrackLink({
  href,
  advertentieId,
  eventType,
  className,
  children,
}: ContactTrackLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackAnalyticsEvent(eventType, advertentieId)}
    >
      {children}
    </a>
  );
}
