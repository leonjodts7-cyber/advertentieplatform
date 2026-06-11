import { cn } from "@/lib/utils";
import type { ProfilePhotoVariant } from "@/lib/home-preview-profielen";

interface ProfilePhotoPlaceholderProps {
  variant?: ProfilePhotoVariant;
  className?: string;
  aspect?: "portrait" | "cover";
}

export function ProfilePhotoPlaceholder({
  variant = "warm-wine",
  className,
  aspect = "portrait",
}: ProfilePhotoPlaceholderProps) {
  return (
    <div
      className={cn(
        "profile-photo relative overflow-hidden",
        aspect === "portrait" ? "aspect-[3/4]" : "aspect-[16/10] sm:aspect-[21/9]",
        className
      )}
      data-photo-variant={variant}
    >
      <div className="profile-photo__base absolute inset-0" />
      <div className="profile-photo__light absolute inset-0" />
      <div className="profile-photo__silhouette absolute inset-0 flex items-end justify-center pb-[6%]">
        <div className="profile-photo__figure" />
      </div>
      <div className="profile-photo__vignette absolute inset-0" />
    </div>
  );
}
