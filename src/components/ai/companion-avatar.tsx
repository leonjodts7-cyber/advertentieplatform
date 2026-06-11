import { cn } from "@/lib/utils";
import type { AiCompanion } from "@/lib/ai-companions";

type CompanionAvatarSize = "sm" | "md" | "lg" | "card";

interface CompanionAvatarProps {
  companion: AiCompanion;
  size?: CompanionAvatarSize;
  showInitials?: boolean;
  className?: string;
}

const sizeClasses: Record<CompanionAvatarSize, string> = {
  sm: "h-10 w-10 rounded-full text-sm",
  md: "h-14 w-14 rounded-xl text-base",
  lg: "h-20 w-20 rounded-2xl text-xl",
  card: "aspect-[3/4] w-full rounded-none text-4xl sm:text-5xl",
};

export function CompanionAvatar({
  companion,
  size = "card",
  showInitials = true,
  className,
}: CompanionAvatarProps) {
  const initial = companion.naam.charAt(0);

  return (
    <div
      className={cn(
        "companion-avatar relative overflow-hidden",
        sizeClasses[size],
        className
      )}
      data-companion={companion.id}
      style={{ "--avatar-accent": companion.avatarAccent } as React.CSSProperties}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          companion.avatarGradient
        )}
      />

      {/* Luxury grid overlay */}
      <div className="companion-avatar__grid absolute inset-0 opacity-[0.07]" />

      {/* Radial glow */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 30%, ${companion.avatarAccent}44, transparent 70%)`,
        }}
      />

      {/* Silhouette */}
      <div className="companion-avatar__silhouette absolute inset-0 flex items-end justify-center pb-[8%]">
        <div className="relative flex flex-col items-center">
          <div
            className="rounded-full border border-white/10 bg-black/20 backdrop-blur-[1px]"
            style={{
              width: size === "card" ? "28%" : "45%",
              aspectRatio: "1",
              boxShadow: `0 0 40px ${companion.avatarAccent}33`,
            }}
          />
          <div
            className="-mt-[2%] rounded-t-[50%] border border-white/8 bg-black/15"
            style={{
              width: size === "card" ? "55%" : "70%",
              height: size === "card" ? "35%" : "30%",
            }}
          />
        </div>
      </div>

      {/* Bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08070a]/95 via-[#08070a]/20 to-transparent" />

      {/* Initials watermark */}
      {showInitials && size === "card" && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-display text-white/[0.06] select-none">
          {initial}
        </span>
      )}

      {showInitials && size !== "card" && (
        <span className="absolute inset-0 flex items-center justify-center font-display font-medium text-white/80">
          {initial}
        </span>
      )}

      {/* Photo-ready frame hint */}
      {size === "card" && (
        <div className="absolute inset-x-4 top-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
    </div>
  );
}
