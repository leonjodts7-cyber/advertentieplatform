"use client";

import { useState } from "react";
import { ProfilePhotoPlaceholder } from "@/components/profile-photo-placeholder";
import type { AiCompanion } from "@/lib/ai-companions";
import { getCompanionImageSrc } from "@/lib/ai-companions";
import type { ProfilePhotoVariant } from "@/lib/home-preview-profielen";
import { cn } from "@/lib/utils";

interface CompanionVisualProps {
  companion: AiCompanion;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

export function CompanionVisual({
  companion,
  className,
  imgClassName,
  priority = false,
}: CompanionVisualProps) {
  const [failed, setFailed] = useState(false);
  const src = getCompanionImageSrc(companion);

  if (!src || failed) {
    return (
      <ProfilePhotoPlaceholder
        variant={companion.photoVariant as ProfilePhotoVariant}
        aspect="cover"
        className={cn(
          "companion-visual companion-visual--placeholder h-full w-full",
          className
        )}
      />
    );
  }

  return (
    <div className={cn("companion-visual", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${companion.naam} — fictieve AI companion op Veloura`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("companion-visual__img", imgClassName)}
        onError={() => setFailed(true)}
      />
      <div className="companion-visual__vignette" aria-hidden />
    </div>
  );
}
