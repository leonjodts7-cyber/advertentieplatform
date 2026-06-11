import { Coins, MessageCircle, Sparkles, Users } from "lucide-react";
import { AI_COMPANIONS, CREDITS_PER_BERICHT } from "@/lib/ai-companions";

export function AiLoungeStats() {
  const stats = [
    {
      icon: Users,
      label: `${AI_COMPANIONS.length} companions online`,
    },
    {
      icon: Coins,
      label: `${CREDITS_PER_BERICHT} credits per bericht`,
    },
    {
      icon: MessageCircle,
      label: "Direct chatten na aankoop",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-panel flex items-center gap-3 p-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-champagne/20 bg-champagne/10">
            <stat.icon className="h-4 w-4 text-champagne-light" />
          </div>
          <p className="text-sm font-medium text-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export function AiLoungeCreditsInfo() {
  return (
    <div className="glass-panel p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-champagne" />
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-champagne-light">
              {CREDITS_PER_BERICHT} credits per bericht
            </strong>{" "}
            — elk antwoord van een companion kost credits.
          </p>
          <p>
            <strong className="text-foreground">Geen gratis chat.</strong> Koop
            credits om gesprekken te starten.
          </p>
        </div>
      </div>
    </div>
  );
}
