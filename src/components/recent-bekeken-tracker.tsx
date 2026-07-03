"use client";

import { useEffect } from "react";
import { addRecentBekeken } from "@/lib/recent-bekeken";

interface RecentBekekenTrackerProps {
  advertentieId: string;
}

export function RecentBekekenTracker({ advertentieId }: RecentBekekenTrackerProps) {
  useEffect(() => {
    addRecentBekeken(advertentieId);
  }, [advertentieId]);

  return null;
}
